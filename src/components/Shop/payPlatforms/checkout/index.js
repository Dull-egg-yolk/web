/* eslint-disable */
import { importThirdUri, formatZero, line2Hump, openOtherPayUrl, trigger, triggerService, getSubtractio } from '@/util/shop';
import { createOrder, getUserCardList } from '@/api/shop';
import Cookie from 'js-cookie';
import router from '@/router';
import store from '@/store';
import {getCallbackUrl} from '@/util/shop'
import Notice from '@/components/Shop/notice';
import i18n from '@/i18n';
import mada from '@/util/mada';
import Toast from '@/components/toast'
import loading from '../../spin/loading';
const context = require.context('@/assets/img/shop/card-icons/', true, /\.(png|jpg|svg)$/);

const jsUrl = baseConfig.env === 'prod' ? 'https://cdn.checkout.com/js/checkout.js' : 'https://cdn.checkout.com/sandbox/js/checkout.js';
const frameSdk = baseConfig.env === 'prod' ? 'https://cdn.checkout.com/js/framesv2.min.js' : 'https://cdn.checkout.com/js/framesv2.min.js';
window.Frames = null;
// checkout 区分平台账号，改为配置化取环境变量
const publicKey = baseConfig.checkoutKey;
let _submitFlag = false;
console.log('public key:', publicKey);
const checkoutAMEXCurrency = ['AUD', 'CAD', 'CHF', 'JPY', 'NZD', 'USD', 'SGD', 'GBP', 'HKD', 'EUR'];
/**
 * 创建订单
 * @param data
 */
const subHandler = function (data = {}) {
  const option = Object.assign({}, data);
  console.log('submit order', option);
  if (baseConfig.NODE_ENV === 'development') {
    // option.noCrypt = true
  }
  option.ext.name && (option.ext.name = option.ext.name.trim());
  option.ext.email && (option.ext.email = option.ext.email.trim());
  console.log(option, '--option-----');
  // return
  // 创建订单

  createOrder(option)
    .then(data => {
      // bancontact 比利时,multibanco 葡萄牙, p24 波兰, eps 支付 奥地利
      loading.hide()
      const channels = ['bancontact', 'multibanco', 'p24', 'eps'];
      // redirect 订单付款, 跳转到三方页面
      if (channels.includes(option.payChannel) && data.ext && data.ext.data._links.redirect.href) {
        trigger('eps order success');
        openOtherPayUrl(data.ext.data._links.redirect.href);
        return;
      }

      // 如果是信用卡，forter验证不通过
      if (option.payChannel === 'card' && !data) {
        trigger('forter not approved');
        const title = i18n.t('payFailedAndRetry');
        Notice({
          type: 'error',
          title,
          onConfirm () {
            window.location.reload();
          }
        });
        return;
      }

      // 3ds信用卡重定向地址
      if (option.payChannel === 'card' && data.ext && data.ext.data.status === 'Pending') {
        trigger('checkout card order 3ds redirect');
        triggerService({ eventId: '14-1-1-81', channelCode: `${option.channelName}+${option.thirdPaymentChannelCode}` });
        openOtherPayUrl(`${data.ext.data.links.redirect.href}`);
        return;
      }
      const {completePaymentUrl} = getCallbackUrl()
      // 卡下单超时或失败
      if (option.payChannel === 'card' && !data.ext && data.orderId) {
        trigger('checkout card order timeout');
        window.location.replace(`${completePaymentUrl}&OrderId=${data.orderId}&isLoop=1`);
        return;
      }

      // 信用卡授权成功
      if (option.payChannel === 'card' && data.ext && data.ext.data.status === 'Authorized') {
        trigger('checkout card order was approved');
        triggerService({ eventId: '14-1-1-82', channelCode: `${option.channelName}+${option.thirdPaymentChannelCode}` });
        window.location.replace(`${completePaymentUrl}&OrderId=${data.orderId}&isLoop=1`);
        return;
      }

      // 信用卡授权失败
      if (option.payChannel === 'card' && data && data.ext && data.ext.data.status === 'Decline') {
        trigger('checkout card order not approved');
        Notice({
          type: 'error',
          title: 'Credit card certification does not pass',
          onConfirm () {
            window.location.reload();
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      loading.hide()
      trigger('checkout create order error');
    })
    .finally(() => {
      // Spin.hide();
      _submitFlag = false;
    });
};

/**
 * 信用卡、银行卡smart_fields提交服务器
 * @param token
 */
export default {
  _data: null, // 传送过来的数据
  _cardToken: null, // 卡生成的token
  _cardTokenObj: {},
  isCardValid: false, // 信用卡填写的是否正确
  cardValidFrames: {}, // 信用卡三个字段验证
  /**
     * 入口介入方法
     * @param data 传递的数据
     * @param hasDepend  是否有依赖
     * @returns {Promise<default>}
     */
  async pay (data, hasDepend) {
    this._data = data;
    this._install(data, hasDepend);
    return Promise.resolve(true);
  },
  /**
     * 获取渠道需要填字段
     */
  getFields () {
    let fields = {};
    // 表单字段
    if (this._data.payChannel === 'card') {
      fields = {
        name: {
          required: true
        },
        email: {
          required: true
        },
        card: {
          required: true
        }
      };
      return fields;
    }
    if (this._data.payChannel === 'bancontact' || this._data.payChannel === 'multibanco') {
      fields = {
        name: {
          required: true
        }
      };
      return fields;
    }

    if (this._data.payChannel === 'p24') {
      fields = {
        name: {
          required: true
        },
        email: {
          required: true
        }
      };
      return fields;
    }
  },
  /**
     * 提交到服务器
     * @private
     */
  async handleSubmit (data) {
    if (_submitFlag) {
      return;
    }
    data.ext.name && (data.ext.name = data.ext.name.trim());
    data.ext.email && (data.ext.email = data.ext.email.trim());
    this._data = data;
    console.log('支付平台接收到', data);
    // sourceId 支付
    if (data.ext.payType === 'sourceId') {
      // 提交订单
      this._handleFramesCard();
      return true;
    }

    // bancontact 比利时,multibanco 葡萄牙, p24 波兰 渠道支付
    const channels = ['bancontact', 'multibanco', 'p24'];
    if (channels.includes(data.payChannel)) {
      trigger(data.payChannel + 'submit');
      this._redirectPay(data);
      return;
    }

    // 信用卡支付
    if (data.payChannel === 'card') {
      if (!this.cardValidFrames.cardNumber) {
        trigger('checkout cardNumber invalid');
        Toast({
          html: i18n.messages[i18n.locale].shop.sureCardInfo
        })
        return true;
      }
      if (!this.cardValidFrames.expiryDate) {
        trigger('checkout card expiryDate invalid');
        Toast({
          html: i18n.messages[i18n.locale].shop.sureCardInfo
        })
        return true;
      }
      if (!this.cardValidFrames.cvv) {
        trigger('checkout card cvv invalid');
        Toast({
          html: i18n.messages[i18n.locale].shop.sureCardInfo
        })
        return true;
      }
      if (!this.isCardValid) {
        // TODO source
        triggerService({ eventId: '14-2-4-2', channelName: data.channelName, status: 2, source: data.pageSource }); // 点击"确认支付“ 信用卡验证结果 1成功， 2失败
        trigger('checkout card invalid');
        Toast({
          html: i18n.messages[i18n.locale].shop.sureCardInfo
        })
        return true;
      }
      loading.show();
      console.log('开始创建token');
      // 卡片生成token
      const token = await this._createToken();
      console.log('token 创建成功');
      trigger('checkout card token success');
      // 不支持AMERICAN EXPRESS的货币，提示用户
      if (this._cardTokenObj.scheme === 'AMERICAN EXPRESS' && checkoutAMEXCurrency.indexOf(data.currency) === -1) {
        Notice({
          type: 'error',
          title: 'Please use Visa or Mastercard',
          onConfirm () {
            window.location.reload();
          }
        });
        loading.hide();
        return;
      }
      const cards = ['Visa', 'Mastercard', 'AMERICAN EXPRESS', 'Discover'];
      if (cards.indexOf(this._cardTokenObj.scheme) === -1) {
        Notice({
          type: 'error',
          title: 'Card certification does not pass, please use Visa, Mastercard or Amex',
          onConfirm () {
            window.location.reload();
          }
        });
        triggerService({ eventId: '14-1-1-85', channelCode: `${data.channelName}+${data.thirdPaymentChannelCode}`, cardTokenType: `${this._cardTokenObj.card_type} + ${this._cardTokenObj.scheme}` });
        // trigger('checkout card is not Visa Or Mastercard', { cardName: this._cardTokenObj.scheme, cardType: this._cardTokenObj.card_type });
        loading.hide();
        return;
      }
      triggerService({ eventId: '14-2-4-2', channelName: data.channelName, status: 1, source: data.pageSource }); // 点击"确认支付“ 信用卡验证结果 1成功， 2失败
      triggerService({ eventId: '14-1-1-79', channelCode: `${data.channelName}+${data.thirdPaymentChannelCode}`, cardTokenType: `${this._cardTokenObj.card_type} + ${this._cardTokenObj.scheme}` });
      // trigger('form pass checkout create order', { cardType: this._cardTokenObj.card_type, cardName: this._cardTokenObj.scheme });
      // 提交订单

      this._handleFramesCard(token);
    }
  },

  /**
     * 是否 otherID 登录的
     */
  _whetherOtherId () {
    const userLoginSource = JSON.parse(localStorage.getItem('trackLogin') || '{}')[getSubtractio(this._data.userId)];

    // 如果输入otherId的登录方式
    return userLoginSource === '4';
  },
  /**
     * 获取当前用户的卡列表
     * @returns Array
     */
  async _getCardList () {
    const option = {
      userId: this._data.userId,
      companyCode: this._data.companyCode
    };
    let cardList = [];
    // 如果是使用 otherID 则直接返回空列表
    if (this._whetherOtherId()) {
      return cardList;
    } else {
      cardList = await getUserCardList(option) || [];
      return cardList;
    }
  },
  /**
     * 跳转到form表单页面
     * @private
     */
  _goCardList (data) {
    router.push({
      name: 'cardList',
      query: {
        ...data,
        useCommonForm: false, // 是否使用公共form
        formSource: 'checkout',
        formComponentName: 'checkout',
        hasDepend: false
      }
    });
  },
  /**
     * 跳转到form表单页面
     * @private
     */
  _goForm (data) {
    router.push({
      name: 'paymentInfoAdd',
      query: {
        ...data,
        useCommonForm: false, // 是否使用公共form
        formSource: 'checkout',
        formComponentName: 'checkout',
        hasDepend: true
      }
    });
  },
  /**
     * 使用支付方式
     * @returns {Promise<any>}
     * @private
     */
  async _install (data, hasDepend) {
    // bancontact 比利时,multibanco 葡萄牙, p24 波兰
    const channels = ['bancontact', 'multibanco', 'p24'];

    if (channels.includes(data.payChannel)) {
      this._goForm(data);
    }

    // eps 支付 奥地利
    if (data.payChannel === 'eps') {
      this._redirectPay(data);
      return false;
    }

    // 信用卡支付
    if (data.payChannel === 'card') {
      this._cardPay(data, hasDepend);
      return false;
    }
  },
  /**
     * forter data
     * @private
     */
  async _forterData () {
    let bigV;
    const userInfo = store.state.app.userInfo; // 大V配置基数
    /* let userMoney = userInfo.money
        let userLevel = userInfo.userLevel
        let bigVMoney = store.state.app.bigV.money
        console.log('bigVMoney', bigVMoney)

        // 如果没有获取过大V, 请求大V基数配置
        if (typeof bigVMoney === 'undefined' || typeof bigVMoney === 'string') {
            bigV = await getBigvSetting(userInfo.id) // 获取大V基数配置
            bigVMoney = bigV.money
            store.commit('SET_BIGV', bigV)
        }
        console.log('bigVMoney', bigVMoney)
        // 获得等级
        let tag = getLeval(userMoney, bigV.money, userLevel) */
    const tag = userInfo.userLevel > 0 ? 'VIP' : 'GUEST';
    console.log('tag', tag);
    console.log(this._data, '-----data');
    const forter = {
      orderType: 'WEB', // 前端传
      connectionInformation: {
        forterTokenCookie: Cookie.get('forterToken'), // forterToken， 前端传
        forterMobileUID: '', // app传
        merchantDeviceIdentifier: Cookie.get('deviceId'),
        mobileAppVersion: '', // app传
        mobileOSType: '', // app传
        mobileDeviceBrand: '', // app传
        mobileDeviceModel: '', // app传
        fullHeaders: '', // server端获取
      },
      payment: [
        {
          creditCard: {
            nameOnCard: this._data.ext.name, // 必传，前端赋值 pre-auth
            bin: this._data.ext.bin || this._cardTokenObj.bin, // 必传, 前端赋值
            lastFourDigits: this._data.ext.lastFourDigits || this._cardTokenObj.last4.toString(), // 必传，前端赋值 pre-auth
            expirationMonth: formatZero(this._data.ext.expiryMonth, 2) || formatZero(this._cardTokenObj.expiry_month, 2).toString(), // 必传，前端赋值 pre-auth
            expirationYear: this._data.ext.expiryYear || this._cardTokenObj.expiry_year.toString(), // 必传，前端赋值 pre-auth
            cardType: this._cardTokenObj.card_type === 'Credit' ? 'CREDIT' : 'DEBIT', // 必传，前端赋值 pre-auth
            countryOfIssuance: this._data.ext.issuerCountry || this._cardTokenObj.issuer_country, // 必传，前端赋值 pre-auth
            fingerprint: '', // server端传
            cardBrand: this._data.ext.paymentType || this._cardTokenObj.scheme, // 卡名称，前端赋值 pre-auth
            cardBank: this._data.ext.issuer || this._cardTokenObj.issuer, // 发卡行，前端赋值 pre-auth
            paymentGatewayData: {
              gatewayName: this._data.companyCode, // 支付公司名称，前端赋值
              gatewayTransactionId: '', // server端传，渠道交易id post-auth
              gatewayMerchantId: '', // server端 渠道商户id post-auth
              integrationType: 'iframe', // 集成方式
              authorizationStep: 'pre-authorization' // 请求认证类型 pre-authorization or post-authorization
            }
          }
        }
      ],
      accountOwner: {
        firstName: '', // 根据渠道要求，前端传
        lastName: '', // 根据渠道要求，前端传
        email: this._data.ext.email, // 前端必传
        accountId: this._data.userId, // server赋值 用户id
      },
      customerAccountData: {
        type: tag, // 用户等级。前端传
        merchantAccountStatus: 'open', // 用户状态 默认 open
        status: 'ACTIVE'
      },
      additionalIdentifiers: {
        merchant: {
          merchantId: '', // 可选，商户id
          merchantDomain: baseConfig.domain, // 可选， 前端web必传
          merchantName: baseConfig.appName === 'Vivah' ? 'LivU' : baseConfig.appName // 可选， 前端必传应用名称
        },
        siteLocalization: { // 可选， 网站本地语言信息，前端传
          country: this._data.country, // 可选，国家编码 前端传
          language: navigator.language.split('-')[0], // 浏览器语言
          currency: this._data.currency // 可选，货币 前端传
        }
      }
    };
    if (this._data.ext.payType === 'sourceId') {
      forter.payment[0].tokenizedCard = {
        token: this._data.ext.sourceId, // 必传，前端传
        nameOnCard: this._data.ext.name, // 必传，前端赋值 pre-auth
        bin: this._data.ext.bin || this._cardTokenObj.bin, // 必传, 前端赋值
        lastFourDigits: this._data.ext.lastFourDigits || this._cardTokenObj.last4.toString(), // 必传，前端赋值 pre-auth
        expirationMonth: formatZero(this._data.ext.expiryMonth, 2) || formatZero(this._cardTokenObj.expiry_month, 2).toString(), // 必传，前端赋值 pre-auth
        expirationYear: this._data.ext.expiryYear || this._cardTokenObj.expiry_year.toString(), // 必传，前端赋值 pre-auth
        cardType: this._data.ext.cardType, // 必传，前端赋值 pre-auth
        countryOfIssuance: this._data.ext.issuerCountry || '', // 必传，前端赋值 pre-auth
        fingerprint: '', // server端传
        cardBrand: this._data.ext.paymentType || '', // 卡名称，前端赋值 pre-auth
        cardBank: this._data.ext.issuer || '', // 发卡行，前端赋值 pre-auth
        paymentGatewayData: {
          gatewayName: 'Checkout', // 支付公司名称，前端赋值
          gatewayTransactionId: '', // server端传，渠道交易id post-auth
          gatewayMerchantId: '', // server端 渠道商户id post-auth
          integrationType: 'iframe', // 集成方式
          authorizationStep: 'pre-authorization' // 请求认证类型 pre-authorization or post-authorization
        }
      };
    }
    return forter;
  },
  /**
     * 卡 checkout.js 集成初始化
     * @param
     * @param data 数据
     */
  async _initConfig (data) {
    // 集成安装checkout.js
    await importThirdUri(document, 'script', 'checkoutSdk', jsUrl);
    Checkout.configure({
      publicKey: publicKey,
      customerEmail: data.ext.email,
      value: data.price,
      currency: data.currency,
      paymentMode: 'cards',
      cardFormMode: 'cardTokenisation',
      cardTokenised: this._handleCard
    });
    Checkout.open();
  },
  /**
     * 初始化 fremes 脚本与配置
     * @returns {Promise<void>}
     * @private
     */
  async _initFrameConfig () {
    const _this = this;
    // 集成安装framesv2.js
    const framesDown = await importThirdUri(document, 'script', 'frameSdk', frameSdk);
    var logos = generateLogos();
    function generateLogos () {
      var logos = {};
      logos['card-number'] = {
        src: 'card'
      };
      logos['expiry-date'] = {
        src: 'exp-date'
      };
      logos.cvv = {
        src: 'cvv'
      };
      return logos;
    }
    function showPaymentMethodIcon (parent, pm) {
      if (parent) parent.classList.add('show');

      var logo = document.getElementById('logo-payment-method');
      if (pm) {
        var name = pm.toLowerCase();
        var img = context(`./${name}.svg`);
        logo.setAttribute('src', img);
      }
      logo.style.removeProperty('display');
    }

    function clearPaymentMethodIcon (parent) {
      if (parent) parent.classList.remove('show');

      var logo = document.getElementById('logo-payment-method');
      logo.style.setProperty('display', 'none');
    }

    function setDefaultIcon (el) {
      var selector = 'icon-' + el;
      var logo = document.getElementById(selector);
      var img = context(`./${logos[el].src}.svg`);
      // var img = require("~static/img/card-icons/" + logos[el].src + ".svg")
      logo.setAttribute('src', img);
    }

    function clearErrorIcon (el) {
      var logo = document.getElementById('icon-' + el + '-error');
      logo.style.removeProperty('display');
    }

    function setDefaultErrorIcon (el) {
      var selector = 'icon-' + el;
      var logo = document.getElementById(selector);
      var img = context(`./${logos[el].src}-error.svg`);
      // var img = require("~static/img/card-icons/" + logos[el].src + "error.svg")
      logo.setAttribute('src', img);
    }

    function setErrorIcon (el) {
      var logo = document.getElementById('icon-' + el + '-error');
      logo.style.setProperty('display', 'block');
    }
    function paymentMethodChanged (event) {
      var pm = event.paymentMethod;
      const container = document.querySelector('.icon-container.payment-method');
      if (!pm) {
        clearPaymentMethodIcon(container);
      } else {
        showPaymentMethodIcon(container, pm);
      }
    }
    let initTrue = false;
    const initFrame = () => {
      const cardNumber = document.getElementById('card-number');
      const cardExp = document.getElementById('card-exp');
      const cardCvv = document.getElementById('card-cvv');
      if (cardNumber && cardExp && cardCvv && framesDown && Frames && !initTrue) {
        console.log('初始化', Frames);
        initTrue = true;
        // 初始化
        Frames.init({
          publicKey: publicKey,
          style: {

          }
        });

        // 监听信用卡填写
        Frames.addEventHandler(
          Frames.Events.CARD_VALIDATION_CHANGED,
          function (event) {
            console.log('card change', event);
            _this.cardValidFrames = event.isElementValid;
            _this.isCardValid = Frames.isCardValid(); // 是否有效或认证通过
          }
        );
        // 监听卡号变化
        Frames.addEventHandler(
          Frames.Events.PAYMENT_METHOD_CHANGED,
          paymentMethodChanged
        );
        /**
                 * 卡字段有变化时监听
                 */
        Frames.addEventHandler(
          Frames.Events.FRAME_VALIDATION_CHANGED,
          function onValidationChanged (event) {
            var e = event.element;
            var key = line2Hump(e);
            _this.cardValidFrames[key] = event.isValid; // 具体是卡的哪个字段没验证通过
            if (event.isValid || event.isEmpty) {
              if (e === 'card-number' && !event.isEmpty) {
                showPaymentMethodIcon();
              }
              setDefaultIcon(e);
            } else {
              if (e === 'card-number') {
                clearPaymentMethodIcon();
              }
              setDefaultErrorIcon(e);
            }
          }
        );

        Frames.addEventHandler(
          Frames.Events.CARD_TOKENIZATION_FAILED,
          function onCardTokenizationFailed (error) {
            console.log('CARD_TOKENIZATION_FAILED: %o', error);
            Frames.enableSubmitForm();
          }
        );

        Frames.addEventHandler(
          Frames.Events.CARD_TOKENIZED,
          function (event) {

          }
        );
      } else {
        const t = setTimeout(() => {
          if (initTrue) {
            clearTimeout(t);
            return;
          }
          initFrame();
        }, 500);
      }
    };
    initFrame();
  },
  /**
     * 卡片创建token
     */
  _createToken () {
    return new Promise((resolve, reject) => {
      // 监听token生成
      Frames.addEventHandler(
        Frames.Events.CARD_TOKENIZED,
        event => {
          console.log('token', event);
          this._cardTokenObj = event;
          resolve(event.token);
        }
      );

      Frames.submitCard(); // 提交卡片生成token
    });
  },
  /**
     * checkout.js 卡认证生成token 回调
     * @param event
     * @private
     */
  _handleCard (event) {
    this._cardToken = event.data.cardToken;
    const checkoutSource = {
      type: 'token',
      token: this._cardToken
    };
    const payInfo = localStorage.getItem('payInfo') ? JSON.parse(localStorage.getItem('payInfo')) : {};
    payInfo.checkoutSource = checkoutSource;
    const orderData = Object.assign({}, payInfo);
    console.log('orderData', orderData);
    subHandler(this._cardToken, orderData);
  },
  /**
     * frames 生成token
     * @param event
     * @private
     */
  async _handleFramesCard (token = '') {
    const bin = this._data.ext.bin || this._cardTokenObj.bin;
    // 非 sourceId 支付
    if (this._data.ext.payType !== 'sourceId') {
      this._cardToken = token;
      this._data.ext.token = token;
    }
    // 不支持AMERICAN EXPRESS的货币，提示用户
    if ((this._data.ext.paymentType === 'AMERICAN EXPRESS' || this._data.ext.paymentType === 'AMEX') && checkoutAMEXCurrency.indexOf(this._data.currency) === -1) {
      Notice.error({
        title: 'Please use Visa or Mastercard',
        onConfirm () {
          window.location.reload();
        }
      });
      return;
    }
    let cardType = mada.includes(bin) ? 'mada' : '';

    // todo: 只在测试环境使用上线前删除
    const env = baseConfig.NODE_ENV === 'production' ? 'prod' : 'test';
    if (bin === '519999' && env === 'test') {
      cardType = 'mada';
    }

    this._data.ext.cardType = cardType;
    this._data.email = this._data.ext.email;
    this._data.ext.forterData = await this._forterData();
    const {completePaymentUrl, errorPaymentUrl} = getCallbackUrl()
    this._data.ext.completePaymentUrl = `${completePaymentUrl}`;
    this._data.ext.errorPaymentUrl = `${errorPaymentUrl}`;

    _submitFlag = true;
    subHandler(this._data);
  },
  /**
     * redirect 方式，不需要走 fotor 直接跳三方的支付渠道
     * eps 奥地利国家使用
     * bancontact 比利时
     * multibanco 葡萄牙
     * p24 波兰 渠道支付
     * @private
     */
  _redirectPay (data, hasDepend) {
    if (_submitFlag) {
      return;
    }

    data.companyCode = data.companyCode + '-' + data.payChannel;
    if (!data.ext) {
      data.ext = {};
    }
    const {completePaymentUrl, errorPaymentUrl} = getCallbackUrl()
    data.ext.completePaymentUrl = `${completePaymentUrl}`;
    data.ext.errorPaymentUrl = `${errorPaymentUrl}`;
    _submitFlag = true;
    subHandler(data);
  },
  /**
     * 信用卡支付
     * @returns {Promise<void>}
     * @private
     */
  async _cardPay (data, hasDepend) {
    // 有依赖脚本
    if (hasDepend && data.payChannel === 'card') {
      // 初始化 checkout.js 集成
      // this._initConfig(data)

      // 初始化 frames 集成
      await this._initFrameConfig(data);
    } else {
      if (data.routeName === 'cardList') {
        return;
      }
      const cardList = await this._getCardList();
      if (cardList.length < 1) {
        this._goForm(data);
      } else {
        this._goCardList(data);
      }
    }
  }
};

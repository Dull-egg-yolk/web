/*
 ideal支付
 */
import { createOrder, getBankListByCountry } from '@/api/shop';
import store from '@/store';
import router from '@/router';
import Notice from '../../notice';
// import { trigger } from '@/utils/statisticalTool';
import { openOtherPayUrl, getCallbackUrl } from '@/util/shop';
import loading from '../../spin/loading';
/**
 * 获取可用银行列表
 */
const imgUrl = 'https://h5-static.livuchat.com/images/ideal/';
const findBankListByCountry = async (params = {}) => {
  try {
    const list = await getBankListByCountry(params);
    list.forEach(item => {
      item.status = 1;
      item.type = 'ideal';
      item.image = imgUrl + item.bic + '.png';
    });
    return list;
  } catch (e) {
  }
};

export default {
  async pay (params, hasDepend) {
    this._dispatch(params, hasDepend);
    return Promise.resolve(true);
  },
  _submitFlag: false,
  /**
     * 调度各方法
     * @private
     */
  async _dispatch (data, hasDepend) {
    let methodFlag;
    console.log('channel pay', data);
    // 如果一级渠道直接带method code, 先检测该method code 是否可
    if (!hasDepend && !data.thirdPaymentChannelCode && Number(data.isMultistage) !== 0) {
      Notice.error({
        title: 'thirdPaymentChannelCode does not exist',
        onConfirm () {
        }
      });
    }

    //  如果isMultistage为1，跳二级method渠道页面选择
    if (!hasDepend && Number(data.isMultistage) === 0) {
      this._goPaymentMethodsList(data);
    }
  },
  /**
     * 跳转到支付方式列表页面
     * @private
     */
  _goPaymentMethodsList (data) {
    router.push({
      name: 'paymentMethodsList',
      query: {
        ...data,
        useCommonForm: false, // 是否使用公共form, 使用ideal自己的
        formSource: 'ideal',
        formComponentName: 'ideal',
        hasDepend: true
      }
    });
  },
  /**
     * 跳转到表单页面
     * @private
     */
  _goForm (data) {
    console.log('go form');
    router.push({
      name: 'paymentInfoAdd',
      query: {
        ...data,
        useCommonForm: false, // 使用ideal自己的渠道
        formSource: 'ideal',
        formComponentName: 'ideal',
        hasDepend: true
      }
    });
  },
  /**
     * bank transfer
     * @param params
     * @param hasDepend
     * @returns {Promise<void>}
     * @private
     */
  async _orderPay (params, hasDepend) {
    try {
      if (this._submitFlag) {
        return;
      }
      const { completePaymentUrl, errorPaymentUrl } = getCallbackUrl();
      params.appId = store.state.app.appId;
      params.platformType = store.state.app.platformType;
      params.ext = {
        ...params.formData,
        completePaymentUrl,
        errorPaymentUrl,
        type: params.thirdPaymentChannelCode,
        bic: params.bic
      };

      this._submitFlag = true;
      loading.show();
      const data = await createOrder(params);
      loading.hide();
      this._submitFlag = false;
      //   trigger('ideal order response');
      const result = data && data.ext && data.ext.data;
      if (result && result.status === 'Pending') {
        // window.location.href = result._links.redirect.href
        openOtherPayUrl(result._links.redirect.href);
        // trigger('ideal go redirect url');
      }
    } catch (e) {
    }
  },
  /**
     * 获取支付方式列表
     * @param params
     * @returns {Promise<*|void>}
     */
  async getBankListByCountry (params) {
    const option = {
      appId: baseConfig.appType,
      country: params.country,
      currency: params.currency,
      isMultistage: params.isMultistage || 0
    };
    if (params.thirdPaymentChannelCode) {
      option.method = params.thirdPaymentChannelCode;
    }
    const methodsRes = await findBankListByCountry(option);

    console.log('methodsRes', methodsRes);
    // 如果返回的是数据列表
    if (Array.isArray(methodsRes)) {
      return methodsRes;
    }

    // 如果存在thirdPaymentChannelCode，检测通过
    if (methodsRes === 1) {
      return 1;
    }
    console.log('methodsRes', methodsRes);
    // 如果渠道不可用, 检测本地存储并删除
    if (methodsRes && methodsRes.code === 20002) {
    //   trigger('ideal payment method disabled', {
    //     method: params.thirdPaymentChannelCode
    //   });
    //   Notice.error({
    //     title: 'This channel has been disabled',
    //     onConfirm () {
    //     }
    //   });
      return false;
    }
  },
  /**
     * 获取需要填写的字段 此渠道不对字段做校验，直接返回空即可
     * @param type
     * @returns {Promise<*|void>}
     */
  async getRequireFields (type = '') {
    return [];
  },
  /**
     * 现金支付，下单后跳转到步骤页面
     * @private
     */
  _goInstructions (data) {
    console.log('跳转现金描述');
    // 本地存储现金支付显示的数据
    sessionStorage.setItem('cashInstructions', JSON.stringify(data));
    router.replace({ name: 'cashInstructions' });
  }
};

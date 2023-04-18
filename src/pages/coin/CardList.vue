<template>
      <div class="coin-page"  @click.stop="() => {}" ref="coinPage">
    <!-- mobile 给移动端的页面title -->
    <div class="mb-title new-shop flex-row-vc" v-if="!query.isIframe">
      <div class="actions l fx-c">
        <span class="icon-arrow" @click.stop="closeBtn"></span>
      </div>
      <div class="title l fx-v">
           <!-- 金币 -->
          <div class="side-coin hover">
            <div class="coin-wrap fx-be-vc">
              <strong>{{ userInfo.goldNum }}</strong>
            </div>
          </div>
      </div>
    </div>

    <span class="btn-back hover" @click.stop="closeBtn">
      <span class="icon-cross"></span>
    </span>
    <div :class="['inner', query.isIframe ? 'paddingTop0':'' ]">
        <div class="info-add-wrap">
        <div class="position-fixed coin-full-height full-height scroll-y card-bg" v-if="currCard.sourceId">
            <section class="">
                <div class="order-info">
                    <div class="pay-title">{{$t('shop.orderDetail')}}</div>
                    <p class="pay-item">
                        <span>{{$t('shop.coinsAmount')}}</span>
                        <span class="coins"> {{payData.coins}}</span>
                    </p>
                    <p class="line"></p>
                    <div class="pay-detaile" :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'">
                        <p class="pay-item">
                            <span>{{$t('shop.beneficiary')}}</span>
                            <span>{{this.appName}}</span>
                        </p>

                        <p class="pay-item">
                            <span>{{$t('shop.orderAmount')}}</span>
                            <span class="price">{{payData.currencyMark + ' ' + payData.price}}</span>
                        </p>
                        <div class="pay-item">
                            <span>{{$t('shop.emaillAddress')}}</span>
                            <span class="email flex-c-c">
                            <input id="email" name="email" class="order-input" type="text" required autocomplete="email" :placeholder="$t('shop.pleaseInput')+$t('shop.emaillAddress')" v-model="currCard.email" @click="clickEmailInput">
                            <label for="email"><i class="rc-icon rc-edit"></i></label>
                        </span>
                        </div>
                    </div>
                </div>
                <div class="grey-bg gap18"></div>
                <div class="order-card" v-if="currCard.sourceId">
                    <div class="cell-item" @click="showCardList">
                    <span v-if="isMada(currCard.bin)" class="card-title">
                        <img src="@/assets/img/shop/new/card-mada.png" class="card-img" alt/>
                        <span>{{currCard.cardType}} Card ({{currCard.lastFourDigits}})</span>
                    </span>
                        <span class="card-title" v-else>
                        <img src="@/assets/img/shop/new/card-master.png" class="card-img" alt v-if="currCard.paymentType === 'MASTERCARD'" />
                        <img src="@/assets/img/shop/new/card-visa.png" class="card-img" alt v-if="currCard.paymentType === 'VISA'"/>
                        <img src="@/assets/img/shop/new/card-amex.png" class="card-img" alt v-if="currCard.paymentType === 'AMEX'"/>
                       <img src="@/assets/img/shop/card-icons/discover.svg?resize=w45" class="card-img" alt v-if="currCard.paymentType === 'Discover' || currCard.paymentType === 'DISCOVER'"/>
                        <span>{{currCard.cardType}} Card ({{currCard.lastFourDigits}})</span>
                    </span>
                        <span class="rc-icon angle-right-gray"></span>
                    </div>
                </div>
                <form class="template-style source-id-form" v-if="query.formComponentName === 'dlocal'">
                    <fieldset>
                        <div class="field" v-if="query.payMethod === 'payCardDocument' && noRequireDocuments.indexOf(query.country) === -1">
                            <label for="document">{{documentText}}<span class="required-style">*</span></label>
                            <div class="input-container">
                                <input id="document" type="text" required autocomplete="tel" :placeholder="$t('shop.pleaseInput')+ documentText" v-model="formData.document">
                                <div class="icon-container" @click="showCardInfo('document')">
                                    <img height="16px" src="@/assets/img/shop/card-icons/error.svg"/>
                                </div>
                            </div>
                        </div>
                        <template v-if="query.country === 'IN'">
                            <div class="field">
                                <label for="cvv">{{$t('shop.cardCvv')}}<span class="required-style">*</span></label>
                                <div class="input-container cvv card-style" id="field-cvv">
                                    <div class="icon-container">
                                        <img height="16px" class="icon-nomal" src="@/assets/img/shop/card-icons/cvv.svg" alt="CVV" />
                                        <img height="16px" class="icon-error" src="@/assets/img/shop/card-icons/cvv-error.svg" alt="CVV" />
                                    </div>
                                    <div id="cvv-only" class="cvv-frame"></div>
                                    <div class="icon-container" @click="showCardInfo('cvv')">
                                        <img height="16px" src="@/assets/img/shop/card-icons/error.svg"/>
                                    </div>
                                </div>
                            </div>
                            <div class="field">
                                <label for="city">City<span class="required-style">*</span></label>
                                <input id="city" type="text" required v-model="formData.city" :placeholder="$t('shop.pleaseInput')+ 'City'">
                            </div>
                            <div class="field" >
                                <label for="street">Street<span class="required-style">*</span></label>
                                <input id="street" type="text" required v-model="formData.street" :placeholder="$t('shop.pleaseInput')+ 'Street'">
                            </div>
                            <div class="field">
                                <label for="Number">Number<span class="required-style">*</span></label>
                                <input id="Number" type="text" required v-model="formData.number" :placeholder="$t('shop.pleaseInput')+ 'Number'">
                            </div>
                        </template>
                    </fieldset>
                </form>
                <div class="order-button" v-if="currCard.sourceId">
                    <button @click.prevent="handleSubmit" class="pay-btn rc-shape rc-purple">{{$t('shop.surePay')}} {{payData.currencyMark + ' ' + payData.price}}</button>
                </div>
                <div class="order-footer">
                <div class="secure-text"> <img src="https://h5.livuchat.com/staticProd/web-pay-service/img/suozi2.png"/> {{$t('shop.secureTips2')}}</div>
                    <p class="flex-c-c secure-img">
                        <span><img src="@/assets/img/shop/new/forter.jpg" alt=""></span>
                    </p>
                </div>
            </section>
            <rc-popup :visible="cardShow" :mask="true" class="popup-card" v-if="cardShow" @on-close="cardShow=false">
                <div class="popup-title">{{$t('shop.selectPaymentCard')}}</div>
                <div class="popup-body">
                    <div class="order-card">
                        <rc-cell-swipe
                            v-for="(item,index) in cardList"
                            :key="item.lastFourDigits"
                            @click.native="setCurrentCard(index)"
                            :right="[
                        {
                        content: 'Delete',
                        style: { background: '#E02020', color: '#fff', fontSize: '14px' },
                        handler: () => {showConfirm(index)}
                        }
                    ]"
                        >
                            <div class="cell-item">
                            <span v-if="isMada(item.bin)" class="card-title">
                                <img src="@/assets/img/shop/new/card-mada.png" class="card-img" alt/>
                                <span>{{item.cardType}} Card ({{item.lastFourDigits}})</span>
                            </span>
                                <span class="card-title" v-else>
                                <img src="@/assets/img/shop/new/card-master.png" class="card-img" alt v-if="item.paymentType === 'MASTERCARD'" />
                                <img src="@/assets/img/shop/new/card-visa.png" class="card-img" alt v-if="item.paymentType === 'VISA'"/>
                                <img src="@/assets/img/shop/new/card-amex.png?resize=w45" class="card-img" alt v-if="item.paymentType === 'AMEX'"/>
                                    <img src="@/assets/img/shop/card-icons/discover.svg?resize=w45" class="card-img" alt v-if="item.paymentType === 'Discover' || item.paymentType === 'DISCOVER'"/>
                                <span>{{item.cardType}} Card ({{item.lastFourDigits}})</span>
                            </span>
                                <span class="rc-icon icon-checked" v-if="item.sourceId === currCard.sourceId"></span>
                            </div>
                        </rc-cell-swipe>
                    </div>

                    <div class="new-card" @click="clickNewCard"><span class="icon-add"></span><span>{{$t('shop.addBankCard')}}</span></div>
                </div>
            </rc-popup>
            <Modal v-model="isShowTextInfo" :footer-hide="true" class="confirm-box" :iconShow="false" @on-cancel="isShowTextInfo=false">
                <div class="text-box">
                    <h3 class="info-title">Confirmation</h3>
                    <p>Are you sure you want to remove “{{delCard.cardType}} Card ({{delCard.lastFourDigits}})” from the list?</p>
                </div>
                <div slot="close"></div>
                <div class="footer-btn">
                    <p><button class="rc-shape rc-purple rc-ok" @click="removeCard">Confirm</button></p>
                    <p><button class="btn-text" @click="cancelRemove">Cancel</button></p>
                </div>
            </Modal>
            <Modal v-model="isShowInfo" :footer-hide="true" class-name="rc-info-id card-info" @maskEvent="isShowInfo=false" @on-cancel="isShowInfo=false">
                <img :src="`~/../static/img/card-icons/card-${currIcon}.png`">
                <template v-slot:close>
                    <span class="card-close"></span>
                </template>
            </Modal>
        </div>
        <SpinView color="black" v-if="spinShow"></SpinView>
    </div>
    </div>
  </div>

</template>

<script>
import { choosePay } from '@/components/Shop/payPlatforms/index';
import { mapState } from 'vuex';
import { getEmailVerify, getSubtractio, triggerService, trigger } from '@/util/shop';
import rcPopup from '@/components/Shop/popup/popup';
import Modal from '@/components/Shop/modal/index';
import rcCellSwipe from '@/components/Shop/swipeCell/index.js';
import { getUserCardList, deleteUserCard, findPayExtParams } from '@/api/shop';
import mada from '@/util/mada';
export default {
  name: 'cardList',
  components: {
    rcPopup,
    Modal,
    rcCellSwipe
  },
  data () {
    return {
      formComponent: '',
      query: { ...this.$route.query, routeName: this.$route.name },
      spinShow: false,
      payObj: {},
      appName: '',
      cardShow: false,
      cardList: [],
      currCard: {}, // 当前卡信息
      isShowTextInfo: false, // 是否显示删除弹窗
      delIndex: 0, // 要删除的卡索引
      delCard: {
        cardType: '',
        lastFourDigits: ''
      }, // 要删除的卡信息
      isShowInfo: false,
      currIcon: '',
      formData: {
        document: '',
        cvvToken: '',
        city: '',
        street: '',
        number: '',
      },
      noRequireDocuments: ['ID', 'MX', 'PE', 'CL', 'BO', 'EC', 'NG', 'PY', 'ZA', 'UY', 'EG', 'MA', 'TR']
    };
  },
  computed: {
    country () {
      return this.payObj && this.payObj._data.country;
    },
    documentText () {
      const document = this.payObj.getDocument();
      const text = document && document.text;
      return text || 'Document';
    },
    ...mapState({
      userInfo: (state) => state.app.userInfo,
    }),
  },
  methods: {
    /**
             * 显示卡字段说明信息
             */
    showCardInfo (type) {
      // document 字段后的图标点击只支持以下国家
      const counties = ['IN', 'ID', 'AR', 'BR'];
      if (type === 'document') {
        if (counties.includes(this.country)) {
          this.isShowInfo = true;
          this.currIcon = this.country;
        }
      } else {
        this.isShowInfo = true;
        this.currIcon = type;
      }
    },
    /**
             * 根据支付公司、渠道查询填过的表单
             * @param data
             * @returns {Promise<void>}
             */
    async queryFormParams (data) {
      const option = {
        userId: data.userId,
        companyCode: data.companyCode,
        payChannel: data.payChannel
      };
      const formParams = await findPayExtParams(option);

      // 回显填过的表单
      if (formParams && formParams.exParams) {
        const data = JSON.parse(formParams.exParams);
        if (typeof data.country === 'string') {
          data.country = JSON.parse(data.country);
        }
        this.formData.name = data.name;
        this.formData.document = data.document;
        this.formData.city = data.city;
        this.formData.street = data.street;
        this.formData.number = data.number;
        // 不需要document的国家移除document必填项
        if (this.noRequireDocuments.indexOf(data.country) !== -1) {
          delete this.formData.document;
        }
      }
    },
    /**
             * 是否otherID登录的
             */
    whetherOtherId () {
      const userLoginSource = JSON.parse(localStorage.getItem('trackLogin') || '{}')[getSubtractio(this.payData.userId)];

      // 如果输入otherId的登录方式
      return userLoginSource === '4';
    },
    /**
             * 获取当前用户的卡列表
             * @returns {Promise<void>}
             */
    async getCardList () {
      const option = {
        userId: this.payData.userId,
        companyCode: this.payData.companyCode
      };
      this.cardList = await getUserCardList(option) || [];
      if (this.whetherOtherId() || this.cardList.length < 1) {
        // 此处必须使用 replace
        await this.$router.replace({
          name: 'paymentInfoAdd',
          query: Object.assign({}, this.$route.query, { hasDepend: true })
        });
        return;
      }
      triggerService({ eventId: '14-2-5-1' }); // 信用卡列表展示信息页面曝光
      this.cardList.forEach(item => { item.paymentType = item.paymentType.toLocaleUpperCase(); });
      this.currCard = this.cardList[0] || {};
    },

    /**
             * 到表单提交页面
             */
    toForm () {
      const query = Object.assign({}, this.$route.query, { hasDepend: true, pageSource: 2 });

      if (this.$route.query.companyCode === 'dlocal') {
        const params = Object.keys(query).map(function (key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(query[key]);
        }).join('&');
        window.open(`/infoAdd?${params}`, '_self');
      } else {
        this.$router.push({
          name: 'paymentInfoAdd',
          query
        });
      }
    },
    /**
             * 点击使用新卡表单
             */
    clickNewCard () {
      triggerService({ eventId: '14-2-5-13' }); // 点击"Pay with a New Card"
      this.toForm();
    },
    /**
             * 设置当前卡
             */
    setCurrentCard (index) {
      this.currCard = this.cardList[index];
      this.cardShow = false;
      triggerService({ eventId: '14-2-5-8', paymentType: this.currCard.paymentType }); // 点击其他信用卡
    },

    showConfirm (index) {
      triggerService({ eventId: '14-2-5-9' }); // 点击删除信用卡
      this.delIndex = index;
      this.delCard = this.cardList[index];
      this.isShowTextInfo = true;
      this.cardShow = false;
      triggerService({ eventId: '14-2-5-10' }); // 删除卡信息提醒弹窗曝光
    },

    /**
             * 删除选定卡
             */
    removeCard () {
      const index = this.delIndex;
      const sourceId = this.cardList[index].sourceId;
      this.cardList.splice(index, 1);
      this.isShowTextInfo = false;
      trigger('remove card');
      triggerService({ eventId: '14-2-5-12' }); // 点击“Confirm”
      const option = {
        userId: this.payData.userId,
        sourceId
      };
      deleteUserCard(option).then(res => {
        console.log(res, option, '--删除成功---');
        this.getCardList();
      });
    },
    /**
             * 取消删除卡
             */
    cancelRemove () {
      this.isShowTextInfo = false;
      triggerService({ eventId: '14-2-5-11' }); // 点击“Cancel”
    },
    /**
             * 监听提交表单
             */
    async handleSubmit () {
      // 验证邮箱
      if (!getEmailVerify(this.currCard.email)) {
        this.$Message.info(this.$t('pleaseAddress'));
        trigger('card list email not pass');
        return;
      }
      // dlocal 支付相关字段必填校验
      if (this.query.formComponentName === 'dlocal') {
        if (this.payData.payMethod === 'payCardDocument' && !this.formData.document && this.noRequireDocuments.indexOf(this.query.country) === -1) {
          this.$Message.info('Please input your ' + this.documentText);
          trigger('document not pass');
          return;
        }
        // 印度比较特殊，cvv,city,street,number都要填写
        if (this.query.country === 'IN') {
          // cvv 字段必须使用CVV-only Smart Fields生成的用于安全通信的CVV Token.
          const cvvToken = await this.payObj.getCvvToken(this.formData);
          console.log(cvvToken, '----------cvvtoken-----');
          if (!cvvToken.token) {
            this.$Message.info('Please input your CVV');
            trigger('card list cvv not pass');
            return;
          } else {
            this.formData.cvvToken = cvvToken.token;
          }
          if (!this.formData.city) {
            this.$Message.info('Please input your city');
            trigger('card list city not pass');
            return;
          }
          if (!this.formData.street) {
            this.$Message.info('Please input your street');
            trigger('card list street not pass');
            return;
          }
          if (!this.formData.number) {
            this.$Message.info('Please input your number');
            trigger('card list number not pass');
            return;
          }
        }
        if (this.payData.payMethod === 'payCardDocument') {
          this.currCard.document = this.formData.document;
        }
      }

      triggerService({ eventId: '14-2-5-4' }); // 点击”pay"
      trigger('card list submit order');
      const dlocalForm = this.query.formComponentName === 'dlocal' && this.query.country === 'IN' ? this.formData : {};
      const obj = { ...this.currCard, id: this.currCard.sourceId, payType: 'sourceId', ...dlocalForm };
      this.handlePay(obj);
    },
    /**
             * 邮箱input点击
             */
    clickEmailInput () {
      triggerService({ eventId: '14-2-5-2' }); // 点击修改邮箱
    },
    /**
             * 显示card list
             */
    showCardList () {
      triggerService({ eventId: '14-2-5-3' }); // 点击">"查看其他信用卡信息
      this.cardShow = true;
      triggerService({ eventId: '14-2-5-7' }); // 其他信用卡信息底部悬浮框曝光
    },
    /**
             * 判断当前卡是不是mada卡
             * @param bin
             * @returns {boolean}
             */
    isMada (bin) {
      // todo: 只在测试环境使用上线前删除
      const env = baseConfig.NODE_ENV === 'production' ? 'prod' : 'test';
      if (bin === '519999' && env === 'test') {
        return true;
      }
      return mada.includes(bin);
    },

    async handlePay (form) {
      // if (!validate) return
      this.spinShow = true;
      const params = {
        ...this.query,
        ext: { ...form },
        formPage: true
      };
      await this.payObj.handleSubmit(params); // 提交
      this.spinShow = false;
    },
    closeBtn () {
      this.$router.go(-1);
    },
  },
  async mounted () {
    this.payObj = await choosePay(this.query.formSource, this.query, this.query.hasDepend);
    this.payData = this.$route.query;
    // dlocal 的印度国家要加载对应的 Smart Fields 实例
    if (this.payData.formComponentName === 'dlocal' && this.payData.country === 'IN') {
      await this.payObj._installCvv();
    }
    if (this.payData.payChannel === 'sepa') {
      this.inputData.sepaSwitch = 1;
    }
    if (this.payData.payMethod === 'payCardDocument') {
      this.queryFormParams(this.payData);
    }
    this.getCardList();
    this.appName = baseConfig.appName;
  }
};
</script>

<style lang="less" rel="stylesheet/less" >
@import url("./coins.less");
.grey-bg {
    background: #f9f9f9;
}
.gap18 {
    height: 0.18rem;
    width: 100%;
}
.line {
    border-bottom: 1px solid #E6E6E6;
}

.order-info {
    margin: 10px;
    background: #fff;
    padding: 10px;
    border: 1px solid #E6E6E6;
    border-radius: 10px;

    .pay-title {
        font-size: 14px;
        font-weight: bold;
        line-height: 50px;
        line-height: 50px;
        text-transform: uppercase;
        color: #000;
    }
    .pay-item {
        display: flex;
        justify-content: space-between;
        align-self: center;
        line-height: 24px;
        margin-top: 10px;
        span {
            font-weight: normal;
            font-size: 12px;
            color: #333;
            &.price {
                color: #00C784;
                font-weight: 500;
            }
        }
        .email {
            .order-input {
                margin-right: 0.18rem;
                &:focus {
                    outline: none;
                }
            }
            .rc-edit {
                width: 0.28rem;
                height: 0.28rem;
                background: url(~@/assets/img/shop/Icon/rc-edit-email2.png) center no-repeat;
                background-size: 100% 100%;
                display: inline-block;
                position: relative;
                top: 0.04rem;
            }
        }
        .coins{
            display: inline-block;
                color: #000;
                font-weight: 500;
                &::before {
                    content: '';
                    display: inline-block;
                    width: 20px;
                    height:20px;
                    float: left;
                    margin-right:4px;
                    margin-top:2px;
                    background: url(./../../assets/img/shop/4.png) no-repeat center center;
                    background-size: 100%;
                }
        }
    }
}

.pay-detaile {
    padding: 0.16rem 0 0.4rem;
}
.order-card {
    padding: 0 10px;
    .cell-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #e6e6e6;
        background: #fff;
        padding: 0 10px;
        height: 40px;
        border-radius: 6px;
        color:#000;
        .card-title {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            img{
                    max-width: 120px;
                    max-height: 34px;
                }
        }
        .rc-icon {
            width: 10px;
            height: 20px;
        }
        .angle-right-gray {
            background-repeat: no-repeat;
            position: relative;
            background-position: 50%;
            background-size: contain;
            background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNyAxMiI+PGRlZnM+PHBhdGggaWQ9ImEiIGQ9Ik0uMjkzIDEuNzA3QS45OTkuOTk5IDAgMTExLjcwNy4yOTNsNSA1YS45OTkuOTk5IDAgMDEwIDEuNDE0bC01IDVhLjk5OS45OTkgMCAxMS0xLjQxNC0xLjQxNEw0LjU4NiA2IC4yOTMgMS43MDd6Ii8+PC9kZWZzPjxjbGlwUGF0aCBpZD0iYiI+PHVzZSB4bGluazpocmVmPSIjYSIgb3ZlcmZsb3c9InZpc2libGUiLz48L2NsaXBQYXRoPjxwYXRoIGNsaXAtcGF0aD0idXJsKCNiKSIgZmlsbD0iI2NjYyIgZD0iTS01LTVoMTd2MjJILTV6Ii8+PC9zdmc+);
            background-repeat: no-repeat;
        }
    }
    .card-img {
        // width: 1.3rem;
        margin: 0 0.28rem 0 0;
    }
}

.popup-card {
    background: #fff;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
    .popup-title {
        font-size: 13px;
        color: #000;
        height: 40px;
        line-height: 40px;
        padding: 0px 16px;
        background: #fff;
    }
    .popup-body {
        background: #fff;
        max-height: 6.02rem;
        overflow-y: auto;
        .order-card {
            padding: 0;
            .cell-item {
                // border-bottom: 0;
                width: 100%;
                .icon-checked {
                    background: url(~@/assets/img/shop/Icon/rc-checked.png) center no-repeat;
                    width: 20px;
                    height: 20px;
                    background-size: contain;
                    color: #38C20A;
                }
            }
        }
        .new-card {
            color: #38C20A;
            font-size:14px;
            height: 48px;
            line-height: 48px;
            text-align: center;
            margin: 0 15px;
            border-top: 1 solid #e6e6e6;
            .icon-add {
                margin-right: 0.18rem;
                img {
                    width: 0.32rem;
                    height: 0.32rem;
                }
            }
        }
    }
}
.order-button {
    margin: 10px auto;
    text-align: center;
    .pay-btn {
        height: 40px;
        width: 70%;
        border-radius: 20px;
        border: none;
        background: #38C20A;
        color: #fff;
    }
}

.order-footer {
margin: 14px 40px 0;
.secure-text {
    padding: 0 0.56rem;
    text-align: center;
    color: #666;
    font-size: 12px;
    >img {
      display: inline-block;
      position: relative;
      display: inline-block;
      height: 14px;
    }
}
.secure-img {
    margin-top: 0.2rem;
    text-align: center;
    img{
        height: 40px;
    }
}
}
    .rc-cell-wrapper{
            .cell-item {
                span {
                    color: #333;
                }
            }
    }

    .card-bg {
        // background: #fff;
        width: 100%;
    }
    .grey-bg {
        background: transparent;
    }
    .secure-img{
        span{
            img{
                border-radius: 0.1rem;
            }
        }
    }
    .pay-detaile{
        // background: #fff;
        margin-top: 0.18rem;;
        border-radius: 0.18rem;
    }
    .source-id-form {
        background: none;
        label {
            text-transform: uppercase;
            color: #fff;
        }

        .icon-error{
            display: none;
        }

        .border-valid {
            border-color: #d96830;
            .icon-nomal {
                display: none;
            }
            .icon-error{
                display: inline-block;
            }
        }

        .card-style {
            display: flex;
            align-items: center;
            color: #fff;
            border-radius: 0.1rem;
            border: 1px solid #e8e8e8;

            & > div {
                flex: 1;
            }
        }

        .icon-container {
            position: absolute;
            top: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 26px;
            margin: 0 7px;
        }

        .input-container {
            position: relative;
            display: flex;
            height: 40px;
        }

        .icon-container:last-child {
            right: 0;
        }

        .icon-container.payment-method {
            right: 0;
        }

        .input-container.cvv {
            margin-left: 4px;
        }
        .cvv-frame {
            padding-left: 40px;
        }
    }
    .popup-body{
        .order-card{
            .cell-item{
                background: none;
            }
        }
    }
    .coin-full-height{
      min-height: 100vh;
    }

</style>

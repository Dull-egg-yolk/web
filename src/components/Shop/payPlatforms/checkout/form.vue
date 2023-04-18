<template>
  <div class="position-fixed full-height scroll-y">
      <section class="row template-style submitting pay-font">
          <div class="pay-info">
              <div :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'">
                  <div class="pay-title">
                    <span>{{$t('shop.orderDetail')}}</span>
                    <span>
                        <img :src="channelLogo" alt="">
                    </span>
                  </div>
                  <p class="pay-item">
                        <span>{{ $t('shop.coinsAmount') }}</span>
                        <span class="coins"> {{ payData.coins }}</span>
                    </p>
                  <p class="line"></p>
                  <p class="pay-item">
                      <span>{{$t('shop.orderAmount')}}</span>
                      <span class="price"> {{payData.currencyMark + ' ' + payData.price}}</span>
                  </p>
                  <p class="pay-item">
                      <span>{{$t('shop.beneficiary')}}</span>
                      <span>{{this.appName}}</span>
                  </p>
              </div>
          </div>
          <form id="payment-form" class="payment-form checkout-form" method="POST" action="https://merchant.com/charge-card">
              <fieldset>
                  <div v-if="payObj && payObj.fields">
                      <div class="field" v-if="payObj.fields.firstName">
                          <label for="firstName">First Name<span class="required-style" v-if="payObj.fields.lastName.required">*</span></label>
                          <input id="firstName" type="text" required autocomplete="First Name" v-model="inputData.firstName">
                      </div>
                      <div class="field" v-if="payObj.fields.lastName">
                          <label for="lastName">Last Name<span class="required-style" v-if="payObj.fields.lastName.required">*</span></label>
                          <input id="lastName" type="text" required autocomplete="Last Name" v-model="inputData.lastName">
                      </div>
                      <div class="field" v-if="payObj.fields.name">
                          <label for="name">{{$t('shop.cardName')}}<span class="required-style" v-if="payObj.fields.name.required">*</span></label>
                          <div class="input-container">
                              <input id="name" type="text" required autocomplete="name" :placeholder="$t('shop.pleaseInput')+$t('shop.cardName')" v-model="inputData.name">
                              <div class="icon-container" @click="showCardInfo('name')">
                                  <img height="16px" src="@/assets/img/shop/card-icons/error.svg"/>
                              </div>
                          </div>
                      </div>

                      <div class="field" v-if="payObj.fields.phone">
                          <label for="phone">PHONE NUMBER<span class="required-style" v-if="payObj.fields.phone.required">*</span></label>
                          <input id="phone" type="text" required v-model="inputData.phone">
                      </div>
                      <div class="field" v-if="payObj.fields.document">
                          <label for="document">Document<span class="required-style" v-if="payObj.fields.document.required">*</span></label>
                          <input id="document" type="tel" required autocomplete="tel" v-model="inputData.document">
                      </div>
                      <div class="field" v-if="payObj.fields.iban">
                          <label for="iban">IBAN<span class="required-style" v-if="payObj.fields.iban.required">*</span></label>
                          <input id="iban" type="text" required autocomplete="tel" v-model="inputData.iban">
                      </div>
                      <div class="field" v-if="payObj.fields.bic">
                          <label for="bic">BIC<span class="required-style" v-if="payObj.fields.bic.required">*</span></label>
                          <input id="bic" type="text" required v-model="inputData.bic">
                      </div>
                      <div class="field" v-if="payObj.fields.country">
                          <label for="country">Country<span class="required-style" v-if="payObj.fields.country.required">*</span></label>
                          <select class="country-select" name="country" id="country" @change="handleCountryChange" v-model="inputData.country">
                              <option :value="item" v-for="(item, index) in countries" :key="index">
                                  {{item.name}}
                              </option>
                          </select>
                      </div>
                      <div class="field" v-if="payObj.fields.city">
                          <label for="city">City<span class="required-style" v-if="payObj.fields.city.required">*</span></label>
                          <input id="city" type="text" required v-model="inputData.city">
                      </div>
                      <div class="field" v-if="payObj.fields.street">
                          <label for="street">Street<span class="required-style" v-if="payObj.fields.street.required">*</span></label>
                          <input id="street" type="text" required v-model="inputData.street">
                      </div>
                      <div class="field" v-if="payObj.fields.number">
                          <label for="Number">Number<span class="required-style" v-if="payObj.fields.number.required">*</span></label>
                          <input id="Number" type="text" required v-model="inputData.number">
                      </div>
                      <div class="field" v-if="payObj.fields.address">
                          <label for="addressline1">Address<span class="required-style" v-if="payObj.fields.address.required">*</span></label>
                          <input id="addressline1" type="text" required v-model="inputData.address">
                      </div>
                      <div class="field" v-if="payObj.fields.postCode">
                          <label for="postCode">Post code<span class="required-style" v-if="payObj.fields.address.required">*</span></label>
                          <input id="postCode" type="text" required v-model="inputData.postCode">
                      </div>
                      <div class="field" v-if="payObj.fields && payObj.fields.card && payObj.fields.card.required">
                          <label>{{$t('shop.cardNumber')}}<span class="required-style">*</span></label>
                          <div class="input-container card-number">
                              <div class="icon-container">
                                  <img id="icon-card-number" height="16px" src="@/assets/img/shop/card-icons/card.svg" alt="PAN" />
                              </div>
                              <div class="card-number-frame checkout-number" id="card-number"></div>
                              <div class="icon-container payment-method">
                                  <img id="logo-payment-method" />
                              </div>
                              <div class="icon-container" @click="showCardInfo('num')">
                                  <img height="16px" src="@/assets/img/shop/card-icons/error.svg" />
                              </div>
                          </div>

                          <div class="date-and-code">
                              <div>
                                  <label>{{$t('shop.cardExp')}}<span class="required-style">*</span></label>
                                  <div class="input-container expiry-date">
                                      <div class="icon-container">
                                          <img id="icon-expiry-date" height="16px" src="@/assets/img/shop/card-icons/exp-date.svg" alt="Expiry date" />
                                      </div>
                                      <div class="expiry-date-frame" id="card-exp"></div>
                                      <div class="icon-container" @click="showCardInfo('date')">
                                          <img height="16px" src="@/assets/img/shop/card-icons/error.svg" />
                                      </div>
                                  </div>
                              </div>

                              <div>
                                  <label>{{$t('shop.cardCvv')}}<span class="required-style">*</span></label>
                                  <div class="input-container cvv">
                                      <div class="icon-container">
                                          <img id="icon-cvv" height="16px" src="@/assets/img/shop/card-icons/cvv.svg" alt="CVV" />
                                      </div>
                                      <div class="cvv-frame" id="card-cvv"></div>
                                      <div class="icon-container" @click="showCardInfo('cvv')">
                                          <img height="16px" src="@/assets/img/shop/card-icons/error.svg"/>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="field" v-if="payObj.fields.email">
                          <label for="email">{{$t('shop.emaillAddress')}}<span class="required-style" v-if="payObj.fields.email.required">*</span></label>
                          <input id="email" type="text" required autocomplete="email" :placeholder="$t('shop.pleaseInput')+$t('shop.emaillAddress')" v-model="inputData.email">
                      </div>
                  </div>
              </fieldset>
              <!--<div class="sepa-desc" v-if="payData.payChannel === 'sepa'">
                  <div>
                      <input type="checkbox" name="sepa" value="1" :checked="inputData.sepaSwitch" v-model="inputData.sepaSwitch" />
                  </div>
                  <p>I give Clash Arts HK Limited a SEPA direct debit mandate and authorize A) Clash Arts HK Limited to collect a payment from my bank account once by direct debit and instruct B) my credit institution to redeem the direct debits drawn by Clash Arts HK Limited. I can request reimbursement of the amount due within eight weeks of the debit date. Applicable in this regard by the contract with my bank conditions.
                  </p>
              </div>-->
          </form>
          <div class="form-button">
              <button @click.prevent="handleSubmit" class="template-pay-button" id="payButton">{{$t('shop.surePay')}} {{payData.currencyMark + ' ' + payData.price}}</button>
          </div>

          <!-- <div class="card-box" v-if="payData.payChannel === 'card'">
              <span>
                  <img style="height: 40px; width: auto;" src="@/assets/img/shop/checkout.png" class="pay-img" alt="">
              </span>
          </div> -->
      </section>
      <Modal v-model="isShowInfo" :footer-hide="true" class-name="rc-info-id card-info" @maskEvent="isShowInfo=false" @on-cancel="isShowInfo=false">
          <img :src="`/images/cd-icons/card-${currIcon}.png`">
          <template v-slot:close>
              <span class="card-close"></span>
          </template>
      </Modal>
  </div>
</template>

<script>
import { getEmailVerify, triggerService, trigger } from '@/util/shop';
import countries from '@/util/contry';
import { findPayExtParams } from '@/api/shop';
import Cookies from 'js-cookie';
import Modal from '../../modal';
export default {
  name: 'checkoutForm',
  components: {
    Modal,
  },
  props: {
    payObj: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {
        fields: {}
      }
    }
  },
  data () {
    return {
      imgBase: 'https://h5-static.livuchat.com/images',
      countries: [],
      payData: {},
      inputData: {},
      isShowInfo: false,
      currIcon: '',
      appName: '',
      isShowTextInfo: false
    };
  },
  methods: {
    /**
           * 显示卡字段说明信息
           */
    showCardInfo (type) {
      this.isShowInfo = true;
      this.currIcon = type;
    },

    /**
           * 显示订单下的退款说明信息
           */
    showTextInfo () {
      this.isShowTextInfo = true;
      triggerService({ eventId: '14-2-4-3' }); // 点击说明文案
    },

    /**
           * 点击订单icon,跳转到列表
           */
    onOrderList () {
      // 到这一步肯定用用户id,不用验证是否登录
      trigger('click orderList query');
      triggerService({ eventId: '14-1-1-61' });

      sessionStorage.removeItem('feedbackSource');
      this.$router.push({ name: 'payOrderList', query: { userId: Cookies.get('userId'), loginToken: Cookies.get('loginToken'), deviceId: Cookies.get('deviceId') } });
    },

    /**
           * 根据支付公司、渠道查询填过的表单
           * @param data
           * @returns {Promise<void>}
           */
    async queryFormParams (data) {
      let companyCode = data.companyCode;
      const channels = ['bancontact', 'multibanco', 'p24', 'eps'];
      // todo: 上面4个渠道之后可能会改成独立的，到时 companyCode 只传 data.companyCode即可
      if (channels.includes(data.payChannel)) {
        companyCode = companyCode + '-' + data.payChannel;
      }
      const option = {
        userId: data.userId,
        companyCode,
        payChannel: data.payChannel
      };
      const formParams = await findPayExtParams(option);

      // 回显填过的表单
      if (formParams && formParams.exParams) {
        const data = JSON.parse(formParams.exParams);
        if (typeof data.country === 'string') {
          data.country = JSON.parse(data.country);
        }
        this.$set(this.inputData, 'name', data.name);
        this.$set(this.inputData, 'email', data.email);
      }
    },
    /**
           * 监听国家切换
           */
    handleCountryChange () {
      console.log(this.inputData.country);
    },
    /**
           * 监听提交表单
           */
    handleSubmit () {
      if (this.payObj.fields.name && this.payObj.fields.name.required && !this.inputData.name) {
        this.$toast({
          html: this.$t('shop.pleaseName')
        });
        return;
      }

      if (this.payObj.fields.document && this.payObj.fields.document.required && !this.inputData.document) {
        this.$toast({
          html: 'Please input your document'
        });
        return;
      }
      if (this.payObj.fields.phone && this.payObj.fields.phone.required && !this.inputData.phone) {
        this.$toast({
          html: 'Please input your phone number'
        });
        return;
      }
      if (this.payObj.fields.iban && this.payObj.fields.iban.required && !this.inputData.iban) {
        this.$toast({
          html: 'Please input your IBAN'
        });
        return;
      }
      if (this.payObj.fields.bic && this.payObj.fields.bic.required && !this.inputData.bic) {
        this.$toast({
          html: 'Please input your BIC'
        });
        return;
      }
      if (this.payObj.fields.country && this.payObj.fields.country.required && !this.inputData.country.countryCode) {
        this.$toast({
          html: 'Please select your country'
        });
        return;
      }
      if (this.payObj.fields.city && this.payObj.fields.city.required && !this.inputData.city) {
        this.$toast({
          html: 'Please input your city'
        });
        return;
      }
      if (this.payObj.fields.address && this.payObj.fields.address.required && !this.inputData.address) {
        this.$toast({
          html: 'Please input your address'
        });
        return;
      }
      if (this.payObj.fields.postCode && this.payObj.fields.postCode.required && !this.inputData.postCode) {
        this.$toast({
          html: 'Please input your post code'
        });
        return;
      }
      if (this.payObj.fields.number && this.payObj.fields.number.required && !this.inputData.number) {
        this.$toast({
          html: 'Please input your address number'
        });
        return;
      }

      if (this.payData.payChannel === 'sepa' && !this.inputData.sepaSwitch) {
        this.$toast({
          html: 'Please agree to authorize SEPA'
        });
        return;
      }
      if (this.payObj.fields.email && this.payObj.fields.email.required && !getEmailVerify(this.inputData.email)) {
        this.$toast({
          html: this.$t('shop.pleaseAddress')
        });
        return;
      }
      console.log('submitData', this.inputData);
      trigger('name and email pass');
      this.$emit('handlePay', this.inputData);
    }
  },
  computed: {
    channelLogo () {
      const url = this.payObj && this.payObj._data && this.payObj._data.channelLogo;
      if (url && url.indexOf('http') !== -1) {
        return url;
      }
      return url ? `${this.imgBase}${url}` : '';
    }
  },
  created () {
    this.payData = this.$route.query;
    if (this.payData.payChannel === 'sepa') {
      this.inputData.sepaSwitch = 1;
    }
    this.queryFormParams(this.payData);
    this.appName = baseConfig.appName;
  },
  mounted () {
    // 从快捷页进入    从金币包页进入  区分一下 freeName2
    triggerService({ eventId: '14-2-4-1', channelName: `${this.payData.channelName}`, source: this.payData.pageSource }); // 信息完善页曝光
    // 国家集合
    this.countries = countries;
    // 设置默认国家
    this.inputData.country = this.countries.filter(item => {
      return item.countryCode === this.payData.country;
    })[0] || {};
  },
  watch: {
    'payObj.getFields': {
      handler (val, oldVal) {
        if (val) {
          this.payObj.fields = this.payObj.getFields();
          console.log('val', this.payObj.fields);
        }
      },
      immediate: true
    },
    $route (n, v) {
      console.log('route', n, v);
    }
  },
  destroyed () {
    const frame = document.querySelector('#controllerFrame');
    if (frame) {
      frame.parentNode.removeChild(frame);
    }
  }
};
</script>
<style lang="less">
  #controllerFrame {
      height: 0 !important;
  }
  .payment-form {
      margin: 0 12px;
      border-radius: 16px;
      label {
        //   text-transform: capitalize
      }
  }
  .form-button {
      margin: 15px 70px;
      .template-pay-button {
          background: #8400ff;
          border-radius: 5px;
          box-shadow: none;
          height: 40px;
          font-weight: bold;
      }
  }
  .border-b {
      border-bottom: 1px solid #eee;
  }
  .card-info {
      background: transparent;
    //   width: 6.2rem;
      img{
          width: 100%;
          height: auto;
          float: none;
      }
      .warp-layout{
          padding: 0;
      }
      .card-close {
          background: url('~@/assets/img/shop/card-close.png') center no-repeat;
          background-size: contain;
          display: inline-block;
         width: 40px;
         height: 40px;
      }
      .warp-close{
          right: 50%;
          top: 100%;
          transform: translateX(50%);
      }
  }
  .text-info {
      background: #fff;
      padding: 0.3rem;
      .text-box {
          text-align: left;
          .info-title {
              font-size: 18px;
              font-weight: bold;
              padding: 5px 0;
              margin-bottom: 5px;
              text-align: center;
          }
          p + p{
              margin-top: 0.15rem;
          }
          .text-link {
              text-decoration: underline;
              color: #8400ff;
          }
          .info-icons {
              height: 16px;
              width: 16px;
              margin: 0;
          }
      }
      .warp-close {
          margin-top: 0.2rem;
      }
  }
  .pay-info {
      padding: 0 15px;
      .pay-title {
          font-size: 16px;
          font-weight: bold;
          padding: 5px 0;
          color: #000;
          text-transform: uppercase;
          margin-bottom: 5px;
          display: flex;
          justify-content: space-between;
          span {
            display: inline-block;
            >img {
              display: inline-block;
              width: 50px;
            }
          }
      }
      .pay-item {
          display: flex;
          justify-content: space-between;
          align-self: center;
          line-height: 2.1;
          span{
              font-weight: normal;
              font-size: 14px;
              color: #000;
              &.price {
                  font-weight: 500;
              }
              &.coins {
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
                    margin-top:4px;
                    background: url(../../../../assets/img/shop/4.png) no-repeat center center;
                    background-size: 100%;
                }
            }
          }
          .pay-icons {
              display: flex;
              align-items: center;

              .info-icons {
                  padding: 0 10px;
                  display: flex;
                  align-items: center;
              }
          }
      }
  }
  .card-box {
        text-align: center;
        span {
            border-radius: 0.05rem;
            display: inline-block;
            align-items: center;
            width: 100%;
        }
    }
  .checkout-form {
      .date-and-code {
          display: flex;
          margin-bottom: 8px;
      }

      .date-and-code > div:nth-child(1) {
          width: 55.715%;
      }
      .date-and-code > div:nth-child(2) {
          width: 45.719%;
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

      .input-container.card-number {
          margin-bottom: 8px;
      }
      .input-container.expiry-date {
          margin-right: 4px;
      }
      .input-container.cvv {
          margin-left: 4px;
      }

      .card-number-frame {
      }
      .expiry-date-frame, .checkout-number {
          padding-left: 40px;
          width: 100%;
      }
      .cvv-frame {
          padding-left: 40px;
      }
  }

  div + button {
      margin-top: 8px;
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

  .icon-container.payment-method  {
      transform: translateY(-50%) rotateY(90deg);
      transition: opacity 0.15s ease-out;
      opacity: 0;
      top: 50%;
  }

  .icon-container.payment-method.show {
      opacity: 1;
      transition: all 0.4s ease-out;
      transform: translateY(-50%) rotateY(0deg);
      right: 35px;
  }

  .icon-container.payment-method img {
      width: 100%;
  }

  [id$="-error"] { display: none }

  .frame {
      opacity: 0;
  }

  .frame--activated {
      opacity: 1;
      border: solid 1px #e8e8e8;
      border-radius: 0.1rem;
  }

  .frame--activated.frame--focus {
      border: solid 1px #e8e8e8;
  }

  .frame--activated.frame--invalid {
      border: solid 1px #D96830;
  }

  .error-message {
      display: block;
      color: #C9501C;
      font-size: .9rem;
      margin: 8px 0 0 1px;
      font-weight: 300;
  }

  #pay-button {
      border: none;
      border-radius: 3px;
      color: #FFF;
      font-weight: 500;
      height: 40px;
      width: 100%;
      background-color: #13395E;
      box-shadow: 0 1px 3px 0 rgba(19,57,94,0.4);
  }

  #pay-button:active {
      background-color: #0B2A49;
      box-shadow: 0 1px 3px 0 rgba(19,57,94,0.4);
  }

  #pay-button:hover {
      background-color: #15406B;
      box-shadow: 0 2px 5px 0 rgba(19,57,94,0.4);
  }

  #pay-button:disabled {
      background-color: #697887;
      box-shadow: none;
  }

  #pay-button:not(:disabled) {
      cursor: pointer;
  }

  .success-payment-message {
      color: #13395E;
      line-height: 1.4;
  }
  .token {
      color: #b35e14;
      font-size: .9rem;
      font-family: monospace;
  }
</style>
<style lang="less" scoped>
  /*.country-select {*/
  /*width: 3rem;*/
  /*margin-left: -3px;*/
  /*background-color: transparent;*/
  /*}*/
  .caption-top {
      margin-right: 15px;
  }
  .line {
    border-bottom: 1px solid #E6E6E6;
  }
  .sepa-desc {
      display: flex;
      margin: 15px;

      & > div {
      }
      input[type=checkbox] {
          width: .4rem;
          height: .4rem;
          vertical-align: middle;
          border: 1px solid #0abf53;
      }

      p {
          margin-left: 10px;
          color: #666;
          line-height: 30px;
          font-size: 12px;
          word-break: break-all;
      }
  }
  .line {
      padding-top: 0.2rem;
  }
  .template-style{
      padding-top: 0.3rem;
      &.pay-font {
          font-family: Helvetica Neue,Helvetica,Arial,Heiti SC,WenQuanYi Micro Hei,sans-serif !important;
      }
  }
  .mt40{
      margin-top: 0.4rem;
  }

/* form style*/
.payment-form {
    padding-bottom: .5rem;
}
.required-style {
    color: #ef0000;
    margin-left: 4px;
}
.caption-top {
    text-align: center;
    padding-top: .3rem;
    margin-left: 15px;
    padding-bottom: .2rem;
    color: #343434;
    font-size: 14px;
}
// .template-style {
//     padding-bottom: 40px;
// }
.template-style * {
    font-size: 14px;
}
.template-style fieldset {
    margin-top: 10px;
    padding: 6px;
    border-style: none;
    background-color: #fff;
    border-radius: 10px;
    border: 0px;
}
.template-style .field {
    display: block;
    -ms-flex-align: center;
    align-items: center;
    margin-left: 15px;
    margin-right: 15px;
    margin-top: .15rem;

    #cardField {
        width: 100%;
        height: 40px;
        display: table;
        color: #424242;
        text-indent: .3rem;
        border: 1px solid #e8e8e8;
        border-radius: .1rem;
        background-color: transparent;

        & > div {
            padding-right: .3rem;
            display: table-cell;
            vertical-align: middle;
        }
    }
}
#template-style-card {
    width: calc(100% - 18px);
}
.template-style label {
    display: flex;
    align-items: center;
    width: 100%;
    color: #424242;
    padding: 5px 0;
    font-weight: 500;
}
.template-style input[type=text],
.template-style button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
    font-weight: normal;
}
.template-style input:-webkit-autofill {
    -webkit-text-fill-color: #424242;
    transition: background-color 100000000s;
    -webkit-animation: 1ms void-animation-out;
}
.template-style input, .template-style select {
    display: block;
    color: #424242;
    text-indent: .3rem;
    width: 100%;
    height: 40px;
    border: 1px solid #e8e8e8;
    border-radius: .1rem;
    background-color: transparent;
    -webkit-animation: 1ms void-animation-out;
    font-weight: normal;
}
.template-style input::-webkit-input-placeholder {
    color: #e7e7e8;
}
.template-style input::-moz-placeholder {
    color: #e7e7e8;
}
.template-style input:-ms-input-placeholder {
    color: #e7e7e8;
}
.template-pay-button {
    display: block;
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    background: #38C20A;
    // box-shadow: 0 0 5px rgba(0,0,0,.3);
    border-radius: 20px;
}
.template-style button:active {
    background-color: #21a35b;
    box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08), inset 0 1px 0 #e298d8;
}
.fixed-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
}
.card-number {color: black;font-size: 18px;}
.card-number--valid {color: green;}
.card-number--invalid {color: red;}
.card-number--focus {color: blue;}
input.card-number::-webkit-input-placeholder {color: gray;}
input.card-number::-moz-placeholder {color: gray;}
input.card-number:-ms-input-placeholder {color: gray;}
input.card-number--focus::-webkit-input-placeholder {border: solid 1px blue;}
input.card-number--focus::-moz-placeholder {border: solid 1px blue;}
input.card-number--focus:-ms-input-placeholder {border: solid 1px blue;}

.expiry-date {color: black;font-size: 18px;}
.expiry-date--valid {color: green;}
.expiry-date--invalid {color: red;}
.expiry-date--focus {color: blue;}
input.expiry-date::-webkit-input-placeholder {color: gray;}
input.expiry-date::-moz-placeholder {color: gray;}
input.expiry-date:-ms-input-placeholder {color: gray;}
input.expiry-date--focus::-webkit-input-placeholder {border: solid 1px blue;}
input.expiry-date--focus::-moz-placeholder {border: solid 1px blue;}
input.expiry-date--focus:-ms-input-placeholder {border: solid 1px blue;}

.cvv {color: black;font-size: 18px;}
.cvv--valid {color: green;}
.cvv--invalid {color: red;}
.cvv--focus {color: blue;}
input.cvv::-webkit-input-placeholder {color: gray;}
input.cvv::-moz-placeholder {color: gray;}
input.cvv:-ms-input-placeholder {color: gray;}
input.cvv--focus::-webkit-input-placeholder {border: solid 1px blue;}
input.cvv--focus::-moz-placeholder {border: solid 1px blue;}
input.cvv--focus:-ms-input-placeholder {border: solid 1px blue;}

.template-style .error svg .base {
    fill: #e25950;
}
.template-style .error svg .glyph {
    fill: #f6f9fc;
}
.template-style .error .message {
    color: #e25950;
}
.template-style .success .icon .border {
    stroke: #21a35b;
}
.template-style .success .icon .checkmark {
    stroke: #13ce66;
}
.template-style .success .title {
    color: #13ce66;
}
.template-style .success .message {
    color: #13ce66;
}
.template-style .success .reset path {
    fill: #13ce66;
}
.template-style .field .autofilled {
    background-color: unset;
}
</style>

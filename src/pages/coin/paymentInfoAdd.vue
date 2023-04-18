<template>
  <div class="coin-page"  @click.stop="() => {}" ref="coinPage">
    <!-- mobile 给移动端的页面title -->
    <div class="mb-title new-shop flex-row-vc" v-if="!query.isIframe">
      <div class="actions l fx-c" >
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
    <div :class="['inner', 'coin-full-height', query.isIframe ? 'paddingTop0':'' ]">
      <component :is="formComponent" @handlePay="handlePay" :payObj="payObj"></component>
        <div  v-if="channelList && channelList.length > 0">
            <div class="section-title">
              <span>{{$t('shop.codaFlowSelectPayMethod2')}}</span>
            </div>
            <ul class="channel-list">
                <template  v-for="(item, index) in channelList" >
                  <li
                      :class="{
                        'channel-item': true,
                      }"
                      :key='index'
                      @click="handleChannel(item)"
                      v-if="index < 2"
                  >
                    <div class="channel-logo">
                      <img v-if="item.channelUrl && !item.channelIcon" :src="`${imgBase}${item.channelUrl}`" :alt="item.channelCode" loading="lazy"/>
                      <img v-if="item.channelIcon" :src="item.channelIcon" :alt="item.channelCode" loading="lazy"/>
                    </div>
                    <div class="channel-name">
                          {{item.channelName ? item.channelName : (item.channelCode | removeLine)}}
                      </div>
                  </li>
                </template>
            </ul>
            <div class="other-payment" v-if="channelList.length > 2" ><span @click="channelShow=true">Other Payment Methods >></span></div>
          </div>
          <div class="secure-payment" v-if="loadComponent">
              <p class="secure-text">Secured by:</p>
              <p class="flex-c-c secure-img">
                  <span><img src="@/assets/img/shop/new/forter.jpg" alt=""></span>
              </p>
          </div>
    </div>
    <rc-popup :visible="channelShow" :mask="true" class="popup-channel" v-if="channelShow" @on-close="channelShow=false">
        <div class="popup-body">
          <template  v-if="channelList && channelList.length > 100">
            <div class="section-title">
              <span>{{$t('shop.codaFlowSelectPayMethod2')}}</span>
            </div>
            <ul class="channel-list">
                <template  v-for="(item, index) in channelList" >
                  <li
                      :class="{
                        'channel-item': true,
                      }"
                      :key='index'
                      @click="handleChannel(item)"
                      v-if="index > 2"
                  >
                    <div class="channel-logo">
                      <img v-if="item.channelUrl && !item.channelIcon" :src="`${imgBase}${item.channelUrl}`" :alt="item.channelCode" loading="lazy"/>
                      <img v-if="item.channelIcon" :src="item.channelIcon" :alt="item.channelCode" loading="lazy"/>
                    </div>
                    <div class="channel-name" style="justify-content: flex-end">
                          {{item.channelName ? item.channelName : (item.channelCode | removeLine)}}
                      </div>
                  </li>
                </template>
            </ul>
          </template>
        </div>
    </rc-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { logReport } from '@/util/logReport';
import Vue from 'vue';
import { choosePay } from '@/components/Shop/payPlatforms/index';
import rcPopup from '@/components/Shop/popup/popup';
import Cookies from 'js-cookie';

export default {
  name: 'paymentInfoAdd',
  components: { rcPopup },
  computed: {
    ...mapState({
      userInfo: (state) => state.app.userInfo,
    }),
  },
  data () {
    return {
      formComponent: '',
      query: { ...this.$route.query, routeName: this.$route.name },
      spinShow: false,
      payObj: {},
      imgBase: 'https://h5.livuchat.com/images',
      channelList: [],
      loadComponent: false,
      channelShow: false
    };
  },
  methods: {
    registerComponent (componentName) {
      return import(`@/components/Shop/payPlatforms/${componentName}/form.vue`).then(component => Vue.extend(component.default));
    },
    async handlePay (form) {
      // if (!validate) return
      // this.spinShow = true
      const params = {
        ...this.query,
        ext: { ...form },
        formPage: true
      };
      await this.payObj.handleSubmit(params); // 提交
    },
    closeBtn () {
      this.$router.go(-1);
    },
    async handleChannel (item) {
      const activeChannel = item;
      const activeCoin = this.activeCoin;
      logReport({
        eventId: '14-2-3-2',
        freeName2: { channelName: activeChannel.channelName, code: activeChannel.channelCode + '-' + activeChannel.coinCode + '-' + activeCoin.coinType },
      });
      if (activeChannel.payCompanyCode === 'payermax') {
        this.toolPay(activeChannel, activeCoin);
      } else if (activeChannel.payCompanyCode === 'checkout' && activeChannel.payChannel === 'card') {
        if (activeChannel.channelName === 'GOOGLE_PAY') {
          this.toolPay(activeChannel, activeCoin);
        } else {
          const data = this.getData(activeChannel, activeCoin);
          this.query = { ...this.query, ...data };
          this.payObj = await choosePay('checkout', data, this.query.hasDepend);
          this.registerComponent('checkout').then(Component => {
            this.formComponent = Component;
            this.loadComponent = true;
            const channelAndPayCompanyDtoList = this.activeCoin.channelAndPayCompanyDtoList || [];
            this.channelList = channelAndPayCompanyDtoList.filter(item => item.channelCode !== activeChannel.channelCode);
          });
        }
      }
    },
    getData (activeChannel, activeCoin) {
      const kochavaDeviceId = localStorage.getItem('kv_id');
      // checkout 中可能有 checkout-esp 这种方式
      const payTypes = activeChannel.payCompanyCode.split('-');
      const payCompany = payTypes[0];
      const payChannel = payTypes[1];
      if (payCompany === 'checkout' && payChannel) {
        activeChannel.payCompanyCode = payCompany;
        activeChannel.payChannel = payChannel;
      }

      // codapay 的订阅包渠道 payCompanyCode 是 codapay-subscription
      if (activeChannel.payCompanyCode === 'codapay-subscription') {
        activeChannel.payCompanyCode = payCompany;
        activeChannel.payChannel = payChannel;
      }
      const data = {
        channelName: activeChannel.channelName,
        channelCode: activeChannel.channelCode,
        companyCode: activeChannel.payCompanyCode,
        code: activeChannel.coinChannelCode, // 金币code码
        userId: this.userInfo.id, // 计算转换得到实际的userId
        type: 7,
        coins: activeCoin.totalCoinNum,
        price: activeChannel.price,
        currency: activeChannel.currency,
        currencyMark: activeChannel.currencyMark,
        pageName: this.pathName || '',
        adFrom: this.linkFrom || '',
        couponId: this.$route.query.couponId || '',
        locale: navigator.language.split('-')[0],
        country: activeCoin.countryCode,
        kochaveAppId: baseConfig.kochavaAppId,
        kochaveDeviceId: kochavaDeviceId,
        source: baseConfig.appName,
        payChannel: activeChannel.payChannel,
        thirdPaymentChannelCode: activeChannel.thirdPaymentChannelCode || '',
        isMultistage: activeChannel.isMultistage || '', // 是否有二级渠道
        channelType: activeChannel.channelType, // 渠道的类型 coin:金币包， subscription 订阅包
        pageSource: 1
      };
      // dlocal 的 Payins 支付方式
      if (activeChannel.payCompanyCode === 'dlocal') {
        data.paymentMethodFlow = activeChannel.paymentMethodFlow;
        data.paymentMethodId = activeChannel.paymentMethodId;
      }
      data.channelLogo = activeChannel.channelUrl;
      return data;
    },
    async toolPay (activeChannel, activeCoin) {
      const data = this.getData(activeChannel, activeCoin);
      localStorage.setItem('payInfo', JSON.stringify(Object.assign({
        routerName: this.$route.name,
        totalCoin: activeCoin.totalCoinNum,
        activeCoin,
        selCountryCode: this.selCountryCode
      }, data)));
      Cookies.set('payInfo', JSON.stringify(Object.assign({
        routerName: this.$route.name,
        totalCoin: activeCoin.totalCoinNum,
      }, data)), { expires: 7 });
      localStorage.setItem('rlen', history.length);
      await choosePay.call(this, data.companyCode, data, this.query.hasDepend);
    },
  },
  async mounted () {
    this.payObj = await choosePay(this.query.formSource, this.query, this.query.hasDepend);
    const payInfo = JSON.parse(localStorage.getItem('payInfo'));
    const activeCoin = payInfo.activeCoin;
    const channelCode = this.$route.query.channelCode;
    const channelAndPayCompanyDtoList = activeCoin.channelAndPayCompanyDtoList || [];
    this.selCountryCode = payInfo.selCountryCode;
    this.channelList = channelAndPayCompanyDtoList.filter(item => item.channelCode !== channelCode);
    this.activeCoin = payInfo.activeCoin;
    // 使用公共form
    // eslint-disable-next-line no-eval
    if (eval(this.query.useCommonForm)) {
      // 是否有依赖  param1: 支付平台, param2: 数据， param3: 是否需要安装依赖
      this.registerComponent('common').then(Component => {
        this.formComponent = Component;
        this.loadComponent = true;
      });
    } else {
      this.registerComponent(this.query.formComponentName).then(Component => {
        this.formComponent = Component;
        this.loadComponent = true;
      });
    }
  },

  beforeDestroy () {
  },
};
</script>

<style lang="less">
@import url("./coins.less");
.secure-payment {
      margin-top: 0.5rem;
      .secure-text {
          color: #333;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          span {

          }
      }
      .secure-img {
          margin-top: 0.03rem;
          text-align: center;
          img {
              height: 40px;
          }
      }
  }
  .section-title {
          height: 40px;
          line-height: 40px;
          font-size: 12px;
          color: #000;
          padding-left: 16px;
          font-weight: bold;
          span:last-child {
            font-size: 13px;
          }
    }
    .other-payment {
      height: 40px;
      line-height: 40px;
      text-align: center;
      color:#0FC005;
      font-size: 14px;
    }
    .template-style {
      margin-bottom: 0px;
    }
    .popup-channel {
    max-height: 60vh;
    overflow-y: auto;
    .popup-body {
        background: #fff;
        height: 100%;
        padding-bottom: 20px;
        .channel-item {
          border: 1px solid #e6e6e6;
        }
    }
}
.coin-full-height {
  min-height: 100vh;
}
</style>

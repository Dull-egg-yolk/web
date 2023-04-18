<template>
  <div class="pop-pay" v-if="show">
    <div class="pop-pay-bg"></div>
    <div class="inner">
      <div class="iframe-title">{{$t('webChat.coinShop')}}</div>
      <div class="close fx-c icon-cross" @click.stop="cancel"></div>
      <div class="iframe">
        <iframe v-if="payUrl" :src="payUrl" frameborder="0"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Cookies from 'js-cookie';
import { jsonToQuery } from '@/util';
export default {
  name: 'PopPay',
  data () {
    return {
      show: false,
      payUrl: null,
      hasPayed: false
    };
  },

  props: {},
  computed: {
    ...mapState({
      disCoinIframe: (state) => state.app.disCoinIframe,
      disCoinConf: (state) => state.app.disCoinConf,
      limitCoinConf: (state) => state.app.limitCoinConf,
      showVideoPop: (state) => state.app.showVideoPop,
    })
  },
  watch: {
    disCoinIframe (n) {
      this.show = !!n;
      if (n) {
        window.addEventListener('message', this.receiveMessage, false);

        let activeCoin = { ...this.disCoinConf.coin };
        let activeChannel = { ...this.disCoinConf.channel };
        if (n === 'limited') {
          activeCoin = { ...this.limitCoinConf.coin };
          activeChannel = { ...this.limitCoinConf.channel };
        }
        const kochavaDeviceId = localStorage.getItem('kv_id');
        const data = {
          channelName: activeChannel.channelName,
          channelCode: activeChannel.channelCode,
          companyCode: activeChannel.payCompanyCode,
          code: activeChannel.coinChannelCode, // 金币code码
          userId: Cookies.get('userId'),
          type: 7,
          coins: activeCoin.totalCoinNum,
          price: activeChannel.price,
          currency: activeChannel.currency,
          currencyMark: activeChannel.currencyMark,
          locale: navigator.language.split('-')[0],
          country: activeCoin.countryCode,
          kochaveAppId: baseConfig.kochavaAppId,
          kochaveDeviceId: kochavaDeviceId,
          source: baseConfig.appName,
          payChannel: activeChannel.payChannel,
          thirdPaymentChannelCode: activeChannel.thirdPaymentChannelCode || '',
          isMultistage: activeChannel.isMultistage || '', // 是否有二级渠道
          channelType: activeChannel.channelType, // 渠道的类型 coin:金币包， subscription 订阅包
          pageSource: n === 'limited' ? 4 : 3,
          channelLogo: activeChannel.channelUrl,
          formSource: 'checkout',
          formComponentName: 'checkout',
          hasDepend: true
        };
        activeCoin.channelAndPayCompanyDtoList = [activeChannel];
        if (localStorage.getItem('hasCard')) {
          data.hasDepend = false;
          this.payUrl = `${window.location.origin}/cardList?isIframe=1&${jsonToQuery(data)}`;
        } else {
          this.payUrl = `${window.location.origin}/paymentInfoAdd?isIframe=1&${jsonToQuery(data)}`;
        }
        localStorage.setItem('payInfo', JSON.stringify(Object.assign({
          routerName: this.$route.name,
          totalCoin: activeCoin.totalCoinNum,
          activeCoin,
          selCountryCode: activeChannel.countryCode
        }, data)));
      } else {
        this.cancel();
        window.removeEventListener('message', this.receiveMessage);
      }
    },
    showVideoPop (n, o) {
      if (!n && o) {
        this.cancel();
        window.removeEventListener('message', this.receiveMessage);
      }
    }
  },
  methods: {
    ...mapActions(['updateMyUserData']),
    cancel () {
      this.payUrl = '';
      localStorage.setItem('payInfo', '');
      this.$store.commit('setDisCoinIframe', false);
      this.updateMyUserData();
      this.$parent.getDiscountCoin();
    },
    receiveMessage (event) {
      if (event.data && event.data.type === 'closeIframePop') {
        this.cancel();
      }
    }
  },
  mounted () {},
  beforeDestroy () {
  },
};
</script>

<style lang="less">
.pop-pay {
  position: fixed;
  z-index: 240;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  .inner {
    position: relative;
    height: 68%;
    z-index: 2;
    background: #17161F;
    .close {
      position: absolute;
      right: 5px;
      top: 5px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #0e141c0e;
    }
    .iframe-title {
      position: absolute;
      top: 0;
      left: 0;
      height: 40px;
      width: 100%;
      line-height: 40px;
      text-indent: 16px;
      font-size: 14px;
      font-weight: bold;
    }
    .iframe {
      position: absolute;
      top: 40px;
      left: 0;
      bottom: 0;
      width: 100%;
    }
    iframe {
      width: 100%;
      height: 100%;
    }
  }

  .pop-pay-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1;
    background: #0009;
    transition: opacity 0.2s;
  }
}

@media screen and(max-width: 680px) {
  .pop-pay {}
}
</style>

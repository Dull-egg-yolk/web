<template>
  <div class="coin-page">
    <div class="mb-title flex-row-vc">
      <div class="actions l fx-c">
        <span class="icon-arrow" @click.stop="closeBtn"></span>
      </div>
      <div class="title l fx-v">{{$t('webChat.coinShop')}}</div>
      <!-- 金币 -->
      <div class="side-coin hover">
        <div class="coin-wrap fx-be-vc">
          <strong>{{ userInfo.goldNum }}</strong>
        </div>
      </div>
    </div>
    <span class="btn-back hover" @click.stop="closeBtn">
      <span class="icon-cross"></span>
    </span>
    <div class="inner" >
      <iframe v-show="paymentUrl" id="iframe" :src="paymentUrl" frameborder="0" ref="paymentIframe"></iframe>
    </div>
  </div>
</template>
<script>
import { setBodyScroll } from '@/util/index';
import { getPaymentUrl, handlePostMessageForm } from '@/util/shop';
import { getUserInfoData } from '@/api/user';
import { mapState } from 'vuex';
import { logReport } from '@/util/logReport';

export default {
  name: 'CoinPayPage',
  data () {
    const config = {};
    const rlen = history.length;
    const paymentUrl = getPaymentUrl(this.$store.state.app.userInfo, rlen, true);
    return {
      paymentUrl,
      rlen,
      isReload: false
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.app.userInfo,
    }),
    showCheckInTips () {
      return this.checkInConf.show && !this.checkInConf.hasCheck && this.isShowCheckInTips2;
    }
  },
  methods: {
    updateCoin () {
      getUserInfoData().then(({ code, data }) => {
        if (typeof data.goldNum === 'number') {
          this.$store.commit('updateCoin', data.goldNum);
          this.$store.commit('updateUserInfo', data);
        }
      });
    },
    receiveMessage (self) {
      return function (event) {
        if (event.data && event.data.type === 'paySuccess') {
          console.log('充值成功，更新金币', event);
          window.gtag && window.gtag('event', 'GoMeetPurchaseSuccess', {
            send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'],
            media_source: localStorage.getItem('mediasource'),
            campaign_id: localStorage.getItem('campaignid'),
            adgroup_id: localStorage.getItem('adgroupid'),
            keyword: localStorage.getItem('keyword'),
            creative: localStorage.getItem('creative'),
            loc_physical_ms: localStorage.getItem('loc_physical_ms'),
            device: localStorage.getItem('device'),
            type: localStorage.getItem('type'),
            price: event.data.orderInfo.price,
            currency: event.data.orderInfo.currency
          });
          window.gtag && window.gtag('event', 'code_test', { send_to: 'G-JBXWPZPFK1' });
          window.gtag && window.gtag('event', 'purchase', {
            send_to: 'G-JBXWPZPFK1',
            transaction_id: event.data.orderInfo.orderId,
            value: event.data.orderInfo.price,
            currency: event.data.orderInfo.currency,
            items: [
              {
                item_id: event.data.orderInfo.orderId,
                item_name: event.data.orderInfo.itemName,
                currency: event.data.orderInfo.currency,
                price: event.data.orderInfo.price,
                quantity: 1
              }
            ]
          });
          // window.fbq('track', 'Purchase', { content_type: 'product', contents: [{ id: event.data.orderInfo.orderId, quantity: 1 }], currency: event.data.orderInfo.currency, value: event.data.orderInfo.price });
          window.fbq('track', 'Purchase', { currency: event.data.orderInfo.currency, value: event.data.orderInfo.price });
          // 高级匹配
          window.ttq.identify({
            email: localStorage.getItem('RC_USER_EMAIL') || '',
            phone: localStorage.getItem('RC_USER_PHONE') || ''
          });
          window.ttq.track('CompletePayment', { content_type: 'product', content_id: event.data.orderInfo.id, currency: event.data.orderInfo.currency, value: event.data.orderInfo.price, price: event.data.orderInfo.price });
          self.updateCoin();
        }
        if (event.data && event.data.type === 'reload') {
          let len = self.rlen - history.length - 1;
          if (len >= 0) len = -1;
          self.$router.go(len);
        }

        // 点击支付
        if (event.data && event.data.type === 'webClickToPay') {
          window.gtag && window.gtag('event', 'GoMeetClickToPay', {
            send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'],
            media_source: localStorage.getItem('mediasource'),
            campaign_id: localStorage.getItem('campaignid'),
            adgroup_id: localStorage.getItem('adgroupid'),
            keyword: localStorage.getItem('keyword'),
            creative: localStorage.getItem('creative'),
            loc_physical_ms: localStorage.getItem('loc_physical_ms'),
            device: localStorage.getItem('device'),
            type: localStorage.getItem('type'),
            price: event.data.params.price,
            currencySymbol: event.data.params.currencyMark
          });
          // 高级匹配
          window.ttq.identify({
            email: localStorage.getItem('RC_USER_EMAIL') || '',
            phone: localStorage.getItem('RC_USER_PHONE') || ''
          });
          window.ttq.track('InitiateCheckout', { content_type: 'product', content_id: event.data.orderInfo, Currency: event.data.orderInfo.currency, Value: event.data.orderInfo.price });
        }
        if (event.data && event.data.type === 'logReport') {
          logReport({ //
            eventId: '14-2-1-24',
            freeName2: { paymentUrl: event.data.paymentUrl }
          });
        }
        if (event.data && event.data.type === 'parentHref') {
          logReport({ //
            eventId: '14-2-1-23',
            freeName2: { paymentUrl: event.data.url }
          });
          setTimeout(() => {
            window.location.href = event.data.url;
          });
        }

        if (event.data && event.data.type === 'postMessageForm') {
          handlePostMessageForm(event.data.form);
        }
      };
    },
    closeBtn () {
      let len = this.rlen - history.length - 1;
      if (len >= 0) len = -1;
      this.$router.go(len);
      // this.$router.go(-1);
    },

  },
  watch: {
    $route (to, from) {
      console.log('$route', from);
    }
  },
  async mounted () {
    setBodyScroll(true);
    const self = this;
    this.receiveMessageHandler = this.receiveMessage(this);
    window.addEventListener('message', this.receiveMessageHandler, false);
  },
  beforeDestroy () {
    setBodyScroll(false);
    window.removeEventListener('message', this.receiveMessageHandler);
  },
};
</script>

<style lang="less" scoped>

.coin-page {
  max-width: 540px;
  height: 100%;
  position: relative;
  margin: 0 auto;
  .side-coin {
      position: fixed;
      right: 10px;
      top:11px;
      margin: 0;
      padding: 0 2px 0 10px;
      background: linear-gradient(90deg, #FF78FF 0%, #32E5FF 100%);
      z-index:10;
      border-radius: 40px;
      // width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .coin-wrap{
        height:28px;
        padding: 0 30px 0 2px;
        background:url(/img/icon-s-coin.aee9711f.png) right center no-repeat;
        background-size: auto 24px;
        span{
          display: none;
        }
        strong{
          font-size:14px;
          color: #000;
        }
      }
    }
  .inner {
    height: 100%;

    iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }
  }

  .btn-back {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 16px;
    // background: linear-gradient(138deg, #a425ff, #6a14ff 55%, #6b10ff);
    background: rgba(0, 0, 0, 0.4);
    border-radius: 0 0 0 50%;
  }
  .check-in-box,.checkin-tips {
    display: none;
  }
}
::-webkit-scrollbar {
  display: none;
}

[lang="ar"],
[lang="he"],
[lang="ur"] {
  .coin-page {
    direction: ltr;
    .icon-arrow  {
      transform: rotate(0deg);
      margin-left: 15px;
      padding: 0px;
    }
  }
}
@media screen and(min-width: 820px) {
  .coin-page {
    max-width: 820px;
    height: 100%;
    width: 100%;
    iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }
  }
}
@media screen and(max-width: 680px) {
  .coin-page {
    position: fixed;
    height: 100%;
    z-index: 120;
    width: 100%;
    display: flex;
    flex-direction: column;

    .inner{
      flex:1;
      height:100%;
      overflow:auto;
      background:#17161f
    }
    .btn-back {
      display: none;
    }
  }
}
</style>

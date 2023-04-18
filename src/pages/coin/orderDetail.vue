<template>
  <div class="coin-page"  @click.stop="() => {}" ref="coinPage">
    <!-- mobile 给移动端的页面title -->
    <div class="mb-title new-shop flex-row-vc" v-if="!this.$route.query.isIframe">
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
    <div :class="['inner', 'coin-full-height', this.$route.query.isIframe ? 'paddingTop0':'' ]" >
      <section class="payment-res full-height common-pay-bg-color">
        <!--默认状态-->
        <div class="wait-time-wrap" v-if="time !== 0 && (($route.query.isLoop == 1 && orderInfo && orderInfo.orderStatus === 1) || ($route.query.isLoop == 1 && !orderInfo))">
            <section class="res-status">
                <img src="@/assets/img/shop/new/time.png" alt="time" class="time"/>
                <h4>{{$t('shop.getPaymentResults', {num: time})}}</h4>
                <p>{{$t('shop.waitingThirdParty')}}
                    <template v-if="$route.query.payCompany === 'dlocal'">
                        <br>
                        <br>(Please note that you might be required to wait up to one minute)
                    </template>
                </p>
            </section>
        </div>
        <template v-if="(orderInfo && orderInfo.orderStatus && orderInfo.orderStatus !== 1) || time === 0">
            <div class="res-content"  v-if="orderInfo">
                <section class="res-status" v-if="orderInfo.orderStatus === 10 || orderInfo.orderStatus === 11">
                    <img src="@/assets/img/shop/new/success.png" alt="success"/>
                    <p>{{$t('shop.purchaseSuccess')}}</p>
                </section>
                <section class="res-status" v-else-if="orderInfo.orderStatus === 1">
                    <img src="@/assets/img/shop/new/pending.png" alt="progress"/>
                    <p>{{$t('shop.purchasePending')}}</p>
                </section>
                <section class="res-status" v-else-if="orderInfo.orderStatus === 31">
                    <img src="@/assets/img/shop/new/upload-close.png" alt="fail"/>
                    <p>{{$t('shop.cancelled')}}</p>
                </section>
                <section class="res-status" v-else-if="orderInfo.orderStatus === 32 || orderInfo.orderStatus === 30">
                    <img src="@/assets/img/shop/new/upload-close.png" alt="fail"/>
                    <p>{{$t('shop.purchaseFailed')}}</p>
                </section>
                <section class="res-status" v-else></section>
                <div class="border-btm-1px" style="margin: 12px;"></div>
                <ul class="payment-info clearfix" :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'">
                    <li class="flex-b-c">
                        <span>{{$t('shop.resMoney')}}:</span>
                        <span class="resMoney">{{orderInfo.currencySymbol || '$'}}{{orderInfo.price || ''}}</span>
                    </li>
                    <li class="flex-b-c">
                        <span>{{$t('shop.resCoins')}}:</span>
                        <span>{{orderInfo.orderCoinAmount || ''}}{{$t('shop.resCoinsUnit')}}</span>
                    </li>
                    <li class="flex-b-s">
                        <span class="spec">{{$t('shop.resOrder')}}:</span>
                        <span class="spec-right">{{orderInfo.orderId || ''}}</span>
                    </li>
                    <li class="flex-b-c">
                        <span>{{$t('shop.resOrderTime')}}:</span>
                        <span v-if="orderInfo.paymentTime">{{new Date(orderInfo.paymentTime).format('yyyy-MM-dd hh:mm:ss')}}</span>
                    </li>
                </ul>
            </div>
            <button class="ok-btn" @click="goOrderInfo" v-if="isShowRedirect">{{$t('shop.paymentInfo')}}</button>
            <button class="ok-btn" v-else @click="handleOk">{{[30, 31, 32].includes(orderInfo.orderStatus) ? $t('shop.resOrderFailed') : $t('shop.resOrderComplete')}}</button>
            <p class="res-info" v-if="orderInfo && [1, 10, 11].includes(orderInfo.orderStatus)">
                {{$t('shop.resTipsSuccess')}}
            </p>
            <p class="res-info" v-if="orderInfo && [30, 31, 32].includes(orderInfo.orderStatus)">
                {{$t('shop.payFailedAndRetry')}}
            </p>
            <p class="res-info" v-if="orderInfo && (orderInfo.orderStatus === 10 || orderInfo.orderStatus === 11)">
               {{$t('shop.resTipsSuccessBottom')}}
            </p>
        </template>
    </section>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { logReport } from '@/util/logReport';
import Cookies from 'js-cookie';
import { getOrderInfo } from '@/api/shop';

let timeFlag = true;
export default {
  name: 'OrderDetail',
  computed: {
    ...mapState({
      userInfo: (state) => state.app.userInfo,
    }),
    isShowRedirect () {
      return this.orderInfo && this.orderInfo.companyCode === 'dlocal' && this.orderInfo.orderStatus === 1 && this.orderInfo.paymentInfo && this.orderInfo.paymentInfo.redirectUrl;
    }
  },
  data () {
    return {
      orderInfo: null,
      orderId: this.$route.query.OrderId || '',
      time: 10
    };
  },
  methods: {
    // dlocal ticket redirect返回跳转地址
    goOrderInfo () {
      const url = this.orderInfo.paymentInfo && this.orderInfo.paymentInfo.redirectUrl;
      if (url) {
        window.open(url);
      }
    },
    handleOk () {
      // 订单状态 1未支付 10已支付 11已送达/完成 12退款驳回 20退款中 21已退款 22退款失败 30已超时 31已取消 32 支付失败
      if (this.orderInfo && (this.orderInfo.orderStatus === 10 || this.orderInfo.orderStatus === 11)) {
        logReport({ eventId: '14-1-1-35' });
      } else {
        logReport({ eventId: '14-1-1-39' });
      }
      const payInfo = JSON.parse(localStorage.getItem('payInfo') || Cookies.get('payInfo') || '{}');
      const routerName = payInfo.routerName || 'CoinPage';

      const loginToken = Cookies.get('loginToken') || '';
      const deviceId = Cookies.get('deviceId') || '';
      const userId = Cookies.get('userId') || '';
      const rlen = this.$route.query.rlen;
      if (this.$route.query.isIframe) {
        parent.postMessage({ type: 'closeIframePop' }, '*');
        return;
      }
      if (this.$route.query.isBack && rlen) {
        let len = rlen - history.length;
        if (len >= 0) len = -1;
        window.history.go(len);
      } else {
        this.$router.replace({ name: routerName, params: { country: payInfo.country, loginToken, deviceId, userId } }, () => {});
      }
    },
    addGtagRecord (orderInfo) {
      window.gtag && window.gtag('event', 'GomeetPurchaseSuccess', {
        send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'],
        media_source: localStorage.getItem('mediasource'),
        campaign_id: localStorage.getItem('campaignid'),
        adgroup_id: localStorage.getItem('adgroupid'),
        keyword: localStorage.getItem('keyword'),
        creative: localStorage.getItem('creative'),
        loc_physical_ms: localStorage.getItem('loc_physical_ms'),
        device: localStorage.getItem('device'),
        type: localStorage.getItem('type'),
        price: orderInfo.price,
        currencySymbol: orderInfo.currencySymbol
      });
      window.gtag && window.gtag('event', 'purchase', {
        send_to: 'G-JBXWPZPFK1',
        transaction_id: orderInfo.orderId,
        value: orderInfo.price,
        currency: orderInfo.currency,
        items: [
          {
            item_id: orderInfo.orderId,
            item_name: orderInfo.itemName,
            currency: orderInfo.currency,
            price: orderInfo.price,
            quantity: 1
          }
        ]
      });
    },
    Countdown () {
      const timer = setTimeout(() => {
        if (this.time === 0) {
          clearTimeout(timer);
          return;
        }
        if (timeFlag) {
          this.loop();
        }
        this.Countdown();
        this.time -= 1;
      }, 1000);
    },
    statics (orderInfo) {
      const payInfo = JSON.parse(localStorage.getItem('payInfo') || '{}');
      if (orderInfo.source !== 'Yaar' && sessionStorage.getItem('triggerOrderId') !== this.orderInfo.orderId) {
        sessionStorage.setItem('triggerOrderId', this.orderInfo.orderId);
        if (orderInfo.orderStatus === 10 || orderInfo.orderStatus === 11) {
          console.log('触发支付成功');
          if (this.$route.query.isIframe) {
            parent.postMessage({ type: 'paySuccess' }, '*');
          }

          this.addGtagRecord(orderInfo);
          logReport({ eventId: '14-2-8-1', freeName2: { orderPrice: orderInfo.price } });
          return;
        }
        console.log('触发支付失败');
        logReport({ eventId: '14-2-9-1', freeName2: { orderPrice: orderInfo.price } });
      }
    },
    async loop () {
      this.orderInfo = await getOrderInfo(this.orderId, { params: { noLoading: 1 } }) || {};
      // 如果状态发生了改变，就清除定时器
      if (this.orderInfo.orderStatus !== 1) {
        this.time = 0;
        timeFlag = false;
        this.statics(this.orderInfo); // 触发埋点
      } else {
        // 最后一次轮询结果，待确认
        if (this.time === 1) {
          logReport({ eventId: '14-2-10-1', freeName2: { orderPrice: this.orderInfo.price } });
        }
      }
    },
    closeBtn () {
      this.$router.go(-1);
    },
  },
  async created () {
    // 如果 orderId 为空，则返回到金币包页面
    if (!this.orderId) {
      const title = this.$t('errorOrderId');
      // Notice.error({
      //   title,
      //   onConfirm: () => {
      //     this.handleOk();
      //   }
      // });
      return true;
    }
  },
  async mounted () {
    // 如果不需要轮训， 直接查单
    if (!this.$route.query.isLoop) {
      this.time = 0;
      this.orderInfo = await getOrderInfo(this.orderId) || {};
      this.statics(this.orderInfo); // 触发埋点
    }
    if (this.$route.query.loopTime) {
      this.time = Number(this.$route.query.loopTime);
    }
    this.$nextTick(() => {
      // 如果需要轮训查询订单
      if (this.$route.query.isLoop) {
        this.Countdown();
      }
    });
  },
};
</script>

<style lang="less" scoped>
@import url("./coins.less");
.payment-res {
        height: 100vh;
        box-sizing: border-box;
        color: #333;
        padding-top: 80px;
        .res-content {
            background: url("../../assets/img/shop/new/res_bg.png") no-repeat top center;
            background-size: 100% 100%;
            border-radius: .2rem;
            margin: 0 auto;
            .res-status {
                height: 110px;
                font-size: 13px;
                color: #333333;
                box-sizing: border-box;
                > img {
                    width: 50px;
                    height: 50px;
                    display: block;
                    margin: 0 auto 10px;
                }
                > p {
                    font-weight: bold;
                    text-align: center;
                }
            }
            .border-btm-1px {
              position: relative;
              margin: 20px;
              &::after {
                position: absolute;
                bottom: 0;
                content: "";
                left: 0;
                right: 0;
                height: 1px;
                font-size: 0;
                clear: both;
                background-color: #e6e6e6;
                -webkit-transform: scaleY(.5);
                transform: scaleY(.5);
              }
            }
            .payment-info {
                padding: 16px;
                padding-top: 20px;
                >li {
                    margin-bottom: .1rem;
                }
                .flex-b-c, .flex-b-s {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                }
            }
        }
        .ok-btn {
            width: 240px;
            height: 40px;
            margin: 40px auto 0;
            display: block;
            background: rgba(107, 16, 255, 1);
            border-radius: 20px;
            color: #ffffff;
            font-weight: bold;
            text-align: center;
        }
        .res-info {
            font-size: 12px;
            line-height:18px;
            margin: 20px 12px 0;
            text-align: center;
        }
        .spec {
            display: inline-block;
            white-space: nowrap;
            margin-right: 6px;
        }
        .spec-right {
            white-space: pre-wrap;
            word-break: break-all;
            text-align: right;
        }

        .wait-time-wrap {
            text-align: center;
            padding-right: 36px;
            padding-left: 36px;
            .res-status {
                height: 110px;
                font-size: 13px;
                color: #333333;
                box-sizing: border-box;
                > img {
                    width: 50px;
                    height: 50px;
                    display: block;
                    margin: 0 auto 10px;
                }
                > p {
                    font-weight: bold;
                    text-align: center;
                }
            }
            h4 {
                padding-top: 20px;
                font-size: 18px;
                color: #333;
            }
            p {
                margin-top:8px;
                font-size: 8px;
                color: #999999;
            }
        }
    }

// start yyb new style
    @keyframes loading{
        from{transform: rotate(0deg)}
        to{transform: rotate(360deg)}
    }
    @media screen and(min-width: 820px) {
        html, body, #app {
            width: 820px !important;
            max-width: 820px !important;
        }
    }
    .res-status{
        h4{
            color: #000 !important;
        }
        img{
            display: inline-block;
            width: 1rem;
            &.time{
                transform: rotate(0deg);
                animation: loading 1s infinite linear;
            }
        }
    }
    .res-content {
        background: none !important;
        .res-status{
            color: #333 !important;
        }
        .resMoney{
            color:rgb(155,83, 217)
        }
    }
</style>

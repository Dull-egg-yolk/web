<template>
  <div class="coin-page">
    <div class="mb-title new-shop flex-row-vc">
      <div class="actions l fx-c">
        <span class="icon-arrow" @click.stop="closeBtn"></span>
      </div>
      <div class="title l fx-v">
        <div class="side-coin hover">
        <div class="coin-wrap fx-be-vc">
          <strong>{{ userInfo.goldNum }}</strong>
        </div>
      </div></div>
      <!-- 金币 -->

    </div>
    <span class="btn-back hover" @click.stop="closeBtn">
      <span class="icon-cross"></span>
    </span>
    <div class="inner" >
      <ul class="order-list" v-if="orderList && orderList.length > 0">
          <li class="order-item" v-for="(item, index) in orderList" :key="index">
              <section class="flex-b-c">
                  <div class="flex-s-c">
                      <img v-if="!item.subscriptionId" src="@/assets/img/shop/new/coin_price_new.jpg" alt="coin" class="coin-img"/>
                      <img v-if="item.subscriptionId" src="@/assets/img/shop/new/coin_price_new_sub.png" alt="coin" class="coin-img"/>
                      <span class="item-coin-num">{{item.coinNum}}</span>
                      <div class="item-status text-ellipsis" style="white-space: pre-wrap;" :class="{'fail': item.orderStatus === 10 || item.orderStatus === 11}">{{getOrderStatus(item.orderStatus)}}</div>
                  </div>
                  <!-- <div class="item-btn-info text-ellipsis"
                             v-if="item.companyCode === 'dlocal' && item.orderStatus === 1 && (item.paymentInfo && item.paymentInfo.redirectUrl)"
                             @click="goOrderInfo(item.paymentInfo)"
                        >{{$t('shop.paymentInfo')}}</div> -->
                        <button @click="report(item)"
                                v-if="item.orderStatus === 1 ||
                            item.orderStatus === 10 ||
                            item.orderStatus === 11 ||
                            item.orderStatus === 12 ||
                            item.orderStatus === 22 ||
                            item.orderStatus === 30 ||
                            item.orderStatus === 31 ||
                            item.orderStatus === 32 ||
                            item.orderStatus === 43"
                                class="item-report text-ellipsis" style="white-space: pre-wrap; margin-top: 0;">{{$t('shop.refundReport')}}</button>
              </section>
              <p>{{$t('shop.purchaseCategory')}}：<span class="item-detail" v-if="!item.subscriptionId">{{$t('shop.coinsPackage')}}</span><span class="item-detail" v-if="item.subscriptionId">{{$t('shop.subscribeCoins')}}</span>
              </p>
              <p v-if="item.paymentInfo && item.paymentInfo.paymentCode"><span>{{$t('shop.paymentCode')}}：</span> <span class="item-detail">{{item.paymentInfo.paymentCode}}</span></p>
              <p>{{$t('shop.refundAccount')}}： <span class="item-detail">{{item.currencySymbol}}{{item.priceStr}}</span></p>
              <p>{{$t('shop.refundPlatform')}}： <span class="item-detail">{{item.channelRealName}}</span></p>
              <p class="flex-s-s">
                  <span class="flex-b-s text-label">{{$t('shop.refundOrderId')}}：</span><span class="item-detail item-id">{{item.orderId}}</span>
              </p>
              <p><span>{{$t('shop.refundTime')}}：</span><span class="item-detail">{{new Date(item.paymentTime || item.createTime).format('yyyy-MM-dd hh:mm:ss')}}</span></p>
          </li>
      </ul>
      <section v-if="orderList && orderList.length === 0">
          <img src="@/assets/img/shop/empty.png" alt="empty" class="order-empty"/>
          <p class="text-center">No related records found</p>
      </section>
    </div>
  </div>
</template>
<script>
import { setBodyScroll } from '@/util/index';
import { getOrderListByUserId } from '@/api/shop';
import { mapState } from 'vuex';
import { triggerService } from '@/util/shop';
import Cookie from 'js-cookie';

export default {
  name: 'CoinPayOrderList',
  data () {
    return {
      orderList: null
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.app.userInfo,
    }),
  },
  methods: {
    closeBtn () {
      this.$router.go(-1);
    },
    getOrderStatus (value) {
      // 订单状态 1未支付 10已支付 11已送达/完成 12退款驳回 20退款中 21已退款 22退款失败 30已超时 31已取消 32 充值失败 41 chargeback 42 chargeback evidence required, 43 order chargeback dispute was won, 44 order chargeback dispute was lost, 45 order chargeback dispute was won and add coin completed
      const orderStatus = {
        1: this.$t('shop.refundOrderProcessing'),
        10: this.$t('shoo.refundOrderSuc'),
        11: this.$t('shop.refundOrderSuc'),
        12: this.$t('shop.refundRejected'),
        20: this.$t('shop.refundHandling'),
        21: this.$t('shop.refundCharged'),
        22: this.$t('shop.refundOrderFail'),
        23: this.$t('shop.refundHandling'),
        30: this.$t('shop.newPaymentFailed'),
        31: this.$t('shop.cancelled'),
        32: this.$t('shop.purchaseFailed'),
        41: this.$t('shop.refundHandling'),
        42: this.$t('shop.refundHandling'),
        43: this.$t('shop.refundOrderSuc'),
        44: this.$t('shop.refundRejected'),
        45: this.$t('shop.refundOrderSuc')
      };
      return orderStatus[value];
    },
    /**
     * 报告问题
     */
    report (item) {
      triggerService({ eventId: '14-1-1-62', orderStatus: item.orderStatus });

      if (this.transUserId) {
        console.log('refund page click report');
        this.$emit('report', item);
        return;
      }
      console.log('本地存储payOrder信息', item);
      sessionStorage.setItem('payRefundOrder', JSON.stringify(item));
      this.$router.push({
        name: 'PayRefund',
        query: {
          item: 1
        }
      });
    },
  },
  async mounted () {
    setBodyScroll(true);
    const userId = Cookie.get('userId');
    triggerService({ eventId: '14-2-11-1' }); // 历史订单页曝光
    getOrderListByUserId(userId).then(data => {
      this.orderList = data;
    });
  },
  beforeDestroy () {
    setBodyScroll(false);
  },
};
</script>

<style lang="less" scoped>
@import url("./coins.less");
.inner {
    height: 100%;
    background: #f6f6f6;
    .flex-b-c {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .flex-s-c {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .order-list {
      box-sizing: border-box;
      color: #999999;
      font-size: 12px;
      margin: 16px 10px;
      font-weight: bold;
    }
    .order-item {
        position: relative;
        box-sizing: border-box;
        background-color: #ffffff;
        margin: 0 auto 10px;
        border-radius: 10px;
        padding: 12px;
        border: 1px solid rgba(224, 224, 224, 1);
        > section {
            margin-bottom: 6px;
            padding-bottom: 4px;
            border-bottom: 2px #F7F7F7 dashed;
            .coin-img {
                width: 24px;
                height: 22px;
                margin-right: 12px;
            }
            .item-coin-num {
                color: #000;
                font-size: 12px;
            }
            .item-status, .item-btn-info {
                max-width: 130px;
                border-radius: 4px;
                padding: 0 4px;
                color: #ffffff;
                height: 24px;
                text-align: center;
                line-height: 24px;
                margin-left: 8px;
                background-color: #f7b500;
                &.fail {
                    background-color: #6dd35a;
                }
            }
            .item-status {
              padding: 0 4px;
            }
            .item-btn-info {
                background: #169bd5;
                margin-left: auto;
                margin-right:8px;
                padding: 4px;
            }
            .item-report {
                max-width: 130px;
                /*height: .5rem;*/
                font-size: 12px;
                font-weight: bold;
                height: 34px;
                line-height: 34px;
                text-align: center;
                border-radius: 15px;
                color: #fff;
                padding: 0 10px;
                background: rgba(107, 16, 255, 1);
            }
            .text-ellipsis {
                display: inline-block;
                white-space: nowrap !important;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
        > p {
            margin-bottom: 4px;
            font-weight: normal;
            color: #000;
            .item-detail {
                color: #999999;
                &.item-id {
                    display: inline-block;
                    width: 140px;
                }
            }
            .item-copy {
                width: 10px;
                height: 10px;
                margin-top: 6px;
                margin-right: 6px;
            }
        }
    }
    .order-empty {
        width: 105px;
        height: 64;
        display: block;
        margin: 76px auto 12px;
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
  .inner  > .order-list {
    direction: rtl;
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
.text-center{
  text-align: center;
  color: #000;
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
      background: #f6f6f6;
    }
    .btn-back {
      display: none;
    }
  }
}
</style>

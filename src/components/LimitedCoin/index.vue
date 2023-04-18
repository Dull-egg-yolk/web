<template>
  <base-pop class="pop-public limit-coin" :outClickCancel="false" :showPop="showLimitPop">
    <div class="limit-coin__con">

      <p class="pop-banner-txt" v-html="$t('webChat.limitedToastTips', { xx: conf.discount, yy: conf.limitMinutes })">
      </p>
      <p class="pop-banner-txt">{{ $t('webChat.limitedToastOnce') }}</p>
      <div class="limit-coin__img">
        <div class="limit-left">
          <div class="countdown-box">
            <count-down :endTime="endTime" @endCountDownData="countDownEnd" :showTime="true"
              :showDelimiter="false"></count-down>
          </div>
        </div>
        <div class="limit-right">
          <div class="coin-left">
            <i class="coin-icon"></i>
            {{ conf.totalCoinNum }}
          </div>
          <div class="coin-right">
            <div class="coin-dis-price">{{ conf.currency }}{{ conf.beforeAmount }}</div>
            <div class="coin-org-price">{{ conf.currency }}{{ conf.afterAmount }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="pop-action">
      <div class="m-btn major" @click="goToBuy">{{ $t('webChat.limitedBuy') }}</div>
      <div class="m-btn white" @click="closePop">{{ $t('webChat.limitedCancel') }}</div>
    </div>
  </base-pop>
</template>

<script>
import { mapState } from 'vuex';
import BasePop from '../BasePop.vue';
import { logReport } from '@/util/logReport';
import CountDown from '@/components/CountDown';
import { toGlobal } from '@/util/shop';
import { checkWebUserAndGetCoinAndChannel } from '@/api/shop';
import { getPlatformType } from '@/util/browser';
export default {
  name: 'LimitedCoin',
  data () {
    return {
      showLimitPop: false,
      endTime: 1677074400000,
      conf: {}
    };
  },
  props: {
    resource: { type: String, require: true, default: '' },
    isShowLimited: { type: Boolean, default: false },
  },
  components: {
    BasePop,
    CountDown,
  },
  computed: {
    ...mapState({
      friendId: (state) => state.agora.bizData.remoteUserInfo.id,
    }),
  },
  watch: {
    isShowLimited: {
      handler (val) {
        console.log('---isShowLimited--组件内--', val);
        if (val && getPlatformType() === 'mobile') {
          this.getLimitedCoin();
        }
      },
      immediate: true
    }
  },
  methods: {
    closePop () {
      logReport({
        eventId: '106-1-15-3', // 限时优惠包弹窗取消点击
        freeName2: window.$mObj.adData || {},
        target_user_id: this.friendId,
        r_resource: this.resource,
        coin: this.conf.totalCoinNum,
      });

      this.showLimitPop = false;
    },

    goToBuy () {
      logReport({
        eventId: '106-1-15-2', // 限时优惠包弹窗去充值点击
        freeName2: window.$mObj.adData || {},
        target_user_id: this.friendId,
        r_resource: this.resource,
        coin: this.conf.totalCoinNum,
      });
      this.showLimitPop = false;
      this.$store.commit('setDisCoinIframe', 'limited');
    },

    async getLimitedCoin () {
      // 获取金币包
      console.log('--限时----获取金币包------');
      const ab = localStorage.getItem('RC_USER_COUNTRY_CODE');
      const selCountryCode = toGlobal(ab);

      try {
        const res = await checkWebUserAndGetCoinAndChannel({ countryCode: selCountryCode });
        console.log(res, '---限时----金币包');
        const flashCoinChannel = (res.data && res.data.flashCoinChannel) || [];
        const webFlashUserSeals = (res.data && res.data.webFlashUserSeals) || [];
        const coinChannel = flashCoinChannel[0] || [];
        const conf = webFlashUserSeals[0] || {};
        const coin = coinChannel.rcpCoinCountry || {};
        const channel = coinChannel.channelAndPayCompanyDtoList ? coinChannel.channelAndPayCompanyDtoList[0] : {};
        const obj = {
          coin,
          channel,
          conf,
        };
        const now = Date.now();
        logReport({
          eventId: '106-1-15-0', // 限时优惠包请求结果
          freeName2: window.$mObj.adData || {},
          target_user_id: this.friendId,
          r_resource: this.resource,
          coin: conf.totalCoinNum,
          res: conf.endTime >= now
        });
        if (conf.endTime >= now) {
          logReport({
            eventId: '106-1-15-1', // 限时优惠包弹窗曝光
            freeName2: window.$mObj.adData || {},
            target_user_id: this.friendId,
            r_resource: this.resource,
            coin: conf.totalCoinNum,
          });
          this.showLimitPop = true;
          this.conf = conf;
          this.conf.discount = parseInt(conf.discount);
          this.endTime = conf.endTime;
          this.$store.commit('setLimitCoinConf', obj);
        } else {
          const resetObj = {
            coin: {},
            channel: {},
            conf: {},
          };
          this.$store.commit('setLimitCoinConf', resetObj);
        }
      } catch (error) {
        logReport({
          eventId: '106-1-15-0', // 限时优惠包请求结果
          freeName2: window.$mObj.adData || {},
          target_user_id: this.friendId,
          r_resource: this.resource,
          res: 'error'
        });
        const resetObj = {
          coin: {},
          channel: {},
          conf: {},
        };
        this.$store.commit('setLimitCoinConf', resetObj);
      }
    },

    countDownEnd () {
      console.log('----计时结束---');
    }
  },
};
</script>

<style lang="less" scoped>
@import url('~@/style/var.less');

.limit-coin__con {
  position: relative;
  box-sizing: border-box;
  padding: 20px 13px 0;

  .limit-coin__img {
    margin-top: 12px;
    width: 289px;
    height: 69px;
    background: url(~@/assets/img/limited-coin-bg.png) center no-repeat;
    background-size: contain;
    display: flex;

  }

  .limit-left {
    width: 110px;
    position: relative;

    .countdown-box {
      position: absolute;
      left: 39px;
      top: 36px;

      .hour {
        display: none;
      }
    }
  }

  .limit-right {
    width: 179px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    .coin-left {
      display: flex;
      align-items: center;
      position: relative;
      font-size: 24px;
      font-family: Futura-Bold, Futura;
      font-weight: bold;
      color: #000000;

      &::after {
        content: '';
        position: absolute;
        right: -10px;
        width: 1px;
        height: 16px;
        background: #DDA560;
      }

      .coin-icon {
        width: 24px;
        height: 24px;
        display: inline-block;
        background: url(~@/assets/img/tumile/icon-s-coin.png) right center no-repeat;
        background-size: auto 26px;
        margin-right: 5px;
      }
    }

    .coin-right {

      font-size: 18px;
      font-family: Helvetica-Bold, Helvetica;
      font-weight: bold;
      color: #000000;
      line-height: 22px;
      text-align: center;

      .coin-org-price {
        font-size: 14px;
        line-height: 16px;

        &::before,
        &::after {
          content: '';
          display: block;
          height: 1px;
          width: 100%;
          background: #FF0000FF;
          transform: rotateZ(18deg) translateY(9px);
        }

        &::after {

          transform: rotateZ(-18deg)translateY(-9px);
        }
      }
    }
  }
}

[lang="ar"],
[lang="he"],
[lang="ur"] {
  .limit-coin__img {
    direction: ltr;
  }
}
</style>

<style lang="less">
.limit-coin {
  .pop-content {
    height: auto !important;
  }

  .pop-banner-txt {
    text-align: center;
    padding: 0 6px;
    font-size: 13px;
    font-family: Futura-Bold, Futura;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 21px;
  }

  .countdown-box {
    [name="hour"] {
      display: none;
    }

    span {
      width: 19px;
      height: 19px;
      font-size: 14px;
      display: inline-block;
      font-family: Impact;
      color: #211710;
      line-height: 17px;
      text-align: center;

    }

    span+span {
      margin-right: 10px;
    }
  }

  .pop-bg {
    background: #0000;
  }

}

@media screen and (max-width: 680px) {
  .limit-coin {
    .pop-content {
      height: auto;
    }

    .pop-banner-txt {
      // margin-top: 10px;
    }
    .pop-action {
      .major {
        padding: 0 12px;
        text-align: center;
      }
    }
  }
}
</style>

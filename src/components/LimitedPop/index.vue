<template>
  <div class="limited-pop" @click="goToBuy" v-if="show">
    <div class="limited-pop-box" >
      <count-down :endTime="endTime" @endCountDownData="countDownEnd" :showTime="true"></count-down>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { logReport } from '@/util/logReport';
import CountDown from '@/components/CountDown';

export default {
  name: 'LimitedPop',
  data () {
    return {
      show: false,
    };
  },

  components: {
    CountDown,
  },
  props: {},
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
      limitCoinConf: (state) => state.app.limitCoinConf,
      endTime: (state) => state.app.limitCoinConf.conf.endTime,
    })
  },
  watch: {
    endTime (n) {
      this.checkShow();
    },
    $route: 'checkShow',
  },
  methods: {
    goToBuy () {
      logReport({
        eventId: '106-1-1-86', // 限时优惠包倒计时入口点击
        freeName2: window.$mObj.adData || {},
        r_resource: this.$route.name,
        coin: this.limitCoinConf.conf && this.limitCoinConf.conf.totalCoinNum,
      });

      this.$router.push({ name: 'CoinPage' });
    },
    countDownEnd () {
      this.show = false;
      const resetObj = {
        coin: {},
        channel: {},
        conf: {},
      };
      this.$store.commit('setLimitCoinConf', resetObj);
    },
    checkShow () {
      const name = this.$route.name;
      if (!this.endTime || !['LivCam', 'GoddessWall', 'MessagePage', 'FriendsPage'].includes(name)) {
        this.show = false;
        return;
      };
      const now = Date.now();
      if (this.endTime >= now) {
        this.show = true;
        logReport({
          eventId: '106-1-1-85', // 限时优惠包倒计时入口曝光
          freeName2: window.$mObj.adData || {},
          r_resource: name,
          coin: this.limitCoinConf.conf && this.limitCoinConf.conf.totalCoinNum,
        });
      } else {
        this.show = false;
      }
    }

  },
};
</script>

<style lang="less">
.limited-pop {
  position: fixed;
  z-index: 120;
  left: 5px;
  top: 50px;
  width: 93px;
  height: 71px;
  background: url(~@/assets/img/limited-pop-bg.png) center center no-repeat;
  background-size: contain;
  color: #fff;

  .limited-pop-box {
    position: absolute;
    left: 32px;
    bottom: 5px;
    text-align: center;

    [name="hour"] {
      display: none;
    }
  }
}
</style>

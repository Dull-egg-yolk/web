<template>
  <div>
    <div class="download-page" @touchmove.stop.prevent>
      <div class="down-close hover" @click="closeBtn"><span class="icon-cross"></span></div>
      <div class="logo"><span class="icon"></span></div>
      <div class="active-number">
        <count-to class="num" :startVal="starVal" :endVal="endVal" :duration="duration" @mountedCallback="countCb">
        </count-to>
        <p class="slogn">{{  $t('webChat.peopleUsing')  }}</p>
      </div>
      <div class="content">
        <a class="icon google" :href="this.downLoadLink ? this.downLoadLink : this.link1" target="_blank" @click="downLoadBtn"></a>
        <a class="icon app" :href="this.downLoadLink ? this.downLoadLink : this.link1" target="_blank" @click="downLoadBtn"></a>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from 'vue-count-to';
import { logReport } from '@/util/logReport';
export default {
  data () {
    return {
      starVal: 0,
      endVal: 0,
      duration: 500,
      countTimer: null,
      downLoadLink: ''
    };
  },

  components: {
    countTo
  },
  computed: {},

  methods: {
    countCb () {
      // 计数器
      if (this.countTimer === null) {
        this.starVal = 0;
        this.endVal = +localStorage.getItem('RC_COUNT_NUM') || 122987212;
      } else {
        this.duration = 1000;
        this.starVal = this.endVal;
        this.endVal = this.starVal + Math.floor(Math.random() * 10 + 1);
      }

      this.countTimer = setTimeout(() => {
        this.countCb();
        localStorage.setItem('RC_COUNT_NUM', this.endVal);
      }, this.duration);
    },
    closeBtn () {
      this.$emit('close', false);
    },
    downLoadBtn () {
      // 点击下载
      logReport({ eventId: '106-1-11-2' });
    }
  },
  created () {
    this.downLoadLink = window.AF_SMART_SCRIPT_RESULT.clickURL;
    // 下载页面曝光
    logReport({ eventId: '106-1-11-1' });
  }
};
</script>
<style lang='less' scoped>
@media screen and(max-width: 680px) {
  .download-page {
    position: fixed;
    bottom: 0;
    background: #22202D;
    border-radius: 20px 20px 0 0;
    width: 100%;
    z-index: 99;

    .active-number {
      padding: 10px 0 5px;
      text-align: center;

      .num {
        font-size: 40px;
        font-family: Helvetica-Bold, Helvetica;
        font-weight: bold;
        color: #FFFFFF;
        line-height: 30px;
      }

      .slogn {
        padding-top: 10px;
        font-size: 14px;
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 20px 0 20px 0;

      .icon {
        width: 200px;
        height: 50px;
        margin-bottom: 10px;
        border-radius: 10px;
      }
      .google {
        background: url(~@/assets/img/google.png) center center no-repeat;
        background-size: 100% auto;
      }
      .app {
        background: url(~@/assets/img/app.png) center center no-repeat;
        background-size: 100% auto;
      }
    }

    .logo {
      margin: 30px 20px 20px 40px;

      .icon {
        display: block;
        width: 150px;
        height: 60px;
        background: url(~@/assets/img/tumile/logo.png) center no-repeat;
        background-size: 100% auto;
        margin: 0 auto;
      }
    }

    .down-close {
      cursor: pointer;
      font-size: 18px;
      width: 46px;
      height: 46px;
      background: rgba(14, 20, 28, .8);
      color: #fff;
      text-align: center;
      border-radius: 23px;
      line-height: 46px;
      position: absolute;
      right: 20px;
      top: 10px;

      .icon-cross {
        font-size: 16px;
      }
    }
  }
}
</style>

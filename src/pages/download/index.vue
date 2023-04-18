<template>
  <div class="download-page">
    <div class="active-number">
      <count-to class="num" :startVal="starVal" :endVal="endVal" :duration="duration" @mountedCallback="countCb">
      </count-to>
      <p class="slogn">{{ $t('webChat.peopleUsing') }}</p>
    </div>
    <div class="content">
      <img src="@/assets/img/download-bg.png" alt="" class="download-bg" />
      <div class="livu">
        <div class="img0">
          <img src="@/assets/img/download-livu.png" alt="" />
          <img src="@/assets/img/download-img1.png" alt="" class="bounce img1" />
          <img src="@/assets/img/download-img2.png" alt="" class="bounce img2" />
          <img src="@/assets/img/download-img3.png" alt="" class="bounce img3" />
          <img src="@/assets/img/download-img4.png" alt="" class="bounce img4" />
          <img src="@/assets/img/download-img5.png" alt="" class="bounce img5" />
          <img src="@/assets/img/download-img6.png" alt="" class="bounce img6" />
          <img src="@/assets/img/download-img7.png" alt="" class="bounce img7" />
          <img src="@/assets/img/download-img8.png" alt="" class="bounce img8" />
          <img src="@/assets/img/download-left.png" alt="" class="img9" />
          <img src="@/assets/img/download-right.png" alt="" class="img10" />
          <img src="@/assets/img/download-video.png" alt="" class="img11" />
          <img src="@/assets/img/download-icons.png" alt="" class="img12" />
          <div class="dian1"></div>
          <div class="dian2"></div>
          <div class="dian3"></div>
          <div class="dian4"></div>
        </div>
      </div>
      <div class="download-btn">
        <a class="icon google" :href="this.downLoadLink ? this.downLoadLink : this.link1" target="_blank" @click="downLoad"></a>
        <a class="icon app" :href="this.downLoadLink ? this.downLoadLink : this.link1" target="_blank" @click="downLoad"></a>
      </div>
      <p class="foorter-title">Download LivU App For Fre Now!</p>
      <div class="foorter">
        <p>LivU supports video calling, video matching and text chat, and users can choose different ways to meet and
          get to know friends according to their needs.</p>
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
    downLoad () {
      window.gtag && window.gtag('event', 'GoMeetDownloadApp ', { send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'] });
      // 下载App
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
@import url("./index.less");
</style>

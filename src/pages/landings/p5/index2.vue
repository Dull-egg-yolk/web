<template>
  <div class="page-body">
  <div class="body-warp" id="body-warp">
    <!-- <swiper :options="swiperOptions">
      <swiper-slide>
        <img src="@/assets/img/h5download/p5-bannger.png" alt="banner0" />
      </swiper-slide>
      <swiper-slide>
        <img src="@/assets/img/h5download/p5-bg.jpg" alt="banner1" />
      </swiper-slide>
    </swiper> -->
    <div class="sweper-top">
      <img src="@/assets/img/h5download/p5-bg.jpg" alt="banner1" />
    </div>
    <div class="img-list" v-if="showList">
      <ul class="image-box" v-for="(itme, index) in videoListLop" :key="index">
        <li class="big-img" @click="showDialog(itme.big, itme.big.userName, 'woman', itme.big.fabulous)">
          <div class="online">عبر الإنترنت</div>
          <video v-if="index === 0" autoplay muted :poster="itme.big.headImg" loop playsinline webkit-playsinline
            style="object-fit: cover; width: 100%; height: 100%;" x5-video-player-type="h5"
            x5-video-orientation="portraint">
            <source :src="itme.big.videoUrl" />
          </video>
          <video v-else-if="index === 1" autoplay muted :src="itme.big.videoUrl" :poster="itme.big.headImg" loop
            playsinline webkit-playsinline style="object-fit: cover; width: 100%; height: 100%;"
            x5-video-player-type="h5"></video>
          <img v-else :src="itme.big.headImg" alt="imgaes" />
          <div class="img-bottom-des">
            <span class="name">{{ itme.big.userName }}</span>
          </div>
          <div class="like">{{ itme.big.like }}</div>
        </li>
        <li class="small-img">
          <span @click="showDialog(itme.small1, itme.small1.userName, 'woman', itme.small1.fabulous)">
            <div class="online">عبر الإنترنت</div>
            <img :src="itme.small1.headImg" alt="imgaes" />
            <div class="img-bottom-des">
              <span class="name">{{ itme.small1.userName }}</span>
            </div>
            <div class="like">{{ itme.small1.like }}</div>
          </span>
          <span @click="showDialog(itme.small2, itme.small2.userName, 'woman', itme.small2.fabulous)">
            <div class="online">عبر الإنترنت</div>
            <img :src="itme.small2.headImg" alt="imgaes" />
            <div class="img-bottom-des">
              <span class="name">{{ itme.small2.userName }}</span>
            </div>
            <div class="like">{{ itme.small2.like }}</div>
          </span>
        </li>
      </ul>
    </div>
    <a class="bottom-wrap"  @click.stop="DownloadApp()">
      <div class="btn-bottom"><img src="@/assets/img/h5download/video.png" />
        <div>العب مجانا</div>
      </div>
    </a>
    <!-- 播放器 -->
    <transition enter-active-class="showPop" leave-active-class="hidePop" :duration="{ enter: 300, leave: 300 }">
      <a class="story-player" v-if="showVideo" target="_blank" @click="DownloadApp(curHostData)">
        <div class="body">
          <div class="top-close"><img src="@/assets/img/h5download/video_favor.png" /></div>
          <div class="top-wrap">
            <div class="detail">
              <div class="avatar">
                <img :src="curHostData.headImg" alt="">
              </div>
              <div class="info">
                <div class="nickname">{{ curHostData.userName }}</div>
                <div class="local">
                  <span><img src="@/assets/img/h5download/icon_video_favor.png" /> {{ curHostData.fabulous }}
                  </span>
                  <span><img src="@/assets/img/h5download/combined.png" /> {{ curHostData.country }}</span>
                </div>
              </div>
            </div>
            <div class="video-add" @click.stop="closeBtn"><img src="@/assets/img/h5download/close-icon.png" /></div>
          </div>
          <div class="middle-wrap">
            <div class="video-report"><img src="@/assets/img/h5download/video_report.png" /></div>
            <div class="video-favor"><img src="@/assets/img/h5download/video_add.png" /></div>
          </div>
          <div class="gift"> <img src="@/assets/img/h5download/icon_video_gift.png" /></div>
          <div class="bottom-wrap" @click.stop="DownloadApp()">
            <div class="btn-bottom"><img src="@/assets/img/h5download/video.png" />
              <div>العب مجانا</div>
            </div>
          </div>
          <div id="video-box" style="display:none">{{ bulletChat[Math.round(Math.random() * 20)].one }}</div>
          <div id="video-box1" style="display:none">{{ bulletChat[Math.round(Math.random() * 20)].two }}</div>
          <div class="video-load" v-if="videoLoad"></div>
          <video ref="vplayer" autoplay :src="curHostData.videoUrl" :poster="curHostData.headImg" loop playsinline
            webkit-playsinline></video>
        </div>
      </a>
    </transition>
    <!-- Dialog -->
    <!-- <Dialog :apk="downloadHref" :userId="userId" :isShow="show" :isShowTwo="showTwo" @close="closeFn"></Dialog> -->
    <backTop></backTop>
  </div>
</div>
</template>

<script>
import { videoListLop } from './p3';
import { bulletChat } from '../Advertising/bulletChat';
import backTop from './back-top.vue';
import { logReport } from '@/util/logReport';
import { getCountry } from '@/util/getCountry';
import { mapState } from 'vuex';
let num = 0;
let timeNum = 10;
export default {
  name: 'dspIN006',
  data () {
    return {
      showVideo: false,
      showList: true,
      show: false,
      timmer: null,
      count: 0,
      showTwo: false,
      videoListLop,
      bulletChat,
      link: 'https://livuchat.me',
      userId: '',
      showPopup: false,
      hostData: [],
      videoLoad: false,
      videoIndex: [],
      clickNum: 0,
      videoCancelTimer: null,
      cancelTimer: null,
      closeClear: null,
      swiperOptions: {
        slidesPerView: 'auto',
        autoplay: {
          delay: 2000,
          disableOnInteraction: false
        },
        loop: true,
        direction: 'horizontal',
        speed: 800,
        on: {
          click: () => {
            // window.open(this.link + window.location.search + '&register=1')
            // if (window.location.search) {
            //   window.location.href = this.link + window.location.search + '&register=1';
            // } else {
            //   window.location.href = this.link + '?register=1';
            // }
            // triggerService({ eventId: '105-7-1-15', freeName1: { url: 'p5', userId: this.userId, incomingUrl: 'https://downloads.livu.me' + `${this.$route.fullPath}`, bounceUrl: window.location.search || '' } })
          }
        }
      }
    };
  },
  computed: {
    curHostData () {
      const data = this.videoIndex;
      return data;
    },
    ...mapState({
      isLogin: (state) => state.app.isLogin
    }),
  },
  methods: {
    onLink () {
      // window.open(this.link + window.location.search + '&register=1')
      // window.location.href = this.link + window.location.search + '&register=1'
      if (window.location.search) {
        window.location.href = this.link + window.location.search + '&register=1';
      } else {
        window.location.href = this.link + '?register=1';
      }
    },
    // 点女神图片
    showDialog (data, name, sex, age) {
      this.clickNum++;
      this.showVideo = true;
      this.showList = false;
      this.videoIndex = data;
      this.videoLoad = true;
      const videoLST = new Date().getTime();
      this.$nextTick(() => {
        this.$refs.vplayer && this.$refs.vplayer.addEventListener('playing', () => {
          console.log('playing');
          const vLET = new Date().getTime() - videoLST;
          this.videoLoad = false;
          timeNum = 10;
          this.videoBox();
          this.cutNum();
        });
      });
    },
    videoBox () {
      setTimeout(() => {
        if (document.body.querySelector('#video-box')) {
          document.body.querySelector('#video-box').setAttribute('class', 'video-box');
        }
      }, 1000);
      setTimeout(() => {
        if (document.body.querySelector('#video-box1')) {
          document.body.querySelector('#video-box1').setAttribute('class', 'video-box1');
        }
      }, 4000);
    },
    // 倒计时
    cutNum () {
      if (timeNum > 0) {
        console.log(timeNum, 'timeNum');
        this.videoCancelTimer = setTimeout(() => {
          timeNum -= 1;
          this.cutNum();
        }, 1000);
      } else {
        this.showVideo = false;
        this.showList = true;
        setTimeout(() => {
          // 进入页面2秒弹窗
          if (Math.floor((Math.random() * 2) + 1) === 1) {
            this.showTwo = true;
            this.showPopup = false;
          } else {
            this.show = true;
            this.showPopup = false;
          }
        }, 2000);
        this.cancelTimer = setTimeout(() => {
          if (this.showVideo === false) {
            clearTimeout(this.closeClear);
            this.closeClear = null;
            if (Math.floor((Math.random() * 2) + 1) === 1) {
              this.showTwo = true;
              document.documentElement.style.overflow = 'hidden';
              this.showPopup = false;
            } else {
              this.show = true;
              document.documentElement.style.overflow = 'hidden';
              this.showPopup = false;
            }
          }
        }, 60000);
      }
    },
    // 下载
    DownloadApp (data) {
      // if (window.location.search) {
      //   window.location.href = this.link + window.location.search + '&register=1';
      // } else {
      //   window.location.href = this.link + '?register=1';
      // }
      logReport({
        eventId: '106-6-1-1',
        free_name2: Object.assign({
          from: 'gomeet-waterfall3'
        }, window.$mObj.adData || {}),
      });
      window.$mObj.adData.lpName = 'gomeet-waterfall3';
      localStorage.setItem('lpName', 'gomeet-waterfall3');
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
      localStorage.setItem('LANDINGSPAGE', true);
    },
    getTime () {
      if (localStorage.getItem('userId')) {
        this.userId = localStorage.getItem('userId');
        this.showPopup = true;
      } else {
        var userId = this.randomCoding() + new Date().valueOf();
        this.showPopup = true;
        this.userId = userId;
        localStorage.setItem('userId', this.userId);
      }
      var hostList = [];
      this.videoListLop.forEach(element => {
        hostList.push(element.big);
        hostList.push(element.small1);
        hostList.push(element.small2);
      });
      setTimeout(() => {
        const t = window.performance.timing;
        const performanceInfo = [{
          key: 'domContentLoad',
          desc: 'DOM 加载完成时间',
          'value(ms)': t.domInteractive - t.navigationStart
        }];
        this.timing = performanceInfo[0]['value(ms)'];
      }, 0);
    },
    randomCoding () {
      var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      var idvalue = '';
      const n = 1;
      for (var i = 0; i < n; i++) {
        idvalue += arr[Math.floor(Math.random() * 26)];
      }
      return idvalue;
    },
    // dialog关闭事件
    closeFn () {
      document.documentElement.style.overflow = 'scroll';
      this.show = false;
      this.showTwo = false;
      this.closeClear = setTimeout(() => {
        console.log(this.clickNum);
        console.log(this.showPopup);
        console.log(this.showVideo, 'this.showVideo');
        if (this.showVideo === false) {
          // eslint-disable-next-line eqeqeq
          if (Math.floor((Math.random() * 2) + 1) == 1) {
            this.showTwo = true;
            document.documentElement.style.overflow = 'hidden';
            this.showPopup = false;
          } else {
            this.show = true;
            document.documentElement.style.overflow = 'hidden';
            this.showPopup = false;
          }
        }
      }, 60000);
    },
    closeBtn () {
      this.showVideo = false;
      this.showList = true;
      clearTimeout(this.videoCancelTimer);
      this.videoCancelTimer = null;
      clearTimeout(this.cancelTimer);
      this.cancelTimer = null;
    },
    // 轮播图
    autoPlay () {
      var imgs = document.body.querySelectorAll('.banner-top img');
      if (++num >= imgs.length) num = 0;
      this.changePic(num);
    },
    // 定义切换
    changePic (curIndex) {
      var imgs = document.body.querySelectorAll('.banner-top img');
      for (var i = 0; i < imgs.length; ++i) {
        imgs[i].style.display = 'none';
      }
      imgs[curIndex].style.display = 'block';
    }
  },
  components: {
    // Dialog: () => import('./dialog'),
    backTop
  },
  created () {
    document.documentElement.style.overflow = 'scroll';
    window.addEventListener('load', this.getTime, false);
    window.addEventListener('load', (e) => {
      setTimeout(() => {
      }, 0);
    });
    setTimeout(() => {
      console.log(this.clickNum);
      if (this.clickNum === 0) {
        // 进入页面5秒弹窗
        // eslint-disable-next-line eqeqeq
        if (Math.floor((Math.random() * 2) + 1) == 1) {
          if (this.showPopup) {
            this.showTwo = true;
            document.documentElement.style.overflow = 'hidden';
            this.showPopup = false;
          }
        } else {
          if (this.showPopup) {
            this.show = true;
            document.documentElement.style.overflow = 'hidden';
            this.showPopup = false;
          }
        }
      }
    }, 5000);
  },
  mounted () {
    getCountry('gomeet-waterfall3');
    // setInterval(this.autoPlay, 3000)
  }
};
</script>

<style lang="less" ref="stylesheeet/css" scoped>
@import '~@/style/rem-px.less';
.page-body {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  overflow-y: scroll;
  background: linear-gradient(178deg, #FFA8E7 0%, #FFF3F9 50%, #FFF3F9 100%);
  padding: 0;
}
.to-top {
  width: 50px;
  height: 50px;
  position: fixed;
  right: 5px;
  bottom: 15px;
  background: center center / contain no-repeat transparent;
  transition: opacity 300ms ease 0s;
  cursor: pointer;
  z-index: 999;
}

.swiper-slide {

  img {
    max-width: 100%;
  }
}

.swiper-slide img {
  width: 100%;
  height: 100%;
}

.swiper-container {
  width: 100%;
  height: 160px;
}

.story-player {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 100;

  &.showPop {
    .body {
      animation: showPop 0.4s both;
    }
  }

  &.hidePop {
    .body {
      animation: hidePop 0.4s both;
    }
  }

  .play-link {
    display: flex;
    /* justify-content: space-between; */
    padding: 0.53333rem 0.26667rem;
    background: url(~@/assets/img/h5download/pink.png) center no-repeat;
    z-index: 999;
    position: fixed;
    width: 100%;
  }

  .body {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #555;
    transform-origin: center bottom;
    box-sizing: border-box;

    &::after,
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 190px;
      left: 0;
      z-index: 10;
      pointer-events: none;
    }

    &::after {
      bottom: 0;
      background: linear-gradient(0, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
    }

    &::before {
      top: 0;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
    }

    video {
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 1;
      object-fit: cover
    }

    .video-load {
      position: absolute;
      z-index: 100;
      width: 50px;
      opacity: .3;
      height: 50px;
      background: url(~@/assets/img/storyhost/icon-video-loading.png) center no-repeat;
      background-size: 100% auto;
      left: 50%;
      top: 50%;
      margin-left: -25px;
      margin-top: -25px;
      animation: loadAni 4s infinite linear;
    }

    .video-play {
      position: absolute;
      z-index: 100;
      width: 100%;
      height: 100px;
      left: 0;
      top: 50%;
      margin: -50px 0 0 0;
      background: url(~@/assets/img/storyhost/icon-play2.png) center no-repeat;
      background-size: 60px auto;
      opacity: 0.8;
      border-radius: 50%;
    }

    .video-add {
      margin-right: 20px;

      img {
        width: 45px;
        height: 45px;
      }
    }

    .top-close {
      position: absolute;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      top: 160px;
      left: 10px;
      z-index: 20;
      width: 100%;

      img {
        margin-right: 20px;
        width: 45px;
        height: 45px;
      }
    }

    .top-wrap {
      position: absolute;
      display: flex;
      justify-content: space-between;
      align-items: center;
      top: 20px;
      left: 10px;
      z-index: 20;
      width: 100%;

      .detail {
        display: inline-flex;
        align-items: center;
        color: #fff;
        border-radius: 50px;
        background: rgba(0, 0, 0, 0.3);
        padding: 2px 10px 2px 2px;

        .avatar {
          width: 52px;
          height: 52px;
          overflow: hidden;
          border-radius: 50%;
          margin-right: 5px;
          position: relative;

          img {
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            height: auto;
          }
        }

        .info {
          line-height: 1;
          font-size: 12px;

          .nickname {
            font-size: 16px;
            font-weight: bold;
            max-width: 200px;
            height: 12px;
            text-overflow: ellipsis;
            margin: 0 10px 10px 0;
            white-space: nowrap;
          }

          .local {
            margin-right: 10px;

            img {
              width: 10px;
              height: 10px;
            }
          }
        }

      }
    }

    .middle-wrap {
      display: flex;
      justify-content: space-between;
      position: absolute;
      top: 70px;
      left: 10px;
      z-index: 20;
      width: 100%;
      margin-top: 20px;

      .video-favor {
        margin-right: 20px;
      }
    }

    .video-box {
      display: block !important;
      position: absolute;
      bottom: 10px;
      left: 10px;
      z-index: 99;
      animation: barrage 1s linear 0s;
      background-color: rgba(102, 27, 162, 0.51);
      border-radius: 12px;
      height: 42px;
      padding: 0 20px;
      color: #fff;
      font-size: 14px;
      text-align: center;
      line-height: 42px;
      animation-fill-mode: forwards
    }

    .video-box1 {
      display: block !important;
      position: absolute;
      bottom: 10px;
      left: 10px;
      z-index: 99;
      animation: barrages 1s linear 0s;
      background-color: rgba(102, 27, 162, 0.51);
      border-radius: 12px;
      height: 42px;
      padding: 0 20px;
      color: #fff;
      font-size: 14px;
      text-align: center;
      line-height: 42px;
      animation-fill-mode: forwards
    }

    .gift {
      position: absolute;
      top: 60%;
      right: 10px;
      z-index: 99;
    }

    .bottom-wrap {
      position: fixed;
      bottom: 20px;
      width: 100%;
      text-align: center;
      z-index: 99;
      text-decoration: none !important;
      .btn-bottom {
        background: linear-gradient(138deg, #A425FF 0%, #6B10FF 100%);
        width: 255px;
        height: 50px;
        border-radius: 10px;
        line-height: 50px;
        color: #fff;
        font-size: 17px;
        font-weight: 500;
        display: flex;
        justify-content: center;
        margin: 0 auto;
        animation: move 2s ease-in 1s infinite;
        img {
          width: 30px;
          height: 20px;
          margin-right: 10px;
          margin-top: 15px;
        }
      }

    }

    .btn-video-call {
      position: absolute;
      z-index: 20;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(138deg, #FC88BB 0%, #ce0b73 100%);
      border-radius: 28px;
      opacity: 0.87;

      &::after,
      &::before {
        content: '';
        position: absolute;
        z-index: 2;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: #000;
        background: linear-gradient(138deg, rgba(252, 136, 187, 0.9) 0%, rgba(252, 34, 150, 0.9) 100%);
        border-radius: 28px;
        opacity: 0;
      }

      &::after {
        animation: callBtnAni2 2s infinite linear;
      }

      &::before {
        animation: callBtnAni2 2s 1s infinite linear;
      }

      .inner {
        padding: 0 30px;
        height: 50px;
        display: flex;
        align-items: center;
        color: #fff;
        font-size: 15px;
        font-weight: bold;
        position: relative;
        z-index: 10;
        white-space: nowrap;

        .icon {
          display: inline-block;
          width: 20px;
          height: 20px;
          background: url(~@/assets/img/storyhost/icon-call.png) center no-repeat;
          background-size: 100% auto;
          margin-right: 10px;
        }
      }
    }
  }
}

.bottom-wrap {
  position: fixed;
  bottom: 20px;
  width: 100%;
  text-align: center;
  z-index: 99;
  text-decoration: none !important;

  .btn-bottom {
    background: linear-gradient(138deg, #A425FF 0%, #6B10FF 100%);
    width: 255px;
    height: 50px;
    border-radius: 10px;
    line-height: 50px;
    color: #fff;
    font-size: 17px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    animation: move 2s ease-in 1s infinite;

    img {
      width: 30px;
      height: 20px;
      margin-right: 10px;
      margin-top: 15px;
    }
  }

}

.host-title {
  // position: fixed;
  top: 0;
  height: 50px;
  width: 100%;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  padding: 18px 8px;
  background-color: #000;

  img {
    width: 50px;
    height: 50px;
    border-radius: 15px;
  }

  .title-text {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    margin-top: 8px
  }

  .p {
    font-size: 14px;
    font-weight: 400;
    margin-top: 5px;
    color: #fff;
  }

  .down {
    width: 70px;
    height: 30px;
    // border: 1px solid #6B10FF;
    border-radius: 5px;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    line-height: 30px;
    text-align: center;
    background-color: #fff;
    background: linear-gradient(138deg, #A425FF 0%, #6B10FF 100%);
    margin-top: 10px;
    margin-right: 15px;
  }
}

.body-warp {
  max-width: 750px;
  margin: 0 auto;
  // overflow-x: hidden;
  // overflow-y: scroll;
}

.top-bt {
  display: block;
  background: linear-gradient(90deg, #ea4879 0%, #eb7769 100%);
  border-radius: 5px;
  color: #ffffff;
  font-weight: bold;
  padding: 0.2rem 0.2rem;
  cursor: pointer;
  margin-right: 20px;

  &.b-bt {
    font-size: 12px;
    flex-shrink: 0;
  }
}

.banner {
  width: 100%;
  display: inline-block;

  img {
    width: 100%;
  }
}

.banner-top {
  position: relative;
  top: 2.25rem;
  z-index: 10;
  height: 3.7rem;
  overflow: hidden;

  .b-n-text {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 7.5rem;
    transform: translate(-50%, -50%);

    .number {
      color: #fe0a75;
      font-size: 36px;
      font-weight: bold;
      padding-left: 3.125rem;
      position: relative;
    }

    .number::before {
      content: "";
      position: absolute;
      top: 5px;
      left: 30%;
      width: 1rem;
      height: 1rem;
      background: url("~@/assets/img/h5download/position-icon.png") no-repeat;
      background-size: 100%;
    }

    .banner-text {
      font-size: 16px;
      line-height: 16px;
      text-align: center;
    }
  }
}

.b-1 {
  margin-top: 0.15625rem;
  background: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.28125rem 0.225rem;

  .banner-anim {
    display: flex;
    align-items: center;
  }

  .b-l-img {
    width: 2.5rem;

    img {
      max-width: 100%;
    }
  }

  .b-l-text {
    color: #ffffff;
    text-align: left;
    padding-left: 0.78125rem;
    font-size: 14px;
  }
}
.sweper-top{
  width: 100%;
  height: 240px;
  img{
    display: block;
    width: 100%;
    height: 100%;
  }
}

.img-list {
  // margin-top: 80px;
  width: 100%;

  .big-img {
    width: 50%;
    background-color: #666;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .small-img {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &>span {
      position: relative;
      display: block;
      background-color: #888;
      flex: 1;
      height: 45%;

      .img-bottom-des {
        position: absolute;
        bottom: 30px;
        left: 5px;
        text-align: left;
      }

      .like {
        position: absolute;
        bottom: 10px;
        left: 5px;
        width: 100px;
        text-align: left;
        font-size: 12px;
        color: #fff;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    span:first-child {
      margin-bottom: 0.15625rem;
    }
  }

  .image-box:nth-child(2),
  .image-box:nth-child(4),
  .image-box:nth-child(6),
  .image-box:nth-child(8),
  .image-box:nth-child(10),
  .image-box:nth-child(12),
  .image-box:nth-child(4),
  .image-box:nth-child(16),
  .image-box:nth-child(18) {
    direction: rtl;

    .img-bottom-des {
      direction: ltr;
    }

    .like {
      direction: ltr;
    }

    .big-img {
      margin-right: 0;
      margin-left: 0.15625rem;
    }
  }

  .image-box {
    display: flex;
    margin-top: 0.15625rem;
    height: 300px;

    li:first-child {
      margin-right: 0.15625rem;
    }

    .img-bottom-des {
      position: absolute;
      bottom: 30px;
      left: 5px;
      text-align: left;
    }

    .like {
      position: absolute;
      bottom: 10px;
      left: 5px;
      width: 100px;
      text-align: left;
      font-size: 12px;
      color: #fff;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .name {
      display: block;
      display: flex;
      align-items: center;
      color: #ffffff;
      font-weight: bold;
      font-size: 16px;
      line-height: 10px;
    }

    .woman {
      text-decoration: none;
      position: relative;
      background-color: #FF348B;
      color: #ffffff;
      padding-left: .625rem;
      border-radius: 3px;
      width: .4rem;
      height: .4rem;
      margin-left: .3125rem;

      em {
        font-size: 14px;
        line-height: 14px;
        display: block;
        transform: scale(0.75);
        margin-right: 0.5rem;
        margin-left: -0.1rem;
      }

      &::before {
        content: '';
        position: absolute;
        top: 0.0525rem;
        left: 0.1725rem;
        width: .2625rem;
        height: .2625rem;
        background: url(~@/assets/img/h5download/woman.png) no-repeat;
        background-size: 100%;
      }
    }

    .man {
      text-decoration: none;
      position: relative;
      background-color: #089ee6;
      color: #ffffff;
      padding-left: 0.625rem;
      border-radius: 3px;
      width: 1.875rem;
      height: 0.71875rem;
      margin-left: 0.3125rem;

      em {
        font-size: 12px;
        line-height: 12px;
        display: block;
        transform: scale(0.75);
      }

      &::before {
        content: "";
        position: absolute;
        top: 0.078125rem;
        left: 0.15625rem;
        width: 0.34375rem;
        height: 0.59375rem;
        // background: url("~@/assets/img/h5download/man.png") no-repeat;
        background-size: 100%;
      }
    }

    .position {
      display: block;
      color: #aeaeae;
      font-size: 12px;
      font-weight: bold;
      position: relative;
      padding-left: 0.78125rem;
      margin-top: 0;

      &::before {
        content: "";
        position: absolute;
        top: 1px;
        left: 0;
        width: 0.5rem;
        height: 0.6875rem;
        // background: url("~@/assets/img/h5download/position.png") no-repeat;
        background-size: 100%;
      }
    }
  }

  .online {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 55px;
    height: 21px;
    // background: url(~@/assets/img/h5download/online.png) no-repeat;
    background: #31ca3d;
    color: #fff;
    background-size: contain;
    padding: 2px 4px;
    border-radius: 10px;
  }
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 11;
  .rem-px(bottom, 10px);

  .d-bg {
    display: block;
    .rem-px(width, 250px);
    .rem-px(height, 80px);
    background: url(~@/assets/img/h5download/button-bg.png) no-repeat;
    background-size: 100%;
    animation: move 3s ease-in 1s infinite;
  }

  .bt-text-img {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-48%);
    background: url(~@/assets/img/h5download/button-text.png) no-repeat;
    background-size: 100%;
    .rem-px(width, 250px);
    .rem-px(height, 80px);
    z-index: 999;
  }

  @keyframes move {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.1);
    }

    100% {
      transform: scale(1);
    }
  }
}

@keyframes barrage {
  0% {
    bottom: 15%;
    opacity: 0;
    transform: translateY(100%) scaleY(1);
  }

  100% {
    bottom: 25%;
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }
}

@keyframes barrages {
  0% {
    bottom: 15%;
    opacity: 0;
    transform: translateY(100%) scaleY(1);
  }

  100% {
    bottom: 18%;
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }
}

@keyframes loadAni {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

.text {
  position: fixed;
  left: 0;
  right: 0;
  .rem-px(bottom, 30px);
  text-decoration: underline;
  color: #ffffff;
  font-size: 14px;
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.4);
}
@media screen and(max-width: 680px) {
  .sweper-top{
    width: 100%;
    height: 134px;
  }
}
</style>

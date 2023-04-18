<template>
  <div class="page-body" @touchstart.stop>
    <div class="home-page">
      <div class="card-list">
        <div class="ocard " :class="`card-card-${index+1}`" v-for="(item, index) in hostList[0]" :key="index">
          <span class="video-load" v-if="!videoLoad"></span>
          <video autoplay muted :src="item.videoUrl" :poster="item.headImg" loop playsinline
              webkit-playsinline style="object-fit: cover; width: 100%; height: 100%;" @play="videoLoad = true;"></video>
            <div class="top-close"><img src="@/assets/img/h5download/video_favor.png" /></div>
            <div class="top-wrap">
              <div class="detail">
                <div class="avatar">
                  <img :src="item.headImg" alt="">
                </div>
                <div class="info">
                  <div class="nickname">{{ item.userName }}</div>
                  <div class="local">
                    <span><img src="@/assets/img/h5download/icon_video_favor.png" /> {{ item.fabulous }}
                    </span>
                    <span><img src="@/assets/img/h5download/combined.png" /> {{ item.country }}</span>
                  </div>
                </div>
                </div>
            </div>
            <div class="middle-wrap">
              <div class="video-report"><img src="@/assets/img/h5download/video_report.png" /></div>
              <div class="video-favor"><img src="@/assets/img/h5download/video_add.png" /></div>
            </div>
            <div class="button">
              <div class="play" @click="goToPlay">Go to play</div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setBodyScroll } from '@/util/index';
import { logReport } from '@/util/logReport';
import { mapState } from 'vuex';
import { getCountry } from '@/util/getCountry';
import { videoListLop, countryList } from './Advertising/list';
export default {
  data () {
    return {
      dom: '',
      cardDom: '',
      canMove: '',
      domPos: '',
      mvpos: '',
      stpos: '',
      cardidx: '',
      wh: '',
      hostList: [],
      videoLoad: false,
    };
  },

  components: {},
  // watch: {
  //   isLogin (n, v) {
  //     if (n) {
  //       this.$store.commit('setShowLoginPop', false);
  //     }
  //   },
  // },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin
    }),
  },
  created () {
    this.hostList.push(this.changeArr(videoListLop.filter(item => item.countryCode)).splice(0, 3));
    // console.log(this.hostList, '-----777777--');
  },
  methods: {
    goToPlay () {
      logReport({
        eventId: '106-6-1-1',
        free_name2: Object.assign({
          from: 'gomeet-omegle'
        }, window.$mObj.adData || {}),
      });
      localStorage.setItem('LANDINGSPAGE', true);
      // localStorage.setItem('LANDINGSOMEGLE', true);
      window.$mObj.adData.lpName = 'gomeet-omegle';
      localStorage.setItem('lpName', 'gomeet-omegle');
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
    },
    changeArr (array) {
      const arr = [].concat(array);
      for (let i = arr.length - 1; i >= 0; i--) { // 遍历数组
        const num = Math.floor(Math.random() * (i + 1));
        const arr2 = arr[num];
        arr[num] = arr[i];
        arr[i] = arr2;
      }
      return arr;
    },
    randomArr (arr) {
      return arr[parseInt(Math.random() * arr.length, 6)];
    },
    checkDis () {
      if (Math.abs(this.mvpos) >= this.wh * 0.1) {
        this.canMove = false;
        this.cardDom.style.webkitTransitionDuration = '0.4s';
        if (this.mvpos < 0) {
          console.log(this.cardidx, '9999');
          if (this.cardidx < 2) {
            this.cardidx += 1;
          };
        } else {
          if (this.cardidx > 0) {
            this.cardidx -= 1;
          }
        }
        this.domPos = this.cardidx * this.wh;
        this.cardDom.style.webkitTransform = 'translateY(-' + this.domPos + 'px)';
        return;
      }
      var mm = this.domPos - this.mvpos;

      this.cardDom.style.webkitTransitionDuration = '0s';
      this.cardDom.style.webkitTransform = 'translateY(-' + this.mm + 'px)';
    }
  },
  mounted () {
    setBodyScroll(true);
    getCountry('gomeet-omegle');
    this.dom = document.querySelector('.page-body');
    this.cardDom = document.querySelector('.card-list');
    this.canMove = false;
    this.domPos = 0;
    this.mvpos = 0;
    this.stpos = 0;
    this.cardidx = 0;
    // this.wh = window.screen.availHeight;
    this.wh = document.body.clientHeight;
    this.dom.addEventListener('touchstart', (e) => {
      this.canMove = true;
      this.stpos = e.touches[0].pageY;
    });
    this.dom.addEventListener('touchmove', (e) => {
      console.log(this.cardidx, this.canMove, '9999');
      if (!this.canMove) return;
      this.mvpos = e.touches[0].pageY - this.stpos;

      if (this.cardidx === 2 && this.mvpos < 0) {
        this.goToPlay();
        return;
      }
      this.checkDis();
    });
    this.dom.addEventListener('touchend', (e) => {
      if (this.canMove) {
        this.cardDom.style.webkitTransitionDuration = '0.4s';
        this.cardDom.style.webkitTransform = 'translateY(-' + this.domPos + 'px)';
      }

      this.canMove = false;
    });
  },
  beforeDestroy () {
    setBodyScroll(false);
  }
};
</script>
<style lang='less' scoped>
.page-body {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  overflow-y: scroll;
  background-color: #fff;
  font-family: Futura-Medium, Futura;
  .home-page{
    height: 100%;
    overflow:hidden;
  }
}

@media screen and(max-width: 680px) {
  .page-body {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    overflow-y: scroll;
    background-color: #fff;
    .card-list, .ocard{
      width:100%;
      height:100%;
      position: relative;
      .video-load {
            position: absolute;
            z-index: 100;
            width: 40px;
            // opacity: .3;
            height: 30px;
            background: url(~@/assets/img/storyhost/icon-video-loading.png) center no-repeat;
            background-size: 100% auto;
            left: 50%;
            top: 50%;
            margin-left: -20px;
            margin-top: -20px;
            animation: loadAni 4s infinite linear;
          }
      video{
        width: 100%;
        height: 100%;
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
    .button {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 40px;
    width: 100%;

    .play {
      width: 250px;
      height: 55px;
      border-radius: 38px;
      color: #fff;
      line-height: 55px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      background: linear-gradient(111deg, #f99e47 0%, #ff3463 100%);
      animation: callIconAni 2s infinite;
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
    }
    .card-1{
      background:green;
    }
    .card-2{
      background:yellow;
    }
    .card-3{
      background:red;
    }
    .card-4{
      background:purple;
    }

    .card-list{
      transition: transform 0s;
      transform: translateY(0)
    }
  }
}
@keyframes loadAni{
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
}
</style>

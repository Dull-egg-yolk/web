<template>
  <div class="page-body">
    <div class="story-host">
      <!-- <host-link pageName="ukp2"></host-link> -->
      <div class="home-list">
        <div class="host-list">
          <div class="ohost" v-for="(item, index) in hostList" :key="index">
            <div class="zebg" @click="onreversal(index,item)" :class="`onreversal${index+1}`" ref="zebg"></div>
            <div class="cover" @click="clickBtn()">
              <!-- <img :src="item.headImg" alt=""> -->
              <span class="video-load" v-if="!videoLoad"></span>
              <video :id="'video-'+index" preload="none" muted :src="item.videoUrl" :poster="item.headImg" loop playsinline
                webkit-playsinline style="object-fit: cover; width: 100%; height: 100%;" @playing="videoLoad = true;"></video>
              <!-- <video v-else :src="item.videoUrl" :poster="item.headImg" loop playsinline webkit-playsinline
                style="object-fit: cover; width: 100%; height: 100%;"></video> -->
            </div>
            <div class="tag">Online</div>
            <div class="detail">{{ item.userName }}</div>
            <div class="btn-call" @click="clickBtn(index, item)">
              <span class="icon"></span>
            </div>
          </div>
        </div>
        <!-- 刷新按钮 -->
        <!-- <div class="refresh" @click="clickBtn"> <img class="icon"
            src="@/assets/img/h5download/refresh.png" />
          <div>Refresh</div>
        </div> -->
      </div>
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
            <div class="video-add">
              <div class="time-list" id="time-nums" style="transform: translateY(0);">
                  <span>10</span>
                  <span>9</span>
                  <span>8</span>
                  <span>7</span>
                  <span>6</span>
                  <span>5</span>
                  <span>4</span>
                  <span>3</span>
                  <span>2</span>
                  <span>1</span>
                </div>
            </div>
          </div>
          <div class="middle-wrap">
            <div class="video-report"><img src="@/assets/img/h5download/video_report.png" /></div>
            <div class="video-favor"><img src="@/assets/img/h5download/video_add.png" /></div>
          </div>
          <div class="gift"> <img src="@/assets/img/h5download/icon_video_gift.png" /></div>
          <div id="video-box" style="display:none">{{ bulletChat[Math.round(Math.random() * 20)].one }}</div>
          <div id="video-box1" style="display:none">{{ bulletChat[Math.round(Math.random() * 20)].two }}</div>
          <div class="video-load" v-if="videoLoad"></div>
          <video ref="vplayer" autoplay :src="curHostData.videoUrl" :poster="curHostData.headImg" loop playsinline
            webkit-playsinline></video>
        </div>
      </a>
      </transition>
      <!-- 自动弹出 -->
      <div class="call-player" v-if="showCall"
        :style="{ backgroundImage: 'url(' + randomData.headImg + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center 100%', backgroundSize: 'cover', 'background-color': 'rgba(255, 255, 255, 1)' }">
        <div class="bg-blur">
          <div class="warp-mask"></div>
        </div>
        <div class="body">
          <div class="online">Online</div>
          <img class="img-title" src="@/assets/img/h5download/livu.png" />
          <div class="call-title">video chat...</div>
          <div class="call-no" @click="callNo(randomData)">No</div>
          <div class="call-yes" @click="callYes(randomData)">Yes</div>
          <div class="call-img"><img :src="randomData.headImg" /></div>
        </div>
      </div>
      <!-- 模拟拨打 -->
      <!-- <div class="imitate-call" v-if="showImitate"
        :style="{ backgroundImage: 'url(' + curHostData.headImg + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center 100%', backgroundSize: 'cover' }">
        <div class="bg-blur">
          <div class="warp-mask"></div>
        </div>
        <div class="body">
          <div class="imitate-title"> <img class="icon" src="@/assets/img/storyhost/icon-call.png" />
            <div>Video Call</div>
          </div>
          <div class="imitate-avatar"><img :src="curHostData.headImg" alt=""></div>
          <div class="imitate-name">{{ curHostData.userName }}</div>
          <div class="imitate-local">
            <span><img src="@/assets/img/h5download/icon_video_favor.png" /> {{ curHostData.fabulous }} </span>
            <span><img src="@/assets/img/h5download/combined.png" /> {{ curHostData.country2 }}</span>
          </div>
          <div class="imitate-footer">Connecting...</div>
        </div>
      </div> -->
      <!-- 下载 -->
      <div class="download-call" v-if="showDown" @click="clickBtn()"
        :style="{ backgroundImage: 'url(' + curHostData.headImg + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center 100%', backgroundSize: 'cover' }">
        <div class="bg-blur">
          <div class="warp-mask"></div>
        </div>
        <div class="body">
          <div class="download-lock"><img src="@/assets/img/h5download/3.png" alt=""> </div>

          <div class="download-back" @click.stop="homeBack"><img src="@/assets/img/h5download/back.png" /></div>
          <div class="download-footer">
            <div>Register on LivCam and Get  <span class="big">200</span> free coins. </div>
          </div>
          <div class="downLoadBtn" @click="clickBtn">
            <a  >Go to play</a>
          </div>
        </div>
      </div>
      <!-- <audio id="music" ref="vadio" loop preload="auto">
        <source src="@/assets/audio/rington.wav" />
      </audio> -->
    </div>
</div>
</template>

<script>
import { videoListLop, countryList } from './list';
import { bulletChat } from './bulletChat';
import { logReport } from '@/util/logReport';
import { mapState } from 'vuex';
import { getCountry } from '@/util/getCountry';
import { Url } from 'url';
let clickNum = 0;
let timeNum = 10;
export default {
  name: 'H5Download',
  // components: { hostLink },
  data () {
    return {
      click: 0,
      getCountry: '',
      num: false,
      removeScrollEvent: null,
      showVideo: false,
      showCall: false,
      showImitate: false,
      showDown: false,
      curHostIndex: 0,
      videoLoad: false,
      videoListLop,
      countryList,
      bulletChat,
      hostList: [],
      randomData: [],
      firstLoad: false,
      timing: '',
      link: '',
      link1: 'https://h5-livume.onelink.me/llU8/wuwb2q4y',
      userId: '',
      isreversal: false,
      mres: 0,
    };
  },
  computed: {
    curHostData: {
      get () {
        const data = this.hostList[this.curHostIndex];
        data.country2 = countryList[Math.floor(Math.random() * countryList.length)];
        return data;
      },
      // eslint-disable-next-line space-before-function-paren
      set(newValue) {
        console.log(newValue);
      }
    },
    ...mapState({
      isLogin: (state) => state.app.isLogin
    }),
  },
  methods: {
    randomCoding () {
      var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      var idvalue = '';
      const n = 1;
      for (var i = 0; i < n; i++) {
        idvalue += arr[Math.floor(Math.random() * 26)];
      }
      return idvalue;
    },
    clickBtn () {
      logReport({
        eventId: '106-6-1-1',
        free_name2: Object.assign({
          from: 'gomeet-pick'
        }, window.$mObj.adData || {}),
      });
      window.$mObj.adData.lpName = 'gomeet-pick';
      localStorage.setItem('lpName', 'gomeet-pick');
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
      localStorage.setItem('LANDINGSPAGE', true);
    },
    getTime () {
      setTimeout(() => {
        const t = window.performance.timing;
        const performanceInfo = [{
          key: 'domContentLoad',
          desc: 'DOM 加载完成时间',
          'value(ms)': t.domInteractive - t.navigationStart
        }];
        this.timing = performanceInfo[0]['value(ms)'];
        console.log(performanceInfo[0]['value(ms)']);
      }, 0);
    },
    // 随机取4个
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
      return arr[parseInt(Math.random() * arr.length, 4)];
    },
    // 倒计时
    cutNum () {
      if (timeNum > 0) {
        setTimeout(() => {
          timeNum -= 1;
          document.body.querySelector('#time-nums').setAttribute('style', `transform: translateY(-${10 * (10 - timeNum)}%)`);
          this.cutNum();
        }, 1000);
      } else {
        this.showDown = true;
        this.showVideo = false;
        this.showCall = false;
        this.showImitate = false;
      }
    },
    videoBox () {
      setTimeout(() => {
        document.body.querySelector('#video-box').setAttribute('class', 'video-box');
      }, 1000);
      setTimeout(() => {
        document.body.querySelector('#video-box1').setAttribute('class', 'video-box1');
      }, 4000);
    },
    // 拒绝
    callNo (item) {
      this.$refs.vadio && this.$refs.vadio.pause();
      this.showCall = false;
      clickNum++;
      if (clickNum === 1) {
        setTimeout(() => {
          if (this.click === 0) {
            this.showCall = true;
            this.$refs.vadio && this.$refs.vadio.play();
            this.randomData = this.randomArr(this.hostList);
          }
        }, 2000);
      }
    },
    // 接打
    callYes (item) {
      this.$refs.vadio && this.$refs.vadio.pause();
      this.showImitate = true;
      this.$refs.vadio && this.$refs.vadio.play();
      setTimeout(() => {
        this.showImitate = false;
        this.$refs.vadio && this.$refs.vadio.pause();
        this.showCall = false;
      }, 10);
      this.showVideo = true;
      item = this.curHostData;
      this.curHostIndex = Math.floor(Math.random() * 3 + 1);
      this.videoLoad = true;
      const videoLST = new Date().getTime();
      this.$nextTick(() => {
        this.$refs.vplayer && this.$refs.vplayer.addEventListener('canplay', () => {
          const vLET = new Date().getTime() - videoLST;
          this.videoLoad = false;
          this.cutNum();
          this.videoBox();
          console.log(vLET);
        });
      });
    },
    // 播放视频
    playStory (index, data) {
      this.click++;
      this.firstLoad = false;
      this.showImitate = true;
      // this.$refs.vadio && this.$refs.vadio.play()
      setTimeout(() => {
        this.showImitate = false;
        this.$refs.vadio && this.$refs.vadio.pause();
      }, 2000);
      this.showVideo = true;
      this.curHostIndex = index;
      this.videoLoad = true;
      setTimeout(() => {
        const videoLST = new Date().getTime();
        this.$nextTick(() => {
          this.$refs.vplayer && this.$refs.vplayer.addEventListener('canplay', () => {
            const vLET = new Date().getTime() - videoLST;
            this.videoLoad = false;
            timeNum = 10;
            this.cutNum();
            this.videoBox();
            console.log(vLET);
          });
        });
      }, 0);
    },
    // 刷新
    // getTabHostLisData () {
    //   this.hostList = [];
    //   this.hostList = this.changeArr(videoListLop.filter(item => item.countryCode)).splice(0, 4);
    // },
    // 返回
    homeBack () {
      console.log(123);
      this.showDown = false;
    },
    onreversal (index, item) {
      console.log(this.$refs.zebg[index], '999999');
      this.$refs.zebg[index].classList.add('onreversal');
      this.mres++;
      if (this.mres === 2) {
        this.clickBtn();
      }
      setTimeout(() => {
        document.querySelector('#video-' + index).play();
      }, 400);
    },
  },
  created () {
    if (localStorage.getItem('userId')) {
      this.userId = localStorage.getItem('userId');
    } else {
      var userId = this.randomCoding() + new Date().valueOf();
      this.userId = userId;
      localStorage.setItem('userId', this.userId);
    }
    window.addEventListener('load', (e) => {
      setTimeout(() => {
        this.link = window.AF_SMART_SCRIPT_RESULT.clickURL;
      }, 0);
    });
    window.addEventListener('load', this.getTime, false);
    this.hostList = this.changeArr(videoListLop.filter(item => item.countryCode)).splice(0, 4);
    this.getCountry = this.$route.query.country;
    console.log(this.$route.fullPath);
  },
  mounted () {
    let isLoad = false;
    this.$nextTick(() => {
      document.addEventListener('touchend', () => {
        if (!isLoad) {
          this.$refs.vadio && this.$refs.vadio.load();
          isLoad = true;
        }
      });
    });
    getCountry('gomeet-pick');
  }
};
</script>

<style lang="less" scoped>
.page-body {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  overflow-y: scroll;
  background: url(~@/assets/img/h5download/slotmachine.jpg) center center;
  font-family: Futura-Medium, Futura;
  background-size: cover;
}
.story-host{
  // background: url(~@/assets/img/h5download/bg.png) center no-repeat;
  background:#000 url(~@/assets/img/h5download/slotmachine.jpg) center center;
  font-family: Futura-Medium, Futura;
  background-size: cover;
  // background-size: 100% auto;
  background-attachment:fixed;
  height: 100%;
  overflow: auto;
  position: relative;
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
      width:48px;
      height:48px;
      border-radius: 50%;;
      overflow:hidden;
      font-size:0;
      .time-list{
        transition: transform 1s;
      }
      .time-list span{
        display:flex;
        width:48px;
        height:48px;
        font-size: 26px;
        font-weight:bold;
        align-items: center;
        justify-content: center;
        color: #f01111;
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
      text-decoration: none;
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
.error-box{
  padding: 300px 0;
  text-align:center;
  background:url(~@/assets/img/storyhost/icon-error.png) center no-repeat;
  opacity: 0.2;
  background-size: 50px auto;

}

.home-list {
  position: absolute;
  top: 20%;
  // top: 65px;
  .host-text{
  font-size: 34px;
  font-weight:500;
  text-align: center;
  color: #fff;
  line-height: 30px;
  padding: 30px 0;
}
.refresh{
  position: fixed;
  bottom:0;
  width:100%;
  color: #fff;
  font-size: 16px;
  z-index:10;
  display: flex;
  justify-content: center;
  align-items: center;
  padding:5px 0;
  background-color:rgba(0,0,0,0.2);
  .icon{
      width: 22px;
      height:22px;
      z-index:2;
  }
  div{
    margin-left: 8px;
    font-size:20px;
    font-weight: 700;
  }
}
.host-list{
  padding: 10px 4px;
  font-size:0;
  position: relative;
  z-index:2;
  border: 1px solid #fff;
  border-radius: 10px;
  margin: 0 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  .ohost{
    display:inline-block;
    width: 48%;
    height: 30vh;
    overflow:hidden;
    margin-right:4px;
    border-radius: 8px;
    margin-bottom:4px;
    position: relative;
    animation: showCard .2s both;
    .onreversal1{
      background: url(~@/assets/img/rotatebg1.jpg) center center;
    }
    .onreversal2{
      background: url(~@/assets/img/rotatebg2.jpg) center center;
    }
    .onreversal3{
      background: url(~@/assets/img/rotatebg3.jpg) center center;
    }
    .onreversal4{
      background: url(~@/assets/img/rotatebg4.jpg) center center;
    }

    .zebg{
      position: absolute;
      width: 100%;
      height: 100%;
      // background: #000;
      top:0;
      left:0;
      background-size: cover;
      z-index:99;
      background-color:#000;
    }
    .onreversal{
      animation: reversalan .3s both;
    }
    &:nth-child(2n){
      margin-right:0;
    }

    .icon-play{
      position:absolute;
      width:40px;
      height:40px;
      background:url(~@/assets/img/storyhost/icon-play2.png) center no-repeat;
      background-size:100% auto;
      left:50%;
      top:50%;
      z-index:10;
      margin: -20px 0 0 -20px
    }
    &::after{
      content: '';
      position: absolute;
      bottom:0;
      left:0;
      width:100%;
      z-index:1;
      background:linear-gradient(0deg, rgba(0, 0, 0, 0.83) 0%, rgba(0, 0, 0, 0) 100%);
      height: 100px;
    }

    .cover{
      position:relative;
      width:100%;
      height:100%;
      left:0;
      top:0;

      background:#222;
      img{
        width:100%;
        height: 100%;
      }
      .video-load {
            position: absolute;
            z-index: 80;
            width: 30px;
            // opacity: .3;
            height: 30px;
            background: url(~@/assets/img/storyhost/icon-video-loading.png) center no-repeat;
            background-size: 100% auto;
            left: 50%;
            top: 50%;
            margin-left: -15px;
            margin-top: -15px;
            animation: loadAni 4s infinite linear;
          }
    }

    .tag{
      position:absolute;
      top:6px;
      left:6px;
      color:#fff;
      transform: scale(0.85);
      transform-origin: left top;
      padding: 2px 6px;
      background:rgba(17, 255, 0, 0.6);
      border:solid 1px rgba(17, 255, 0, 1);
      border-radius: 50px;
      font-size:16px;
      z-index:2;
    }

    .detail{
      position:absolute;
      bottom:65px;
      width:100%;
      box-sizing: border-box;
      padding: 10px;
      z-index:10;
      text-align: center;
      font-size: 16px;
      color:#fff;
      overflow:hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight:bold;
    }

    .btn-call{
      position:absolute;
      right:35%;
      bottom: 15px;
      width:54px;
      height:54px;
      z-index:10;
      background: #37c761;
      border-radius: 50%;
      display:inline-flex;
      align-items: center;
      justify-content: center;
      &::after,&::before{
        content: '';
        position:absolute;
        width:54px;
        height:54px;
        box-sizing: border-box;
        left: 0;
        top:0;
        border-radius: 50%;
        border:solid 1px #37c761;
        opacity: 0;
        z-index:1;
      }

      &::after{
        animation: callBtnAni 2s infinite linear;
      }
      &::before{
        animation: callBtnAni 2s 1s infinite linear;
      }
      .icon{
        display:block;
        width: 24px;
        height:24px;
        background:url(~@/assets/img/storyhost/icon-call.png) center no-repeat;
        background-size: 100% auto;
        animation: callIconAni 2s infinite;
        position:relative;
        z-index:2;
      }
    }
  }
}

}

.bg-blur{
    height:100%;
    width: 100%;
    background: inherit;
    // -webkit-filter: blur(14px);
    // -moz-filter: blur(14px);
    // -o-filter: blur(14px);
    // -ms-filter: blur(14px);
    // filter: blur(14px);
    // filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=4, MakeShadow=false);
    .warp-mask{
      height:100%;
      width:100%;
      background: rgba(0,0,0,.6);
    }
}

.call-player {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 100;
  .body {
    .img-title{
      position: absolute;
      top: 22%;
      left: 80%;
      width: 52px;
      height:52px;
      border-radius:15px;
      z-index: 99;
    }
    .online{
      position: absolute;
      top: 22%;
      left: 5%;
      width: 60px;
      height:22px;
      background:rgba(17, 255, 0, 0.6);
      border:solid 1px rgba(17, 255, 0, 1);
      border-radius:22px;
      text-align: center;
      line-height: 22px;
      padding: 4px 6px 4px 10px;
      margin-top: 10px;
      transform-origin: left center;
      color:#fff;
      font-size:14px;
      z-index: 99;
    }

    .call-title{
      position: absolute;
      top:60%;
      width: 100%;
      text-align: center;
      color: #fff;
      font-weight: 700;
      font-family:Verdana;
      -webkit-text-stroke:1px #FF3167;
      text-stroke:1px #FF3167;
      text-shadow: 2px 2px 10px rgba(255,255,255,0.5);
      z-index: 99;
    }

    .call-no{
      position: absolute;
      top:68%;
      left:5%;
      z-index:100;
      background: #FF3167;
      width: 160px;
      height:50px;
      border-radius: 25px;
      border: 1px solid #fff;
      color: #fff;
      font-size: 24px;
      font-weight: 700;
      text-align: center;
      line-height: 50px;
    }
    .call-yes{
      position: absolute;
      top:68%;
      right:5%;
      z-index:100;
      background: #37DFA7;
      width: 160px;
      height:50px;
      border-radius: 25px;
      border: 1px solid #fff;
      color: #fff;
      font-size: 24px;
      font-weight: 700;
      text-align: center;
      line-height: 50px;
      animation: callIconAni 2s infinite;
    }
    .call-img{
      position:absolute;
      top:20%;
      width:375px;
      height: 458px;
      img{
        width:375px;
        height: 458px;
      }
    }
  }
}
.imitate-call{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 100;
  .imitate-avatar{
      position:absolute;
      top:35%;
      width: 100%;
      z-index:10;
      border-radius: 50%;
      display:inline-flex;
      align-items: center;
      justify-content: center;
      img{
        width: 180px;
        height: 180px;
        border-radius: 50%;
        border:5px solid #FF14C0;
        object-fit: cover;
      }
      &::after,&::before{
        content: '';
        position:absolute;
        width: 180px;
        height: 180px;
        box-sizing: border-box;
        top:0;
        border-radius: 50%;
        border:solid 2px #FF3167;
        opacity: 0;
        z-index:1;
      }

      &::after{
        animation: callBtnAni 2s infinite linear;
      }
      &::before{
        animation: callBtnAni 2s 1s infinite linear;
      }
  }
  .imitate-title{
    width:100%;
    position:absolute;
    top:25%;
    color: #fff;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon{
        width: 30px;
        height:20px;
        // background:url(~@/assets/img/storyhost/icon-call.png) center no-repeat;
        // background-size: 100% auto;
        z-index:2;
    }
    div{
      margin-left: 8px;
    }
  }
  .imitate-name{
    width: 100%;
    position:absolute;
    top:70%;
    color: #fff;
    font-size: 24px;
    font-weight: 700;
    text-align: center;
  }
  .imitate-local{
    width: 100%;
    position:absolute;
    top:75%;
    color: #fff;
    font-size: 20px;
    text-align: center;
    img{
      width:15px;
      height:15px;
    }
  }
  .imitate-footer{
    width: 100%;
    position:absolute;
    top:88%;
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    text-align: center;
  }
}
.download-call{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 100;
  .concent-wrap{
      display: none;
      position: absolute;
      z-index:100;
      top:21%;
      width: 100%;
      text-align: center;
      color: #fff;
      font-size: 26px;
      .arrow-up{
        position: absolute;
        left: 50%;
        bottom: 50px;
        color: white;
      }
      .btn-download{
        font-size: 20px;
      }
      .arrow-up img{
        position: absolute;
        width: 20px;
        height: 20px;
        top: 10px;
        margin-left: -10px;
        opacity: 0;
        -webkit-animation: up 2s infinite;
        animation: up 2s infinite;
      }
      @-webkit-keyframes up{
        0%{
          opacity: 0;
          -webkit-transform: translate(0, 0);
        }
        50%{
          opacity: 1;
          -webkit-transform: translate(0, -10px);
        }
        100%{
          opacity: 0;
        }
      }
      @keyframes up{
        0%{
          opacity: 0;
          transform: translate(0, 0);
        }
        50%{
          opacity: 1;
          transform: translate(0, -10px);
        }
        100%{
          opacity: 0;
        }
      }
    }
   .download-lock{
      position:absolute;
      width: 100%;
      text-align: center;
      top:30%;
      width: 100%;
      z-index:10;
      border-radius: 50%;
      display:inline-flex;
      align-items: center;
      justify-content: center;
      img{
        width: 150px;
        height: 130px;
      }
  }
  .download-back{
    position:absolute;
    left:6%;
    top:5%;
    z-index:999;
    width: 40px;
    height:40px;
    img{
      width: 40px;
      height:40px;
      border-radius: 15px;
    }
  }
  .download-title{
    position:absolute;
    left:45%;
    top:35%;
    color: #fff;
    font-size: 16px;
    .icon{
        display:block;
        width: 24px;
        height:24px;
        background:url(~@/assets/img/storyhost/icon-call.png) center no-repeat;
        background-size: 100% auto;
        // animation: callIconAni 2s infinite;
        position:relative;
        z-index:2;
      }
  }
  .download-footer{
    position:absolute;
    width: 100%;
    text-align: center;
    top:60%;
    color: #fff;
    font-size: 22px;
    .big{
      font-size: 20px;
      font-weight: 700;
      text-shadow: 2px 2px 10px #FF3167;
      font-style:oblique;
      border-bottom: 4px solid #FF3167;
    }
  }
}

 @-webkit-keyframes rotation {

    0%{
        transform: rotate(0deg);
    }
    25%{
        transform: rotate(90deg);
    }
    50%{
        transform: rotate(180deg);
    }
    100%{
        transform: rotate(360deg);
    }

  }
  @-webkit-keyframes spanrotation {

    0%{
        transform: rotate(0deg);
    }
    25%{
        transform: rotate(-90deg);
    }
    50%{
        transform: rotate(-180deg);
    }
    100%{
        transform: rotate(-360deg);
    }

  }
@keyframes reversalan{
  0%{
    transform:rotateY(0deg);
  }
  100%{
    transform:rotateY(90deg);
  }
 }
@keyframes curTabAni{
  0%{
    transform: scaleX(0);
  }
  90%{
    transform: scaleX(1.1);
  }
  100%{
    transform: scaleX(1);
  }
}

@keyframes callBtnAni{
  0%{
    opacity: 0;
    transform: scale(0);
  }
  50%{
    opacity: 0.9;
    transform: scale(1);
  }
  100%{
    opacity: 0;
    transform: scale(1.3)
  }
}

@keyframes callBtnAni2{
  0%{
    opacity: 0;
    transform: scale(0);
  }
  50%{
    opacity:1;
    transform: scale(1,1);
  }
  100%{
    opacity: 0;
    transform: scale(1.2, 1.5)
  }
}

@keyframes callIconAni{
  0%{
    transform: scale(0.8);
  }
  50%{
    transform: scale(1);
  }
  100%{
    transform: scale(0.8);
  }
}

@keyframes showPop {
  0% {
    opacity: 0;
    transform: translateY(100%) scaleY(1);
  }
  50% {
    opacity: 1;
    transform: translateY(0) scaleY(1.025);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }
}

@keyframes hidePop {
  0% {
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }
  50% {
    opacity: 1;
    transform: translateY(0) scaleY(1.025);
  }
  100% {
    opacity: 0;
    transform: translateY(100%) scaleY(1);
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
@keyframes run {
  0% {
    transform: translate(0,0) rotate(0);
  }

  100%{
      transform: translate(0,-5em) rotate(-360deg);
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

@keyframes showCard{
  0%{
    opacity: 0;
    transform: scale(1) translateY(-40px);
  }
  100%{
    opacity: 1;
    transform: scale(1) translateY(0);

  }
}

@keyframes barrage {
  0% {
    bottom:15%;
    opacity: 0;
    transform: translateY(100%) scaleY(1);
  }
  100% {
    bottom:25%;
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }
}
@keyframes barrages {
  0% {
    bottom:15%;
    opacity: 0;
    transform: translateY(100%) scaleY(1);
  }
  100% {
    bottom:18%;
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }
}
@keyframes circleAni {
    0%{
      transform: rotate(0);
    }
    100%{
      transform: rotate(360deg);
    }
}

.downLoadBtn {
  position: absolute;
  width: 100%;
  text-align: center;
  top: 80% !important;

  a {
    display: inline-block;
    background-color: #fff;
    font-size: 0.62667rem;
    text-align: center;
    color: #FF5B8E;
    font-weight: 700;
    width: 300px;
    height: 50px;
    border-radius: 25px;
    line-height: 50px;
    margin: 0 auto;
    text-decoration: none;
  }
}
</style>

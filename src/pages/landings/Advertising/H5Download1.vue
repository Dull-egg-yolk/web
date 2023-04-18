<template>
  <div class="page-body">
    <div class="story-host">
      <!-- <host-link pageName="ukp2"></host-link> -->
      <div class="home-list">
        <div class="host-text">Choose a girl you like</div>
        <div class="host-list">
          <div class="ohost" v-for="(item, index) in hostList" :key="index">
            <div class="cover" @click="clickBtn">
              <!-- <img :src="item.headImg" alt=""> -->
              <video v-if="index === 0" autoplay muted :src="item.videoUrl" :poster="item.headImg" loop playsinline
                webkit-playsinline style="object-fit: cover; width: 100%; height: 100%;"></video>
              <video v-else :src="item.videoUrl" :poster="item.headImg" loop playsinline webkit-playsinline
                style="object-fit: cover; width: 100%; height: 100%;"></video>
            </div>
            <div class="tag">Online</div>
            <div class="detail">{{ item.userName }}</div>
            <div class="btn-call" @click="clickBtn">
              <span class="icon"></span>
            </div>
          </div>
        </div>
        <!-- 刷新按钮 -->
        <div class="refresh" @click="getTabHostLisData"> <img class="icon"
            src="@/assets/img/h5download/refresh.png" />
          <div>Refresh</div>
        </div>
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
          <!-- <div class="bottom-wrap" @click.stop="DownloadApp()">
            <div class="btn-bottom"><img src="@/assets/img/h5download/video.png" />
              <div>Go to play</div>
            </div>
          </div> -->
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
      <div class="imitate-call" v-if="showImitate"
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
      </div>
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
            <div>Register on Gomeet and Get  <span class="big">200</span> free coins. </div>
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
      userId: ''
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
          from: 'gomeet-waterfall2'
        }, window.$mObj.adData || {}),
      });
      window.$mObj.adData.lpName = 'gomeet-waterfall2';
      localStorage.setItem('lpName', 'gomeet-waterfall2');
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
    getTabHostLisData () {
      this.hostList = [];
      this.hostList = this.changeArr(videoListLop.filter(item => item.countryCode)).splice(0, 4);
    },
    // 返回
    homeBack () {
      console.log(123);
      this.showDown = false;
    }
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
    getCountry('gomeet-waterfall2');
  }
};
</script>

<style lang="less" scoped>
@import "./advertising.less";

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

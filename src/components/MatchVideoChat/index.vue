<template>
  <Base-pop :showPop="showMatchedPop" v-if="showMatchedPop" class="match-video-chat" :class="{ fullscreen: isFullScreen }" @outClik="outClick">
    <div class="cover-bg">
      <img :src="remoteUserInfo.headImg" alt="">
    </div>
    <div class="video-container flex-row-strech">

      <div class="video-times">{{ callTime }}</div>
      <!-- 聊天 -->
      <div class="chat-cell" :style="{zIndex: showGiftLine ? 1: 3 }" v-if="!isMobile">
        <dialog-box :friendDetail="remoteUserInfo" theme="dark" :friendId="friendId" @sendSuccess="sendMsg" @giftLine="giftLine" chatTye="video"
          :friendAvatar="remoteUserInfo.headImg" ref="dialogC" :showTime="false"></dialog-box>
      </div>
      <!-- 视频 -->
      <div class="video-cell">
        <div class="main-video" >
          <div class="the-video" @click="showDetail = !showDetail" id="matchedVideoBox">
            <!-- <video id="matchedVideo" :src="remoteUserInfo.video" autoplay muted playsinline webkit-playsinline></video> -->
          </div>
          <!-- 用户信息 -->
          <transition name="slideUp">
          <div class="user-detail" v-show="!frelation || (frelation && showDetail)">
            <div class="avatar-img">
              <div class="avatar-wrap">
                <img :src="remoteUserInfo.headImg" alt />
              </div>
            </div>
            <div class="detail">
              <div class="name">{{ remoteUserInfo.userName }}</div>
              <div class="num small-font">
                <span class="ding">
                  <span class="ico icon-girl" v-if="remoteUserInfo.gender === 2"></span>
                  <span class="ico icon-boy" v-else></span>
                  {{remoteUserInfo.birthday | calculateAge}}
                </span>
                <span class="location">
                  <span class="icon-location"></span>
                  <country :countryId="remoteUserInfo.countryId" type="name"></country>
                </span>
              </div>
            </div>

            <!-- 加好友按钮 -->
            <div class="btn-addfriend fx-ic" v-if="!frelation && !showAccpet">
              <span class="icon-add hover" @click="addFriendAction"></span>
            </div>
          </div>
        </transition>
        </div>
        <!-- 聊天 -->
        <div class="chat-cell" :style="{zIndex: showGiftLine ? 1: 3 }" v-if="isMobile">
          <dialog-box :friendDetail="remoteUserInfo" theme="dark" :friendId="friendId" @sendSuccess="sendMsg" @giftLine="giftLine" chatTye="video"
            :friendAvatar="remoteUserInfo.headImg" ref="dialogC" :showTime="false"></dialog-box>
        </div>
        <div class="mini-video">
          <div class="the-video" id="my-m-video"></div>
          <!-- <div class="change aciton-btn" @click="changeVideoPos">
            <span class="icon-replace"></span>
          </div> -->
        </div>

        <!-- 挂断 -->
        <div class="cancel-video action-btn" @click="cancelPop">
          <span class="icon-arrow"></span>
        </div>
        <!-- 视频操作 -->
        <div class="video-setting">
          <!-- 静音 -->
          <div class="mute action-btn" @click="setMyMute">
            <span class="icon-mike" v-if="!mMute"></span>
            <span class="icon-mike-mute" v-else></span>
          </div>
          <!-- 声音 -->
          <div class="volume action-btn" @click="setRemoteMute">
            <span class="icon-volume" v-if="!fMute"></span>
            <span class="icon-mute" v-else></span>
          </div>
          <!-- report -->
          <div class="report action-btn" @click.stop="reportUser">
            <span class="icon-saft"></span>
          </div>
        </div>
        <!-- 好友操作 -->
        <div class="user-actions fx-c">
          <!-- <div class="thumb-up action-btn" :class="{ding: isDing}" @click="isDing = true">
            <span class="ico"></span>
          </div> -->
          <!-- 金币 -->
          <div class="coin-info fx-c">
            <div class="recharge-pop" v-if="videoRecharge">
             {{$t('app.flash_charge_toast_hint')}}
            </div>

            <div class="recharge-iframe" v-if="showCharge">
              <span class="icon icon-cross hover" @click="chargeEnd"></span>
              <iframe v-if="payUrl" :src="payUrl" frameborder="0"></iframe>
            </div>
            <div class="btn fx-c" @click="chargeShowAction">
            <span class="num hover">{{ userInfo.goldNum }}</span>
            <span class="icon-coin hover"></span>
            </div>
          </div>
        </div>

      </div>

      <!-- 快捷礼物 -->
      <div class="quick-gift flex-col-vc" v-if="showGiftLine">
        <div class="ogift hover" v-for="i of giftTop6" :key="i" @click="sendGift(i)">
          <img :src="giftList[i].giftImage" alt="">
         <div class="coin">
          {{giftList[i].gold}}
        </div>
        </div>
      </div>

      <!-- 收到好友邀请 -->
      <div class="accpet-addf fx-c" v-if="showAccpet">
        <div class="inner fx-c">
          <p>{{$t('app.request_add_friend', {friendName: remoteUserInfo.userName})}}</p>
          <div class="m-btn mini major" @click="acceptAdd">{{ $t('base.accept') }}</div>
        </div>
      </div>

      <!-- 前端模拟好友邀请 -->
      <div class="accpet-addf fx-c" v-if="showSimulationAccept && !showAccpet && !frelation">
        <div class="inner fx-c">
          <p>{{$t('app.request_add_friend', {friendName: remoteUserInfo.userName})}}</p>
          <div class="m-btn mini major" @click="acceptSimulationAdd">{{ $t('base.accept') }}</div>
        </div>
      </div>

      <!-- 收到同意邀请 -->
      <div class="accept-success" v-if="showAFSuccess">
        {{$t('app.accept_add_freind_request', {friendName: remoteUserInfo.userName})}}
      </div>
    </div>
    <report-menu class="user-report-pop" :friendData="remoteUserInfo" :reportVideo="reportVideo" v-if="showReport" @show="hideReportHandler" @reportSucc="isReport = true"  v-clickoutside:click="hideReportHandler" />
  </Base-pop>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import BasePop from '../BasePop.vue';
import DialogBox from '../DialogBox';
import { apiAddFriend } from '@/api/friend';
import { apiDeductGold } from '@/api/livcam';
import ReportMenu from '@/components/PopFiles/ReportMenu.vue';
import Clickoutside from '@/util/clickoutside.js';
import { touchEvent } from '@/util/touchEvent';

import {
  fullScreen,
  cancelFullScreen,
  checkFullScreen,
} from '@/tools/index';

// import { apiGetMyCoin } from '@/api/user';
import { getUserInfoData, matchLike } from '@/api/user';

import { getBaseUrl } from '@/util/index';
import { calculateAge } from '@/filters';
import { logReport } from '@/util/logReport';
import { getPaymentUrl, handlePostMessageForm } from '@/util/shop';

export default {
  name: 'MatchedVideo',
  data () {
    const rlen = history.length;
    return {
      chatMsg: '',
      isFullScreen: false,
      frelation: false,
      showReport: false,
      reportVideo: null,
      isReport: false,
      showCharge: false,
      payUrl: '',
      isDing: false,
      showGiftLine: true,
      fMute: false,
      mMute: false,
      showDetail: true,
      callTimer: null,
      callTime: '00:00',
      callTimeSec: 0,
      matchedVideo: null,
      showSimulationAccept: false,
      timer: null,
      remoteUserInfo: {
        relation: 4,
        id: '',
        video: '',
        headImg: '',
        userName: '',
        gender: '',
        birthday: '',
        countryId: '',
        hostLike: false,
        likeShowTime: 0,
      },
      rlen
    };
  },
  components: {
    BasePop,
    DialogBox,
    ReportMenu,
  },
  filters: {
    calculateAge,
  },
  directives: { Clickoutside },
  computed: {
    ...mapState({
      bizData: (state) => state.agora.bizData,
      showMatchedPop: (state) => state.app.showMatchedPop,
      curRoomNum: (state) => state.agora.curRoomNum,
      friendId: (state) => state.agora.bizData.remoteUserInfo.id,
      userInfo: (state) => state.app.userInfo,
      giftList: (state) => state.app.giftList,
      addFriend: (state) => state.app.addFriend,
      videoRecharge: (state) => state.app.videoRecharge,
      curCallRole: (state) => state.agora.curCallRole,
      isMobile: (state) => state.app.isMobile,
      isHomeHost: (state) => state.app.isHomeHost,
      homeParams: (state) => state.app.homeParams,
      matchingConfig: (state) => state.app.matchingConfig,
    }),
    giftTop6 () {
      return Object.keys(this.giftList).slice(0, 6);
    },
    showAccpet () {
      return this.addFriend.show && this.addFriend.info.times === 1 && this.addFriend.info.type === 'friend';
    },
    showAFSuccess () {
      return this.addFriend.show && this.addFriend.info.times === 2;
    },
    logParams () {
      const logParams = {
        roomId: this.curRoomNum
      };
      if (this.isHomeHost) {
        Object.assign(logParams, this.homeParams);
      }
      return logParams;
    }
  },
  watch: {
    showMatchedPop (n, o) {
      if (n) {
        const storeUser = this.$store.state.agora.bizData.remoteUserInfo;
        this.remoteUserInfo = { ...this.remoteUserInfo, ...storeUser };
        logReport({
          eventId: '106-5-2-2', // match匹配成功页面曝光
          freeName2: window.$mObj.adData || {},
          targetUserId: this.friendId
        });
        this.isDing = false;

        // 清除定时器
        window.$mObj.timer && clearTimeout(window.$mObj.timer);
        this.$store.commit('setAddFriend', {
          show: false,
          info: {
            type: 0,
            times: 0
          }
        });
        this.$store.commit('updateVideoRecharge', false);
        this.$nextTick(() => {
          this.startCallTimeCount();
          this.$store.commit('resetDialog');
          setTimeout(() => {
            this.watchVideo();
          }, 20);
        });
        this.frelation = this.remoteUserInfo.relation === 2;

        this.setLocalV();
        if (this.remoteUserInfo.hostLike) {
          this.timerAddFriend();
        }
      } else {
        this.cancelVideo();

        this.$store.commit('resetVideoChat');
        this.updateCoin();
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    curRoomNum () {
      this.showReport = false;
    },
    frelation (n, o) {
      if (!o && n) {
        this.showDetail = true;
      }
    }
  },
  methods: {
    ...mapActions(['updateMyUserData']),
    setLocalV () {
      setTimeout(() => {
        this.$rtc.localVideoTrack.play(document.querySelector('#my-m-video'));
      }, 100);
      // this.$rtc.createLocalV().then(v => {
      //   v.play(document.querySelector('#my-m-video'));
      // });
    },
    async cancelPop () {
      logReport({
        eventId: '106-5-2-10', // match中关闭点击
        targetUserId: this.remoteUserInfo.id,
      });
      logReport({
        eventId: '106-5-2-12', // match视频播放退出弹窗曝光
        targetUserId: this.remoteUserInfo.id,
      });
      this.$message({
        isReversal: true,
        activeAffirm: false,
        desc: {
          title: this.$t('webChat.hangUp'),
          txt: this.$t('webChat.sureLeave') // '确定要挂断电话么?'
        },
        noCancelBtn: false,
      }).then(async () => {
        this.cancelVideo();
        // 挂断通话上报
        logReport({
          eventId: '106-5-2-13',
          r_source: 'match',
          target_user_id: this.remoteUserInfo.id
        });
        window.gtag && window.gtag('event', 'GoMeetVideoCallDuration ', { send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'], callDuration: this.$store.state.agora.callTimeSec });
      }).catch(e => {
        logReport({
          eventId: '106-5-2-14',
          r_source: 'match',
          target_user_id: this.remoteUserInfo.id
        });
      });
    },
    async cancelVideo (cb) {
      this.resetStatus();
      await this.$rtc.cancelLocalV();
      if (this.matchedVideo) {
        this.matchedVideo.pause();
        this.matchedVideo.src = '';
      }
      this.$store.commit('setMatchedPop', false);
      this.$store.commit('setMatchCallCancel', true);
      cb && cb();
    },
    sendMsg (data) {
      console.log(data, '------消息发成功了');
    },
    // 全屏控制
    fullScreenHandler () {
      if (!this.isFullScreen) {
        if (fullScreen()) {
          this.isFullScreen = true;
        }
      } else {
        cancelFullScreen();
        this.isFullScreen = false;
      }
    },
    escKeyDown () {
      if (!checkFullScreen()) {
        this.isFullScreen = false;
      } else {
        this.isFullScreen = true;
      }
    },
    sedMsg () {
      console.log('send msg--------');
    },
    // 视频位置互换
    changeVideoPos () {
      // this.$rtc.changeVideoPos();
    },

    // 主动添加好友
    addFriendAction () {
      apiAddFriend({
        addWay: 101,
        friendUserId: this.remoteUserInfo.id,
        addReally: false,
      }).then(({ code, data }) => {
        if (code === 200) {
          this.frelation = true;
        }
        this.$store.commit('setAddFriend', {
          show: false,
          info: {
            times: 1,
            type: 'me'
          }
        });
        console.log(data, 'add friend -----');
      });
      logReport({
        eventId: '106-1-3-20',
        r_source: 'match',
        gender: this.remoteUserInfo.gender,
        targetUserId: this.remoteUserInfo.id
      });
    },
    // 快速发送礼物
    sendGift (i) {
      const curGift = this.giftList[i];
      this.$refs.dialogC.sendGift(curGift.id);
    },
    acceptAdd () {
      apiAddFriend({
        addWay: 101,
        friendUserId: this.remoteUserInfo.id,
        addReally: true,
      }).then(({ code, data }) => {
        if (code === 200) {
          this.frelation = 2;
          this.$store.commit('setAddFriend', {
            show: false,
            info: {
              times: this.addFriend.info.times + 1
            }
          });
        }
        console.log(data, 'add friend -----');
      });
    },
    // like
    acceptSimulationAdd () {
      console.log('---like------');
      logReport({
        eventId: '106-1-3-21',
        r_source: 'match',
        targetUserId: this.remoteUserInfo.id
      });
      const params = {
        hostLike: true,
        userLike: true,
        hostId: this.remoteUserInfo.id,
        matchType: 2
      };
      matchLike(params).then(res => {
        console.log('---加好友 成功----');
        this.showSimulationAccept = false;
        this.frelation = true;
      });
    },
    reportUser () {
      logReport({
        eventId: '106-1-3-8',
        r_source: 'match',
        targetUserId: this.remoteUserInfo.id
      });
      this.showReport = !this.showReport;
      if (this.showReport) {
        this.reportVideo = 2;
      }
    },
    getShow () {
      this.showReport = false;
    },
    hideReportHandler () {
      if (this.isReport) {
        this.cancelVideo();
        this.isReport = false;
      }
    },
    chargeShowAction () {
      logReport({
        eventId: '106-1-3-14',
        r_source: 'match',
        targetUserId: this.remoteUserInfo.id
      });
      this.setChargeShow();
    },
    setChargeShow () {
      this.payUrl = getPaymentUrl(this.$store.state.app.userInfo, history.length); // 设置三方支付连接
      this.showCharge = true;
      this.$refs.dialogC.showGift = false;
    },
    chargeEnd () {
      this.showCharge = false;
      console.log('++++', this.showCharge);
      this.updateMyUserData();
      // let len = this.rlen - history.length - 1;
      // if (len >= 0) len = -1;
      // this.$router.go(len);
    },
    updateCoin () {
      getUserInfoData({}).then(({ code, data }) => {
        if (typeof data.goldNum === 'number') {
          this.$store.commit('updateCoin', data.goldNum);
        }
      });
    },
    receiveMessage (self) {
      return (event) => {
        if (event.data && event.data.type === 'paySuccess') {
          self.$store.commit('updateVideoRecharge', false);
          console.log('充值成功，更新金币', event);
          self.updateCoin();
        }
        if (event.data && event.data.type === 'parentHref') {
          self.cancelVideo(() => {
            window.location.href = event.data.url;
          });
        }
        if (event.data && event.data.type === 'postMessageForm') {
          self.cancelVideo(() => {
            handlePostMessageForm(event.data.form);
          });
        }
      };
    },
    outClick () {
      this.showReport = false;
      this.$refs.dialogC.showGift = false;
    },
    giftLine (value) {
      this.showGiftLine = !value;
    },
    setRemoteMute () {
      const v = this.fMute ? 1 : 0;
      this.fMute = !this.fMute;
      this.matchedVideo.volume = v;
      // 关闭声音上报
      logReport({
        eventId: '106-1-3-16',
        r_source: 'match',
        targetUserId: this.remoteUserInfo.id
      });
    },
    setMyMute () {
      const v = this.mMute ? 100 : 0;
      this.mMute = !this.mMute;
      this.$rtc.toggleMyMute(v);

      // 关闭麦克风上报
      logReport({
        eventId: '106-1-3-17',
        r_source: 'match',
        targetUserId: this.remoteUserInfo.id
      });
    },
    reportSucc () {
      console.log('-----88-----');
      this.cancelVideo();
    },
    resetStatus () {
      this.mMute = false;
      this.fMute = false;
      this.showCharge = false;
      this.showReport = false;
      this.isReport = false;
      this.showSimulationAccept = false;

      clearTimeout(this.callTimer);
      this.callTimer = null;
      this.callTimeSec = 0;
      this.callTime = '00: 00';
    },

    // 视频通话时长统计 从首帧开始 到通话挂断结束
    startCallTimeCount () {
      this.callTimer = setInterval(() => {
        this.callTimeSec += 1;
        let min = Math.floor(this.callTimeSec / 60);
        let sec = this.callTimeSec % 60;
        min = min < 10 ? '0' + min : min;
        sec = sec < 10 ? '0' + sec : sec;
        this.callTime = min + ':' + sec;
      }, 1000);
    },
    watchVideo () {
      // window.$mObj.videoE.src = this.remoteUserInfo.video;
      if (!window.$mObj.videoE.src) {
        window.$mObj.videoE.src = this.remoteUserInfo.video;
      }
      const videoBox = document.querySelector('#matchedVideoBox');
      const video = videoBox.children;
      console.log(video, '------video-------');
      if (video.length) {
        video.remove();
      } else {
        videoBox.append(window.$mObj.videoE);
      }

      this.matchedVideo = window.$mObj.videoE;
      if (this.matchedVideo.pause && !this.matchedVideo.ended) {
        this.matchedVideo.play();
      }
      this.deductMyCoin();

      const playFn = (event) => {
        console.log('--视频开始播放--', this.showMatchedPop);
        if (this.showMatchedPop) {
          console.log('------播放扣费-----');
          this.deductMyCoin();
        }
        this.matchedVideo.removeEventListener('play', playFn);
      };

      const pauseFn = (event) => {
        console.log('视频暂停，表示结束');
        window.curMsgPop && window.curMsgPop.close();
        this.cancelVideo();
        this.matchedVideo.removeEventListener('pause', pauseFn);
      };

      // this.matchedVideo.addEventListener('play', playFn);
      this.matchedVideo.addEventListener('pause', pauseFn);
    },
    // 返回男的 播放视频时扣费
    deductMyCoin () {
      apiDeductGold({
        goldNum: +sessionStorage.getItem('matchPrice')
      }).then(res => {
        console.log(res, '------视频扣费------');
        if (res.code === 200 && res.data.success) {
          console.log(res, '------视频扣费-成功-----');
        } else {
          console.log('--扣费失败----');
          this.cancelVideo();
        }
      });
    },
    timerAddFriend () {
      const time = this.remoteUserInfo.likeShowTime;
      this.timer = setTimeout(() => {
        if (this.frelation) return;
        this.showSimulationAccept = true;
      }, time * 1000);
      this.$once('hook:beforeDestroy', () => {
        clearTimeout(this.timer);
        this.timer = null;
      });
    },

  },
  mounted () {
    // 初始化检测是否全屏
    if (checkFullScreen()) {
      this.isFullScreen = true;
    }
    // 全屏状态下 无法监听 esc keydown 事件 所以改为监听resize事件
    window.addEventListener('resize', this.escKeyDown);
    window.full = fullScreen;
    this.receiveMessageHandle = this.receiveMessage(this);
    window.addEventListener('message', this.receiveMessageHandle, false);
  },
  beforeDestroy () {
    // destory 前 移除监听
    window.removeEventListener('resize', this.escKeyDown);
    window.removeEventListener('message', this.receiveMessageHandle);
  },
};
</script>

<style lang="less">
@import url("./index.less");
</style>

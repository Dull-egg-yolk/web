<template>
  <Base-pop :showPop="show1v1Pop" v-if="show1v1Pop" class="video-chat video-chat-1v1" :class="{ fullscreen: isFullScreen, clear: !showDetail }" @outClik="outClick">
    <div class="cover-bg">
      <img :src="matchCallData.headImg" alt="">
    </div>
    <div class="video-container flex-row-strech">

      <!-- 聊天 -->
      <div class="chat-cell" :class="{'has-system-msg': videoRecharge}">
        <dialog-box theme="dark" :friendId="friendId" @send="sedMsg" @giftLine="giftLine" chatTye="video"
          :friendAvatar="matchCallData.headImg" ref="dialogC" :showTime="false" @toCoin="setChargeShow"></dialog-box>
        <!-- 切 next -->
        <div class="btn-next fx-ic" @click.stop="nextMatch">
          <span class="txt">{{$t('app.video_cut_next')}}</span>
          <span class="icon-arrow"></span>
        </div>
      </div>
      <!-- 视频 -->
      <div class="video-cell">
        <div class="main-video" >
          <div class="the-video" id="chat1v1-mainVideo" @click="showDetail = !showDetail"></div>
          <!-- 用户信息 -->
          <transition name="slideUp">
          <div class="user-detail" v-show="!frelation || (frelation && showDetail)">
            <div class="avatar-img">
              <div class="avatar-wrap">
                <img :src="matchCallData.headImg" alt />
              </div>
            </div>
            <div class="detail">
              <div class="name">{{ matchCallData.userName }}</div>
              <div class="num small-font">
                <span class="ding">
                  <span class="ico icon-girl" v-if="matchCallData.gender === 2"></span>
                  <span class="ico icon-boy" v-else></span>
                  {{matchCallData.birthday | calculateAge}}
                </span>
                <span class="location">
                  <span class="icon-location"></span>
                  <country :countryId="matchCallData.countryId" type="name"></country>
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
        <div class="mini-video">
          <div class="the-time" v-if="beginMinCall">{{ callTime }}</div>
          <div class="the-video" id="chat1v1-miniVideo"></div>
          <div class="change aciton-btn">
            <span class="icon-replace"></span>
          </div>
        </div>
        <!-- 挂断 -->
        <div class="cancel-video action-btn" @click="cancelPop">
          <span class="icon-cross"></span>
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
          <!-- 金币 -->
          <div class="coin-info fx-c">

            <div class="recharge-iframe" v-if="showCharge" >
              <span class="icon icon-cross hover" @click="chargeEnd"></span>
              <iframe  v-if="payUrl" :src="payUrl" frameborder="0"></iframe>
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
      <div class="accpet-addf fx-c" v-if="showAccpet && !beginMinCall">
        <div class="inner fx-c">
          <p>{{$t('app.request_add_friend', {friendName: matchCallData.userName})}}</p>
          <div class="m-btn mini major" @click="acceptAdd">Accept</div>
        </div>
      </div>

      <!-- 收到同意邀请 -->
      <div class="accept-success" v-if="showAFSuccess">
        {{$t('app.accept_add_freind_request', {friendName: matchCallData.userName})}}
      </div>
    </div>
    <report-menu class="user-report-pop" :friendData="matchCallData" :reportVideo="reportVideo" v-if="showReport" @show="hideReportHandler" @reportSucc="setReportRes"  v-clickoutside:click="hideReportHandler" />

    <LimitedCoin resource="video" :isShowLimited="isShowLimited"></LimitedCoin>
  </Base-pop>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import BasePop from '../BasePop.vue';
import DialogBox from '../DialogBox';
import { apiAddFriend } from '@/api/friend';
import { apiAutoAddFriend } from '@/api/livcam';
import ReportMenu from '@/components/PopFiles/ReportMenu.vue';
import Clickoutside from '@/util/clickoutside.js';
import LimitedCoin from '@/components/LimitedCoin';

import {
  fullScreen,
  cancelFullScreen,
  checkFullScreen,
} from '@/tools/index';

import { apiMatch1V1End, apiUserVideo } from '@/api/call';
// import { apiGetMyCoin } from '@/api/user';
import { getUserInfoData, apiUplodImg } from '@/api/user';

import { getBaseUrl, getStorageByDay, setStorageByDay } from '@/util/index';
import { calculateAge } from '@/filters';
import { logReport } from '@/util/logReport';
import { getPaymentUrl, handlePostMessageForm } from '@/util/shop';

export default {
  name: 'VideoChat1V1',
  data () {
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
      addFriendFn: null,
      minct: 0,
      callTime: '00:00',
      cTimer: null,
      isShowLimited: false,
      cancelTimer: null,
    };
  },
  components: {
    BasePop,
    DialogBox,
    ReportMenu,
    LimitedCoin,
  },
  filters: {
    calculateAge,
  },
  directives: { Clickoutside },
  computed: {
    ...mapState({
      bizData: (state) => state.agora.bizData,
      show1v1Pop: (state) => state.app.show1v1Pop,
      curRoomNum: (state) => state.agora.curRoomNum,
      userInfo: (state) => state.app.userInfo,
      giftList: (state) => state.app.giftList,
      addFriend: (state) => state.app.addFriend,
      videoRecharge: (state) => state.app.videoRecharge,
      curCallRole: (state) => state.agora.curCallRole,
      isMobile: (state) => state.app.isMobile,
      isHomeHost: (state) => state.app.isHomeHost,
      homeParams: (state) => state.app.homeParams,
      matchCallData: (state) => state.agora.matchCallData,
      friendId: (state) => state.agora.matchCallData.id,
      beginMinCall: (state) => state.agora.beginMinCall,
      minCallConf: (state) => state.agora.minCallConf,
      end1v1ByHost: (state) => state.agora.end1v1ByHost,
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
        roomId: this.matchCallData.ident
      };
      if (this.isHomeHost) {
        Object.assign(logParams, this.homeParams);
      }
      return logParams;
    },
  },
  watch: {
    show1v1Pop (n, o) {
      if (n) {
        clearTimeout(this.cancelTimer);
        this.cancelTimer = setTimeout(() => {
          this.$store.commit('set1v1endByHost', true);
          this.cancelVideo();
        }, 15 * 1000);

        window.curMsgPop && window.curMsgPop.close();
        this.isDing = false;
        window.$mObj.timer && clearTimeout(window.$mObj.timer);
        window.$mObj.matchTimer && clearTimeout(window.$mObj.matchTimer);
        this.$store.commit('setAddFriend', {
          show: false,
          info: {
            type: 0,
            times: 0
          }
        });

        // 通话成功上报
        logReport({
          eventId: '106-1-3-2',
          r_source: 'call',
          target_user_id: this.friendId,
        });
        this.$nextTick(() => {
          this.$store.commit('resetDialog');
          console.log('rtc==', document.querySelector('#chat1v1-miniVideo'));
          setTimeout(() => {
            this.$rtc.localVideoTrack && this.$rtc.localVideoTrack.play('chat1v1-miniVideo');
          }, 400);
        });
        this.frelation = this.matchCallData.relation === 2;
        const params = {
          flag: this.matchCallData.ident
        };
        setTimeout(() => {
          this.$refs.dialogC.sendFaceShow(params);
          this.$refs.dialogC.sendVideoBlurMsg(params);
          // this.$refs.dialogC.sendWebTipsShow();
        }, 1000 * 1);
        setTimeout(() => {
          this.$refs.dialogC.sendFaceShow(params);
          this.$refs.dialogC.sendVideoBlurMsg(params);
        }, 1000 * 2);
        setTimeout(() => {
          this.$refs.dialogC.sendFaceShow(params);
          this.$refs.dialogC.sendVideoBlurMsg(params);
        }, 1000 * 3);
        setTimeout(() => {
          this.$refs.dialogC.sendFaceShow(params);
          this.$refs.dialogC.sendVideoBlurMsg(params);
        }, 1000 * 6);

        // 记录当天的通话和发消息次数
        const times = getStorageByDay('RC_todayMatchTimes');
        console.log(times, '----当天通话次数---');
        const countTimes = times + 1;
        setStorageByDay('RC_todayMatchTimes', countTimes);
        if (+localStorage.getItem('RC_SAFARI_CALL') === 1) {
          localStorage.setItem('RC_SAFARI_CALL', 2);
        }
      } else {
        // 上报
        this.callReqReport(this.beginMinCall ? 2 : 1);

        clearTimeout(this.cancelTimer);
        if (this.end1v1ByHost && this.frelation !== 2) {
          this.timerAddFriend();
        }
        clearTimeout(this.addFriendFn);
        this.$emit('changeDiscountCoin');
        this.addFriendFn = null;
        this.updateCoin();
        clearInterval(this.cTimer);
        this.resetData();

        this.$store.commit('resetBeginMinCall');
      }
    },
    frelation (n, o) {
      if (!o && n) {
        this.showDetail = true;
      }
    },
    showAccpet (n) {
      if (n) {
        if (!this.show1v1Pop) return;
        logReport({
          eventId: '106-1-3-40',
          target_user_id: this.matchCallData.id,
          freeName2: this.logParams
        });
      }
    },
    beginMinCall (n) {
      if (n) {
        this.callReqReport(1);
        this.cpMinTime();
      }
    },
    matchCallData (n) {
      console.log('abc', n);
      this.frelation = n.relation === 2;
    },
    videoRecharge (ne, ol) {
      this.isShowLimited = ne;
    }

  },
  methods: {
    ...mapActions(['updateMyUserData']),
    cpMinTime () {
      this.cTimer = setInterval(() => {
        console.log('calltime');
        this.minct += 1;
        let min = Math.floor(this.minct / 60);
        let sec = this.minct % 60;
        min = min < 10 ? '0' + min : min;
        sec = sec < 10 ? '0' + sec : sec;
        this.callTime = min + ':' + sec;
      }, 1000);
    },
    callReqReport (type) {
      // type 1 是 1v1匹配  2 是转分钟call
      const callTime = Date.now() - (type === 1 ? window.$mObj.callst1v1 : window.$mObj.callstMinu);
      const callLocation = type === 1 ? 2 : this.minCallConf.videoLocation;
      apiUserVideo({
        matchUserId: this.friendId,
        roomId: this.matchCallData.ident,
        inappFlag: 0,
        matchFlag: -1,
        goddessLocation: callLocation,
        requestType: 1,
        isFriend: this.matchCallData.relation === 2 ? 2 : 1,
        gender: this.userInfo.gender,
        videoTime: callTime,
        type: 2,
        matchedGender: this.matchCallData.gender,
        feeType: 1,
        inmatchFlag: 0,
        onlineStatus: 1,
        isPay: 1,
        goddessVideo: this.matchCallData.goddess ? 2 : 1,
      }).then(res => {
        console.log(res);
      });
    },
    async cancelPop () {
      this.$message({
        // isReversal: true,
        activeAffirm: false,
        desc: {
          title: this.$t('webChat.hangUp'),
          txt: this.$t('webChat.sureLeave') // '确定要挂断电话么?'
        },
        noCancelBtn: false,
      }).then(async () => {
        this.cancelVideo();
        this.$router.push({ name: 'LivCam' });
        logReport({
          eventId: '106-1-3-34',
          r_source: 'call',
          target_user_id: this.matchCallData.id,
          free_name2: {
            roomId: this.matchCallData.ident
          }
        });
        window.gtag && window.gtag('event', '1v1ChatVideoCallDuration ', { send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'], callDuration: this.$store.state.agora.callTimeSec });
      }).catch(e => {
        logReport({
          eventId: '106-1-3-13',
          r_source: 'call',
          target_user_id: this.matchCallData.id
        });
      });
    },
    async cancelVideo (cb) {
      apiMatch1V1End({}).then(({ code, data }) => {
        console.log(code, data, 'exit call');
        this.$rtc.leavl1V1();
      });
    },
    sendMsg () {
      this.$rtm.sendMessage(this.chatMsg);
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
      this.$rtc.changeVideoPos();
    },
    // 主动添加好友
    addFriendAction () {
      logReport({
        eventId: '106-1-3-20',
        r_source: 'call',
        targetUserId: this.matchCallData.id
      });
      apiAddFriend({
        addWay: 101,
        friendUserId: this.matchCallData.id,
        addReally: false,
        flag: this.matchCallData.ident || '',
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
        friendUserId: this.matchCallData.id,
        addReally: true,
        flag: this.matchCallData.ident || '',
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
      logReport({
        eventId: '106-1-3-21',
        r_source: 'call',
        targetUserId: this.matchCallData.id
      });
    },
    reportUser () {
      logReport({
        eventId: '106-1-3-8',
        r_source: 'call',
        target_user_id: this.matchCallData.id
      });
      this.getUploadImg();
      this.$store.commit('setFriendInfo', this.matchCallData);
      this.$store.commit('setShowReport', true);
    },
    getUploadImg () {
      const imgFormData = this.$rtc.screenShot();
      if (!imgFormData) return;
      const formData = new FormData();
      formData.append('image', imgFormData);
      apiUplodImg(formData, true).then(res => {
        const imgUrl = res?.data?.data?.url;
        console.log(imgUrl);
        this.$store.commit('setReportImg', imgUrl);
      });
    },
    getShow () {
      this.showReport = false;
    },
    setReportRes (val) {
      this.isReport = val;
    },
    hideReportHandler () {
      this.showReport = false;
      if (this.isReport) {
        this.cancelVideo();
        this.isReport = false;
      }
    },
    chargeShowAction () {
      logReport({
        eventId: '106-1-3-14',
        r_source: 'call',
        target_user_id: this.matchCallData.id
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
    },
    updateCoin () {
      getUserInfoData({}).then(({ code, data }) => {
        if (typeof data.goldNum === 'number') {
          this.$store.commit('updateCoin', data.goldNum);
        }
      });
    },
    outClick () {
      this.showReport = false;
      this.$refs.dialogC.showGift = false;
    },
    giftLine (value) {
      this.showGiftLine = !value;
    },
    setRemoteMute () {
      const v = this.fMute ? 100 : 0;
      this.fMute = !this.fMute;
      this.$rtc.toggleRemoteMute(v);
      // 关闭声音上报
      logReport({
        eventId: '106-1-3-16',
        r_source: 'call',
        target_user_id: this.matchCallData.id
      });
    },
    setMyMute () {
      const v = this.mMute ? 100 : 0;
      this.mMute = !this.mMute;
      this.$rtc.toggleMyMute(v);

      // 关闭麦克风上报
      logReport({
        eventId: '106-1-3-17',
        r_source: 'call',
        target_user_id: this.matchCallData.id
      });
    },
    resetStatus () {
      this.mMute = false;
      this.fMute = false;
      this.showCharge = false;
      this.isShowLimited = false;
    },
    backCancelCall () {
    },
    timerAddFriend () {
      const params = {
        hostId: this.friendId,
        flag: this.matchCallData.ident || '',
      };
      apiAutoAddFriend(params).then(res => {
        console.log(res, '--自动加好友------');
      });
    },
    nextMatch () {
      logReport({
        eventId: '106-1-3-11',
        r_source: '1v1',
        target_user_id: this.friendId,
      });
      this.cancelVideo();
    },
    resetData () {
      this.showReport = false;
      this.showDetail = true;
      this.showCharge = false;
      this.minct = 0;
      this.callTime = '00:00';
      this.mMute = false;
      this.$rtc.toggleMyMute(100);
    }
  },
  mounted () {
    // 全屏状态下 无法监听 esc keydown 事件 所以改为监听resize事件
    window.addEventListener('resize', this.escKeyDown);
    window.full = fullScreen;
    document.addEventListener('visibilitychange', this.backCancelCall);
  },
  beforeDestroy () {
    // destory 前 移除监听
    window.removeEventListener('resize', this.escKeyDown);
  },
};
</script>

<style lang="less">
@import url("./index.less");
</style>

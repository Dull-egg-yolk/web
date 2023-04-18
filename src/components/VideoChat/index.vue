<template>
  <Base-pop :showPop="showVideoPop" v-if="showVideoPop" class="video-chat" :class="{ fullscreen: isFullScreen, clear: !showDetail }" @outClik="outClick">
    <div class="cover-bg">
      <img :src="remoteUserInfo.headImg" alt="">
    </div>
    <div class="video-container flex-row-strech">

      <div class="video-times">{{ callTime }}</div>
      <!-- 聊天 -->
      <div class="chat-cell" :class="{'has-system-msg': videoRecharge}">
        <dialog-box theme="dark" :friendId="friendId" @send="sedMsg" @giftLine="giftLine" chatTye="video"
          :friendAvatar="remoteUserInfo.headImg" ref="dialogC" :showTime="false" @toCoin="setChargeShow"></dialog-box>
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
        <div class="mini-video">
          <div class="the-video" id="chat1v1-miniVideo"></div>
          <div class="change aciton-btn">
            <span class="icon-replace"></span>
          </div>
          <div class="video-minibg" @click="changeVideoPos"></div>
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
            <!-- <div class="recharge-pop" v-if="videoRecharge">
             {{$t('app.flash_charge_toast_hint')}}
            </div> -->

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
      <div class="accpet-addf fx-c" v-if="showAccpet">
        <div class="inner fx-c">
          <p>{{$t('app.request_add_friend', {friendName: remoteUserInfo.userName})}}</p>
          <div class="m-btn mini major" @click="acceptAdd">Accept</div>
        </div>
      </div>

      <!-- 充值提醒 -->
      <div class="system-msg-tips fx-c" v-if="videoRecharge">
        <div class="inner fx-c">
          <p>{{$t('app.flash_charge_toast_hint')}}</p>
          <div class="m-btn mini major" @click="jumpToCoin">{{$t('app.tips_limit_gold_desc')}} {{resetTime}}s</div>
        </div>
      </div>

      <!-- 收到同意邀请 -->
      <div class="accept-success" v-if="showAFSuccess">
        {{$t('app.accept_add_freind_request', {friendName: remoteUserInfo.userName})}}
      </div>
    </div>
    <report-menu class="user-report-pop" :friendData="remoteUserInfo" :reportVideo="reportVideo" v-if="showReport" @show="hideReportHandler" @reportSucc="setReportRes"  v-clickoutside:click="hideReportHandler" />
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

import { apiHangup, apiUserVideo, apiFriendVideo } from '@/api/call';
// import { apiGetMyCoin } from '@/api/user';
import { getUserInfoData, apiUplodImg } from '@/api/user';

import { getBaseUrl, getStorageByDay, setStorageByDay } from '@/util/index';
import { calculateAge } from '@/filters';
import { logReport } from '@/util/logReport';
import { getPaymentUrl, handlePostMessageForm } from '@/util/shop';

export default {
  name: 'Video1V1',
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
      resetTime: 58,
      resetFn: null,

      remoteUserInfo: {
        relation: 0,
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
      isShowLimited: false
    };
  },
  components: {
    BasePop,
    DialogBox,
    ReportMenu,
    LimitedCoin
  },
  filters: {
    calculateAge,
  },
  directives: { Clickoutside },
  computed: {
    ...mapState({
      bizData: (state) => state.agora.bizData,
      showVideoPop: (state) => state.app.showVideoPop,
      curRoomNum: (state) => state.agora.curRoomNum,
      // remoteUserInfo: (state) => state.agora.bizData.remoteUserInfo,
      friendId: (state) => state.agora.bizData.remoteUserInfo.id,
      callTime: (state) => state.agora.callTime,
      callTimeSec: (state) => state.agora.callTimeSec,
      userInfo: (state) => state.app.userInfo,
      giftList: (state) => state.app.giftList,
      addFriend: (state) => state.app.addFriend,
      videoRecharge: (state) => state.app.videoRecharge,
      curCallRole: (state) => state.agora.curCallRole,
      isMobile: (state) => state.app.isMobile,
      isHomeHost: (state) => state.app.isHomeHost,
      homeParams: (state) => state.app.homeParams,
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
    showVideoPop (n, o) {
      if (n) {
        window.curMsgPop && window.curMsgPop.close();
        const storeUser = this.$store.state.agora.bizData.remoteUserInfo;
        this.remoteUserInfo = { ...this.remoteUserInfo, ...storeUser };
        this.isDing = false;
        this.$store.commit('setCallTime', {
          time: 0,
          sec: 0
        });
        // 清除定时器
        window.$mObj.timer && clearTimeout(window.$mObj.timer);
        window.$mObj.matchTimer && clearTimeout(window.$mObj.matchTimer);

        this.$store.commit('setAddFriend', {
          show: false,
          info: {
            type: 0,
            times: 0
          }
        });
        this.$store.commit('updateVideoRecharge', false);
        this.$nextTick(() => {
          this.$rtc.joinChannel();
          this.$store.commit('resetDialog');
        });
        this.frelation = this.remoteUserInfo.relation === 2;

        setTimeout(() => {
          this.$refs.dialogC.sendFaceShow();
          // this.$refs.dialogC.sendVideoBlurMsg();
          // this.$refs.dialogC.sendWebTipsShow();
        }, 1000 * 3);
        setTimeout(() => {
          this.$refs.dialogC.sendFaceShow();
          // this.$refs.dialogC.sendVideoBlurMsg();
        }, 1000 * 6);

        setTimeout(() => {
          this.$refs.dialogC.sendFaceShow();
          // this.$refs.dialogC.sendVideoBlurMsg();
        }, 1000 * 9);
        const callLogP = Object.assign({}, this.logParams);
        if (this.curCallRole === 'caller' && window.$mObj.callSt) {
          callLogP.time = Date.now() - window.$mObj.callSt;
        }
        // 通话成功上报
        logReport({
          eventId: '106-1-3-2',
          r_source: 'call',
          freeName2: callLogP,
          target_user_id: this.remoteUserInfo.id,
        });

        // 记录当天的通话和发消息次数
        const times = getStorageByDay('RC_todayMatchTimes');
        console.log(times, '----当天通话次数---');
        const countTimes = times + 1;
        setStorageByDay('RC_todayMatchTimes', countTimes);

        if (+localStorage.getItem('RC_SAFARI_CALL') === 1) {
          localStorage.setItem('RC_SAFARI_CALL', 2);
        }
      } else {
        this.timerAddFriend();
        // 挂断通话上报
        if (this.curCallRole === 'caller') {
          apiFriendVideo({
            onlineStatus: 1,
            busyStatus: 0,
            goddessCall: this.bizData.goddessLocation,
            matchUserId: this.remoteUserInfo.id,
            gold: this.bizData.pricePerMinute,
            requestType: this.curCallRole === 'caller' ? 1 : 2,
            roomId: this.curRoomNum,
            inappFlag: 0,
            matchFlag: -1,
            feeType: this.bizData.pricePerMinute ? 1 : 0,
          }).then(res => {
            console.log(res);
          });
        }
        apiUserVideo({
          matchUserId: this.remoteUserInfo.id,
          roomId: this.curRoomNum,
          inappFlag: 0,
          matchFlag: -1,
          goddessLocation: this.bizData.goddessLocation,
          requestType: this.curCallRole === 'caller' ? 1 : 2,
          isFriend: this.remoteUserInfo.relation === 2 ? 2 : 1,
          gender: this.userInfo.gender,
          videoTime: (this.callTimeSec || 0) * 1000,
          type: 2,
          matchedGender: this.remoteUserInfo.gender,
          feeType: this.bizData.pricePerMinute ? 1 : 0,
          inmatchFlag: 0,
          onlineStatus: 1,
          isPay: this.bizData.pricePerMinute ? 1 : 0,
          goddessVideo: this.remoteUserInfo.goddess ? 2 : 1,
        }).then(res => {
          console.log(res);
        });
        this.$emit('changeDiscountCoin');
        clearTimeout(this.addFriendFn);
        this.addFriendFn = null;
        this.$rtc.leaveCall();
        this.$store.commit('resetVideoChat');
        this.updateCoin();
        this.showDetail = true;
        this.showCharge = false;
      }
    },
    curRoomNum () {
      this.showReport = false;
    },
    frelation (n, o) {
      if (!o && n) {
        this.showDetail = true;
      }
    },
    showAccpet (n) {
      if (n) {
        logReport({
          eventId: '106-1-3-30',
          target_user_id: this.remoteUserInfo.id,
          freeName2: this.logParams
        });
      }
    },
    videoRecharge (ne, ol) {
      this.isShowLimited = ne;
      if (this.isMobile) return;
      if (ne) {
        logReport({
          eventId: '106-1-3-23',
          roomId: this.curRoomNum,
          callLocation: this.bizData.goddessLocation,
          target_user_id: this.friendId
        });
        this.cutDownTime();
      } else {
        this.resetRecharge();
      }
    }
  },
  methods: {
    ...mapActions(['updateMyUserData']),
    cutDownTime () {
      clearInterval(this.resetFn);
      this.resetFn = setInterval(() => {
        if (!this.resetTime) {
          this.resetRecharge();
          return;
        }
        this.resetTime -= 1;
      }, 1000);
    },
    resetRecharge () {
      clearInterval(this.resetFn);
      this.$store.commit('updateVideoRecharge', false);
      this.resetTime = 58;
    },
    jumpToCoin () {
      logReport({
        eventId: '106-1-3-24',
        roomId: this.curRoomNum,
        callLocation: this.bizData.goddessLocation,
        target_user_id: this.friendId
      });
      this.setChargeShow();
    },
    async cancelPop () {
      logReport({
        eventId: '106-1-3-11',
        r_source: 'call',
        target_user_id: this.remoteUserInfo.id,
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
        // logReport({
        //   eventId: '106-1-3-4',
        //   target_user_id: this.remoteUserInfo.id,
        //   freeName2: this.logParams
        // });
        logReport({
          eventId: '106-1-3-12',
          r_source: 'call',
          target_user_id: this.remoteUserInfo.id,
          free_name2: {
            roomId: this.curRoomNum
          }
        });
        window.gtag && window.gtag('event', 'GoMeetVideoCallDuration ', { send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'], callDuration: this.$store.state.agora.callTimeSec });
      }).catch(e => {
        logReport({
          eventId: '106-1-3-13',
          r_source: 'call',
          target_user_id: this.remoteUserInfo.id
        });
      });
    },
    async cancelVideo (cb) {
      await this.$rtc.leaveCall();
      this.$store.commit('setVideoPopState', false);
      const res = await apiHangup({ roomNum: this.curRoomNum });
      console.log(res, 'hangup');
      this.resetStatus();
      cb && cb();
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
        r_source: 'call',
        gender: this.remoteUserInfo.gender,
        targetUserId: this.remoteUserInfo.id,
        freeName2: this.logParams
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
      logReport({
        eventId: '106-1-3-21',
        r_source: 'call',
        targetUserId: this.remoteUserInfo.id
      });
    },
    reportUser () {
      logReport({
        eventId: '106-1-3-8',
        r_source: 'call',
        target_user_id: this.remoteUserInfo.id
      });
      this.getUploadImg();
      this.$store.commit('setFriendInfo', this.remoteUserInfo);
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
        target_user_id: this.remoteUserInfo.id
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
        if (event.data && event.data.type === 'closeIframePop') {
          self.updateCoin();
          self.$store.commit('updateVideoRecharge', false);
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
      const v = this.fMute ? 100 : 0;
      this.fMute = !this.fMute;
      this.$rtc.toggleRemoteMute(v);
      // 关闭声音上报
      logReport({
        eventId: '106-1-3-16',
        r_source: 'call',
        target_user_id: this.remoteUserInfo.id
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
        target_user_id: this.remoteUserInfo.id
      });
    },
    resetStatus () {
      this.mMute = false;
      this.fMute = false;
      this.showCharge = false;
    },
    backCancelCall () {
      if (document.visibilityState === 'hidden' && this.showVideoPop && this.isMobile) {
        this.cancelVideo();
      }
    },

    timerAddFriend () {
      const callLocation = this.bizData.goddessLocation;
      if (callLocation !== 100 || !this.remoteUserInfo.id) {
        console.log('---不是匹配通话-或不存在主播id-----', this.remoteUserInfo.id);
        return;
      }
      if (this.frelation) return;
      const params = {
        hostId: this.remoteUserInfo.id,
      };
      apiAutoAddFriend(params).then(res => {
        console.log(res, '--自动加好友------');
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
    if (self === top) {
      window.addEventListener('message', this.receiveMessageHandle, false);
    }
    document.addEventListener('visibilitychange', this.backCancelCall);
  },
  beforeDestroy () {
    // destory 前 移除监听
    window.removeEventListener('resize', this.escKeyDown);
    if (self === top) {
      window.removeEventListener('message', this.receiveMessageHandle);
    }
  },
};
</script>

<style lang="less">
@import url("./index.less");
</style>

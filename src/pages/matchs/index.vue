<template>
  <div class="match-page">
   <!-- cancel -->
   <div class="icon-cross fx-c btn-cancel" v-if="isMobile" @click="cancel"></div>

   <transition-group class="inner" name="slideUp" tag="div">
     <!-- step 1 matching -->
     <div class="mt-step matching" v-if="step===1" key="step-1">
       <div class="status-box">
         <div class="avatar-box">
           <img :src="userInfo.headImg" />
         </div>
         <div class="txt">{{ $t('app.flop_recommend_recommend_searching') }}...</div>
       </div>
     </div>
     <!-- step2 connect -->
     <div class="mt-step connect-box" v-show="step===2"  key="step-2">
       <div class="flex-col-vc">
         <div class="step-txt">{{$t('app.flop_recommend_cam_call_connected')}}...</div>
         <div class="avatar avatar-img host-cover">
           <div class="avatar-wrap">
             <fitimg :headImg="hostData.headImg" type="bigimg"></fitimg>
           </div>
         </div>
         <div class="name">{{hostData.userName}}</div>
         <div class="local fx-v">
             <div class="avatar-img">
               <div class="avatar-wrap">
                 <country :countryId="hostData.countryId" type="img"></country>
               </div>
             </div>
             <div class="info">
               <country :countryId="hostData.countryId" type="name"></country>
             </div>
         </div>
         <div class="tag-list" v-if="hostData.interestLabels && hostData.interestLabels.length">
           <div class="h-tag " v-for="item of hostData.interestLabels" :key="item">{{ $t(`interest.${item}`) }}</div>
         </div>
         <div class="m-btn btn-next" @click="toMatchNext" :class="{show: showNextBtn}">
           {{$t('app.video_cut_next')}}
         </div>
       </div>
     </div>
   </transition-group>

  <!-- step3 recall -->
   <div class="mt-step recall-box" v-show="step===3">
     <div class="img-bg">
       <div class="my-video" id="myVideo-box"></div>
     </div>
     <div class="host-invite">
       <div class="recall-tips">
         <p>{{ $t('webChat.recallT1') }}</p>
         <p>{{ $t('webChat.recallT2') }}</p>
       </div>
       <div class="avatar avatar-img host-cover">
         <div class="avatar-wrap">
           <fitimg :headImg="hostData.headImg" type="bigimg"></fitimg>
         </div>
       </div>
       <div class="name">{{hostData.userName}}, {{ hostData.birthday | calculateAge }}</div>
       <div class="local fx-v">
         <div class="avatar-img">
           <div class="avatar-wrap">
             <country :countryId="hostData.countryId" type="img"></country>
           </div>
         </div>
         <div class="info">
           <country :countryId="hostData.countryId" type="name"></country>
         </div>
       </div>
       <div class="tag-list" v-if="hostData.interestLabels && hostData.interestLabels.length">
         <div class="h-tag min" v-for="item of hostData.interestLabels" :key="item">{{ $t(`interest.${item}`) }}</div>
       </div>
       <div class="action-list flex-col-vc">
         <button class="m-btn major btn-call"  v-preventReClick @click="toCall">
           <span class="ico icon-video2"></span>
           {{$t('webChat.recallBtn')}}
         </button>
         <div class="m-btn btn-next" @click="recallNext">
           {{$t('app.video_cut_next')}} {{ nextTxt }}s
         </div>
       </div>
     </div>
   </div>

   <div class="bgs">
    <div class="circle c1"></div>
    <div class="circle c2"></div>
    <div class="circle c3"></div>
    <div class="circle c4"></div>
    <div class="circle c5"></div>
    <div class="circle c6"></div>
  </div>
 </div>

</template>

<script>
import { mapState } from 'vuex';
import agoraMixin from '@/mixin/agoraMixin';
import { apiAutoAddFriend, apiGetMatchingHost } from '@/api/livcam';
import { apiAddFriend } from '@/api/friend';

import { logReport } from '@/util/logReport';
import { setStorageById } from '@/util/index';
import { getDiscountCoin } from '@/components/messageBox/htmlData';
import { calculateAge } from '@/filters';

const coin = require('@/assets/img/icon-coin.png');

export default {
  name: 'matchBox',
  data () {
    return {
      step: 1,
      wtime: +sessionStorage.getItem('matchTime') || 10,
      showNextBtn: false,
      // hostData: {},
      hostData: {
        birthday: '2003-01-17T01:07:20.521+0000',
        gender: 2,
        countryId: 139,
        relation: 2,
        id: 116197226,
        headImg: 'http://lcpic9.rcplatformhk.com/user-icon/female3.png',
        introduce: '阿斯顿发斯蒂芬sad',
        interestLabels: [1, 2, 3, 4],
        userName: '柴麒',
      },
      cutTimer: null,
      nextTimer: null,
      videoUrlId: '',
      isStop: false,
      matchNextFn: null,
      autoAddFriendFn: null,
      markStepOne: 0,
      markStepTwo: 0,
      reMatchTimer: null,
      matchType: 2,
      nextTxt: 15,
      recallNextTimer: null,
    };
  },
  mixins: [agoraMixin],
  filters: {
    calculateAge,
  },
  watch: {
    step: {
      handler: function (n, v) {
        if (n === 2) {
          const time = +window.$mObj.matchConf.showNextBtnCountdownOfSeconds || 1;
          const nextTime = +window.$mObj.matchConf.countdownOfSeconds || 5;
          setTimeout(() => {
            this.showNextBtn = true;
          }, time * 1000);
          // 7s 加好友
          // this.autoAddFriendFn = setTimeout(() => {
          //   this.timerAddFriend();
          // }, 7 * 1000);

          // 自动切换
          this.nextTimer = setTimeout(() => {
            this.toMatchNext();
          }, nextTime * 1000);
        }

        if (n === 1) {
          this.markStepOne = Date.now();
          logReport({
            eventId: '106-5-2-0', // 匹配页面曝光
            freeName2: window.$mObj.adData || {},
          });
        }
        if (n === 2) {
          this.markStepTwo = Date.now();
          const now = Date.now();
          const time = now - this.markStepOne;
          logReport({
            eventId: '106-5-2-1', // 匹配成功页面曝光
            freeName2: window.$mObj.adData || {},
            targetUserId: this.hostData.id,
            gender: this.hostData.gender,
            time,
          });
        }
        if (n === 3) {
          logReport({
            eventId: '106-1-3-41',
            target_user_id: this.hostData.id,
            freeName2: {
              roomNum: this.matchCallData.ident,
              callLocation: window.$mObj.matchConf.continueCallLocation
            }
          });

          this.$nextTick(() => {
            this.$rtc.localVideoTrack.play('myVideo-box');
          });
        }
      },
      immediate: true,
    },
    matchCallCancel (n) {
      if (!n) return false;
      // 超时 或者对方拒绝 开始下一轮match
      this.showNextBtn = false;
      this.step = 1;
      console.log('matchCallCancel vue');
      this.matchNext();
    },
    show1v1Pop (n, v) {
      if (n) {
        clearTimeout(this.nextTimer);
        clearTimeout(this.recallNextTimer);
        this.nextTxt = 15;
        logReport({
          eventId: '106-5-2-2', // match匹配成功页面曝光
          freeName2: window.$mObj.adData || {},
          targetUserId: this.hostData.id
        });
      }

      if (v && !n) {
        this.showNextBtn = false;

        if (this.end1v1ByHost) {
          this.step = 3;
          this.recallNextCut();
          return;
        }
        this.step = 1;
        this.matchNext();
      }
    },
    showRingBell (n, v) {
      if (n) {
        clearTimeout(this.recallNextTimer);
        this.nextTxt = 15;
      }
      if (!n && v && !this.showVideoPop) {
        this.step = 1;
        this.matchNext();
      }
    },
    showVideoPop (n, v) {
      if (n) {
        clearTimeout(this.recallNextTimer);
        this.nextTxt = 15;
      }
      if (v && !n) {
        this.step = 1;
        this.matchNext();
      }
    }

  },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
      isMobile: (state) => state.app.isMobile,
      userInfo: (state) => state.app.userInfo,
      matchCallCancel: (state) => state.app.matchCallCancel,
      isMatchCall: (state) => state.app.isMatchCall,
      showRingBell: (state) => state.app.showRingBell,
      showVideoPop: (state) => state.app.showVideoPop,
      show1v1Pop: (state) => state.app.show1v1Pop,
      end1v1ByHost: (state) => state.agora.end1v1ByHost,
      matchCallData: (state) => state.agora.matchCallData,
      siteFunc: (state) => state.app.siteFunc,
    }),
  },
  methods: {
    toCall () {
      logReport({
        eventId: '106-1-3-42',
        target_user_id: this.hostData.id,
        freeName2: {
          roomNum: this.matchCallData.ident,
          callLocation: window.$mObj.matchConf.continueCallLocation
        }
      });
      clearTimeout(this.recallNextTimer);
      this.callAction(this.hostData, window.$mObj.matchConf.continueCallLocation);

      // 自动加双向好友
      apiAddFriend({
        addWay: 101,
        friendUserId: this.hostData.id,
        addReally: true,
      });
    },
    recallNextCut () {
      clearTimeout(this.recallNextTimer);
      this.recallNextTimer = setTimeout(() => {
        this.nextTxt -= 1;
        if (!this.nextTxt) {
          clearTimeout(this.recallNextTimer);
          this.step = 1;
          this.matchNext();
          return;
        }
        this.recallNextCut();
      }, 1000);
    },
    cancel () {
      logReport({
        eventId: '106-5-2-17', // match中关闭二级确认弹窗曝光
        freeName2: window.$mObj.adData || {},
        targetUserId: this.hostData.id,
      });
      this.isStop = true;
      this.resetTimeout();
      this.$message({
        activeAffirm: false,
        noCancelBtn: false,
        noOutClick: false,
        desc: {
          txt: this.$t('app.confirm_exit_match_video')
        }
      }).then(() => {
        logReport({
          eventId: '106-5-2-18', // match中关闭二级确认弹窗确认点击
          freeName2: window.$mObj.adData || {},
          targetUserId: this.hostData.id,
        });
        this.videoUrlId = '';
        this.$router.back(-1);
      }).catch(() => {
        logReport({
          eventId: '106-5-2-19', // match中关闭二级确认弹窗取消点击
          freeName2: window.$mObj.adData || {},
          targetUserId: this.hostData.id,
        });
        this.isStop = false;
        this.matchNext();
        // console.log(this.showRingBell, this.hostData.id, '---showRingBell----');
        // if (!this.hostData.id) {
        //   this.matchNext();
        // }
        // if (!this.showRingBell && this.hostData.id) {
        //   console.log('---showRingBell-有用户开始呼叫----');
        //   this.sendCall();
        // }
      });
    },
    resetTimeout () {
      clearTimeout(this.autoAddFriendFn);
      clearTimeout(this.matchNextFn);
      clearTimeout(this.cutTimer);
      clearTimeout(this.nextTimer);
      clearTimeout(this.reMatchTimer);
      clearTimeout(this.recallNextCut);
      window.$mObj.matchTimer = null;
      this.$store.commit('set1v1endByHost', false);
    },
    toMatchNext () {
      const now = Date.now();
      const time = now - this.markStepTwo;
      logReport({
        eventId: '106-5-2-11', // match匹配中页面next点击
        freeName2: window.$mObj.adData || {},
        targetUserId: this.hostData.id,
        time,
      });
      this.matchNext();
    },
    recallNext () {
      logReport({
        eventId: '106-1-3-43',
        target_user_id: this.hostData.id,
        freeName2: {
          roomNum: this.matchCallData.ident,
          callLocation: window.$mObj.matchConf.continueCallLocation
        }
      });
      this.matchNext();
    },

    matchNext () {
      this.resetTimeout();
      this.nextTxt = 15;
      this.showNextBtn = false;
      this.videoUrlId = '';
      this.step = 1;
      const delay = Math.ceil(Math.random() * 3) + 2;
      console.log(delay, '-----delay----');

      if (this.$route.name !== 'MatchPage') {
        console.log('------已经退出匹配了--------');
        return;
      }

      this.$rtc && this.$rtc.matchLeavChannel();

      this.matchNextFn = setTimeout(() => {
        this.getMatchHost();
      }, 150 * delay);
    },
    cancelMatch () {
      // 挂断电话
      if (this.isMatchCall) {
        this.$store.commit('setMatchCallCancel', true);
        this.$store.commit('setMatchCall', false);
        this.$parent.$parent.$refs.inviteCall.cancel();
      }

      this.$router.push({
        name: 'LivCam'
      });
    },
    getMatchHost () {
      this.hostData = {};

      apiGetMatchingHost({
        fetchGender: 2,
        type: this.matchType,
        playWay: this.siteFunc.MATCHING
      }).then(({ code, data = {} }) => {
        const { fetchedUsersResps, reqUserResp } = data;

        const isEmpty = code !== 200 || !fetchedUsersResps || !fetchedUsersResps.length;

        // 匹配次数用完
        if (code === 20101) {
          console.log(data, '-----匹配次数用完-----');
          // if (this.userInfo.payStatus) {
          //   setStorageById('matchLimitTimesV', '', data.nextMatchCountDownMillis);
          // } else {
          setStorageById('matchLimitTimes', '', data.nextMatchCountDownMillis);
          // }
          localStorage.setItem('confMatchTimes', data.confMatchTimes);

          logReport({
            eventId: '106-1-1-64',
            r_source: 'match',
            freeName2: window.$mObj.adData || {},
            times: data.confMatchTimes,
          });
          this.$message({
            confirmBtnTxt: this.$t('webChat.becomeVip'), // '充值',
            cancelBtnTxt: this.$t('base.cancel'), // '取消',
            noOutClick: true,
            noCancelBtn: false,
            html: `<div class='pop-gold-message'>${this.$t('webChat.matchLimitTips')}</div>`,
          }).then(() => {
            logReport({
              eventId: '106-1-1-70', // 功能使用到达次数提示弹窗点击去充值
              freeName2: window.$mObj.adData || {},
              times: data.confMatchTimes,
            });
            this.$router.push({ name: 'CoinPage' });
          }).catch(e => {
            logReport({
              eventId: '106-1-1-71', // 功能使用到达次数提示弹窗点击取消
              freeName2: window.$mObj.adData || {},
              times: data.confMatchTimes,
            });
            this.$router.push({ name: 'LivCam' });
          });
          return;
        }
        const matchPrice = +window.$mObj.matchConf.playWayUnitPrice;
        // const matchPrice = 20;

        if (isEmpty) {
          this.matchType = 1;
          logReport({
            eventId: '106-5-2-7', // match匹配中页面next点击
            freeName2: window.$mObj.adData || {},
          });
        }

        if (code === 10014) {
          let con = this.$t('app.dialog_match_gold_not_enough_message', { coin: matchPrice, img: `<img class='icon-coin' src='${coin}'>` });

          const disCoin = getDiscountCoin();
          if (disCoin) {
            con = `<p>${con}</p>${disCoin.con}`;
          }
          this.$message({
            confirmBtnTxt: this.$t('app.exchange_lucky_draw'), // '充值',
            cancelBtnTxt: this.$t('base.cancel'), // '取消',
            noCancelBtn: false,
            html: `<div class='pop-gold-message'>${con}</div>`,
          }).then(() => {
            logReport({
              eventId: '106-5-2-4',
              r_source: 'match',
              freeName2: window.$mObj.adData || {},
              coin: !!disCoin
            });
            if (disCoin) {
              this.$store.commit('setDisCoinIframe', true);
            } else {
              this.$router.push({ name: 'CoinPage' });
            }
          }).catch(e => {
            logReport({
              eventId: '106-5-2-5',
              r_source: 'match',
              freeName2: window.$mObj.adData || {},
              coin: !!disCoin
            });
            this.$router.push({ name: 'LivCam' });
          });
          return false;
        }

        if (isEmpty) {
          clearTimeout(this.reMatchTimer);
          this.reMatchTimer = setTimeout(() => {
            this.getMatchHost();
          }, 1000);
          return;
        };

        this.matchType = 2;

        this.hostData = fetchedUsersResps[0] || {};

        this.hostData.relation = this.hostData.relationWithReqUser;

        window.curMsgPop && window.curMsgPop.close();
        this.step = 2;
        this.$store.commit('setMatchCallData', { ...this.hostData, callStatus: 1 });
        this.$rtc.matchJoinChannel(this.hostData);

        this.$store.commit('updateCoin', reqUserResp.goldNum);
      }).catch(() => {
        this.matchNext();
      });
    },

    timerAddFriend () {
      if (!this.hostData.id) {
        console.log('-----不存在主播id-----', this.hostData.id);
        return;
      }
      const params = {
        hostId: this.hostData.id,
      };
      apiAutoAddFriend(params).then(res => {
        console.log(res, '- 匹配 7s -自动加好友------');
      });
    },
  },
  mounted () {
    localStorage.setItem('RC_FIRST_1V1', 1);

    this.matchNext();
    this.markStepOne = Date.now();
    // this.recallNextCut();
  },
  beforeDestroy () {
    this.$rtc.matchLeavChannel();
    this.$rtc.cancelRTCTrack();
    // 挂断电话
    if (this.isMatchCall) {
      console.log('--isMatchCall0000---');
      this.$parent.$parent.$refs.inviteCall.cancel();
    }

    this.resetTimeout();
    this.$store.commit('setMatchCallCancel', false);
    this.$store.commit('setMatchCall', false);
  }
};
</script>
<style lang='less' scoped>
@import url("./index.less");
</style>

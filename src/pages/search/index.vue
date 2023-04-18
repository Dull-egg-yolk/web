<template>
   <div class="match-page">
    <!-- cancel -->
    <div class="icon-cross fx-c btn-cancel" v-if="step!==0" @click="cancel"></div>
    <transition-group class="inner" name="slideUp" tag="div">
      <div class="mt-step the-cover" v-if="step === 0" key="step-0">
        <div class="the-content flex-col-vc">
          <div class="cover">
            <img src="@/assets/img/img-search-cover.png" alt="">
          </div>
          <h2>{{ $t('webChat.searchTitle') }}</h2>
          <p>{{ $t('webChat.searchTips', {time: wtime ? wtime : '--'}) }}</p>
          <div class="m-btn major to-start" @click="toStart">{{ $t('app.live_cam_match_click') }}</div>
        </div>
      </div>
      <!-- step 1 matching -->
      <div class="mt-step matching" v-if="step === 1" key="step-1">

        <div class="status-box">
          <div class="txt">{{ $t('app.flop_recommend_recommend_searching') }}...</div>
          <div class="avatar-box">
            <img :src="userInfo.headImg" />
          </div>
        </div>
      </div>
      <!-- step2 waiting -->
      <div class="mt-step wait-box" v-show="step === 2"  key="step-2">
        <div class="user-info">
          <div class="name">{{ hostData.userName }}</div>
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
          <div class="intro" v-if="hostData.introduce">{{hostData.introduce}}</div>
        </div>
        <div class="both-side fx-be-vc">
          <div class="ub host">
            <div class="ico-heart" v-if="hh"></div>
            <div class="icon icon-mike-mute"></div>
            <div class="icon hover ico-report" @click.stop="showReport = true"></div>
            <div class="ico-sxt"></div>
            <report-menu class="user-report-pop" :friendData="hostData" :reportVideo="reportVideo" v-if="showReport" @show="getShow" v-clickoutside:click="getShow" />
            <video src="" webkit-playsinline="true" playsinline="true" id="mc-host-video" ref="hostVideo" muted autoplay :class="{hide: !showVideo}"></video>
          </div>
          <div class="action flex-col-vc">
            <div class="heart-box" >
              <div class="light"></div>
              <div class="h-inner" :style="{animationDuration: `${ wtime } s`}">
                <canvas id="time-canvas" :width="canvasW" :height="canvasW"></canvas>
                <div class="the-heart" :class="heartClass" @click="addLike(true)"></div>
              </div>
            </div>
            <div class="m-btn white btn-next" v-if="!isMobile" @click="nextAct">{{$t('app.video_cut_next')}} </div>
            <div class="txt" @click="cancelMatch">{{$t('base.cancel')}}</div>
            <div class="click-heart-tips" v-if="isShowTips" @click="setTipsHidden">
              <div class="tips-text">{{ $t('webChat.lcslogn', { num: wtime }) }}</div>
            </div>
          </div>
          <div class="ub my">
            <div class="ico-sxt"></div>
            <div class="icon icon-mike-mute"></div>
            <div id="my-m-video"></div>
          </div>
        </div>
        <div class="btn-next-m fx-c" v-if="isMobile" @click="nextAct">{{$t('app.video_cut_next')}} <span class="icon-drop-down"></span></div>

      </div>
      <!-- step3 success -->
      <div class="mt-step match-success"  v-if="step===3"  key="step-3">
        <div class="the-title">{{$t('webChat.lsMatched')}}</div>
        <div class="card-box">
          <div class="cover h">
            <img :src="hostData.headImg" />
          </div>
          <div class="cover m">
            <img :src="userInfo.headImg" />
          </div>
          <div class="ico-hear fx-c">
            <div class="icon"></div>
          </div>
        </div>
        <div class="mc-action flex-col">
          <button class="m-btn major btn-call hover" @click="sendCall"  v-preventReClick>
            <span class="icon-video2"></span>
            {{$t('webChat.videoCallNow')}}
          </button>
          <!-- <button class="m-btn btn-msg" @click="toChat"  v-preventReClick>
            <span class="icon-message"></span>
            {{$t('app.send_message')}}
          </button> -->
        </div>

        <div class="btn-continue hover" @click="backToMatch">{{$t('app.boarding_match_search_next')}}</div>
      </div>

      <div class="bgs" v-if="true" key="step-4">
        <div class="circle c1"></div>
        <div class="circle c2"></div>
        <div class="circle c3"></div>
        <div class="circle c4"></div>
        <div class="circle c5"></div>
        <div class="circle c6"></div>
      </div>

      <!-- 模拟来电 -->
      <div class="fake-call-pop" key="step-5" v-if="showFakeCall" >
        <div class="cover">
          <img :src="hostData.headImg" alt="">
        </div>
        <div class="inner-box">
          <div class="bg">
            <img :src="hostData.headImg" alt="">
          </div>
          <div class="both-avatar">
            <div class="head-img">
              <div class="avatar-head">
                <img :src="hostData.headImg" class="">
              </div>

              <div class="avatar-head host-h">
                <img :src="userInfo.headImg" class="">
              </div>
            </div>
            <div class="flow-hear">
              <div class="h1"></div>
              <div class="h2"></div>
              <div class="h3"></div>
              <div class="h4"></div>
              <div class="h5"></div>
            </div>
            <div class="the-tips">
              {{ $t('app.cam_like_each_other', {name: hostData.userName}) }}
            </div>
          </div>
          <div class="act-box">
            <div class="txt" v-if="!fakeCallBegin">{{ $t('app.cam_invite_chat', {name: hostData.userName}) }}</div>
            <!-- <div class="txt" v-else>{{$t('app.simulation_calling_connect_video')}}</div> -->
            <template  v-else>
              <div class="txt">{{ $t('app.simulation_calling_connect_video') }}</div>
              <div class="call-price" v-if="bizData.pricePerMinute">
                {{ bizData.pricePerMinute }} /min
              </div>
            </template>

            <div class="btns">
              <button class="btn cancel" @click="cancelFakeCallAct" v-preventReClick>
                <div class="ico fx-c">
                  <span class="icon-hangup"></span>
                </div>
              </button>
              <button class="btn accept" @click="fakeToCall" v-if="!fakeCallBegin" v-preventReClick>
                <div class="ico fx-c">
                  <span class="icon-video2"></span>
                </div>
              </button>
            </div>

          </div>
        </div>
      </div>

    </transition-group>
    <div class="box-entry-box" v-if="boxLivcamConf.show" @click.stop="toMatchBoxPage">
      <div class="box-entry__img"> <img :src="boxLivcamConf.icon" alt=""></div>
    </div>
    </div>

</template>

<script>
import { mapState, mapActions } from 'vuex';
import CanvasProgress from '@/util/canvasProgress';
import ReportMenu from '@/components/PopFiles/ReportMenu.vue';
import Clickoutside from '@/util/clickoutside.js';
import agoraMixin from '@/mixin/agoraMixin';
import imAddFriendMixin from '@/mixin/imAddFriendMixin';
import { apiGetCardConf, apiGetCardHost, apiLikeCardHost } from '@/api/card';
import { logReport } from '@/util/logReport';
import { getDiscountCoin } from '@/components/messageBox/htmlData';

import { setStorageById } from '@/util/index';
import { getPaymentUrl } from '@/util/shop';

export default {
  name: 'matchBox',
  data () {
    return {
      step: 0,
      wtime: 0,
      hostData: {},
      cp: null,
      hh: false,
      mh: false,
      reportVideo: null,
      showReport: false,
      hostLikeTime: null,
      showVideo: true,
      rhh: false,
      hasClickLike: false, // 每次匹配只能点一次like
      markStepOne: 0,
      markStepTwo: 0,
      isVideoFirstPlay: true,
      isShowTips: false,
      showFakeCall: false,
      fakeShowTimer: null,
      fakeHideTimer: null,
      fakeStartTime: 0,
      payUrl: '',
      fakeNum: 0,
      pausePage: false,
    };
  },
  directives: { Clickoutside },
  mixins: [agoraMixin, imAddFriendMixin],
  components: {
    ReportMenu
  },
  watch: {
    step (n, v) {
      if (n === 2) {
        this.cp && this.cp.stop();
        this.$nextTick(() => {
          setTimeout(() => {
            if (!this.cp) {
              this.cp = new CanvasProgress({
                el: '#time-canvas',
                time: this.wtime * 1000,
                lineWidth: this.isMobile ? 3 : 5,
                w: this.canvasW,
                success: () => {
                  console.log('abc next');
                  this.nextAct();
                }
              });
            }
            this.cp.play();
            this.setLocalV();
            this.checkHostLike();
            this.setMatchInfo();
          }, 400);
        });
      } else {
        this.cp && this.cp.stop();
      }
      if (v === 2) {
        clearTimeout(this.hostLikeTime);
        console.log('abc next');
        this.resetVK();
      }

      if (n === 1) {
        console.log('---时间重置--');
        this.markStepOne = Date.now();
        logReport({
          eventId: '106-4-2-0',
          freeName2: window.$mObj.adData || {},
        });
      }
      if (n === 2) {
        const now = Date.now();
        const time = now - this.markStepOne;
        console.log(time, '---time-----');
        logReport({
          eventId: '106-4-2-1',
          freeName2: window.$mObj.adData || {},
          target_user_id: this.hostData.id,
          time,
        });
      }

      if (n === 3) {
        logReport({
          eventId: '106-4-2-4',
          freeName2: window.$mObj.adData || {},
          target_user_id: this.hostData.id
        });
      }
    },
    heartClass (n) {
      if (n === 'hole') {
        this.checkShowFake();
        logReport({
          eventId: '106-4-2-16',
          target_user_id: this.hostData.id
        });
        setTimeout(() => {
          // const rd = Math.floor(Math.random() * 2);
          const rd = 1;
          if (rd) {
            this.step = 3;
          } else {
            this.step = 15;
            this.toShowFakePop();
          }
        }, 200);
      }
    },
    showFakeCall (n) {
      if (!n) {
        if (window.$mObj.bellAudio) {
          // pause 控制停止播放  load 控制下次重头播放
          window.$mObj.bellAudio.pause();
          window.$mObj.bellAudio.load();
        }
      }
    },
    fakeCallBegin (n) {
      if (n) {
        if (window.$mObj.bellAudio) {
          // pause 控制停止播放  load 控制下次重头播放
          window.$mObj.bellAudio.pause();
          window.$mObj.bellAudio.load();
        }
      } else {
        this.cancelFakeCall();
      }
    },
    showVideoPop (n) {
      if (n) {
        clearTimeout(this.fakeShowTimer);
        clearTimeout(this.fakeHideTimer);
        this.showFakeCall = false;
      } else {
        if (this.$store.state.agora.tempData.bizData.goddessLocation === window.$mObj.searchConf.afterLikeFakeCallLocation) {
          this.cancelFakeCall();
        }
      }
    },
    'boxLivcamConf.show': {
      handler (val) {
        if (val) {
          logReport({
            eventId: '106-1-15-4',
            freeName2: 'livcam'
          });
        }
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
      isMobile: (state) => state.app.isMobile,
      userInfo: (state) => state.app.userInfo,
      fakeCallBegin: (state) => state.app.fakeCallBegin,
      showVideoPop: (state) => state.app.showVideoPop,
      fakeRechagre: (state) => state.agora.fakeRechagre,
      matchConf: (state) => state.app.matchConf,
      siteFunc: (state) => state.app.siteFunc,
      bizData: (state) => state.agora.bizData,
      boxLivcamConf: (state) => state.app.boxLivcamConf,
    }),
    showGirl () {
      return Math.random() > 0.3;
    },
    heartClass () {
      console.log(this.hh, this.mh);
      if (this.hh && this.mh) {
        return 'hole';
      }
      if (this.hh && !this.mh) {
        return 'lh';
      }
      if (!this.hh && this.mh) {
        return 'rh';
      }
      return '';
    },
    canvasW () {
      return this.isMobile ? 120 : 200;
    }
  },
  methods: {
    ...mapActions(['updateMyUserData']),
    checkShowFake () {
      // this.fakeNum += 1;
      // if (this.fakeNum === 2) {
      //   this.fakeNum = 0;
      //   this.toShowFakePop();
      // }
    },
    toShowFakePop () {
      this.fakeShowTimer = setTimeout(() => {
        this.showFakeCall = true;
        this.$store.commit('setFakeCallBegin', false);
        this.fakeStartTime = Date.now();
        logReport({
          eventId: '106-4-4-0',
          target_user_id: this.hostData.id
        });
        logReport({
          eventId: '106-4-4-1',
          target_user_id: this.hostData.id
        });
        window.$mObj.bellAudio && window.$mObj.bellAudio.play();
      }, 20);
      this.fakeHideTimer = setTimeout(() => {
        this.cancelFakeCall();
      }, 15 * 1000);
    },
    cancelFakeCallAct () {
      logReport({
        eventId: '106-4-4-3',
        freeName2: {
          time: Date.now() - this.fakeStartTime,
          calling: +this.fakeCallBegin
        },
        target_user_id: this.hostData.id
      });
      this.cancelFakeCall();
    },
    cancelFakeCall () {
      if (this.fakeCallBegin) {
        this.$parent.$parent.$refs.inviteCall.cancel();
      }
      clearTimeout(this.fakeShowTimer);
      clearTimeout(this.fakeHideTimer);
      this.fakeStartTime = 0;
      this.showFakeCall = false;
      this.step = 1;
      this.hasClickLike = false;
      this.getMatchHost();
      this.$store.commit('setFakeCallBegin', false);
    },
    fakeToCall () {
      logReport({
        eventId: '106-4-4-2',
        freeName2: { time: Date.now() - this.fakeStartTime },
        target_user_id: this.hostData.id
      });
      this.$store.commit('setFakeCallBegin', false);
      this.callAction(this.hostData, window.$mObj.searchConf.afterLikeFakeCallLocation);
    },
    toChat () {
      logReport({
        eventId: '106-4-2-10',
        freeName2: window.$mObj.adData || {},
        target_user_id: this.hostData.id
      });

      this.imChatCheck(this.hostData);
    },
    checkHostLike () {
      const { hostLike, likeShowTime = 5 } = this.hostData;
      if (hostLike) {
        this.hostLikeTime = setTimeout(() => {
          this.hh = true;
        }, likeShowTime * 1000);
      }
    },
    cancel () {
      logReport({
        eventId: '106-4-2-13', // livecam匹配页面到视频匹配中关闭点击
        freeName2: window.$mObj.adData || {},
        target_user_id: this.hostData.id
      });
      this.resetVK();

      this.step = 0;
      console.log('abc cancel');
    },
    setLocalV () {
      this.$rtc.localVideoTrack.play(document.querySelector('#my-m-video'));
      // this.$rtc.createLocalV().then(v => {
      // });
    },
    addLike (isMyAction) {
      if (this.hasClickLike) {
        console.log('--点过一次了---');
        return;
      }
      if (isMyAction) {
        this.hasClickLike = true;
        this.mh = true;
        logReport({
          eventId: '106-4-2-2',
          freeName2: window.$mObj.adData || {},
          target_user_id: this.hostData.id
        });
        this.setMatchLikeInfo();
      }

      if (!this.hostData.id) return;

      apiLikeCardHost({
        hostLike: this.rhh,
        userLike: this.mh,
        hostId: this.hostData.id,
        matchType: 1,
      }).then(res => {
        if (res && res.data && isMyAction) {
          this.checkShowFake();
        }
      });
    },
    getShow () {
      this.showReport = false;
      this.nextAct();
    },
    setVideo () {
      console.log('abcd setVideo', this.$refs.hostVideo);
      if (!this.$refs.hostVideo) return;
      // this.$refs.hostVideo.pause();
      // this.$refs.hostVideo.src = '';
      this.isVideoFirstPlay = true;
      this.$refs.hostVideo.src = this.hostData.video;
      this.$refs.hostVideo.play();
      this.markStepTwo = Date.now();
    },
    resetVK () {
      if (!this.mh && this.hostData.id && /1|2/.test(this.step)) {
        this.addLike();
      }
      clearTimeout(this.hostLikeTime);
      this.hh = false;
      this.mh = false;
      this.hasClickLike = false;
      this.isVideoFirstPlay = true;
      this.cp && this.cp.stop();
      if (this.$refs.hostVideo) {
        this.$refs.hostVideo.pause();
        this.$refs.hostVideo.src = '';
      }
    },
    nextAct () {
      logReport({
        eventId: '106-4-2-3',
        freeName2: window.$mObj.adData || {},
        target_user_id: this.hostData.id
      });
      // this.hasClickLike = false;
      // this.resetVK();
      this.showReport = false;
      this.isShowTips = false;
      this.step = 1;
      this.getMatchHost();
    },
    cancelMatch () {
      this.$rtc.cancelLocalV();
      console.log('reset 1');
      this.resetVK();
      this.$router.push({
        name: 'LivCam'
      });
    },
    getMatchHost () {
      clearTimeout(this.fakeShowTimer);
      clearTimeout(this.fakeHideTimer);
      this.fakeNum = 0;
      this.hh = false;
      this.mh = false;
      apiGetCardHost({
        playWay: this.siteFunc.LIVCAM
      }).then(({ code, data = {} }) => {
        this.showVideo = true;
        window.curMsgPop && window.curMsgPop.close();

        const { reqUserResp, playWayUnitPrice } = data;

        data = data.fetchedUsersResps ? (data.fetchedUsersResps[0] || {}) : {};

        console.log('abc', data, reqUserResp);
        // 匹配次数用完
        if (code === 20101) {
          console.log(data, '-----匹配次数用完-----');
          if (this.userInfo.payStatus) {
            // localStorage.setItem('matchLimitTimesV', data.nextMatchCountDownMillis);
            setStorageById('matchLimitTimesV', '', data.nextMatchCountDownMillis);
          } else {
            // localStorage.setItem('matchLimitTimes', data.nextMatchCountDownMillis);
            setStorageById('matchLimitTimes', '', data.nextMatchCountDownMillis);
          }
          localStorage.setItem('confMatchTimes', data.confMatchTimes);
          logReport({
            eventId: '106-1-1-64',
            r_source: 'match',
            freeName2: window.$mObj.adData || {},
            times: data.confMatchTimes,
          });
          if (this.userInfo.payStatus) {
            this.$message({
              noOutClick: true,
              noCancelBtn: true,
              html: `<div class='pop-gold-message'>${this.$t('webChat.matchLimitVToast')}</div>`,
            }).then(() => {
              logReport({
                eventId: '106-1-1-71',
                freeName2: window.$mObj.adData || {},
                times: data.confMatchTimes,
                payStatus: this.userInfo.payStatus
              });
              this.$router.push({ name: 'LivCam' });
            });
          } else {
            this.$message({
              confirmBtnTxt: this.$t('app.exchange_lucky_draw'), // '充值',
              cancelBtnTxt: this.$t('base.cancel'), // '取消',
              noOutClick: true,
              noCancelBtn: false,
              html: `<div class='pop-gold-message'>${this.$t('webChat.matchLimitToast')}</div>`,
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
                payStatus: this.userInfo.payStatus
              });
              this.$router.push({ name: 'LivCam' });
            });
          }
          return;
        }

        if (code === 20001) {
          const disCoin = getDiscountCoin();
          logReport({
            eventId: '106-4-2-7',
            freeName2: window.$mObj.adData || {},
            r_source: 'matchs',
            coin: disCoin && disCoin.totalCoinNum,
          });
          const matchPrice = window.$mObj.searchConf.playWayUnitPrice;

          const tips1 = this.$t('webChat.unlockMatch', { num: `<span>${matchPrice}<i class="tips-icon-coins"></i></span>` });
          const tips3 = this.$t('webChat.insufficientBalance');
          let con = tips1 + `<p>${tips3}</p>`;
          if (disCoin) {
            con = `<p>${con}</p>${disCoin.con}`;
          }
          this.$message({
            confirmBtnTxt: this.$t('app.exchange_lucky_draw'), // '充值',
            cancelBtnTxt: this.$t('base.cancel'), // '取消',
            noCancelBtn: false,
            html: `<div class="match-tip">${con}</div>`,
          }).then(() => {
            logReport({
              eventId: '106-4-2-8',
              freeName2: window.$mObj.adData || {},
              r_source: 'matchs',
              coin: disCoin && disCoin.totalCoinNum,
            });
            this.$router.push({ name: 'CoinPage' });
          }).catch(e => {
            logReport({
              eventId: '106-4-2-9',
              freeName2: window.$mObj.adData || {},
              r_source: 'matchs',
              coin: disCoin && disCoin.totalCoinNum,
            });
            this.$router.push({ name: 'LivCam' });
          });
          return false;
        }

        // 返回空 直接开始下一次匹配
        if (!data.id && this.$route.name === 'SearchPage') {
          console.log('----未匹配到，再次自动匹配--');
          logReport({
            eventId: '106-4-2-12', // match没有匹配到
            freeName2: window.$mObj.adData || {},
          });
          setTimeout(() => {
            this.nextAct();
          }, 260);
          return;
        }
        // data.id = 115931595;
        // data.hostLike = true;
        this.hostData = data;
        this.rhh = data.hostLike;
        this.$store.commit('updateCoin', reqUserResp.goldNum);

        // 开始扣费提示 只弹一次
        if (!localStorage.getItem('RC_SEARCH_FIRST_COAST_TIP') && playWayUnitPrice) {
          this.pausePage = true;
          const con = this.$t('webChat.searchLimitTip', { coin: playWayUnitPrice });
          logReport({
            eventId: '106-1-1-92',
            freeName2: {
              from: 'livcam'
            }
          });
          this.$message({
            confirmBtnTxt: this.$t('base.confirm'),
            cancelBtnTxt: this.$t('base.cancel'), // '取消',
            noCancelBtn: false,
            html: `<div class='pop-gold-message'>${con}</div>`,
          }).then(() => {
            this.pausePage = false;
            this.step = 2;
            logReport({
              eventId: '106-1-1-93',
              freeName2: {
                from: 'livcam'
              }
            });
          }).catch(e => {
            logReport({
              eventId: '106-1-1-94',
              freeName2: {
                from: 'livcam'
              }
            });
            this.$router.push({
              name: 'LivCam'
            });
          });

          localStorage.setItem('RC_SEARCH_FIRST_COAST_TIP', true);
          console.log('abcc');
        }

        setTimeout(() => {
          this.setVideo();
        }, 260);
      });
    },
    backToMatch () {
      logReport({
        eventId: '106-4-2-6',
        freeName2: window.$mObj.adData || {},
        target_user_id: this.hostData.id
      });
      this.step = 1;
      this.hasClickLike = false;
      this.getMatchHost();
    },
    sendCall () {
      clearTimeout(this.fakeShowTimer);
      clearTimeout(this.fakeHideTimer);
      logReport({
        eventId: '106-4-2-5',
        freeName2: window.$mObj.adData || {},
        target_user_id: this.hostData.id
      });
      this.callAction(this.hostData, window.$mObj.searchConf.afterLikeNormalCallLocation);
    },
    setMatchInfo () {
      console.log('----设置当前的匹配次数-------');
      const isRegister = sessionStorage.getItem('currIsRegister');
      const times = sessionStorage.getItem('currMatchTimes') || -1;
      if (isRegister !== 'true' || times > 2) return;
      const countTimes = (+times) + 1;
      sessionStorage.setItem('currMatchTimes', countTimes);

      const matchDetail = sessionStorage.getItem('currMatchDetail');
      let matchList = [];
      if (matchDetail) {
        matchList = JSON.parse(matchDetail);
      }
      matchList[countTimes] = 0;
      const str = JSON.stringify(matchList);
      sessionStorage.setItem('currMatchDetail', str);

      if (matchList.length === 3) {
        if (matchList[0] + matchList[1] === 0) {
          console.log('----前2次匹配没点like,弹出提示---------');
          this.isShowTips = true;
          logReport({
            eventId: '106-4-2-15', // livecam引导展示
            freeName2: window.$mObj.adData || {},
            target_user_id: this.hostData.id
          });
          setTimeout(() => {
            this.isShowTips = false;
          }, 5000);
        }
      }
    },
    setMatchLikeInfo () {
      const times = sessionStorage.getItem('currMatchTimes');
      if (times === null || times > 3) return;
      this.isShowTips = false;
      const matchDetail = sessionStorage.getItem('currMatchDetail');
      let matchList = [];
      if (matchDetail) {
        matchList = JSON.parse(matchDetail);
      }
      matchList[times] = 1;
      const str = JSON.stringify(matchList);
      sessionStorage.setItem('currMatchDetail', str);
    },
    setTipsHidden () {
      logReport({
        eventId: '106-4-2-14', // livecam引导点击
        freeName2: window.$mObj.adData || {},
        target_user_id: this.hostData.id
      });
      this.addLike(true);
    },
    getLivcamConf () {
      apiGetCardConf({
        playWay: this.siteFunc.LIVCAM
      }).then(({ code, data = {} }) => {
        this.wtime = data.countdownOfSeconds || 10;
        // this.wtime = 1000;
        window.$mObj.searchConf = data;
        // this.toStart();
      }).catch(e => {
        this.wtime = 10;
      });
    },
    async toStart () {
      this.$store.commit('setShowSayHiPop', false);
      logReport({
        eventId: '106-4-1-1',
        freeName2: window.$mObj.adData || {},
      });

      const matchPrice = window.$mObj.searchConf.playWayUnitPrice;
      const hadShowLivcamConfirm = localStorage.getItem('SEARCH_FIRST_CONFIRM');

      // 金币不足
      if (this.userInfo.goldNum < matchPrice) {
        const disCoin = getDiscountCoin();
        logReport({
          eventId: '106-4-2-7',
          freeName2: window.$mObj.adData || {},
          r_source: 'index',
          coin: disCoin && disCoin.totalCoinNum,
        });
        const tips1 = this.$t('webChat.unlockMatch', { num: `<span>${matchPrice}<i class="tips-icon-coins"></i></span>` });
        const tips3 = this.$t('webChat.insufficientBalance');
        let con = tips1 + `<p>${tips3}</p>`;

        if (disCoin) {
          con = `<p>${con}</p>${disCoin.con}`;
        }

        this.$message({
          confirmBtnTxt: this.$t('app.exchange_lucky_draw'), // '充值',
          cancelBtnTxt: this.$t('base.cancel'), // '取消',
          noCancelBtn: false,
          html: `<div class="match-tip">${con}</div>`,
        }).then(() => {
          logReport({
            eventId: '106-4-2-8',
            freeName2: window.$mObj.adData || {},
            r_source: 'index',
            coin: disCoin && disCoin.totalCoinNum,
          });
          this.$router.push({ name: 'CoinPage' });
        }).catch(e => {
          logReport({
            eventId: '106-4-2-9',
            freeName2: window.$mObj.adData || {},
            r_source: 'index',
            coin: disCoin && disCoin.totalCoinNum,
          });
        });
        return;
      }

      // 首次弹框
      // if (!hadShowLivcamConfirm && matchPrice) {
      //   logReport({
      //     eventId: '106-4-1-2',
      //     freeName2: window.$mObj.adData || {},
      //   });
      //   const tips1 = this.$t('webChat.unlockMatch', { num: `<span>${matchPrice}<i class="tips-icon-coins"></i></span>` });
      //   const con = tips1;

      //   localStorage.setItem('SEARCH_FIRST_CONFIRM', true);
      //   this.$message({
      //     confirmBtnTxt: this.$t('base.confirm'),
      //     noCancelBtn: true,
      //     longBtn: true,
      //     html: `<div class="match-tip">${con}</div>`,
      //   }).then(() => {
      //     logReport({
      //       eventId: '106-4-1-3',
      //       freeName2: window.$mObj.adData || {},
      //     });
      //     this.getMatchHost();
      //     this.markStepOne = Date.now();
      //     this.step = 1;
      //   }).catch(e => {
      //     logReport({
      //       eventId: '106-4-1-4',
      //       freeName2: window.$mObj.adData || {},
      //     });
      //   });

      //   return;
      // }

      try {
        await this.$rtc.creatRTCTrack(this);
        this.getMatchHost();
        this.markStepOne = Date.now();
        this.step = 1;
      } catch (error) {
      }
    },
    toMatchBoxPage () {
      console.log(' this.boxLivcamConf', this.boxLivcamConf);
      logReport({
        eventId: '106-1-15-5', // 宝箱活动入口点击
        freeName2: 'livcam',
        url: this.boxLivcamConf.targetUrl
      });
      this.$router.push({
        name: 'ActivityPage',
        query: {
          fromPage: 'match'
        }
      });
    },
  },
  async mounted () {
    setTimeout(() => {
      this.$refs.hostVideo.addEventListener('canplay', () => {
        console.log('abcd canplay', this.isVideoFirstPlay);
        if (this.step === 0 || this.pausePage) return;
        if (!this.isVideoFirstPlay) {
          console.log('-----当前视频已经可播一次了-------');
          return;
        }
        const now = Date.now();
        const time = now - this.markStepTwo;
        console.log(time, '---time-----');
        logReport({
          eventId: '106-4-2-11',
          freeName2: window.$mObj.adData || {},
          target_user_id: this.hostData.id,
          time,
          videoUrl: this.hostData.video
        });
        setTimeout(() => {
          this.step = 2;
        }, 200);
      });

      this.$refs.hostVideo.addEventListener('playing', () => {
        console.log('abcd playing', this.isVideoFirstPlay);
        if (this.step === 0) return;
        this.isVideoFirstPlay = false;
      });

      // 视频播放结束 倒计时还没结束
      this.$refs.hostVideo.addEventListener('ended', () => {
        console.log('abcd ended');
        this.showVideo = false;
      });
    }, 100);

    // localStorage.setItem('RC_CARD_FIRST_TIP', true);
    this.payUrl = getPaymentUrl(this.$store.state.app.userInfo, history.length); // 设置三方支付连接
  },
  beforeDestroy () {
    clearTimeout(this.fakeShowTimer);
    clearTimeout(this.fakeHideTimer);
    clearTimeout(this.hostLikeTime);
    this.$rtc.cancelLocalV();
    console.log('reset 2');
    this.resetVK();
    this.$refs.hostVideo.pause();
    this.$refs.hostVideo.src = '';
    // this.cancelMatch();
  },
  created () {
    if (!this.siteFunc.LIVCAM) {
      this.$router.push({
        name: 'LivCam'
      });
      return;
    }
    this.getLivcamConf();
  },
};
</script>
<style lang='less' scoped>
@import url("./index.less");
</style>

<style lang="less">

.match-tip {
  padding: 21px 15px 6px;
  text-align: center;
  line-height: 19px;
  font-size: 13px;

  span {
    display: inline-flex;
    align-items: center;
  }

  .tips-red {
    color: #FE465E;
    font-size: 14px;
  }

  .tips-icon-coins {
    width: 14px;
    height: 14px;
    display: inline-block;
    background: url(~@/assets/img/icon-coin.png) center no-repeat;
    background-size: 100% auto;
    vertical-align: bottom;
  }
}
</style>

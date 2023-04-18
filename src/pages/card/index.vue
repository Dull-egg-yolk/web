<template>
  <div class="card-page">

    <!-- limit -->
    <div class="livcam-call-limit" v-if="matchLimit">
      <div class="limit-desc fx-c">
        <div class="limit-time">
          <count-down :endTime="endTime" @endCountDownData="countDownEnd" :showTime="true"></count-down>
        </div>

        <div class="t" v-if="!userInfo.payStatus">
          <p class="the-txt free">
            {{ $t('webChat.matchShortLimitTips2') }}
            <br>
            <strong> {{ $t('webChat.matchShortLimitTips') }}</strong>
          </p>
          <div class="btn-limit fx-c free" @click="jumpToCoin" >
            <span>{{ $t('webChat.becomeVIP') }}</span>
          </div>
        </div>

        <div class="t" v-else>
          <p class="the-txt">{{ $t('webChat.freeCardL') }}</p>
          <div class="btn-limit fx-c vip" @click="jumpToWall" >
            <span>{{ $t('webChat.cardLimit') }}</span>
          </div>
        </div>

      </div>
    </div>

    <div class="swiper-box" :class="{show: hostList.length}">

      <div class="the-loading" v-if="showLoad"></div>
      <div class="the-loading-txt" v-if="showLoad">{{ $t('webChat.cardLoadTip') }}</div>

      <div class="ohost" :style="{zIndex: 10}" v-if="mokeData.id">
        <div class="cover">
          <img :src="mokeData.headImg" alt="" @load="imgLoad">
        </div>
        <div class="btn-report">
        </div>
        <!-- <div class="status-txt-tag online" >online</div> -->
        <div class="host-detail" v-if="!showLoad">
          <div class="host-name fx-v">
            <div class="the-name">{{ mokeData.userName }}</div>
            <div class="the-age">{{ mokeData.birthday | calculateAge }}</div>
          </div>
          <div class="host-country fx-v">
            <country :countryId="mokeData.countryId" type="img"></country>
            <country :countryId="mokeData.countryId" type="name"></country>
          </div>
          <div class="tag-list">
            <div class="h-tag min" v-for="(oi, idx) in mokeData.interestLabels" :key="idx">{{ $t(`interest.${oi}`) }}</div>
          </div>
        </div>
      </div>

      <div class="ohost" v-for="(item, index) of hostList" :data-id="item.id" :style="{zIndex: 3-index}" :class="{swipe:(swipeId === item.id && index === 0), [swipeD ? 'sr' : 'sl']:true}" :key="item.idd">
        <div class="cover">
          <img :src="item.headImg" alt="" @load="imgLoad">
        </div>
        <div class="btn-report" @click.stop="toShowReport">
        </div>
        <div class="status-txt-tag" :class="stateCode[item.onlineStatus]">{{ $t(`base.${stateCode[item.onlineStatus]}`) }}</div>
        <!-- <div class="status-txt-tag online" >online</div> -->
        <div class="host-detail"  v-if="!showLoad">
          <div class="host-name fx-v">
            <div class="the-name">{{ item.userName }}</div>
            <div class="the-age">{{ item.birthday | calculateAge }}</div>
          </div>
          <div class="host-country fx-v">
            <country :countryId="item.countryId" type="img"></country>
            <country :countryId="item.countryId" type="name"></country>
          </div>
          <div class="tag-list">
            <div class="h-tag min" v-for="(oi, idx) in item.interestLabels" :key="idx">{{ $t(`interest.${oi}`) }}</div>
          </div>
        </div>
      </div>

      <div class="host-action fx-c">
        <div class="btn-lock" v-if="actLock"></div>
        <div class="obtn btn-next fx-c" @click="nextCard">
          <span class="icon-cross"></span>
        </div>
        <button class="obtn btn-call fx-c" @click="toCall(1)" v-preventReClick>
          <span class="icon-video2"></span>
        </button>
        <div class="obtn btn-like fx-c" @click="cardLike(true)">
          <span class="icon-heart"></span>
        </div>
      </div>
    </div>

    <!-- 匹配成功 -->
    <div class="mt-step match-success"  v-if="showMatched">
    <div class="the-title">{{$t('webChat.lsMatched')}}</div>
    <div class="card-box">
      <div class="cover h">
        <img :src="matchHost.headImg" />
      </div>
      <div class="cover m">
        <img :src="userInfo.headImg" />
      </div>
      <div class="ico-hear fx-c">
        <div class="icon"></div>
      </div>
    </div>
    <div class="mc-action flex-col">
      <button class="m-btn white btn-call hover" @click="toCall(2)"  v-preventReClick>
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
    <FakeCall :isShow="showFakeCall" :hostData="matchHost" @cancel="backToMatch"></FakeCall>

    <!-- 举报 -->
    <report-menu class="user-report-pop" :friendData="hostList[0]" :reportVideo="reportVideo" v-if="showReport" @show="hideReportHandler" v-clickoutside:click="hideReportHandler" @reportSucc="reportSuccess" />

  </div>
</template>

<script>
import { mapState } from 'vuex';
import { apiGetCardConf, apiGetCardHost, apiLikeCardHost } from '@/api/card';
import { logReport } from '@/util/logReport';
import { apiGetGoddessStatus } from '@/api/goddess';
import Clickoutside from '@/util/clickoutside.js';
import { calculateAge } from '@/filters';
import agoraMixin from '@/mixin/agoraMixin';
import imAddFriendMixin from '@/mixin/imAddFriendMixin';
import CountDown from '@/components/CountDown';
import ReportMenu from '@/components/PopFiles/ReportMenu.vue';
import FakeCall from './fakeCall.vue';

import mokeHost from './host.js';

const coin = require('@/assets/img/icon-coin.png');

export default {
  name: 'CardPage',
  data () {
    return {
      hostList: [],
      endTime: 0,
      matchLimit: false,
      lock: false,
      stateCode: window.$mObj.userStatus,
      swipeD: 0,
      swipeId: 0,
      actLock: false,
      isLike: false,
      showMatched: false,
      matchHost: {},
      showReport: false,
      reportVideo: null,
      swipeIndex: 0,
      stateTimer: null,
      showLoad: true,
      mokeData: {},
      showFakeCall: false,
    };
  },
  directives: { Clickoutside },
  components: { ReportMenu, CountDown, FakeCall },
  mixins: [agoraMixin, imAddFriendMixin],
  filters: {
    calculateAge,
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.app.userInfo,
      siteFunc: (state) => state.app.siteFunc,
      showVideoPop: (state) => state.app.showVideoPop,
    }),
  },
  watch: {
    hostList (n) {
      if (!this.isLogin) return;
      this.getHostState();
    },
    matchLimit (n) {
      if (n) {
        logReport({
          eventId: '106-7-3-0',
          freeName2: {
            limitNum: localStorage.getItem('confMatchTimes')
          },
          target_user_id: this.matchHost.id
        });
      }
    },
    showVideoPop (n) {
      if (n) {

      } else {
        this.hostList = [];
        this.getHostListData();
      }
    },
  },
  methods: {
    imgLoad (e) {
      e.target.style.opacity = '1';
      this.showLoad = false;
    },
    toShowReport () {
      logReport({
        eventId: '106-7-1-5',
        target_user_id: this.matchHost.id
      });
      this.showReport = true;
    },
    hideReportHandler () {
      this.showReport = false;
    },
    getHostListData () {
      clearTimeout(this.stateTimer);
      if (this.hostList.length >= 2) {
        this.actLock = false;
        return;
      };
      apiGetCardHost({
        playWay: this.siteFunc.CARD
      }).then(({ code, data = {} }) => {
        this.actLock = false;
        const { fetchedUsersResps, reqUserResp } = data;

        const con = this.$t('app.insufficient_coins_for_goddess_chating');

        // code = 20101;
        // data = {
        //   nextMatchCountDownMillis: 1677224031355,
        //   confMatchTimes: 100
        // };

        if (code === 20101) {
          this.matchLimit = true;
          console.log(data, '-----匹配次数用完-----');
          this.endTime = data.nextMatchCountDownMillis;
          localStorage.setItem('confMatchTimes', data.confMatchTimes);
          logReport({
            eventId: '106-1-1-64',
            r_source: 'match',
            freeName2: window.$mObj.adData || {},
            times: data.confMatchTimes,
          });
          return;
        }

        if (code === 20001) {
          this.$message({
            confirmBtnTxt: this.$t('app.exchange_lucky_draw'), // '充值',
            cancelBtnTxt: this.$t('base.cancel'), // '取消',
            noCancelBtn: false,
            html: `<div class='pop-gold-message'>${con}</div>`,
          }).then(() => {
            this.$router.push({ name: 'CoinPage' });
          }).catch(e => {
            this.$router.push({
              name: 'LivCam'
            });
          });
          return;
        }

        if (code !== 200 || !fetchedUsersResps || !fetchedUsersResps.length) {
          if (this.$route.name !== 'LivCam') return;
          this.getHostListData();
          return;
        }

        logReport({
          eventId: '106-7-1-0',
          target_user_id: fetchedUsersResps[0].id
        });

        fetchedUsersResps.forEach(item => {
          item.idd = this.swipeIndex;
          this.swipeIndex++;
        });

        this.$store.commit('updateCoin', reqUserResp.goldNum);
        this.hostList.push(...fetchedUsersResps);

        if (this.hostList.length < 2) {
          console.log('---人数不够再请求-------', this.hostList.length);
          this.getHostListData();
        }

        // 开始扣费提示 只弹一次
        if (!localStorage.getItem('RC_CARD_FIRST_COAST_TIP') && data.playWayUnitPrice) {
          const con = this.$t('webChat.searchLimitTip', { coin: data.playWayUnitPrice });
          logReport({
            eventId: '106-1-1-92',
            freeName2: {
              from: 'card'
            }
          });
          this.$message({
            confirmBtnTxt: this.$t('base.confirm'),
            cancelBtnTxt: this.$t('base.cancel'), // '取消',
            noCancelBtn: false,
            html: `<div class='pop-gold-message'>${con}</div>`,
          }).then(() => {
            logReport({
              eventId: '106-1-1-93',
              freeName2: {
                from: 'card'
              }
            });
          }).catch(e => {
            logReport({
              eventId: '106-1-1-94',
              freeName2: {
                from: 'card'
              }
            });
            this.$router.push({
              name: 'LivCam'
            });
          });

          localStorage.setItem('RC_CARD_FIRST_COAST_TIP', true);
          console.log('abcc');
        }
      }).catch(e => {
        this.actLock = false;
      });
    },
    getHostState () {
      clearTimeout(this.stateTimer);
      if (!this.hostList.length) return;
      apiGetGoddessStatus({ userIds: this.hostList[0].id }).then(({ code, data }) => {
        data = data[0];
        if (this.hostList[0] && this.hostList[0].id === data.userId) {
          this.hostList[0].onlineStatus = data.status;
        } else {
          return;
        }
        this.stateTimer = setTimeout(() => {
          this.getHostState();
        }, 2000);
      });
    },
    async toCall (type) {
      if (!this.hostList.length) return;

      const cl = {
        1: window.$mObj.cardConf.mainPageCallLocation,
        2: window.$mObj.cardConf.afterLikeNormalCallLocation
      };
      const eventId = {
        1: '106-7-1-3',
        2: '106-7-2-1'
      };

      // 记录玩match 记录
      localStorage.setItem('RC_MATCHED_RECORD', 1);
      const hostD = type === 2 ? this.matchHost : this.hostList[0];

      logReport({
        eventId: eventId[type],
        target_user_id: hostD.id
      });

      this.callAction(hostD, cl[type]);
    },
    getLivcamConf () {
      // if (!localStorage.getItem('RC_CARD_FIRST_TIP')) {
      // this.mokeData = mokeHost();
      // }

      apiGetCardConf({
        playWay: this.siteFunc.CARD
      }).then(({ code, data = {} }) => {
        // sessionStorage.setItem('matchTime', data.nextEnableWaitTime);
        // sessionStorage.setItem('matchNextTime', data.matchQuitTime);
        // sessionStorage.setItem('matchPrice', data.playWayUnitPrice);
        window.$mObj.cardConf = { ...window.$mObj.cardConf, ...data };

        // if (!localStorage.getItem('RC_CARD_FIRST_TIP') && data.playWayUnitPrice) {
        //   const con = this.$t('webChat.first1V1', { coin: data.playWayUnitPrice, img: `<img class='icon-coin' src='${coin}'>` });
        //   this.$message({
        //     confirmBtnTxt: this.$t('base.confirm'),
        //     cancelBtnTxt: this.$t('base.cancel'), // '取消',
        //     noCancelBtn: false,
        //     html: `<div class='pop-gold-message'>${con}</div>`,
        //   }).then(() => {
        //     this.showLoad = true;
        //     this.getHostListData();
        //     this.mokeData = {};
        //   }).catch(e => {
        //     this.$router.push({
        //       name: 'LivCam'
        //     });
        //   });
        //   localStorage.setItem('RC_CARD_FIRST_TIP', true);
        // }
      });
    },
    countDownEnd () {
      console.log('-------倒计时结束-----');
      // this.matchLimit = false;
    },
    jumpToWall () {
      logReport({
        eventId: '106-7-3-2',
        target_user_id: this.matchHost.id
      });
      this.$router.push({ name: 'GoddessWall' });
    },
    nextCard () {
      if (!this.hostList.length) return;
      logReport({
        eventId: '106-7-1-1',
        target_user_id: this.hostList[0].id
      });
      this.swipeCard();
    },
    swipeCard () {
      // this.showLoad = true;
      if (!this.hostList.length) return;

      this.swipeId = this.hostList[0].id;

      this.actLock = true;
      if (this.isLike) {
        this.isLike = false;
      } else {
        this.cardLike();
      }
      setTimeout(() => {
        const oa = this.hostList.slice();
        oa.shift();
        this.hostList = oa;
        this.getHostListData();
        this.swipeD = 0;
      }, 350);
    },
    cardLike (isLike) {
      if (!this.hostList.length) return;
      this.isLike = isLike;
      const hostD = this.hostList.slice()[0];
      this.actLock = true;

      this.matchHost = hostD;
      if (isLike) {
        this.swipeD = 1;
        logReport({
          eventId: '106-7-1-2',
          target_user_id: hostD.id
        });
      }
      console.log(hostD.hostLike, isLike, 'abc');
      if (hostD.hostLike && isLike) {
        // if (!data) {
        this.showMatched = Math.random() >= 0.5;
        this.showFakeCall = !this.showMatched;

        logReport({
          eventId: '106-7-2-0',
          target_user_id: hostD.id
        });
        // }
      }
      apiLikeCardHost({
        hostLike: hostD.hostLike,
        userLike: this.isLike || false,
        hostId: hostD.id,
        matchType: 1,
      }).then(({ code, data }) => {
        this.actLock = false;
        if (this.isLike) {
          this.swipeCard();
        }
      }).catch(e => {
        if (this.isLike) {
          this.swipeCard();
        }
        this.actLock = false;
      });
    },
    backToMatch () {
      logReport({
        eventId: '106-7-2-3',
        target_user_id: this.matchHost.id
      });
      if (this.showMatched) {
        this.showMatched = false;
      } else {
        this.showFakeCall = false;
      }
    },
    toChat () {
      logReport({
        eventId: '106-7-2-2',
        target_user_id: this.matchHost.id
      });
      this.imChatCheck(this.matchHost);
    },
    jumpToCoin () {
      logReport({
        eventId: '106-7-3-1',
        target_user_id: this.matchHost.id
      });
      this.$router.push({ name: 'CoinPage' });
    },
    reportSuccess () {
      this.swipeCard();
    }
  },
  mounted () {
    logReport({
      eventId: '106-7-1-4',
      target_user_id: this.matchHost.id
    });

    // if (localStorage.getItem('RC_CARD_FIRST_TIP')) {
    this.getHostListData();
    // }
  },
  created () {
    if (!this.siteFunc.CARD) {
      this.$router.push({
        name: 'LivCam'
      });
      return;
    }
    this.getLivcamConf();
  },
  beforeDestroy () {
    clearTimeout(this.stateTimer);
  }
};

</script>
<style lang='less' scoped>
@import url("./index.less");
</style>

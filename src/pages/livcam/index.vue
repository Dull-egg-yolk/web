<template>
   <div class="livcam-page" v-show="showBanner">
      <div class="livcam-banner" >
          <div class="con-num">
              <div class="obg bg-down">
                 <img src="@/assets/img/seo/bg1.png" />
                 <img class="bg" src="@/assets/img/seo/bg1.png" />
              </div>
              <div class="obg bg-up">
                 <img src="@/assets/img/seo/bg2.png" />
                 <img class="bg" src="@/assets/img/seo/bg2.png" />
              </div>
              <div class="obg bg-down">
                 <img src="@/assets/img/seo/bg3.png" />
                 <img class="bg" src="@/assets/img/seo/bg3.png" />
              </div>
          </div>
      </div>
      <div class="livcam-content">
        <div class="livcam-title">{{$t('webChat.lcTitle')}}</div>
        <p class="livcam-txt" v-if="!matchLimit">{{$t('webChat.matchDesc')}}</p>
        <div class="livcam-call-limit" v-if="matchLimit">
          <div class="limit-time">
            <count-down :endTime="endTime" :showTime="true" @endCountDownData="countDownEnd"></count-down>
          </div>
          <div class="limit-desc fx-c" v-if="userInfo.payStatus">
            <p>{{$t('webChat.matchLimitVDesc')}}</p>
            <div class="btn-limit fx-c" @click="jumpToWall">{{$t('webChat.cardLimit')}}</div>
          </div>
          <div class="limit-desc fx-c" v-else>
            <p>{{$t('webChat.matchShortLimitTips2')}}</p>
            <p class="limit-txt-big">{{$t('webChat.matchShortLimitTips')}}</p>
            <div class="btn-limit fx-c" @click="jumpToCoin">{{$t('webChat.becomeVIP')}}</div>
          </div>
        </div>
        <div class="livcam-call" v-else>
          <!-- 搜索框 -->
          <!-- <div class="mfilter-box">
            <div class="mf-btn fx-be-vc"  @click.stop="toggleGender" >
              <div class="the-avatar" :class="[`img${gender}`]"></div>
              <div class="f-txt">{{genderTxt}}</div>
              <div class="icon-drop-down"></div>
            </div>

            <transition name="slideDown">
              <div class="gender-list" v-if="showCSGender" @click.stop v-clickoutside:click="hideGenderCs">
                <div class="the-title">{{$t('app.filter_dialog_gender')}}</div>
                <div class="the-list fx-c">
                  <div class="og fx-c" v-for="(item, index) in genderList" :key="index" :class="{cur: item.id === gender}" @click="csGender(item.id)">
                    <div class="img" :class="[`img${item.id}`]"></div>
                    {{item.txt}}
                  </div>
                </div>
              </div>
            </transition>
          </div> -->

         <div class="user-call fx-c" @click="toMatch"><span class="icon-video2"></span>{{$t('webChat.gotoPlay')}}</div>
        </div>
      </div>
      <div class="livcam-popUp" v-if="(!isLogin && registerBannerInfo.show)">
          <div class="livcam-popbanner">
            <img :src="registerBannerInfo.img"/>
            <div class="title-box">
              <div class="title">{{$t('webChat.bannerCoinTips')}}</div>
              <div class="title1">{{$t('webChat.signCoinsTips1', {coin: registerBannerInfo.gold, num: registerBannerInfo.callCount })}}</div>
            </div>
            <!-- <div class="coin">+200</div>
            <div class="img"><img src="@/assets/img/tumile/icon-s-coin.png"/></div> -->
          </div>
        </div>

        <div class="box-entry-box" v-if="boxMatchConf.show" @click.stop="toMatchBoxPage">
      <div class="box-entry__img"> <img :src="boxMatchConf.icon" alt=""></div>
    </div>
   </div>
</template>

<script>
import { mapState } from 'vuex';
import { checkPopUp, apiGetCountryId } from '@/api/user';
import { logReport } from '@/util/logReport';
import { getStorageById } from '@/util/index';
import { apiGetLivcamConfig } from '@/api/livcam';
import Clickoutside from '@/util/clickoutside.js';
import CountDown from '@/components/CountDown';
import { getDiscountCoin } from '@/components/messageBox/htmlData';

const coin = require('@/assets/img/icon-coin.png');

export default {
  name: 'LivCam',
  data () {
    return {
      showBanner: false,

      gender: 2,
      showCSGender: false,
      endTime: 1672322522000,
      matchLimit: false,
      lock: false
    };
  },
  directives: { Clickoutside },
  components: { CountDown },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
      userInfo: (state) => state.app.userInfo,
      registerBannerInfo: (state) => state.app.registerBannerInfo,
      boxConf: (state) => state.app.boxConf,
      boxMatchConf: (state) => state.app.boxMatchConf,
      siteFunc: (state) => state.app.siteFunc
    }),
    showGirl () {
      return Math.random() > 0.3;
    },
    genderTxt () {
      const txt = {
        0: this.$t('app.match_both'),
        2: this.$t('base.female'),
        1: this.$t('base.male'),
      };
      return txt[this.gender];
    }
  },
  watch: {
    isLogin (n, v) {
      if (n) {
        this.getLivcamConf();
        this.getMatchLimit();
        logReport({
          eventId: '106-1-1-88', // 宝箱活动入口点击
          freeName2: window.$mObj.adData
        });
      }
    },
    'boxConf.show': {
      handler (val) {
        if (val) {
          logReport({
            eventId: '106-1-1-68', // 宝箱活动入口曝光
            freeName2: window.$mObj.adData || {},
            url: this.boxConf.targetUrl
          });
        }
      },
      immediate: true,
    },
    'boxMatchConf.show': {
      handler (val) {
        if (val) {
          logReport({
            eventId: '106-1-15-4',
            freeName2: 'match'
          });
        }
      },
      immediate: true,
    },
  },
  methods: {
    toggleGender () {
      this.showCSGender = !this.showCSGender;
      logReport({
        eventId: '106-5-1-2', // 筛选点击
        freeName2: window.$mObj.adData || {},
      });
    },
    csGender (id) {
      console.log('123');
      this.gender = id;
      sessionStorage.setItem('matchGender', id);
      this.hideGenderCs();
      logReport({
        eventId: '106-5-1-3', // 性别点击
        freeName2: window.$mObj.adData || {},
        gender: id
      });
    },
    hideGenderCs () {
      this.showCSGender = false;
    },
    isEnoughCoin () {
      const matchPrice = +window.$mObj.matchConf.playWayUnitPrice;
      const coin = this.userInfo.goldNum;
      return coin >= matchPrice;
    },

    showMatchingPop () {
      const isEnough = this.isEnoughCoin();
      if (isEnough) {
        this.$router.push({
          name: 'MatchPage'
        });
        return;
      }
      const disCoin = getDiscountCoin();
      logReport({
        eventId: '106-5-2-3', // 金币不足提示弹窗曝光
        freeName2: window.$mObj.adData || {},
        r_source: 'index',
        coin: disCoin && disCoin.totalCoinNum,
      });

      const matchPrice = +window.$mObj.matchConf.playWayUnitPrice;
      let con = this.$t('app.dialog_match_gold_not_enough_message', { coin: matchPrice, img: `<img class='icon-coin' src='${coin}'>` });
      if (disCoin) {
        con = `<p>${con}</p>${disCoin.con}`;
      }
      this.$message({
        confirmBtnTxt: this.$t('app.exchange_lucky_draw'), // '充值',
        cancelBtnTxt: this.$t('base.cancel'), // '取消',
        noCancelBtn: false,
        html: `<div class='pop-gold-message'>${con}</div>`,
      }).then((result) => {
        logReport({
          eventId: '106-5-2-4', // 金币不足提示弹窗去充值点击
          freeName2: window.$mObj.adData || {},
          r_source: 'index',
          coin: disCoin && disCoin.totalCoinNum,
        });
        // if (disCoin) {
        //   this.$store.commit('setDisCoinIframe', true);
        // } else {
        // }
        this.$router.push({ name: 'CoinPage' });
      }).catch(() => {
        logReport({
          eventId: '106-5-2-5', // 金币不足提示弹窗取消点击
          freeName2: window.$mObj.adData || {},
          r_source: 'index',
          coin: disCoin && disCoin.totalCoinNum,
        });
      });
    },

    async toMatch () {
      logReport({
        eventId: '106-5-1-1', // start点击
        freeName2: window.$mObj.adData || {},
        gender: this.gender
      });

      // 记录玩match 记录
      localStorage.setItem('RC_MATCHED_RECORD', 1);

      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'gomeet');
        this.$store.commit('setShowLoginPop', true);
        window.fbq('trackCustom', 'GomeetShowLoginPop');
        window.gtag && window.gtag('event', 'goMeetShowLoginPop', { send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'] });
        return;
      }

      if (this.lock) return;
      this.lock = true;

      // 开始
      let canCall = true;
      try {
        await this.$rtc.creatRTCTrack(this);
        this.lock = false;
      } catch (e) {
        this.lock = false;
        canCall = false;
      }

      if (!canCall) return;

      const matchPrice = +window.$mObj.matchConf.playWayUnitPrice;
      const hadShowLivcamConfirm = localStorage.getItem('LIVCAM_FIRST_CONFIRM');
      // const matchPrice = 10000;

      const isEnough = this.isEnoughCoin();

      // 金币不足或非首次匹配
      if (hadShowLivcamConfirm || !isEnough || !matchPrice) {
        this.showMatchingPop();
        return;
      }

      // 首次弹框
      const con = this.$t('app.dialog_match_price_message', { coin: matchPrice, img: `<img class='icon-coin' src='${coin}'>` });

      logReport({
        eventId: '106-5-1-4', // match提示弹窗曝光
        freeName2: window.$mObj.adData || {},
      });
      localStorage.setItem('LIVCAM_FIRST_CONFIRM', true);
      this.$message({
        confirmBtnTxt: this.$t('base.confirm'), // '充值',
        noCancelBtn: true,
        longBtn: true,
        html: `<div class='pop-gold-message'>${con}</div>`,
      }).then(() => {
        logReport({
          eventId: '106-5-1-5', // match提示弹窗continue点击
          freeName2: window.$mObj.adData || {},
        });
        this.$router.push({
          name: 'MatchPage'
        });
      }).catch(e => {
        logReport({
          eventId: '106-5-1-6', // match提示弹窗 取消
          freeName2: window.$mObj.adData || {},
        });
      });
    },

    getCheckPopUp () {
      const params = {
        countryId: localStorage.getItem('RC_USER_COUNTRY'),
      };
      if (!params.countryId) return;
      checkPopUp(params).then((res) => {
        const { code, data } = res;
        if (!(data && data.popUpResp && data.popUpResp.rsc)) {
          console.log('----无配置---');
          return;
        }
        const resData = data.popUpResp.rsc;
        if (resData.show) {
          this.$store.commit('setRegisterBanner', resData);
          logReport({
            eventId: '106-1-1-29',
            freeName2: window.$mObj.adData || {},
            banner_name: 'registerCoins'
          });
        }
      }).catch(err => {
        console.log(err);
      });
    },
    getLivcamConf () {
      apiGetLivcamConfig({
        playWay: this.siteFunc.MATCHING || 4
      }).then(({ code, data = {} }) => {
        window.$mObj.matchConf = data;
        // sessionStorage.setItem('matchTime', data.nextMatchCountdown);
        // sessionStorage.setItem('matchPrice', data.matchingMatchPrice);
      });
    },
    // createVideDom () {
    //   const videoE = document.createElement('video');
    //   videoE.autoplay = true;
    //   videoE.controls = false;
    //   videoE.setAttribute('playsinline', true);
    //   videoE.id = 'matchedVideoDom';

    //   const videoFn = function () {
    //     if (window.$mObj.videoE) return;
    //     console.log('--videoE创建----');
    //     videoE.load();
    //     window.$mObj.videoE = videoE;
    //     document.removeEventListener('touchend', videoFn);
    //     document.removeEventListener('click', videoFn);
    //   };
    //   document.addEventListener('touchend', videoFn);
    //   document.addEventListener('click', videoFn);
    // },
    countDownEnd () {
      console.log('-------倒计时结束-----');
      this.matchLimit = false;
    },
    getMatchLimit () {
      const now = Date.now();
      // this.endTime = this.userInfo.payStatus ? getStorageById('matchLimitTimesV') : getStorageById('matchLimitTimes');
      this.endTime = getStorageById('matchLimitTimes');
      const confMatchTimes = +localStorage.getItem('confMatchTimes');
      // this.matchLimit = (this.endTime >= now);
      this.matchLimit = !this.userInfo.payStatus && (this.endTime >= now);
      if (this.matchLimit) {
        logReport({
          eventId: '106-1-1-72',
          freeName2: window.$mObj.adData || {},
          times: confMatchTimes,
        });
      }
    },
    jumpToWall () {
      this.$router.push({ name: 'GoddessWall' });
    },
    jumpToCoin () {
      const confMatchTimes = +localStorage.getItem('confMatchTimes');
      logReport({
        eventId: '106-1-1-73',
        freeName2: window.$mObj.adData || {},
        times: confMatchTimes,
      });
      this.$router.push({ name: 'CoinPage' });
    },
    toBoxPage () {
      logReport({
        eventId: '106-1-1-69', // 宝箱活动入口点击
        freeName2: window.$mObj.adData || {},
        url: this.boxConf.targetUrl
      });
      this.$router.push({ name: 'ActivityPage' });
    },
    getCountry () {
      apiGetCountryId().then(({ code, data = {} }) => {
        if (code !== 200 || !data) return;
        const { id, ab, ip } = data;
        localStorage.setItem('RC_USER_COUNTRY', id);
        localStorage.setItem('RC_USER_COUNTRY_CODE', ab);
        localStorage.setItem('RC_USER_IP', ip);
        logReport({
          eventId: '106-1-1-88',
          freeName2: window.$mObj.adData,
          free_name1: JSON.stringify({
            adUrl: window.location.search || ''
          })
        });
      });
    },
    toMatchBoxPage () {
      console.log(' this.boxMatchConf', this.boxMatchConf);
      logReport({
        eventId: '106-1-15-5', // 宝箱活动入口点击
        freeName2: 'livcam',
        url: this.boxMatchConf.targetUrl
      });
      this.$router.push({
        name: 'ActivityPage',
        query: {
          fromPage: 'match'
        }
      });
    },
  },
  mounted () {
    this.getCountry();
    localStorage.setItem('mediasource', this.$route.query.mediasource || '');
    localStorage.setItem('campaignid', this.$route.query.campaignid || '');
    localStorage.setItem('adgroupid', this.$route.query.adgroupid || '');
    localStorage.setItem('keyword', this.$route.query.keyword || '');
    localStorage.setItem('creative', this.$route.query.creative || '');
    localStorage.setItem('loc_physical_ms', this.$route.query.loc_physical_ms || '');
    localStorage.setItem('device', this.$route.query.device || '');
    localStorage.setItem('type', this.$route.query.type || '');
    localStorage.setItem('utmsource', this.$route.query.utm_source || '');
    localStorage.setItem('utmcampaign', this.$route.query.utm_campaign || '');
    localStorage.setItem('utmterm', this.$route.query.utm_term || '');
    localStorage.setItem('utmcontent', this.$route.query.utm_content || '');
    localStorage.setItem('bannerid', this.$route.query.bannerid || '');
    if (this.isLogin) {
      this.getMatchLimit();

      logReport({
        eventId: '106-1-1-0',
        free_name2: Object.assign({
          from: 'Login'
        }, window.$mObj.adData || {}),
        free_name1: JSON.stringify({
          adUrl: window.location.search || ''
        }),
        status: !this.matchLimit
      });
    }
    window.fbq('track', 'ViewContent', { content_name: window.location.search });
    if (this.$route.query.mediasource) {
      window.gtag && window.gtag('event', 'GoMeetPageView', { send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'] });
    }
    if (!this.isLogin) {
      setTimeout(() => {
        this.getCheckPopUp();
      }, 2000);
    }
    // this.createVideDom();
    setTimeout(() => {
      this.showBanner = true;
    }, 300);

    // this.gender = +sessionStorage.getItem('matchGender');
  },
  created () {
    if (!this.isLogin) return;
    this.getLivcamConf();
  }
};
</script>
<style lang='less' scoped>
@import url("./index.less");
</style>

<template>
  <div id="app" v-if="showPage"  :class="{hasWall: showWall}">
    <div id="app-area">

      <!-- rtc limit pop -->
      <RtclimitPop v-if="showRTCLimit" />

      <!-- web app 安装 -->
      <install-app />

      <!-- 侧边导航 -->
      <sidebar :menuShow="menuShow" @changeMenuShow="changeMenuShow"/>

      <!-- 页面主体区域 -->
      <div class="page-wrap" :class="{ 'blur': isBlur }">
        <!-- 页面统一切换transition 动画 -->
        <router-view />

      </div>

      <!-- 消息好友内容面板 -->
      <!-- <transition name="stepAni"> -->
        <im-panel v-if="imPanelConfig.show" :tabId="imPanelConfig.tabId" />
      <!-- </transition> -->

      <!-- 侧边聊天 -->
      <!-- <transition name="stepAni"> -->
        <im-chat v-if="imChatConfig.show" :friendId="imChatConfig.friendId" />
      <!-- </transition> -->
      <!-- sayhi列表 -->
      <im-say-hi v-if="imSayHiShow" />

      <!-- 黑名单列表 -->
      <!-- <transition name="stepAni"> -->
        <im-block v-if="imBlockShow" />
      <!-- </transition> -->

      <!-- 好友上线提醒列表 -->
      <!-- <transition name="stepAni"> -->
        <im-online v-if="imOnlineShow" />
      <!-- </transition> -->

      <!-- 消息好友侧边栏 -->
      <im-bar ref="imBar" @changeMenuShow="changeMenuShow"/>

    </div>

    <!-- 统一登录弹框 -->
    <pop-login></pop-login>
    <!-- 拨打接听电话弹框 -->
    <invite-call ref="inviteCall"></invite-call>
    <!-- 视频聊天弹框 -->
    <video-chat ref="reportCall" @changeDiscountCoin="getDiscountCoin"></video-chat>

    <!-- 1v1 视频聊天 -->
    <VideoChat1V1 ref="reportCall1v1" @changeDiscountCoin="getDiscountCoin"></VideoChat1V1>

    <!-- 匹配成功聊天 -->
    <!-- <MatchVideoChat></MatchVideoChat> -->
    <!-- cookie 提示 -->
    <pop-cookie @acceptHandler="acceptHandler"></pop-cookie>
    <!-- privacy 提示 -->
    <pop-privacy ref="popPrivacy"></pop-privacy>
    <!-- privacy 提示 -->
    <WebPush></WebPush>
    <!-- random -->
    <pop-random @acceptHandler="acceptHandler"></pop-random>

    <!-- 登录前 18+ 弹框 -->
    <!-- <pop-18></pop-18> -->
    <!-- popSayHi -->
    <pop-sayhi></pop-sayhi>

    <!-- 半窗买金币 -->
    <pop-pay></pop-pay>
    <LimitedPop></LimitedPop>

    <!-- 送金币 -->
    <PopBanner></PopBanner>
    <!-- 举报 -->
    <PopReport></PopReport>

  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import Sidebar from '@/components/SideBar';
import ImBar from '@/components/ImBar';
import ImPanel from '@/components/ImPanel';
import ImChat from '@/components/ImChat';
import ImBlock from '@/components/ImBlock';
import ImOnline from '@/components/ImOnline';
import ImSayHi from '@/components/ImSayHi';
import PopLogin from '@/components/PopLogin';
import InviteCall from '@/components/InviteCall';
import VideoChat from '@/components/VideoChat';
// import MatchVideoChat from '@/components/MatchVideoChat';
import PopCookie from '@/components/PopFiles/PopCookie';
import PopRandom from '@/components/PopFiles/PopRandom';
import PopPrivacy from '@/components/PopFiles/PopPrivacy';
import PopPay from '@/components/popPay';
import PopSayhi from '@/components/popSayhi';
import LimitedPop from '@/components/LimitedPop';
import WebPush from '@/components/WebPush';
import PopBanner from '@/components/PopBanner';
import { getUserInfoData, apiWebHB, apiUpdateHB, apiGetCountryId, apiGetSignInStatus, apiGetActivityEntry, apiLocationEntrysMap, apiGetSiteFuncConf } from '@/api/user';
import { getBackpackEntrance } from '@/api/backpack.js';
import { apiRtmcancel, apiRefuse } from '@/api/call';
import { getRTMUIDTOken } from '@/api/message';
import { getCoinAndChannel } from '@/api/shop';
import agoraMixin from '@/mixin/agoraMixin';
import { allowCountryList } from '@/util/config';
import { insertGoogleSdk } from '@/util/loginSDK';
import { logReport } from '@/util/logReport';
import { getParams } from '@/util/index';
import PopReport from '@/components/popReport';
import Cookies from 'js-cookie';
import { toGlobal } from '@/util/shop';

import RtclimitPop from '@/components/RtclimitPop';

import InstallApp from '@/components/InstallApp';

import VideoChat1V1 from '@/components/VideoChat1V1';

export default {
  name: 'app',
  data () {
    return {
      HBTimer: null,
      menuShow: false,
      showPage: false,
      resetTime: 20
    };
  },
  components: {
    Sidebar,
    PopLogin,
    InviteCall,
    VideoChat,
    // MatchVideoChat,
    PopCookie,
    PopRandom,
    PopPrivacy,
    ImBar,
    ImPanel,
    ImChat,
    ImBlock,
    ImOnline,
    ImSayHi,
    // Pop18,
    LimitedPop,
    PopPay,
    PopSayhi,
    WebPush,
    PopBanner,
    InstallApp,
    PopReport,
    RtclimitPop,
    VideoChat1V1
  },
  mixins: [agoraMixin],
  watch: {
    isLogin (n, o) {
      if (n) {
        this.HBReport();
        this.getRTMToken();
        this.getGiftListData();
        this.getDiscountCoin();
        // 遗留异常电话处理
        this.checkAbnormalCall();
        this.getSiteFuncConf();
        this.handlerPushMsg();

        // this.$store.commit('setShowWall', true);
      } else {
        clearTimeout(this.HBTimer);
      }
    },
    /**
     * 全局视频邀请铃声控制
     */
    showRingBell (n, o) {
      // 更新在线状态为buzy
      apiUpdateHB({ status: n ? 1 : 2 }).then(res => {
        console.log(res, '---online change');
      });
      if (n) {
        if ([window.$mObj.cardConf.afterLikeFakeCallLocation, window.$mObj.searchConf.afterLikeFakeCallLocation].includes(this.bizData.goddessLocation)) {
          if (window.$mObj.bellAudio) {
          // pause 控制停止播放  load 控制下次重头播放
            window.$mObj.bellAudio.pause();
            window.$mObj.bellAudio.load();
          }
          return;
        }
        if (this.isMatchCall || this.bizData.goddessLocation === 100) return;
        window.$mObj.bellAudio && window.$mObj.bellAudio.play();
      } else {
        if (window.$mObj.bellAudio) {
          // pause 控制停止播放  load 控制下次重头播放
          window.$mObj.bellAudio.pause();
          window.$mObj.bellAudio.load();
        }
      }
    },
    /**
     * 监听视频开始结束 更改online状态
     */
    showVideoPop (n) {
      // 更新在线状态为buzy
      apiUpdateHB({ status: n ? 1 : 2 }).then(res => {
        console.log(res, '---online change');
      });
    },
    $route (n, v) {
      // if (n.name !== 'MatchPage' && n.name !== 'GoddessWall') {
      //   if (!localStorage.getItem('RC_WALL_TIP') && localStorage.getItem('RC_MATCHED_RECORD') && localStorage.getItem('RC_LOGIN_REGISTER')) {
      //     this.$store.commit('setShowWallTips', true);
      //   } else if (!localStorage.getItem('RC_LOGIN_REGISTER') && !localStorage.getItem('RC_WALL_TIP')) {
      //     this.$store.commit('setShowWallTips', true);
      //   }
      // }

      // if (n.name === 'GoddessWall' && !this.showWall) {
      //   this.$router.push({
      //     name: 'LivCam'
      //   });
      //   return;
      // }
      if (n.name === 'LoginPage' && !this.showLoginPop) {
        this.$router.push({
          name: 'LivCam'
        });
      }
      if (v && (v.name === 'FriendsPage')) {
        this.$store.commit('setImOnlineState', false);
      }

      if (v.name === 'CoinPage' && this.isLogin) {
        this.updateMyUserData();
      }
      if (n.name === 'LivCam') {
        this.reGetCamera();
      }
    },
    userInfo (n) {
      if (!this.showWall) {
        this.$store.commit('setShowWall', true);
      }
    }

  },
  computed: {
    ...mapState({
      isMobile: (state) => state.app.isMobile,
      isLogin: (state) => state.app.isLogin,
      isBlur: (state) => state.app.isBlur,
      showRingBell: (state) => state.app.showRingBell,
      imPanelConfig: (state) => state.app.imPanelConfig,
      imChatConfig: (state) => state.app.imChatConfig,
      imBlockShow: (state) => state.app.imBlockShow,
      imOnlineShow: (state) => state.app.imOnlineShow,
      imSayHiShow: (state) => state.app.imSayHiShow,
      showVideoPop: (state) => state.app.showVideoPop,
      showLoginPop: (state) => state.app.showLoginPop,
      isMatchCall: (state) => state.app.isMatchCall,
      showRTCLimit: (state) => state.app.showRTCLimit,
      isShowCheckInTips2: (state) => state.app.isShowCheckInTips2,
      showWall: (state) => state.app.showWall,
      userInfo: (state) => state.app.userInfo,
      bizData: (state) => state.agora.bizData,
      showSayHiPop: (state) => state.agora.showSayHiPop,
    }),
    isChatPage () {
      return /chat/.test(this.$route.path);
    },
  },
  methods: {
    ...mapActions(['updateMyUserData']),
    acceptHandler () {
      if (this.isLogin) {
        this.$refs.popPrivacy.getPrivacyStatus();
      }
    },
    getRTMToken () {
      getRTMUIDTOken({}).then(res => {
        console.log(res, 'getRTMToken');
        this.$store.commit('saveRtmConfig', res.data);
        this.$initAgora(this);
        this.reGetCamera();
      });
    },
    HBReport () {
      // 2分钟心跳
      this.HBTimer = setInterval(() => {
        const myUid = +Cookies.get('userId');
        if (!myUid) {
          clearInterval(this.HBTimer);
          return;
        };
        const params = {
          status: this.showRingBell || this.showVideoPop ? 1 : 2,
          type: 0,
        };
        apiWebHB(params).then(res => { console.log('heartbeat-----'); });
      }, 20 * 1000);
    },
    /**
     * 异常电话检测处理
     * 邀请期间刷新页面 页面重载后需要主动挂断
     * 区分 call 身份 调取不同的接口来挂断
    */
    async checkAbnormalCall () {
      const roomNum = localStorage.getItem('RC_CURROOM_NUM');
      const callRole = localStorage.getItem('RC_MY_CALL_ROLE');
      if (!roomNum) return;
      if (callRole === 'caller') {
        await apiRtmcancel({
          roomNum: roomNum
        });
      } else {
        await apiRefuse({
          roomNum: roomNum
        });
      }
      localStorage.removeItem('RC_CURROOM_NUM');
      localStorage.removeItem('RC_MY_CALL_ROLE');
    },
    // 检查是否为mobile
    checkMobile () {
      const isMobile = document.body.clientWidth <= 680;
      if (isMobile !== this.isMobile) {
        this.$store.commit('setIsMobile', isMobile);
      }
    },
    changeMenuShow (bool) {
      this.menuShow = bool;
    },
    getCountryId () {
      apiGetCountryId().then(({ code, data = {} }) => {
        if (code !== 200 || !data) return;
        const { id, ab, ip } = data;
        localStorage.setItem('RC_USER_COUNTRY', id);
        localStorage.setItem('RC_USER_COUNTRY_CODE', ab);
        localStorage.setItem('RC_USER_IP', ip);
        logReport({
          eventId: '106-1-1-0',
          free_name2: Object.assign({
            from: 'noLogin'
          }, window.$mObj.adData || {}),
          free_name1: JSON.stringify({
            adUrl: window.location.search || ''
          })
        });
      });
    },
    getCountryCode () {
      apiGetCountryId().then(({ code, data = {} }) => {
        if (code !== 200 || !data) return;
        const { ab } = data;
        localStorage.setItem('RC_USER_COUNTRY_CODE', ab);
      });
    },
    getAdParams () {
      // const { mediasource, campaignid, adgroupid, keyword, creative, loc_physical_ms: logPhy, device, type } = this.$route.query;
      const urlSearch = window.location.search;
      const mediasource = getParams('mediasource');
      const campaignid = getParams('campaignid');
      const adgroupid = getParams('adgroupid');
      const keyword = getParams('keyword');
      const creative = getParams('creative');
      const logPhy = getParams('loc_physical_ms');
      const device = getParams('device');
      const type = getParams('type');
      const utmsource = getParams('utm_source');
      const utmcampaign = getParams('utm_campaign');
      const utmterm = getParams('utm_term');
      const utmcontent = getParams('utm_content');
      const bannerid = getParams('bannerid');

      if (urlSearch && mediasource) {
        window.$mObj.adData = {
          url: window.location.search,
          media_source: mediasource,
          campaign_id: campaignid,
          adgroup_id: adgroupid,
          keyword: keyword,
          creative: creative,
          loc_physical_ms: logPhy,
          device: device,
          type: type
        };
      } else if (urlSearch && utmsource) {
        window.$mObj.adData = {
          url: window.location.search,
          utm_source: utmsource,
          utm_campaign: utmcampaign,
          utm_term: utmterm,
          utm_content: utmcontent,
          bannerid: bannerid,
          campaign_id: campaignid,
        };
      } else {
        window.$mObj.adData = {};
      }
    },
    reGetCamera () {
      const b = +localStorage.getItem('RC_ISRELOAD_SQ');
      if (b === 1) {
        this.$store.commit('setRTCLimit', true);
        localStorage.removeItem('RC_ISRELOAD_SQ');
      }
      if (b === 2) {
        this.$rtc && this.$rtc.checkDevice(this);
      }
    },
    getActivityEntry () {
      apiGetActivityEntry().then(({ data }) => {
        console.log(data, '--------签到开关接口-----');
        if (data[100]) {
          const isShow = data[100].show;
          if (isShow) { this.getSignInStatus(); };
        }
      });
    },
    getLocationEntry () {
      apiLocationEntrysMap().then(({ data }) => {
        console.log(data, '--------宝箱入口-----');
        if (data[108]) {
          const conf = data[108][0];
          this.$store.commit('setBoxConf', conf);
        }
        if (data[49]) {
          const conf = data[49][0];
          this.$store.commit('setMatchBoxConf', conf);
        }
        if (data[52]) {
          const conf = data[52][0];
          this.$store.commit('setLivcamBoxConf', conf);
        }
      });
    },
    getBackpackEntry () {
      getBackpackEntrance().then(res => {
        console.log(res, '---背包入口------');
        if (res.code === 200) {
          this.$store.commit('setBackpackConf', res.data);
        }
      });
    },
    async getDiscountCoin () {
      const ab = localStorage.getItem('RC_USER_COUNTRY_CODE');
      const selCountryCode = toGlobal(ab);
      try {
        const res = await getCoinAndChannel({ countryCode: selCountryCode });
        console.log(res, '-------金币包');
        const coinChannel = (res.data && res.data.coinChannel) || [];
        this.getLimitedCoin(res.data);
        const discountCoin = coinChannel.find(item => item.rcpCoinCountry.coinType === 1 && item.rcpCoinCountry.totalCoinNum === 299);
        if (discountCoin) {
          const { rcpCoinCountry, channelAndPayCompanyDtoList } = discountCoin;
          const checkout = channelAndPayCompanyDtoList.find(item => item.payCompanyCode === 'checkout' && item.payChannel === 'card');
          let data = {
            coin: {},
            channel: {}
          };
          if (checkout) {
            data = {
              coin: rcpCoinCountry,
              channel: checkout
            };
          };

          this.$store.commit('setDisCoinConf', data);
        } else {
          const data = {
            coin: {},
            channel: {}
          };
          this.$store.commit('setDisCoinConf', data);
        }
      } catch (error) {
        const data = {
          coin: {},
          channel: {}
        };
        this.$store.commit('setDisCoinConf', data);
        console.error('[获取优惠包error]');
      }
    },
    getLimitedCoin (data) {
      try {
        const flashCoinChannel = (data.flashCoinChannel) || [];
        const webFlashUserSeals = (data.webFlashUserSeals) || [];
        const coinChannel = flashCoinChannel[0] || [];
        const conf = webFlashUserSeals[0] || {};
        const coin = coinChannel.rcpCoinCountry || {};
        const channel = coinChannel.channelAndPayCompanyDtoList ? coinChannel.channelAndPayCompanyDtoList[0] : {};
        const obj = {
          coin,
          channel,
          conf,
        };
        const now = Date.now();

        if (conf.endTime >= now) {
          this.$store.commit('setLimitCoinConf', obj);
        } else {
          const resetObj = {
            coin: {},
            channel: {},
            conf: {},
          };
          this.$store.commit('setLimitCoinConf', resetObj);
        }
      } catch (error) {
        const resetObj = {
          coin: {},
          channel: {},
          conf: {},
        };
        this.$store.commit('setLimitCoinConf', resetObj);
      }
    },
    getSignInStatus () {
      const params = {
        countryId: localStorage.getItem('RC_USER_COUNTRY'),
      };
      apiGetSignInStatus(params).then(res => {
        console.log(res, '--------签到接口-----');
        const data = res.data || {};
        const conf = {
          show: true,
          hasCheck: data.status,
          totalCoin: data.totalCoin,
          type: 'new'
        };
        if (data.vip) {
          conf.show = false;
        }
        this.$store.commit('setCheckConf', conf);
      });
    },

    cutDownTime () {
      clearInterval(this.resetFn);
      if (!this.isShowCheckInTips2) {
        return;
      }
      this.resetFn = setInterval(() => {
        if (!this.resetTime) {
          console.log('--签到提示隐藏2-----');
          clearInterval(this.resetFn);
          this.$store.commit('setCheckInTips2', false);
          return;
        }
        this.resetTime -= 1;
      }, 1000);
    },
    // 获取网站功能玩法开关配置， 用户登录后
    getSiteFuncConf () {
      apiGetSiteFuncConf().then(({ code, data }) => {
        if (code !== 200 || !data || !data.openedPlayWays || !data.openedPlayWays.length) return;
        const { openedPlayWays } = data;
        const theD = {};
        const autoJump = {};
        openedPlayWays.forEach(item => {
          theD[item.name] = item.id;
          autoJump[item.name] = item.main;
        });
        this.$store.commit('setSiteFunc', theD);
        // 首页自动跳转逻辑
        if (this.$route.path === '/' && window.self === top) {
          if (theD.LIVCAM && autoJump.LIVCAM) {
            this.$router.push({
              name: 'SearchPage'
            });
            return;
          }
          if (theD.CARD && autoJump.CARD) {
            this.$router.push({
              name: 'CardPage'
            });
            return;
          }
        }

        if (theD.DAILYMEET) {
          this.$store.commit('setShowSayHiPop', true);
          logReport({
            eventId: '106-10-1-0'
          });
        }
      });
    },
    handlerPushMsg () {
      const pushData = Cookies.get('push_notification');
      console.log('-----pushData-----', pushData);
      if (pushData) {
        const data = JSON.parse(pushData);
        const userId = data.userId;
        const myUid = +Cookies.get('userId');
        const friendUserId = data.bizData ? data.bizData.friendUserId : data.friendUserId;
        if ((userId === myUid && friendUserId) || !myUid) {
          if (this.isMobile) {
            this.$router.push({
              name: 'IMMessageSession'
            });
          }

          if (!myUid) {
            this.$store.commit('setShowLoginPop', true);
            return;
          }

          this.$store.commit('setImChatConfig', {
            show: !this.isMobile && myUid,
            friendId: friendUserId,
            headImg: data.headImg || '',
            userName: ''
          });
          if (myUid) {
            setTimeout(() => {
              Cookies.remove('push_notification', { path: '' });
            }, 2000);
          }
        } else {
          console.log('[push]--不是当前登录用户-或不存在-friendUserId-------');
        }
      }
    },
    pageShow () {
      if (document.visibilityState === 'visible') {
        this.handlerPushMsg();
      }
    },

  },
  mounted () {
    window.$mObj.vm = this;
    this.getAdParams();
    //
    if (!this.isLogin) {
      if (localStorage.getItem('RC_FROM_LANDPAGE')) {
        localStorage.removeItem('RC_FROM_LANDPAGE');
        this.$store.commit('setShowLoginPop', true);
      }

      this.getCountryId();
      this.showPage = true;
    } else {
      // 兼容
      if (!localStorage.getItem('RC_USER_COUNTRY_CODE')) {
        this.getCountryCode();
      }
    }
    // mobile检测挂载
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    document.addEventListener('visibilitychange', this.pageShow);
    if (this.isLogin) {
      getUserInfoData().then(({ code, data }) => {
        this.showPage = true;

        if (data) {
          localStorage.setItem('RC_USER_COUNTRY', data.countryId);
          this.$store.commit('setUserInfo', data);
          this.$store.commit('setWebPush', true);
          this.getActivityEntry();
          this.getLocationEntry();
          this.getBackpackEntry();
          this.getDiscountCoin();
          this.handlerPushMsg();
        }
      }).catch(err => {
        this.showPage = true;
        console.log(err);
      });
      this.HBReport();
      this.getRTMToken();
      this.getGiftListData();
      // 遗留异常电话处理
      this.checkAbnormalCall();
      this.getSiteFuncConf();
    }
    // window.addEventListener('load', async () => {
    // 获取广告参数
    // });
    window.$mObj.vm = this;

    // google sdk 插入
    insertGoogleSdk().then(() => {
      setTimeout(() => {
        this.$store.commit('setGoogleLoaded', true);
      }, 200);
    });

    // 页面进入充值注册状态
    if (localStorage.getItem('RC_LOGIN_REGISTER')) {
      localStorage.removeItem('RC_LOGIN_REGISTER');
    }
  },
};
</script>

<style lang='less'>
@import url("~@/style/common.less");
@import url("~@/style/mobile.less");
</style>

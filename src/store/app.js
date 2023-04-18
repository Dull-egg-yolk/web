import Cookies from 'js-cookie';
import { getUserInfoData, checkIfAddCoinForNew } from '@/api/user';
import { setBodyScroll, htmlEncode, checkIsSafari, processChatUser } from '@/util';
export default {
  state: {
    networkData: {},
    isLogin: Boolean(Cookies.get('userId') && Cookies.get('loginToken')),
    showLoginPop: false,
    showVideoPop: false,
    show1v1Pop: false,
    showRingBell: false,
    showLoginBannerTips: false,
    showWebPush: false,
    showCountry: false,
    showCheckInPop: false,
    showVipCheckInPop: false,
    showSetting: false,
    isShowCheckInTips: true,
    isShowCheckInTips2: false,
    showReport: false,
    fakeCallBegin: false,
    checkInConf: {
      show: false,
      hasCheck: true,
      totalCoin: '',
      type: ''
    },
    loginPopFrom: '',
    reportImg: '',
    chat1v1: [],
    chat1v1Channel: '',
    setupStep: '',
    siteLanguage:
      localStorage.getItem('siteLanguage') || navigator.language || 'en',
    userInfo: {},
    friendInfo: {},
    pushToken: '',
    isBlur: false,
    chatUsersTemp: [], // 最近聊天的用户列表
    chatSayHiUsersTemp: [], // say hi聊天的用户列表
    // 控制im & friend 列表面板的显示
    imPanelConfig: {
      show: false,
      tabId: 0
    },
    // 控制 im 聊天 侧边面板
    imChatConfig: {
      show: false,
      friendId: 0
    },
    // 控制im 黑名单列表面板
    imBlockShow: false,
    // 好友上线提醒列表面板
    imOnlineShow: false,
    imSayHiShow: false,
    // 礼物列表
    giftList: [],
    giftAllList: [],
    // 控制 gift 面板的显示
    giftConfig: {
      show: false,
      info: {
        giftId: '',
        giftStar: 0,
        senderId: null
      }
    },
    // 控制视频内加好友的
    addFriend: {
      show: false,
      info: {
        friendId: 0,
        type: 0,
        times: 0
      }
    },
    videoRecharge: false,
    isMobile: false,
    showBanned: false,
    imStatus: false,
    homeParams: {},
    isHomeHost: false,
    userLocationInfo: {},
    passwordConfig: {},
    googleLoaded: false,
    isMatchCall: false,
    matchCallCancel: false,
    showMatchedPop: false, // 显示匹配成功页面
    // showPCInstallWebApp: false,
    showRTCLimit: false,
    registerBannerInfo: {
      show: false,
      gold: '',
      callCount: '',
      img: '',
      img1: '',
    },
    hasRegisterBannerPop: {
      gold: '',
      img: '',
      status: false,
    },
    boxConf: {
      show: false,
      icon: '',
      content: 'web 活动',
      targetUrl: '',
      bizData: {
        activityId: ''
      }
    },
    boxMatchConf: {
      show: false,
      icon: '',
      content: 'match玩法 充返活动',
      targetUrl: '',
      bizData: {
        activityId: ''
      }
    },
    boxLivcamConf: {
      show: false,
      icon: '',
      content: 'livcam玩法 充返活动',
      targetUrl: '',
      bizData: {
        activityId: ''
      }
    },
    backpackConf: {
      backpackEntrance: false,
      backpackGiftEntrance: false,
      backpackUrl: ''
    },
    disCoinIframe: false,
    disCoinConf: {
      coin: {},
      channel: {}
    },
    limitCoinConf: {
      coin: {},
      channel: {},
      conf: {}
    },
    showWall: false,
    showWallTip: !localStorage.getItem('RC_WALL_TIP'),
    isSafari: (/Safari/.test(navigator.userAgent) && !/Chrome|CriOS|FxiOS|OPiOS|mercury/.test(navigator.userAgent)),
    // isSafari: true,
    showSafariInstall: false,
    showSayhi: false,
    showSayHiPop: false,
    siteFunc: {}
  },
  getters: {
    chatUsersTemp: state => state.chatUsersTemp,
    chatSayHiUsersTemp: state => state.chatSayHiUsersTemp
  },
  mutations: {
    setShow1v1Pop (state, payload) {
      state.show1v1Pop = payload;
    },
    setSiteFunc (state, payload) {
      state.siteFunc = payload;
    },
    setShowSafariInstall (state, payload) {
      state.showSafariInstall = payload;
    },
    setShowSayhi (state, payload) {
      state.showSayhi = payload;
    },
    setShowSayHiPop (state, payload) {
      state.showSayHiPop = payload;
    },
    setShowWallTips (state, payload) {
      state.showWallTip = payload;
    },
    setShowWall (state, payload) {
      state.showWall = payload;
    },

    setRTCLimit (state, payload) {
      state.showRTCLimit = payload;
    },

    setMatchCallCancel (state, payload) {
      state.matchCallCancel = payload;
    },
    setMatchCall (state, payload) {
      state.isMatchCall = payload;
    },
    setGoogleLoaded (state, payload) {
      state.googleLoaded = payload;
    },
    setNetworkData (state, payload) {
      state.networkData = payload;
    },
    setHomeParams (state, payload) {
      state.homeParams = payload;
    },
    setHomeHost (state, payload) {
      state.isHomeHost = payload;
    },
    setIsMobile (state, payload) {
      state.isMobile = payload;
    },
    updateVideoRecharge (state, payload) {
      state.videoRecharge = payload;
    },
    setImOnlineState (state, payload) {
      state.imOnlineShow = payload;
      setBodyScroll(state.imOnlineShow);
    },
    setImSayHiState (state, payload) {
      state.imSayHiShow = payload;
      setBodyScroll(state.imSayHiShow);
    },
    setImBlockState (state, payload) {
      state.imBlockShow = payload;
      setBodyScroll(state.imBlockShow);
    },
    setGiftList (state, payload) {
      state.giftList = payload;
    },
    setGiftAllList (state, payload) {
      state.giftAllList = payload;
    },
    setImPanelConfig (state, payload) {
      state.imPanelConfig = payload;
    },
    setImChatConfig (state, payload) {
      state.imChatConfig = payload;
      setBodyScroll(state.imChatConfig.show);
    },
    setGiftConfig (state, payload) {
      state.giftConfig = payload;
    },
    setAddFriend (state, payload) {
      state.addFriend = payload;
    },
    setIsLogin (state, payload) {
      state.isLogin = payload;
    },
    setBannerPop (state, payload) {
      state.hasRegisterBannerPop = { ...state.hasRegisterBannerPop, ...payload };
    },
    setLoginBannerTips (state, payload) {
      state.showLoginBannerTips = payload;
    },
    setWebPush (state, payload) {
      state.showWebPush = payload;
    },
    setCheckIn (state, payload) {
      state.showCheckInPop = payload;
    },
    setVipCheckIn (state, payload) {
      state.showVipCheckInPop = payload;
    },
    setSettingPop (state, payload) {
      state.showSetting = payload;
    },
    setCountry (state, payload) {
      state.showCountry = payload;
    },
    setCheckInTips (state, payload) {
      state.isShowCheckInTips = payload;
    },
    setCheckInTips2 (state, payload) {
      state.isShowCheckInTips2 = payload;
    },
    setShowReport (state, payload) {
      state.showReport = payload;
    },
    setFakeCallBegin (state, payload) {
      state.fakeCallBegin = payload;
    },
    setCheckConf (state, payload) {
      state.checkInConf = { ...state.checkInConf, ...payload };
    },
    setBoxConf (state, payload) {
      state.boxConf = { ...state.boxConf, ...payload };
    },
    setMatchBoxConf (state, payload) {
      state.boxMatchConf = { ...state.boxMatchConf, ...payload };
    },
    setLivcamBoxConf (state, payload) {
      state.boxLivcamConf = { ...state.boxLivcamConf, ...payload };
    },
    setBackpackConf (state, payload) {
      state.backpackConf = { ...state.backpackConf, ...payload };
    },
    setShowLoginPop (state, payload) {
      state.showLoginPop = payload;
      state.isBlur = payload;
      if (payload) {
        // window.$mObj.scrollTop = window.scrollY;
        window.$mObj.vm.$router.push({
          name: 'LoginPage',
          query: window.$mObj.vm.$route.query
        });
      }
      setBodyScroll(payload);
    },
    setLoginPopFrom (state, payload) {
      console.log(payload, 'from');
      state.loginPopFrom = payload;
    },
    setVideoPopState (state, payload) {
      state.showVideoPop = payload;
      localStorage.removeItem('RC_CURROOM_NUM');
      localStorage.removeItem('RC_MY_CALL_ROLE');
      setBodyScroll(state.showVideoPop);
    },
    setBellState (state, payload) {
      state.showRingBell = payload;
      setBodyScroll(state.showRingBell);
    },
    pushChat1v1 (state, payload) {
      state.chat1v1.push(payload);
    },
    setReportImg (state, payload) {
      state.reportImg = payload;
    },
    setChat1v1Channel (state, payload) {
      state.chat1v1Channel = payload;
    },
    setPopSetup (state, payload) {
      state.setupStep = payload;
    },
    setSiteLanguage (state, payload) {
      state.siteLanguage = payload;
      localStorage.setItem('siteLanguage', payload);
    },
    setUserInfo (state, payload = {}) {
      payload.userName = htmlEncode(payload.userName);
      state.userInfo = payload;
      payload.loginToken && Cookies.set('loginToken', payload.loginToken, { expires: 365 });
      payload.id && Cookies.set('userId', payload.id, { expires: 365 });
      state.isLogin = true;
    },
    setFriendInfo (state, payload = {}) {
      payload.userName = htmlEncode(payload.userName);
      state.friendInfo = payload;
    },
    updateUserInfo (state, payload) {
      payload.userName = htmlEncode(payload.userName);
      state.userInfo = payload;
    },
    setPushToken (state, token) {
      state.pushToken = token;
    },
    updateCoin (state, payload) {
      state.userInfo.goldNum = payload;
    },
    updateChatUsersTemp (state, list) {
      state.chatUsersTemp = list;
    },

    updateChatSayHiUsersTemp (state, list) {
      state.chatSayHiUsersTemp = list;
    },

    updateChatUsers (state, list) {
      const { chatUsersTemp, chatSayHiUsersTemp } = processChatUser(list);
      state.chatUsersTemp = chatUsersTemp;
      state.chatSayHiUsersTemp = chatSayHiUsersTemp;
    },
    setShowBanned (state, bool) {
      state.showBanned = bool;
    },
    setImStatus (state, bool) {
      state.imStatus = bool;
    },
    setUserLocationInfo (state, bool) {
      state.userLocationInfo = bool;
    },
    setPasswordConfig (state, bool) {
      state.passwordConfig = bool;
    },
    resetPasswordConfig (state) {
      state.passwordConfig = {};
    },
    setMatchedPop (state, payload) {
      state.showMatchedPop = payload;
    },
    setRegisterBanner (state, payload) {
      state.registerBannerInfo = { ...state.registerBannerInfo, ...payload };
    },
    setDisCoinIframe (state, payload) {
      state.disCoinIframe = payload;
    },
    setDisCoinConf (state, payload) {
      state.disCoinConf = { ...state.disCoinConf, ...payload };
    },
    setLimitCoinConf (state, payload) {
      state.limitCoinConf = { ...state.limitCoinConf, ...payload };
    },
  },
  actions: {
    getLoginState ({ state, commit }) {
      if (!state.isLogin) {
        commit('setLoginPopFrom', 'call');
        commit('setShowLoginPop', true);
        window.gtag && window.gtag('event', 'goMeetShowLoginPop', { send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'] });
        return Promise.reject(new Error('not login'));
      }
      return Promise.resolve();
    },
    // 全局更新用户信息
    updateMyUserData ({ state, commit }) {
      getUserInfoData().then(({ code, data }) => {
        if (code === 200) {
          commit('updateUserInfo', data);
        }
      });
    },
    // 注册用户是否显示全屏弹窗
    checkCoinForNew ({ state, commit }) {
      console.log('-------999999-------');
      const params = {
        countryId: localStorage.getItem('RC_USER_COUNTRY'),
      };
      checkIfAddCoinForNew(params).then(({ code, data }) => {
        if (code === 200) {
          console.log(data, '----    // 注册用户是否显示全屏弹窗          --------');
          commit('setBannerPop', data);
          getUserInfoData({}).then(({ code, data }) => {
            if (typeof data.goldNum === 'number') {
              commit('updateCoin', data.goldNum);
            }
          });
        }
      });
    },
  },
};

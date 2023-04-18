<template>
  <div class="side-bar" :class="[classList]">
    <!-- 主内容区 -->
    <div class="side-body" id="side-body-wrap">

      <!-- 移动端下拉菜单的按钮 -->
      <!-- <div class="mb-drop fx-c">
        <span class="icon-menu" @click.stop="showMenu"></span>
      </div> -->
      <!-- <div v-if="showWall">
        licam
      </div> -->
      <!-- logo -->
      <div class="logo" v-if="!(isMobile && $route.name === 'FriendPage')">
        <span v-if="!isLogin && isMobile" class="logo-setting" @click.stop="clickSet"></span>
        <span class="icon" @click="backHome"></span>
      </div>
      <div style="display: none"><a href="https://gomeet.today/random-video-chat.html" target="_blank"></a></div>
      <!-- menu -->
      <!-- <ul class="menu fx-c" v-if="!isMobile || menuShow" v-clickoutside:click="hideMenuHandler">
        <li v-for="(item,index) of navLinks" :key="index" @click="openUrl(item)">
          <router-link v-if="!item.router" :to="{ name: item.name }" target="_blank">{{item.txt}}</router-link>
          <router-link v-else :to="{ name: item.name }" >{{item.txt}}</router-link>
        </li>
      </ul> -->
      <ul class="menu fx-c" v-if="!isMobile || menuShow" v-clickoutside:click="hideMenuHandler">
        <li :class="{active: !/GoddessWall|CardPage|SearchPage/.test($route.name)}">
          <router-link :to="{ name: 'LivCam' }">GoMeet</router-link>
        </li>
        <li :class="{active:$route.name=='GoddessWall'}">
          <router-link v-if="showWall && !showWallTip" :to="{name: 'GoddessWall'}"> {{ $t('base.discover') }} </router-link>
        </li>
        <li :class="{active: /SearchPage/.test($route.name)}" v-if="siteFunc.LIVCAM">
          <router-link :to="{name: 'SearchPage'}"> LivCam </router-link>
        </li>
        <li :class="{active: /CardPage/.test($route.name)}" v-if="siteFunc.CARD">
          <router-link :to="{name: 'CardPage'}"> Card </router-link>
        </li>
      </ul>
      <!-- 用户相关 下载  金币数 登录/个人 -->
      <div class="user fx-ic">

        <!-- 未登录 登录按钮 -->
        <div class="login hover fx-ic" v-if="!isLogin" @click="showLoginHandler">
          <span class="txt">{{$t('app.sign_in')}}</span>
          <span class="icon-user fx-c"></span>
        </div>

        <template v-else>

          <!-- install -->
          <!-- <div class="pcInstallWA fx-c hover" v-if="showPCInstallWebApp" @click="installWebApp">{{$t('base.installation')}}</div> -->

          <!-- 金币 -->
          <div class="side-coin hover" @click.stop="addCoin">
            <div class="coin-wrap fx-be-vc">
              <span>{{$t('webChat.myCoins')}}</span>
              <strong>{{ userInfo.goldNum }}</strong>
            </div>
          </div>

          <!-- 已登录 用户头像 -->
          <div class="side-profile"  @click.stop="userPopControl">
            <div class="avatar avatar-img hover">
              <div class="avatar-wrap">
                <img :src="userInfo.headImg" alt />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 下载引导弹框 -->
    <side-base-pop
      :switchState="showDownload"
      type="down"
      @switchControl="downloadPopControl"
    >
      <side-download @canclePop="downloadPopControl" />
    </side-base-pop>

    <!-- 个人下拉菜单 -->
    <div class="user-set-pop" v-if="showUser" v-clickoutside:click="hideUserHandler">
      <ul class="common-list user-pop">
        <li class="ocell fx-ic" @click="jumpToProfile">
           {{$t('app.permission_pickimage_title')}}
        </li>
        <li class="ocell fx-ic logout" @click="logout">
           {{$t('base.logout')}}
        </li>
      </ul>
    </div>

    <!-- 弹框黑底遮罩 因为层级和弹框交互逻辑比较特殊 单独拎出来  -->
    <transition name="fade">
      <div class="side-pop-bg" v-if="showPopBg"  @click="cancelPop"></div>
    </transition>

    <div class="checkin-tips" v-if="(showCheckInTips && /GoddessWall|LivCam/.test($route.name))">
      <div class="tips-info-vip" v-if="checkInConf.type==='vip'" @click="showCheckIn" >
        <div class="tips-info-txt">
          <p v-if="payStatus" v-html="$t('webChat.checkIn.tipsVip', {num: checkInConf.totalCoin})"></p>
          <p v-else v-html="$t('webChat.checkIn.tipsFree', {num: checkInConf.totalCoin})"></p>
        </div>
      </div>
      <div class="tips-info" v-else @click="showCheckIn" >
        <div class="tips-info-txt">
          <p v-html="$t('webChat.checkIn.titleTips', {num: checkInConf.totalCoin})"></p>
        </div>
        <div class="tips-info-btn"><span>{{ $t('webChat.checkIn.checkIn') }}</span></div>
      </div>
    </div>

    <!-- 设置弹框 -->
    <!-- <PopSetup /> -->
  </div>
</template>

<script>

import { mapState } from 'vuex';
import SideBasePop from './SideBasePop.vue';
import SideDownload from './SideDownload.vue';
// import SideUser from './SideUser.vue';
// import PopSetup from '../popSetup';
import { logReport } from '@/util/logReport';
import Cookies from 'js-cookie';

import Clickoutside from '@/util/clickoutside.js';
import { userLogout } from '@/api/user';
import { clearAllCookie } from '@/util';
import { endeUserId } from '@/filters';

export default {
  name: 'SideBar',
  data () {
    return {
      timer: null,
      showDownload: false,
      showUser: false,
      showPopBg: false,
      isSetup: false,
      resetTime: 20,
      resetFn: null,
      // menuShow: false,
    };
  },
  directives: { Clickoutside },
  components: {
    SideBasePop,
    SideDownload,
    // SideUser,
    // PopSetup
  },
  watch: {
    isMobile (n) {
      if (n) {
        this.$emit('changeMenuShow', false);
      }
    },
    showCheckInTips: {
      handler (val) {
        if (val) {
          logReport({
            eventId: '106-1-1-62', // 签到tips展示
            freeName2: window.$mObj.adData || {},
            r_resource: 'index',
            checkinType: this.checkInConf.type
          });
        }
      },
      immediate: true,
    },
    isLogin (n, o) {
      if (n) {
        // this.cutDownTime();
      } else {
        // clearInterval(this.resetFn);
        this.$store.commit('setCheckInTips', false);
      }
    },
  },
  props: {
    menuShow: {
      type: Boolean,
      require: true
    }
  },
  computed: {
    ...mapState({
      isMobile: (state) => state.app.isMobile,
      isLogin: (state) => state.app.isLogin,
      userInfo: (state) => state.app.userInfo,
      unReadCount: (state) => state.agora.unReadCount,
      imPanelConfig: (state) => state.app.imPanelConfig,
      imChatConfig: (state) => state.app.imChatConfig,
      imOnlineShow: (state) => state.app.imOnlineShow,
      imBlockShow: (state) => state.app.imBlockShow,
      showPCInstallWebApp: (state) => state.app.showPCInstallWebApp,
      checkInConf: (state) => state.app.checkInConf,
      isShowCheckInTips: (state) => state.app.isShowCheckInTips,
      showWall: (state) => state.app.showWall,
      showWallTip: (state) => state.app.showWallTip,
      payStatus: (state) => state.app.userInfo.payStatus,
      siteFunc: (state) => state.app.siteFunc
    }),
    classList () {
      const arr = [];

      let profileType = 0;
      if (this.$route.name === 'FriendPage') {
        profileType = +endeUserId(this.$route.params.friendId, 'decode') === +Cookies.get('userId') ? 1 : 2;
      }

      const isEdit = this.$route.name === 'EditProfile';
      const isCoin = ['CoinPage', 'CoinsPayPage', 'CoinPayPage', 'PayOrderList', 'PayRefund', 'RefundBack', 'cardList', 'paymentInfoAdd', 'paymentMethodsList', 'CallbackPage'].includes(this.$route.name);
      const isFullPage = this.$route.meta && this.$route.meta.fullPage;

      if (this.imPanelConfig.show || profileType === 1 || isCoin) {
        arr.push('hide');
        if (this.imPanelConfig.tabId === 1) {
          arr.push('spc');
        }
      }

      if (profileType === 1 && !this.imPanelConfig.show) {
        arr.push('spc');
      }

      if (this.imChatConfig.show || this.imOnlineShow || this.imBlockShow || profileType === 2 || isEdit || isFullPage) {
        arr.push('none');
      }

      return arr.join(' ');
    },
    navLinks () {
      return [
        {
          id: 0,
          txt: this.$t('webChat.title'), // 'Livechat', // 'Contact us',
          name: 'LiveChat',
          router: true
        },
        {
          id: 1,
          txt: this.$t('app.setting_secrity_center'),
          link: '/safety.livu.me',
          name: 'SafetyCenter'
        },
        {
          id: 2,
          txt: this.$t('webChat.privacyCenter'), // 'Privacy',
          link: 'https://privacy.livuchat.com/LivU_privacy_center.html',
          name: 'PrivacyCenter'
        },
        {
          id: 3,
          txt: this.$t('base.random'), // 'RandomVideoChat',
          link: 'https://livuchat.me/random-video-chat',
          name: 'RandomVideo'
        }
      ];
    },
    showCheckInTips () {
      return this.checkInConf.show && !this.checkInConf.hasCheck && this.isShowCheckInTips;
    }
  },
  methods: {

    showMenu () {
      this.$emit('changeMenuShow', !this.menuShow);
    },
    // 获取dom坐标
    getDomPosY (domName) {
      const wrap = document.querySelector('#side-body-wrap');
      const dom = document.querySelector(domName);
      return wrap.clientHeight - (dom.offsetTop + dom.clientHeight * 1.65 - wrap.scrollTop);
    },
    // 下载引导弹框 显示控制
    downloadPopControl () {
      if (this.showUser) {
        this.cancelUserPop();
      }
      this.showPopBg = !this.showPopBg;
      this.showDownload = !this.showDownload;
    },
    userPopControl () {
      this.menuLogHandler('user');
      // this.$router.push({ name: 'FriendPage', query: { friendId: this.userInfo.id } });
      // this.showDownload = false;
      this.showUser = !this.showUser;
      // this.showPopBg = this.showUser;
      // this.isSetup = false;
      // this.menuLogHandler('profile');
    },
    setupPopControl () {
      this.showDownload = false;

      setTimeout(() => {
        if (!this.isSetup) {
          this.showUser = true;
          this.showPopBg = true;
          this.isSetup = true;
          return;
        }
        console.log('setup');

        this.showUser = !this.showUser;
        this.isSetup = !this.isSetup;
        this.showPopBg = this.showUser;
      }, 200);
    },
    cancelUserPop () {
      this.showPopBg = false;
      this.showUser = false;
    },
    addCoin () {
      this.menuLogHandler('coin');
      this.$router.push({ name: 'CoinPage' });
    },
    showLoginHandler () {
      // 点击登录按钮
      logReport({ eventId: '106-1-1-16' });
      this.$store.commit('setLoginPopFrom', 'login_btn');
      this.$store.commit('setShowLoginPop', true);
      window.fbq('trackCustom', 'GomeetShowLoginPop');
      window.gtag && window.gtag('event', 'goMeetShowLoginPop', { send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'] });
    },
    backHome () {
      this.$router.push({ name: 'LivCam' });
    },
    clickSet () {
      this.$store.commit('setSettingPop', true);
    },
    menuLogHandler (type) {
      const eventId = {
        LiveChat: '106-1-1-2',
        friend: '106-1-1-3',
        coin: '106-1-1-2',
        profile: '106-1-1-7',
        SafetyCenter: '106-1-1-4',
        PrivacyCenter: '106-1-1-5',
        RandomVideo: '106-1-1-6',
        user: '106-1-1-10'
      }[type];

      logReport({
        eventId
      });
    },
    cancelPop () {
      this.showDownload = false;
      this.cancelUserPop();
    },
    hideUserHandler () {
      this.showUser = false;
    },
    useAction (type) {
      if (type === 2) {
        this.logout();
      }

      this.showUser = false;
    },
    // 登出
    logout () {
      this.showUser = false;
      userLogout().then(res => {
        logReport({
          eventId: '106-3-3-1'
        });

        clearAllCookie();
        this.$store.commit('setIsLogin', false);
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      });
    },
    jumpToProfile () {
      this.showUser = false;
      this.$router.push({ name: 'FriendPage', params: { friendId: endeUserId(this.userInfo.id) } });
    },
    hideMenuHandler () {
      if (!this.isMobile) return;
      this.$emit('changeMenuShow', false);
    },
    openUrl (data) {
      this.menuLogHandler(data.name);
      this.$emit('changeMenuShow', false);
    },
    showCheckIn () {
      logReport({
        eventId: '106-1-1-63', // 新用户签到入口提示点击
        freeName2: window.$mObj.adData || {},
        r_resource: 'index',
        checkinType: this.checkInConf.type
      });
      if (this.checkInConf.type === 'vip') {
        this.$store.commit('setVipCheckIn', true);
      } else {
        this.$store.commit('setCheckIn', true);
      }
      this.$router.push({ name: 'CoinPage' });
    },
    cutDownTime () {
      clearInterval(this.resetFn);
      if (!this.isShowCheckInTips) {
        return;
      }
      this.resetFn = setInterval(() => {
        if (!this.resetTime) {
          console.log('--签到提示隐藏-----');
          clearInterval(this.resetFn);
          this.$store.commit('setCheckInTips', false);
          return;
        }
        this.resetTime -= 1;
      }, 1000);
    },
  },
  mounted () {
    window.addEventListener('scroll', () => {
      this.$emit('changeMenuShow', false);
    });
    if (this.isLogin) {
      // this.cutDownTime();
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>

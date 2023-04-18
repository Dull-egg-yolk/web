<template>
  <div class="im-bar" :class="{'hidden-page': hiddenPage}">
    <div class="bar-wrap">
      <!-- 消息和好友入口 -->
      <ul class="nav flex-col-c">

        <!-- video 移动端首页入口 -->
        <li class="fx-c mobile home" :class="{cur: curTabName === 2}" @click.stop="linkTo(1)">
          <span class="icon-video3 icon"></span>
        </li>

        <!-- wall 移动端首页入口 -->
        <li class="fx-c mobile wall" :class="{cur: curTabName === 4, hasTip: showWallTip && showWall1}" @click.stop="linkTo(4)" v-if="showWall">

          <div class="wall-tips fx-be-vc" v-if="showWallTip && showWall1" @click="wallTipClick">
            <div class="img">
              <img src="../../assets/img/img-wall-tip.png" alt="">
            </div>
            <div class="txt">
              {{ $t('webChat.wallTip') }}
            </div>
          </div>

          <span class="icon-discover icon"></span>
        </li>

        <!-- livcam 移动端首页入口 -->
        <li class="fx-c mobile search" :class="{cur: curTabName === 6}" @click.stop="linkTo(6)" v-if="siteFunc.LIVCAM">
          <!-- <div class="dot-red" v-if="showSearchDot"></div> -->
          <span class="icon-heartjump icon"></span>
        </li>

        <!-- card 移动端首页入口 -->
        <li class="fx-c mobile card" :class="{cur: curTabName === 5}" @click.stop="linkTo(5)" v-if="siteFunc.CARD">
          <!-- <div class="dot-red" v-if="showCardDot"></div> -->
          <span class="icon-card icon">
            <span class="path1"></span>
            <span class="path2"></span>
          </span>
        </li>

        <!-- chat -->
        <li class="fx-c" :class="{cur: curTabName === 0, cur2: isMobile && curTabName === 1}" @click.stop="showImPanel(0)">
          <span class="icon-doc icon"></span>
          <span class="bubble" v-if="unReadCount">{{ unReadCount }}</span>
        </li>

        <!-- friend -->
        <li class="fx-c" v-if="!isMobile"  :class="{cur: curTabName === 1}" @click.stop="showImPanel(1)">
          <span class="icon-friend icon"></span>
        </li>

        <!-- 个人中心 移动端入口 -->
        <li class="fx-c mobile login" v-if="!isLogin" @click.stop="linkTo(2)">
          <span class="icon-user icon fx-ic"></span>
        </li>

        <!-- 个人中心 移动端入口 -->
        <li class="fx-c mobile user" v-else :id="showWall ? 'myEnter' : ''" :class="{cur: curTabName === 3, float: showWall, hide: hideUserEntery }" @click.stop="linkTo(2)">
          <div class="avatar-img">
            <div class="avatar-wrap">
              <img :src="userInfo.headImg" alt />
            </div>
          </div>
        </li>

      </ul>

      <!-- 当前好友消息列表 -->
      <ul class="cur-msg-list flex-col-c">
        <li v-for="item in unReadUserList" :key="item.id">
          <div class="avatar-img" @click.stop="showImChat(item)">
            <div class="avatar-wrap">
              <fitimg :headImg="item.headImg" type="smailimg"></fitimg>
            </div>
          </div>
          <div class="bubble">{{ item.noReadCount }}</div>
        </li>
      </ul>
    </div>
    <div class="site-set fx-c" v-if="!isMobile && !isLogin">
      <div class="icon-set hover" @click.stop="showSetPop"></div>
    </div>
    <!-- 设置 -->
    <div class="site-setting fx-c">
      <div class="icon-setting hover" @click.stop="showSettingPop"></div>
    </div>

    <!-- 设置列表 -->
    <transition name="sitefade">
      <pop-setting v-if="showSetting" v-clickoutside:click="hideSetting"></pop-setting>
    </transition>
    <!-- 未登录设置列表 -->
    <transition name="sitefade">
      <pop-set v-if="showSet" v-clickoutside:click="hideSet"></pop-set>
    </transition>
  </div>
</template>

<script>

import { mapState } from 'vuex';
import imAddFriendMixin from '@/mixin/imAddFriendMixin';
import PopSetting from '@/components/PopFiles/PopSetting.vue';
import PopSet from '@/components/PopFiles/PopSet.vue';
import { endeUserId } from '@/filters';
import Clickoutside from '@/util/clickoutside.js';
import { logReport } from '@/util/logReport';

export default {
  name: 'ImBar',
  data () {
    return {
      showSetting: false,
      showSet: false,
      showWall1: true,
      showCardDot: true, // !localStorage.getItem('RC_CARD_DOT')
      showSearchDot: true,
    };
  },
  components: {
    PopSetting,
    PopSet
  },
  mixins: [imAddFriendMixin],
  watch: {
    showWall (o, n) {
      if (this.showWallTip) {
        logReport({
          eventId: '106-4-3-1',
        });
      }
    },
    $route: {
      handler (n, v) {
        if (/CardPage/.test(n.name)) {
          localStorage.setItem('RC_CARD_DOT', 1);
          this.showCardDot = false;
        }
        if (/SearchPage/.test(n.name)) {
          localStorage.setItem('RC_SEARCH_DOT', 1);
          this.showSearchDot = false;
        }
      },
      immediate: true
    },
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
      userInfo: (state) => state.app.userInfo,
      unReadCount: (state) => state.agora.unReadCount,
      unReadUserList: (state) => {
        const list = state.app.chatUsersTemp || [];
        return list.filter(item => item.noReadCount > 0).slice(0, 6);
      },
      imPanelConfig: (state) => state.app.imPanelConfig,
      isMobile: (state) => state.app.isMobile,
      showWall: (state) => state.app.showWall,
      showWallTip: (state) => state.app.showWallTip && state.app.userInfo.payStatus,
      siteFunc: (state) => state.app.siteFunc

    }),
    curTabName () {
      const pathName = this.$route.name;
      if (pathName === 'LivCam' && !this.imPanelConfig.show) {
        return 2;
      }
      if (pathName === 'GoddessWall' && !this.imPanelConfig.show) {
        return 4;
      }
      if (/CardPage/.test(pathName) && !this.imPanelConfig.show) {
        return 5;
      }
      if (/SearchPage/.test(pathName) && !this.imPanelConfig.show) {
        return 6;
      }
      if (this.imPanelConfig.show) {
        return this.imPanelConfig.tabId;
      }
      if (pathName === 'FriendPage' && !this.imPanelConfig.show) { return 3; }
      return '';
    },
    hiddenPage () {
      return this.isMobile && this.$route.name === 'MatchPage';
    },
    hideUserEntery () {
      return this.isMobile && this.$route.name === 'FriendsPage';
    }
  },
  directives: { Clickoutside },
  methods: {
    menuLogHandler (type) {
      const eventId = {
        0: '106-1-1-8',
        1: '106-1-1-9',
        setting: '106-1-1-11'
      }[type];

      logReport({
        eventId
      });
    },
    showImPanel (tabId) {
      // 埋点 0 消息 1 好友
      this.menuLogHandler(tabId);

      if (this.isMobile) {
        this.$router.push({
          name: tabId === 0 ? 'MessagePage' : 'FriendsPage'
        });
        return;
      }

      if (!this.checkLoginStatus(tabId === 0 ? 'im' : 'friend')) return;
      this.$emit('changeMenuShow', false);
      this.$store.commit('setImPanelConfig', {
        show: true,
        tabId
      });
    },
    showImChat (data) {
      if (data.friendId === -4) {
        if (this.isMobile) {
          this.$router.push({
            name: 'IMSayHiSession'
          });
        } else {
          this.$store.commit('setImSayHiState', true);
        }

        return;
      }
      this.$store.commit('setImPanelConfig', {
        show: false,
        tabId: 0
      });
      this.$store.commit('setImChatConfig', {
        show: true,
        friendId: data.friendId,
        headImg: data.headImg,
        userName: data.userName
      });
    },
    hideSetting () {
      this.showSetting = false;
    },
    hideSet () {
      this.showSet = false;
    },
    linkTo (type) {
      const event = {
        1: '106-1-1-54', // 功能tab点击（移动端）
        2: '106-1-1-10', // 底部个人头像点击
        4: '106-1-1-67', // 底部wall 点击
        5: '106-1-1-87',
        6: '106-1-1-88'
      };
      const eventId = event[type];
      logReport({
        eventId
      });
      this.$store.commit('setImPanelConfig', {
        show: false,
        tabId: 0
      });
      this.$emit('changeMenuShow', false);
      if (type === 1) {
        if (this.$route.name === 'LivCam') return;
        this.$router.push(
          {
            name: 'LivCam',
          }
        );
      } else if (type === 4) {
        if (this.$route.name === 'GoddessWall') return;
        if (this.showWallTip) {
          this.$store.commit('setShowWallTips', false);
          localStorage.setItem('RC_WALL_TIP', true);
        }
        this.$router.push(
          {
            name: 'GoddessWall',
          }
        );
      } else if (type === 5) {
        if (this.$route.name === 'CardPage') return;
        this.$router.push(
          {
            name: 'CardPage',
          }
        );
      } else if (type === 6) {
        if (this.$route.name === 'SearchPage') return;
        this.$router.push(
          {
            name: 'SearchPage',
          }
        );
      } else {
        this.$router.push(
          {
            name: 'FriendPage',
            params: { friendId: endeUserId(this.userInfo.id) }
          }
        );
      }
    },
    showSettingPop () {
      this.menuLogHandler('setting');
      if (!this.checkLoginStatus()) return;
      this.showSetting = !this.showSetting;
    },
    showSetPop () {
      this.menuLogHandler('setting');
      // if (!this.checkLoginStatus()) return;
      this.showSet = !this.showSet;
    },
    wallTipClick () {
      logReport({
        eventId: '106-4-3-2',
      });
    },
  },
  mounted () {
    if (this.showWall && this.showWallTip) {
      logReport({
        eventId: '106-4-3-1',
      });
    }
    setTimeout(() => {
      this.showWall1 = false;
      localStorage.setItem('RC_WALL_TIP', true);
      this.$store.commit('setShowWallTips', false);
    }, 5000);
  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>

<template>
  <div class="im-list list-wrap common-list" @click.stop ref="imList">
    <div class="message-banner" v-if="showBanner && banner === 'false'" @click="jumpToCoin">
      <div class="cover cover-coin">
        <img src="@/assets/img/message.png" />
      </div>
      <div class="icon-close" @click.stop="closeCoin"><span class="icon-cross"></span></div>
      <div class="banner-content">
        <div class="top">
          <div class="coin-text">{{ $t('webChat.bannerCoin') }}</div>
          <div class="bottom">
            <div class="text">{{ $t('webChat.bannerContent') }}</div>
          </div>
        </div>
        <div class="botton">
          <div class="botton-coin">{{ $t('webChat.bannerBtn') }}</div>
        </div>
      </div>
    </div>
    <chat-user-item @click="showImChat(item)" :itemData="item" :class="{ cur: item.friendId === friendId }"
      v-for="item in chatUsersTemp" :key="item.friendId" :data-id="item.friendId"></chat-user-item>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import ChatUserItem from './chat-user-item.vue';
import { apiGetGoddessStatus } from '@/api/goddess';
import { logReport } from '@/util/logReport';
import { setCookieBanner } from '@/util/index';
import debounce from 'lodash/debounce';

export default {
  name: 'ImList',
  data () {
    return {
      showBanner: false,
      banner: localStorage.getItem('banner'),
      removeScrollEvent: null,
      inViewPos: [],
      inViewUid: [],
      inViewIdx: [],
      statusTime: null
    };
  },
  components: {
    ChatUserItem
  },
  watch: {
    imStatus (newStatus, old) {
      if (newStatus && !this.imSayHiShow) this.getInViewUid();
    },
    chatUsersTemp (n, o) {
      if (n.length && !o.length) {
        this.$nextTick(() => {
          this.getInViewUid();
        });
      }
    },
    $route (n, v) {
      if (n.name === 'IMMessageSession' || n.name === 'IMSayHiSession') {
        clearTimeout(this.statusTime);
        return;
      }
      if (v.name === 'IMMessageSession' && !this.imSayHiShow) {
        this.getInViewUid();
      }
    },
    imSayHiShow (n, v) {
      if (n) {
        clearTimeout(this.statusTime);
        return;
      }
      if (!n && v) {
        this.getInViewUid();
      }
    }
  },
  computed: {
    ...mapState({
      myUID: (state) => state.app.userInfo.id,
      friendId: (state) => state.agora.curDialogId,
      imStatus: state => state.app.imStatus,
      isMobile: state => state.app.isMobile,
      imSayHiShow: (state) => state.app.imSayHiShow,
    }),
    ...mapGetters(['chatUsersTemp']),
  },
  methods: {
    jumpToCoin () {
      this.$store.commit('setImPanelConfig', {
        show: false,
        tabId: 0
      });
      this.$router.push({ name: 'CoinPage' });
      logReport({
        eventId: '106-1-4-8',
        free_name2: 'message'
      });
    },
    closeCoin () {
      this.showBanner = false;
      logReport({
        eventId: '106-1-4-9',
        free_name2: 'message'
      });
      setCookieBanner('isBannerMessage');
    },
    showImChat (data) {
      // this.$store.commit('setImPanelConfig', {
      //   show: false,
      //   tabId: 0
      // });
      // 点击消息框
      logReport({
        eventId: '106-1-4-2',
        target_user_id: data.friendId
      });

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

      if (this.isMobile) {
        this.$router.push({
          name: 'IMMessageSession'
        });
      } else {
        clearTimeout(this.statusTime);
      }

      this.$store.commit('setImChatConfig', {
        show: !this.isMobile,
        friendId: data.friendId,
        headImg: data.headImg,
        userName: data.userName
      });
    },
    listenerScroll () {
      const scrollDom = this.isMobile ? window : this.$refs.imList;
      const dfHeight = this.isMobile ? scrollDom.innerHeight : scrollDom.clientHeight;
      // 初始可视区域值
      this.inViewPos = [0, dfHeight];

      const scrollHandler = debounce(() => {
        const dfTop = this.isMobile ? 0 : scrollDom.offsetTop;
        const scrollTop = this.isMobile ? scrollDom.scrollY : scrollDom.scrollTop;

        const movePos = dfTop + scrollTop + dfHeight;

        this.scrollTop = scrollTop;

        this.inViewPos = [scrollTop, movePos];
        this.getInViewUid();
      }, 200);

      scrollHandler();
      scrollDom.addEventListener('scroll', scrollHandler);
      return {
        removeEvent () {
          scrollDom.removeEventListener('scroll', scrollHandler);
        },
      };
    },
    getInViewUid () {
      if (!this.chatUsersTemp.length) return;
      const goddessList = this.$refs.imList.querySelectorAll('.ocell');
      const [top, bottom] = this.inViewPos;

      this.inViewUid = [];
      this.inViewIdx = [];

      goddessList.forEach((item, index) => {
        if (item.offsetTop >= top && item.offsetTop < bottom) {
          const uid = item.getAttribute('data-id');
          if (!uid || +uid <= 0) return;
          this.inViewIdx.push(index);
          this.inViewUid.push(uid);
        }
      });

      this.pollCheckStatus();
    },
    pollCheckStatus () {
      clearTimeout(this.statusTime);
      if (this.inViewUid.length < 1) return;
      const chatUsersTemp = JSON.parse(JSON.stringify(this.chatUsersTemp));
      apiGetGoddessStatus({ userIds: this.inViewUid.join(',') }).then(({ code, data }) => {
        if (data && data.length) {
          this.inViewIdx.forEach((v, i) => {
            if (chatUsersTemp[v]) {
              if (chatUsersTemp[v].friendId === data[i].userId) {
                chatUsersTemp[v].status = data[i].status;
              }
            }
          });

          this.$store.commit('updateChatUsersTemp', chatUsersTemp);
          this.$store.commit('setImStatus', false);
        }
      });
      this.statusTime = setTimeout(() => {
        this.pollCheckStatus();
      }, 2000);
    }

  },
  mounted () {
    this.removeScrollEvent = this.listenerScroll();
  },
  beforeDestroy () {
    this.removeScrollEvent && this.removeScrollEvent.removeEvent();
    clearTimeout(this.statusTime);
  },
  created () {
    if (this.isMobile) {
      window.scrollTo(0, 0);
    }
    if (localStorage.getItem('banner') === 'true') {
      this.showBanner = false;
    } else {
      if (localStorage.getItem('isBannerMessage')) {
        const bannerTime = localStorage.getItem('isBannerMessage');
        const twoTime = 24 * 60 * 60 * 1000;
        const newTime = new Date().getTime();
        if (newTime - bannerTime > twoTime) {
          this.showBanner = true;
          logReport({
            eventId: '106-1-4-10',
            free_name2: 'message'
          });
        } else {
          this.showBanner = false;
        }
      } else {
        this.showBanner = true;
        logReport({
          eventId: '106-1-4-10',
          free_name2: 'message'
        });
      }
    }
  }
};
</script>

<template>
  <div class="im-say-hi im-panel" v-clickoutside:click="cancelPanel">
    <div class="p-wrap flex-col" @click.stop>
      <div class="p-title fx-v">
        <div class="icon-arrow hover" @click.stop="cancelPanel">
        </div>
        <div class="t-txt">
          {{ $t('app.hello_title_hi') }}
        </div>
      </div>
      <div class="p-body">
        <div class="im-list list-wrap common-list" ref="sayHiList">
          <chat-user-item @click="showImChat(item)" :itemData="item" class="cur"
            v-for="item in chatSayHiUsersTemp" :key="item.friendId" :data-id="item.friendId"></chat-user-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Clickoutside from '@/util/clickoutside.js';
import { mapState, mapGetters } from 'vuex';
import ChatUserItem from '../ImPanel/chat-user-item.vue';
import { apiGetGoddessStatus } from '@/api/goddess';
import { logReport } from '@/util/logReport';
import debounce from 'lodash/debounce';
import { setBodyScroll } from '@/util';

export default {
  name: 'ImSayHi',
  data () {
    return {
      page: 1,
      size: 20,
      noMore: false,
      onlineList: [],
      remindNum: 0,
      statusTime: null,
      removeScrollEvent: null,
      inViewPos: [],
      inViewUid: [],
      inViewIdx: [],
    };
  },
  components: {
    ChatUserItem
  },
  directives: { Clickoutside },
  computed: {
    ...mapState({
      isMobile: state => state.app.isMobile,
      imChatConfig: (state) => state.app.imChatConfig,
      imSayHiShow: (state) => state.app.imSayHiShow,
    }),
    ...mapGetters(['chatSayHiUsersTemp']),
  },
  watch: {
    chatSayHiUsersTemp (n, o) {
      if (n.length && !o.length) {
        this.$nextTick(() => {
          this.getInViewUid();
        });
      }
    },
    $route (n, v) {
      if (n.name === 'IMMessageSession') {
        clearTimeout(this.statusTime);
        return;
      }
      if (v.name === 'IMMessageSession') {
        this.getInViewUid();
        setTimeout(() => {
          setBodyScroll(true);
        }, 20);
      }
    },
  },
  methods: {
    cancelPanel () {
      this.$store.commit('setImSayHiState', false);
      if (this.isMobile) {
        this.$router.go(-1);
      }
    },
    showImChat (data) {
      // this.$store.commit('setImPanelConfig', {
      //   show: false,
      //   tabId: 0
      // });
      // 点击消息框
      logReport({
        eventId: '106-1-4-2',
        target_user_id: data.friendId,
        r_resource: 'sayhi'
      });

      if (this.isMobile) {
        this.$router.push({
          name: 'IMMessageSession'
        });
      }

      this.$store.commit('setImChatConfig', {
        show: !this.isMobile,
        friendId: data.friendId,
        headImg: data.headImg,
        userName: data.userName
      });
    },
    listenerScroll () {
      const scrollDom = this.isMobile ? window : this.$refs.sayHiList;
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
      if (!this.chatSayHiUsersTemp.length) return;
      const goddessList = this.$refs.sayHiList.querySelectorAll('.ocell');
      const [top, bottom] = this.inViewPos;

      const inViewHost = [];
      this.inViewUid = [];
      this.inViewIdx = [];

      goddessList.forEach((item, index) => {
        if (item.offsetTop >= top && item.offsetTop < bottom) {
          const uid = item.getAttribute('data-id');
          if (!uid || +uid <= 0) return;
          this.inViewIdx.push(index);
          this.inViewUid.push(uid);
          inViewHost.push({ ...this.chatSayHiUsersTemp[index], index });
        }
      });

      this.pollCheckStatus();
    },
    pollCheckStatus () {
      clearTimeout(this.statusTime);
      if (this.inViewUid.length < 1) return;
      const chatSayHiUsersTemp = JSON.parse(JSON.stringify(this.chatSayHiUsersTemp));
      apiGetGoddessStatus({ userIds: this.inViewUid.join(',') }).then(({ code, data }) => {
        if (data && data.length) {
          this.inViewIdx.forEach((v, i) => {
            if (chatSayHiUsersTemp[v]) {
              if (chatSayHiUsersTemp[v].friendId === data[i].userId) {
                chatSayHiUsersTemp[v].status = data[i].status;
              }
            }
          });

          this.$store.commit('updateChatSayHiUsersTemp', chatSayHiUsersTemp);
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
};
</script>

<style lang="less" scoped>
@import url("./index.less");
  .im-say-hi{
    z-index: 21;
  }
</style>

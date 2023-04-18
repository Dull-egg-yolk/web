<template>
  <div class="im-panel mb-nav-panel" v-clickoutside:click="outClickHandler">
    <div class="p-wrap flex-col">
      <div class="p-title fx-v" v-if="!isMobile">
        <div class="icon-arrow hover" @click="outClickHandler"></div>

        <ul class="the-tab fx-v">
          <li class="fx-v" :class="{ cur: curTabId === 0 }" @click="switchTab(0)">
            <span class="icon-doc icon"></span>
            <span class="txt">{{$t('webChat.myMessages')}}</span>
          </li>
          <li class="fx-v" :class="{ cur: curTabId === 1 }" @click="switchTab(1)">
            <span class="icon-friend icon"></span>
            <span class="txt">{{$t('webChat.myFriends')}}</span>
          </li>
        </ul>
      </div>
      <div class="mb-title flex-row-vc" v-else>
        <div class="mb-fp-back fx-ic icon-arrow" v-if="$route.name === 'FriendsPage'" @click="jumpToMsg"></div>
        <div class="title l fx-v">
          {{ curTabId === 0 ? $t('webChat.myMessages') : $t('webChat.myFriends') }}

          <div class="link-friend" @click="jumpToFp" v-if="$route.name !== 'FriendsPage'">
            <span class="icon-friend"></span>
          </div>

        </div>
      </div>
      <div class="p-body">
        <im-list v-if="curTabId === 0" />
        <friend-list v-if="curTabId === 1" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Clickoutside from '@/util/clickoutside.js';
import ImList from './im-list.vue';
import FriendList from './friend-list.vue';
import { logReport } from '@/util/logReport';
export default {
  name: 'ImPanel',
  data () {
    return {
      curTabId: null,
    };
  },
  directives: { Clickoutside },
  props: {
    tabId: {
      type: Number,
      default: 0
    }
  },
  components: {
    ImList,
    FriendList
  },
  watch: {
    tabId (n) {
      this.curTabId = n;
    }
  },
  computed: {
    ...mapState({
      isMobile: (state) => state.app.isMobile
    })
  },
  methods: {
    switchTab (tabId) {
      this.curTabId = tabId;
    },
    outClickHandler () {
      if (this.isMobile) return;
      this.$store.commit('setImPanelConfig', {
        show: false,
        tabId: 0
      });
    },
    jumpToMsg () {
      this.$router.push({ name: 'MessagePage' });
    },
    jumpToFp () {
      logReport({
        eventId: '106-1-1-9'
      });
      this.$router.push({ name: 'FriendsPage' });
    }
  },
  mounted () {
    this.curTabId = this.tabId;
  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>

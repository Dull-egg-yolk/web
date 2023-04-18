<template>
  <!-- 最近聊天消息用户列表 -->
  <div class="ocell fx-be-vc" @click="itemClick">
    <div class="cell-left">
      <div class="avatar-img">
        <div class="avatar-wrap" @click.stop="jumpToProfile">
         <fitimg :headImg="itemData.headImg" type="smailimg"></fitimg>
        </div>
        <span class="online-status" :class="['s-'+itemData.status]"></span>
      </div>
    </div>
    <div class="cell-main">
      <h3 class="name">{{ itemData.userName }}</h3>
      <p v-if="itemData.content" v-html="$options.filters.decrypt(itemData, 'list')"></p>
    </div>
    <div class="cell-right">
      <div v-if="(itemData.friendId === -4)" class="user-header-list">
        <span v-for="son in itemData.userList" :key="son.friendId" class="son-header"><img :src="son.headImg" alt=""></span>
      </div>
      <div v-else class="time">{{ (itemData.timestamp || itemData.timestampUser)  | formatTime }}</div>

      <div class="bubble" v-if="itemData.noReadCount">{{ itemData.noReadCount }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { chatTime } from '@/util/dayjs';
import { decrypt, endeUserId } from '@/filters/index';
import { logReport } from '@/util/logReport';

export default {
  name: 'ChatUserItem',
  props: {
    itemData: {
      type: Object,
      default () {
        return {};
      },
    },
  },
  data () {
    return {};
  },
  filters: {
    formatTime (val) {
      if (!val) return '';
      return chatTime(val);
    },
    decrypt
  },
  computed: {
    ...mapState({
      isMobile: (state) => state.app.isMobile,
    })
  },
  methods: {
    jumpToProfile () {
      // 点击头像
      logReport({
        eventId: '106-1-4-1',
        target_user_id: this.itemData.friendId
      });
      if (this.itemData.friendId > 0) {
        if (!this.isMobile) {
          this.$store.commit('setImPanelConfig', {
            show: false,
            tabId: 0
          });
        }
        this.$store.commit('setImSayHiState', false);
        this.$router.push({
          name: 'FriendPage',
          params: { friendId: endeUserId(this.itemData.friendId) }
        });
      }
    },
    itemClick () {
      this.$emit('click', this.itemData);
    },
  },
};
</script>

<style lang="less">
@import url("./index.less");
</style>

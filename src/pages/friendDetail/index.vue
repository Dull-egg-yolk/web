<template>
  <div class="profile-page">
    <!-- <div class="page-head fx-be-vc">
      <div class="action back hover" @click="jumpBack">
        <span class="ico icon-arrow"></span>
      </div>
      <h2 class="title-txt"></h2>
      <div class="action hover" @click.stop="showExtend = true">
        <span class="ico icon-more"></span>
      </div>
    </div> -->
    <!-- 更多侧边弹框 -->
    <transition
      enter-active-class="extend-show"
      leave-active-class="extend-hide"
      :duration="{ enter: 300, leave: 300 }"
    >
      <pop-user-action v-if="showExtend" @cancelPop="() => (showExtend = false)"></pop-user-action>
    </transition>

    <!-- 好友详情 -->
    <!-- <transition name="sitefade"> -->
      <profile-detail v-if="!loadLock" :profileData="friendDetail"></profile-detail>
    <!-- </transition> -->
  </div>
</template>

<script>
import { getOtherProfile } from '@/api/user';
import PopUserAction from '@/components/PopUserAction';
import agoraMixin from '@/mixin/agoraMixin';
import { endeUserId } from '@/filters';
import { logReport } from '@/util/logReport';
import { setBodyScroll } from '@/util/index';

import ProfileDetail from '@/components/ProfileDetail';

export default {
  name: 'FriendDetail',
  data () {
    return {
      friendDetail: {},
      showExtend: false,
      loadLock: true,
    };
  },
  mixins: [agoraMixin],
  components: {
    PopUserAction,
    ProfileDetail
  },
  computed: {
    friendId () {
      return endeUserId(this.$route.params.friendId, 'decode');
    }
  },
  watch: {
    friendId (newVal, val) {
      if (newVal) {
        this.getOtherUserInfo();
      } else {
        this.$router.back();
      }
    }
  },
  methods: {
    jumpBack () {
      this.$router.push({ name: 'FriendIndex' });
    },
    getOtherUserInfo () {
      this.loadLock = true;
      const params = {
        searchUserId: this.friendId
      };
      getOtherProfile(params).then(({ code, data }) => {
        this.loadLock = false;
        this.friendDetail = data;
        // this.mockData();
      });
    },
    // 向好友发私信
    toChat () {
      this.$router.push({
        name: 'DialogPage',
        query: { friendId: this.friendId },
      });
    },
    /**
     * 发送电话邀请
     */
    sendCall () {
      // this.$store.commit('setInviterInfo', this.friendDetail);
      this.$store.commit('setHomeHost', false);
      this.callAction(this.friendDetail, 26);
    },
  },
  mounted () {
    this.getOtherUserInfo();
    setBodyScroll(true);
  },
  beforeDestroy () {
    setBodyScroll(false);
  }
};
</script>

<style lang="less">
@import url("./index.less");
</style>

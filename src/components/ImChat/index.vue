<template>
  <div class="im-chat im-panel"  v-clickoutside:click="cancelPanel" @click.stop="handlerOutClick">
    <div class="p-wrap flex-col">
      <div class="p-title fx-v">
        <div class="icon-arrow hover" @click.stop="cancelPanel(true)">
        </div>
        <div class="friend-info fx-v">
          <div class="avatar-img hover" @click="jumpToProfile">
            <div class="avatar-wrap">
              <img :src="friendDetail.headImg" alt />
            </div>
            <span class="status" :class="['s-'+friendStatus]"></span>
          </div>
          <div class="name">
            {{friendDetail.userName}}
          </div>
        </div>
        <div class="icon-more icons hover" v-if="friendId>0" @click.stop="setMore"></div>
        <div class="icons hover" v-else></div>
      </div>
      <div class="p-body">
        <div class="accept-friend" v-if="friendDetail.relation === 3 && showAddFriend">
        <!-- <div class="accept-friend fx-be-vc"> -->
          <p> {{$t('app.request_add_friend', {friendName:friendDetail.userName })}}</p>
          <div class="m-btn mini major" @click="acceptFriend">accept</div>
          <div class="m-btn mini close" @click="closeFriend">close</div>
        </div>
        <dialog-box :friendDetail="friendDetail" :friendId="friendId" :friendAvatar="friendDetail.headImg" @send="sedMsg" ref="dialogBox">
        </dialog-box>
      </div>
      <user-menu :friendData="friendDetail" v-if="showMore" :show.sync="showMore" :userName.sync="userName" @reportData="getReportData"
        class="user-set-pop" v-clickoutside:click="hideUserHandler" />
      <!-- report -->
     <report-menu class="user-report-pop" :friendData="friendDetail" :reportVideo="reportVideo" v-if="showReport" @show="getShow" v-clickoutside:click="hideReportHandler" />
    </div>
  </div>
</template>

<script>
import Clickoutside from '@/util/clickoutside.js';
import { mapState } from 'vuex';
import DialogBox from '../DialogBox';
import { getOtherProfile } from '@/api/user';
import { apiAddFriend } from '@/api/friend';
import { setMessageRead } from '@/api/message';
import { apiGetGoddessStatus } from '@/api/goddess';
import { getChatList, triggerChatUser, getFriendInfo, setFriendMsgRead } from '@/util/message';
import UserMenu from '@/components/PopFiles/UserMenu.vue';
import ReportMenu from '@/components/PopFiles/ReportMenu.vue';
import { endeUserId } from '@/filters';
import { insertAddFriend } from '@/util/broadcast';
import { logReport } from '@/util/logReport';
import { getStorageByDay, setStorageByDay } from '@/util/index';

export default {
  name: 'ImChat',
  data () {
    return {
      friendId: 0,
      friendDetail: {
        headImg: '',
        userName: '',
        relation: '',
      },
      friendStatus: 0,
      showMore: false,
      showReport: false,
      userName: '',
      reportVideo: null,
      showAddFriend: true,
      statusTime: null
    };
  },
  components: {
    DialogBox,
    UserMenu,
    ReportMenu
  },
  directives: { Clickoutside },
  watch: {},
  computed: {
    ...mapState({
      isMobile: (state) => state.app.isMobile,
      isLogin: (state) => state.app.isLogin,
      userInfo: (state) => state.app.userInfo,
      unReadCount: (state) => state.agora.unReadCount,
      imChatConfig: (state) => state.app.imChatConfig,
    })
  },
  methods: {
    jumpToProfile () {
      // 点击头像
      logReport({
        eventId: '106-1-4-7',
        target_user_id: this.friendId
      });
      if (this.friendId < 0) return;
      this.$router.push({
        name: 'FriendPage',
        params: { friendId: endeUserId(this.friendId) }
      });
      if (this.isMobile) {
        this.$store.commit('setImChatConfig', {
          show: false,
          friendId: 0
        });
      }
    },
    sedMsg (val) {
      console.log(val, '-----发送消息----');
      // 记录当天的通话和发消息次数
      const times = getStorageByDay('RC_todayMatchTimes');
      console.log(times, '----当天发消息次数---');
      const countTimes = times + 1;
      setStorageByDay('RC_todayMatchTimes', countTimes);
    },
    cancelPanel (bool) {
      this.$store.commit('setImChatConfig', {
        show: false,
        friendId: 0
      });
      if (bool) {
        this.$store.commit('setImStatus', true);
      }
      if (this.isMobile) {
        this.$router.go(-1);
      }
    },
    setMore () {
      this.showMore = !this.showMore;
    },
    async getAllMsg () {
      // if (!this.friendId) this.jumpBack();
      this.$store.commit('resetDialog');
      const messageList = await getChatList(this.friendId);
      if (messageList && messageList.length > 0) {
        this.$store.commit('saveDialog', messageList);
      }
    },
    /**
     * 将好友的消息标记为已读
     * @param {number} friendId 好友 id
     */
    async setMsgRead (friendId) {
      const userId = this.$store.state.app.userInfo.id;
      if (!friendId || !userId) return;
      const data = {
        receiveUserId: userId,
        sendUserId: friendId,
      };
      setMessageRead(data).then((res) => {
        console.log(res, '------将消息标记已读');
        setFriendMsgRead(friendId);
      });
    },
    // 获取好友信息
    async getOtherUserInfo () {
      // 官方账号
      if (this.friendId < 0) {
        const info = await getFriendInfo(this.friendId);
        if (info && info.headImg && info.friendId) {
          this.friendDetail = {
            id: info.friendId,
            headImg: info.headImg,
            userName: info.userName,
          };
          return;
        }
      }
      // todo 直接在入库时获取好友信息
      const params = {
        searchUserId: this.friendId
      };
      getOtherProfile(params).then(({ code, data }) => {
        if (data) {
          this.friendDetail = data;
          console.log(this.friendDetail, '-----this.friendDetail--111---');
          triggerChatUser(this.friendDetail);
        }
      });
    },
    init () {
      this.getAllMsg();
      this.getOtherUserInfo();
      this.setMsgRead(this.friendId);
      this.$store.commit('setCurDialogId', +this.friendId);
      this.$once('hook:beforeDestroy', () => {
        this.$store.commit('setCurDialogId', '');
        setFriendMsgRead(this.friendId);
      });

      this.getFStatus();
    },
    getFStatus () {
      apiGetGoddessStatus({ userIds: this.friendId }).then(({ code, data }) => {
        if (data && data.length) {
          this.friendStatus = data[0].status;
        }
      });
      this.statusTime = setTimeout(() => {
        this.getFStatus();
      }, 2000);
    },
    // 同意好友请求
    acceptFriend () {
      apiAddFriend({
        addWay: 102,
        friendUserId: this.friendId,
        addReally: true
      }).then(({ code, data }) => {
        if (code === 200) {
          // insertAddFriend(data, 2);
          this.getOtherUserInfo();
        }
      });
    },
    hideUserHandler () {
      this.showMore = false;
    },
    hideReportHandler () {
      this.showReport = false;
    },
    getReportData () {
      this.showMore = false;
      this.showReport = true;
      this.reportVideo = 1;
    },
    getShow () {
      this.showReport = false;
    },
    handlerOutClick () {
      if (this.$refs.dialogBox) {
        this.$refs.dialogBox.showEmoji = false;
        this.$refs.dialogBox.showGift = false;
      }
      this.getShow();
      this.hideUserHandler();
    },
    closeFriend () {
      this.showAddFriend = false;
    }
  },
  async mounted () {
    this.friendId = this.imChatConfig.friendId;
    this.init();
    this.friendDetail.userName = this.imChatConfig.userName;
    this.userName = this.friendDetail.userName;
    this.friendDetail.headImg = this.imChatConfig.headImg;
  },
  beforeDestroy () {
    clearTimeout(this.statusTime);
  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>

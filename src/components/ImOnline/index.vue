<template>
  <div class="im-online im-panel" v-clickoutside:click="cancelPanel">
    <div class="p-wrap flex-col" @click.stop>
      <div class="p-title fx-v">
        <div class="icon-arrow hover" @click.stop="cancelPanel">
        </div>
        <div class="t-txt">
          {{$t('app.online_remind')}}
        </div>
      </div>
      <div class="p-body">
        <div class="friend-list list-wrap common-list">
          <div class="sort-title fx-v">{{$t('app.open_the_number')}}: {{remindNum}}/50</div>
          <div class="ocell fx-be-vc" v-for="(item, index) in onlineList" :key="index">
            <div class="cell-left">
              <div class="avatar-img">
                <div class="avatar-wrap">
                  <fitimg :headImg="item.headImg" type="smailimg"></fitimg>
                </div>
                <span class="online-icon" v-if="item.status === 2"></span>
              </div>
            </div>
            <div class="cell-main">
              <h3 class="name">{{ item.userName }}</h3>
              <p><country :countryId="item.countryId"></country></p>
            </div>
            <div class="cell-right" @click.stop="switchRemind(item)">
              <f-switch :value="item.remindSwitch" :lock="false"></f-switch>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Clickoutside from '@/util/clickoutside.js';
import { mapState } from 'vuex';
import { apiRemindList, apiSwitchRemind } from '@/api/friend';
import { apiGetGoddessStatus } from '@/api/goddess';
import FSwitch from '../FormItem/FSwitch.vue';
import { logReport } from '@/util/logReport';

export default {
  name: 'ImChat',
  data () {
    return {
      page: 1,
      size: 20,
      noMore: false,
      onlineList: [],
      remindNum: 0,
    };
  },
  components: {
    FSwitch
  },
  directives: { Clickoutside },
  watch: {},
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
      userInfo: (state) => state.app.userInfo,
      unReadCount: (state) => state.agora.unReadCount,
      imChatConfig: (state) => state.app.imChatConfig,
    })
  },
  methods: {
    cancelPanel () {
      this.$store.commit('setImOnlineState', false);
    },
    getOnlineList () {
      apiRemindList({
        page: this.page,
        size: this.size
      }).then(({ code, data }) => {
        console.log(data);
        const { pageNo, pages, list } = data.relationFriends;
        if (data.remindNum) {
          this.remindNum = data.remindNum;
        }
        if (pageNo === pages) {
          this.noMore = true;
        }
        if (list && list.length) {
          this.onlineList.push(...list);
          // this.apiGetGoddessStatus(list);
        }
      });
    },
    switchRemind (friendData) {
      apiSwitchRemind({
        friendUserId: friendData.id,
        switchStatus: !friendData.remindSwitch
      }).then(({ code, data }) => {
        friendData.remindSwitch = data.status;
        this.remindNum = data.remindNum;
        logReport({
          eventId: '106-1-5-3',
          target_user_id: friendData.id,
          free_name2: { remind_num: data.status }
        });
      });
    },
    apiGetGoddessStatus (list) {
      const userIds = [];
      list.map(item => {
        userIds.push(item.id);
      });
      apiGetGoddessStatus({ userIds: userIds.join(',') }).then(({ data }) => {
        if (data) {
          data.forEach(item => {
            const length = this.onlineList.length;
            const userId = item.userId;
            for (let i = 0; i < length; i++) {
              if (userId === this.onlineList[i].id) {
                this.$set(this.onlineList[i], 'status', item.status);
                break;
              }
            }
          });
        }
      });
    }
  },
  async mounted () {
    this.getOnlineList();
  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>

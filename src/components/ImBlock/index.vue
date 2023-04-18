<template>
  <div class="im-block im-panel" v-clickoutside:click="cancelPanel">
    <div class="p-wrap flex-col">
      <div class="p-title fx-v">
        <div class="icon-arrow hover" @click="cancelPanel">
        </div>
        <div class="t-txt">
          {{$t('base.blacklist')}}
        </div>
      </div>
      <div class="p-body">
        <div class="friend-list list-wrap common-list">
          <div class="empty-box" v-if="blockList.length===0" >{{ $t('app.blacklist_empty') }}</div>
          <div class="ocell fx-be-vc" v-for="(item, index) in blockList" :key="index"
            @click="showRemovePop(item.id, index)">
            <div class="cell-left">
              <div class="avatar-img">
                <div class="avatar-wrap">
                  <img :src="item.headImg" alt />
                </div>
              </div>
            </div>
            <div class="cell-main">
              <h3 class="name">{{ item.userName }}</h3>
              <p>
                <country :countryId="item.countryId"></country>
              </p>
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
import { apiGetBlockList, apiRemoveBlock } from '@/api/friend';
import { logReport } from '@/util/logReport';

export default {
  name: 'ImChat',
  data () {
    return {
      page: 1,
      size: 20,
      noMore: false,
      blockList: [],
      moveId: 0
    };
  },
  components: {
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
      this.$store.commit('setImBlockState', false);
    },
    getBlockList () {
      apiGetBlockList({
        page: this.page,
        size: this.size
      }).then(({ code, data }) => {
        console.log(data);
        const { pageNo, pages, list } = data;
        if (pageNo === pages) {
          this.noMore = true;
        }
        if (list && list.length) {
          this.blockList.push(...list);
        }
      });
    },
    showRemovePop (id, index) {
      logReport({
        eventId: '106-1-8-4',
        target_user_id: id
      });
      this.moveId = id;
      this.$message({
        noCancelBtn: false,
        desc: {
          title: this.$t('base.blacklist'),
          txt: this.$t('base.recover')
        }
      }).then(res => {
        console.log('yes');

        apiRemoveBlock({
          friendUserId: id,
        }).then(({ code, data }) => {
          this.blockList.splice(index, 1);
          logReport({
            eventId: '106-1-8-5',
            target_user_id: id
          });
        });
      });
    }

  },
  async mounted () {
    this.getBlockList();
  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>

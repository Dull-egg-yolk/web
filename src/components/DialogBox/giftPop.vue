<template>
  <div class="gift-list" v-clickoutside:click="cancel">
    <div class="gift-tab-box" v-if="backpackConf.backpackGiftEntrance">
      <span v-for="item in tabList" :class="{active: item.id === activeTab}" :key="item.id" @click.stop="changeTab(item)"> {{item.name}}</span>
      <div class="header-close hover fx-c" @click.stop="cancel">
        <span class="icon-cross"></span>
      </div>
    </div>
    <div class="gift-wrap">
      <div class="empty-list" v-if="(currGiftList.length===0)">
        <p>{{$t('webChat.backpack.no_gifts')}}</p>
      </div>
      <div class="ogift" v-for="(item,index) in currGiftList" :key="index" @click.stop="sendGift(item)">
        <template v-if="(activeTab === 1)">
          <div class="img">
            <img :src="item.giftImage" alt="">
          </div>
          <div class="coin">
            {{item.gold}}
          </div>
        </template>
        <template v-else>
          <div class="img">
            <img :src="item.icon" alt="">
          </div>
          <div class="time">
            <ExpireTime :expireTime="item.expireTime"/>
          </div>
          <div class="goods-count">x{{item.goodsCount}}</div>
        </template>
      </div>
    </div>
    <div class="coins-enter fx-be-vc" @click.stop>
      <div class="btn-coin hover" @click="jumpToCoin">
        <div class="coin-wrap fx-c">
          {{userInfo.goldNum}}
        </div>
      </div>
      <div class="tips fx-c hover" @click="jumpToCoin">
        {{$t('app.buy_now')}}
        <span class="icon-arrow"></span>
      </div>
    </div>
  </div>
</template>

<script>
import Clickoutside from '@/util/clickoutside.js';
import { mapState } from 'vuex';
import agoraMixin from '@/mixin/agoraMixin';
import { logReport } from '@/util/logReport';
import ExpireTime from './expireTime';
import { getBackpackGiftList } from '@/api/backpack.js';

export default {
  name: 'giftPop',
  components: { ExpireTime },
  data () {
    return {
      giftListData: [],
      backpackGiftList: [],
      activeTab: 1,
      tabList: [
        { id: 0, name: this.$t('webChat.backpack.beibaoTab1') },
        { id: 1, name: this.$t('webChat.backpack.beibaoPopular') },
      ],
    };
  },
  props: ['show'],
  directives: { Clickoutside },
  mixins: [agoraMixin],
  computed: {
    ...mapState({
      giftList: (state) => state.app.giftList,
      userInfo: (state) => state.app.userInfo,
      imChatConfig: (state) => state.app.imChatConfig,
      showVideoPop: (state) => state.app.showVideoPop,
      backpackConf: (state) => state.app.backpackConf,
    }),
    currGiftList () {
      return this.activeTab === 0 ? this.backpackGiftList : this.giftListData;
    }
  },
  methods: {
    sendGift (gift) {
      const giftId = gift.id || gift.giftId;
      if (this.activeTab === 0) {
        logReport({
          eventId: '106-1-14-2', // 背包礼物点击
          target_user_id: this.imChatConfig.friendId,
          r_resource: this.showVideoPop ? 1 : 2,
          giftId: giftId,
          expireTime: gift.expireTime
        });
      }
      this.$emit('sendGift', giftId);
      this.$emit('update:show', false);
    },
    cancel () {
      this.$emit('update:show', false);
    },
    getGiftData () {
      const list = Object.values(this.giftList);
      if (list.length) {
        list.sort((a, b) => a.friendGiftSort - b.friendGiftSort);
        this.giftListData = list;
        return;
      }
      this.getGiftListData().then(() => {
        const list = Object.values(this.giftList);
        list.sort((a, b) => a.friendGiftSort - b.friendGiftSort);
        this.giftListData = list;
      });
    },
    jumpToCoin () {
      if (this.showVideoPop) {
        this.$parent.$parent.$parent.setChargeShow();
      } else {
        this.$router.push({ name: 'CoinPage' });
      }
      logReport({
        eventId: '106-1-3-15',
        target_user_id: this.imChatConfig.friendId
      });
    },
    changeTab (item) {
      logReport({
        eventId: '106-1-14-1', // tab点击
        target_user_id: this.imChatConfig.friendId,
        r_resource: this.showVideoPop ? 1 : 2,
        tab: item.id === 0 ? 'backpack' : 'popular'
      });
      this.activeTab = item.id;
      if (item.id === 0) {
        this.getBackpackGift();
      }
    },
    getBackpackGift () {
      getBackpackGiftList().then(res => {
        console.log(res, '----------背包礼物------');
        this.backpackGiftList = res.data || [];
      });
    },
  },
  mounted () {
    logReport({
      eventId: '106-1-14-0', // 礼物面板曝光
      target_user_id: this.imChatConfig.friendId,
      r_resource: this.showVideoPop ? 1 : 2,
    });
    this.getGiftData();
  }

};

</script>

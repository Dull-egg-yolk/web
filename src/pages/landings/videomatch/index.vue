<template>
   <div class="match-page">
    <!-- cancel -->
    <div class="my-video-bg" id="mv-bg">
    </div>
    <div class="mc-box flex-col-vc">
      <div class="the-cards fx-c" :class="{play: aniPlay}" >
        <div class="the-video"  v-show="!aniPlay && hostData && hostData.id">
          <div class="status" v-show="!vload">Live</div>
          <div class="load-cover" v-show="vload"></div>
          <video :src="hostData.videoUrl" autoplay webkit-playsinline="true" muted playsinline="true" ref="swvideoPlayer"></video>
        </div>
        <div class="ocard" :class="{
          cur: index === curHostIdx,
          prev: index === curHostIdx-1,
          next: index === curHostIdx+1,
        }" v-for="(item,index) in hostList" :key="item.id + '' + index">
          <div class="the-img" v-if="index >= curHostIdx-1 && index <= curHostIdx + 2">
            <img :src="item.headImg" alt="">
          </div>
        </div>
      </div>
      <div class="host-detail-box">
        <div class="the-detail flex-col-c" v-if="hostList.length">
          <div class="the-name">{{ hostData.name }}, {{ hostData.birthday | calculateAge }}</div>
          <div class="the-info fx-c">
            <span class="oi">
              <country :countryId="hostData.countryId" type="all"></country>
            </span>
            <span class="oi">
              <span>
                {{ $t('base.female') }}
              </span>
            </span>
          </div>
          <div class="the-tags" v-if="hostData.interestLabels.length">
            <div class="h-tag min " v-for="(item, index) in hostData.interestLabels" :key="index">{{ $t(`interest.${item}`) }}</div>
          </div>
        </div>
      </div>

      <div class="the-actions flex-col-c" v-if="!matchCallStatus">
        <button class="m-btn white call" v-preventReClick @click="goToPlay">
          <span class="ico icon-video2"></span>
          <span>{{ $t('webChat.gotoPlay') }}</span>
        </button>
        <div class="m-btn white next" @click="nextCardAct">
          {{ $t('base.next') }}
        </div>
      </div>
      <div class="the-connect" v-else>
        {{ $t('base.connecting') }}...
      </div>
    </div>
  </div>

</template>

<script>
import { mapState } from 'vuex';
import agoraMixin from '@/mixin/agoraMixin';
import { apiAutoAddFriend, apiGetLivcamHost } from '@/api/livcam';
import { logReport } from '@/util/logReport';
import { calculateAge } from '@/filters';
import mokeHost from './host';
import { getCountry } from '@/util/getCountry';

const coin = require('@/assets/img/icon-coin.png');

export default {
  name: 'matchBox',
  data () {
    return {
      hostList: [],
      reMatchTimer: null,
      nextTimer: null,
      callTimer: null,
      curHostIdx: 1,
      aniPlay: false,
      loading: false,
      vload: true,
      calling: false,
      swipeCard: false,
    };
  },
  mixins: [agoraMixin],
  filters: {
    calculateAge,
  },
  watch: {
    matchCallStatus (n) {
      if (n) {
        this.callTimer = setTimeout(() => {
          this.cancelCall();
          this.nextCard();
        }, 10 * 1000);
      } else {
        clearTimeout(this.callTimer);
      }
    },
    showVideoPop (n, v) {
      if (n) {
        clearTimeout(this.callTimer);
        this.$refs.swvideoPlayer && this.$refs.swvideoPlayer.pause();
      } else {
        this.$refs.swvideoPlayer && this.$refs.swvideoPlayer.play();
      }
    },
    hostData (n) {
      console.log('host');
    }
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
      isMobile: (state) => state.app.isMobile,
      userInfo: (state) => state.app.userInfo,
      matchCallStatus: (state) => state.agora.matchCallStatus,
      showVideoPop: (state) => state.app.showVideoPop,
    }),
    hostData () {
      if (!this.hostList.length) {
        return {};
      }
      return this.hostList[this.curHostIdx];
    }
  },
  methods: {
    goToPlay () {
      logReport({
        eventId: '106-6-1-1',
        free_name2: Object.assign({
          from: 'gomeet-videomatch'
        }, window.$mObj.adData || {}),
      });

      window.$mObj.adData.lpName = 'gomeet-videomatch';
      localStorage.setItem('lpName', 'gomeet-videomatch');
      this.$router.push({ name: 'LivCam' });

      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
      localStorage.setItem('LANDINGSPAGE', true);
    },
    getMatchHost () {
      // this.hostData = {};

      if (!this.hostList.length) {
        this.hostList.push(...mokeHost);
        this.hostData = mokeHost[this.curHostIdx];
        console.log(this.hostData, '777777');
      }
      // this.hostList.push(...this.hostList, ...mokeHost);
    },
    nextCardAct () {
      this.nextCard();
    },

    nextCard () {
      if (this.loading) return;
      if (this.curHostIdx === this.hostList.length - 1) {
        clearTimeout(this.nextTimer);
        this.getMatchHost();
        return;
      };

      this.swipeCard = true;
      clearTimeout(this.nextTimer);
      this.cancelCall();
      this.aniPlay = true;
      console.log(this.hostList.length, this.curHostIdx, '999999999');
      if (this.hostList.length - this.curHostIdx === 2) {
        // this.getMatchHost();
        // this.curHostIdx = 0;
        this.goToPlay();
      }
      this.vload = true;

      setTimeout(() => {
        this.curHostIdx += 1;
        this.aniPlay = false;
        this.swipeCard = false;
      }, 200);
    },
    tocall () {
      if (this.swipeCard) return;
      clearTimeout(this.nextTimer);
      this.callAction(this.hostData, window.$mObj.matchConf.mainPageCallLocation);
    },
    vcanplay (e) {
      this.vload = false;
      console.log('canplay ddd');
    },
    vended () {
      if (this.matchCallStatus) return;
      this.nextCard();
      console.log('ended ddd');
    },
    vplay () {
      this.vload = false;
      this.nextTimer = setTimeout(() => {
        this.nextCard();
      }, 5000);
      console.log('play ddd');
    },
    videoEvent () {
      this.$refs.swvideoPlayer.addEventListener('canplay', this.vcanplay);
      this.$refs.swvideoPlayer.addEventListener('play', this.vplay);
      this.$refs.swvideoPlayer.addEventListener('ended', this.vended);
    },
    removeEvent () {
      if (!this.$refs.swvideoPlayer) return;
      this.$refs.swvideoPlayer.removeEventListener('canplay', this.vcanplay);
      this.$refs.swvideoPlayer.removeEventListener('play', this.vplay);
      this.$refs.swvideoPlayer.removeEventListener('ended', this.vended);
    },

    cancelCall () {
      if (this.matchCallStatus) {
        this.$store.commit('matchCallStatus', 0);
        this.$parent.$parent.$refs.inviteCall.cancel();
      }
    },
  },
  mounted () {
    this.getMatchHost();
    getCountry('videomatch');
    this.hostData = this.hostList[this.curHostIdx];
    console.log('000000', ...this.hostList);
    setTimeout(() => {
      console.log(this.$refs.swvideoPlayer, 'videoabc');
      this.videoEvent();
    }, 100);
  },
  beforeDestroy () {
    clearTimeout(this.nextTimer);
    clearTimeout(this.reMatchTimer);
    clearTimeout(this.callTimer);

    this.removeEvent();
  }
};
</script>
<style lang='less' scoped>
@import url("./index.less");
</style>

<template>
  <div class="coin-page" @click.stop="() => {}" ref="coinPage">
    <!-- mobile 给移动端的页面title -->
    <div class="mb-title flex-row-vc"  v-if="!isShowNewShop">
      <div class="actions l fx-c">
        <span class="icon-arrow" @click.stop="closeBtn"></span>
      </div>
      <div class="title l fx-v">{{$t('webChat.coinShop')}}</div>
      <div class="actions r fx-c check-in-box"  v-if="!isIframe">
        <div class="check-in-btn" @click.stop="showCheckIn" v-if="checkInConf.show">
          <img src="@/assets/img/check-in-icon.png" alt="">
        </div>
      </div>
      <!-- 金币 -->
      <div class="side-coin hover">
        <div class="coin-wrap fx-be-vc">
          <strong>{{ userInfo.goldNum }}</strong>
        </div>
      </div>
    </div>
    <div :class="['mb-title','flex-row-vc','new-shop']"  v-if="isShowNewShop" >
      <div class="actions l fx-c"  v-if="!isIframe">
        <span class="icon-arrow" @click.stop="closeBtn"></span>
      </div>
      <div class="title l fx-v">
        <!-- 金币 -->
      <div class="side-coin hover">
        <div class="coin-wrap fx-be-vc">
          <strong>{{ userInfo.goldNum }}</strong>
        </div>
      </div>
      </div>
      <div class="actions r fx-c check-in-box" v-if="!isIframe">
        <div class="check-in-btn" @click.stop="showCheckIn" v-if="checkInConf.show">
          <img src="@/assets/img/check-in-icon.png" alt="">
        </div>
      </div>
    </div>

    <!-- PC签到 -->
    <div class="signin" v-if="checkInConf.show && !isIframe">
      <div class="check-in-btn" @click.stop="showCheckIn">
          <img src="@/assets/img/check-in-icon.png" alt="">
      </div>
    </div>
    <div class="header-close hover fx-c" @click.stop="closeBtn">
        <span class="icon-cross"></span>
    </div>
    <div :class="['inner', isShowNewShop ? 'new-shop-inner': '']" >
      <shop-new v-if="isShowNewShop" @changeIsSroll="changeIsSroll" :startTime="startTime"></shop-new>
       <shop v-else @changeIsSroll="changeIsSroll" :startTime="startTime"></shop>
    </div>
    <!-- privacy 提示 -->
    <CheckIn v-if="!isIframe"></CheckIn>
    <div :class="['checkin-tips', isShowNewShop ? 'new-shop':'']" v-if="showCheckInTips && $route.name==='CoinPage' && !isIframe">
      <div class="tips-info-vip" v-if="checkInConf.type==='vip'" @click="showCheckIn('tips')" >
        <div class="tips-info-txt">
          <p v-if="payStatus" v-html="$t('webChat.checkIn.tipsVip', {num: checkInConf.totalCoin})"></p>
          <p v-else v-html="$t('webChat.checkIn.tipsFree', {num: checkInConf.totalCoin})"></p>
        </div>
      </div>
      <div class="tips-info" v-else @click="showCheckIn('tips')" >
        <div class="tips-info-txt">
          <p v-html="$t('webChat.checkIn.tips2', {num: checkInConf.totalCoin})"></p>
        </div>
        <div class="tips-info-btn"><span>{{ $t('webChat.checkIn.checkIn') }}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getUserInfoData, apiGetUserPayStatus } from '@/api/user';
import { setBodyScroll } from '@/util/index';
import CheckIn from '@/components/CheckIn';
// import CheckInVip from '@/components/CheckInVip';
import Shop from '@/components/Shop';
import ShopNew from '@/components/Shop/shop.vue';
import { logReport } from '@/util/logReport';
import { isGoNewShopCountry } from '@/util/shop';
import { getPlatformType } from '@/util/browser';

export default {
  name: 'CoinPage',
  components: { CheckIn, Shop, ShopNew },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
      checkInConf: (state) => state.app.checkInConf,
      showCountry: (state) => state.app.showCountry,
      isShowCheckInTips2: (state) => state.app.isShowCheckInTips2,
      userInfo: (state) => state.app.userInfo,
      payStatus: (state) => state.app.userInfo.payStatus,
    }),
    showCheckInTips () {
      return this.checkInConf.show && !this.checkInConf.hasCheck && this.isShowCheckInTips2;
    }
  },
  created () {
    this.startTime = (new Date()).getTime();
  },
  data () {
    return {
      rlen: 0,
      isShowCountry: false,
      isStroll: false,
      isIframe: this.$route.query.isIframe,
      isShowNewShop: isGoNewShopCountry() && getPlatformType() === 'mobile'
    };
  },
  watch: {
    'checkInConf.show': {
      handler (val) {
        if (val) {
          logReport({
            eventId: '14-2-1-15', // 新用户签到入口曝光
            freeName2: window.$mObj.adData || {},
            checkinType: this.checkInConf.type
          });
        }
      },
      immediate: true,
    },
    showCheckInTips: {
      handler (val) {
        if (val) {
          this.isStroll = false;
          this.isShowCountry = false;
          logReport({
            eventId: '106-1-1-62', // 新用户签到入口提示曝光
            freeName2: window.$mObj.adData || {},
            r_resource: 'CoinPage',
            checkinType: this.checkInConf.type
          });
        } else {
          this.isStroll = true;
          this.isShowCountry = true;
          this.getUserPayStatus();
        }
      },
      immediate: true,
    },
  },
  methods: {
    getUserPayStatus () {
      apiGetUserPayStatus().then(({ code, data }) => {
        setTimeout(() => {
          this.$store.commit('setCountry', !data);
          if (data === false) {
            logReport({
              eventId: '14-2-1-20', // 国家切换提示
            });
          }
        }, 1000);
        this.timer = setTimeout(() => {
          this.$store.commit('setCountry', false);
          this.isStroll = false;
        }, 15000);
        if (data) {
          this.isStroll = false;
        }
      }).catch(err => {
        console.log(err);
      });
    },
    changeIsSroll () {
      this.isStroll = false;
    },
    updateCoin () {
      getUserInfoData().then(({ code, data }) => {
        if (typeof data.goldNum === 'number') {
          this.$store.commit('updateCoin', data.goldNum);
          this.$store.commit('updateUserInfo', data);
        }
      });
    },
    closeBtn () {
      this.$router.go(-1);
    },
    showCheckIn (type) {
      if (type === 'tips') {
        logReport({
          eventId: '106-1-1-63', // 新用户签到入口提示点击
          freeName2: window.$mObj.adData || {},
          r_resource: 'CoinPage',
          checkinType: this.checkInConf.type
        });
      } else {
        logReport({
          eventId: '14-2-1-16', // 新用户签到入口点击
          freeName2: window.$mObj.adData || {},
          checkinType: this.checkInConf.type
        });
      }
      this.$store.commit('setCheckInTips2', false);
      if (this.checkInConf.type === 'vip') {
        this.$store.commit('setVipCheckIn', true);
      } else {
        this.$store.commit('setCheckIn', true);
      }
    },
  },
  async mounted () {
    this.rlen = history.length;
    const self = this;
    if (this.isLogin) {
      if (this.$parent.$parent.resetTime) {
        this.$store.commit('setCheckInTips2', true);
        this.$parent.$parent.cutDownTime();
      }
    }
    window.fbq('track', 'AddToCart');
    window.gtag && window.gtag('event', 'GoMeetPayPageview', {
      send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'],
      media_source: localStorage.getItem('mediasource'),
      campaign_id: localStorage.getItem('campaignid'),
      adgroup_id: localStorage.getItem('adgroupid'),
      keyword: localStorage.getItem('keyword'),
      creative: localStorage.getItem('creative'),
      loc_physical_ms: localStorage.getItem('loc_physical_ms'),
      device: localStorage.getItem('device'),
      type: localStorage.getItem('type')
    });
    logReport({ // 页面加载时长
      eventId: '14-2-1-14',
      freeName2: { durationTime: new Date().getTime() - this.startTime }
    });
    let timer;
    this.scrollHandler = (event) => {
      const scrollTop = event.target.scrollTop;
      if (scrollTop > 0) {
        self.$store.commit('setCountry', false);
        if (self.timer) {
          clearTimeout(self.timer);
        }
      } else {
        if (self.isStroll) {
          if (self.timer) {
            clearTimeout(self.timer);
          }
          self.$store.commit('setCountry', true);
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(() => {
            if (self.showCountry) {
              self.isStroll = false;
            }
            self.$store.commit('setCountry', false);
          }, 15000);
        }
      }
    };
    setBodyScroll(true);
    this.$refs.coinPage.addEventListener('scroll', this.scrollHandler);
    localStorage.removeItem('rlen');
  },
  beforeDestroy () {
    setBodyScroll(false);
    this.$refs.coinPage.removeEventListener('scroll', this.scrollHandler);
  },
};
</script>

<style lang="less" scoped>
@import url("./index.less");
.mb-title {
  &.new-shop {
  background: #fff;
  .icon-arrow{
    color:#000;
  }
  .check-in-box {
    margin-right: 150px;
  }
  .title{
    color: #000;
    .side-coin {
      position: static;
      background: #F6F6F6;
      .coin-wrap{
        strong {
          color: #000;
        }
      }
    }
  }
}
}
</style>

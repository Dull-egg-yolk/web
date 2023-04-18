<template>
  <base-pop class="pop-public pop-input pop-banner1" :outClickCancel="false" :showPop="showBannerPop"
    @cancelPop="closePop">
    <div class="pop-box__banner">
      <p class="pop-banner-img"><img :src="hasRegisterBannerPop.img1" alt=""></p>
      <p class="pop-banner-txt">
        {{ $t('webChat.popBannerFreeCoin', { num: '' }) }}
      </p>
      <p class="pop-box__btn" @click="closePop('get')">
        {{ $t('webChat.bannerBtn') }}
      </p>
      <div class="pop-banner-close fx-c" @click="closePop"><span class="icon-cross"></span></div>
    </div>
  </base-pop>
</template>

<script>
import { mapState } from 'vuex';
import BasePop from '../BasePop.vue';
import { logReport } from '@/util/logReport';

export default {
  name: 'PopBanner',
  data () {
    return {};
  },
  props: {},
  components: {
    BasePop,
  },
  computed: {
    ...mapState({
      showBannerPop: (state) => state.app.hasRegisterBannerPop.status,
      hasRegisterBannerPop: (state) => state.app.hasRegisterBannerPop,
    }),
  },
  watch: {
    showBannerPop (val) {
      if (val) {
        logReport({
          eventId: '106-1-1-42',
          freeName2: window.$mObj.adData || {},
          banner_name: 'registerCoins'
        }); // 登录用户送金币popup曝光
      }
    }
  },
  methods: {
    closePop (type) {
      this.$toast({
        html: this.$t('webChat.popBannerFreeCoin', { num: 120 }),
      });
      if (type === 'get') {
        logReport({
          eventId: '106-1-1-43',
          freeName2: window.$mObj.adData || {},
          banner_name: 'registerCoins'
        }); // 登录用户送金币popup领取点击
      } else {
        logReport({
          eventId: '106-1-1-44',
          freeName2: window.$mObj.adData || {},
          banner_name: 'registerCoins'
        }); // 登录用户送金币popup关闭点击
      }
      const data = {
        status: false
      };
      this.$store.commit('setBannerPop', data);
    },
  },
  mounted () { },
};
</script>

<style lang="less" scoped>
@import url('~@/style/var.less');

.pop-box__banner {
  position: relative;
  width: 431px;
  height: 681px;
  box-sizing: border-box;

  .pop-banner-img {
    text-align: center;
    img {
      width: 100%;
      height: auto;
    }
  }
  .pop-banner-close {
    position: absolute;
    right: -9px;
    top: 28px;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: rgba(14,20,28,0.8);
    z-index: 9;
  }
}
</style>

<style lang="less">
.pop-banner1 {
  .pop-content {
    width: 431px !important;
    height: 681px !important;
    background: #0000 !important;
  }

  .pop-banner-txt {
    cursor: pointer;
    margin-top: -18px;
    font-size: 20px;
    font-weight: 600;
    font-family: PingFangSC-Semibold, PingFang SC;
    text-align: center;
    line-height: 28px;
    padding: 0 70px;
  }

  .pop-box__btn {
    cursor: pointer;
    width: 266px;
    height: 60px;
    background: linear-gradient(90deg, #F99E47 0%, #FF3463 100%);
    border-radius: 30px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    line-height: 60px;
    margin: 25px auto 0;
  }

  .arrow-right {
    display: inline-block;
    transform: scaleX(-1);
    font-size: 24px;
  }
}

@media screen and (max-width: 680px) {
  .pop-banner1 {
      background: #17161FCC !important;
    .pop-content {
      width: 85% !important;
      height: auto !important;
      background: #0000 !important;
    }

    .pop-box__banner {
      width: 100%;
      height: auto;

      .pop-banner-close {
        width: 41px;
        height: 41px;
      }

    }
    .pop-banner-img {
      text-align: center;
      img {
        width: 100%;
        height: auto;
      }
    }

    .pop-banner-txt {
      font-size: 18px;
      line-height: 25px;
      padding: 0 25px;
      width: 80%;
    }

    .pop-box__btn {
      width: 80%;
      padding: 0 25px;
      height: 54px;
      border-radius: 27px;
      font-size: 18px;
      line-height: 54px;
      margin: 15px auto 0;
      box-sizing: border-box;
    }

    .arrow-right {
      font-size: 14px;
    }
  }
}

[lang="ar"],
[lang="he"],
[lang="ur"] {
  .pop-banner1 {
    .arrow-right {
      font-size: 14px;
      padding: 0;
      transform: rotate(0deg);
    }
  }
}
</style>

<template>
  <transition name="slideUp">
    <div class="pop-random" v-if="showSetting" v-clickoutside:click="cancelPop">
      <!-- <div class="icon-cross fx-c" @click="cancelPop"></div> -->
      <div class="pop-content">
        <ul class="common-list">
          <li class="ocell fx-v" @click.stop="jumpUrl(4)">{{$t('webChat.aboutUs')}}</li>
          <li class="ocell fx-v" @click="contactUs"><a class="href-blank" href="https://support.gomeet.today/" target="_blank">{{$t('app.contact_us')}}</a></li>
          <li class="ocell fx-v" @click.stop="jumpUrl(5)">{{$t('webChat.communityGuidelines')}}</li>
          <li class="ocell fx-v" @click.stop="jumpUrl(1)">{{$t('app.terms_of_service')}}</li>
          <li class="ocell fx-v" @click.stop="jumpUrl(2)">{{$t('app.privacy_policy')}}</li>
          <li class="ocell fx-v" @click.stop="randomSeo"><a class="href-blank" href="https://gomeet.today/random-video-chat.html" target="_blank">{{$t('base.random')}}</a></li>
          <li class="line" v-if="isMobile"></li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
import Clickoutside from '@/util/clickoutside.js';
import { logReport } from '@/util/logReport';
import { mapState } from 'vuex';
export default {
  name: 'PopRandom',
  data () {
    return {
      show: true,
    };
  },
  directives: { Clickoutside },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
      isMobile: (state) => state.app.isMobile,
      showSetting: (state) => state.app.showSetting,
    }),
  },
  watch: {},
  methods: {
    contactUs () {
      logReport({
        eventId: '106-1-8-9'
      });
      this.cancelPop();
    },
    randomSeo () {
      logReport({
        eventId: '106-1-1-6'
      });
      this.cancelPop();
    },
    jumpUrl (type) {
      this.cancelPop();
      this.menuLogHandler(type);
      const urls = {
        1: '/terms-of-use',
        2: '/privacy-policy',
        3: '/random-video-chat',
        4: '/about-us',
        5: '/community-guidelines'
      };
      const routeUrl = this.$router.resolve({
        path: urls[type],
      });
      window.open(routeUrl.href, '_blank');
    },
    about () {
      const routeUrl = this.$router.resolve({
        path: '/LivCam-about-us',
      });
      window.open(routeUrl.href, '_blank');
      this.menuLogHandler('about');
    },
    showBlockList () {
      this.cancelPop();
      this.$store.commit('setImBlockState', true);
      this.menuLogHandler('block');
    },
    cancelPop () {
      console.log(1111);
      // this.$emit('cancelSetup');
      this.$store.commit('setSettingPop', false);
    },
    menuLogHandler (type) {
      const eventId = {
        1: '106-1-8-1',
        2: '106-1-8-2',
        3: '106-1-1-6',
        block: '106-1-8-3',
        del: '106-1-8-6',
        download: '106-1-8-7',
        4: '106-1-8-8'
      }[type];

      logReport({
        eventId
      });
    },
  },
  mounted () {
  },
};
</script>

<style lang="less" scoped>
.pop-random {
  position: fixed;
  // padding: 0 0px 40px 0px;
  box-sizing: border-box;
  z-index: 99;
  left: 0;
  bottom: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  // justify-content: center;
  background: rgba(23,22,31);

  .pop-content {
    backdrop-filter: blur(5px);
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    padding: 12px 12px 12px 40px;
    font-size:14px;
    color:#fff;
    .big {
      font-size: 20px;
      font-weight: 700;
    }
    a {
      cursor: pointer;
    }
    p {
      margin-right: 20px;
    }
    .m-btn{
      margin-left: 20px;
    }
    .m-btn.mini {
      white-space: nowrap;
    }
  }
}
@media screen and(max-width: 680px) {
  .pop-random {
    padding: 0;
    z-index: 101;
    bottom:0;
    border-radius: 20px 20px 0 0;
    .pop-content {
      flex-direction: column;
      text-align: center;
      padding: 12px 12px 20px;
      border-radius: 14px 14px 0 0;
      font-size:12px;
      .common-list {
        .ocell {
          cursor: pointer;
          height: 50px;
          transition: all 0.3s;
          padding: 0 20px;
          box-sizing: border-box;
          font-size: 14px;
          a {
            color: #fff;
            font-size: 14px;
            text-decoration:none
          }
        }
      }
      .big{
        padding-bottom:10px;
        font-size:16px;
      }
      p {
        padding: 10px 20px 25px;
        font-size: 14px;
      }
      .m-btn {
        width: 100%;
        margin: 15px 0 0;
        font-size: 15px;
        height: 46px;
      }
    }
  }
}
</style>

<template>
  <div class="pop-setting">
    <div class="pop-content">
        <div class="title fx-be-vc" v-if="isMobile">
          <div class="txt">
            {{$t('base.setting')}}
          </div>
          <div class="icon-cross fx-c" @click="cancelPop"></div>
        </div>
        <ul class="common-list">
          <li class="ocell fx-v" @click.stop="jumpUrl(4)">{{$t('webChat.aboutUs')}}</li>
          <li class="ocell fx-v" @click="contactUs"><a href="https://support.gomeet.today/" target="_blank" style="color: #BEBCDF;font-size: 14px;text-decoration:none;">{{$t('app.contact_us')}}</a></li>
          <li class="ocell fx-v" @click.stop="jumpUrl(5)">{{$t('webChat.communityGuidelines')}}</li>
          <li class="ocell fx-v" @click.stop="jumpUrl(1)">{{$t('app.terms_of_service')}}</li>
          <li class="ocell fx-v" @click.stop="jumpUrl(2)">{{$t('app.privacy_policy')}}</li>
          <li class="ocell fx-v" @click.stop="randomSeo"><a href="https://gomeet.today/random-video-chat.html" target="_blank" style="color: #BEBCDF;font-size: 14px;text-decoration:none;">{{$t('base.random')}}</a></li>
          <li class="line" v-if="isMobile"></li>
        </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Cookies from 'js-cookie';
import { userLogout } from '@/api/user';
import { clearAllCookie } from '@/util';
import { logReport } from '@/util/logReport';
export default {
  name: 'PopSet',
  data () {
    return {
      show: false
    };
  },
  computed: {
    ...mapState({
      isMobile: (state) => state.app.isMobile,
    })
  },
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
    delAccount () {
      this.$message({
        desc: {
          title: this.$t('app.delete_account'),
          txt: this.$t('webChat.deleteDesc')
        }
      });
      this.menuLogHandler('del');
    },
    download () {
      // 点击下载按钮
      this.menuLogHandler('download');
      this.cancelPop();
      if (!this.isMobile) {
        this.$router.push({ name: 'downLoad' });
      } else {
        this.$emit('showDown', true);
      }
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
    logout () {
      userLogout().then(res => {
        logReport({
          eventId: '106-3-3-1'
        });
        clearAllCookie();
        this.$store.commit('setIsLogin', false);
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      });
    },
    cancelPop () {
      this.$emit('cancelSetup');
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
    const hadAcceptCookie = Cookies.get('acceptCookie');
    if (!hadAcceptCookie) {
      setTimeout(() => {
        this.show = true;
      }, 1200);
    }
  },
};
</script>

<style lang="less" scoped>
.pop-setting {
  position: absolute;
  bottom: 20px;
  right: 100px;

  .pop-content {
    background: #17161F;
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.5000);
    border-radius: 12px;
    padding: 15px 0;
  }

  li {
    min-width: 260px;
    white-space: nowrap;
    height: 40px;
    color: #BEBCDF;
    font-size: 14px;
    &.line{
      height:1px;
      border-bottom:solid 1px rgba(255,255,255,.05);
      margin: 10px 0;
    }
  }
}

@media screen and(max-width: 680px) {
  .pop-setting{
    width:272px;
    height:100%;
    bottom: auto;
    top:0;
    right:0;
    z-index:122;
    .pop-content{
      color:#ABB6C5;
      height:100%;
      box-sizing: border-box;
      padding:20px;
      .title{
        height:50px;
        margin-bottom:10px;
        .txt{
          font-size:20px;
          font-weight:600;
        }
        .icon-cross{
          width:35px;
          height:35px;
          font-size:14px;
          background:#000;
          border-radius: 50%;
          margin-top: -5px;
        }
      }
      .common-list{
        li{
          width:100%;
          min-width: auto;
          padding:0;
          color:#ABB6C5;
          a {
            color: #abb6c5 !important;;
          }
          &.logout{
            color:#FF5A5A
          }

        }
      }
    }
  }
}
</style>

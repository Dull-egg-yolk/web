<template>
  <div class="pop-18 flex-col-vc" v-if="show">
    <div class="inner">
      <div class="logo"></div>
      <div class="slogn">
        {{$t('webChat.welcomeTxt')}}
      </div>

      <div class="txt" v-html="$t('webChat.pop18Txt')"></div>
      <div class="txt txt2">{{$t('webChat.pop18Txt2')}}</div>
      <div class="actions">
        <div class="btn fx-c hover" @click="enterAct">{{$t('webChat.pop18Enter')}}</div>
        <div class="leave hover" @click="toLogin">{{$t('webChat.pop18Login')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Cookies from 'js-cookie';
import { logReport } from '@/util/logReport';
import { setBodyScroll } from '@/util';
import { apiPop18Confirm } from '@/api/user';
import { getPlatformType } from '@/util/browser';

export default {
  name: 'Pop18',
  data () {
    return {
      show: false,
    };
  },

  props: {},
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
      networkData: (state) => state.app.networkData,
      showLoginPop: (state) => state.app.showLoginPop
    })
  },
  watch: {
    isLogin (n) {
      if (n) {
        Cookies.set('RC_POP_18', 1, { expires: 365 });
      }
    },
    showLoginPop (n) {
      if (!n) {
        this.checkShow();
      }
    }
  },
  methods: {
    getAdParams () {
      if (localStorage.getItem('mediasource')) {
        return {
          media_source: localStorage.getItem('mediasource'),
          campaign_id: localStorage.getItem('campaignid'),
          adgroup_id: localStorage.getItem('adgroupid'),
          keyword: localStorage.getItem('keyword'),
          creative: localStorage.getItem('creative'),
          loc_physical_ms: localStorage.getItem('loc_physical_ms'),
          device: localStorage.getItem('device'),
          type: localStorage.getItem('type'),
        };
      }
      if (localStorage.getItem('utmsource')) {
        return {
          utmsource: localStorage.getItem('utmsource'),
          utmcampaign: localStorage.getItem('utmcampaign'),
          utmterm: localStorage.getItem('utmterm'),
          campaign_id: localStorage.getItem('campaignid'),
          utmcontent: localStorage.getItem('utmcontent'),
          bannerid: localStorage.getItem('bannerid'),
        };
      }
      return {};
    },
    cancel () {
      this.show = false;
      setBodyScroll(false);
    },
    enterAct () {
      Cookies.set('RC_POP_18', 1, { expires: 365 });
      this.cancel();
      const { ip, id } = this.networkData;
      apiPop18Confirm({
        ip,
        countryId: id,
        deviceType: getPlatformType() === 'pc' ? 2 : 1,
        createTime: Date.now(),
      });
      logReport({
        eventId: '106-1-1-35',
        free_name2: this.getAdParams(),
        free_name1: JSON.stringify({
          adUrl: window.location.search || ''
        })
      });
    },
    toLogin () {
      this.cancel();
      this.$store.commit('setShowLoginPop', true);
      window.gtag && window.gtag('event', 'goMeetShowLoginPop', { send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'] });
      window.fbq('trackCustom', 'GomeetShowLoginPop');
      logReport({
        eventId: '106-1-1-36',
        free_name2: this.getAdParams(),
        free_name1: JSON.stringify({
          adUrl: window.location.search || ''
        })
      });
    },
    checkShow () {
      console.log(localStorage.getItem('mediasource'), 'ad');
      if (!this.isLogin && !Cookies.get('RC_POP_18')) {
        this.show = true;
        logReport({
          eventId: '106-1-1-34',
          free_name2: this.getAdParams(),
          free_name1: JSON.stringify({
            adUrl: window.location.search || ''
          })
        });
        setBodyScroll(true);
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.checkShow();
    });
  }
};
</script>

<style lang="less">

.pop-18 {
  position: fixed;
  z-index: 200;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .9);
  backdrop-filter: blur(12px);
  color:#fff;
  .inner{
    text-align: center;
    animation: bombShow .2s both;

    .logo{
      width:224px;
      height:76px;
      background:url(../../assets/img/tumile/logo.png) center no-repeat;
      background-size: 100% auto;
      display: block;
      margin:0 auto;
    }
    .slogn{
      font-size:26px;
      font-weight:bolder;
      padding: 10px 0;
    }
    .txt{
      font-size:16px;
      max-width: 600px;
      padding: 20px 40px;
      line-height: 1.5;
      strong{
        position:relative;
        font-size:32px;
        color:#ff0;
        font-style: italic;
        line-height: 1;
      }
      &.txt2{
        padding-bottom:0;
        font-size:12px;
        opacity: .6;
      }
    }

    .actions{
      padding-top:15px;
      .btn{
        width: 324px;
        height: 55px;
        background: linear-gradient(135deg, #FF78FF 0%, #32E5FF 100%);
        border-radius: 36px;
        color:#fff;
        font-size:16px;
        margin: 0 auto 20px;
        cursor: pointer;

      }
      .leave{
        font-size:14px;
        color:#ffc63d;
      }
    }
  }
}

@media screen and(max-width: 680px) {
  .pop-18{
    .inner{
      .logo{
        width: 180px;
        height:65px;
      }
      .slogn{
        font-size:20px;
      }
      .txt{
        font-size:14px;
        padding: 20px;
        strong{
          font-size:30px;
        };
      }
      .actions{
        padding:10px 40px 20px;
        .btn{
          height:50px;
          width: auto;
        }
      }
    }
  }
}
</style>

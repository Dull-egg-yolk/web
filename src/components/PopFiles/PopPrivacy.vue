<template>
  <transition name="slideUp">
    <div class="pop-privacy" v-if="showPrivacy">
      <div class="pop-content">
        <privacy></privacy>
        <div class="m-btn major " @click="acceptHandler">{{$t('webChat.acceptAgree')}}</div>
      </div>
    </div>
  </transition>
</template>

<script>
import Cookies from 'js-cookie';
import { mapState } from 'vuex';
import { logReport } from '@/util/logReport';
import { getUserPrivacyStatus, getUserPrivacy } from '@/api/user';

export default {
  name: 'PopPrivacy',
  data () {
    return {
      showPrivacy: false,
    };
  },
  methods: {
    acceptHandler () {
      this.saveprivacy();
      this.showPrivacy = false;
      logReport({
        eventId: '106-1-1-18',
        free_name2: 'privacy'
      });
    },
    getPrivacyStatus () {
      getUserPrivacyStatus({ protocolType: 3 }).then(data => {
        if (data.data.showPop) {
          this.showPrivacy = true;
          logReport({
            eventId: '106-1-1-17',
            free_name2: 'privacy'
          });
        }
      });
    },
    saveprivacy () {
      const params = {
        agreeButton: 1,
        protocolType: 3,
        userId: Cookies.get('userId')
      };
      getUserPrivacy(params).then(data => {
      });
    },
    acceptCookie (n) {
      const hadAcceptCookie = Cookies.get('acceptCookie');
      if (hadAcceptCookie) {
        this.getPrivacyStatus();
      }
    },
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin
    }),
  },
  watch: {
    isLogin (n) {
      if (n) {
        this.acceptCookie();
      }
    },
  },
  mounted () {
    console.log(this.isLogin, '3333');
    if (this.isLogin) {
      this.acceptCookie();
    }
  },
};
</script>

<style lang="less" scoped>
.pop-privacy {
  position: fixed;
  padding: 0 140px 40px 140px;
  box-sizing: border-box;
  z-index: 99;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .pop-content {
    background: rgba(23, 22, 31, 0.8);
    backdrop-filter: blur(5px);
    border-radius: 100px;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    padding: 12px 12px 12px 40px;
    font-size: 14px;
    color: #fff;

    p {
      margin-right: 20px;
    }

    .m-btn {
      min-width: 165px;
    }

    .m-btn.mini {
      white-space: nowrap;
    }
  }
}

@media screen and(max-width: 680px) {
  .pop-privacy {
    padding: 0;
    z-index: 101;

    .pop-content {
      flex-direction: column;
      text-align: center;
      padding: 20px 12px 20px;
      border-radius: 14px 14px 0 0;

      p {
        padding: 10px 10px 15px;
        font-size: 14px;
      }

      .m-btn {
        width: 100%;
        margin: 0;
        font-size: 15px;
        height: 46px;
      }
    }
  }
}
</style>

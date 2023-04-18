<template>
  <transition name="slideUp">
    <div class="pop-cookie" v-if="show">
      <div class="pop-content">
        <div>
          <p class="big">{{$t('webChat.cookies')}}</p>
         {{$t('webChat.cookiesDesc')}}
          <!-- <a href="https://privacy.livuchat.com/cookiePolicy.html" target="_blank">{{$t('webChat.cookiePolicy')}}</a> -->
         <router-link :to="{ name: 'CookiePrivacy' }" target="_blank">{{$t('webChat.cookiePolicy')}}</router-link>
        </div>
        <div class="m-btn major " @click="acceptHandler">{{$t('base.accept')}}</div>
      </div>
    </div>
  </transition>
</template>

<script>
import { logReport } from '@/util/logReport';
import { mapState } from 'vuex';
export default {
  name: 'PopCookie',
  data () {
    return {
      show: false,
    };
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin
    }),
  },
  watch: {
    isLogin (n) {
      if (n) {
        this.getCookie();
      }
    },
  },
  methods: {
    acceptHandler () {
      localStorage.setItem('acceptCookie', 'true');
      this.show = false;
      this.$emit('acceptHandler');
      logReport({
        eventId: '106-1-1-18',
        free_name2: 'cookie'
      });
    },
    getCookie () {
      const hadAcceptCookie = localStorage.getItem('acceptCookie');
      if (!hadAcceptCookie) {
        setTimeout(() => {
          this.show = true;
          logReport({
            eventId: '106-1-1-17',
            free_name2: 'cookie'
          });
        }, 1200);
      }
    }
  },
  mounted () {
    const hadAcceptCookie = localStorage.getItem('acceptCookie');
    if (!hadAcceptCookie && this.isLogin) {
      setTimeout(() => {
        this.show = true;
        logReport({
          eventId: '106-1-1-17',
          free_name2: 'cookie'
        });
      }, 1200);
    }
  },
};
</script>

<style lang="less" scoped>
.pop-cookie {
  position: fixed;
  // padding: 0 0px 40px 0px;
  box-sizing: border-box;
  z-index: 99;
  left: 0;
  bottom: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(23,22,31,0.8);

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
  .pop-cookie {
    padding: 0;
    z-index: 101;
    bottom:0;

    .pop-content {
      flex-direction: column;
      text-align: center;
      padding: 12px 12px 20px;
      border-radius: 14px 14px 0 0;
      font-size:12px;
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

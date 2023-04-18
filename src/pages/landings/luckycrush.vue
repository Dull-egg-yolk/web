
<template>
  <div class="page-body">
    <div class="home-page">
      <div class="top-img"><img src="@/assets/img/langding-gomeet.png" /></div>
      <div class="page-top">
        <h2>Live video chat</h2>
        <p>Looking for a great live video chat  platform？ Tap to start now!</p>
      </div>
      <div class="button">
        <div class="play" @click="goToPlay">Go to play</div>
      </div>
    </div>
    <div class="langing-privacy">
      <h2>Who are we？</h2>
      <p>Gomeet gives you a great live video chat experience. Live video chat has become a popular way for people to connect and interact in real-time, providing a more immersive and engaging communication experience. Live video chat has become more accessible and user-friendly, allowing people to connect from anywhere in the world with ease.
      </p>
      <div class="bottom-link">
        <div class="link">
          <a href="https://gomeet.today/privacy-policy" target="_blank">Privacy Policy</a>
          <a href="https://gomeet.today/cookie-policy" target="_blank">Cookie Policy</a>
          <a href="https://gomeet.today/terms-of-use" target="_blank">Terms of Use</a>
          <a href="https://gomeet.today/community-guidelines" target="_blank">Community Guidelines</a>
        </div>
        <div class="langing-reserve">
          <div>All rights reserved © Clash Arts HK Limited 2022</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { logReport } from '@/util/logReport';
import { mapState } from 'vuex';
import { getCountry } from '@/util/getCountry';
export default {
  data () {
    return {

    };
  },

  components: {},

  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin
    }),
  },

  methods: {
    goToPlay () {
      logReport({
        eventId: '106-6-1-1',
        free_name2: Object.assign({
          from: 'gomeet-Livevideochat'
        }, window.$mObj.adData || {}),
      });
      window.$mObj.adData.lpName = 'gomeet-Livevideochat';
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
      localStorage.setItem('LANDINGSPAGE', true);
    }
  },
  mounted () {
    getCountry('gomeet-Livevideochat');
  }
};
</script>
<style lang='less' scoped>
.page-body {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  overflow-y: scroll;
  background-color: #fff;

  .home-page {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    background: url(~@/assets/img/lp5-1.png) center center no-repeat;
    background-size: cover;
    position: relative;
    .top-img {
        position: absolute;
        top: 10px;
        // width: 100%;
        width: 120px;
        height: 35px;
        display: flex;
        justify-content: center;
          img{
            display: block;
            width: 100%;
            height: 100%;
          }

      }
    .page-top {
      position: absolute;
      bottom: 150px;
      width: 100%;

      h2 {
        padding-top: 900px;
        padding: 30px 0 0 0;
        color: #fff;
        font-size: 26px;
        text-align: center;
        line-height: 50px;
      }

      p {
        padding: 5px 40px 10px 40px;
        text-align: center;
        font-size: 14px;
      }
    }

    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      bottom: 50px;
      width: 100%;

      .play {
        width: 250px;
        height: 55px;
        border-radius: 38px;
        color: #fff;
        line-height: 55px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        background: linear-gradient(102deg, #FF3232 0%, #1AA3FF 100%);
      }
    }
  }

  .langing-privacy {
    position: relative;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    background: url(~@/assets/img/lp5-2.png) center center no-repeat;
    // background-size: cover;
    color: #fff;

    h2 {
      padding: 30px 0 0 0;
      font-size: 26px;
      text-align: center;
      line-height: 50px;
    }

    p {
      padding: 5px 40px 10px 40px;
      font-size: 14px;
      text-align: justify;
    }

    .bottom-link {
      background: rgba(11, 11, 11, 0.55);
    }

    .link {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 50px 0;
      padding-top: 30px;

      a {
        color: #fff;
        font-size: 18px;
        margin-bottom: 5px;
      }
    }

    .langing-reserve {
      padding-bottom: 15px;
      width: 100%;

      div {
        text-align: center;
        font-size: 10px;
      }
    }
  }
}

@media screen and(max-width: 680px) {
  .page-body {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    overflow-y: scroll;
    background-color: #fff;

    .home-page {
      width: 100%;
      height: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      background: url(~@/assets/img/lp5-1.png) center center no-repeat;
      background-size: cover;
      position: relative;

      .top-img {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        // width: 100%;
        width: 120px;
        height: 35px;
        display: flex;
        justify-content: center;
          img{
            display: block;
            width: 100%;
            height: 100%;
          }

      }

      .page-top {
        position: absolute;
        bottom: 150px;

        h2 {
          padding-top: 900px;
          padding: 30px 0 0 0;
          color: #fff;
          font-size: 26px;
          text-align: center;
          line-height: 50px;
        }

        p {
          padding: 5px 40px 10px 40px;
          text-align: center;
          font-size: 14px;
        }
      }

      .button {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: 50px;
        width: 100%;

        .play {
          width: 250px;
          height: 55px;
          border-radius: 38px;
          color: #fff;
          line-height: 55px;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          background: linear-gradient(102deg, #FF3232 0%, #1AA3FF 100%);
        }
      }
    }

    .langing-privacy {
      position: relative;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      background: url(~@/assets/img/lp5-2.png) center center no-repeat;
      // background: #4173E9;
      background-size: cover;
      color: #fff;

      h2 {
        padding: 30px 0 0 0;
        font-size: 26px;
        text-align: center;
        line-height: 50px;
      }

      p {
        padding: 5px 40px 10px 40px;
        font-size: 14px;
        text-align: justify;
      }

      .bottom-link {
        background: rgba(11, 11, 11, 0.55);
      }

      .link {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 50px 0;
        padding-top: 30px;

        a {
          color: #fff;
          font-size: 18px;
          margin-bottom: 5px;
        }
      }

      .langing-reserve {
        padding-bottom: 15px;
        width: 100%;

        div {
          text-align: center;
          font-size: 10px;
        }
      }
    }
  }
}
</style>

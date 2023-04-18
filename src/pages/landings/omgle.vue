<template>
  <div class="page-body">
    <div class="home-page">
      <div class="top-img"><img src="@/assets/img/langding-gomeet.png" /></div>
      <div class="page-top">
        <h2>Cam Chat</h2>
        <p>Looking for a great cam chat  platform？ Tap to start now!</p>
      </div>
      <div class="button">
        <div class="play" @click="goToPlay">Go to play</div>
      </div>
    </div>
    <div class="langing-privacy">
      <h2>Who are we？</h2>
      <p>Gomeet offers you a great Cam chat experience. Cam chat has revolutionized the way people communicate, allowing them to meet new people from anywhere in the world. From one-on-one video calls to text chats, online cam chat platforms offer a range of features that enhance the communication experience, making it a popular choice for youngsters.
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
          from: 'gomeet-Cam Chat'
        }, window.$mObj.adData || {}),
      });
      window.$mObj.adData.lpName = 'gomeet-Cam Chat';
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
      localStorage.setItem('LANDINGSPAGE', true);
    }
  },
  mounted () {
    getCountry('gomeet-Cam Chat');
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
  font-family: Futura-Medium, Futura;

  .home-page {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    background: url(~@/assets/img/lp4-1.png) center center no-repeat;
    background-size: cover;
    position: relative;
    .top-img {
        position: absolute;
        top: 10px;
        // left: 50%;
        // transform: translateX(-50%);
        left: 30px;
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
      // bottom: 150px;
      width: 100%;
      top: 20px;
      h2 {
        padding-top: 900px;
        padding: 30px 0 0 0;
        color: #fff;
        font-size: 26px;
        // text-align: center;
        line-height: 50px;
      }

      p {
        padding: 5px 140px 10px 40px;
        // text-align: center;
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
    // background: url(~@/assets/img/lp4-2.png) center center no-repeat;
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
      background: url(~@/assets/img/lp4-1.png) center center no-repeat;
      background-size: cover;
      position: relative;

      .top-img {
        position: absolute;
        top: 10px;
        left: 30px;
        // transform: translateX(-50%);
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
        // bottom: 150px;
        top: 20px;
        h2 {
        padding-top: 900px;
        padding: 30px 0 0 30px;
        color: #fff;
        font-size: 26px;
        // text-align: center;
        line-height: 50px;
      }

      p {
        padding: 5px 140px 10px 30px;
        // text-align: center;
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
      // background: url(~@/assets/img/lp1-2.png) center center no-repeat;
      background: #4173E9;
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

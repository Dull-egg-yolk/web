
<template>
  <div class="page-body">
    <div class="home-page">
      <div class="top-img"><img src="@/assets/img/langding-gomeet.png" /></div>
      <div class="page-top">
        <h2>Want Chat Roulette?</h2>
        <p>Looking for Chat Roulette？ Gomeet is your best alternative! Tap to start!</p>
      </div>
      <div class="button">
        <div class="play" @click="goToPlay">Play for FREE</div>
      </div>
    </div>
    <div class="langing-privacy">
      <h2>Who are we？</h2>
      <p>Gomeet gives you a great free video chat experience. Free video chat has become an essential tool for communication in the digital age, enabling people to connect face-to-face in real-time from anywhere in the world. Free video chat platforms offer a convenient way to make new friends and stay in touch, and has become more popular than ever, providing a safe and easy way to video chat with others.
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
          from: 'gomeet-ChatRoulette'
        }, window.$mObj.adData || {}),
      });
      window.$mObj.adData.lpName = 'gomeet-ChatRoulette';
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
      localStorage.setItem('LANDINGSPAGE', true);
    }
  },
  mounted () {
    getCountry('gomeet-ChatRoulette');
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
    background: url(~@/assets/img/lp6-1.jpg) center center no-repeat;
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
      // bottom: 150px;
      width: 100%;
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
        padding: 5px 40px 10px 30px;
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
        animation: callIconAni 2s infinite;
      }
    }
  }

  .langing-privacy {
    position: relative;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    background: url(~@/assets/img/lp6-2.jpg) center center no-repeat;
    background-size: cover;
    color: #fff;

    h2 {
      padding: 30px 0 0 30px;
      font-size: 26px;
      // text-align: center;
      line-height: 50px;
    }

    p {
      padding: 5px 40px 10px 30px;
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
        // color: #fff;
        color: #FFF2F2;
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
        color: #FFF2F2;
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
      background: url(~@/assets/img/lp6-1.jpg) center center no-repeat;
      background-size: cover;
      position: relative;

      .top-img {
        position: absolute;
        top: 10px;
        left: 20px;
        // width: 100%;
        display: flex;
        justify-content: center;
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
          animation: callIconAni 2s infinite;
        }
      }
    }

    .langing-privacy {
      position: relative;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      background: url(~@/assets/img/lp6-2.jpg) center center no-repeat;
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
          color: #FFF2F2;
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
          color: #FFF2F2;
        }
      }
    }
  }
}
</style>

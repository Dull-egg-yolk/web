
<template>
  <div class="page-body">
    <div class="home-page">
      <div class="top-img"><img src="@/assets/img/langding-gomeet.png" /></div>
      <div class="page-top">
        <h2>Cerchi un'ottima piattaforma di chat video?</h2>
        <p>Gomeet è la scelta migliore per incontrare qualcuno di nuovo! Tocca per iniziare ora!</p>
      </div>
      <div class="button">
        <div class="play" @click="goToPlay">Chi siamo noi?</div>
      </div>
    </div>
    <div class="langing-privacy">
      <h2>Chi siamo noi?</h2>
      <p>
        Gomeet è un sito Web di chat video 1v1 che consente agli utenti di partecipare a chat video e chat di testo individuali. Offre un'interfaccia facile da usare, che lo rende una scelta popolare per coloro che vogliono fare nuove amicizie in tutto il mondo. Che cosa stai aspettando? Basta un tocco ed espandi il tuo mondo. È la tua migliore alternativa per omegle, cotta fortunata e coomeet. Vieni a provare!
      </p>
      <div class="bottom-link">
        <div class="link">
          <a href="https://gomeet.today/privacy-policy" target="_blank">Informativa sulla privacy</a>
          <a href="https://gomeet.today/cookie-policy" target="_blank">Informativa sui cookie</a>
          <a href="https://gomeet.today/terms-of-use" target="_blank">Condizioni d'uso</a>
          <a href="https://gomeet.today/community-guidelines" target="_blank">Linee guida della community</a>
        </div>
        <div class="langing-reserve">
          <div>All rights reserved © Clash Arts HK Limited 2022</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getParams } from '@/util/index';
import { logReport } from '@/util/logReport';
import { mapState } from 'vuex';
import { getCountry } from '@/util/getCountry';
export default {
  data () {
    return {

    };
  },

  components: {},
  // watch: {
  //   isLogin (n, v) {
  //     if (n) {
  //       this.$store.commit('setShowLoginPop', false);
  //     }
  //   },
  // },
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
          from: 'video'
        }, window.$mObj.adData || {}),
      });
      localStorage.setItem('LANDINGSPAGE', true);
      // localStorage.setItem('LANDINGSOMEGLE', true);
      window.$mObj.adData.lpName = 'Gomeet-video';
      localStorage.setItem('lpName', 'Gomeet-video');
      this.$router.push({ name: 'Gomeet' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
    }
  },
  mounted () {
    getCountry('video');
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
    background: url(~@/assets/img/lp3-7-3.jpg) center center no-repeat;
    background-size: cover;
    position: relative;
    .top-img {
        position: absolute;
        top: 5px;
        width: 100%;
        display: flex;
        justify-content: center;
        img{
          display: block;
          width: 120px;
          height: 40px;
        }
      }
    .page-top {
      position: absolute;
    //   bottom: 150px;
      width: 100%;
      bottom: 120px;
      left: 50%;
      transform: translateX(-50%);
      h2 {
        padding-top: 900px;
        padding: 30px 5px 0 5px;
        color: #fff;
        font-size: 24px;
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
        background: linear-gradient(111deg, #F99E47 0%, #FF3463 100%);
        animation: callIconAni 2s infinite;
      }
    }
  }

  .langing-privacy {
    position: relative;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    background: url(~@/assets/img/lp3-7-4.jpg) center center no-repeat;
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
      text-align: center;
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
      background: url(~@/assets/img/lp3-7-3.jpg) center center no-repeat;
      background-size: cover;
      position: relative;

      .top-img {
        position: absolute;
        top: 5px;
        width: 100%;
        display: flex;
        justify-content: center;
        img{
          display: block;
          width: 120px;
          height: 40px;
        }
      }

      .page-top {
        position: absolute;
        // bottom: 150px;
        bottom: 120px;
        left: 50%;
        transform: translateX(-50%);
        h2 {
          padding-top: 900px;
          padding: 30px 5px 0 5px;
          color: #fff;
          font-size: 24px;
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
          background: linear-gradient(111deg, #F99E47 0%, #FF3463 100%);
          animation: callIconAni 2s infinite;
        }
      }
    }

    .langing-privacy {
      position: relative;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      background: url(~@/assets/img/lp3-7-4.jpg) center center no-repeat;
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
        text-align: center;
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
}</style>

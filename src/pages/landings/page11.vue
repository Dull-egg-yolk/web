
<template>
  <div class="page-body">
    <div class="home-page">
      <div class="img-top">
        <div class="top-img"><img src="@/assets/img/langding-gomeet.png" /></div>
      </div>
      <div class="page-top">
        <h2>100% Real People</h2>
      </div>
      <div class="button">
        <div class="play" @click="goToPlay"><span class="icon-video2"></span>Go to Play</div>
      </div>
    </div>
    <div class="langing-privacy">
      <div class="lp-two"><img src="@/assets/img/lp-two.jpg" /></div>
      <h2>What is Gomeet?</h2>
      <p>
        Gomeet is the perfect platform that allows users to engage in one-on-one private video chats and text chats. It offers an easy-to-use interface, making it a popular choice for those who want to make new friends all over the world. What are you waiting for? Just take one tap and expand your world.
      </p>
      <div class="lp-three"><img src="@/assets/img/lp-three.jpg" /></div>
      <h2>Private Video Chatting</h2>
      <p>
        Privacy is one of our top priorities. Our website is safe and secured on every personal private calls. On Gomeet, you don't need to worry about leaking your personal information. Everything you say and do is completely anonymous.
      </p>
      <div class="lp-four">
        <div class="four-img"><img src="@/assets/img/lp-four.jpg" /></div>
        <h2>Meeting People Anonymously</h2>
        <p>If you are someone who takes your information really personal, you just find the perfect place. Here you can enjoy free calls with people anytime anywhere anonymously.
        </p>
        <div class="button">
          <div class="play" @click="goToPlay"><span class="icon-video2"></span>Start Matching</div>
        </div>
        <div class="li-list">
          <div class="list-img"><img src="@/assets/img/landings-img3.png" /></div>
          <div class="list-content">
            <div class="title">Coomeet Alternative</div>
            <div class="text">Gomeet is your ultimate destination for video chat! </div>
          </div>
        </div>
        <div class="li-list">
          <div class="list-img"><img src="@/assets/img/landings-img4.png" /></div>
          <div class="list-content">
            <div class="title">Luckycrush Alternative</div>
            <div class="text">Meeting strangers in no time! </div>
          </div>
        </div>
        <div class="li-list">
          <div class="list-img"><img src="@/assets/img/landings-img6.png" /></div>
          <div class="list-content">
            <div class="title">Omegle Alternative</div>
            <div class="text">To get to know people worldwide! </div>
          </div>
        </div>
        <div class="li-list">
          <div class="list-img"><img src="@/assets/img/landings-img7.png" /></div>
          <div class="list-content">
            <div class="title">Chatroulette Alternative</div>
            <div class="text">1v1 Random video chat with strangers! </div>
          </div>
        </div>
        <div class="button">
        <div class="play" @click="goToPlay"><span class="icon-video2"></span>Go to play</div>
      </div>
      </div>
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
          from: 'gomeet-privacy'
        }, window.$mObj.adData || {}),
      });
      window.$mObj.adData.lpName = 'gomeet-privacy';
      localStorage.setItem('lpName', 'gomeet-privacy');
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
      localStorage.setItem('LANDINGSPAGE', true);
    }
  },
  mounted () {
    getCountry('gomeet-privacy');
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
    background: linear-gradient(178deg, #FFA8E7 0%, #FFF3F9 50%, #FFF3F9 100%);
    // background-color: #fff;

  .home-page {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    background: url(~@/assets/img/a9-bg2.jpg) top center no-repeat;
    background-size: 100% auto;
    position: relative;

    .img-top {
      width: 100%;
      height: 55px;
      // background: rgba(124, 10, 91, 0.24);
      display: flex;
      justify-content: center;

      .top-img {
        position: absolute;
        top: 10px;
        // width: 100%;
        width: 120px;
        height: 35px;
        display: flex;
        justify-content: center;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }

      }
    }

    .page-top {
      position: absolute;
      bottom: 110px;
      width: 100%;
      color: #FF2E93;

      h2 {
        padding-top: 900px;
        padding: 30px 0 0 0;
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
      bottom: 20px;
      width: 100%;

      .play {
        margin: 0 30px;
        width: 100%;
        height: 56px;
        border-radius: 38px;
        color: #fff;
        line-height: 56px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        background: #FF2E93;
        box-shadow: 0px 0px 22px 0px #F9A7D0;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: callIconAni 2s infinite;

        .icon-video2 {
          font-size: 25px;
          padding-right: 10px;
        }
      }
    }

    .lp-one {
      position: absolute;
      bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 90%;
      }
      div {
        position: absolute;
        bottom: 20px;
        color: #000;
        font-size: 14px;
      }
    }
  }

    .langing-privacy {
      position: relative;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      color: #fff;

      .lp-two,
      .lp-three {
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 90%;
        }
      }

      .lp-four {
        position: relative;
        padding-top: 20px;
        .four-img {
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 100%;
          }
        }

        h2 {
          position: absolute;
          top: 180px;
          color: #FF2E93;
          line-height: 30px;
        }

        .button {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;

          .play {
            margin: 30px;
            width: 100%;
            height: 56px;
            border-radius: 38px;
            color: #fff;
            line-height: 56px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            background: #FF2E93;
            box-shadow: 0px 0px 22px 0px #F9A7D0;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: callIconAni 2s infinite;

            .icon-video2 {
              font-size: 25px;
              padding-right: 10px;
            }
          }
        }

        .li-list {
          display: flex;
          height: 70px;
          margin:0 30px 10px 30px;
          background-color: #fff;
          border-radius: 18px;
          border: 1px solid rgba(255, 46, 147, 0.3);
          color: #000;

          .list-img {
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 60px;
            }
          }

          .list-content {
            margin-left: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .title {
              font-weight: bold;
            }
          }
        }

        // background: url(~@/assets/img/lp-four.png) top center no-repeat;
        // background-size: cover;
      }

      h2 {
        padding: 30px 0 0 0;
        font-size: 26px;
        text-align: center;
        line-height: 50px;
        color: #FF2E93;
      }

      p {
        padding: 5px 40px 10px 40px;
        font-size: 14px;
        text-align: justify;
        color: #000;
      }

      .bottom-link {
        background: rgba(124,10,91, 0.55);
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
    background: linear-gradient(178deg, #FFA8E7 0%, #FFF3F9 50%, #FFF3F9 100%);
    // background-color: #fff;

  .home-page {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    background: url(~@/assets/img/a9-bg2.jpg) top center no-repeat;
    background-size: 100% auto;
    position: relative;

    .img-top {
      width: 100%;
      height: 55px;
      // background: rgba(124, 10, 91, 0.24);
      display: flex;
      justify-content: center;

      .top-img {
        position: absolute;
        top: 10px;
        // width: 100%;
        width: 120px;
        height: 35px;
        display: flex;
        justify-content: center;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }

      }
    }

    .page-top {
      position: absolute;
      bottom: 110px;
      width: 100%;
      color: #FF2E93;

      h2 {
        padding-top: 900px;
        padding: 30px 0 0 0;
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
      bottom: 20px;
      width: 100%;

      .play {
        margin: 0 30px;
        width: 100%;
        height: 56px;
        border-radius: 38px;
        color: #fff;
        line-height: 56px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        background: #FF2E93;
        box-shadow: 0px 0px 22px 0px #F9A7D0;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: callIconAni 2s infinite;

        .icon-video2 {
          font-size: 25px;
          padding-right: 10px;
        }
      }
    }

    .lp-one {
      position: absolute;
      bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 90%;
      }
      div {
        position: absolute;
        bottom: 20px;
        color: #000;
        font-size: 14px;
      }
    }
  }

    .langing-privacy {
      position: relative;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      color: #fff;

      .lp-two,
      .lp-three {
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 90%;
        }
      }

      .lp-four {
        position: relative;
        padding-top: 20px;
        .four-img {
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 100%;
          }
        }

        h2 {
          position: absolute;
          top: 180px;
          color: #FF2E93;
          line-height: 30px;
        }

        .button {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;

          .play {
            margin: 30px;
            width: 100%;
            height: 56px;
            border-radius: 38px;
            color: #fff;
            line-height: 56px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            background: #FF2E93;
            box-shadow: 0px 0px 22px 0px #F9A7D0;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: callIconAni 2s infinite;

            .icon-video2 {
              font-size: 25px;
              padding-right: 10px;
            }
          }
        }

        .li-list {
          display: flex;
          height: 70px;
          margin:0 30px 10px 30px;
          background-color: #fff;
          border-radius: 18px;
          border: 1px solid rgba(255, 46, 147, 0.3);
          color: #000;

          .list-img {
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 60px;
            }
          }

          .list-content {
            margin-left: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .title {
              font-weight: bold;
            }
          }
        }

        // background: url(~@/assets/img/lp-four.png) top center no-repeat;
        // background-size: cover;
      }

      h2 {
        padding: 30px 0 0 0;
        font-size: 26px;
        text-align: center;
        line-height: 50px;
        color: #FF2E93;
      }

      p {
        padding: 5px 40px 10px 40px;
        font-size: 14px;
        text-align: justify;
        color: #000;
      }

      .bottom-link {
        background: rgba(124,10,91, 0.55);
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

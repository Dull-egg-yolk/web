
<template>
  <div class="page-body">
    <div class="home-page">
      <div class="img-top">
        <div class="top-img"><img src="@/assets/img/langding-gomeet.png" /></div>
      </div>
      <div class="page-top">
        <h2>100٪ اشخاص حقيقية</h2>
      </div>
      <div class="button">
        <div class="play" @click="goToPlay"><span class="icon-video2"></span>اذهب للعب</div>
      </div>
    </div>
    <div class="langing-privacy">
      <div class="lp-two"><img src="@/assets/img/chat3-7-a1.png" /></div>
      <h2>ما هو Gomeet؟</h2>
      <p>
        Gomeet هو النظام الأساسي المثالي الذي يسمح للمستخدمين بالمشاركة في محادثات الفيديو الفردية والمحادثات النصية تمامًا مثل coomeet. إنه يوفر منصة سهلة الاستخدام ، مما يجعله خيارًا مميزا لأولئك الذين يرغبون في تكوين صداقات جديدة في جميع أنحاء العالم. ماذا تنتظر؟ فقط بضغطة واحدة وقم بتوسيع عالمك. إنه أفضل بديل لك لـ omegle و Lucky Crush و coomeet. تعال وجربه الأن!
      </p>
      <div class="lp-three"><img src="@/assets/img/a11-3.png" /></div>
      <h2>مطابقات فيديو حصرية</h2>
      <p>
        يوفر لك Gomeet بيئة ملائمة وسريعة لمطابقات الفيديو ، يمكنك الاتصال بأي شخص في أي مكان بضغطة واحدة فقط. مع تجربة مميزة، أصبحت مطابقة الفيديو Gomeet وسيلة للأشخاص للتواصل مع بعضهم البعض أونلاين . بدون خروجك من منزلك ، يمكنك التعرف على أشخاص جدد من ثقافات متنوعة وجهاً لوجه .
      </p>
      <div class="lp-four">
        <div class="four-img"><img src="@/assets/img/a11-1.png" /></div>
        <h2>ترجمة فورية دقيقة</h2>
        <p>لا تستطيع ان تتواصل مع اشخاص من لغات مختلفة؟ لا تقلق. على Gomeet ، نقدم لك ترجمة دقيقة فورية مجانًية! يمكنك التواصل بسهولة مع أصدقاء جدد في جميع أنحاء العالم دون عناء. اختبر حياة اجتماعية مثيرة على Gomeet! افتح واتصل ، وغني معًا ، وشارك مشاعرك في أي وقت وفي أي مكان.
        </p>
        <div class="button">
          <div class="play" @click="goToPlay"><span class="icon-video2"></span>ابدأ المطابقة</div>
        </div>
        <div class="li-list">
          <div class="list-img"><img src="@/assets/img/landings-img3.png" /></div>
          <div class="list-content">
            <div class="title">بديل Coomeet</div>
            <div class="text">Gomeet هي وجهتك النهائية للدردشة المرئية!</div>
          </div>
        </div>
        <div class="li-list">
          <div class="list-img"><img src="@/assets/img/landings-img4.png" /></div>
          <div class="list-content">
            <div class="title">بديل Luckycrush</div>
            <div class="text">لقاء الغرباء في لمح البصر!</div>
          </div>
        </div>
        <div class="li-list">
          <div class="list-img"><img src="@/assets/img/landings-img6.png" /></div>
          <div class="list-content">
            <div class="title">بديل Omegle</div>
            <div class="text">للتعرف على اشخاص من جميع أنحاء العالم!</div>
          </div>
        </div>
        <div class="li-list">
          <div class="list-img"><img src="@/assets/img/landings-img7.png" /></div>
          <div class="list-content">
            <div class="title">البديل Chatroulette </div>
            <div class="text"> دردشة فيديو عشوائية مع الغرباء!</div>
          </div>
        </div>
        <div class="button">
        <div class="play" @click="goToPlay"><span class="icon-video2"></span>ابدأ</div>
      </div>
      </div>
      <div class="bottom-link">
        <div class="link">
          <a href="https://gomeet.today/privacy-policy" target="_blank">سياسة الخصوصية</a>
          <a href="https://gomeet.today/cookie-policy" target="_blank">سياسة ملفات الكوكيز</a>
          <a href="https://gomeet.today/terms-of-use" target="_blank">شروط الاستخدام</a>
          <a href="https://gomeet.today/community-guidelines" target="_blank">إرشادات مجتمعنا</a>
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
          from: 'onlinechat'
        }, window.$mObj.adData || {}),
      });
      localStorage.setItem('LANDINGSPAGE', true);
      // localStorage.setItem('LANDINGSOMEGLE', true);
      window.$mObj.adData.lpName = 'Gomeet-onlinechat';
      localStorage.setItem('lpName', 'Gomeet-onlinechat');
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
    }
  },
  mounted () {
    getCountry('onlinechat');
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
    background: rgb(188 227 212);
    // background-color: #fff;

  .home-page {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    background: url(~@/assets/img/chat3-7-a3.jpg) top center no-repeat;
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
      color: #09b584;

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
        color: #fff;
        line-height: 56px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        background: #E4A560;
        border-radius: 30px;
        border: 2px solid #F8F4EF;
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
          color: #000;
          line-height: 30px;
          width: 100%;
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
            color: #fff;
            line-height: 56px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            background: #E4A560;
            border-radius: 30px;
            border: 2px solid #F8F4EF;
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
        color: #1D755C;
        width: 100%;
      }

      p {
        padding: 5px 40px 10px 40px;
        font-size: 14px;
        text-align: justify;
        color: #1D755C;
      }

      .bottom-link {
        background: #1D755C;
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
    background: rgb(188 227 212);
    // background-color: #fff;

  .home-page {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    background: url(~@/assets/img/chat3-7-a3.jpg) top center no-repeat;
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
      color: #09b584;

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
        color: #fff;
        line-height: 56px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        background: #E4A560;
        border-radius: 30px;
        border: 2px solid #F8F4EF;
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
          color: #000;
          line-height: 30px;
          width: 100%;
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
            color: #fff;
            line-height: 56px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            background: #E4A560;
            border-radius: 30px;
            border: 2px solid #F8F4EF;
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
        color: #1D755C;
        width: 100%;
      }

      p {
        padding: 5px 40px 10px 40px;
        font-size: 14px;
        text-align: justify;
        color: #1D755C;
      }

      .bottom-link {
        background: #1D755C;
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

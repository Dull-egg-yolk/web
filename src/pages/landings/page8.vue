
<template>
  <div class="page-body">
    <div class="home-page">
      <div class="top-img"><img src="@/assets/img/langding-gomeet.png" /></div>
      <div class="page-top">
        <h2>دردشة فيديو</h2>
        <p>هل تبحث عن منصة دردشة فيديو مميزة؟ Gomeet هو خيارك الأفضل لمقابلة اشخاص جديده! اضغط للبدء الآن!</p>
      </div>
      <div class="button">
        <div class="play" @click="goToPlay">ابدأ مكالمة فيديو</div>
      </div>
    </div>
    <div class="langing-privacy">
      <h2>من نحن؟</h2>
      <p>
        Gomeet هو موقع ويب لدردشة الفيديو  العشوائية الخاصة يسمح للمستخدمين بالمشاركة في دردشات فيديو فردية ومحادثات نصية. إنه يوفر تقنيات سهلة الاستخدام ، مما يجعله الإختيار الأفضل لأولئك الذين يرغبون في تكوين صداقات جديدة في جميع أنحاء العالم. ماذا تنتظر؟ فقط خذ نقرة واحدة وقم بتوسيع عالمك. إنه أفضل بديل لك لـ omegle و Lucky Crush و coomeet. تعال وجربه الأن!
      </p>
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
          from: 'videochat2'
        }, window.$mObj.adData || {}),
      });
      localStorage.setItem('LANDINGSPAGE', true);
      // localStorage.setItem('LANDINGSOMEGLE', true);
      window.$mObj.adData.lpName = 'livcam-videochat2';
      localStorage.setItem('lpName', 'livcam-videochat2');
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
    }
  },
  mounted () {
    getCountry('videochat2');
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
    background: url(~@/assets/img/lpa7-1.jpg) center center no-repeat;
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
    background: url(~@/assets/img/lpa7-2.jpg) center center no-repeat;
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
      background: url(~@/assets/img/lpa7-1.jpg) center center no-repeat;
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
      background: url(~@/assets/img/lpa7-2.jpg) center center no-repeat;
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

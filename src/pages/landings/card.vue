
<template>
  <div class="page-body">
    <div class="home-page">
      <div class="top-btn">
        <div class="btn-dis" @click="goToPlay">Discover</div>
        <div class="btn-rig">
            <span class="shop" @click="goToPlay">Shop</span>
            <span class="login" @click="goToPlay">Login</span>
        </div>
      </div>
      <div class="main">
        <div class="main-lt">
          <div class="page-top">
            <h2>Meet</h2>
            <h2>Someone New</h2>
            <p>Online video chat with strangers. Enjoy free calls with people anytime anywhere. Tap to start!</p>
          </div>
          <div class="button">
            <div class="play" @click="goToPlay">Match for Free</div>
          </div>
        </div>
        <div class="swiper">
          <div class="swiper-wrapper">
              <div class="swiper-slide bg1" ></div>
              <div class="swiper-slide bg2" ></div>
              <div class="swiper-slide bg3" ></div>
              <div class="swiper-slide bg4" ></div>
              <div class="swiper-slide bg5" ></div>
              <div class="swiper-slide bg6" ></div>
          </div>
        <!-- <div class="swiper-pagination"></div> -->
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
// import { Swiper } from 'swiper';
import Swiper, { Autoplay } from 'swiper';
import 'swiper/swiper.less';
Swiper.use([Autoplay]);
export default {
  data () {
    return {

    };
  },

  components: { },
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
          from: 'card'
        }, window.$mObj.adData || {}),
      });
      localStorage.setItem('LANDINGSPAGE', true);
      // localStorage.setItem('LANDINGSOMEGLE', true);
      window.$mObj.adData.lpName = 'Gomeet-card';
      localStorage.setItem('lpName', 'Gomeet-card');
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
    }
  },
  mounted () {
    getCountry('card');
    setTimeout(() => {
      const swiper = new Swiper('.swiper', {
        autoplay: true,
        // speed: 2000,
        slidesPerView: 2,
        spaceBetween: 6,
        centeredSlides: true,
        loop: true,
        // autoplay: {
        //   delay: 2000,
        // },
        // pagination: {
        //   el: '.swiper-pagination',
        //   clickable: true,
        // },
      });
    }, 300);
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
  padding: 0;
  .video-main{
    position: fixed;
    min-width: 100%;
    min-height: 100%;
    top:0;
    bottom: 0;
    right: 0;
    left: 0;
    height: auto;
    width: auto;
    source{
        min-width: 100%;
        min-height: 100%;
        height: auto;
        width: auto;
    }
  }
  .home-page {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    // background: #FFD7E3;
    background: #000;
    // background: url(~@/assets/img/gometcard-bg.png) center center no-repeat;
    background-size: cover;
    position: relative;
    .top-btn{
        position: absolute;
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 30px;
        box-sizing: border-box;
        z-index: 2;
        .btn-dis{
            width: 120px;
            height: 24px;
            font-size: 26px;
            font-family: Futura-Bold, Futura;
            font-weight: bold;
            color: #FFFFFF;
            line-height: 25px;
            position: relative;
            &::after{
                display:block;
                content: "";
                position: absolute;
                width: 100%;
                height: 3px;
                bottom: -3px;
                background: #fff;
                border-radius: 3px;
            }
        }
        .btn-rig{
            // width: 40%;
            display: flex;
            justify-content: flex-end;
            font-size: 20px;
            color: #000;
            flex: 1;
            .shop{
                padding: 5px 20px 5px 45px;
                // background-color: #fff;
                border-radius: 30px;
                margin-right: 10px;
                background: url(~@/assets/img/tumile/icon-s-coin.png) left center no-repeat #fff;
                background-size: auto 36px;
            }
            .login{
                padding: 5px 20px 5px 20px;
                background-color: #fff;
                border-radius: 30px;
            }
        }
    }
    .main{
      position: relative;
      top: 100px;
      height: calc( 100% - 100px);
      width: 100%;
      display: flex;
      .main-lt{
        width: 50%;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .page-top {
          // position: absolute;
        //   bottom: 150px;
          width: 100%;
          // top: 50px;
          height: 50%;
          position: relative;
          text-align: center;
          h2 {
            // position: absolute;
            padding: 10px 20px 30px 20px;
            color: #fff;
            font-size: 46px;
            line-height: 50px;
          }

          p {
            padding: 5px 40px 10px 40px;
            text-align: center;
            font-size: 22px;
          }
        }

        .button {
          display: flex;
          justify-content: center;
          align-items: center;
          // position: absolute;
          // top: 300px;
          width: 100%;

          .play {
            width: 250px;
            height: 55px;
            border-radius: 38px;
            color: #000;
            line-height: 55px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            background: #fff;
            animation: callIconAni 2s infinite;
          }
        }
      }
    }
    .swiper{
      width: 50%;
      height: 100%;
      // background: #FFD7E3;
      border-radius: 10px;
      display: flex;
      align-items: center;
       background: url(~@/assets/img/gometcard-bg.png) center center no-repeat;
      background-size: cover;
      .swiper-wrapper{
        height: 60%;
        .swiper-slide {
          text-align: center;
          font-size: 18px;
          background: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: 300ms;
          transform: scale(1);
          border-radius: 20px;
          overflow: hidden;
          img{
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .bg1{
          background: url(~@/assets/img/vioda1.jpg) center center no-repeat;
          background-size: cover;
        }
        .bg2{
          background: url(~@/assets/img/vioda2.jpg) center center no-repeat;
          background-size: cover;
        }
        .bg3{
          background: url(~@/assets/img/vioda3.jpg) center center no-repeat;
          background-size: cover;
        }
        .bg4{
          background: url(~@/assets/img/vioda4.jpg) center center no-repeat;
          background-size: cover;
        }
        .bg5{
          background: url(~@/assets/img/vioda5.jpg) center center no-repeat;
          background-size: cover;
        }
        .bg6{
          background: url(~@/assets/img/vioda6.jpg) center center no-repeat;
          background-size: cover;
        }
        .swiper-slide-active,.swiper-slide-duplicate-active{
            // transform: scale(1);
            transform: rotate(0deg) translateX(0) ;
        }
        .swiper-slide-next{
          transform: rotate(15deg) translateX(40%);
        }
        .swiper-slide-prev{
          transform: rotate(-15deg) translateX(-40%);
        }
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
  font-family: Futura-Medium, Futura;
  .video-main{
    position: fixed;
    min-width: 100%;
    min-height: 100%;
    top:0;
    bottom: 0;
    right: 0;
    left: 0;
    height: auto;
    width: auto;
    source{
        min-width: 100%;
        min-height: 100%;
        height: auto;
        width: auto;
    }
  }
  .home-page {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    background: url(~@/assets/img/gometcard-bg.png) center center no-repeat;
    background-size: cover;
    position: relative;
    .top-btn{
        position: absolute;
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 10px;
        box-sizing: border-box;
        .btn-dis{
            width: 82px;
            height: 24px;
            font-size: 18px;
            font-family: Futura-Bold, Futura;
            font-weight: bold;
            color: #FFFFFF;
            line-height: 25px;
            position: relative;
            &::after{
                display:block;
                content: "";
                position: absolute;
                width: 100%;
                height: 3px;
                bottom: -3px;
                background: #fff;
                border-radius: 3px;
            }
        }
        .btn-rig{
            // width: 40%;
            display: flex;
            justify-content: flex-end;
            font-size: 13px;
            color: #000;
            flex: 1;
            .shop{
                padding: 5px 20px 5px 30px;
                // background-color: #fff;
                border-radius: 30px;
                margin-right: 10px;
                background: url(~@/assets/img/tumile/icon-s-coin.png) left center no-repeat #fff;
                background-size: auto 26px;
            }
            .login{
                padding: 5px 20px 5px 20px;
                background-color: #fff;
                border-radius: 30px;
            }
        }
    }
    .main{
      position: relative;
      top: 0px;
      // height: calc( 100% - 100px);
      width: 100%;
      display: flex;
      .main-lt{
        width: 100%;
        position: relative;
        .page-top {
        position: absolute;
      //   bottom: 150px;
        width: 100%;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
      h2 {
        padding-top: 900px;
        padding: 10px 20px 0 20px;
        color: #fff;
        font-size: 42px;
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
      top: 280px;
      width: 100%;

      .play {
        width: 250px;
        height: 55px;
        border-radius: 38px;
        color: #000;
        line-height: 55px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        background: #fff;
        animation: callIconAni 2s infinite;
      }
    }
  }
    }
    .swiper{
      position: fixed;
      width: 100%;
      height: 45%;
      bottom: -20px;
      border-radius: 0px;
      background: none;
      .swiper-wrapper{
        height: 100%;
        // position: relative;
        // width: 100%;
        // height: 100%;
        // z-index: 1;
        // display: flex;
        // transition-property: transform;
        // box-sizing: content-box;
        .swiper-slide {
          text-align: center;
          font-size: 18px;
          background: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: 300ms;
          transform: scale(1);
          border-radius: 20px;
          overflow: hidden;
          img{
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .bg1{
          background: url(~@/assets/img/vioda1.jpg) center center no-repeat;
          background-size: cover;
        }
        .bg2{
          background: url(~@/assets/img/vioda2.jpg) center center no-repeat;
          background-size: cover;
        }
        .bg3{
          background: url(~@/assets/img/vioda3.jpg) center center no-repeat;
          background-size: cover;
        }
        .bg4{
          background: url(~@/assets/img/vioda4.jpg) center center no-repeat;
          background-size: cover;
        }
        .bg5{
          background: url(~@/assets/img/vioda5.jpg) center center no-repeat;
          background-size: cover;
        }
        .bg6{
          background: url(~@/assets/img/vioda6.jpg) center center no-repeat;
          background-size: cover;
        }
        .swiper-slide-active,.swiper-slide-duplicate-active{
            // transform: scale(1);
            transform: rotate(0deg) translateX(0) ;
        }
        .swiper-slide-next{
          transform: rotate(15deg) translateX(40%);
        }
        .swiper-slide-prev{
          transform: rotate(-15deg) translateX(-40%);
        }
      }
    }
    }
}
}
</style>

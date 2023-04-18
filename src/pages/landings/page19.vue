
<template>
  <div class="page-body">
    <div class="home-page" :class="{'bg1':bgname==1 ,'bg2':bgname==2 ,'bg3':bgname==3}">
      <div class="page-top">
        <h2>WE ARE</h2>
        <h2>HERE 24/7</h2>
        <p>Call the one you like</p>
      </div>
      <div class="refresh" @click="Refresh">
        <img src="@/assets/img/setlogo.png" ref="Refresh" alt="">
        Refresh
      </div>
      <div class="button">
          <div @click="goToPlay"><span class="icon-video2"></span></div>
          <div @click="goToPlay"><span class="icon-video2"></span></div>
          <div @click="goToPlay"><span class="icon-video2"></span></div>
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
      bgname: 1
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
          from: 'gomeet-247'
        }, window.$mObj.adData || {}),
      });
      localStorage.setItem('LANDINGSPAGE', true);
      // localStorage.setItem('LANDINGSOMEGLE', true);
      window.$mObj.adData.lpName = 'gomeet-247';
      localStorage.setItem('lpName', 'gomeet-247');
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
    },
    Refresh () {
      this.bgname++;
      if (this.bgname > 3) {
        this.bgname = 1;
      }
    }
  },
  mounted () {
    getCountry('gomeet-247');
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
    position: relative;
    animation: all .2s;
    &.bg1{
      background: url(~@/assets/img/lp3-28a1.png) center center no-repeat;
      background-size: cover;
    }
    &.bg2{
      background: url(~@/assets/img/lp3-28a2.png) center center no-repeat;
      background-size: cover;
    }
    &.bg3{
      background: url(~@/assets/img/lp3-28a3.png) center center no-repeat;
      background-size: cover;
    }
    .top-img {
        position: absolute;
        top: 10px;
        width: 100%;
        display: flex;
        justify-content: center;
      }
    .page-top {
      position: absolute;
      width: 100%;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      h2 {
        padding: 0px 0 0 30px;
        font-size: 42px;
        font-weight: 800;
        color: #FFD400;
        line-height: 50px;
        -webkit-text-stroke: 2px #000000;
        text-stroke: 2px #000000;
      }

      p {
        padding: 5px 40px 10px 30px;
        font-size: 24px;
        font-weight: 800;
      }
    }
    .refresh{
      position: absolute;
      bottom: 18%;
      display: flex;
      width: 30%;
      box-sizing: border-box;
      padding: 10px;
      justify-content: space-evenly;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(22,22,22,0.29);
      border-radius: 24px;
      img{
        width: 20px;
      }
    }

    .button {
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: absolute;
      bottom: 50px;
      width: 100%;
      >div{
        padding: 15px;
        border-radius: 50%;
        background: linear-gradient(225deg, #FFE705 0%, #FECB02 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        animation: bingbing 2s infinite;
        .icon-video2{
          font-size: 30px;
          color: #000;
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

    .home-page {
      width: 100%;
      height: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      background: url(~@/assets/img/lp3-28a1.png) center center no-repeat;
      background-size: cover;
      position: relative;

      .top-img {
        position: absolute;
        top: 10px;
        width: 100%;
        display: flex;
        justify-content: center;
      }
    }
  }
}
@keyframes bingbing {
  0%{
    transform: scale(1.2);
  }
  50%{
    transform: scale(1);
  }
  100%{
    transform: scale(1.2);
  }
}
</style>

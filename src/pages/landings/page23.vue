<template>
    <div class="page-body">
      <video src="@/assets/img/lp0322.mp4" autoplay loop muted playsinline></video>
      <div class='gobtn'>
          <span class='video1' @click='goToPlay'
            ><img src='@/assets/img/lp3-21vv.png' alt=''
          /></span>
          Texting
        </div>
        <div class='gobtn2'>
          <span class='video2' @click='goToPlay'
            ><img src='@/assets/img/lp3-21xx.png' alt=''
          /></span>
          Free Call
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
      card: 'bg1',
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
          from: 'gomeet-videochat'
        }, window.$mObj.adData || {}),
      });
      window.$mObj.adData.lpName = 'gomeet-videochat';
      localStorage.setItem('lpName', 'gomeet-videochat');
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
      localStorage.setItem('LANDINGSPAGE', true);
    },
    setcard (item) {
      this.card = item;
    }
  },
  mounted () {
    getCountry('gomeet-videochat');
    setTimeout(() => {
      document.querySelector('.gobtn').setAttribute('style', 'display:block');
      document.querySelector('.gobtn2').setAttribute('style', 'display:block');
    }, 2000);
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
  padding: 0;
  video{
    position: fixed;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    transform: translateX(-50%) translateY(-50%);
    object-fit: fill;
  }
  .gobtn {
    position: absolute;
    right: 20%;
    top: 36%;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    font-family: Futura-Bold, Futura;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 23px;
    text-shadow: 0px 0px 3px rgba(0,0,0,0.3);
    display: none;
        .video1 {
          color: #fff;
          background: linear-gradient(132deg, #2DFD99 0%, #F0FF40 100%);
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 30px;
            height: 20px;
          }
        }
      }
      .gobtn2 {
        position: absolute;
    left: 25%;
    top: 36%;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    font-family: Futura-Bold, Futura;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 23px;
    text-shadow: 0px 0px 3px rgba(0,0,0,0.3);
    display: none;
        .video2 {
          color: #fff;
          background: linear-gradient(132deg, #2DFD99 0%, #F0FF40 100%);
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 30px;
            height: 29px;
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

  }
}
@keyframes dingding {
    0% {
      opacity: 0;
    }

    50% {
      opacity: .8;
    }

    100% {
      opacity: 1;
    }
}
@keyframes bingbing {
    0% {
      transform: scale(1);
      opacity: .8;
    }

    50% {
      transform: scale(1.2);
      opacity: 1;
    }

    100% {
      transform: scale(1);
      opacity: .8;
    }
}
</style>

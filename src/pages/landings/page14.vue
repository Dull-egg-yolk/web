
<template>
  <div class="page-body">
    <div class="home-page">
      <div class="top-img"><img src="@/assets/img/chatgomeetlogo.png" /> <span :class="isyou==='boy'?'boyactive':'girlactive'"></span> </div>
      <div class="page-top">
        <h2>Welcome to the GoMeet video chat</h2>
        <div>
            <p><span style="color:#2776FF">Men</span> are randomly paired with <span style="color:#FF2E93">women</span>.</p>
            <p><span style="color:#FF2E93">Women</span> are randomly paired with <span style="color:#2776FF">men</span>.</p>
        </div>
        <h2>Click to start a chat!</h2>
        <div class="title">1 million members from 100+ countries!</div>
      </div>
      <div class="button">
        <div class="play" @click="goToPlay">Start Chatting</div>
      </div>
      <div class="chatvideo">
        <span></span>
        You will be asked to activate your camera.
      </div>
    </div>
    <transition name="slideUp">
        <div class="chat-selete" v-if="ishow" >
            <h2>You are…</h2>
            <div class="chat-main">
                <div class="boy" @click="setYou('boy')" :class="{'active' : isyou==='boy'}">
                    <div></div>
                    <span>Male</span>
                </div>
                <div class="girl"  @click="setYou('girl')" :class="{'active' : isyou==='girl'}">
                    <div></div>
                    <span>Female</span>
                </div>
            </div>
        </div>
    </transition>
  </div>
</template>
<script>
import { logReport } from '@/util/logReport';
import { mapState } from 'vuex';
import { getCountry } from '@/util/getCountry';
export default {
  data () {
    return {
      ishow: true,
      chatitem: 'Pick a Chat',
      isyou: '',
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
          from: 'gomeet-choose'
        }, window.$mObj.adData || {}),
      });
      window.$mObj.adData.lpName = 'gomeet-choose';
      localStorage.setItem('lpName', 'gomeet-choose');
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
      localStorage.setItem('LANDINGSPAGE', true);
    },
    setYou (item) {
      this.isyou = item;
      setTimeout(() => {
        this.ishow = false;
      }, 500);
    }
  },
  mounted () {
    getCountry('gomeet-choose');
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

  .home-page {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    background: url(~@/assets/img/lp3-20bg2.png) center center no-repeat;
    background-size: cover;
    position: relative;
    .top-img {
        display: flex;
          img{
            width: 110px;
            height: 30px;
          }
          span{
            width: 20px;
            height: 20px;
          }
      }
    .page-top {
      position: absolute;
      bottom: 30%;
      width: 100%;

      h2 {
        padding-top: 900px;
        padding: 30px 0 0 0;
        color: #fff;
        font-size: 56px;
        text-align: center;
        line-height: 50px;
      }

      p {
        padding: 5px 40px 10px 40px;
        text-align: center;
        font-size: 24px;
        margin-bottom: 40px;
      }
      .title{
        padding: 5px 40px 10px 40px;
        display: flex;
        justify-content: center;
        font-size: 18px;
        font-family: Helvetica-Light, Helvetica;
        font-weight: 300;
        color: #FFFFFF;
        line-height: 24px;
        .title-logo{
            width: 20px;
            height: 20px;
            background: url(~@/assets/img/titlebg-logo.png) center center no-repeat;
            background-size: cover;
            margin-right: 10px;
        }
      }
      .select{
        padding: 5px 40px 10px 40px;
        display: flex;
        justify-content: center;
        .select-main{
            width: 320px;
            height: 60px;
            background: #FFFFFF;
            border-radius: 6px;
            display: flex;
            justify-content: center;
            .select-left{
                flex: 1;
                padding-left: 10px;
                font-size: 22px;
                font-family: Helvetica;
                color: #ADBAC4;
                line-height: 60px;
            }
            .select-right{
                width: 60px;
                border-left: 1px solid #ccc;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                img{
                    display: block;
                    width: 20px;
                }
            }
        }
      }
    }

    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      bottom: 20%;
      width: 100%;

      .play {
        width: 320px;
        height: 55px;
        border-radius: 6px;
        color: #fff;
        line-height: 55px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        background: #FF2E93;
        animation: callIconAni 2s infinite;
      }
    }
  }
  .chat-selete{
    position: fixed;
    background:#FDF6FF ;
    // filter: blur(50px);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    h2{
        font-size: 32px;
        color: #000;
        position: absolute;
        top: 20%;
    }
    .chat-main{
        width: 100%;
        height: auto;
        padding: 10px 20px;
        border-radius: 10px;
        display: flex;
        justify-content: space-around;
        >div{
            display: flex;
            flex-direction: column;
            color: #000;
            align-items: center;
            span{
                font-size: 18px;
            }
        }
       .boy>div{
            width: 120px;
            height: 120px;
            background: url(~@/assets/img/boy.png) center center no-repeat;
            background-size: cover;
       }
       .boy.active>div{
            width: 120px;
            height: 120px;
            background: url(~@/assets/img/isboy.png) center center no-repeat;
            background-size: cover;
       }
       .girl>div{
            width: 120px;
            height: 120px;
            background: url(~@/assets/img/girl.png) center center no-repeat;
            background-size: cover;
       }
       .girl.active>div{
            width: 120px;
            height: 120px;
            background: url(~@/assets/img/isgirl.png) center center no-repeat;
            background-size: cover;
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
      background:#FDF6FF ;
      background-size: cover;
      position: relative;

      .top-img {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        background: #fff;
          img{
            width: 110px;
            height: 30px;
          }
          span{
            width: 30px;
            height: 30px;
          }
          .boyactive{
            background: url(~@/assets/img/isboy.png) center center no-repeat;
            background-size: cover;
          }
          .girlactive{
            background: url(~@/assets/img/isgirl.png) center center no-repeat;
            background-size: cover;
          }
      }

      .page-top {
        position: absolute;
        bottom: 20%;

        h2 {
          padding-top: 900px;
          padding: 30px 0 0 0;
          color: #000;
          font-size: 26px;
          text-align: center;
          line-height: 50px;
          margin-bottom: 20px;
        }

        p {
          padding: 5px 40px 10px 40px;
          text-align: center;
          font-size: 14px;
          margin-bottom: 0;
          color: #000;
        }
       .title{
        padding: 5px 60px 10px 60px;
        display: flex;
        justify-content: center;
        font-size: 14px;
        font-family: Helvetica-Light, Helvetica;
        font-weight: 300;
        color: #000;
        line-height: 24px;
        .title-logo{
            width: 20px;
            height: 20px;
            background: url(~@/assets/img/titlebg-logo.png) center center no-repeat;
            background-size: cover;
            margin-right: 10px;
        }
      }
      .select{
        padding: 5px 60px 10px 60px;
        display: flex;
        justify-content: center;
      }
      }

      .button {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: 70px;
        width: 100%;

        .play {
          width: 250px;
          height: 55px;
          border-radius: 6px;
          color: #fff;
          line-height: 55px;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          background: #FF2E93;
          animation: callIconAni 2s infinite;
        }
      }
      .chatvideo{
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: 30px;
        width: 100%;
        font-size: 14px;
        font-family: Futura-Medium, Futura;
        font-weight: 500;
        color: #D3D3D3;
        span{
            width: 21px;
            height: 15px;
            margin-right: 5px;
            background: url(~@/assets/img/chatvideo.png) center center no-repeat;
            background-size: cover;
        }
      }
    }
    .chat-selete{
    position: fixed;
    background:#FDF6FF ;
    // filter: blur(50px);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    h2{
        font-size: 32px;
        color: #000;
        position: absolute;
        top: 20%;
    }
    .chat-main{
        width: 100%;
        height: auto;
        padding: 10px 20px;
        border-radius: 10px;
        display: flex;
        justify-content: space-around;
        >div{
            display: flex;
            flex-direction: column;
            color: #000;
            align-items: center;
            span{
                font-size: 18px;
            }
        }
       .boy>div{
            width: 120px;
            height: 120px;
            background: url(~@/assets/img/boy.png) center center no-repeat;
            background-size: cover;
       }
       .boy.active>div{
            width: 120px;
            height: 120px;
            background: url(~@/assets/img/isboy.png) center center no-repeat;
            background-size: cover;
       }
       .girl>div{
            width: 120px;
            height: 120px;
            background: url(~@/assets/img/girl.png) center center no-repeat;
            background-size: cover;
       }
       .girl.active>div{
            width: 120px;
            height: 120px;
            background: url(~@/assets/img/isgirl.png) center center no-repeat;
            background-size: cover;
       }
    }
  }
  }
}
</style>

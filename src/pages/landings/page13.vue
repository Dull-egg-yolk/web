
<template>
  <div class="page-body">
    <div class="home-page">
      <div class="top-img"><img src="@/assets/img/langding-gomeet.png" /></div>
      <div class="page-top">
        <h2>Free video chat</h2>
        <p>Looking for a great online video chat platform？ Here it is. Tap to start now!</p>
        <div class="title"><span class="title-logo"></span> Popular Random Chat Rooms</div>
        <div class="select">
            <div class="select-main" @click="ishow=true">
                <div class="select-left" :class="{'chatitem':chatitem!='Pick a Chat'}">{{ chatitem }}</div>
                <div class="select-right"><img src="@/assets/img/selectbg.png" alt=""></div>
            </div>
        </div>
      </div>
      <div class="button">
        <div class="play" @click="goToPlay">Go to play</div>
      </div>
    </div>
    <transition name="slideUp">
        <div class="chat-selete" v-if="ishow" >
        <div class="chat-main">
            <h2>Pick a Chat <span class="icon-cross" @click="ishow=false"></span></h2>
            <div class="chat-list">
                <div class="chat-item" v-for="(item,index) in chatlist" :key="index" @click="setchat(item)"><span class="dh" :class="{'dh2': index===2 ||index===7 }"></span>{{ item.name  }}<img src="@/assets/img/selectbg.png" alt=""></div>
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
      ishow: false,
      chatitem: 'Pick a Chat',
      chatlist: [
        {
          name: 'Video Chat'
        },
        {
          name: 'Anonymous Chat'
        },
        {
          name: 'Private Calls'
        },
        {
          name: 'Chat with Girls'
        },
        {
          name: 'Roleplay Chat '
        },
        {
          name: 'Cam to Cam'
        },
        {
          name: 'Text Chat'
        },
        {
          name: 'Free Video Calls'
        },
        {
          name: 'Online Dating'
        },
        {
          name: 'Nearby Dating'
        },
        {
          name: 'Video Dating'
        }
      ]
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
          from: 'gomeet-camtocam'
        }, window.$mObj.adData || {}),
      });
      window.$mObj.adData.lpName = 'gomeet-camtocam';
      localStorage.setItem('lpName', 'gomeet-camtocam');
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
      localStorage.setItem('LANDINGSPAGE', true);
    },
    setchat (item) {
      this.chatitem = item.name;
      this.ishow = false;
    }
  },
  mounted () {
    getCountry('gomeet-camtocam');
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
    background: url(~@/assets/img/lp3-20bg3.png) center center no-repeat;
    background-size: cover;
    position: relative;
    .top-img {
        position: absolute;
        left: 5%;
        top: 2%;
        width: 145px;
        height: 45px;
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
            .chatitem{
              color:#000
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
        color: #0A070F;
        line-height: 55px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        background: linear-gradient(90deg, #FF78FF 0%, #32E5FF 100%);
        animation: callIconAni 2s infinite;
      }
    }
  }
  .chat-selete{
    position: fixed;
    background: rgba(0,0,0,0.34);
    // filter: blur(50px);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .chat-main{
        width: 30%;
        height: auto;
        padding: 20px 0;
        background: #FFFFFF;
        border-radius: 10px;
        h2{
            font-size: 28px;
            font-family: Futura-Bold, Futura;
            font-weight: bold;
            color: #E52525;
            text-align: center;
            padding: 20px 0;
            position: relative;
            .icon-cross{
                position: absolute;
                right: 5%;
                top: 30%;
                color: #666;
                font-size: 18px;
                cursor: pointer;
            }
        }
        .chat-list{
            padding: 10px;
            display: flex;
            flex-wrap: wrap;
            color: #000;
            font-size: 18px;
            height: 500px;
            overflow: scroll;
            .chat-item{
                width: 100%;
                padding: 10px 0 10px 0px;
                // position: relative;
                display: flex;
                border-bottom:1px solid #979797;
                position: relative;
                cursor: pointer;
                .dh{
                    width: 36px;
                    height: 30px;
                    // position: absolute;
                    background: url(~@/assets/img/chatdh.png) center center no-repeat;
                    background-size: cover;
                    margin-right: 10px;
                }
                .dh2{
                    width: 36px;
                    height: 30px;
                    // position: absolute;
                    background: url(~@/assets/img/chat-vip.png) center center no-repeat;
                    background-size: cover;
                    margin-right: 10px;
                }
                img{
                    position: absolute;
                    right: 0px;
                    width: 20px;
                    top: 15px;
                    transform: rotate(-90deg);
                }
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
      background: url(~@/assets/img/lp3-20bg1.jpg) center center no-repeat;
      background-size: cover;
      position: relative;

      .top-img {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
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
        bottom: 140px;

        h2 {
          padding-top: 900px;
          padding: 30px 0 0 0;
          color: #fff;
          font-size: 30px;
          text-align: center;
          line-height: 50px;
        }

        p {
          padding: 5px 40px 10px 40px;
          text-align: center;
          font-size: 14px;
          margin-bottom: 10px;
          font-family: Helvetica;
        }
       .title{
        padding: 5px 60px 10px 60px;
        display: flex;
        justify-content: center;
        font-size: 14px;
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
        padding: 5px 60px 10px 60px;
        display: flex;
        justify-content: center;
        .select-main{
            width: 320px;
            height: 50px;
            background: #FFFFFF;
            border-radius: 6px;
            display: flex;
            justify-content: center;
            .select-left{
                flex: 1;
                padding-left: 10px;
                font-size: 18px;
                font-family: Helvetica;
                color: #ADBAC4;
                line-height: 50px;
            }
            .chatitem{
              color:#000
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
        bottom: 70px;
        width: 100%;

        .play {
          width: 250px;
          height: 55px;
          border-radius: 6px;
          color: #0A070F;
          line-height: 55px;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          background: linear-gradient(90deg, #FF78FF 0%, #32E5FF 100%);
          animation: callIconAni 2s infinite;
        }
      }
    }
    .chat-selete{
    position: fixed;
    background: rgba(0,0,0,0.34);
    // filter: blur(50px);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .chat-main{
        width: 80%;
        height: auto;
        padding: 10px 0;
        background: #FFFFFF;
        border-radius: 10px;
        h2{
            font-size: 28px;
            font-family: Futura-Bold, Futura;
            font-weight: bold;
            color: #E52525;
            text-align: center;
            padding: 20px 0;
            position: relative;
            padding: 10px 0;
            font-size: 20px;
            .icon-cross{
                position: absolute;
                right: 5%;
                top: 10%;
                color: #666;
                font-size: 14px;
                cursor: pointer;
            }
        }
        .chat-list{
            padding: 10px;
            display: flex;
            flex-wrap: wrap;
            color: #000;
            font-size: 18px;
            height: 320px;
            overflow: scroll;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            .chat-item{
                width: 100%;
                padding: 5px 0 5px 0px;
                // position: relative;
                display: flex;
                border-bottom:1px solid #979797;
                position: relative;
                cursor: pointer;
                .dh{
                    width: 36px;
                    height: 30px;
                    // position: absolute;
                    background: url(~@/assets/img/chatdh.png) center center no-repeat;
                    background-size: cover;
                    margin-right: 10px;
                }
                .dh2{
                    width: 36px;
                    height: 30px;
                    // position: absolute;
                    background: url(~@/assets/img/chat-vip.png) center center no-repeat;
                    background-size: cover;
                    margin-right: 10px;
                }
                img{
                    position: absolute;
                    right: 0px;
                    width: 20px;
                    top: 15px;
                    transform: rotate(-90deg);
                }
            }
        }
    }
  }
  }
}
</style>

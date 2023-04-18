
<template>
  <div class="page-body">
    <div class="home-page" v-if="choose==='hp1'">
      <div class="top-img"><img src="@/assets/img/langding-gomeet.png" /></div>
      <div class="page-top">
        <h2>Free video chat</h2>
        <p>Looking for a great online video chat platform？ Here it is. Tap to start now!</p>
        <div class="title"><span class="title-logo"></span> Popular Random Chat Rooms</div>
        <div class="select">
            <div class="select-main" @click="ishow2=true">
                <div class="select-left" :class="{'chatitem':chatitem!='Pick a Chat'}">{{ chatitem }}</div>
                <div class="select-right"><img src="@/assets/img/selectbg.png" alt=""></div>
            </div>
        </div>
      </div>
      <div class="button">
        <div class="play" @click="choose='hp2'">Go Choose</div>
      </div>
    </div>
    <div class="home-page2"  v-if="choose==='hp2'">
      <div class="title">
        <div class="nav"><img :src="hostData.headImg" /></div>
        <div>
          <div>{{ hostData.name }}, {{ hostData.birthday | calculateAge }} <span>online</span></div>
          <div><country :countryId="hostData.countryId" type="all"></country></div>
        </div>
      </div>
      <div class="botton">
        <h2>Choose her?</h2>
        <div class="npdiv">
          <div class="next-div" @click="nextVideo">
            <div class="next">Next</div>
          </div>
          <div class="call-div" @click="goToPlay">
            <div class="call">Yes</div>
          </div>
        </div>
      </div>
      <img id="yjzimg" :src="videoListLop[curHostIdx].headImg" alt="" style="object-fit: cover;width: 100%;height: 100%;">
      <video loop  muted id="video"
        style="object-fit: cover; width: 100%; height: 100%;" x5-video-player-type="h5"
        x5-video-orientation="portraint" :src="hostData.videoUrl">
      </video>
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
    <transition name="slideUp">
        <div class="chat-selete2" v-if="ishow2" >
            <div class="chat-main">
                <h2>Pick a Chat <span class="icon-cross" @click="ishow2=false"></span></h2>
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
import { calculateAge } from '@/filters';
import { getCountry } from '@/util/getCountry';
import { videoListLop } from './p1';
import CanvasProgress from '@/util/canvasProgress';
export default {
  data () {
    return {
      ishow: true,
      ishow2: false,
      chatitem: 'Pick a Chat',
      isyou: '',
      choose: 'hp1',
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
      ],
      videoListLop,
      curHostIdx: 1,
      lp: null,
      djs: 10
    };
  },

  components: {},
  filters: {
    calculateAge,
  },

  watch: {
    hostData (n) {
      console.log(n);
      this.setimg();
    },
    choose (n) {
      if (n === 'hp2') {
        this.$nextTick(() => {
          this.setimg();
        });
      }
    },
  },

  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin
    }),
    hostData () {
      if (!this.videoListLop.length) {
        return {};
      }
      return this.videoListLop[this.curHostIdx];
    }
  },

  methods: {
    goToPlay () {
      logReport({
        eventId: '106-6-1-1',
        free_name2: Object.assign({
          from: 'gomeet-video'
        }, window.$mObj.adData || {}),
      });
      window.$mObj.adData.lpName = 'gomeet-video';
      localStorage.setItem('lpName', 'gomeet-video');
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
      localStorage.setItem('LANDINGSPAGE', true);
    },
    setchat (item) {
      this.chatitem = item.name;
      this.ishow2 = false;
    },
    nextVideo () {
      this.nextCard();
    },
    setYou (item) {
      this.isyou = item;
      setTimeout(() => {
        this.ishow = false;
      }, 500);
    },
    nextCard () {
      if (this.curHostIdx === 4) {
        this.goToPlay();
      } else {
        this.curHostIdx += 1;
      }
    },
    setimg () {
      document.querySelector('#yjzimg').style.display = 'block';
      setTimeout(() => {
        document.querySelector('#video').play();
        document.querySelector('#yjzimg').style.display = 'none';
        document.querySelector('#yjzimg').setAttribute('src', this.videoListLop[this.curHostIdx - 1].headImg);
        console.log('play');
      }, 2000);
      clearTimeout(this.err);
      this.err = setTimeout(() => {
        this.nextCard();
      }, 10000);
    },
    cutNum () {
    },
  },
  mounted () {
    getCountry('gomeet-video');
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
        font-size: 46px;
        text-align: center;
        line-height: 50px;
      }

      p {
        padding: 5px 40px 10px 40px;
        text-align: center;
        font-size: 18px;
        margin-bottom: 20px;
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
  .chat-selete2{
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
  .home-page2 {
    height: 100%;
    .video-add {
      position: fixed;
      right: 10px;
      width:48px;
      height:48px;
      border-radius: 50%;;
      overflow:hidden;
      font-size:0;
      .time-list{
        transition: transform 1s;
      }
      .time-list span{
        display:flex;
        width:48px;
        height:48px;
        font-size: 26px;
        font-weight:bold;
        align-items: center;
        justify-content: center;
        color: #f01111;
      }
    }
    .title {
      position: absolute;
      top: 20px;
      left: 20px;
      display: flex;
      align-items: center;
      color: #fff;
      .nav {
        padding-right: 10px;
        img {
          width: 50px;
          height: 50px;
          border-radius: 25px;
          object-fit: cover;
        }
      }
    }

    .botton {
      position: absolute;
      bottom: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 90%;
      left: 50%;
      transform: translateX(-50%);
      z-index:99;
      background: rgba(0,0,0,0.3);
      border-radius: 21px;
      padding: 10px 0px;
      box-sizing: border-box;
      h2{
        margin-bottom: 20px;
        font-size: 26px;
      }
      .npdiv{
        display: flex;
        justify-content: space-around;
        width: 100%;
      }
      .next-div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 40%;
        .text {
          color: #fff;
          font-size: 16px;
          padding-top: 10px;
        }
        .next {
          background: rgba(0,0,0,0.55);
          border-radius: 28px;
          border: 1px solid #000000;
          padding: 10px 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          width: 100%;
          font-size: 20px;
          img{
            height: 50px;
          }
        }
      }
      .call-div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 40%;
        .text {
          color: #fff;
          font-size: 16px;
          padding-top: 10px;
        }
        .call {
          background: rgba(81,238,17,0.55);
          border-radius: 28px;
          border: 1px solid #42FF00;
          padding: 10px 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          width: 100%;
          font-size: 20px;
          img {
            height: 50px;
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
  .chat-selete2{
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

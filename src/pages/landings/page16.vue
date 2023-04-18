<template>
  <div class="page-body">
    <div class="home-page">
      <div class="top-img"><img src="@/assets/img/langding-gomeet.png" /></div>
      <div class="livcam-banner" >
        <div class="jump-out" i-if="isanimation">
          <div v-for="(item,index) in 7" :key="index" class="imgs" :class="`imgs${index+1}`" ref="imgs">
            <img v-for="(item) in bubbleArr" :key="item.index" :src="item.url" :data-id="item.id"/>
          </div>
        </div>
      </div>
      <div class="livcam-content">
        <div class="livcam-title">{{$t('webChat.lcTitle')}}</div>
        <p class="livcam-txt" >{{$t('webChat.matchDesc')}}</p>
        <div class="livcam-call">
          <!-- 搜索框 -->
          <div class="mfilter-box">
            <!-- 性别筛选列表 -->
            <div class="gender-list"  >
              <div class="the-list fx-c">
                <div class="og fx-c" v-for="(item, index) in genderList" :key="index" :class="{cur: item.id === gender}" @click="csGender(item.id)">
                  <div class="img" :class="[`img${item.id}`]"></div>
                  {{item.txt}}
                </div>
              </div>
            </div>
          </div>
         <div class="user-call fx-c" @click="goToPlay"><span class="icon-video2"></span>Go to play</div>
        </div>
      </div>
    </div>
    <div class="gomeet-random-page">
      <div class="header-top">
        <div class="random-page-header">
          <div class="left">
            <h1>Random Video Chat</h1>
            <p>Instant video chat with strangers on GoMeet, packed with more features than any other random chat site.
            </p>
          </div>
          <div class="right">
            <div class="random-page-img">
              <img src="https://h5.livuchat.com/static/images/gomeet-two.png" />
            </div>
          </div>
        </div>
      </div>
      <div class="content-top">
        <div class="random-page-content">
          <div>
            <div class="con-txt">
              <h2 class="s-title">Join video chat with thousands of other strangers online</h2>
              <div class="s-desc">
                <p>
                  With GoMeet you can connect with millions of users logging into the site every month. Our live video
                  chat
                  feature allows you to instantly connect with new friends around the globe. We also offer an instant
                  messaging service so you can communicate with your new friend before meeting them face to face.
                </p>
              </div>
            </div>
            <div class="random-img">
              <img src="https://h5.livuchat.com/static/images/gomeet-one.png" />
            </div>
            <div class="con-txt">
              <h2 class="s-title">Random Video Chat with Strangers</h2>
              <div class="s-desc">
                <p>
                  Stranger chat is enormously popular and convenient, giving you the ability to talk with people from all
                  around the world. By using GoMeet, you can easily find someone who shares similar interests and
                  experiences as you. You can make new friends in no time and explore different cultures from anywhere in
                  the world.
                </p>
              </div>
            </div>
            <div class="content-img">
              <img class="gomeet-three" src="https://h5.livuchat.com/static/images/gomeet-three.png" />
              <img class="emoji" src="https://h5.livuchat.com/static/images/emoji.png" />
            </div>
          </div>
        </div>
      </div>
      <div class="footer-top">
        <div class="random-page-footer">
          <div class="con-txt footer-left">
            <h2 class="s-title">Why Choose GoMeet?</h2>
            <div class="s-desc">
              <p>
                GoMeet is an innovative platform that provides users with a secure and anonymous environment to connect
                with
                strangers. Our team of developers is constantly working on providing an improved user experience, making
                GoMeet one of the most reliable, safe, and enjoy random video chat sites out there. With features like
                video
                filters, random video chat, and more, you never have to worry about having a dull conversation with
                someone
                new. GoMeet takes the guesswork out of meeting strangers online, so all you need to do is just start
                chatting!
              </p>
            </div>
          </div>
          <div class="con-txt">
            <h2 class="s-title">Random Video Chat Features</h2>
            <div class="s-desc">
              <p>
                Random video chat includes the ability to increase your webcam to full screen, HD quality webcam
                connections, and blazing fast upload/download speeds.
              </p>
            </div>
          </div>
          <div class="con-txt">
            <h2 class="s-title">Effortless Video Chat with Strangers</h2>
            <div class="s-desc">
              <p>
                It's simple to use our random video chat site with only two steps: first, press the "Start" button, then
                enable access to your webcam when prompted. We made sure to make our video chat even easier to use by
                keeping it as straightforward as possible so you can focus on connecting with strangers and having fun
                while
                using our random chat website.
              </p>
            </div>
          </div>
          <div class="random-header-btn"  @click="goToPlay">
              <a class="btn btn-gomeet">
                <span class="icon-video2"></span>
                <div>Go to play</div>
              </a>
          </div>
        </div>
      </div>
      <div class="reserves-top">
        <div class="footer-reserves">
          <div class="con-txt">
            <h2 class="s-title">15 reasons for using GoMeet's Random Video Chat</h2>
            <div class="s-desc">
              <p>1.To make friends!
                2.To get to know people who live near you.
                3.To meet new people.
                4.To have fun!
                5.To learn about yourself.
                6.To find out what's going on around you.
                7.To practice speaking English.
                8.To improve your vocabulary.
                9.To help others.
                10.To share experiences.
                11.To understand how different cultures think.
                12.To learn something new.
                13.To express yourself.
                14.To relax.
                15.To laugh at yourself.</p>
              <p style="margin-top: 20px">
                GoMeet is your ultimate destination for random video chat! Come join us today and start making new friends
                from all around the world! With our easy-to-use platform, you'll be meeting strangers in no time! Sign up
                now and start chatting!
              </p>
            </div>
          </div>
          <div class="reserves">All rights reserved © Clash Arts HK Limited 2022</div>
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
      isanimation: false,
      genderList: [
        {
          id: 0,
          txt: this.$t('app.match_both'),
        },
        {
          id: 2,
          txt: this.$t('base.female'),
        },
        {
          id: 1,
          txt: this.$t('base.male'),
        }
      ],
      bubbleArr: [
        {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a1.png',
          id: 1
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a2.png',
          id: 2
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a3.png',
          id: 3
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a4.png',
          id: 4
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a5.png',
          id: 5
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a6.png',
          id: 6
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a7.png',
          id: 7
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a8.png',
          id: 8
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a9.png',
          id: 9
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a10.png',
          id: 10
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a11.png',
          id: 11
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a12.png',
          id: 12
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a13.png',
          id: 13
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a14.png',
          id: 14
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a15.png',
          id: 15
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a16.png',
          id: 16
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a17.png',
          id: 17
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a18.png',
          id: 18
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a19.png',
          id: 19
        }, {
          url: 'https://h5.livuchat.com/static/images/web/landpage/lp3-24a20.png',
          id: 20
        }
      ],
      timer: null,
      switchNum: 0,
      imgArr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      aniDelay: [0, 0.15, 0.2, 0.25, 0.3, 0.24, 0.1],
      gender: 2,
    };
  },

  components: {},
  watch: {
    isanimation () {
      this.$nextTick(() => {
        this.dom = document.querySelector('.jump-out');
        this.boxs = this.dom.querySelectorAll('.imgs');
        this.initAni();
        this.setImg();
        this.timer2 = setTimeout(() => {
          this.rollAni();
        }, 3500);
      });
    }
  },

  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin
    })
  },

  methods: {
    goToPlay () {
      logReport({
        eventId: '106-6-1-1',
        free_name2: Object.assign({
          from: 'gomeet-onlinechat'
        }, window.$mObj.adData || {}),
      });
      window.$mObj.adData.lpName = 'gomeet-onlinechat';
      localStorage.setItem('lpName', 'gomeet-onlinechat');
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
      localStorage.setItem('LANDINGSPAGE', true);
    },
    getRandomImg () {
      const idx = Math.floor(Math.random() * this.imgArr.length);
      const ta = this.imgArr.slice();
      const ix = ta.splice(idx, 1)[0];
      this.imgArr = ta;
      // console.log(ix, '====');
      return ix;
    },
    initAni () {
      this.boxs.forEach((node, index) => {
        const img = node.querySelectorAll('img');
        const nidx = this.getRandomImg();
        const nidx2 = this.getRandomImg();
        img[nidx].setAttribute('class', 'img1');
        img[nidx].setAttribute('data-id', nidx);
        img[nidx2].setAttribute('class', 'img2');
        img[nidx2].setAttribute('data-id', nidx2);
        img[nidx].setAttribute('style', `animation: showAni .4s ${this.aniDelay[index]}s both`);
      });
    },
    setImg () {
      this.boxs.forEach(node => {
        const img = node.querySelectorAll('img');
        const name = this.switchNum ? 'img1' : 'img2';
        const nidx = this.getRandomImg();
        const oimg = node.querySelector('.' + name);
        const idx = oimg.getAttribute('data-id');
        if (idx) {
          this.imgArr.push(idx);
        }
        oimg.setAttribute('class', '');
        oimg.setAttribute('data-id', '');
        img[nidx].setAttribute('class', name);
        img[nidx].setAttribute('data-id', nidx);
      });
    },
    rollAni () {
      this.boxs.forEach((node, index) => {
        const showImg = node.querySelector(this.switchNum ? '.img1' : '.img2');
        const hideImg = node.querySelector(this.switchNum ? '.img2' : '.img1');
        showImg.setAttribute('style', `animation: showAni .4s ${this.aniDelay[index] + 0.4}s both`);
        hideImg.setAttribute('style', `animation: hideAni .4s ${this.aniDelay[index]}s both`);
      });
      this.switchNum = !this.switchNum ? 1 : 0;
      this.timer = setTimeout(() => {
        this.setImg();
        this.rollAni();
      }, 4000);
    },
    csGender (item) {
      this.gender = item;
    }
  },
  mounted () {
    getCountry('gomeet-onlinechat');
    setTimeout(() => {
      this.isanimation = true;
    }, 1000);
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
    background-color: #000;
    padding: 0 20px;
    .home-page  {
    height: 100%;
    max-width: 1500px;
    margin:0 auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: row-reverse;
    flex-shrink: 0;
    position: relative;
    background: #000;
    flex-direction: column;

    .top-img {
        width: 100%;
        display: flex;
        justify-content: center;
        background: #17161F;
        height: 50px;
        padding: 10px 0;
        position: absolute;
        z-index: 99;
        img{
          display: block;
          width: 150px;
          height: auto;
        }
      }
    .livcam-banner {
      height: 100%;
      width:50%;
      position: relative;
      overflow: hidden;
      &::after{
          content: '';
          position: absolute;
          width:100%;
          height:100%;
          top:0;
          left:0;
          background: linear-gradient(180deg, #0A070F 0%, rgba(10,7,15,0.4) 15%, rgba(10,7,15,1) 75%, #0A070F 100%);
          z-index:2;
        }
      .con-num {
        width:100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        border-radius: 20px;
        display: table;
        .bg {
          margin-top: 10px;
        }
        .obg{
          display:table-cell;
          overflow: hidden;
          padding: 0 2%;
          width:33%;
          box-sizing: border-box;
        }
        img{
          display:block;
          width: 100%;
          float: left;
        }
        .bg-down {
          animation: to-down 70s infinite linear;
        }

        .bg-up {
          animation: to-top 70s infinite linear;
        }
      }
    }
    .livcam-content {
      flex:1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      .livcam-title {
        font-size: 65px;
        font-weight: bolder;
        color:#fff;
        display: inline-block;
        animation: slideDown 0.5s .2s both;
      }
      .livcam-txt {
        font-size: 22px;
        color: #FFF2F2;
        max-width: 420px;
        text-align: center;
        opacity: 0;
        animation: slideDown 0.5s .5s both;

      }

      .livcam-call {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        animation: slideUp 0.5s 1s both;
        width:100%;

        .mfilter-box{
          position: relative;
          z-index: 10;
          width: 100%;
          margin-bottom: 20px;
          // background: #000000a3;
          // backdrop-filter: blur(10px);

          .mf-btn{
            margin:0 auto;
            width: 320px;
            height:75px;
            margin-bottom:20px;
            border:solid 2px rgba(255,255,255,1);
            box-sizing: border-box;
            border-radius: 100px;
            padding:0 20px;
            cursor: pointer;
          }

          .the-avatar{
            width:44px;
            height:44px;
            margin-right: 20px;
            background-position: center;
            background-size: 100%;
            margin-right:10px;
            &.img0{
              background-image:url(~@/assets/img/icon-gd-0.png)
            }
            &.img1{
              background-image:url(~@/assets/img/icon-gd-1.png)
            }
            &.img2{
              background-image:url(~@/assets/img/icon-gd-2.png)
            }

          }
          .f-txt{
            flex:1;
            font-size:16px;
          }
          .icon-drop-down{
            font-size:12px;
            transform: scale(.75);
          }
          .gender-list{
            background:transparent;
            padding:20px;
            .the-title{
              font-size:16px;
              padding-bottom:10px;
            }
            .og{
              height: 56px;
              box-sizing: border-box;
              padding:0 30px;
              border:solid 1px rgba(255,255,255,.25);
              border-radius: 100px;
              font-size:16px;
              &:nth-child(2) {
                margin: 0 10px;
              }
              &.cur{
                background: linear-gradient(90deg, #FF78FF 0%, #32E5FF 100%);
                color: #000;
                border:0;
              }
              .img{
                width:24px;
                height: 24px;
                background-position: center;
                background-size: 100%;
                margin-right:10px;
                &.img0{
                  background-image:url(~@/assets/img/icon-gd-0.png)
                }
                &.img1{
                  background-image:url(~@/assets/img/icon-gd-1.png)
                }
                &.img2{
                  background-image:url(~@/assets/img/icon-gd-2.png)
                }
              }
            }
          }
        }
        .user-call {
          width: 320px;
          height: 75px;
          padding: 0 15px;
          box-sizing: border-box;
          color: #000;
          background: linear-gradient(90deg, #FF78FF 0%, #32E5FF 100%);
          border-radius: 100px;
          cursor: pointer;
          font-weight: bold;
          animation: callIconAni 2s infinite;
          font-size: 22px;
          .icon-video2 {
            font-size: 30px;
            margin-right: 10px;
          }
        }
      }
      .livcam-call-limit {
        margin-top: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #90B2FF;

        .limit-time {
          font-size: 68px;
          font-weight: bold;
        }

        .limit-desc {
          font-size: 18px;
          font-weight: 500;
          padding: 0 27px;
          flex-direction: column;

          p{
            margin: 0 0 20px 0;
            font-size: 26px;
            text-align: center;
          }
          .limit-txt-big {
            font-size: 30px;
            padding: 10px 0;
            margin-bottom: 30px;
            color: #fff;
          }
        }
        .btn-limit {
          width: 320px;
          height: 75px;
          padding: 0 15px;
          box-sizing: border-box;
          color: #000;
          background: linear-gradient(90deg, #FF78FF 0%, #32E5FF 100%);
          border-radius: 100px;
          cursor: pointer;
          font-weight: bold;
          -webkit-animation: callIconAni 2s infinite;
          animation: callIconAni 2s infinite;
          font-size: 22px;
        }
      }
    }
    .livcam-popUp {
      position: absolute;
      top: 50px;
      left: 50%;
      transform: translate(-50%,-50%);
      .livcam-popbanner {
        // background:url(~@/assets/img/pop-banner.png) center center no-repeat;
        // background-size: 100% 100%;
        // backdrop-filter: blur(10px);
        // display: flex;
        // justify-content: center;
        // align-items: center;
        height: 60px;
        // border: solid 1px rgba(50, 229, 255, 0.35);
        // border-radius: 30px;
        // padding: 0 30px;
        position: relative;
        img {
          width: 500px;
          display: block;
        }
        .title-box {
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 100%;
          left: 27%;
        }
        .title {
          font-size: 14px;
          font-family: Futura-Bold, Futura;
          font-weight: bold;
          color: #FFFFFF;
          min-width: 260px;
        }
        .title1 {
          font-size: 14px;
          font-family: Futura-Bold, Futura;
          font-weight: bold;
          color: #FFFFFF;
          text-align: left;
        }
        .coin{
          margin:0 10px 0 15px;
          // color: #FF6939;
          color: transparent;
          -webkit-text-fill-color: #FF6939;
          font-family:Impact,Futura;
          font-size: 24px;
          font-weight: bold;
          font-style:italic;
          -webkit-text-stroke: #fff;
        }
        .img {
          img{
            width: 30px;
          }
        }
      }
    }
    @keyframes to-top {
      0%{
        transform: translateY(0);
      }
      100%{
        transform: translateY(-50%)
      }
    }
    @keyframes to-down {
      0%{
        transform: translateY(-50%);
      }
      100%{
        transform: translateY(0%)
      }
    }

}
}
html body,
      h1,
      h2,
      p {
        margin: 0;
        padding: 0;
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
    background-color: #000;
    padding: 0;
      .home-page {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        box-sizing: border-box;
        background: #000;
        background-size: cover;
        position: relative;
        padding-top: 50px;
      .top-img {
        align-items: center;
        position: fixed;
        padding: 0;
        top:0;
        img{
          display: block;
          width: auto;
          height: 30px;
        }
      }
      .livcam-banner {
        width: 100%;
        overflow: hidden;
        .jump-out{
        position:absolute;
        width: 100%;
        height:100%;
        top:0;
        left:0;
        background:rgba(10,7,14,.8);
        opacity: 0;
        animation: fadeIn .4s 2s both;
        box-shadow: 0 0 20px rgba(0,0,0,1);

        .imgs{
          position: absolute;
          left:50%;
          top:50%;
          width: 200px;
          height: 200px;
          img{
            position:absolute;
            top:0;
            left:0;
            display:none;
            width:100% !important;
            height:100% !important;
            border-radius: 100%;
            box-shadow: 0 0 20px rgba(0,0,0,1);
          }
          .img1{
            display:block;
            z-index: 2;
          }
          .img2{
            display:block;
            z-index: 2;
          }

        }
        .imgs1{
          width: 140px;
          height: 140px;
          margin-left: -225px;
          margin-top: -310px;
        }
        .imgs2{
          width: 80px;
          height: 80px;
          margin-left: -50px;
          margin-top: -294px;
        }
        .imgs3{
          width: 150px;
          height: 150px;
          margin-left: 40px;
          margin-top: -274px;
        }
        .imgs4{
          width: 180px;
          height: 180px;
          margin-left: -120px;
          margin-top: -184px;
        }
        .imgs5{
          width: 140px;
          height: 140px;
          margin-left: -260px;
          margin-top: -70px;
        }
        .imgs6{
          width: 190px;
          height: 190px;
          margin-left: -120px;
          margin-top: 20px;
        }
        .imgs7{
          width: 160px;
          height: 160px;
          margin-left: 60px;
          margin-top: -94px;
        }

        .icon-tips{
          position:absolute;
          top:50%;
          left:50%;
          margin-top: -190px;
          margin-left: 90px;
          width:80px;
          height:80px;
          animation: showTip .3s 3s both;
          .icon{
            width:100%;
            height:100%;
            background:url(~@/assets/img/icon-lc-tips.png) center no-repeat;
            background-size: 100% auto;
            animation: tipAni 2s 3.5s both infinite;
            transform-origin: center bottom;
          }
        }
      }

        &::after{
          content: '';
          background:#f00;
          position: absolute;
          width:100%;
          height:100%;
          top:0;
          left:0;
          background: linear-gradient(180deg, #0A070F 0%, rgba(10,7,15,0.4) 15%, rgba(10,7,15,1) 75%, #0A070F 100%);
          z-index:2;
        }
        .con-num{
          border-radius: 10px;
        }
      }
      .livcam-content {
        position: absolute;
        bottom:0;
        width: 100%;
        z-index:10;
        .livcam-title{
          font-size:40px;
        }
        .livcam-txt{
          font-size: 14px;
          max-width: 300px;
        }
        .livcam-call{
          padding-bottom: 50px;

          .mfilter-box{
            .mf-btn{
              width:240px;
              height:55px;
              border-width: 1px;
              padding:0 10px;
            }

            .gender-list{
              width:100%;
              box-sizing: border-box;
              transform:translateX(0);
              background:transparent;
              padding:15px;
              .the-title{
                font-size:14px;
              }
              .the-list{
                .og{
                  width: 30%;
                  font-size:14px;
                  padding:0;
                  height: 50px;
                }
              }
            }
          }
          .user-call{
            height:55px;
            width: 240px;
            font-size: 16px;
            padding: 0 15px;
            box-sizing: border-box;
            .icon-video2{
              font-size:20px;
            }
          }
        }

        .livcam-call-limit {
          margin-top: 0;
          padding-bottom: 50px;

          .limit-time {
            font-size: 38px;
            line-height: 50px;
          }

          .limit-desc {
            margin-top: 9px;
            font-size: 11px;
            line-height: 14px;
            margin-bottom: 0;
            p{
              text-align: center;
              font-size:11px;
              margin-bottom: 0;
            }
            .limit-txt-big{
              font-size: 20px;
              margin-top: 12px;
              line-height: 20px;
              color: #fff;
              margin-bottom: 0;
            }
          }
          .btn-limit {
            width: 150px;
            height: 36px;
            background: linear-gradient(90deg, #FF78FF 0%, #32E5FF 100%);
            border-radius: 55px;
            text-align: center;
            color: #FFFFFF;
            font-size: 15px;
            margin-top: 20px;
          }
        }
      }
      .livcam-popUp {
        position: absolute;
        top: 60px;
        z-index: 99;
        width: 100%;
        .livcam-popbanner {
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 100%;
          }
          .title-box {
            display: flex;
            flex-direction: column;
            width: 80%;
            position: absolute;
            top: 33%;
            left: 18%;
          }
          .title {
            font-size: 12px;
            font-family: Futura-Bold, Futura;
            font-weight: bold;
            color: #FFFFFF;
            min-width: 122px;
            text-align: center;
            padding: 0 5px;
          }
          .title1 {
            font-size: 12px;
            font-family: Futura-Bold, Futura;
            font-weight: bold;
            color: #FFFFFF;
            min-width: 122px;
            text-align: center;
            padding: 0 5px;
          }
          .coin{
            margin:0 10px;
            color: transparent;
            -webkit-text-fill-color: #FF6939;
            font-size: 24px;
            font-weight: bold;
            font-style:italic;
            -webkit-text-stroke: #fff;
            text-shadow: 0 0 0 10px #fff;
          }
          .img {
            img{
              width: 24px;
            }
          }
        }
      }
      .box-entry-box {
        display: block;
      }
      }

      .gomeet-random-page {
        font-family: Futura-Medium, Futura;
        color: #ADAAE7;
        background-color: #000;
      }

      .content-top {
        background: #000;
        padding-bottom: 300px;
        margin-top: 100px;
      }

      .random-page-content {
        width: 100%;
        flex: 0 0 auto;
        position: relative;
        margin: 0 auto;
        max-width: 925px;
        display: flex;
      }

      .random-page-content .tags-text .s-desc {
        margin-bottom: 240px;
      }

      .random-page-content .con-txt {
        text-align: center;
        margin-top: 20px;
      }

      .random-page-content .con-txt .s-title {
        color: #DDD8FF;
        font-size: 42px;
        font-weight: bold;
        color: #DDD8FF;
        line-height: 52px;
        text-align: left;
        margin-bottom: 30px;
      }

      .random-page-content .con-txt .s-desc {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .random-page-content .con-txt .s-desc p {
        font-size: 26px;
        font-weight: 500;
        color: #DDD8FF;
        line-height: 35px;
        max-width: 925px;
        text-align: left;
      }

      .slogn {
        font-size: 30px;
        font-weight: 500;
        color: #DDD8FF;
        line-height: 40px;
      }

      .random-img {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 60px 0;
      }

      .content-img {
        position: absolute;
        width: 100%;
        /* display: flex;
        justify-content: center;
        align-items: center; */
        margin-top: 180px;
        z-index: 1;
      }

      .content-img .gomeet-three {
        width: 300px;
      }

      .content-img .emoji {
        position: absolute;
        bottom: -50px;
        left: 200px;
      }

      .reserves-top {
        background-color: #000;
        padding-bottom: 30px;
      }

      .footer-reserves {
        width: 100%;
        flex: 0 0 auto;
        position: relative;
        margin: 0 auto;
        max-width: 925px;
      }

      .footer-reserves .con-txt {
        text-align: center;
        margin-top: 20px;
      }

      .footer-reserves .con-txt .s-title {
        text-align: left;
        margin: 20px 0;
      }

      .footer-reserves .con-txt .s-desc p {
        font-size: 26px;
        font-weight: 500;
        line-height: 35px;
        max-width: 925px;
        text-align: left;
      }

      .footer-reserves .reserves {
        text-align: center;
        height: 80px;
        font-family: Futura-Medium, Futura;
        font-weight: 500;
        color: rgba(221, 216, 255, 0.3);
        line-height: 80px;
      }

      .footer-top {
        background-color: #D9F1FF;
        padding-bottom: 50px;
      }

      .random-page-footer {
        width: 100%;
        flex: 0 0 auto;
        position: relative;
        margin: 0 auto;
        max-width: 925px;
      }

      .random-page-footer .random-header-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
      }

      .random-page-footer .random-header-btn a {
        cursor: pointer;
        text-decoration: none;
        display: block;
        width: 240px;
        height: 50px;
        background: linear-gradient(90deg, #FF78FF 0%, #32E5FF 100%);
        border-radius: 35px;
        color: #000;
        text-align: center;
        line-height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #000;
        animation: callIconAni 2s infinite;
      }

      .random-page-footer .random-header-btn .btn span {
        font-size: 20px;
        margin-right: 10px;
        color: #000;
      }
      .random-page-footer .random-header-btn .btn div {
        cursor: pointer;
        font-weight: bold;
        font-size: 16px;
      }

      .random-page-footer .footer-left {
        margin-left: 370px;
      }

      .random-page-footer .con-txt {
        text-align: center;
        margin-top: 20px;
      }

      .random-page-footer .con-txt .s-title {
        font-size: 42px;
        font-weight: bold;
        line-height: 52px;
        color: #0E0C1E;
        text-align: left;
        margin-bottom: 20px;
      }

      .random-page-footer .con-txt .s-desc {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .random-page-footer .con-txt .s-desc p {
        font-size: 26px;
        font-weight: 500;
        line-height: 35px;
        max-width: 925px;
        text-align: left;
        color: #0E0C1E;
      }

      .header-top {
        background-color: #FCDEFF;
        padding-bottom: 130px;
      }

      .random-page-header {
        width: 100%;
        flex: 0 0 auto;
        position: relative;
        margin: 0 auto;
        max-width: 925px;
        display: flex;
      }

      .random-page-header .left {
        width: 50%;
        margin-top: 150px;
        h1{
          font-size: 32px;
        }
      }

      .random-page-header .right {
        width: 50%;
        position: relative;
      }

      .random-page-header h2 {
        font-size: 42px;
        font-weight: bold;
        color: #0E0C1E;
        line-height: 52px;
        text-align: left;
        margin-bottom: 22px;
      }

      .random-page-header p {
        font-size: 24px;
        font-weight: 500;
        color: #0E0C1E;
        line-height: 35px;
        margin-bottom: 25px;
      }

      .random-page-img {
        position: absolute;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .random-page-img img {
        width: 500px;
      }
      details {
          /* border: 1px solid #ddd; */
          padding: 10px;
          margin-bottom: 10px;
      }

      summary {
          font-weight: bold;
          cursor: pointer;
      }

      @keyframes to-top {
        0% {
          transform: translateY(0);
        }

        100% {
          transform: translateY(-50%)
        }
      }

      @keyframes to-down {
        0% {
          transform: translateY(-50%);
        }

        100% {
          transform: translateY(0%)
        }
      }

      @media (max-width: 680px) {
        .gomeet-random-page .random-page-header {
          padding: 50px 28px 240px 28px;
          display: flex;
          flex-direction: column;
          width: auto;
        }

        .gomeet-random-page .random-page-header .left {
          width: 100%;
          margin-top: 0;
        }

        .gomeet-random-page .random-page-header .right {
          width: 100%;
        }

        .header-top {
          padding-bottom: 0px;
        }

        .random-page-header .random-header-btn a {
          display: block;
          width: 200px;
          height: 50px;
          background: linear-gradient(90deg, #FF78FF 0%, #32E5FF 100%);
          border-radius: 35px;
          color: #000;
          text-align: center;
          line-height: 50px;
          font-size: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          padding: 0 10px;
        }

        .random-page-header .random-header-btn .btn span {
          margin-top: 10px;
          margin-right: 10px;
        }

        .random-page-header h2 {
          font-size: 30px;
          line-height: 40px;
          text-align: center;
        }

        .random-page-header p {
          font-size: 20px;
          line-height: 30px;
        }

        .random-page-header .random-page-img {
          position: absolute;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .random-page-header .random-page-img img {
          width: 260px;
        }

        .content-top {
          padding-bottom: 0px;
          padding-top: 0px;
        }

        .random-page-content {
          padding: 10px 28px 200px 28px;
          width: auto;
        }

        .random-page-content img {
          width: 80px;
        }

        .random-page-content .con-txt .s-title {
          font-size: 25px;
          text-align: left;
          line-height: 30px;
          margin-bottom: 20px;
        }

        .random-page-content .con-txt .s-desc p {
          font-size: 16px;
          line-height: 30px;
        }

        .random-img {
          padding: 0 28px;
        }

        .random-img img {
          width: 100%;
        }

        .content-img .gomeet-three {
          width: 200px;
        }

        .content-img {
          position: absolute;
          width: 100%;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 30px;
          z-index: 1;
        }

        .content-img .emoji {
          position: absolute;
          width: 70px;
          bottom: -30px;
          left: 250px;
        }

        .footer-reserves {
          padding: 0 28px 10px 28px;
          color: #ADAAE7;
          width: auto;
        }

        .footer-reserves .con-txt .s-title {
          font-size: 25px;
          line-height: 30px;
        }

        .footer-reserves .con-txt .s-desc p {
          font-size: 16px;
          line-height: 30px;
        }

        .footer-reserves .reserves {
          text-align: center;
          height: 80px;
          font-family: Futura-Medium, Futura;
          font-weight: 500;
          color: rgba(221, 216, 255, 0.3);
          line-height: 80px;
          font-size: 12px;
        }

        .footer-top {
          padding-bottom: 20px;
        }

        .random-page-footer {
          padding: 250px 28px 30px 28px;
          width: auto;
        }

        .random-page-footer .con-txt {
          margin-top: 50px;
        }

        .random-page-footer .footer-left {
          margin-left: 0px;
        }

        .random-page-footer .con-txt .s-title {
          font-size: 25px;
          line-height: 30px;
        }

        .random-page-footer .con-txt .s-desc p {
          font-size: 16px;
          line-height: 30px;
        }
      }
    }
  }
@keyframes nextAni {
    0%{
      opacity: 0;
      transform: translateY(10px);
    }
    100%{
      opacity: 1;
      transform: translateY(0);

    }
}
@keyframes showSUAni {
    0%{
      opacity: 0;
      transform: scale(0) rotate(0);
    }
    30%{
      opacity: 1;
      transform: scale(0.5) rotate(0);
    }
    60%{
      opacity: 0;
      transform: scale(1) rotate(0);
    }
    100%{
      opacity: 0;
      transform: scale(1) rotate(0);
    }
}
@keyframes showHeartAni {
    0%{
      opacity: 0;
      transform: scale(0);
    }
    35%{
      opacity: 0.7;
      transform: scale(0.7);
    }
    70%{
      opacity: 0;
      transform: scale(1.4);
    }
    100%{
      opacity: 0;
      transform: scale(1.4);
    }

}
</style>

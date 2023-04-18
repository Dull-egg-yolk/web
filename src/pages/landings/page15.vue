
<template>
  <div class="page-body">
    <div class="livcam-page" v-if="!ishow">
      <div class="top-img"><img src="@/assets/img/langding-gomeet.png" /></div>
      <div class="livcam-banner" >
          <div class="con-num">
              <div class="obg bg-down">
                 <img src="@/assets/img/seo/bg1.png" />
                 <img class="bg" src="@/assets/img/seo/bg1.png" />
              </div>
              <div class="obg bg-up">
                 <img src="@/assets/img/seo/bg2.png" />
                 <img class="bg" src="@/assets/img/seo/bg2.png" />
              </div>
              <div class="obg bg-down">
                 <img src="@/assets/img/seo/bg3.png" />
                 <img class="bg" src="@/assets/img/seo/bg3.png" />
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
         <div class="user-call fx-c" @click="ishow=true"><span class="icon-video2"></span>{{$t('webChat.gotoPlay')}}</div>
        </div>
      </div>
   </div>
    <div class="home-page" v-if="ishow">
      <div class="mt-step matching" v-if="step" key="step-1">
          <div class="the-ray">
            <div class="step-txt">{{$t('app.flop_recommend_recommend_searching')}}...</div>
            <div class="a1"></div>
            <div class="h h1"></div>
            <div class="h h2"></div>
          </div>
      </div>
      <div class="mt-step connect-box" >
        <div class="flex-col-vc">
          <div class="avatar avatar-img host-cover">
            <div class="avatar-wrap">
              <fitimg :headImg="hostData.headImg" type="bigimg" ></fitimg>
              <!-- <fitimg :headImg="videoListLop[curHostIdx-1].headImg" type="bigimg" ref="fit2"></fitimg> -->
            </div>
          </div>
          <div class="name">{{ hostData.name  }}</div>
          <div class="local fx-v">
              <div class="avatar-img">
                <div class="avatar-wrap">
                  <country :countryId="hostData.countryId" type="img"></country>
                </div>
              </div>
              <div class="info">
                <country :countryId="hostData.countryId" type="name"></country>
              </div>
          </div>
          <div class="tag-list" v-if="hostData.interestLabels && hostData.interestLabels.length">
            <div class="h-tag " v-for="item of hostData.interestLabels" :key="item">{{ $t(`interest.${item}`) }}</div>
          </div>
          <div class=" btn-next btn-next2" @click="goToPlay">
            Call her now
          </div>
          <div class=" btn-next" @click="nextVideo">
           next<span class="triangle"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { logReport } from '@/util/logReport';
import { videoListLop } from './p1';
import { mapState } from 'vuex';
import { getCountry } from '@/util/getCountry';
export default {
  data () {
    return {
      ishow: false,
      videoListLop,
      curHostIdx: 4,
      step: false,
      timer: null,
      gender: 2,
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
    };
  },

  components: {},
  watch: {
    step () {
      this.$nextTick(() => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.nextCard();
        }, 7000);
      });
    },
    ishow () {
      this.bixin();
    }
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
          from: 'gomeet-gomeet'
        }, window.$mObj.adData || {}),
      });
      window.$mObj.adData.lpName = 'gomeet-gomeet';
      localStorage.setItem('lpName', 'gomeet-gomeet');
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
      localStorage.setItem('LANDINGSPAGE', true);
    },
    nextVideo () {
      clearTimeout(this.timer);
      this.nextCard();
    },
    nextCard () {
      if (this.curHostIdx === 0) {
        this.goToPlay();
      } else {
        const vid = document.querySelectorAll('video');
        console.log(this.curHostIdx);
        // vid[this.curHostIdx].setAttribute('class', 'active');
        this.curHostIdx--;
      }
      this.bixin();
    },
    bixin () {
      this.step = true;
      setTimeout(() => {
        this.step = false;
      }, 2000);
    },
    csGender (item) {
      this.gender = item;
    }
  },
  mounted () {
    getCountry('gomeet-gomeet');
    // this.bixin();
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
}
.livcam-page {
    height: 100%;
    max-width: 1500px;
    margin:0 auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: row-reverse;
    flex-shrink: 0;
    position: relative;
    flex-direction: row;
    background: #000;
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
.home-page {
      width: 100%;
      height: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      background:#000 ;
      background-size: cover;
      position: relative;
      .mt-step{
        height:100%;
        width:100%;
        position:absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #FF78FF 0%, #32E5FF 100%);
      }
      .matching{
        z-index: 10;
        .the-ray{
          width:100%;
          height: 500px;
          text-align: center;
          .step-txt{
            font-size: 20px;
          }

          .h{
            position:absolute;
            width:285px;
            height:234px;
            background:url(~@/assets/img/img-heart-ani.png) center no-repeat;
            background-size: 100% auto;
            left:50%;
            top:50%;
            margin: -117px 0 0 -142px;
            z-index:1;
            opacity: 0;
          }
        }
        .h1{
          animation: showHeartAni 2s infinite linear ;
        }
        .h2{
          animation: showHeartAni 2s 1s infinite linear ;
        }

          .a1{
            position: absolute;
            width: 500px;
            height:500px;
            background:url(~@/assets/img/mc-img-cc.png) center no-repeat;
            background-size: 100% auto;
            left: 50%;
            top:50%;
            margin: -250px 0 0 -250px;
            opacity: 0;
            animation: showSUAni 2s 0.5s infinite linear ;
          }
        }
      }
      .connect-box {
        z-index: 9;
      .host-cover{
        width: 200px;
        height:200px;
        position: relative;
        margin-bottom: 50px;
        &::after{
          content: '';
          position: absolute;
          width: 114%;
          height:114%;
          background: url(~@/assets/img/lc-searching.png) center no-repeat;
          background-size: 100% auto;
          top: -7%;
          left:-7%;

          animation: rollAni 6s infinite linear;
        }

        .avatar-wrap{
          animation: blurAni 4s infinite linear;

        }
      }

      .name{
        font-size:22px;
        font-weight:bold;
        padding-bottom:5px;
      }

      .local{
        .avatar-img{
          width:14px;
          height:14px;
          margin-right:10px;
        }
      }

      .tag-list{
        padding: 20px 0 20px;
        justify-content: center;
        .h-tag{
          margin:0 5px 5px 0;
        }
      }
      .intro{
        font-size:12px;;
        opacity: .8;
      }

      .btn-next{
        color: #000;
        margin-top: 40px;
        pointer-events: inherit;
        font-size: 16px;
        animation: nextAni .3s both;
        display: flex;
        align-items: center;
        font-size: 16px;
        .triangle {
          width: 0;
          height: 0;
          border-top: 10px solid #000;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-radius: 3px;
          transform: rotate(-90deg);
        }
      }
      .btn-next2{
        margin-top: 0px;
        background: #FFFFFF;
        color: #000;
        border:solid 1px #fff;
        margin-top: 40px;
        pointer-events: inherit;
        animation: nextAni .3s both;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 48px;
        padding: 0 20px;
        min-width: 240px;
        box-sizing: border-box;
        border-radius: 50px;
        cursor: pointer;
        font-size: 16px;
        transition: opacity 0.3s;
        font-weight: 700;
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
    background-color: #000;
    padding: 0;
    .livcam-page {
      position: absolute;
      top: 0px;
      bottom: 0px;
      height: auto;
      padding:0px 0;
      flex-direction: column;
      overflow: hidden;
      .top-img {
        position: initial;
        img{
          display: block;
          width: 100px;
          height: auto;
        }
      }
      .livcam-banner {
        width: 100%;
        overflow: hidden;

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
    .home-page {
      width: 100%;
      height: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      background:#000 ;
      background-size: cover;
      position: relative;
      .mt-step{
        height:100%;
        width:100%;
        position:absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #FF78FF 0%, #32E5FF 100%);
      }
      .matching{
        z-index: 10;
        .the-ray{
          width:100%;
          height: 500px;
          text-align: center;
          .step-txt{
            font-size: 20px;
          }

          .h{
            position:absolute;
            width:285px;
            height:234px;
            background:url(~@/assets/img/img-heart-ani.png) center no-repeat;
            background-size: 100% auto;
            left:50%;
            top:50%;
            margin: -117px 0 0 -142px;
            z-index:1;
            opacity: 0;
          }
        }
        .h1{
          animation: showHeartAni 2s infinite linear ;
        }
        .h2{
          animation: showHeartAni 2s 1s infinite linear ;
        }

          .a1{
            position: absolute;
            width: 500px;
            height:500px;
            background:url(~@/assets/img/mc-img-cc.png) center no-repeat;
            background-size: 100% auto;
            left: 50%;
            top:50%;
            margin: -250px 0 0 -250px;
            opacity: 0;
            animation: showSUAni 2s 0.5s infinite linear ;
          }
        }
      }
      .connect-box {
        z-index: 9;
      .host-cover{
        width: 200px;
        height:200px;
        position: relative;
        margin-bottom: 50px;
        &::after{
          content: '';
          position: absolute;
          width: 114%;
          height:114%;
          background: url(~@/assets/img/lc-searching.png) center no-repeat;
          background-size: 100% auto;
          top: -7%;
          left:-7%;

          animation: rollAni 6s infinite linear;
        }

        .avatar-wrap{
          animation: blurAni 4s infinite linear;

        }
      }

      .name{
        font-size:22px;
        font-weight:bold;
        padding-bottom:5px;
      }

      .local{
        .avatar-img{
          width:14px;
          height:14px;
          margin-right:10px;
        }
      }

      .tag-list{
        padding: 20px 0 20px;
        justify-content: center;
        .h-tag{
          margin:0 5px 5px 0;
        }
      }
      .intro{
        font-size:12px;;
        opacity: .8;
      }

      .btn-next{
        color: #000;
        margin-top: 40px;
        pointer-events: inherit;
        font-size: 16px;
        animation: nextAni .3s both;
        display: flex;
        align-items: center;
        font-size: 16px;
        .triangle {
          width: 0;
          height: 0;
          border-top: 10px solid #000;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-radius: 3px;
          transform: rotate(-90deg);
        }
      }
      .btn-next2{
        margin-top: 0px;
        background: #FFFFFF;
        color: #000;
        border:solid 1px #fff;
        margin-top: 40px;
        pointer-events: inherit;
        animation: nextAni .3s both;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 48px;
        padding: 0 20px;
        min-width: 240px;
        box-sizing: border-box;
        border-radius: 50px;
        cursor: pointer;
        font-size: 16px;
        transition: opacity 0.3s;
        font-weight: 700;
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

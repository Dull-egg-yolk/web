<template>
    <div class="box">
      <transition name="slideDown">
        <div class="install-webapp flex-col-vc" v-if="showInstall">
          <div class="inwrap" :style="bgStyle">
            <div class="hover btn-cancel fx-c" @click="cancel">
              <span class="icon-cross"></span>
            </div>
            <div class="txt" v-if="isMobile">{{$t('webChat.webAppt1Phone')}}</div>
            <div class="txt" v-else>{{$t('webChat.webAppt1Pc')}}</div>
            <div class="m-btn btn-install bk major" @click="install(1)"> {{$t('webChat.webAppInstall')}}</div>
          </div>
        </div>
      </transition>
      <div class="install-mini" v-if="showMini" @click="install(2)">
        {{$t('webChat.webAppInstall')}}
      </div>

      <!-- <div class="install-df install-flow" :class="{hasCoin: !hadGetCoin}" v-if="showMini" @click="install(2)">
        <div class="the-coin"></div>
        <div class="the-img"></div>
      </div> -->

      <!-- 普通任务列表 -->
      <!-- <div class="install-tips-pop">
        <div class="bg"></div>
        <div class="the-inner" >
          <div class="btn-cancel fx-ic" @click="cancelSafariInstall">
            <span class="icon-cross"></span>
          </div>
          <div class="banner">
            <img src="https://h5.livuchat.com/static/images/web/webapp/wn-banner-nocoin.png" v-if="hadGetCoin" />
            <img src="https://h5.livuchat.com/static/images/web/webapp/wn-banner-coin.png" v-else />
          </div>
          <div class="task-list">
            <div class="otask fx-be-vc">
              <div class="the-txt">
                <div>Install the web app</div>
                <span>+30Coin</span>
              </div>
              <div class="the-btn">
                <div class="m-btn major mini">install</div>
              </div>
            </div>
            <div class="otask fx-be-vc">
              <div class="the-txt">
                <div>Enable Notification</div>
                <span>+30Coin</span>
              </div>
              <div class="the-btn">
                <div class="m-btn major mini">Allow</div>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <!-- safari 漂浮 -->
      <div class="install-safari install-flow"  :class="{noCoin: hadGetCoin}" v-if="showsafari && $route.name==='LivCam'" @click="toShowSafari">
        <div class="the-coin"></div>
        <div class="the-img"></div>
      </div>
      <!-- safari tips -->
      <div class="install-tips-pop" v-if="showSafariInstall">
        <div class="bg" @click="cancelSafariInstall"></div>
        <div class="the-inner" >
          <div class="btn-cancel fx-ic" @click="cancelSafariInstall">
            <span class="icon-cross"></span>
          </div>
          <div class="c-txt">
            <h2>{{ $t('webChat.wpsft1') }}</h2>
            <p class="sub-title" v-if="!hadGetCoin" v-html="$t('webChat.wpsft2', {coin: `<span>${webAppInfo.gold}</span> `})"></p>
            <div class="t1">
              <span class="wi fx-ic">1</span>
              <p>{{ $t('webChat.wpsft3') }}</p>
            </div>
            <div class="t2">
              <span class="wi fx-ic">2</span>
              <p>{{ $t('webChat.wpsft4') }}</p>
            </div>
          </div>
          <div class="the-icons">
            <img src="https://h5.livuchat.com/static/images/web/webapp/wi-icons.png" />
          </div>
        </div>
        <div class="the-arrow"></div>
      </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { apiCheckWebApp, apiSendWebAppCoin } from '@/api/user';
import { logReport } from '@/util/logReport';
export default {
  name: 'InstallApp',
  data () {
    return {
      showInstall: false,
      installCtx: null,
      canInstall: false,
      nextTime: 8 * 60 * 60 * 1000,
      // nextTime: 1 * 60 * 1000,
      timer: null,
      showMini: false,
      todayKey: '',
      todayCount: null,
      tempShow: false,
      hadGetCoin: false,
      webAppInfo: {
        gold: '',
        img: '',
        status: false,
      },
      showsafari: false,
    };
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
      isMobile: (state) => state.app.isMobile,
      showVideoPop: (state) => state.app.showVideoPop,
      showRingBell: (state) => state.app.showRingBell,
      isSafari: (state) => state.app.isSafari,
      showSafariInstall: (state) => state.app.showSafariInstall,
    }),
    bgStyle () {
      return {
        backgroundImage: `url('${this.webAppInfo.img}')`
      };
    },
  },
  watch: {
    isLogin (n) {
      if (!n) return;
      this.checkShow();
      this.checkSafariShow();
    },
    canInstall (n) {
      if (n) {
        this.checkShow();
      }
    },
    showInstall (n) {
      if (n) {
        logReport({
          eventId: '106-1-1-56',
        });
        this.todayCount.time += 1;
        this.setCountData();

        this.showMini = false;
        localStorage.setItem('RC_INSTALL_CTIME', Date.now());
      } else {
        this.setShowMini();
      }
    },
    showVideoPop (n) {
      if (!n && this.tempShow) {
        this.setInstallShow();
      }
    },
    showRingBell (n) {
      if (!n && this.tempShow) {
        this.setInstallShow();
      }
    },
    $route (n, v) {
      if (n.name === 'LivCam' && this.tempShow) {
        this.setInstallShow();
      }
      if (n.name !== 'LivCam') {
        this.showMini = false;
      }

      if (n.name === 'LivCam') {
        if (window.matchMedia('(display-mode: standalone)').matches) {
          return;
        }
        if (this.installCtx) {
          this.setShowMini();
        }
      }

      if (n.name === 'LivCam' || n.name === 'MessagePage') {
        this.checkShowSafariPop();
      }
    },
    showMini (n) {
      if (n) {
        logReport({
          eventId: '106-1-1-60',
        });
      }
    },
    showSafariInstall (n) {
      if (n) {
        logReport({
          eventId: '106-1-1-81',
        });
      }
    }
  },
  methods: {
    ...mapActions(['updateMyUserData']),
    checkInWebApp () {
      return window.matchMedia('(display-mode: standalone)').matches;
    },
    setShowMini () {
      if (!this.isMobile) return;
      if (!this.isLogin) return;
      this.showMini = true;
    },
    cancel () {
      logReport({
        eventId: '106-1-1-58',
      });
      this.showInstall = false;
      this.setShowMini();
      localStorage.setItem('RC_INSTALL_CTIME', Date.now());
      this.timer = setTimeout(() => {
        this.checkShow();
      }, this.nextTime);
    },
    install (type) {
      // 安装点击埋点  1 是大按钮 2是mobile 小按钮
      logReport({
        eventId: type === 1 ? '106-1-1-57' : '106-1-1-55',
      });

      this.installCtx.prompt();
      this.installCtx.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          // this.$store.commit('setShowPCInstallWA', false);
          logReport({
            eventId: '106-1-12-1',
            freeName2: {
              from: type === 1 ? 'pop' : 'mini'
            }
          });
          this.showInstall = false;
          clearTimeout(this.timer);
          if (this.hadGetCoin) {
            this.showMini = false;
            localStorage.removeItem('RC_INSTALL_CTIME');
            localStorage.setItem('RC_INSTALL_CONFIRM', true);
            return;
          }
          const params = {
            countryId: localStorage.getItem('RC_USER_COUNTRY'),
          };
          apiSendWebAppCoin(params).then(({ code, data }) => {
            if (code !== 200) return;
            this.$toast({
              html: this.$t('webChat.popBannerFreeCoin'),
              time: 4000
            });

            this.hadGetCoin = true;
            this.updateMyUserData();
            localStorage.removeItem('RC_INSTALL_CTIME');
            localStorage.setItem('RC_INSTALL_CONFIRM', true);
            this.showMini = false;
          });
        } else {
          logReport({
            eventId: '106-1-12-2',
            freeName2: {
              from: type === 1 ? 'pop' : 'mini'
            }
          });
        }
      });
    },
    checkShow () {
      if (!this.isLogin || !this.canInstall || this.isSafari) return;
      // 已经在webApp的 不请求接口
      if (this.checkInWebApp()) {
        return;
      }
      const params = {
        countryId: localStorage.getItem('RC_USER_COUNTRY'),
      };
      apiCheckWebApp(params).then(({ code, data }) => {
        if (code !== 200) return;
        if (!data.status) {
          this.webAppInfo = data;
          // this.checkPcShow();
          if (this.todayCount.time >= 2) {
            this.setShowMini();
            return;
          }
          const ptime = +localStorage.getItem('RC_INSTALL_CTIME');
          if (!ptime) {
            this.timer = setTimeout(() => {
              this.setInstallShow();
            }, 3000);
            // }, 20000);
            return;
          } else {
            this.setShowMini();
          }
          const lt = this.nextTime - (Date.now() - ptime);

          if (lt > 0) {
            this.timer = setTimeout(() => {
              this.setInstallShow();
            }, lt);
          } else {
            this.setInstallShow();
          }
        } else {
          this.hadGetCoin = true;
          localStorage.setItem('RC_INSTALL_CONFIRM', true);
        }
      });
    },

    setInstallShow () {
      const { name } = this.$route;
      if (this.showVideoPop || this.showRingBell || name !== 'LivCam') {
        this.tempShow = true;
        return;
      }
      setTimeout(() => {
        this.tempShow = false;
        this.showInstall = true;
      }, 300);
    },

    getCountData () {
      let ot = JSON.parse(localStorage.getItem('RC_INSTALL_COUNT') || '{}');
      if (!ot.day || ot.day !== this.todayKey) {
        ot = {
          day: this.todayKey,
          time: 0
        };
        localStorage.setItem('RC_INSTALL_COUNT', JSON.stringify(ot));
      }
      this.todayCount = ot;
    },
    setCountData () {
      localStorage.setItem('RC_INSTALL_COUNT', JSON.stringify(this.todayCount));
    },
    showSmallBtn () {
      this.setShowMini();
    },
    // safari 提示检测
    checkSafariShow () {
      if (!this.isSafari || !this.isMobile) return;
      const params = {
        countryId: localStorage.getItem('RC_USER_COUNTRY'),
      };
      apiCheckWebApp(params).then(({ code, data }) => {
        if (code !== 200) return;
        // 发金币
        if (this.checkInWebApp()) {
          // 发金币
          if (!data.status) {
            apiSendWebAppCoin(params).then(({ code, data }) => {
              if (code !== 200) return;
              this.$toast({
                html: this.$t('webChat.popBannerFreeCoin'),
                time: 4000
              });
              this.updateMyUserData();
            });
          }
          return;
        }
        this.webAppInfo = data;
        this.showsafari = true;
        if (!data.status) {
          // 主动触发标识 每天种一次
          this.setSafariEventFlag();
        } else {
          this.hadGetCoin = true;
        }
      });
    },
    toShowSafari () {
      this.$store.commit('setShowSafariInstall', true);
    },
    cancelSafariInstall () {
      logReport({
        eventId: '106-1-1-82',
      });
      this.$store.commit('setShowSafariInstall', false);
    },
    setSafariEventFlag () {
      console.log('webApp insert');
      const day = localStorage.getItem('RC_SAFARI_DAY');
      const tday = new Date().getDate();
      if (day !== tday) {
        localStorage.setItem('RC_SAFARI_DAY', tday);
        localStorage.setItem('RC_SAFARI_CALL', 1);
      }
    },
    checkShowSafariPop () {
      if (!this.isSafari || !this.isMobile) return;
      if (this.showVideoPop || this.showRingBell || this.checkInWebApp()) return;
      if (+localStorage.getItem('RC_SAFARI_CALL') === 2) {
        localStorage.setItem('RC_SAFARI_CALL', 3);
        if (this.showSafariInstall) return;
        this.$store.commit('setShowSafariInstall', true);
      }
    }
  },
  mounted () {
    window.$mObj.installWebApp = this.install;

    // 已经在webApp的 不走了
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    if (this.isLogin) {
      this.checkSafariShow();
    }

    if (this.isSafari) return;

    const installFun = () => {
      this.showSmallBtn();
      const isDone = localStorage.getItem('RC_INSTALL_CONFIRM');
      if (isDone) {
        this.hadGetCoin = true;
        return;
      };
      this.canInstall = true;
    };

    // 一天两次
    const nd = new Date();
    this.todayKey = nd.getMonth() + '' + nd.getDate();
    this.getCountData();

    if (window.$mObj.webAppCtx) {
      this.installCtx = window.$mObj.webAppCtx;
      installFun();
      return;
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installCtx = e;
      installFun();
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw-app.js')
        .then(() => { console.log('Service Worker Registered'); });
    }
  },
};
</script>

<style lang="less" scoped>

.install-webapp{
  position:fixed;
  right:0;
  top:0;
  left:0;
  bottom:0;
  color:#fff;
  z-index:120;
  box-sizing: border-box;
  background:rgba(0,0,0,.8);
  backdrop-filter: blur(10px);
  .txt{
    text-align: center;
    font-size:20px;
  }

  .inwrap{
    width: 500px;
    padding-top: 400px;
    background: center top no-repeat;
    position: relative;
    background-size: 437px auto;
  }

  .btn-cancel{
    position: absolute;
    right:0;
    top:-40px;
    width:40px;
    height:40px;
    border-radius: 50%;
    background:rgba(0,0,0,.4);
    font-size:16px;
  }

  .btn-install{
    width:268px;
    height:66px;
    margin: 20px auto 0;
    font-size:20px;
  }
}
.install-mini{
  display: none;
}
.install-flow{
  display: none;
  position:fixed;
  top: 60px;
  right: 4px;
  width:80px;
  height:80px;
  z-index:120;
  .the-img{
    width:80px;
    height:80px;
    position:relative;
  }
  .the-coin{
    position:absolute;
    width:100%;
    height:100%;
    z-index:10;
    top:0;
    left:0;
    animation: coinFlow 3s infinite;

  }
  &.install-safari{
    .the-img{
      background:url(~@/assets/img/wi-icon-mini.png) center no-repeat;
      background-size: 110%;
    }
    .the-coin{
      background:url(~@/assets/img/wi-coin-flow.png) center no-repeat;
      background-size: 100%;
    }

    &.noCoin{
      .the-img{
        background:url(~@/assets/img/wn-icon-nocoin.png) center no-repeat;
        background-size: 100%;
      }
      .the-coin{
        display:none;
      }
    }
  }
  &.install-df{
    .the-img{
      background:url(~@/assets/img/wn-icon-nocoin.png) center no-repeat;
      background-size: 100%;
    }

    &.hasCoin{

      .the-img{
        background:url(~@/assets/img/wn-icon-coin.png) center no-repeat;
        background-size: 100%;
      }
      .the-coin{
        top:10px;
        background:url(~@/assets/img/wn-coin-flow.png) center no-repeat;
        background-size: 100%;
      }
    }
  }
}

@keyframes coinFlow {
  0%{
    transform: translateY(0);
  }
  50%{
    transform: translateY(-10px);
  }
  100%{
    transform: translateY(0);
  }
}

@media screen and(max-width: 680px) {
  .install-flow{
    display: block;
  }
  .install-tips-pop{
    position:fixed;
    right:0;
    top:0;
    left:0;
    bottom:0;
    z-index:160;
    .bg{
      position:absolute;
      width: 100%;
      height:100%;
      background:rgba(0,0,0,.2);
      backdrop-filter: blur(10px);
    }
    .the-inner{
      position:absolute;
      left:50%;
      top:50%;
      width:84%;
      transform: translate(-50%,-50%);
      background:#1A1A1A;
      border-radius: 12px;
      overflow:hidden;
      .btn-cancel{
        position:absolute;
        right:5px;
        top:5px;
        width:30px;
        height:30px;
        background:#1A1A1A;
        border-radius: 50%;
      }
      .banner{
        min-height: 80px;
        img{
          display:block;
          width:100%;
        }
      }
      .c-txt{
        text-align:center;
        padding:20px 20px 10px;
        font-size:13px;
        h2{
          font-size: 20px;
          padding:10px 0;
        }
        .sub-title{
          padding-bottom:10px;
          /deep/span{
            display:inline-block;
            padding-right: 16px;
            background:url(~@/assets/img/icon-coin.png) right 2px no-repeat;
            background-size: auto 16px;
          }
        }
        .t1,.t2{
          text-align:left;
          position:relative;
          padding: 6px 0 6px 0;
          display:flex;
          align-items: center;
          p{
            flex:1;
            line-height:1.25
          }
        }
        .wi{
          width:24px;
          height:24px;
          margin-right:12px;
          background: linear-gradient(111deg, #F99E47 0%, #FF3463 100%);
          color:#fff;
          font-size:15px;
          font-weight:bold;
          border-radius: 50%;
        }

      }
      .the-icons{
        padding:25px 0 20px;
        margin:0px 20px;
        text-align:center;
        border-top:dashed 1px rgba(255,255,255,.5);
        img{
          display:block;
          width: 80%;
          margin: 0 auto;
        }
      }

      .task-list{
        padding: 15px;
        .otask{
          padding:5px 0;
          .the-txt{
            div{
              font-size:14px;
            }
            span{
              font-size:12px;
              color:#FFDA00;
              display:inline-block;
              padding-right:20px;
              background:url(~@/assets/img/icon-coin.png) right center no-repeat;
              background-size: auto 16px;
            }
          }
        }
      }
    }

    .the-arrow{
      position:absolute;
      bottom: 20px;
      left:50%;
      width:40px;
      height:80px;
      background:url(~@/assets/img/wi-icon-arrow.png) center bottom no-repeat;
      background-size: 100% auto;
      margin-left:-20px;
      animation: coinFlow 2s infinite;

    }
  }

  .install-mini{
    position:fixed;
    bottom: 60%;
    right:0;
    z-index:120;
    background: linear-gradient(89deg, rgba(250, 123, 255,1) 0%, rgba(62, 227, 255,1) 100%);
    font-size:14px;
    backdrop-filter: blur(7px);
    color:#000;
    padding: 5px 5px 5px 14px;
    border-radius: 40px 0 0 40px;
    overflow: hidden;
  }
  .install-webapp{
    right:0;
    top:0;
    z-index:200;
    .inwrap{
      width:100%;
      padding-top: 300px;
      background-size: auto 300px;
    }

    .txt{
      font-size:16px;
    }

    .btn-install{
      height: 56px;
    }
    .btn-cancel{
      right: 20px;
    }
  }
}

</style>

<template>
  <div class="box">
    <!-- safari 漂浮 -->
    <transition name="slideDown">
      <div class="pop-say say-flow" :class="{searchBox: $route.name === 'SearchPage' || $route.name === 'CardPage'}" v-if="checkShowPop"
        @click="toShowPop">
        <!-- <div class="the-coin"></div> -->
        <div class="the-img"></div>
        <div class="tips"><div class="text">{{ $t('webChat.sayTips') }}</div></div>
      </div>
    </transition>
    <!-- safari tips -->
    <div class="install-tips-pop" v-if="showSayhi">
      <div class="bg"></div>
      <div class="the-inner">
        <div class="c-txt">
          <div class="c-img">
            <div class="the-detail" v-for="(item, index) in videoListLop" :key="index">
              <div class="the-head" @click="selectStep(index, item.id)">
                <!-- <img v-if="item.headImg" :src="item.headImg" /> -->
                <fitimg v-if="item.headImg" :headImg="item.headImg" type="smailimg"></fitimg>
                <img v-else src="@/assets/img/pop-head-img.png" />
                <div :class="{selected: selsectList.includes(item.id), ico: !selsectList.includes(item.id)}"></div>
              </div>
              <div class="text">
                <div class="userName">{{ item.userName }}</div>
                <country :countryId="item.countryId" type="all"></country>
              </div>
            </div>
          </div>
          <div class="c-btn">
            <div class="sayHi" @click="sayHiBtn" v-if="selsectList.length">{{ $t('webChat.sayHi') }}</div>
            <div class="sayHi" @click="cannel()" v-else>{{ $t('webChat.sayClose') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { sendMessage } from '@/api/message';
import { apiAddFriend } from '@/api/friend';
import { processMessage } from '@/util/process';
import { apiGetCardHost } from '@/api/card';
import { logReport } from '@/util/logReport';
import { apiGetSiteFuncConf } from '@/api/user';

export default {
  name: 'PopSayhi',
  data () {
    return {
      step: -1,
      selsectList: [],
      // showSayHi: true,
      videoListLop: []
    };
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
      isMobile: (state) => state.app.isMobile,
      siteFunc: (state) => state.app.siteFunc,
      showSayhi: (state) => state.app.showSayhi,
      showSayHiPop: (state) => state.app.showSayHiPop,
    }),
    checkShowPop () {
      if (!this.showSayHiPop) {
        return false;
      }
      if (/LivCam|SearchPage|CardPage/.test(this.$route.name)) {
        return true;
      }
      return false;
    }
  },
  watch: {
    $route (n, v) {
      if (!this.isLogin) return;
      if (/LivCam|SearchPage|CardPage/.test(n.name)) {
        this.getSiteFuncConf();
      }
    },
  },
  methods: {
    cannel () {
      this.$store.commit('setShowSayhi', false);
      this.$store.commit('setShowSayHiPop', false);
      logReport({
        eventId: '106-10-1-5'
      });
    },
    getList () {
      this.selsectList = [];
      this.videoListLop = [];
      console.log('ddd', this.siteFunc.DAILYMEET);
      apiGetCardHost({ playWay: this.siteFunc.DAILYMEET }).then(res => {
        if (res.code === 200 && (res.data.fetchedUsersResps).length) {
          this.$store.commit('setShowSayhi', true);
          this.videoListLop = res.data.fetchedUsersResps;
          for (let i = 0; i < this.videoListLop.length; i++) {
            this.selsectList.push(this.videoListLop[i].id);
          }
          logReport({
            eventId: '106-10-1-2',
            freeName2: this.selsectList
          });
        } else {
          this.$store.commit('setShowSayhi', false);
          this.$message({
            desc: {
              txt: this.$t('webChat.sayHiFalt')
            }
          }).then(() => {
            this.$store.commit('setShowSayHiPop', false);
          });
        }
      }).catch(err => {
        this.$store.commit('setShowSayhi', false);
        this.$message({
          desc: {
            txt: this.$t('webChat.sayHiFalt')
          }
        }).then(() => {
          this.$store.commit('setShowSayHiPop', false);
        });
        console.log(err, '0000');
      });
    },
    sayHiBtn () {
      for (let i = 0; i < this.selsectList.length; i++) {
        this.addFriend(this.selsectList[i]);
        setTimeout(() => {
          this.sendMsg(this.selsectList[i]);
        }, 1000);
      }
      this.$message({
        desc: {
          txt: this.$t('webChat.sayHiSuccess')
        }
      });
      logReport({
        eventId: '106-10-1-4',
        freeName2: this.selsectList
      });
      this.$store.commit('setShowSayhi', false);
      this.$store.commit('setShowSayHiPop', false);
    },
    async addFriend (id) {
      await apiAddFriend({
        addWay: 102,
        friendUserId: id,
        addReally: true
      }).then(({ code, data }) => {
        if (code === 200) {
        }
      });
    },
    toShowPop () {
      logReport({
        eventId: '106-10-1-1'
      });
      this.getList();
    },
    selectStep (index, id) {
      if (this.selsectList.includes(id)) {
        this.selsectList.splice(this.selsectList.indexOf(id), 1);
        logReport({
          eventId: '106-10-1-3',
          freeName2: 'select: 0'
        });
      } else {
        logReport({
          eventId: '106-10-1-3',
          freeName2: 'select: 1'
        });
        this.selsectList.push(id);
      }
    },
    // 获取网站功能玩法开关配置
    getSiteFuncConf () {
      apiGetSiteFuncConf().then(({ code, data }) => {
        if (code !== 200 || !data || !data.openedPlayWays || !data.openedPlayWays.length) return;
        const { openedPlayWays } = data;
        const theD = {};
        openedPlayWays.forEach(item => {
          theD[item.name] = item.id;
        });
        this.$store.commit('setSiteFunc', theD);
        if (theD.DAILYMEET) {
          this.$store.commit('setShowSayHiPop', true);
          logReport({
            eventId: '106-10-1-0'
          });
        }
      });
    },
    async sendMsg (id) {
      const data = {
        message: 'hi',
        messageType: 1, // 消息类型 参考MessageTypeEnum枚举，1是文字
        receiveUserId: id,
        sendUserId: this.$store.state.app.userInfo.id,
        needTranslate: 0, // 是否需要翻译 0：否 1：是
        targetLanguage: 1, // 翻译的目标语言
        routeType: 0, // 是否在线才投递消息 0：否 1：是
      };
      const sendData = processMessage(data);
      console.log('----发消息-----', sendData);
      await sendMessage(sendData).then(res => {
        const { data } = res;
        // if (data && data.translateCode === 54000) {
        //   this.$message({
        //     desc: {
        //       txt: this.$t('app.translate_limit_dialog_title')
        //     }
        //   });
        // }
      }).catch((err) => {
        console.log(err);
      });
    }
  },
  mounted () {
  },
};
</script>

<style lang="less" scoped>
.install-webapp {
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
  bottom: 0;
  color: #fff;
  z-index: 120;
  box-sizing: border-box;
  background: rgba(0, 0, 0, .8);
  backdrop-filter: blur(10px);

  .txt {
    text-align: center;
    font-size: 20px;
  }

  .inwrap {
    width: 500px;
    padding-top: 400px;
    background: center top no-repeat;
    position: relative;
    background-size: 437px auto;
  }

  .btn-cancel {
    position: absolute;
    right: 0;
    top: -40px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0, 0, 0, .4);
    font-size: 16px;
  }

  .btn-install {
    width: 268px;
    height: 66px;
    margin: 20px auto 0;
    font-size: 20px;
  }
}

.install-mini {
  display: none;
}
.say-flow {
  display: none;
  position: fixed;
  top: 50px;
  right: 0px;
  width: 90px;
  height: 80px;
  z-index: 120;

  .the-img {
    width: 80px;
    height: 80px;
    position: relative;
  }

  .the-coin {
    position: absolute;
    width: 15px;
    height: 15px;
    z-index: 10;
    top: 15px;
    right: 15px;
    animation: callIconAni 2s infinite;

  }
  .tips {
    width: 250px;
    height: 59px;
    position: absolute;
    top: 15px;
    right: 95px;
    background: url(~@/assets/img/pop-say-tips.png) center no-repeat;
    background-size: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 5px;
    animation: slideLeft 0.9s both;
    .text{
      padding: 0 10px;
      text-align: center;
    }
  }

  &.pop-say {
    .the-img {
      background: url(~@/assets/img/pop-say.png) center no-repeat;
      background-size: 100%;
    }

    .the-coin {
      background: url(~@/assets/img/pop-say-coin.png) center no-repeat;
      background-size: 100%;
    }
  }

}
.searchBox {
  top: 60px;
}

@keyframes slideLeft {
  0% {
    transform-origin: 0 0;
    transform: translateX(10%);
  }
  100% {
    transform-origin: 0 0;
    transform: translateX(0%);
  }
}

@keyframes callIconAni{
  0%{
    transform: scale(0.9);
    opacity: .5;
  }
  50%{
    transform: scale(1);
    opacity: 1;
  }
  100%{
    transform: scale(0.9);
    opacity: .5;
  }
}

@media screen and(max-width: 680px) {
  .say-flow {
    display: block;
  }

  .install-tips-pop {
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 160;

    .bg {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .2);
      backdrop-filter: blur(10px);
    }

    .the-inner {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 90%;
      transform: translate(-50%, -50%);
      background: #1A1A1A;
      border-radius: 12px;
      overflow: hidden;
      background: url(~@/assets/img/pop-say-bg.png) center no-repeat;
      background-size: 100%;

      .btn-cancel {
        position: absolute;
        right: 10px;
        top: 90px;
        width: 30px;
        height: 30px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
      }

      .banner {
        min-height: 80px;

        img {
          display: block;
          width: 100%;
        }
      }

      .c-txt {
        text-align: center;
        padding: 20px 10px 10px;
        font-size: 13px;
        .c-img {
          display: flex;
          flex-wrap: wrap;
          clear: both;
          padding: 160px 0 0px 0;
          .the-detail {
            width: 33.333%;
            padding-bottom: 10px;
            .the-head {
              width: 100%;
              position: relative;
              .fitImg-box {
                justify-content: center;
                /deep/img {
                  width: 85px;
                  height: 85px;
                  border-radius: 85px;
                  object-fit: cover;
                  border: 3px solid rgba(194,111,224,.9);
                }
              }
              .ico {
                position: absolute;
                width: 21px;
                height: 21px;
                background: #5A0047;
                border: 1px solid #B32796;
                border-radius: 22px;
                top: 0px;
                right: 10px;
              }
              .selected {
                  position: absolute;
                  top: 0px;
                  right: 10px;
                  width: 24px;
                  height: 24px;
                  background: url(~@/assets/img/pop-say-selected.png) center center no-repeat;
                  background-size: cover;
                }
            }
            .text {
              .userName {
                font-size: 12px;
                font-weight: bold;
              }
              .country-box {
                justify-content: center;
                /deep/img {
                    width: 15px;
                    height: 15px;
                    border-radius: 15px;
                    margin-right: 4px;
                }
                /deep/.country-name {
                  font-size: 12px;
                }
              }
            }
          }
        }
        .c-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 0 20px 0;
          padding: 0 60px 10px 60px;
          .sayHi {
            width: 100%;
            height: 45px;
            background: #FFFFFF;
            font-family: Futura-Bold, Futura;
            font-weight: bold;
            color: #9F1853;
            border-radius: 28px;
            text-align: center;
            line-height: 45px;
            font-size: 18px
        }
      }
      }

      .the-icons {
        padding: 25px 0 20px;
        margin: 0px 20px;
        text-align: center;
        border-top: dashed 1px rgba(255, 255, 255, .5);

        img {
          display: block;
          width: 80%;
          margin: 0 auto;
        }
      }

      .task-list {
        padding: 15px;

        .otask {
          padding: 5px 0;

          .the-txt {
            div {
              font-size: 14px;
            }

            span {
              font-size: 12px;
              color: #FFDA00;
              display: inline-block;
              padding-right: 20px;
              background: url(~@/assets/img/icon-coin.png) right center no-repeat;
              background-size: auto 16px;
            }
          }
        }
      }
    }
  }

  .install-mini {
    position: fixed;
    bottom: 60%;
    right: 0;
    z-index: 120;
    background: linear-gradient(89deg, rgba(250, 123, 255, 1) 0%, rgba(62, 227, 255, 1) 100%);
    font-size: 14px;
    backdrop-filter: blur(7px);
    color: #000;
    padding: 5px 5px 5px 14px;
    border-radius: 40px 0 0 40px;
    overflow: hidden;
  }

  .install-webapp {
    right: 0;
    top: 0;
    z-index: 200;

    .inwrap {
      width: 100%;
      padding-top: 300px;
      background-size: auto 300px;
    }

    .txt {
      font-size: 16px;
    }

    .btn-install {
      height: 56px;
    }

    .btn-cancel {
      right: 20px;
    }
  }
}
@media screen and(min-width: 400px) {
  .box .say-flow .tips {
    width: 280px;
  }
  .install-tips-pop .the-inner .c-txt .c-img {
    padding: 165px 0 20px 0;
  }
  /deep/.install-tips-pop .the-inner .c-txt .c-img .the-detail .the-head .fitImg-box img {
    width: 90px;
    height: 90px;
  }
}
@media screen and(max-width: 350px) {
  .install-tips-pop .the-inner .c-txt .c-img .the-detail .the-head img {
    width: 80px;
    height: 80px;
  }
  /deep/.install-tips-pop .the-inner .c-txt .c-img .the-detail .the-head .fitImg-box img {
    width: 80px;
    height: 80px;
  }
  .install-tips-pop .the-inner .btn-cancel {
    top: 100px;
  }
  .install-tips-pop .the-inner .c-txt {
    padding: 20px 5px 10px;
  }
  .install-tips-pop .the-inner .c-txt .c-img {
    padding: 120px 0 10px 0;
  }
  .install-tips-pop .the-inner .c-txt .c-btn .sayHi {
    height: 40px;
    line-height: 40px;
  }
  .box .say-flow .tips {
    width: 210px;
  }
}
</style>

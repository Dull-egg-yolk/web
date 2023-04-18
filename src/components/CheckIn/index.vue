<template>
  <base-pop class="check-in" :outClickCancel="true" :showPop="showCheckInPop" @cancelPop="closePop">
    <span class="check-in__close" @click="closePop"><i class="icon-cross"></i><i class="icon-arrow"></i></span>
    <div class="check-in__con" :style="mobileCss">
      <div class="check-in__top">
        <div class="check-in-title">
          {{ $t('webChat.checkIn.title') }}
        </div>
        <div class="check-in-desc">
          <p v-html="$t('webChat.checkIn.desc', { num: todayCoin })"></p>
        </div>
      </div>
      <div class="check-in__main">
        <div class="check-list">
          <div class="check-item" v-for="item in signInList" :key="item.day"
            :class="{ checked: item.signIn, missed: item.missed }">
            <span class="check-check-icon" v-if="item.signIn"></span>
            <div class="check-day">
              {{ $t('base.day', { num: item.day + 1 }) }}
            </div>
            <div class="check-coin">
              <img v-if="item.missed" src="@/assets/img/icon-sad.png" alt />
              <img v-else src="@/assets/img/icon-s-coin.png" alt />
            </div>
            <div class="check-up-to" v-html="
              $t('webChat.checkIn.xcoins', { num: item.coin })
            "></div>
          </div>
        </div>
        <div class="check-success-box" v-if="hasChecked">
          <div class="check-success-icon">
            <img src="@/assets/img/icon-smile.png" alt="" />
          </div>
          <div class="check-success-txt" v-html="
            $t('webChat.checkIn.checkInSuccess', {
              num: todayCoin,
            })
          "></div>
        </div>
        <div class="check-list-desc" v-if="signInList.length" v-html="$t('webChat.checkIn.tips', { num: sumCoin })">
        </div>
        <div class="check-btn-box" v-if="signInList.length">
          <div class="check-btn" @click="saveCheckIn">
            {{ $t('webChat.checkIn.checkIn') }}
          </div>
        </div>
      </div>
    </div>
  </base-pop>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import BasePop from '../BasePop.vue';
import { logReport } from '@/util/logReport';
import { apiGetSignInList, apiSaveSignIn } from '@/api/user';

export default {
  name: 'CheckIn',
  data () {
    return {
      signInList: [],
      isChecking: false,
      hasChecked: false,
      sumCoin: 0,
      todayCoin: '',
      today: '',
      clientWidth: document.body.clientWidth
    };
  },
  props: {},
  components: {
    BasePop,
  },
  computed: {
    ...mapState({
      showCheckInPop: (state) => state.app.showCheckInPop,
      checkInConf: (state) => state.app.checkInConf,
      isMobile: (state) => state.app.isMobile,
    }),
    mobileCss () {
      if (!this.isMobile) return '';
      const diff = this.clientWidth - 375;
      if (['ar', 'ur', 'he'].includes(this.$i18n.locale)) {
        return {
          paddingRight: (diff / 2 + 11) + 'px'
        };
      }
      return {
        paddingLeft: (diff / 2 + 13) + 'px'
      };
    }
  },
  watch: {
    showCheckInPop: {
      handler (val) {
        if (val) {
          logReport({
            eventId: '14-2-1-17', // 新用户签到弹窗展示
            freeName2: window.$mObj.adData || {},
            status: this.checkInConf.hasCheck,
            checkinType: this.checkInConf.type,
          });
          this.clientWidth = document.body.clientWidth;
          this.getSignInList();
        } else {
          this.isChecking = false;
        }
      },
      immediate: true,
    },
    setClientWidth () {
      console.log('-----document.body.clientWidth----', document.body.clientWidth);
      this.clientWidth = document.body.clientWidth;
    }
  },
  methods: {
    ...mapActions(['updateMyUserData']),
    closePop (type) {
      logReport({
        eventId: '14-2-1-19', // 新用户签到弹窗cancel点击
        freeName2: window.$mObj.adData || {},
        day: this.today,
        status: this.checkInConf.hasCheck,
        todayCoin: this.todayCoin,
        checkinType: this.checkInConf.type,
      });
      this.$store.commit('setCheckIn', false);
    },
    /**
     * 签到
     */
    saveCheckIn () {
      if (this.isChecking) return;
      this.isChecking = true;
      logReport({
        eventId: '14-2-1-18', // 新用户签到弹窗check in点击
        freeName2: window.$mObj.adData || {},
        day: this.today,
        status: this.checkInConf.hasCheck,
        todayCoin: this.todayCoin,
        checkinType: this.checkInConf.type,
      });
      // 过期了
      if (this.today > 6 || (this.today === 6 && this.checkInConf.hasCheck)) {
        this.$toast({
          html: this.$t('webChat.checkIn.checkInEnd')
        });
        setTimeout(() => {
          this.isChecking = false;
        }, 3000);
        return;
      }
      const { hour, min } = this.getDifferenceTime();

      // 已经签到了
      // if (this.checkInConf.hasCheck) {
      //   this.$toast({
      //     html: this.$t('webChat.checkIn.checkInRepeat', {
      //       hour,
      //       min,
      //     }),
      //   });
      //   setTimeout(() => {
      //     this.isChecking = false;
      //   }, 3000);
      //   return;
      // }
      const params = {
        countryId: localStorage.getItem('RC_USER_COUNTRY'),
      };
      apiSaveSignIn(params).then((res) => {
        console.log(res, '---签到结果----');
        this.isChecking = false;
        if (res.code === 200) {
          this.hasChecked = true;
          setTimeout(() => {
            this.hasChecked = false;
          }, 3000);
          this.updateMyUserData();
          this.getSignInList();
          const conf = {
            hasCheck: true,
          };
          this.$store.commit('setCheckConf', conf);
        } else if (res.code === 400) {
          this.$toast({
            html: this.$t('webChat.checkIn.checkInRepeat', {
              hour,
              min,
            }),
          });
          const conf = {
            hasCheck: true,
          };
          this.$store.commit('setCheckConf', conf);
        } else if (res.code === 402) {
          this.$toast({
            html: this.$t('webChat.checkIn.checkInRepeatAccount'),
          });
        } else {
          this.$toast({
            html: this.$t('webChat.checkIn.checkInFail'),
          });
        }
      });
    },
    getSignInList () {
      const params = {
        countryId: localStorage.getItem('RC_USER_COUNTRY'),
      };
      apiGetSignInList(params).then(({ code, data }) => {
        console.log(code, '-----签到列表--------');
        if (code === 200) {
          const list = data.signInList || [];
          const today = data.today;
          this.today = data.today;
          let sum = 0;
          list.forEach((item) => {
            if (item.day < today) {
              item.missed = !item.signIn;
            } else if (item.day > today) {
              sum += item.coin;
            } else {
              if (!item.signIn) {
                sum += item.coin;
              }
            }
          });
          this.signInList = list;
          this.sumCoin = sum;
          this.todayCoin = this.signInList[today]
            ? this.signInList[today].coin
            : '';
        }
      });
    },
    getDifferenceTime () {
      const nowTime = Date.now(); // 获取当前时间对应的毫秒数
      const endTime = new Date().setUTCHours(23, 59, 59); // 获取八点对应的毫秒数
      const differenceTime = endTime - nowTime;
      if (differenceTime <= 0) {
        return {
          hour: 0,
          min: 0,
        };
      } else {
        // 求出当前时间差对应的秒数 , 结果就是 n 秒 余 m 毫秒
        const seconds = Math.floor(differenceTime / 1000);
        // 求出当前时间差对应的分钟数 , 并求出余下的秒数
        const minutes = Math.floor(seconds / 60);
        // 求出当前时间差对应的小时数 , 并求出余下的分钟数
        const hours = Math.floor(minutes / 60);
        const remainMin = minutes % 60;
        // 返回值
        return {
          hour: hours,
          min: remainMin,
        };
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import url('~@/style/var.less');

.check-in__close {
  position: absolute;
  right: 0;
  top: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  background: #0E141C;
  z-index: 2;
  cursor: pointer;

  .icon-arrow {
    display: none;
  }
}

.check-in__con {
  position: relative;
  box-sizing: border-box;
  padding: 61px 11px 16px 13px;
  color: #012500;
  height: 100%;
  min-height: 600px;
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background: url(~@/assets/img/check-in-bg.png) top center no-repeat;
    background-size: 375px;
  }

  .check-in__top {
    width: 198px;
    height: 157px;
    padding-top: 9px;
    padding-left: 7px;
    box-sizing: border-box;

    .check-in-title {
      width: 167px;
      height: 63px;
      font-size: 16px;
      font-weight: bold;
      line-height: 15px;
      overflow: hidden;
      font-style: italic;
    }

    .check-in-desc {
      height: 66px;
      font-size: 14px;
      line-height: 16px;
      overflow: hidden;
    }
  }

  .check-in__main {
    margin-top: 39px;
    padding: 0;
    position: relative;

    .check-list {
      display: grid;
      grid-gap: 10px;
      grid-template-columns: repeat(4, 74px);
      padding: 11px 12px 0;

      .check-item {
        position: relative;
        background: #fff;
        border-radius: 9px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        height: 66px;
        background-size: contain;

        &.checked {
          background: url(~@/assets/img/check-in-item-bg.png) top center no-repeat;
          background-size: cover;

          .check-up-to {
            width: 70px;
          }
        }

        &.missed {
          background: #058902e6;

          .check-coin {
            padding-top: 22px;

            img {
              width: 20px;
              height: 20px;
            }
          }

          .check-up-to {
            color: #ffffff30;
          }
        }

        &:last-child {
          grid-column-start: span 2;

          &.checked {
            background-image: url(~@/assets/img/check-in-item-bg2.png);
            background-size: cover;
          }

          .check-up-to {
            background-image: url(~@/assets/img/check-in-item-b2.png);
            background-size: cover;
          }
        }

        .check-check-icon {
          position: absolute;
          left: 0;
          top: 0;
          width: 18px;
          height: 15px;
          background: url(~@/assets/img/check-in-check.png) top center no-repeat;
          background-size: contain;
        }

        .check-day {
          position: absolute;
          right: 6px;
          top: 2px;
          font-size: 9px;
          font-weight: bold;
          color: #076f04;
        }

        .check-coin {
          padding-top: 16px;
          font-size: 0;

          img {
            width: 32px;
            height: 32px;
          }
        }

        .check-up-to {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 28px;
          color: #fff;
          text-align: center;
          line-height: 36px;
          font-size: 12px;
          background: url(~@/assets/img/check-in-item-b.png) top center no-repeat;
          background-size: cover;
        }
      }
    }

    .check-success-box {
      position: absolute;
      top: 0;
      width: 100%;
      border-radius: 16px;
      background: #000000e3;

      .check-success-icon {
        padding-top: 35px;
        width: 47px;
        height: 47px;
        margin: 0 auto;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .check-success-txt {
        padding: 0 30px 15px;
        font-size: 12px;
        color: #FFFFFF;
        line-height: 20px;
        text-align: center;
        margin-top: 13px;
      }
    }

    .check-list-desc {
      margin-top: 22px;
      text-align: center;
      font-size: 13px;
      line-height: 15px;

      em {
        font-size: 22px;
        font-weight: bold;
      }
    }

    .check-btn-box {
      margin-top: 20px;

      .check-btn {
        cursor: pointer;
        width: 215px;
        height: 50px;
        margin: 0 auto;
        line-height: 50px;
        text-align: center;
        background: #000000;
        border-radius: 26px;
        color: #2fff00ff;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}

[lang='ar'],
[lang='he'],
[lang='ur'] {
  .check-in {
    direction: rtl;
  }

  .check-in__con {
    &:before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: -1;
      background: url(~@/assets/img/check-in-bg.png) top center no-repeat;
      transform: rotateY(180deg);
      background-size: 375px;
    }

    .check-in__top {
      padding-left: 0;
      padding-right: 7px;
      box-sizing: border-box;
    }
  }

  .check-in__close {
    left: 0;
    right: auto;
  }
}

@media screen and (max-width: 680px) {
  .check-in__close {
    left: 13px;
    right: auto;
    top: 10px;
    width: 32px;
    height: 32px;

    .icon-cross {
      display: none;
    }

    .icon-arrow {
      display: block;
    }
  }

  .check-btn-box {
    margin-top: 100px;
  }

  .check-in__main {
    .check-list {
      .check-item {

        .check-up-to,
        .check-day {
          font-size: 10px;
        }
      }
    }
  }

  [lang='ar'],
  [lang='he'],
  [lang='ur'] {

    .check-in__close {
      left: auto;
      right: 13px;
    }
  }

}
</style>

<style lang="less">
.check-in {
  .check-list-desc {
    em {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .pop-bg {

    backdrop-filter: blur(7px);
  }
}

@media screen and (max-width: 680px) {
  .check-in {
    .pop-content {
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, #ACFC60 0%, #EEFFEE 5%, #ECFFED 95%, #ADFB64 100%);
    }

    display: block;
    z-index: 302;
  }
}
</style>

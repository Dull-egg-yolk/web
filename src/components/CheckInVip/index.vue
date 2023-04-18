<template>
  <base-pop class="check-in-vip" :outClickCancel="true" :showPop="showVipCheckInPop" @cancelPop="closePop">
    <span class="check-in__close" @click="closePop"><i class="icon-cross"></i></span>
    <div class="check-in__con">
      <div class="check-in__main">
        <div class="check-in-title">{{ $t('webChat.checkIn.titleVip') }}</div>
        <template v-if="payStatus">
          <div class="check-list-desc" v-html="$t('webChat.checkIn.descVip', { num: checkInConf.totalCoin })"></div>
        </template>
        <template v-else>
          <div class="check-list-desc" v-html="$t('webChat.checkIn.descVip', { num: checkInConf.totalCoin })"></div>
        </template>
        <div class="check-btn-box">
          <div class="check-btn" @click="saveCheckIn" v-if="payStatus">
            {{ $t('webChat.checkIn.checkIn') }}
          </div>
          <div class="check-btn" @click="jumpToCoin" v-else>
            {{ $t('webChat.becomeVIP') }}
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
import { apiSaveSignIn } from '@/api/user';

export default {
  name: 'CheckInVip',
  data () {
    return {
      isChecking: false,
      hasChecked: false,
    };
  },
  props: {},
  components: {
    BasePop,
  },
  computed: {
    ...mapState({
      showVipCheckInPop: (state) => state.app.showVipCheckInPop,
      checkInConf: (state) => state.app.checkInConf,
      isMobile: (state) => state.app.isMobile,
      payStatus: (state) => state.app.userInfo.payStatus,
    }),
  },
  watch: {
    showVipCheckInPop: {
      handler (val) {
        if (val) {
          const id = this.payStatus ? '14-2-1-17' : '14-2-1-25';
          logReport({
            eventId: id, // 新用户签到弹窗展示
            freeName2: window.$mObj.adData || {},
            status: this.checkInConf.hasCheck,
            checkinType: this.checkInConf.type,
          });
        } else {
          this.isChecking = false;
        }
      },
      immediate: true,
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
      this.$store.commit('setVipCheckIn', false);
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
      // if (this.today > 6 || (this.today === 6 && this.checkInConf.hasCheck)) {
      //   this.$toast({
      //     html: this.$t('webChat.checkIn.checkInEnd')
      //   });
      //   setTimeout(() => {
      //     this.isChecking = false;
      //   }, 3000);
      //   return;
      // }
      const { hour, min } = this.getDifferenceTime();

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
          const conf = {
            hasCheck: true,
          };
          this.$store.commit('setCheckConf', conf);
          this.$toast({
            html: this.$t('webChat.checkIn.checkInSuccess', {
              num: res.totalCoin,
            })
          });
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
    jumpToCoin () {
      logReport({
        eventId: '14-2-1-26', // 新用户签到弹窗成为vip点击
        freeName2: window.$mObj.adData || {},
        checkinType: this.checkInConf.type,
      });
      this.$store.commit('setVipCheckIn', false);
    },
  },
};
</script>

<style lang="less" scoped>
@import url('~@/style/var.less');

.check-in-vip {
  .check-in__con {
    border-radius: 22px;

    background: url(~@/assets/img/checkin-box-bg.png) center -20px no-repeat, linear-gradient(180deg, #F2DEC3FF 55%, #dea763) 0 0;
    background-size: 205px, contain;
    // background: linear-gradient(356deg, #DDA55F 0%, #F2DEC3 100%);
  }

  .check-in__close {
    position: absolute;
    right: 8px;
    top: 8px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: #9C661D;
    z-index: 2;
    cursor: pointer;

  }

  .check-in__con {
    position: relative;
    box-sizing: border-box;
    padding: 110px 11px 16px 13px;
    color: #211710;
    z-index: 1;

    .check-in__main {
      padding: 0;
      position: relative;

      .check-in-title {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
      }

      .check-list-desc {
        font-size: 13px;
        text-align: center;
        font-family: Futura-Medium, Futura;
        margin-top: 19px;
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
          background: #211710;
          border-radius: 26px;
          color: #fff;
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
  }
}

[lang='ar'],
[lang='he'] {
  .check-in-vip {
    direction: rtl;

    .check-in__close {
      left: 8px;
      right: auto;
    }
  }

}

@media screen and (max-width: 680px) {
  .check-in__close {
    width: 32px;
    height: 32px;
  }

  .check-btn-box {
    margin-top: 100px;
  }

}
</style>

<style lang="less">
.check-in-vip {
  .pop-content {
    position: relative;
    width: 315px;
    background: linear-gradient(180deg, #eedbbf 0%, #9C661D 100%);
    // background: linear-gradient(356deg, #DDA55F 0%, #F2DEC3 100%);
    border-radius: 22px;
    padding: 5px;
  }

  .check-list-desc {

    em {
      font-size: 16px;
      font-weight: bold;
      font-style: normal;
    }
  }
}
</style>

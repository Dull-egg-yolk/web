<template>
  <base-popup :showPop="showRingBell" class="invite-call-pop" :class="matchClass">
    <div class="ring-bell">
      <div class="call-bg">
        <img :src="userInfo.headImg" alt="">
      </div>
      <div class="bg">
        <div class="shadow"></div>
        <img :src="userInfo.headImg" alt="">
      </div>

      <div class="call-info fx-ic">
        <div class="call-type fx-ic">
          <span class="icon-video2 icon"></span>
          {{$t('app.video_history_call_from_other')}}
        </div>
      </div>

      <div class="user-info">
        <div class="tips">{{$t('app.simulation_calling_connect_video')}}</div>
        <div class="name">{{ userInfo.userName }}</div>
        <div class="user-tags tag-list hc">
          <span class="m-tag age">
            <span class="ico icon-girl" v-if="userInfo.gender === 2"></span>
            <span class="ico icon-boy" v-else></span>
            {{userInfo.birthday | calculateAge}}
          </span>
          <span class="m-tag location" v-if="(userInfo.countryId || userInfo.countryCode)">
            <span class="ico icon-location-line"></span>
            <country :countryId="userInfo.countryId" type="name"></country>
          </span>
        </div>
        <div class="hb-tags tag-list hc" v-if="userInfo.interestLabels && userInfo.interestLabels.length">
          <div class="h-tag " v-for="(item, index) in userInfo.interestLabels" :key="index">{{ $t(`interest.${item}`) }}</div>
        </div>

        <div class="call-price" v-if="isMyCall && bizData.pricePerMinute">
          {{ bizData.pricePerMinute }} /min
        </div>
        <div class="actions">

          <div class="btns">
            <div class="btn cancel" @click="cancel">
              <div class="ico fx-c">
                <span class="icon-hangup"></span>
              </div>
            </div>
            <div class="btn accept" v-if="curCallRole === 'callee'" @click="accept">
              <div class="ico fx-c">
                <span class="icon-video2"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </base-popup>
</template>

<script>
import { mapState } from 'vuex';
import BasePopup from '../BasePop.vue';
import { apiRtmcancel, apiRefuse, apiAnswer } from '@/api/call';
import { calculateAge } from '@/filters';
import { getOtherProfile } from '@/api/user';
import { logReport } from '@/util/logReport';

export default {
  name: 'InviteCall',
  data () {
    return {
      showPop: false
    };
  },
  filters: {
    calculateAge,
  },
  components: {
    BasePopup,
  },
  computed: {
    ...mapState({
      myUID: (state) => state.app.userInfo.id,
      showRingBell: (state) => state.app.showRingBell,
      bizData: (state) => state.agora.bizData,
      curRoomNum: (state) => state.agora.curRoomNum,
      curCallRole: (state) => state.agora.curCallRole,
      isHomeHost: (state) => state.app.isHomeHost,
      homeParams: (state) => state.app.homeParams,
      isMatchCall: (state) => state.app.isMatchCall,
      showVideoPop: (state) => state.app.showVideoPop
    }),
    userInfo () {
      return this.bizData.remoteUserInfo || {};
    },
    isMyCall () {
      return this.bizData.sendUserId === this.myUID;
    },
    logParams () {
      const logParams = {};
      if (this.isHomeHost) {
        Object.assign(logParams, this.homeParams);
      }
      return logParams;
    },
    matchClass () {
      return (this.isMatchCall || this.bizData.goddessLocation === 100) ? 'matchHide' : '';
    }
  },
  watch: {
    curRoomNum (o) {
      if (o) {
        // 曝光上报
        logReport({
          eventId: this.curCallRole === 'caller' ? '106-1-3-0' : '106-1-3-5',
          freeName2: this.curCallRole === 'caller' ? {} : this.logParams,
          target_user_id: this.bizData.remoteUserInfo.id,
          roomId: o,
          callLocation: this.bizData.goddessLocation,
        });

        this.$nextTick(() => {
          getOtherProfile({
            searchUserId: this.bizData.remoteUserInfo.id
          }).then(({ code, data }) => {
            if (code !== 200) return;
            this.$store.commit('setRemoteUserData', data);
            if (this.curCallRole === 'callee') {
              this.$store.dispatch('cancelBell');
            }
          });
        });
      }
    },
    $route (n, v) {
      if (n.name === 'LivCam') {
        setTimeout(() => {
          if (this.bizData.goddessLocation && this.bizData.goddessLocation === 100) {
            console.log('------匹配呼叫结束-showRingBell--');
            this.cancel();
          }
        }, 100);
      }
    },
  },
  methods: {
    async accept () {
      // 上报
      logReport({
        eventId: '106-1-3-6',
        freeName2: this.logParams,
        target_user_id: this.bizData.remoteUserInfo.id
      });
      this.$store.commit('setBellState', false);
      this.$store.commit('setVideoPopState', true);
      apiAnswer({ roomNum: this.curRoomNum }).then(res => {
        console.log(res, '接听');
      });
    },
    cancel () {
      const { curRoomNum } = this.$store.state.agora.tempData;
      // 邀请方取消呼叫
      if (!curRoomNum) {
        console.log('--curRoomNum 空---', curRoomNum, this.$store.state.agora);
        return;
      }
      if (this.showVideoPop) return;
      const userId = this.bizData.remoteUserInfo && this.bizData.remoteUserInfo.id;
      if (this.isMyCall) {
        // 上报
        logReport({
          eventId: '106-1-3-1',
          freeName2: this.logParams,
          target_user_id: userId
        });

        window.$mObj.timer && clearTimeout(window.$mObj.timer);

        if (curRoomNum) {
          apiRtmcancel({
            roomNum: curRoomNum
          }).then(res => {
            this.$store.commit('resetVideoChat');
            console.log(res, 'apiRtmcancel');
          });
          localStorage.setItem('RC_CANCEL_ROOM', this.curRoomNum);
        }
      } else {
        logReport({
          eventId: '106-1-3-7',
          freeName2: this.logParams,
          target_user_id: userId
        });
        // 被邀方拒接
        if (curRoomNum) {
          apiRefuse({ roomNum: curRoomNum }).then(res => {
            this.$store.commit('resetVideoChat');
            console.log(res);
          });
        }
      }
      this.$store.commit('setBellState', false);
    },
  },
  mounted () {
    console.log(this.bizData, 'bizData--------');
  }
};
</script>

<style lang="less">
@import url("./index.less");
</style>

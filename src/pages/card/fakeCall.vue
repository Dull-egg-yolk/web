<template>
    <div class="fake-call-pop" v-if="isShow">
        <div class="cover">
            <img :src="hostData.headImg" alt="">
        </div>
        <div class="inner-box">
            <div class="bg">
                <img :src="hostData.headImg" alt="">
            </div>
            <div class="both-avatar">
                <div class="head-img">
                    <div class="avatar-head">
                        <fitimg :headImg="hostData.headImg" type="smailimg"></fitimg>
                    </div>

                    <div class="avatar-head host-h">
                        <fitimg :headImg="userInfo.headImg" type="smailimg"></fitimg>
                    </div>
                </div>
                <div class="flow-hear">
                    <div class="h1"></div>
                    <div class="h2"></div>
                    <div class="h3"></div>
                    <div class="h4"></div>
                    <div class="h5"></div>
                </div>
                <div class="the-tips">
                    {{ $t('app.cam_like_each_other', { name: hostData.userName }) }}
                </div>
            </div>
            <div class="act-box">
                <div class="txt" v-if="!fakeCallBegin">{{ $t('app.cam_invite_chat', { name: hostData.userName }) }}</div>
                <template  v-else>
                  <div class="txt">{{ $t('app.simulation_calling_connect_video') }}</div>
                  <div class="call-price" v-if="bizData.pricePerMinute">
                    {{ bizData.pricePerMinute }} /min
                  </div>
                </template>
                <div class="btns">
                    <button class="btn cancel" @click="cancelFakeCallAct" v-preventReClick>
                        <div class="ico fx-c">
                            <span class="icon-hangup"></span>
                        </div>
                    </button>
                    <button class="btn accept" @click="fakeToCall" v-if="!fakeCallBegin" v-preventReClick>
                        <div class="ico fx-c">
                            <span class="icon-video2"></span>
                        </div>
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { logReport } from '@/util/logReport';
import agoraMixin from '@/mixin/agoraMixin';

export default {
  name: 'fakeCall',

  mixins: [agoraMixin],
  props: {
    hostData: {
      type: Object,
      default: function () {
        return { };
      }
    },
    isShow: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      fakeHideTimer: null,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.app.userInfo,
      showVideoPop: (state) => state.app.showVideoPop,
      fakeCallBegin: (state) => state.app.fakeCallBegin,
      bizData: (state) => state.agora.bizData,
    }),
  },

  watch: {
    isShow (n) {
      if (!n) {
        if (window.$mObj.bellAudio) {
          // pause 控制停止播放  load 控制下次重头播放
          window.$mObj.bellAudio.pause();
          window.$mObj.bellAudio.load();
          clearTimeout(this.fakeHideTimer);
        }
        this.$store.commit('setFakeCallBegin', false);
      } else {
        logReport({
          eventId: '106-9-1-1', // 模拟来电展示
          callLocation: window.$mObj.cardConf.afterLikeFakeCallLocation,
          target_user_id: this.hostData.userId,
          page: this.$route.name,
          r_resource: 'card'
        });
        window.$mObj.bellAudio && window.$mObj.bellAudio.play();

        this.fakeHideTimer = setTimeout(() => {
          this.cancelFakeCall();
        }, 15 * 1000);
      }
    },
    showVideoPop (n) {
      if (n) {
        clearTimeout(this.fakeHideTimer);
        if (window.$mObj.bellAudio) {
          // pause 控制停止播放  load 控制下次重头播放
          window.$mObj.bellAudio.pause();
          window.$mObj.bellAudio.load();
        }
      } else {
        this.$emit('cancel');
      }
    },
    fakeCallBegin (n) {
      console.log('---fake--------', n);
      if (!n) {
        this.cancelFakeCall();
      }
    }
  },
  methods: {
    cancelFakeCallAct () {
      logReport({
        eventId: '106-9-1-3', // 模拟来电挂断点击
        callLocation: window.$mObj.cardConf.afterLikeFakeCallLocation,
        target_user_id: this.hostData.userId,
        page: this.$route.name,
        r_resource: 'card',
        calling: +this.fakeCallBegin
      });
      this.$parent.$parent.$parent.$refs.inviteCall.cancel();

      this.$emit('cancel');
    },
    fakeToCall () {
      logReport({
        eventId: '106-9-1-2', // 模拟来电接听点击
        callLocation: window.$mObj.cardConf.afterLikeFakeCallLocation,
        target_user_id: this.hostData.userId,
        page: this.$route.name,
        r_resource: 'card'
      });
      if (window.$mObj.bellAudio) {
        // pause 控制停止播放  load 控制下次重头播放
        window.$mObj.bellAudio.pause();
        window.$mObj.bellAudio.load();
      }
      clearTimeout(this.fakeHideTimer);
      this.callAction(this.hostData, window.$mObj.cardConf.afterLikeFakeCallLocation);
    },
    fakeStarCall () {
      this.$store.commit('setFakeCallBegin', false);
    },
    cancelFakeCall () {
      this.$emit('cancel');
      this.$store.commit('setFakeCallBegin', false);
      this.$parent.$parent.$parent.$refs.inviteCall.cancel();
    }
  }
};
</script>

<style lang="less">
@import url('./index.less');
</style>

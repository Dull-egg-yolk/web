<template>
  <base-pop class="pop-public web-push" :outClickCancel="false" :showPop="showWebPushPop"
    @cancelPop="closePop">
    <div class="web-push__con">
      <div class="web-push__img">
        <img :src="webPushInfo.img" alt="">
      </div>
    </div>

    <p class="pop-banner-txt" v-if="times===0" v-html="$t('webChat.pushNote1', { num: webPushInfo.gold })">
    </p>
    <p class="pop-banner-txt" v-if="times===1" v-html="$t('webChat.pushNote2', { num: webPushInfo.gold })"></p>
    <div class="pop-action">
      <div class="m-btn major" @click="accept">{{$t('base.confirm')}}</div>
      <div class="m-btn white" @click="closePop">{{$t('base.cancel')}}</div>
    </div>
  </base-pop>
</template>

<script>
import { isSupported } from 'firebase/messaging';
import { mapState } from 'vuex';
import BasePop from '../BasePop.vue';
import { logReport } from '@/util/logReport';
import { getStorageByDay, setStorageByDay } from '@/util/index';
import { checkWebPush } from '@/api/user';

export default {
  name: 'WebPush',
  data () {
    return {
      showWebPushPop: false,
      times: 0,
      giftCoins: 200, // 赠送金币
      secondPopFn: null,
      secondShowGap: 1000 * 60 * 5, // 5分钟
      webPushInfo: {
        status: false,
        gold: '',
        img: ''
      }
    };
  },
  props: {},
  components: {
    BasePop,
  },
  computed: {
    ...mapState({
      showWebPush: (state) => state.app.showWebPush,
      showRingBell: (state) => state.app.showRingBell,
      showVideoPop: (state) => state.app.showVideoPop,
      showImChat: (state) => state.app.imChatConfig.show,
    }),
  },
  watch: {
    showWebPush: {
      handler (val) {
        if (val) {
          this.checkSupported();
        }
      },
      immediate: true
    }
  },
  methods: {
    closePop (type) {
      logReport({
        eventId: '106-1-9-10', // 是否授权通知结果
        freeName2: window.$mObj.adData || {},
        times: this.times,
        status: 0 // 0：拒绝 1：同意
      });
      this.$store.commit('setWebPush', false);
      this.showWebPushPop = false;
      this.checkSecondPop();
    },
    /**
     * 允许通知
     */
    accept () {
      logReport({
        eventId: '106-1-9-10', // 是否授权通知结果
        freeName2: window.$mObj.adData || {},
        times: this.times,
        status: 1 // 0：拒绝 1：同意
      });
      this.$store.commit('setWebPush', false);
      this.showWebPushPop = false;
      this.$firebase();
    },
    initPushPop () {
      console.log('[WebPush]:--通知权限-弹窗显示处理-----');
      if (this.times === 0) {
        // 只在首页同时非通话状态弹出
        this.checkSecondPop();
      } else {
        console.log('[WebPush]:--init-已显示1次了----');
        clearTimeout(this.secondPopFn);
      }
    },

    // 第一次弹出
    checkSecondPop () {
      clearTimeout(this.secondPopFn);
      this.times = getStorageByDay('webPushPopInfo');
      if (this.times >= 1) {
        console.log('[WebPush]:--loop-今日已显示1次了----');
        clearTimeout(this.secondPopFn);
        return;
      }
      const name = this.$route.name;
      const isIndex = ['LivCam', 'FriendPage', 'FriendsPage', 'MessagePage'].includes(name);

      const matchTimes = getStorageByDay('RC_todayMatchTimes');
      const isMore = matchTimes >= 1;

      const isProhibit = this.showVideoPop || this.showImChat || this.showRingBell;

      console.log('[WebPush]:---首次弹出 web push 检查--', matchTimes, isIndex, !isProhibit);

      this.secondPopFn = setTimeout(() => {
        if (!isProhibit && isIndex && isMore) {
          this.showWebPushPop = true;
          console.log('[WebPush]:--1--getWebPushInfo------', this.times);
          logReport({
            eventId: '106-1-9-9', // 是否授权通知弹窗曝光（弹窗）
            freeName2: window.$mObj.adData || {},
            times: this.times
          });
          setStorageByDay('webPushPopInfo', 1);
          clearTimeout(this.secondPopFn);
        } else {
          this.checkSecondPop();
        }
      }, 2 * 1000);
    },
    // 浏览器支持情况
    async checkSupported () {
      const isSupport = await isSupported();
      const permission = Notification.permission;
      if (isSupport) {
        console.log('[WebPush]:--- 支持 push 00-----', permission);
        logReport({
          eventId: '106-1-9-7', // 用户浏览器通知功能是否可调用
          freeName2: window.$mObj.adData || {},
          times: this.times,
          support: 1
        });
        if (permission === 'granted') {
          logReport({
            eventId: '106-1-9-8', // 用户浏览器通知授权情况
            freeName2: window.$mObj.adData || {},
            times: this.times,
            status: 1 // 0：禁止 1：允许 2：未授权
          });
          this.$firebase();
        } else if (permission !== 'denied') {
          this.checkWebPush();
          logReport({
            eventId: '106-1-9-8', // 用户浏览器通知授权情况
            freeName2: window.$mObj.adData || {},
            times: this.times,
            status: 2
          });
        } else {
          console.log('[WebPush]:---用户已经禁止--');
          logReport({
            eventId: '106-1-9-8', // 用户浏览器通知授权情况
            freeName2: window.$mObj.adData || {},
            times: this.times,
            status: 0
          });
        }
      } else {
        console.log('[WebPush]:--- 不支持 -----');
        logReport({
          eventId: '106-1-9-7', // 用户浏览器通知功能是否可调用
          freeName2: window.$mObj.adData || {},
          times: this.times,
          support: 0
        });
      }
    },
    // 检查是否已经弹出过
    checkWebPush () {
      this.times = getStorageByDay('webPushPopInfo');
      if (this.times >= 1) {
        console.log('[WebPush]:--check-今日已显示1次了----');
        clearTimeout(this.secondPopFn);
        return;
      }
      const params = {
        countryId: localStorage.getItem('RC_USER_COUNTRY'),
      };
      checkWebPush(params).then(res => {
        console.log(res, '[WebPush]:---服务器检查---');
        const data = res.data || {};
        if (res.code === 200 && !data.status) {
          this.webPushInfo = data;
          this.initPushPop();
        }
      });
    }
  },
};
</script>

<style lang="less" scoped>
@import url('~@/style/var.less');

.web-push__con {
  position: relative;
  box-sizing: border-box;
  padding: 0;
  .user-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 8px;
    cursor: pointer;
  }
  .web-push__img {
    font-size: 0;
    img {
      border-radius: 16px 16px 0 0;
      max-width: 100%;
    }
  }
}
</style>

<style lang="less">
.web-push {
  .pop-banner-txt {
    font-size: 16px;
    font-family: Helvetica;
    text-align: center;
    line-height: 30px;
    padding: 0 10px;
    margin-top: 18px;
    em {
      font-size: 30px;
      font-weight: bold;
    }
  }

  .pop-bg {
    background: #00000080;
  }

}

@media screen and (max-width: 680px) {
  .web-push {
    .web-push__con {
      padding: 0;
    }

    .pop-banner-txt {
      margin-top: 10px;
    }
  }
}
</style>

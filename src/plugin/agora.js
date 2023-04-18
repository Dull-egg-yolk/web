import Vue from 'vue';
import RTMClient from './rtm-client';
import RTCClient from './rtc-client';
import store from '@/store';

export default {
  install () {
    const appId = window.baseConfig.agoraAppid;

    Vue.prototype.$initAgora = async (context) => {
      const options = {
        uid: store.state.agora.rtmUserId,
        token: store.state.agora.rtmToken,
      };

      Vue.prototype.$rtm = new RTMClient(appId);

      Vue.prototype.$rtc = new RTCClient({
        appId,
        ...options,
      });

      await Vue.prototype.$rtm.login(options);

      Vue.prototype.$callUid = localStorage.getItem('rtcPeer');
    };
  },
};

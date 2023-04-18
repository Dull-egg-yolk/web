// 各网站样式导入
import Vue from 'vue';
// import { getParams, setAutograph } from '@/util/index';
import agoraSDK from './plugin/agora';
import App from './App.vue';
import store from './store';
import i18n from './i18n';
import rcUI from '@/util/commonUI';
import router from './router';
import messageBox from './components/messageBox/index.js';
import toast from './components/toast/index.js';
import firebase from './util/firebase';
import countryCode from './assets/data/country';
import languageCode from './assets/data/language';
import { init } from './util/updateIcon';
import Cookies from 'js-cookie';
import directive from './util/directive.js';
// eslint-disable-next-line no-new
// if (baseConfig.env === 'dev') new window.VConsole();
try {
  // eslint-disable-next-line no-unused-expressions
  import(`@/style/${window.baseConfig.appName}.less`);
} catch (e) {}

Cookies.set('appId', window.baseConfig.appId);

init();
// 声网RTM RTC 注入
Vue.use(directive);
Vue.use(agoraSDK);
Vue.use(rcUI);

// 通用messageBox 注入
Vue.prototype.$message = messageBox;
Vue.prototype.$toast = toast;
Vue.prototype.$firebase = firebase;

// 通用数据注入
Vue.prototype.$countryCode = countryCode;
Vue.prototype.$languageCode = languageCode;

let webViewName = '';
var ua = navigator.userAgent;
if ((ua.indexOf('FBAN') > -1) || (ua.indexOf('FBAV') > -1)) {
  webViewName = 'facebook';
}

// 通用的全局暂存对象
window.$mObj = {
  userStatus: {
    0: 'offline',
    1: 'busy',
    2: 'online',
    3: 'invsible'
  },
  cardConf: {
    afterLikeFakeCallLocation: 132,
    afterLikeNormalCallLocation: 131,
    countdownOfSeconds: 10,
    fakeCallPageShowSeconds: 30,
    mainPageCallLocation: 130,
    normalCallUnitPrice: 80,
    playWayUnitPrice: 0,
    wallCallLocation: 104,
  },
  searchConf: {
    afterLikeFakeCallLocation: 138,
    afterLikeNormalCallLocation: 137,
    countdownOfSeconds: 10,
    fakeCallPageShowSeconds: 30,
    mainPageCallLocation: 136,
    normalCallUnitPrice: 80,
    playWayUnitPrice: 0,
    wallCallLocation: 104,
  },
  matchConf: {},
  webViewName,
};

document.body.style.backgroundColor = '#0A070F';

// 获取地址栏参数，设置登录信息
// const queryParams = getParams();
// setAutograph(queryParams);

/* eslint-disable no-new */
export default new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

setTimeout(() => {
  const bellAudio = document.createElement('audio');
  bellAudio.src = 'https://h5.livuchat.com/static/sound/bell.mp3';
  bellAudio.loop = true;
  bellAudio.preload = true;
  document.body.appendChild(bellAudio);

  const msgAudio = document.createElement('audio');
  msgAudio.src = 'https://h5.livuchat.com/static/sound/ding.mp3';
  msgAudio.preload = true;
  document.body.appendChild(msgAudio);

  let isAudioLoad = false;
  document.addEventListener('touchend', () => {
    if (!isAudioLoad) {
      bellAudio.load();
      msgAudio.load();
      isAudioLoad = true;
    }
  });

  window.$mObj.bellAudio = bellAudio;
  window.$mObj.msgAudio = msgAudio;
}, 2000);

// web app 这个监听在 sw安装后 非首次打开页面时 触发的时候早于组件内的生命周期 需要在这里记录一下 然后在 installApp 组件内去处理
window.$mObj.webAppCtx = null;
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('webapp 4');
  e.preventDefault();
  window.$mObj.webAppCtx = e;
});

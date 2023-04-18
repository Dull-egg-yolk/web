import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from 'firebase/messaging';
import store from '@/store';
import { savePushToken } from '@/api/user';
import { logReport } from '@/util/logReport';
import { getStorageByDay } from '@/util/index';

const firebaseConfig = baseConfig.firebaseConfig;

let app = null;
let messaging = null;
if ('serviceWorker' in navigator) {
  app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

const vapidKey = baseConfig.vapidKey;

let times = 0;

// Saves the messaging device token to Cloud Firestore.
async function saveMessagingDeviceToken () {
  try {
    times = getStorageByDay('webPushPopInfo');
    logReport({
      eventId: '106-1-9-11', // 通知授权请求（系统弹窗）
      freeName2: window.$mObj.adData || {},
      times: times
    });
    const currentToken = await getToken(messaging, { vapidKey });
    if (currentToken) {
      console.log('[firebase] Got FCM device token:', currentToken);
      store.commit('setPushToken', currentToken);
      updatePushToken(currentToken);
      logReport({
        eventId: '106-1-9-12', // 通知授权结果（系统弹窗）
        freeName2: window.$mObj.adData || {},
        times: times,
        status: 1 // 0：拒绝 1：同意
      });
      // This will fire when a message is received while the app is in the foreground.
      // When the app is in the background, firebase-messaging-sw.js will receive the message instead.
      onMessage(messaging, (message) => {
        console.log('[Firebase Messaging!]', message);
      });
    } else {
      // Need to request permissions to show notifications.
      console.log('------------666---------');
      logReport({
        eventId: '106-1-9-12', // 通知授权结果（系统弹窗）
        freeName2: window.$mObj.adData || {},
        times: times,
        status: 0 // 0：拒绝 1：同意
      });
    }
  } catch (error) {
    const permission = Notification.permission;
    console.error('[firebase]  Unable to get messaging token.', permission, '--permission--', error);
    if (permission === 'granted') {
      updatePushToken();
    }
    logReport({
      eventId: '106-1-9-12', // 通知授权结果（系统弹窗）
      freeName2: window.$mObj.adData || {},
      times: times,
      status: 0, // 0：拒绝 1：同意
      permission: permission
    });
  }
}

async function requestNotificationsPermissions () {
  console.log('[firebase] Requesting notifications permission...');
  const permission = await Notification.requestPermission();

  console.log(permission, '-------permission------');

  if (permission === 'granted') {
    console.log('[firebase] Notification permission granted.');
    // Notification permission granted.
    await saveMessagingDeviceToken();
  } else {
    console.log('[firebase] Unable to get permission to notify.');
  }
}

async function updatePushToken (currentToken) {
  let token = currentToken;
  if (!token) {
    try {
      token = await getToken(messaging, { vapidKey });
    } catch (error) {
      console.error('[firebase] -updatePushToken-  Unable to get messaging token.', error);
    }
  }
  console.log(store.state.app.isLogin, '[firebase]------store.state.app.isLogin-----');
  if (!store.state.app.isLogin) return;
  const gender = store.state.app.userInfo && store.state.app.userInfo.gender;
  console.log(gender, '-----[firebase]---gender----------');
  if (!token) return;
  const data = {
    pushToken: token,
    gender: gender,
    countryId: localStorage.getItem('RC_USER_COUNTRY'),
  };
  savePushToken(data).then((res) => {
    console.log('[firebase]更新用户 FCM device token', res);

    store.dispatch('updateMyUserData');
  });
}

async function init () {
  const isSupport = await isSupported();
  const permission = Notification.permission;
  if (isSupport) {
    console.log('[firebase]--- 支持 push -----', permission);
    if (permission === 'granted') { // 同意，直接更新
      console.log('[firebase]---用户已同意，直接更新--');
      updatePushToken();
    } else if (permission !== 'denied') {
      saveMessagingDeviceToken();
    } else {
      console.log('[firebase]---用户已经禁止--');
    }
  } else {
    console.log('[firebase]--- 不支持 -----');
  }
}

export default init;

// init();

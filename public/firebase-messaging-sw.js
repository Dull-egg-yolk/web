importScripts('https://www.gstatic.com/firebasejs/9.6.6/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.6/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'AIzaSyC6QyjqrgG8hwdRiskukYbo96jf8VNhJuY',
  authDomain: 'gomeet-4d4cb.firebaseapp.com',
  projectId: 'gomeet-4d4cb',
  storageBucket: 'gomeet-4d4cb.appspot.com',
  messagingSenderId: '264485268596',
  appId: '1:264485268596:web:3885237373baaea4eff521',
  measurementId: 'G-JBXWPZPFK1'
}

firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging();

// 接收消息
/**
 * {
    "from": "91054324669",
    "messageId": "b6169d48-4b2d-43e2-bdf6-8a546e28caf8",
    "data": {
        "message": "{\"userId\":116220194,\"messageUuid\":\"a8c2a444b8ab4e20b77ca8036671139c\",\"type\":13,\"content\":\"ytccc is online now!\",\"foregroundPop\":true,\"timestamp\":1669972521761,\"pushId\":80124,\"headImg\":\"https://rc-athena-test.s3.us-east-2.amazonaws.com/profile/20220907/81730befd1f7a025_3c3386a8-1a4f-4ffc-b4a7-713f43e52bdb.jpg\",\"friendUserId\":116218302}"
    }
}
 */
messaging.onBackgroundMessage(async (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  try {
    const {data} = payload
    const message = JSON.parse(data.message)
    if(typeof message === 'object') {
      // 不需要弹通知
      if(!message.content) {
        return
      }

      // Customize notification here
      const notificationTitle = message.title || '';

      const icon = message.preUrl || message.headImg
      const userId = message.userId

      let cookies = await cookieStore.getAll()
      let obj = _arrToObj(cookies)
      let uid = +obj.userId || ''

      console.log(obj, '---------cookies-----------');
      // todo 本地无用户id时处理
      if(userId !== uid) {
        console.log('-----不是当前用户------');
      }

      const notificationOptions = {
        body: message.content,
        icon,
        data: message
      };

      report({
        eventId: '106-1-9-13',
        freeName2: userId,
        userId: message.userId,
        type: message.type || message.bizType,
        messageUuid: message.messageUuid
      }) // 消息显示

      self.registration.showNotification(notificationTitle,
        notificationOptions);
    }
  } catch (error) {
    console.log('----firebase 消息出错-----', error);
  }

});

self.addEventListener('notificationclick', (event) => {
  console.log('On notification click: ', event);
  event.notification.close();
  const data = event.notification.data
  report({ eventId: '106-1-9-14', freeName2: data.userId, userId: data.userId,
  type: data.type || data.bizType,
  messageUuid: data.messageUuid }) // 消息点击

  cookieStore.set('push_notification', JSON.stringify(data))

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: 'window', includeUncontrolled: true
  }).then((clientList) => {
    console.log(clientList, '------clientList-------');
    let len = clientList.length
    if(len) {
      let client = clientList[0]
      if('focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow('/');
    }
  }));
});

self.addEventListener('notificationclose', (event) => {
  console.log('------todo--上报--');
  const data = event.notification.data
  report({ eventId: '106-1-9-15', freeName2: data.userId, userId: data.userId, type: data.type || data.bizType,
  messageUuid: data.messageUuid }) // 消息关闭
 });

function _arrToObj (arr) {
  let obj = {}
  arr.forEach(item => {
      obj[item.name] = item.value
  })
  return obj
}


let URLRoot = 'https://wchat.rcplatformhk.com'

function ajaxFn (option) {
  let method = option.method || 'POST',
      url = URLRoot + option.url,
      data = option.data || {}

  return fetch(url, {
      method: method,
      body: JSON.stringify(data),
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
      }
  }).then(res => {
      console.log('上报结果：', res.status)
  })
      .catch(error => console.error('Error:', error))
      .then(response => console.log('Success:', response))

}

async function report (data) {
  if (!data) return false //* 数据兼容性有问题
  let cookies = await cookieStore.getAll()
  let obj = arrToObj(cookies)
  let userId = obj.userId || ''
  let deviceId = obj.deviceId || ''
  let appId = obj.appId || 90003

  let date = new Date()

  let params = {
      time: date.getTime(), //* 时间戳
      createTime: parseDate(), //* create_time
      xaid: 0, //* 登陆状态：0 未登陆，1 face ，2 phone，3 ID
      userId: userId, //* 用户编号（用户用账号或者ID登陆之后必须返回该字段信息）
      appId,
      platformType: obj.platformType || 4, //* 平台：1 ios，2 android，3 other
      advertIdentifier: 'push', //* 网页支付的渠道来源
      placeId: 106, //* 板块ID
      attr1: 1, //* 一级页面ID
      attr2: 1, //* 二级页面ID
      eventId: '', //* 事件ID
      freeName2: '', //* 备注
      cl: navigator.language, //* 系统语言
      capi: '', //* 国家简称
      deviceId: deviceId, //* 用户设备唯一id
      model: navigator.userAgent, //* 浏览器
      brand: '',//* 页面pageName
  }

  let newData = _mergeOption(params, data)

  ajaxFn(
      {
          method: 'POST',
          url: '/facade/api/bury/exempt/addUserRequestBuryRecordAll',
          data: newData
      }
  )
}

function arrToObj (arr) {
  let obj = {}
  arr.forEach(item => {
      obj[item.name] = item.value
  })
  return obj
}

function _mergeOption (params, options) {
  const baseKeys = ['eventId', 'targetUserId', 'freeName1', 'freeName2'];
  const objOpt = {};
  let free2 = {
    browserUA: navigator.userAgent
  };



  for (const [name, value] of Object.entries(options)) {
    const key = underline2Hump(name);
    objOpt[key] = value;

    if (!baseKeys.includes(key)) {
      free2[key] = value;
    }
  }
  if (typeof objOpt.freeName2 === 'string') {
    free2.freeName2 = objOpt.freeName2;
  } else if (typeof objOpt.freeName2 === 'object') {
    free2 = { ...free2, ...objOpt.freeName2 };
  }

  objOpt.freeName2 = JSON.stringify(free2);

  return { ...params, ...objOpt };
}
/**
 * 字符串的下划线格式转驼峰格式，eg：hello_world => helloWorld
 * @param s
 * @returns {*}
 */
function underline2Hump(s) {
  return s.replace(/_(\w)/g, function(all, letter) {
      return letter.toUpperCase()
  })
}

// 获取标准日期格式
function parseDate (date, utc) {
  if (date === null) return new Date(NaN); // null is invalid
  if (date === undefined) return new Date(); // today
  if (date instanceof Date) return new Date(date);
  if (typeof date === 'string' && !/Z$/i.test(date)) {
    const REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/;
    const d = date.match(REGEX_PARSE);
    if (d) {
      const m = d[2] - 1 || 0;
      const ms = (d[7] || '0').substring(0, 3);
      if (utc) {
        return new Date(Date.UTC(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms));
      }
      return new Date(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms);
    }
  }

  return new Date(date); // everything else
};
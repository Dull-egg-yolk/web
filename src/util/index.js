import Cookies from 'js-cookie';
import { timeFormat } from '@/util/dayjs';
import i18n from '@/i18n';

/**
 * 获取 url 中的参数
 * @param {string} name cookie 中的 key
 * @param {string} url 合法的 URL 字符串
 * @returns cookie 值或者对象
 */
export const getParams = function (name, url) {
  const str = url || window.location.href;
  let paramsMap = {};
  const index = str.lastIndexOf('?');
  if (index === -1) {
    // 没有参数
    return paramsMap;
  }
  const paramStr = str.substring(index + 1, str.length);
  if (!paramStr) {
    // 参数为空
    return paramsMap;
  }

  const pairs = paramStr.split('&');

  paramsMap = pairs.map(pair => {
    const [key, value] = pair.split('=');
    return [decodeURIComponent(key), decodeURIComponent(value)];
  }).reduce((res, [key, value]) => Object.assign(res, { [key]: value }), {});

  return name ? paramsMap[name] || '' : paramsMap;
};

/**
 * 保存 url 中所有参数到 cookies
 * @param {*} obj url 中获取
 */
export const setAutograph = function (obj) {
  const saveKeys = ['deviceId', 'userId', 'nonce', 'countryId', 'countryCode', 'appId', 'platformType', 'loginToken'];
  for (const [key, value] of Object.entries(obj)) {
    if (saveKeys.includes(key)) {
      value && Cookies.set(key, value);
    }
  }
};

/**
 * 清除cookie
 */

const stayCookies = ['deviceId', 'acceptCookie', 'oneWayAFPop', 'RC_POP_18'];
export const clearAllCookie = function () {
  var date = new Date();
  date.setTime(date.getTime() - 10000);
  var keys = document.cookie.match(/[^ =;]+(?==)/g);
  if (keys) {
    for (var i = keys.length; i--;) {
      if (stayCookies.indexOf(keys[i]) !== -1) continue;
      document.cookie = keys[i] + '=""; expire=' + date.toGMTString() +
              '; path=/';
    }
  }
};

/**
 * 跳到其他页面时时的完整地址
 * @param {string} host 跳转的域名
 * @param {object} config 携带的参数
 */
export const getBaseUrl = function (host, config = {}) {
  const baseParams = {
    userId: Cookies.get('userId'),
    deviceId: Cookies.get('deviceId'),
    appId: Cookies.get('appId'),
    loginToken: Cookies.get('loginToken'),
    nonce: Cookies.get('nonce'),
    platformType: 4, // 网关验签要用到
    jumpTime: Date.now(),
    source2: 'webservice'
  };
  console.log('baseParams', baseParams);
  const newParams = Object.assign({}, baseParams, config);
  const query = jsonToQuery(newParams, true);
  return host + '?' + query;
};

/**
 * 对象转化参数
 * @param {object} obj
 * @param {boolean} encode
 * @returns
 */
export const jsonToQuery = function (obj, encode) {
  const rs = [];
  if (isObject(obj)) {
    for (const [key, val] of Object.entries(obj)) {
      if (!isEmpty(val)) {
        rs.push(key + '=' + (encode ? encodeURIComponent(val) : val));
      }
    }
  }
  return rs.join('&');
};

export const isObject = (obj) => {
  return obj !== null && typeof obj === 'object';
};

export const isEmpty = (val) => {
  return val === undefined || val === null || val === '';
};

/**
 * 生成随机字符串方法：用于生成deviceId
 * @param {boolean} flag 是否是随机长度
 * @param {number} min 生成随机数最小长度
 * @param {number} max 生成随机数最大长度
 * @returns string 随机数
 */
export const randomWord = function (flag, min, max) {
  let str = '';
  let range = min;
  const rangeBase = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let pos;

  if (flag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (var i = 0; i < range; i++) {
    pos = Math.round(Math.random() * (rangeBase.length - 1));
    str += rangeBase[pos];
  }
  return str;
};

// 秒转化成 时分秒
export const secondToDate = function (result, arr = ['h', 'min', 's']) {
  if (+result === 0) return result + arr[2];
  const h = Math.floor(result / 3600);
  const m = Math.floor((result / 60 % 60));
  const s = Math.floor((result % 60));
  const times = [h, m, s];
  let resultStr = '';
  times.forEach((item, index) => {
    if (item) {
      resultStr = resultStr + item + arr[index];
    }
  });
  return resultStr;
};

// todo 使用 dayjs 替换 日期格式化
export const formatTime = function (time, format = 'YYYY-MM-DD hh:mm:ss', isUTC) {
  const data = parseDate(time, isUTC);
  var obj = {
    'M+': data.getMonth() + 1,
    'D+': data.getDate(),
    'h+': data.getHours(),
    'm+': data.getMinutes(),
    's+': data.getSeconds(),
    'q+': Math.floor((data.getMonth() + 3) / 3),
    'S+': data.getMilliseconds()
  };
  if (/(Y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (data.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in obj) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1
        ? obj[k] : ('00' + obj[k]).substr(('' + obj[k]).length));
    }
  }
  return format;
};

// 获取标准日期格式
export const parseDate = (date, utc) => {
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

export const setCookieBanner = function (key) {
  var curtime = new Date().getTime();
  localStorage.setItem(key, JSON.stringify(curtime));
};

/**
 * uuid 生成
 */
export const uuid = function (len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
    '');
  var uuid = []; var i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | Math.random() * radix];
    }
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
};

// 根据 userId 和 friendId 从小到大排序生成 roomId
export const getCRoomId = function (friendId, userId) {
  userId = userId || Cookies.get('userId');
  return userId < friendId ? `${userId}-${friendId}` : `${friendId}-${userId}`;
};

// 对象数组按某字段排序
export const compareArr = function (p) {
  return function (m, n) {
    var a = m[p];
    var b = n[p];
    return b - a; // 降序
  };
};

// base64 转 formData格式
export const dataURItoBlob = function (base64Data) {
  let byteString;
  if (base64Data.split(',')[0].indexOf('base64') >= 0) { byteString = atob(base64Data.split(',')[1]); } else { byteString = unescape(base64Data.split(',')[1]); }
  const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], { type: mimeString });
};

/**
 * 字符串的下划线格式转驼峰格式，eg：hello_world => helloWorld
 * @param s
 * @returns {*}
 */
export const underline2Hump = function (s) {
  return s.replace(/_(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
};

export const setBodyScroll = function (isHide) {
  if (isHide) {
    document.documentElement.classList.add('hide');
  } else {
    setTimeout(() => {
      if (/videos|profile|IMMessageSession/.test(window.location.href)) return;
      document.documentElement.classList.remove('hide');
    }, 0);
  }
};

export const htmlEncode = function (handleString) {
  const cd1 = /<*>/g.test(handleString);
  const cd2 = /src|href|script|img|video|audio|iframe|style|body|frame|frameset/.test(handleString);
  if (cd1 && cd2) {
    handleString = handleString.replace(/<|>/g, '*');
  }
  return handleString;
};

/**
 * {
 * userId: {today: times},
 * }
 */
export function getStorageByDay (key) {
  const webPushPopInfo = localStorage.getItem(key);
  let obj = JSON.parse(webPushPopInfo) || {};
  const now = Date.now();
  const today = timeFormat(now, 'YYYY-MM-DD');
  const times = obj[today];
  if (!times) {
    obj = {};
    obj[today] = 0;
    const str = JSON.stringify(obj);
    localStorage.setItem(key, str);
  }
  return obj[today];
}

export function setStorageByDay (key, val) {
  const webPushPopInfo = localStorage.getItem(key);
  const obj = JSON.parse(webPushPopInfo) || {};
  const now = Date.now();
  const today = timeFormat(now, 'YYYY-MM-DD');
  obj[today] = val;
  const str = JSON.stringify(obj);
  localStorage.setItem(key, str);

  return obj[today];
}

export function getStorageById (key, id) {
  const keyInfo = localStorage.getItem(key);
  const obj = JSON.parse(keyInfo) || {};
  const userId = id || Cookies.get('userId');
  const val = obj[userId];
  return val;
}

export function setStorageById (key, id, val) {
  const keyInfo = localStorage.getItem(key);
  let obj = JSON.parse(keyInfo) || {};
  if (typeof obj !== 'object') {
    obj = {};
  }
  const userId = id || Cookies.get('userId');
  obj[userId] = val;
  const str = JSON.stringify(obj);
  localStorage.setItem(key, str);
  console.log(obj, '-------obj');
  return obj;
}

// 时间间隔转为天时分秒
export const formatTimeGup = (time) => {
  if (!time) {
    return '0s';
  }
  if (typeof time === 'string') {
    // 判断传入的是不是string类型，如果是的话，先转换成时间number类型
    time = Number(time);
  }
  const oneDay = 1000 * 60 * 60 * 24;
  const oneHour = 1000 * 60 * 60;
  const oneMinute = 1000 * 60;
  const oneSecond = 1000;
  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let mseconds = 0;

  if (time) {
    if (time >= oneDay) {
      days = Math.floor(time / oneDay);
      hours = Math.floor((time % oneDay) / oneHour);
      minutes = Math.floor((time % oneHour) / oneMinute);
    } else if (oneHour <= time && time < oneDay) {
      hours = Math.floor(time / oneHour);
      minutes = Math.floor((time % oneHour) / oneMinute);
      seconds = Math.floor(((time % oneHour) % oneMinute) / oneSecond);
      mseconds = time - (hours * oneHour + minutes * oneMinute + seconds * oneSecond);
    } else if (time >= oneMinute && time < oneHour) {
      minutes = Math.floor(time / oneMinute);
      seconds = Math.floor((time - minutes * oneMinute) / oneSecond);
      mseconds = Math.floor(time - minutes * oneMinute - seconds * oneSecond);
    } else if (time >= oneSecond && time < oneMinute) {
      seconds = Math.floor(time / oneSecond);
      mseconds = Math.floor(time % oneSecond);
    } else {
      mseconds = time;
    }
    return {
      days,
      hours: hours < 10 ? '0' + hours : hours,
      minutes: minutes < 10 ? '0' + minutes : minutes,
      seconds: seconds < 10 ? '0' + seconds : seconds,
      mseconds: mseconds < 10 ? '0' + mseconds : mseconds
    };
  }
  return time;
};

// 处理聊天用户列表
export const processChatUser = function (list = []) {
  let chatUsersTemp = list.filter(item => ![3].includes(item.relation));
  const chatSayHiUsersTemp = list.filter(item => [3].includes(item.relation));

  const sum = chatSayHiUsersTemp.reduce((prev, curr) => prev + curr.noReadCount, 0);
  const timestamp = chatSayHiUsersTemp[0] && chatSayHiUsersTemp[0].timestamp;
  const id = chatSayHiUsersTemp[0] && chatSayHiUsersTemp[0].id;
  const userList = chatSayHiUsersTemp.slice(0, 3);
  const sayHiUser = {
    friendId: -4,
    headImg: 'https://h5.livuchat.com/static/images/chatweb/icon-likeyou.png',
    userName: i18n.t('app.hello_msg_item_text'),
    noReadCount: sum,
    userList,
    timestamp,
    timestampUser: timestamp,
    id
  };
  if (userList.length) {
    chatUsersTemp = [sayHiUser, ...chatUsersTemp];

    chatUsersTemp.sort(compareArr('timestampUser'));
  }
  return {
    chatUsersTemp,
    chatSayHiUsersTemp
  };
};

export const delayFunc = (time) => {
  return new Promise((resolve) => {
    return setTimeout(() => {
      resolve();
    }, time);
  });
};

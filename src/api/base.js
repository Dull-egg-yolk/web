import axios from 'axios';
import Cookies from 'js-cookie';
import MD5 from 'crypto-js/md5';
import { clearAllCookie, randomWord, isEmpty } from '@/util/index';
import { encryptData, decryptData } from './crypto';
import languageCode from '@/assets/data/language';
import store from '../store';
import i18n from '@/i18n';

// const SUCCESS_CODES = [200]; // 接口请求成功返回正常数据

// 请求计数器
let httpCount = 0;

// 通用公共参数
const publicParams = {
  appId: baseConfig.appId,
  version: baseConfig.version,
  platformType: 4,
  languageId: 1,
  noCrypt: true,
};
const platformType = 4; // 网关要用到，必传参数固定为4

// deviceId生成
if (!Cookies.get('deviceId')) {
  const deviceId = new Date().getTime() + '' + randomWord(false, 8);
  Cookies.set('deviceId', deviceId, { expires: 365 });
}
publicParams.deviceId = Cookies.get('deviceId');

const service = axios.create({
  baseURL: baseConfig.gatewayApi,
  // baseURL: baseConfig.gatewayApi,
  timeout: 50000,
  transformRequest: [
    function (data) {
      data = data || {};
      console.log('request:', data);
      if (data && data.noCrypt) {
        delete data.noCrypt;
        return JSON.stringify(data);
      }
      return JSON.stringify(encryptData(data));
    }],
  transformResponse: [
    function (data) {
      // 账号、设备、设备和账号封禁code
      const banned = [10115, 10116, 10117];
      if (!isEmpty(data)) {
        data = JSON.parse(data);
        if (data.key && data.data) {
          data = JSON.parse(decryptData(data) || '{}');
        }
      }

      if (data.code === 10117) {
        window.$mObj.vm.$message({
          noOutClick: true,
          desc: {
            txt: data.message
          }
        }).then(res => {
          clearAllCookie();
          window.location.href = '/';
        });
      }

      if (banned.includes(data.code)) {
        store.commit('setShowBanned', true);
        clearAllCookie();
      }
      // 登录超时啦
      if (data && /412|10023|10101/.test(data.code)) {
        window.$mObj.vm.$message({
          noOutClick: true,
          desc: {
            txt: data.message || i18n.t('app.update_user_info_failed')// '登录过期，请重新登录'
          }
        }).then(res => {
          window.location.href = '/';
          clearAllCookie();
        });
      }

      return data;
    }],
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Authorization: Cookies.get('loginToken')
  }
});

window.$api = service;

// 添加一个请求拦截器
service.interceptors.request.use(function (config) {
  httpCount++;

  // 获取浏览器语言;
  let lang = window.navigator.language.split('-')[0];
  lang = lang ? lang.toLowerCase() : '';
  publicParams.languageId = typeof languageCode[lang] === 'undefined' ? 1 : languageCode[lang];

  if ((!config.params) || (config.params && !config.params.noLoading)) {
    if (httpCount >= 1) {
      // todo 全局加载显示
    }
  }
  // 统一设置公共参数
  const methods = ['put', 'post', 'patch']; // 有 data 参数的方法

  if (methods.includes(config.method)) {
    publicParams.userId = config.data.userId || +Cookies.get('userId') || null;
    Object.assign(config.data, publicParams);
  } else {
    const appId = config.params.appId;
    Object.assign(config.params, publicParams);
    if (appId) {
      config.params.appId = appId;
    }
  }

  if (!config.params) {
    config.params = {};
  }
  config.params.platformType = platformType;
  if (!config.params.appId) {
    config.params.appId = window.baseConfig.appId;
  }

  // 验签
  if (config.params && config.params.isPublic) {
    delete config.params.isPublic;
    return config;
  } else {
    return apiAutograph(config);
  }
}, function (err) {
  httpCount--;
  if (httpCount <= 0) {
    httpCount = 0;
    // todo 全局加载隐藏
  }
  return Promise.reject(err);
});

// 添加一个响应拦截器
service.interceptors.response.use(res => {
  const responseData = res.data;

  httpCount--;
  if (httpCount <= 0) {
    httpCount = 0;
    // todo 全局加载隐藏
  }

  // 埋点接口请求，没有返回数据，直接返回即可
  if (!responseData) {
    return true;
  }

  // 如果会话过期（其它地方又被登陆）
  if (res.status === 401 || responseData.code === 10023) {
    window.$mObj.vm.$message({
      noOutClick: true,
      desc: {
        txt: 'Login has expired'
      }
    }).then(res => {
      window.location.href = '/';
    });
    clearAllCookie();
    return;
  }
  return responseData || {};
}, (err) => {
  // todo 全局提示信息
  httpCount--;
  if (httpCount <= 0) {
    httpCount = 0;
    // todo 全局加载隐藏
  }

  console.log('------api error-----', err.toJSON(), err.response);
  const { status } = err.toJSON();
  // 登录失效
  if (/401|412/.test(status)) {
    const code = err.response && err.response.data && err.response.data.code;
    const msgTxt = code === 10023 ? i18n.t('app.dialog_ohter_device_message') : i18n.t('app.update_user_info_failed');
    window.$mObj.vm.$message({
      noOutClick: true,
      desc: {
        txt: msgTxt
      }
    }).then(a => {
      clearAllCookie();
      window.location.href = '/';
    });
  } else {
    // window.$mObj.vm.$message({
    //   noOutClick: true,
    //   desc: {
    //     txt: i18n.t('app.load_failed_refresh_reload')
    //   }
    // });
    return Promise.reject(err);
  }
});

export const request = {};
request.get = (url, params = {}, config = {}) => service.get(url, { ...config, params });
request.post = (url, data, config = {}) => service.post(url, data, config);
request.put = (url, data, config = {}) => service.put(url, data, config);
request.delete = (url, params, config = {}) => service.delete(url, { ...config, params });
request.patch = (url, data, config = {}) => service.patch(url, data, config);

/**
 * api 服务请求接口签名方法，主要是 joinUrl 中要用户的字段
 * @param {Object} config axios 实例的配置项
 * @returns Object
 */
export const apiAutograph = function (config) {
  const timestamp = new Date().getTime();
  if (!config.params) config.params = {};
  const non = Cookies.get('nonce');
  let { deviceId, nonce = non, userId } = config.params;
  !deviceId && (deviceId = Cookies.get('deviceId'));

  !userId && (userId = Cookies.get('userId'));
  if (!nonce) {
    nonce = randomWord(false, 8);
    Cookies.set('nonce', nonce);
  }

  const loginToken = config.params.loginToken || Cookies.get('loginToken');
  let url = config.url;
  const separate = url[0] === '/' ? '' : '/';

  if (config.method === 'post') {
    url = url.split('?')[0];
  }

  let host = config.baseURL + separate + url;

  if (url.indexOf('http') === 0) {
    host = url;
  }

  // host = host.replace('https', 'http');

  const joinUrl = host + loginToken + deviceId + nonce + timestamp + userId;
  const sign = MD5(joinUrl).toString().toUpperCase();
  config.params.sign = sign;
  config.params.timestamp = timestamp;
  config.params.deviceId = deviceId;
  config.params.nonce = nonce;
  config.params.userId = userId;
  config.params.version = baseConfig.version;
  config.params.token = Cookies.get('loginToken');

  return config;
};

export const apiAutograph2 = function (config) {
  const timestamp = new Date().getTime();
  if (!config.params) config.params = {};
  let { deviceId, nonce, userId } = config.params;
  !deviceId && (deviceId = Cookies.get('deviceId'));

  !userId && (userId = Cookies.get('userId'));
  if (!nonce) {
    nonce = randomWord(false, 8);
    Cookies.set('nonce', nonce);
  }

  const loginToken = config.params.loginToken || Cookies.get('loginToken');
  const url = config.url;
  const separate = url[0] === '/' ? '' : '/';

  config.params.timestamp = timestamp;
  config.params.deviceId = deviceId;
  config.params.nonce = nonce;
  config.params.userId = userId;
  config.params.version = baseConfig.version;

  const pkeys = Object.keys(config.params).sort();
  let str = '';

  pkeys.forEach(key => {
    str += key + config.params[key];
  });
  str += loginToken;

  const joinUrl = str;
  const sign = MD5(joinUrl).toString().toUpperCase();
  config.params.sign = sign;

  return config;
};

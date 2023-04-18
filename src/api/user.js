import Cookies from 'js-cookie';
import { request, apiAutograph } from './base';
import store from '@/store';
import axios from 'axios';
// const apiUrl = baseConfig.apiPath;

const urls = {
  emailCheck: '/facade/api/user/email/v2/exists',
  emailSendVerify: '/facade/api/user/email/sendVerifyEmail',
  emailhadVerfiy: '/facade/api/user/email/alreadyVerifyEmail',
  emailNewSetPassword: '/facade/api/user/email/v2/setPassword',
  emailRegister: '/facade/api/user/email/v2/register',
  emailLogin: '/facade/api/user/email/v2/emailLogin',
  emailResetPassword: '/facade/api/user/email/resetPassword',
  emailSendForget: '/facade/api/user/email/sendForgetEmail',
  emailSendUserVerify: '/facade/api/user/email/checkFormalUserEmail',
  login: '/facade/api/user/exempt/login/token', // 登录
  supplyRegister: '/facade/api/user/exempt/complementInfo', // 补全信息
  logout: '/facade/api/user/logout', // 登出
  getUserInfo: '/facade/api/user/getUserInfo', // 获取用户信息
  // getUserInfo: '/facade/api/user/getUserInfo', // 获取用户信息
  getRTMUID: '/athena-agora-proxy/im/channel/uid/generator',
  getRTMToken: '/athena-agora-proxy/im/channel/token/generator',
  getCurrentCoin: '/facade/api/user/getCurrentGoldNum',
  updateUser: 'api/update/user', // 更新用户信息
  webHB: '/facade/api/onlinestatus/exempt/heartbeat/status', // 心跳接口
  updateHB: '/facade/api/onlinestatus/exempt/upload/status', // 手动更新online状态
  addUserRequestBuryRecordAll: '/facade/api/bury/exempt/addUserRequestBuryRecordAll',
  onlineStatus: '/facade/api/dict/exempt/onlinestatus',
  userGender: '/facade/api/dict/exempt/usergender',
  interestDic: '/facade/api/user/profile/interest/selectAll',
  langDic: '/facade/api/user/profile/language/selectAll',
  updateUserInfo: '/facade/api/user/update',
  uploadImg: '/facade/api/upload/uploadAlbumImage',
  uploadImgSingle: '/facade/api/upload/images',
  uploadAlbumImg: '/facade/api/album/uploadAlbumImage',
  delAlbumImg: '/facade/api/album/deleteAlbumPic',
  userPrivacyStatus: '/facade/api/user/protocol/status',
  userPrivacy: '/facade/api/user/save/protocol',
  getCountryId: '/facade/api/function/exempt/country/byip',
  getUserPayStatus: '/facade/api/user/web/checkUserPayStatus',
  checkMobile: '/facade/api/mobile/checkMobile', // 检查手机号是否注册
  sendCode: '/facade/api/mobile/sms/sendCode', // 发送验证码
  checkCode: '/facade/api/mobile/sms/checkCode', // 校验验证码
  mobilePasswordLogin: '/facade/api/mobile/mobilePasswordLogin', // 手机号密码登录
  checkUserSetPassword: '/facade/api/mobile/checkUserSetPassword', // 检查用户是否设置密码密码, 需要验签
  updateMobilePassword: '/facade/api/mobile/updateMobilePassword', // 直接设置密码，需要验签
  phoneLogin: '/facade/api/user/exempt/login/phone', // web手机号登录 - 只返回用户信息
  sendPop18Confirm: '/facade/api/conform/remind',
  checkIfAddCoinForNew: '/facade/api/user/checkIfAddCoinForNew', // 登录后检查注册是否给送过金币
  checkPopUp: '/facade/api/popup/get', // 检查注册是否给送过金币弹窗
  checkWebPush: '/facade/api/user/ext/isInitNotification', // 检查webPush弹窗
  updatePushToken: '/facade/api/user/ext/initNotificationGiveCoin', // 保存 pushToken
  matchLike: '/matches/api/like',
  checkWebApp: 'facade/api/user/ext/isInitWebapp', // 检查是否webApp 送过钱
  sendWebAppCoin: 'facade/api/user/ext/initWebappGiveCoin', // webApp 送金币
  getActivityEntry: '/wchat/activities/api/activity/entry/getEntry', // 签到是否显示
  getSignInStatus: '/wchat/activities/api/user/checkIn/hasCheckedIn', // 签到是否显示
  getSignInList: '/wchat/activities/api/user/checkIn', // 签到详情
  saveSignIn: '/wchat/activities/api/user/checkIn', // 确定签到
  locationEntrysMap: '/wchat/activities/api/activity/entry/locationEntrysMap', // 宝箱入口
  siteFuncConf: '/matches/api/gomeet/matches/globalconf', // 网站玩法配置项
};

// pop 18 提交
export const apiPop18Confirm = async function (params = {}) {
  try {
    return await request.post(urls.sendPop18Confirm, params);
  } catch (e) {}
};

// 检查web push是否开启
export const checkWebPush = async function (params = {}) {
  try {
    return await request.get(urls.checkWebPush, params);
  } catch (e) { }
};

// 保存 pushToken
export const savePushToken = async function (data = {}) {
  try {
    data.countryId = localStorage.getItem('RC_USER_COUNTRY');
    return await request.post(urls.updatePushToken, data);
  } catch (e) { }
};

// 匹配中点击加好友
export const matchLike = async function (params = {}) {
  try {
    return await request.post(urls.matchLike, params);
  } catch (e) { }
};

// 检查注册是否给送过金币
export const checkIfAddCoinForNew = async function (params = {}) {
  try {
    return await request.get(urls.checkIfAddCoinForNew, params);
  } catch (e) { }
};

// 检查注册是否给送过金币
export const checkPopUp = async function (params = {}) {
  try {
    return await request.get(urls.checkPopUp, params);
  } catch (e) { }
};

// 获取国家IP
// 上传图集
export const apiGetCountryId = async function (params = {}) {
  try {
    return await request.get(urls.getCountryId, params);
  } catch (e) { }
};

// 上传图集
export const apiUploadAlbumImg = async function (params = {}) {
  try {
    return await request.post(urls.uploadAlbumImg, params);
  } catch (e) { }
};

// 删除图集
export const apiDelAlbumImg = async function (params = {}) {
  try {
    return await request.post(urls.delAlbumImg, params);
  } catch (e) { }
};

// 上传图片
export const apiUplodImg = async function (params, isSingle) {
  const url = isSingle ? urls.uploadImgSingle : urls.uploadImg;
  const graph = apiAutograph({ url: baseConfig.gatewayApi + url });
  const sign = [
    'platformType=4'
  ];
  for (const key in graph.params) {
    sign.push(key + '=' + graph.params[key]);
  }
  try {
    return await axios.post(baseConfig.gatewayApi + url + `?${sign.join('&')}`, params, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Athena-Request-Decryption': 'disabled',
        'Athena-Response-Encryption': 'disabled'
      }
    });
  } catch (e) { }
};

// 更新个人信息
export const apiUpdateUserInfo = async function (params = {}) {
  try {
    return await request.post(urls.updateUserInfo, params);
  } catch (e) { }
};

// 获取兴趣字典
export const getInterestDic = async function (params = {}) {
  try {
    return await request.get(urls.interestDic, params);
  } catch (e) { }
};

// 获取语言字典
export const getLangDic = async function (params = {}) {
  try {
    return await request.get(urls.langDic, params);
  } catch (e) { }
};

// 用户登录
export const userLogin = async function (data = {}) {
  try {
    data.countryId = localStorage.getItem('RC_USER_COUNTRY');
    data.pushToken = store.state.app.pushToken || '';
    return await request.post(urls.login, data);
  } catch (e) {
    return Promise.reject(e);
  }
};

// 用户信息补全提交
export const userInfoSupply = async function (params = {}) {
  try {
    return await request.post(urls.supplyRegister, params);
  } catch (e) {
    return Promise.reject(e);
  }
};

// 用户信息补全提交
export const updateUser = async function (data = {}) {
  try {
    return await request.put(urls.updateUser, data);
  } catch (e) { }
};

// 用户登出
export const userLogout = async function (params = {}) {
  try {
    return await request.put(urls.logout, params);
  } catch (e) { }
};

// 获取个人信息接口
export const getUserInfoData = async function (params = {}) {
  params.searchUserId = +Cookies.get('userId');
  params.userId = +Cookies.get('userId');
  try {
    return await request.get(urls.getUserInfo, params);
  } catch (e) { }
};

// 获取RTM-userid 以及  RTM-token

export const getRTMUserIDAndUid = async function (params) {
  const rsts = await Promise.all([
    request.get(urls.getRTMUID),
    request.get(urls.getRTMToken, { id: params.genId })
  ]).then(rsts => {
    return rsts;
  }).catch(e => e);
  if (rsts instanceof Error) return false;
  return rsts;
};

/**
 * @name getOtherProfile
 * @desc 查询别人的好友信息
 * @param {string} friendUserIdList '11,12'
 * @returns  err or data
 */

export const getOtherProfile = async function (params = {}) {
  try {
    return await request.get(urls.getUserInfo, params);
  } catch (e) { }
};

/**
 * 获取用户当前金币数
*/

export const apiGetMyCoin = async function (params = {}) {
  return await request.get(urls.getCurrentCoin, params).catch(e => e);
};

/**
 * 心跳接口
 */

export const apiWebHB = async function (params = {}) {
  return await request.post(urls.webHB, params).catch(e => e);
};

/**
 * 更新online状态
 */
export const apiUpdateHB = async function (params = {}) {
  return await request.post(urls.updateHB, params).catch(e => e);
};

/**
 * 上报接口
 */
export const apiReport = async function (params = {}) {
  return await request.post(urls.addUserRequestBuryRecordAll, params).catch(e => e);
};

/**
 * 邮箱登录
 */
export const apiEmialLogin = async function (data = {}) {
  data.pushToken = store.state.app.pushToken || '';
  data.countryId = localStorage.getItem('RC_USER_COUNTRY');
  return await request.post(urls.emailLogin, data);
};

/**
 * 邮箱忘记密码重置密码
 */
export const apiEmialResetPassword = async function (params = {}) {
  return await request.post(urls.emailResetPassword, params);
};

/**
 * 邮箱忘记密码重置密码
 */
export const apiEmialSendForget = async function (params = {}) {
  return await request.post(urls.emailSendForget, params);
};

/**
 * 邮箱注册
 */
export const apiEmialRegister = async function (params = {}) {
  return await request.post(urls.emailRegister, params).catch(e => e);
};

/**
 * 测试用邮箱检测
 */
export const apiEmialCheck = async function (params = {}) {
  return await request.get(urls.emailCheck, params).catch(e => e);
};

/**
 * 发送邮箱验证码
 */
export const apiEmialSendVerify = async function (params = {}) {
  return await request.post(urls.emailSendVerify, params).catch(e => e);
};

/**
 * 已有账号发送邮箱验证码
 */
export const apiEmailSendUserVerify = async function (params = {}) {
  return await request.post(urls.emailSendUserVerify, params).catch(e => e);
};

/**
 * 已验证邮箱验
 */
export const apiEmialHadVerify = async function (params = {}) {
  return await request.post(urls.emailhadVerfiy, params).catch(e => e);
};

/**
 * 新邮箱设置密码
 */
export const apiEmialNewSetPassword = async function (params = {}) {
  return await request.post(urls.emailNewSetPassword, params).catch(e => e);
};

/**
 * 获取用户在线状态
*/

export const getOnlineStatus = async function (params = {}) {
  return await request.get(urls.onlineStatus, params).catch(e => e);
};

/**
 * 获取用户性别
*/

export const getUserGender = async function (params = {}) {
  return await request.get(urls.userGender, params).catch(e => e);
};

/**
 * 获取用户的协议状态
*/

export const getUserPrivacyStatus = async function (params = {}) {
  return await request.get(urls.userPrivacyStatus, params).catch(e => e);
};

/**
 * 获取用户充值状态
*/

export const apiGetUserPayStatus = async function (params = {}) {
  return await request.get(urls.getUserPayStatus, params).catch(e => e);
};

/**
 * 保存用户协议
*/

export const getUserPrivacy = async function (params = {}) {
  return await request.post(urls.userPrivacy, params).catch(e => e);
};

// 检查手机号是否注册
export const apiCheckMobile = async function (params = {}) {
  try {
    return await request.get(urls.checkMobile, params);
  } catch (e) { }
};
// 发送验证码
export const apiSendCode = async function (params = {}) {
  try {
    return await request.post(urls.sendCode, params, {
      headers: {
        'Akamai-BM-Telemetry': window.bmak === undefined ? 'missing-telemetry' : window.bmak.get_telemetry?.()
      }
    });
  } catch (e) { }
};

// 校验验证码
export const apiCheckCode = async function (params = {}) {
  try {
    return await request.get(urls.checkCode, params);
  } catch (e) { }
};

// 手机号密码登录
export const apiMobilePasswordLogin = async function (params = {}) {
  return await request.get(urls.mobilePasswordLogin, params);
};

// 检查用户是否设置密码密码, 需要验签
export const apiCheckUserSetPassword = async function (params = {}) {
  try {
    return await request.get(urls.checkUserSetPassword, params);
  } catch (e) { }
};

// 直接设置密码，需要验签
export const apiUpdateMobilePassword = async function (params = {}) {
  try {
    return await request.post(urls.updateMobilePassword, params);
  } catch (e) { }
};

// web手机号登录 - 只返回用户信息
export const apiPhoneLogin = async function (data = {}) {
  try {
    data.countryId = localStorage.getItem('RC_USER_COUNTRY');
    return await request.post(urls.phoneLogin, data);
  } catch (e) { }
};

// 检查是否送过webApp的金币
export const apiCheckWebApp = async function (params = {}) {
  return await request.get(urls.checkWebApp, params).catch(e => e);
};

// webApp送金币
export const apiSendWebAppCoin = async function (params = {}) {
  return await request.post(urls.sendWebAppCoin, params, { params }).catch(e => e);
};

// 活动配置
export const apiGetActivityEntry = async function (params = {}) {
  const config = {
    headers: {
      'Athena-Response-Encryption': 'disabled',
      'Athena-Request-Decryption': 'disabled'
    }
  };
  return await request.get(urls.getActivityEntry, params, config).catch(e => e);
};

// 签到是否显示
export const apiGetSignInStatus = async function (params = {}) {
  const config = {
    headers: {
      'Athena-Response-Encryption': 'disabled',
      'Athena-Request-Decryption': 'disabled'
    }
  };
  return await request.get(urls.getSignInStatus, params, config).catch(e => e);
};

// 签到详情
export const apiGetSignInList = async function (params = {}) {
  const config = {
    headers: {
      'Athena-Response-Encryption': 'disabled',
      'Athena-Request-Decryption': 'disabled'
    }
  };
  return await request.get(urls.getSignInList, params, config).catch(e => e);
};

// 确定签到
export const apiSaveSignIn = async function (params = {}) {
  const config = {
    headers: {
      'Athena-Response-Encryption': 'disabled',
      'Athena-Request-Decryption': 'disabled'
    }
  };
  return await request.post(urls.saveSignIn, params, config).catch(e => e);
};

// 宝箱入口
export const apiLocationEntrysMap = async function (params = {}) {
  const config = {
    headers: {
      'Athena-Response-Encryption': 'disabled',
      'Athena-Request-Decryption': 'disabled'
    }
  };
  return await request.get(urls.locationEntrysMap, params, config).catch(e => e);
};

// 获取 网站玩法配置项
export const apiGetSiteFuncConf = async function (params = {}) {
  try {
    return await request.get(urls.siteFuncConf, params);
  } catch (e) {
    return Promise.reject(e);
  }
};

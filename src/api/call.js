// import Cookies from 'js-cookie';
import { request } from './base';
import store from '@/store';

/**
 *  关于视频邀请的接口上报写在这里
 *  一是 方便管理  二是 和业务代码剥离
 *  就这样...
 * */
// 获取remote用户的id
function getRemoteUserId () {
  const { bizData } = store.state.agora;
  return bizData.remoteUserInfo ? bizData.remoteUserInfo.id : '';
}

const urls = {
  call: '/api/call/launch', // 发起呼叫
  cancel: '/api/call/cancel', // 取消呼叫
  answer: '/api/call/answer', // 接听
  refuse: '/api/call/refuse', // 拒接
  timeout: '/api/call/timeout', // 超时挂断电话
  hangup: '/api/call/hangup', // 主动挂断电话
  notifyEndCall: '/api/call/notifyEndCall', // 通知结束通话
  notifyJoinCall: '/api/call/notifyJoinCall', // 通知用户进入房间
  notifyStartCall: '/api/call/notifyStartCall', // 首帧通知
  friendVideo: '/api/call/friend/video', // 好友通话记录
  userVideo: '/api/call/users/videos', // 用户离开视频提交视频记录
  getCallInfo: '/api/call/getPriceAndCurrentCoinAndUserInfo', // 电话前获取电话信息

  match1v1End: '/matches/api/V1/exitMatch', // 1v1 视频挂断
};

/**
 * 好友通话记录
 */
export const apiGetCallInfo = async function (data) {
  try {
    return await request.get(urls.getCallInfo, data);
  } catch (e) {
    return Promise.reject(e);
  }
};

/**
 * 好友通话记录
 */
export const apiFriendVideo = async function (data) {
  if (!data || !data.matchUserId || !data.roomId) return;
  try {
    return await request.post(urls.friendVideo, data);
  } catch (e) {
    return Promise.reject(e);
  }
};

/**
 * 用户离开视频提交视频记录
 */
export const apiUserVideo = async function (data) {
  if (!data || !data.matchUserId || !data.roomId) return;

  try {
    return await request.post(urls.userVideo + `?matchId=${data.roomId}`, data);
  } catch (e) {
    return Promise.reject(e);
  }
};

/**
 * match 1v1 挂断
 */
export const apiMatch1V1End = async function (data) {
  try {
    return await request.post(urls.match1v1End, data);
  } catch (e) {
    return Promise.reject(e);
  }
};

/**
 *
 * @param {int} platformType
 * @param {int} calleeUserId  接受者ID
 * @param {int} callLocation 新的通话业务类型
 * @param {int} callType
 * @param {int} goddessLocation
 * @returns
 */
export const apiRtmInviter = async function (param = {}) {
  try {
    const res = await request.post(urls.call, param);
    return res;
  } catch (e) {
    return Promise.reject(e);
  }
};

function createCallFunc (url, reportType) {
  return async (param = {}) => {
    try {
      if ([7, 3, 5, 6, 2].indexOf(reportType) !== -1) {
        if (!param.roomNum) return;
      }
      const res = await request.post(url, param);
      return res;
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

export const apiRtmcancel = createCallFunc(urls.cancel, 2);

export const apiAnswer = createCallFunc(urls.answer, 3);

export const apiRefuse = createCallFunc(urls.refuse, 5);

export const apiHangup = createCallFunc(urls.hangup, 7);

export const apiNotifyEndCall = createCallFunc(urls.notifyEndCall, 100);

export const apiNotifyJoinCall = createCallFunc(urls.notifyJoinCall, 8);

export const apiTimeout = createCallFunc(urls.timeout, 6);

export const apiNotifyStartCall = createCallFunc(urls.notifyStartCall, 4);

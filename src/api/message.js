import { request } from './base';

const urls = {
  sendMessage: '/facade/api/im/v1/send', // 发送消息
  setMessageRead: '/facade/api/im/v1/read', // 设置消息为已读
  RTMCfg: '/facade/api/rtm/genToken',
  getGiftList: '/facade/api/gift/total',
  getGiftById: '/facade/api/gift',
  sendGift: '/facade/api/gift/send',
  getMsgUserList: '/facade/api/im/v1/list', // 从服务器获取最近聊天用户
  getMsgListByUserId: '/facade/api/im/v1/details', // 从服务器获取与某用户的聊天详情
  deleteMsgList: '/facade/api/im/v1/delete', // 从服务器获取与某用户的聊天详情
};

/**
 * 发送消息
 * @param {object} data
 * @param {number} data.appId
 * @param {number} data.platformType 平台类型 1：android,2:ios ,3:web, 4: web service
 * @param {string} data.message 消息内容
 * @param {number} data.messageType 消息类型 1 是文字
 * @param {number} data.receiveUserId 接收者的 userId
 * @param {number} data.sendUserId 发送者的 userId
 * @param {number} data.needTranslate 是否需要翻译
 * @param {string} data.targetLanguage 翻译的目标语言
 * @param {number} data.routeType 是否在线才投递消息 0：否 1：是
 * @returns error or data;
 */
export const sendMessage = async function (data) {
  try {
    return await request.post(urls.sendMessage, data);
  } catch (e) {
    return Promise.reject(e);
  }
};

/**
 * 设置消息为已读
 * @param {object} data
 * @param {number} data.receiveUserId 接收者
 * @param {number} data.sendUserId 发送者
 * @returns data
 */
export const setMessageRead = async function (data) {
  try {
    return await request.put(urls.setMessageRead, data);
  } catch (e) {}
};

/**
 * getRTMUIDTOken
 * @param {int} userId
 * @Param {int} platformType 4
 * @returns {userId , rtmUserId,rtmToken}
 */

export const getRTMUIDTOken = async function (params = {}) {
  return await request.get(urls.RTMCfg, params).catch(e => e);
};

/**
 *
 * @param {*} data
 * @returns
 * 获取礼物列表
 */
export const getGiftList = async function () {
  try {
    return await request.get(urls.getGiftList, {});
  } catch (e) {}
};

/**
 *
 * @param {*} data
 * @returns
 * 获取单个礼物信息
 */
export const getGiftById = async function (data) {
  try {
    return await request.get(urls.getGiftById + '/' + data.giftId, {});
  } catch (e) {}
};

/**
 *
 * @param {*} data
 * @returns
 * 赠送礼物
 */
export const apiSendGift = async function (data) {
  try {
    return await request.post(urls.sendGift, data);
  } catch (e) {}
};

/**
 *
 * @param {*} params
 * @returns
 * 从服务器获取最近聊天用户
 */
export const getMsgUserList = async function (params = {}) {
  try {
    const base = {
      pageNo: 1,
      pageSize: 100
    };
    const obj = { ...base, ...params };
    return await request.get(urls.getMsgUserList, obj);
  } catch (e) {}
};

/**
 *
 * @param {*} params
 * @returns
 * 从服务器获取与某用户的聊天详情
 */
export const getMsgListByUserId = async function (params = {}) {
  try {
    const base = {
      sendUserId: params.friendId,
      pageNo: 1,
      pageSize: 100
    };
    const obj = { ...base, ...params };
    return await request.get(urls.getMsgListByUserId, obj);
  } catch (e) {}
};

/**
 * @param {*} params
 * @returns
 * 删除与某用户的聊天详情
 */
export const deleteMsgList = async function (params = {}) {
  try {
    const base = {
      sendUserId: params.friendId
    };
    return await request.put(urls.deleteMsgList, base);
  } catch (e) {}
};

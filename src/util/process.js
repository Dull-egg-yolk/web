/* eslint-disable camelcase */
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import Cookies from 'js-cookie';
import store from '@/store';
import { uuid, getCRoomId } from '@/util/index';
import emojiData from '@/assets/data/emoji';
import { durationTime } from '@/util/dayjs';
import i18n from '@/i18n';

/**
 * 聊天消息 base64 处理
 * @param {object} data 要发送的消息
 * @returns data
 */
export const processMessage = (data, isInVideo = false) => {
  console.log('---发消息--processMessage----', data);
  const base = {
    appId: baseConfig.appId,
    platformType: 4,
    message: '',
    messageType: 1,
    receiveUserId: '', // 接收者目标
    sendUserId: Cookies.get('userId'), // 发送者
    needTranslate: false, // 是否需要翻译
    targetLanguage: '', // 翻译的目标语言
    routeType: 0, // 是否在线才投递消息 0：否 1：是
  };
  const newData = Object.assign({}, base, data);
  const rtmBase = { // 这个对象中的 key 使用 _ 分隔的是为了与客户端的字段保持一致
    accept: false,
    addType: newData.addType || 0, // 1:添加好友, 2:同意好友请求
    chat_id: _GetChatId(newData.sendUserId, newData.receiveUserId),
    content: newData.message,
    giftId: newData.giftId || 0,
    giftStar: newData.giftStar || 0,
    integral: newData.integral || 0,
    messageId: newData.uuid || uuid(),
    message_type: newData.messageType || 1, // todo 消息类型 1聊天，添加好友，同意好友；5 随机匹配；7 删除好友
    message_type_value: newData.messageTypeValue || 0, // todo 0聊天消息 1好友相关 3图片 4礼物
    picture_height: newData.pictureHeight || 0,
    picture_width: newData.pictureWidth || 0,
    picture_url: newData.pictureUrl || '',
    receiverIds: [newData.receiveUserId],
    senderId: newData.sendUserId,
    textContent: _GetTextContent(newData),
    timeStamp: Date.now(),
  };
  if (isInVideo) {
    const vMsg = {
      message_type: 1,
      content: newData.message,
      source: newData.message,
      input_type: 0,
      giftId: rtmBase.giftId,
      flag: data.flag || rtmBase.chat_id,
      messageId: rtmBase.messageId
    };
    rtmBase.content = JSON.stringify(vMsg);
  }
  const str = Utf8.parse(JSON.stringify(rtmBase));
  const message = Base64.stringify(str);
  newData.message = message;
  return newData; // everything else
};

function _GetChatId (sendUserId, receiveUserId) {
  const id = sendUserId < receiveUserId ? `${sendUserId}|${receiveUserId}` : `${receiveUserId}|${sendUserId}`;
  return '2|' + id;
}

function _GetTextContent (data) {
  const obj = {
    function: 0,
    source: data.message,
    translation: data.translation || data.message
  };
  return JSON.stringify(obj);
}

/**
 * 将服务器数据与本地已存储的数据进行合并
 */
export const processDBChartUser = (local, remote) => {
  if (Array.isArray(remote) && remote.length > 0) {
    const userId = Number(Cookies.get('userId'));
    const map = new Map();
    const listL = [];

    remote.forEach(item => {
      const croomId = getCRoomId(userId, item.friendId);
      const message = decodeMessage(item.message);
      if ([3, 7].includes(message.message_type)) return;
      const senderId = message.sendUserId || message.senderId;
      const base = {
        userId,
        croomId,
        senderId: +senderId,
        friendId: item.friendId,
        headImg: item.headImg,
        content: item.message,
        noReadCount: item.unreadCount,
        userName: item.userName,
        messageType: item.messageType,
        messageTypeValue: 0,
        timestamp: item.time,
        timestampUser: item.time,
        relation: item.relation,
      };
      map.set(croomId, base);
    });

    local.forEach(item => {
      const remoteU = map.get(item.croomId);
      if (remoteU) {
        const noReadCount = Math.max(item.noReadCount, remoteU.noReadCount);
        item = { ...item, ...remoteU };
        item.noReadCount = noReadCount;
        map.delete(item.croomId);
      }
      listL.push(item);
    });
    const listR = map.values();
    const sortList = [...listR];
    sortList.sort((a, b) => a.timestamp - b.timestamp);
    return [...listL, ...sortList];
  } else {
    return local;
  }
};

/**
 * 将未在本地存储的消息过虑出来
 * @param {Array} local DB中的聊天记录
 * @param {Array} remote 服务器中的聊天记录
 * @returns 未在本地存储的记录
 */
export const processDBChartList = (local, remote) => {
  if (!Array.isArray(remote) || remote.length < 1) {
    return [];
  }

  const map = new Map();
  const tempMap = new Map();

  local.forEach(item => {
    map.set(item.messageId, 0);
  });

  remote.forEach(item => {
    const data = { ...item };
    let msg = {};
    // 视频通话结束的消息
    const userId = Number(Cookies.get('userId'));
    if ([9, 10].includes(data.messageType) && data.receiveUserId === userId) {
      msg = _createrDBVideoMsg(data);
    } else {
      msg = _createrDBMsg(data);
    }

    if ([4, 7].includes(data.messageType) || map.has(msg.messageId) || [4, 7].includes(msg.message_type)) {
      return;
    }

    if (msg.messageId) {
      tempMap.set(msg.messageId, msg);
    }
  });
  const list = tempMap.values();
  const sortList = [...list];
  sortList.sort((a, b) => a.timestamp - b.timestamp);

  return [...sortList];
};

/**
 * 将从服务器拉下的通话结束消息改成 类 rtm 消息结构
 * @param {*} msg
 */
function _createrDBVideoMsg (msg) {
  try {
    const userId = Number(Cookies.get('userId'));
    const message = decodeMessage(msg.message);

    const content = base64Msg(message, msg);

    const base = {
      userId,
      content,
      messageUuid: message.roomNum,
      messageId: message.roomNum,
      noticeType: 1,
      bizType: 1040,
      timestamp: msg.time,
      uniqueId: msg.uniqueId || 'Remote-' + message.roomNum,
      showInAppBanner: false,
      bizData: {
        sendUserId: message.callerUserId,
        sendPlatformType: msg.callerPlatformType || 2
      },
      read: 1,
    };
    return base;
  } catch (error) {
    return {};
  }
}

export function base64Msg (data, msg) {
  const newData = { ...data };
  const rtmBase = { // 这个对象中的 key 使用 _ 分隔的是为了与客户端的字段保持一致
    accept: newData.accept || false,
    addType: newData.addType || 0, // 1:添加好友, 2:同意好友请求
    chat_id: _GetChatId(newData.callerUserId, newData.calleeUserId),
    messageId: newData.roomNum,
    message_type: newData.message_type || 10, // todo 消息类型 1聊天，添加好友，同意好友；5 随机匹配；7 删除好友 10 结束通话
    message_type_value: newData.message_type_value || 0, // 0聊天消息 1好友相关 3图片 4礼物
    receiverIds: [newData.calleeUserId],
    senderId: newData.callerUserId,
    timeStamp: newData.timeStamp || msg.timeStamp,
    ...data
  };

  const str = Utf8.parse(JSON.stringify(rtmBase));
  return Base64.stringify(str);
}

/**
 * web 提示
 * @param {*} msg
 */
export function webTipsMsg (msg) {
  try {
    const data = {
      receiveUserId: msg.receiveUserId,
      contentMessageType: 11,
    };

    if (msg.flag) {
      data.flag = msg.flag;
    }

    const newData = faceShowMsg(data);
    return newData;
  } catch (error) {
    return {};
  }
}
/**
 * 视频模糊消息
 * @param {*} msg
 */
export function videoBlurMsg (msg) {
  try {
    const data = {
      receiveUserId: msg.receiveUserId,
      contentType: 3,
      contentBlur: false
    };
    if (msg.flag) {
      data.flag = msg.flag;
    }

    const newData = faceShowMsg(data);
    return newData;
  } catch (error) {
    return {};
  }
}

/**
 * 露脸消息
 * @param {*} msg
 */
export function faceShowMsg (msg) {
  try {
    const userId = Number(Cookies.get('userId'));

    const base = {
      appId: baseConfig.appId,
      platformType: 4,
      message: '',
      messageType: 4,
      receiveUserId: '', // 接收者目标
      sendUserId: Cookies.get('userId'), // 发送者
      needTranslate: false, // 是否需要翻译
      targetLanguage: '', // 翻译的目标语言
      routeType: 1, // 是否在线才投递消息 0：否 1：是
    };

    const message = {
      roomNum: uuid(),
      callerUserId: userId,
      calleeUserId: msg.receiveUserId,
      message_type: 4,
      message_type_value: 0,
      timeStamp: Date.now(),
    };

    const faceMsg = {
      message_type: msg.contentMessageType || 2,
      type: msg.contentType || 1,
      face_visibility: true,
      flag: msg.flag || _GetChatId(message.callerUserId, message.calleeUserId),
      messageId: message.roomNum
    };
    if (msg.contentBlur !== undefined) {
      faceMsg.blur = msg.contentBlur;
    }

    message.content = JSON.stringify(faceMsg);
    const newData = Object.assign({}, base, message, msg);

    const content = base64Msg(newData, {});

    newData.message = content;
    return newData;
  } catch (error) {
    return {};
  }
}

function _base64SystemMsg (data) {
  const newData = { ...data };
  const rtmBase = { // 这个对象中的 key 使用 _ 分隔的是为了与客户端的字段保持一致
    chat_id: _GetChatId(newData.senderId, newData.userId),
    messageId: newData.messageId,
    message_type: newData.bizType || newData.type,
    message_type_value: -3, // 系统消息前端自定义成 -3
    receiverIds: [newData.userId],
    senderId: newData.senderId,
    timeStamp: newData.timestamp,
    ...data
  };

  const str = Utf8.parse(JSON.stringify(rtmBase));
  return Base64.stringify(str);
}

export function createDBSystemMsg (msg) {
  try {
    const newData = { ...msg };
    const { noticeType, messageId, type, bizType, messageUuid } = newData;

    const uids = {
      0: -1, // 0:notification
      1: -2, // 1:livu team
      2: -3 // 2:income
    };
    const senderId = uids[noticeType] || -2;
    const userId = Number(Cookies.get('userId'));

    const mId = messageId || uuid();
    const mType = type || bizType;

    newData.userId = userId;
    newData.senderId = senderId;
    newData.messageId = mId;
    newData.timestamp = Date.now();

    const content = _base64SystemMsg(newData);

    const base = {
      userId,
      content,
      messageUuid: messageUuid || mId,
      messageId: mId,
      noticeType: noticeType,
      bizType: mType,
      timestamp: newData.timestamp,
      uniqueId: 'System-' + mId,
      showInAppBanner: false,
      bizData: {
        sendUserId: senderId,
        sendPlatformType: 4
      }
    };
    return base;
  } catch (error) {
    return {};
  }
}

// 系统发的聊天消息
export function createDBSystemChatMsg (msg) {
  try {
    const userId = Number(Cookies.get('userId'));
    const newData = _createChatMsg(msg);
    const content = base64Msg(newData);

    const base = {
      userId,
      content,
      messageUuid: msg.messageUuid,
      messageId: msg.messageId,
      noticeType: msg.noticeType || 1,
      bizType: msg.type || newData.bizType,
      timestamp: msg.timestamp,
      uniqueId: msg.uniqueId || 'Remote-' + msg.messageId,
      showInAppBanner: false,
      bizData: {
        sendUserId: newData.callerUserId,
        sendPlatformType: msg.callerPlatformType || 2
      },
      read: 0,
    };
    return base;
  } catch (error) {
    return {};
  }
}

function _createChatMsg (data) {
  const { userId, extra, type, noticeType } = data;
  const newData = {};
  const message = {
    message: extra.content
  };

  // 系统发的图片消息
  if (extra.messageType === 6) {
    newData.message_type_value = 3;
    newData.picture_url = extra.content;
    message.message = '';
  }
  newData.callerUserId = extra.userId;
  newData.calleeUserId = userId;
  newData.roomNum = data.messageId;
  newData.message_type = data.message_type || 1;
  newData.timeStamp = data.timestamp;
  newData.giftId = 0;
  newData.bizType = type;
  newData.textContent = _GetTextContent(message);

  return newData;
}

/**
 * 将从服务器拉下的消息改成 类 rtm 消息结构
 * @param {*} msg
 */
function _createrDBMsg (msg) {
  try {
    const userId = Number(Cookies.get('userId'));
    const message = decodeMessage(msg.message);

    const base = {
      userId,
      content: msg.message,
      messageUuid: msg.messageUuid || message.messageId,
      messageId: message.messageId,
      noticeType: 1,
      bizType: 1040,
      timestamp: message.timestamp || msg.time,
      uniqueId: msg.uniqueId || 'Remote-' + message.messageId,
      showInAppBanner: false,
      bizData: {
        sendUserId: message.senderId,
        sendPlatformType: msg.sendPlatformType || 2
      },
    };
    if (message.message_type === 7) {
      base.message_type = 7;
    }
    return base;
  } catch (error) {
    return {};
  }
}

/**
 * 解码消息
 * @param {object} msg
 */
export const decodeMessage = (msg) => {
  if (typeof msg !== 'string') {
    return msg;
  }

  try {
    const content = Base64.parse(msg);
    const message = JSON.parse(Utf8.stringify(content));

    return message;
  } catch (error) {
    console.log(msg, '---解码失败----');
    return {
      content: ''
    };
  }
};

function _haveTranslate (textContent) {
  try {
    const data = typeof textContent === 'string' ? JSON.parse(textContent) : textContent;
    // "{"function":0,"source":"hi","translation":"hi"}"
    const { source, translation } = data;
    if (source.length > 0 && translation.length > 0 && (source !== translation)) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

function _isGift (jsonMsg) {
  try {
    const { message_type, message_type_value, giftId } = jsonMsg;
    if (message_type === 1 && message_type_value === 4 && giftId > 0) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

function _isGiftV (jsonMsg) {
  const { message_type, giftId } = jsonMsg;
  return message_type === 5 && giftId > 0;
}

// 索要礼物
function _isAskGfitV (jsonMsg) {
  const { message_type, source, giftId } = jsonMsg;
  return message_type === 1 && source && giftId > 0;
}

function _isImg (jsonMsg) {
  try {
    const { message_type, message_type_value, picture_url } = jsonMsg;
    if (message_type === 1 && message_type_value === 3 && picture_url) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

function _isTxt (jsonMsg) {
  try {
    const { message_type, message_type_value, textContent } = jsonMsg;
    if (message_type === 1 && message_type_value === 0 && textContent) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

function _isAddFriend (jsonMsg) {
  try {
    const { message_type, message_type_value, addType } = jsonMsg;
    const isRtmAdd = message_type === 1 && message_type_value === 1 && addType;
    const isRemoteAdd = message_type === 4 && message_type_value === 0 && addType;
    if (isRtmAdd || isRemoteAdd) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

function _isTxtV (jsonMsg) {
  const { message_type, source, giftId } = jsonMsg;
  return message_type === 1 && source && giftId <= 0;
}

function _isVideo (jsonMsg) {
  const { message_type, source, giftId } = jsonMsg;
  return message_type === 10;
}

function _isSystemMsg (jsonMsg) {
  const { senderId, message_type_value } = jsonMsg;
  return senderId < 0 && message_type_value === -3;
}

export function parseShowMsg (jsonMsg) {
  let type = 'txt'; let html = '';
  if (_isGift(jsonMsg)) {
    type = 'gift';
    html = _processGift(jsonMsg);
  }
  if (_isImg(jsonMsg)) {
    type = 'img';
    html = {
      source: `<div class="img-box"><img class="msg-img"  src="${jsonMsg.picture_url}" /></div>`,
      type: '[' + i18n.t('app.chat_message_content_image') + ']',
      url: jsonMsg.picture_url
    };
  }
  if (_isTxt(jsonMsg)) {
    type = 'txt';
    html = _processTxt(jsonMsg.textContent);
  }
  if (_isAddFriend(jsonMsg)) {
    type = 'friend';
    html = _processAddFriend(jsonMsg);
  }

  if (_isVideo(jsonMsg)) {
    type = 'video';
    html = _processVideo(jsonMsg);
  }

  if (_isSystemMsg(jsonMsg)) {
    type = 'system';
    html = _processSystem(jsonMsg);
  }

  return {
    type,
    html,
    rawDate: jsonMsg
  };
}

function _processGift (jsonMsg) {
  const giftAllList = store.state.app.giftAllList;
  const gift = giftAllList[jsonMsg.giftId];
  const url = gift ? gift.giftImage : '';
  const html = `<img src="${url}" alt="${jsonMsg.giftId}" class="gift-img"/>`;

  return {
    source: html,
    type: i18n.t('app.gift_message_content'),
    giftId: jsonMsg.giftId
  };
}

function _processTxt (textContent) {
  const isT = _haveTranslate(textContent);
  const data = typeof textContent === 'string' ? JSON.parse(textContent) : textContent;
  // "{"function":0,"source":"hi","translation":"hi"}"
  const { source, translation } = data;
  const sTxt = _processEmoji(source);
  let tTxt = isT;

  if (isT) {
    tTxt = _processEmoji(translation);
  }
  return {
    source: sTxt,
    translation: tTxt
  };
}

function _processAddFriend (jsonMsg) {
  const friendInfo = store.state.app.imChatConfig;
  const friendName = friendInfo.userName || '';
  const storeFriendId = friendInfo.friendId;
  const userId = Number(Cookies.get('userId'));
  const { addType, senderId, receiverIds, accept } = jsonMsg;
  const friendId = userId === senderId ? receiverIds[0] : senderId;

  const con = userId === senderId ? i18n.t('app.already_added_friend') : i18n.t('app.request_add_friend'); //
  let txt = addType === 2
    ? userId === senderId ? i18n.t('app.accept_add_freind_request') : i18n.t('app.request_add_friend_back')
    : con;
  if (accept) txt = i18n.t('app.chat_message_content_random_add_friend_completed'); // '你们已经是好友了，开始聊天吧';
  if (storeFriendId) {
    txt = txt.replace('{friendName}', friendName);
  }
  const html = `<span>${txt}</span>`;

  return {
    source: html,
    addType,
    friendId,
    accept
  };
}

function _processVideo (jsonMsg) {
  const userId = Number(Cookies.get('userId'));
  const { videoTime, hangupReason, callerUserId, calleeUserId, hangupUserId } = jsonMsg;
  const friendId = userId === callerUserId ? calleeUserId : callerUserId;

  const duration = durationTime(videoTime);
  if (videoTime > 0 || hangupReason === 1) {
    const html = `<span class="ico icon-video2"></span><span class="msg-txt">${duration}</span>`;
    return {
      source: html,
      friendId
    };
  }

  let reason = '';
  if (callerUserId === userId) {
    if (hangupReason === 2) {
      reason = i18n.t('app.chat_message_content_call_canceled');
    } else {
      reason = i18n.t('app.chat_message_content_call_no_answer');
    }
  } else {
    if (hangupReason === 3) {
      reason = i18n.t('app.chat_message_content_call_denied');
    } else {
      reason = i18n.t('app.chat_message_content_call_missed');
    }
  }

  const html = `<span class="ico icon-video2"></span><span class="msg-txt">${reason}</span>`;

  return {
    source: html,
    friendId
  };
}

function _processEmoji (content) {
  // 转化聊天列表里的emoji为图片
  let newDlg = '';
  if (!content || !content.length) return newDlg;

  for (const cp of content) {
    const key = `0x${cp.codePointAt(0).toString(16)}`;
    const emoji = emojiData[key];

    if (emoji) {
      newDlg += `<img class="emoji" alt="${emoji.txt}" src="https://h5.livuchat.com/static/images/emoji/${emoji.imgUrl}" />`;
    } else if (cp === '<') {
      newDlg += '&lt;';
    } else if (cp === '>') {
      newDlg += '&gt;';
    } else {
      newDlg += cp;
    }
  }
  return newDlg;
}

function _processSystem (jsonMsg) {
  const { content, senderId, target, targetUri, image } = jsonMsg;

  return {
    source: content,
    friendId: senderId,
    target: target || targetUri,
    image,
  };
}

export function parseShowMsgInVideo (data) {
  let type = 'txt';
  let html = '';

  const jsonMsg = data;
  const vMsg = JSON.parse(data.content);
  if (data.message_type !== 4 || typeof vMsg !== 'object') {
    return {
      type,
      html,
      rawDate: data
    };
  }
  vMsg.translation = vMsg.content;
  jsonMsg.message = vMsg;
  console.log(vMsg, '------vMsg-------');

  if (_isGiftV(vMsg)) {
    type = 'gift';
    html = _processGift(vMsg);
  }

  if (_isAskGfitV(vMsg)) {
    type = 'giftAsk';
    html = {
      source: vMsg.source,
      translation: vMsg.translation,
      giftId: vMsg.giftId
    };
  }

  if (_isTxtV(vMsg)) {
    type = 'txt';
    html = _processTxt(vMsg);
  }

  return {
    type,
    html,
    rawDate: jsonMsg
  };
}

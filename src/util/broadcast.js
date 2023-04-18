/* eslint-disable camelcase */
import store from '@/store';

import { storageIMsg, getMsgByUuid } from '@/util/message';
import { decodeMessage, base64Msg, createDBSystemMsg, createDBSystemChatMsg } from '@/util/process';
import { setMessageRead } from '@/api/message';
import i18n from '@/i18n';
import Cookies from 'js-cookie';

export async function distribute (msgData) {
  if (_isShouldShowInBox(msgData.content)) {
    console.info('--消息放到聊天窗口---');
    const msg = decodeMessage(msgData.content);
    msgData.messageId = msg.messageId;
    store.commit('saveDialog', msgData);
  }

  if (_isShouldDB(msgData.content)) {
    console.info('--消息存本地---');
    if (_isShouldShowInBox(msgData.content)) {
      msgData.read = 1;
    }
    storageIMsg(msgData);
    _playMsgAudio(msgData);
  }

  _videoEndMsg(msgData);

  _giftMsg(msgData);
  _friendMsg(msgData);
}

export async function distributeOther (msgData) {
  console.log('-----系统通知-------', msgData);
  _systemMessage(msgData); // 系统消息
}

// 存 db
function _isShouldDB (val) {
  const msg = decodeMessage(val);
  const { message_type } = msg;

  if ([1].includes(message_type)) {
    return true;
  }
  return false;
}

// 显示到聊天窗口
function _isShouldShowInBox (val) {
  let friendId = store.state.app.imChatConfig && store.state.app.imChatConfig.friendId;
  const showVideoPop = store.state.app.showVideoPop;
  const show1V1VideoPop = store.state.app.show1v1Pop;
  try {
    if (showVideoPop) {
      friendId = store.state.agora.bizData.remoteUserInfo.id;
    }
    if (show1V1VideoPop) {
      friendId = store.state.agora.matchCallData.id;
    }
  } catch (error) {
    console.log('---store 解析 friendId 错误-----');
  }

  const msg = decodeMessage(val);
  console.log(msg, friendId, '-------0000');
  const { message_type, content, senderId, receiverIds } = msg;
  try {
    const tow = [Number(senderId), Number(receiverIds[0])];
    if (!tow.includes(friendId)) {
      console.log('---不是你的消息--');
      return;
    }
    const parseCon = typeof content === 'object' ? content : JSON.parse(content);

    if (typeof parseCon === 'object') {
      const { message_type: mt, accepted } = parseCon;

      if (!showVideoPop && !show1V1VideoPop && mt === 2 && accepted) { // 同意加好友
        console.log('---非视频内加好友，放到聊天列表--');
        return true;
      }
      return [1, 5, 10].includes(mt);
    }

    return [1].includes(message_type);
  } catch (err) {
    return [1].includes(message_type);
  }
}

// 是否是视频内收到的礼物
function _giftMsg (data) {
  const { content, userId } = data;
  const msg = decodeMessage(content);
  const { message_type, content: sonCon, senderId } = msg;
  if (message_type !== 4 || userId === senderId) return;
  try {
    const parseCon = JSON.parse(sonCon);
    if (typeof parseCon === 'object') {
      const { message_type, giftId, giftStar } = parseCon;
      if (message_type === 5 && giftId > 0) {
        // todo
        const str = `===你收到了一个礼物=== 礼物id ${giftId}， 礼物价价值：${giftStar}，发送人： ${senderId}`;
        console.log(str);
        const gift = {
          show: true,
          info: {
            giftId,
            giftStar,
            senderId,
          }
        };

        store.commit('setGiftConfig', gift);
      }
    }
  } catch (err) {

  }
}
// 是否是视频内收到请求加好友和对方已同意加好友
function _friendMsg (data) {
  const { content, userId } = data;
  const msg = decodeMessage(content);
  const { addType, message_type, message_type_value, content: sonCon, senderId } = msg;
  if (message_type === 1 && message_type_value === 1 && addType === 2) {
    const str = `===对方同意加你为好友 ，对方id： ${senderId}`;
    console.log(str);
    const friend = {
      show: true,
      info: {
        friendId: senderId,
        type: 'agree'
      }
    };

    store.commit('setAddFriend', friend);
    return;
  }

  if (message_type !== 4 || userId === senderId) return;
  try {
    const parseCon = JSON.parse(sonCon);
    if (typeof parseCon === 'object') {
      const { message_type, accepted, type } = parseCon;
      if (message_type === 2 && accepted) {
        // todo
        const str = `===你收到了一个好友邀请 ，发送人： ${senderId}`;
        console.log(str);
        const friend = {
          show: true,
          info: {
            friendId: senderId,
            times: store.state.app.addFriend.info.times + 1,
            type: 'friend'
          }
        };
        store.commit('setAddFriend', friend);
      }
    }
  } catch (err) {

  }
}

function _videoEndMsg (data) {
  const { content, userId, bizData } = data;
  const msg = decodeMessage(content);
  const { message_type, callerUserId, calleeUserId, callLocation, videoTime } = msg;
  if (message_type !== 10 || userId === bizData.sendUserId) return;

  if (callLocation === 100 && videoTime < 1) {
    console.log('------匹配呼叫失败，不保存此消息----');
    return;
  }

  console.log('-------存视频消息----------');
  const strMsg = base64Msg(msg, data);
  const newData = { ...data };
  newData.content = strMsg;
  newData.bizData.sendUserId = callerUserId;
  newData.messageId = msg.roomNum;
  newData.read = 1;

  storageIMsg(newData);

  const friendId = store.state.app.imChatConfig && store.state.app.imChatConfig.friendId;
  const friendId2 = userId === calleeUserId ? callerUserId : calleeUserId;
  // const showVideoPop = store.state.app.showVideoPop;
  console.log(friendId2 === friendId, friendId2, friendId, '------friendId2 === friendId--------');
  if (friendId2 === friendId) {
    setTimeout(() => {
      store.commit('saveDialog', newData);
    }, 200);
  }

  _setMsgRead(newData, msg);
}

function _setMsgRead (newData, msg) {
  const { userId } = newData;
  const { calleeUserId, callerUserId } = msg;

  const friendId = userId === calleeUserId ? callerUserId : calleeUserId;
  if (!friendId || !userId) return;
  const data = {
    receiveUserId: userId,
    sendUserId: friendId,
  };
  setMessageRead(data).then((res) => {
    console.log(res, '---通话结束---将消息标记已读');
  });
}

function _systemMessage (data) {
  // 领金币消息
  if (data.type === 1120) {
    // data = _createCoinMsg(data);
  }
  const { extra, expire, type, bizType } = data;
  if (type === 1090) {
    _systemSendMockMsg(data);
    return;
  }

  if (extra && extra.function !== undefined && extra.function !== 0) return;
  const allType = type || bizType;
  if ([52, 66, 73, 1050].includes(allType)) return;
  const now = Date.now();
  if (expire < now) return;

  const msg = createDBSystemMsg(data);
  storageIMsg(msg);

  _playMsgAudio(msg);

  const { bizData } = msg;
  const friendId = store.state.app.imChatConfig && store.state.app.imChatConfig.friendId;
  if (bizData.sendUserId === friendId) {
    store.commit('saveDialog', msg);
  }
}

function _createCoinMsg (data) {
  console.log('------领金币消息----');
  const obj = {
    userId: data.userId,
    content: data.content,
    target: data.target || '#checkIn',
    type: data.type,
    noticeType: data.noticeType,
    messageUuid: data.messageUuid,
    timestamp: data.timestamp,
    extra: {
      traceId: data.extra.traceId,
      function: 0,
    },
    messageId: data.messageId
  };
  return obj;
}

/**
 * {
    "userId": 116220194,
    "content": "hello hi",
    "type": 1090,
    "noticeType": 1,
    "messageUuid": "a767daad1c3648a98f78e89da4f623dd",
    "timestamp": 1670571604490,
    "extra": {
        "messageType": 2,
        "function": 1,
        "userId": 116203129,
        "content": "hello hi"
    },
    "messageId": "a767daad1c3648a98f78e89da4f623dd",
    "showInAppBanner": false
}
 */
// 系统替主播发消息
function _systemSendMockMsg (data) {
  const { extra, type, noticeType } = data;
  if (![2, 3, 6].includes(extra.messageType) || type !== 1090) return;
  let msg = '';
  if (extra.messageType === 2 || extra.messageType === 6) {
    msg = createDBSystemChatMsg(data);
  } else if (extra.messageType === 3) {
    const friendInfo = {
      userId: data.userId,
      type,
      messageUuid: data.messageUuid,
      timestamp: data.timestamp,
      messageId: data.messageId,
      callerUserId: extra.userId,
      calleeUserId: data.userId,
      bizType: type,
    };
    msg = _makerAddFriendMsg(friendInfo, 1);
  }

  console.log('----系统替主播发消息--999----');

  storageIMsg(msg);
  _playMsgAudio(msg);

  const { userId: sendUserId } = extra;
  const friendId = store.state.app.imChatConfig && store.state.app.imChatConfig.friendId;
  if (sendUserId === friendId) {
    store.commit('saveDialog', msg);
  }
}

// 小助手欢迎消息
export async function insertWelcome () {
  const userInfo = store.state.app.userInfo;
  if (!userInfo.id || !userInfo.userName) return;
  _insertWelcome(userInfo);
  const welcomeMsgId = `welcome-${userInfo.id}`;
  const hasMsg = await getMsgByUuid(`${welcomeMsgId}-1`);
  if (hasMsg && (hasMsg.userId === userInfo.id)) return;

  const msg1 = userInfo.gender === 1 ? i18n.t('app.welcome_content_female', { userName: userInfo.userName }) : i18n.t('app.welcome_content_male', { userName: userInfo.userName });
  const msg2 = i18n.t('app.welcome_content_support');
  // const msg3 = i18n.t('app.welcome_content_service');
  const arr = [
    { content: msg1, id: `${welcomeMsgId}-1` },
    { content: msg2, id: `${welcomeMsgId}-2` },
    // { content: msg3, id: `${welcomeMsgId}-3`, target: 'https://livcame.me/safety-center' },
  ];
  arr.forEach((item, index) => {
    const msg = _makerSystemMsg(item);
    setTimeout(() => {
      _systemMessage(msg);
    }, 50 * index);
  });
}

function _makerSystemMsg (info) {
  const base = {
    expire: Date.now() + 1000 * 60 * 5,
    type: -1,
    noticeType: 1,
    content: info.content,
    messageId: info.id,
    target: info.target || ''
  };
  return base;
}

async function _insertWelcome (userInfo) {
  const times = _loginTimes(userInfo.id);
  if (times < 2 || times > 20) return;
  if (!userInfo.id || !userInfo.userName) return;
  const welcomeMsgId = `welcome-${userInfo.id}`;
  const hasMsg = await getMsgByUuid(`${welcomeMsgId}-4`);
  if (hasMsg && (hasMsg.userId === userInfo.id)) return;

  const msg4 = i18n.t('app.welcome_content', { userName: userInfo.userName });
  const msg = _makerSystemMsg({ content: msg4, id: `${welcomeMsgId}-4` });
  _systemMessage(msg);
}

function _loginTimes (userId) {
  const key = 'RC_LOGIN_TIMES';
  const loginInfo = localStorage.getItem(key);
  const obj = loginInfo ? JSON.parse(loginInfo) : {};
  const times = obj[userId] || 0;
  return times;
}

// 插入加好友消息 不再使用
export async function insertAddFriend (friendInfo, type) {
  const data = _makerAddFriendMsg(friendInfo, type);
  console.log('-----加好友消息存储------', data);
  storageIMsg(data);

  const friendId = store.state.app.imChatConfig && store.state.app.imChatConfig.friendId;
  if (friendInfo.userFriendId === friendId) {
    store.commit('saveDialog', data);
  }
}

function _makerAddFriendMsg (friendInfo, type) {
  const uuid = friendInfo.messageUuid || Date.now();
  const userId = Number(Cookies.get('userId'));
  const message = {
    accept: false,
    addType: type,
    callerUserId: friendInfo.callerUserId || friendInfo.userId || userId,
    calleeUserId: friendInfo.calleeUserId || friendInfo.userFriendId,
    roomNum: uuid,
    message_type: 1,
    message_type_value: 1,
    timeStamp: friendInfo.timeStamp || uuid
  };
  const content = base64Msg(message);
  const base = {
    userId: friendInfo.userId || userId,
    content,
    messageUuid: friendInfo.messageUuid || uuid,
    messageId: friendInfo.messageId || uuid,
    noticeType: friendInfo.noticeType || 100,
    bizType: friendInfo.bizType || 1040,
    timestamp: friendInfo.timestamp || uuid,
    uniqueId: 'Remote-' + uuid,
    showInAppBanner: false,
    bizData: {
      sendUserId: friendInfo.callerUserId || userId,
      sendPlatformType: 4
    },
  };
  return base;
}

function _playMsgAudio (msgData) {
  // 消息提示音
  const userId = Number(Cookies.get('userId'));
  const { bizData } = msgData;
  const friendId = store.state.app.imChatConfig && store.state.app.imChatConfig.friendId;
  if (bizData.sendUserId === friendId || bizData.sendUserId === userId) {
    return;
  }
  window.$mObj.msgAudio.play();
}

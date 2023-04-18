import Cookies from 'js-cookie';
import debounce from 'lodash/debounce';
import AppDB, { storesName } from './db';
import { getCRoomId, compareArr } from '@/util/index';
import vueStore from '@/store';
import { badge } from '@/util/updateIcon';
import { decodeMessage, processDBChartUser, processDBChartList } from '@/util/process';
import { insertWelcome } from '@/util/broadcast';
import { getMsgUserList, getMsgListByUserId, deleteMsgList } from '@/api/message';
import { getOtherProfile } from '@/api/user';

const storeChatHistory = storesName.chatHistory;
const storeChatUser = storesName.chatUser;
let db, currDB, userId;
let allNoReadCount = 0;
const cacheFriendChat = new Set();

export async function init () {
  userId = Number(Cookies.get('userId'));
  db = await AppDB.init();
  currDB = await db.getDB();
  // _getCount();
  // 从服务器拉取消息
  _mergeChatUser();
  console.log('-------init db-----');
  insertWelcome();
}

export async function initDB () {
  db = await AppDB.init();
  currDB = await db.getDB();
}

/**
 * 将消息存入 idb
 * @param {object} parm 消息体
 * @returns 消息内容
 */
export async function storageIMsg (parm) {
  let message = '';
  try {
    message = decodeMessage(parm.content);
  } catch (error) {
    console.log('--todo ----小助手push----');
    return;
  }
  const senderId = parm.bizData.sendUserId;
  const receiverId = parm.bizData.sendUserId === userId ? message.receiverIds[0] : userId;
  const croomId = getCRoomId(receiverId, senderId);

  const indexMsg = { // 存 indexedDB 时将原始消息体中的常用字段提出来
    receiverId,
    senderId,
    messageId: message.messageId,
    messageType: message.message_type,
    messageTypeValue: message.message_type_value
  };
  // debugger;
  const _mb = {
    ...parm,
    ...indexMsg,
    read: parm.read ? parm.read : (userId === parm.bizData.sendUserId) ? 1 : 0,
    croomId,
  };
  console.log('---入库消息详情--', _mb);

  const store = await db.getStore(storeChatHistory);
  const rst = await store.put(_mb).catch(e => e);
  _addChatUser(_mb, message.addType);
}

/**
 * 将发消息的用户的最近一条消息存到最近聊天记录表中
 * @param {object} msg 消息体
 * @returns null
 */
async function _addChatUser (msg, addType) {
  const { croomId, receiverId, senderId, messageType } = msg;
  const friendId = userId === senderId ? receiverId : senderId;
  // if (senderId === userId) return;
  const info = await currDB.getFromIndex(storeChatUser, 'croomId', croomId);
  const newInfo = { ...msg };
  let relation = '';
  if (info) {
    newInfo.id = info.id;
    relation = info.relation;
  }
  const isOneWay = relation === 3 && messageType === 10;
  if (!info || (info && !info.headImg) || addType || isOneWay) {
    // todo 如果没有用户头像和名称则远程请求后插入到 storeChatUser
    const user = await _getFriendInfo(friendId);
    if (user) {
      newInfo.userName = user.userName;
      newInfo.headImg = user.headImg;
      newInfo.relation = user.relation;
    }
  }

  newInfo.friendId = +friendId;
  newInfo.noReadCount = await _getNoReadCount(msg); // 未读消息数
  newInfo.timestampUser = msg.timestamp || (info && info.timestampUser) || Date.now();
  const data = { ...info, ...newInfo };
  console.log('---消息列表--', data);
  try {
    const store = await db.getStore(storeChatUser);
    await store.put(data);
  } catch (error) {
    console.log(error, croomId, '-------error---------');
  }
  _updateStoreUser();
}

async function _getFriendInfo (friendId) {
  const systemUsers = {
    '-1': { userName: 'Notifications', headImg: 'https://h5.livuchat.com/static/images/chatweb/icon-system.png' }, // notification
    '-2': { userName: 'GoMeet Team', headImg: 'https://h5.livuchat.com/static/images/chatweb/icon-gomeetteam.png' }, // 1:livu team
    '-3': { userName: 'Income Notices', headImg: '' } // 2:income
  };
  const user = systemUsers[friendId];
  if (user) {
    return user;
  }
  if (friendId > 0) {
    const params = {
      searchUserId: friendId
    };
    const res = await getOtherProfile(params);
    console.log('----消息入库查询用户信息-------', res);
    const user = (res && res.data) || {};
    return user;
  }
}

/**
 * 获取好友消息未读总数
 * @param {object} msg 消息体
 * @returns number 未读消息总数
 */
async function _getNoReadCount (msg) {
  const { croomId } = msg;
  const count = await currDB.countFromIndex(storeChatHistory, 'read', [croomId, 0]);
  console.log(count, '---noreadc---');
  return count;
}

async function _updateStoreUser (list) {
  const users = list || await _getChatUsers();
  users.sort(compareArr('timestampUser'));
  vueStore.commit('updateChatUsers', users);
  _getCount();
}

async function _getChatUsers () {
  if (!currDB) {
    await initDB();
  }
  const users = await currDB.getAllFromIndex(storeChatUser, 'userId', userId);

  allNoReadCount = 0;
  users.forEach(item => {
    allNoReadCount += item.noReadCount || 0;
  });
  return users;
}

async function _getOneChatUser (friendId) {
  if (!currDB) {
    await initDB();
  }
  const croomId = getCRoomId(userId, friendId);
  const user = await currDB.getAllFromIndex(storeChatUser, 'croomId', croomId);
  return user;
}

/**
 * 获取当前用户与好友的聊天记录
 * @param {number} friendId
 * @returns 所有与好友的聊天记录
 */
export async function getChatList (friendId) {
  if (!currDB) {
    await initDB();
  }
  const croomId = getCRoomId(userId, friendId);
  const list = await currDB.getAllFromIndex(storeChatHistory, 'croomId', croomId);
  if (cacheFriendChat.has(friendId)) {
    console.log('--直接读本地数据---', list);
    return list.sort((a, b) => a.timestamp - b.timestamp);
  }
  const remote = await _getFriendMsg(friendId);
  if (remote.length > 0) {
    const newList = processDBChartList(list, remote);
    if (newList.length === 0) {
      return list.sort((a, b) => a.timestamp - b.timestamp); ;
    }
    console.log(newList, '--远程-合并的数据----');
    newList.forEach(async item => {
      item.read = 1;
      await storageIMsg(item);
    });
  }
  const newList = await currDB.getAllFromIndex(storeChatHistory, 'croomId', croomId);
  return newList.sort((a, b) => a.timestamp - b.timestamp);
}

async function _getFriendMsg (friendId) {
  try {
    const params = {
      userId,
      friendId
    };
    const res = await getMsgListByUserId(params);
    if (res.code === 200) {
      cacheFriendChat.add(friendId);
      const { list } = res.data;
      return list;
    }
  } catch (error) {
    return [];
  }
}

/**
 * 获取所有消息总数
 * @param {number} read 消息状态 1已读，0未读
 * @returns number
 */
async function _getCountMsg (read = 0) {
  // let count = await currDB.countFromIndex(storeChatHistory, 'readAll', [userId, read]);
  // console.log(count, allNoReadCount, '---消息总数---', read);
  const count = allNoReadCount; // Math.max(count, allNoReadCount);
  vueStore.commit('setUnReadCount', count);
  badge(count);
  return count;
}

export const _getCount = debounce(_getCountMsg, 300);

/**
 * 将所有消息标记已读
 * @param {number} userId 当前登录用户
 */
export async function setAllRead () {
  const msgs = await currDB.getAllFromIndex(storeChatHistory, 'readAll', [userId, 0]);
  const store = await db.getStore(storeChatHistory);
  msgs.forEach(async item => {
    item.read = 1;
    await store.put(item);
  });
  await _setChatUserRead();
  badge(0);
  vueStore.commit('setUnReadCount', 0);
}

/**
 * 将某个好友的所有消息标记已读
 * @param {object} friendId 好友id
 * @returns
 */
export async function setFriendMsgRead (friendId) {
  const croomId = getCRoomId(userId, friendId);
  const msgs = await currDB.getAllFromIndex(storeChatHistory, 'read', [croomId, 0]);
  const store = await db.getStore(storeChatHistory);
  msgs.forEach(async item => {
    item.read = 1;
    await store.put(item);
  });
  await _setChatUserReadOne(friendId);
}

/**
 * 更新最近聊天记录表中未读总数
 */
async function _setChatUserReadOne (friendId) {
  const users = await _getOneChatUser(friendId);
  const store = await db.getStore(storeChatUser);
  users.forEach(async item => {
    item.noReadCount = 0;
    await store.put(item);
  });
  _updateStoreUser();
}

/**
 * 更新最近聊天记录表中未读总数
 */
async function _setChatUserRead () {
  const users = await _getChatUsers();
  const store = await db.getStore(storeChatUser);
  users.forEach(async item => {
    item.noReadCount = 0;
    await store.put(item);
  });
  allNoReadCount = 0;
  _updateStoreUser(users);
}

/**
 * 最近聊天用户列表中删除某用户
 * @returns 最近聊天的用户
 */
export async function deleteChatUser (friendId) {
  if (!currDB) {
    await initDB();
  }
  deleteMsgList({ friendId });
  const croomId = getCRoomId(userId, friendId);
  const key = await currDB.getKeyFromIndex(storeChatUser, 'croomId', croomId);
  if (key) { await currDB.delete(storeChatUser, key); }

  _deleteAllReadMsg(croomId);
  _updateStoreUser();
}

/**
 * 获取最近聊天用户列表
 * @returns 最近聊天的用户
 */
export async function triggerChatUser (friendInfo) {
  const info = {};
  if (friendInfo && friendInfo.id) {
    info.friendId = friendInfo.id;
    info.headImg = friendInfo.headImg;
    info.userName = friendInfo.userName;
    info.relation = friendInfo.relation;
    await _updateChatUser(info);
  } else {
    _updateStoreUser();
  }
}

/**
 * 将用户信息模拟成消息体更新到最近聊天记录 idb 中
 * @param {object} friendInfo 用户信息
 */
async function _updateChatUser (friendInfo) {
  const croomId = getCRoomId(userId, friendInfo.friendId);
  const msg = {
    croomId,
    receiverId: friendInfo.friendId,
    senderId: userId,
    userId
  };
  const data = { ...msg, ...friendInfo };
  await _addChatUser(data);
}

/**
 * 清除最近聊天用户列表中未读消息为 0 的用户
 * @param {number} friendId 当前正在聊天的好友id
 */
export async function clearReadMsg (friendId) {
  const users = await _getChatUsers();
  const store = await db.getStore(storeChatUser);
  users.forEach(async item => {
    const { noReadCount, id, croomId } = item;
    if (noReadCount === 0) {
      _deleteAllReadMsg(croomId);
      if (item.friendId !== friendId) {
        store.delete(id);
      }
    }
  });
  _updateStoreUser();
}

/**
 * 删除信息列表中未读消息为 0 的所有聊天记录
 * @param {string} croomId
 */
async function _deleteAllReadMsg (croomId) {
  const keys = await currDB.getAllKeysFromIndex(storeChatHistory, 'croomId', croomId);
  const store = await db.getStore(storeChatHistory);
  keys.forEach(async item => {
    store.delete(item);
  });
}

/**
 * 将某条消息标记已读
 * @param {Array} uuid messageUuid
 */
export async function setMsgRead (uuids) {
  let data = {};
  for (const uuid of uuids) {
    const msg = await currDB.getFromIndex(storeChatHistory, 'messageUuid', uuid);
    if (msg.read !== 1) {
      msg.read = 1;
      const store = await db.getStore(storeChatHistory);
      await store.put(msg).catch(e => e);
    }
    data = msg;
  }
  data.timestamp = null;
  _addChatUser(data);
}

/**
 * 获取某条消息
 * @param {Array} uuid messageUuid
 */
export async function getMsgByUuid (uuid) {
  const msg = await currDB.getFromIndex(storeChatHistory, 'messageUuid', uuid);
  return msg;
}

/**
 * 获取好友信息
 * @param {number} friendId
 * @returns 好友信息
 */
export async function getFriendInfo (friendId) {
  if (!currDB) {
    await initDB();
  }
  const croomId = getCRoomId(userId, friendId);
  const info = await currDB.getFromIndex(storeChatUser, 'croomId', croomId);
  return info;
}

/**
 * 将服务器端获取的最近聊天用户存到本地
 * @param {Array} list
 * @returns
 */
export async function _mergeChatUser () {
  try {
    const res = await getMsgUserList();
    if (res.code === 200) {
      const { list: remoteList } = res.data;
      if (remoteList.length > 0) {
        const users = await _getChatUsers();
        const newList = processDBChartUser(users, remoteList);
        newList.forEach(async item => {
          const { croomId } = item;
          const key = await currDB.getKeyFromIndex(storeChatUser, 'croomId', croomId);
          if (key) item.id = key;
          const store = await db.getStore(storeChatUser);
          await store.put(item);
        });
      }
    }
    setTimeout(() => {
      _updateStoreUser();
    }, 200);
  } catch (error) {
    setTimeout(() => {
      _updateStoreUser();
    }, 200);
  }
}

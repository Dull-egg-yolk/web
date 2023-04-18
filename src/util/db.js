import { openDB } from 'idb';

const { appName } = baseConfig;
const DB_NAME = `web-service-${appName.toLocaleLowerCase()}`;
const DB_VERSION = 1;

const tables = {}; // 每个 store 实例
let db = null;

export const storesName = {
  chatHistory: 'chat-history',
  chatUser: 'chat-user',
  friendInfo: 'friend-info'
};

const dbStoreList = [
  {
    storeValue: storesName.chatHistory,
    storeName: '所有聊天记录',
    index: [
      {
        indexName: 'messageUuid', // rtm 中的 messageUuid
        keyPath: 'messageUuid',
        objectParameters: { unique: true }
      },
      {
        indexName: 'messageType', // 消息内容中的 message_type
        keyPath: 'messageType',
        objectParameters: { unique: false }
      },
      {
        indexName: 'messageTypeValue', // 消息内容中的 message_type_value
        keyPath: 'messageTypeValue',
        objectParameters: { unique: false }
      },
      {
        indexName: 'userId', // 当前登录的用户
        keyPath: 'userId',
        objectParameters: { unique: false }
      },
      {
        indexName: 'croomId', // 发送和接收者按小到大排序的值
        keyPath: 'croomId',
        objectParameters: { unique: false }
      },
      {
        indexName: 'read', // 当前用户与好友消息是否已读
        keyPath: ['croomId', 'read'],
        objectParameters: { unique: false }
      },
      {
        indexName: 'readAll', // 当前用户的所有消息是否已读
        keyPath: ['userId', 'read'],
        objectParameters: { unique: false }
      },
      {
        indexName: 'bizType', // 暂时不用
        keyPath: ['userId', 'bizType'],
        objectParameters: { unique: false }
      }
    ]
  },
  {
    storeValue: storesName.chatUser,
    storeName: '最近聊天用户列表',
    index: [
      {
        indexName: 'croomId', // 发送者和接收者 id
        keyPath: 'croomId',
        objectParameters: { unique: true }
      },
      {
        indexName: 'userId', // 当前登录的用户
        keyPath: 'userId',
        objectParameters: { unique: false }
      },
      {
        indexName: 'senderId', // 好友 id 同 friendId
        keyPath: 'senderId',
        objectParameters: { unique: false }
      }
    ]
  }
];

export default class AppDB {
  static async init () {
    await this.initDB();
    return new AppDB();
  }

  static async initDB () {
    if (db) return db;
    db = await openDB(DB_NAME, DB_VERSION, {
      upgrade (db) {
        console.log('upgrade db', db);

        dbStoreList.forEach(item => {
          const { storeValue } = item;
          if (!db.objectStoreNames.contains(storeValue)) {
            tables[storeValue] = db.createObjectStore(storeValue, {
              keyPath: 'id',
              autoIncrement: true
            });
            if (item.index) {
              item.index.forEach(data => {
                const { indexName, keyPath, objectParameters } = data;
                tables[storeValue].createIndex(indexName, keyPath, objectParameters);
              });
            }
          }
        });
      }
    });
  }

  getDB () {
    return db;
  }

  getAllStoreName () {
    return db.objectStoreNames;
  }

  async getStore (storeName) {
    const store = await db.transaction(storeName, 'readwrite').objectStore(storeName);
    return store;
  }
}

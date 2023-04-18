import { request } from './base';

const urls = {
  backpackExpireList: '/wchat/facade/api/backpack/backpackExpireList',
  backpackGiftList: '/wchat/facade/api/backpack/backpackGiftList',
  backpackList: '/wchat/facade/api/backpack/backpackList',
  entrance: '/wchat/facade/api/backpack/entrance',
};

const config = {
  headers: {
    'Athena-Response-Encryption': 'disabled',
    'Athena-Request-Decryption': 'disabled'
  }
};

// 获取背包列表
export const getBackpackExpireList = async function () {
  try {
    return await request.get(urls.backpackExpireList, {}, config);
  } catch (e) {}
};

export const getBackpackGiftList = async function () {
  try {
    return await request.get(urls.backpackGiftList, {}, config);
  } catch (e) {}
};

export const getBackpackList = async function () {
  try {
    return await request.get(urls.backpackList, {}, config);
  } catch (e) {}
};

export const getBackpackEntrance = async function () {
  try {
    return await request.get(urls.entrance, {}, config);
  } catch (e) {}
};

import { request } from './base';

const urls = {
  livcamConfig: '/matches/api/gomeet/matches/conf', // 配置项
  livCamHost: '/matches/api/gomeet/matches/matching/fetch', // match
  deductGold: '/matches/api/subtractGoldMatchCall',
  addFriend: '/matches/api/matches/friend/addFriend',
  matchingFetch: '/matches/api/gomeet/matches/matching/fetch'
};

// 获取 livcam 配置
export const apiGetLivcamConfig = async function (params = {}) {
  try {
    return await request.get(urls.livcamConfig, params);
  } catch (e) {
    return Promise.reject(e);
  }
};

// 获取 livcam 女生
export const apiGetLivcamHost = async function (params = {}) {
  try {
    return await request.get(urls.livCamHost, params);
  } catch (e) {
    return Promise.reject(e);
  }
};

// 喜欢livcam 主播
export const apiDeductGold = async function (params = {}) {
  try {
    return await request.post(urls.deductGold, params);
  } catch (e) {
    return Promise.reject(e);
  }
};

// 加好友
export const apiAutoAddFriend = async function (params = {}) {
  try {
    return await request.post(urls.addFriend, params);
  } catch (e) {
    return Promise.reject(e);
  }
};

// 获取 matching 主播
export const apiGetMatchingHost = async function (params = {}) {
  try {
    return await request.get(urls.matchingFetch, params);
  } catch (e) {
    return Promise.reject(e);
  }
};

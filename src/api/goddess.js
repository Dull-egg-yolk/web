import { request } from './base';

const urls = {
  // goddessGroup: '/matches/api/meetwallTags', // 用户状态
  goddessGroup: '/matches/api/selectAllInWallGroup',
  goddessList: '/matches/api/gomeet/matches/wall',
  goddessVisitorList: '/facade/api/homepage/userlist/exempt/list/part/users/guest', // 游客模式
  goddessStatus: '/facade/api/onlinestatus/exempt/batch', // 批量获取用户们的在线状态
  goddessHost: '/facade/api/homepage/userlist/exempt/filter/part/countryids' // 获取Host 国家
};

// 获奖女神分组
export const apiGetGoddessGroup = async function (params = {}) {
  try {
    return await request.get(urls.goddessGroup, params);
  } catch (e) {
    return Promise.reject(e);
  }
};

// 获奖女神列表
export const apiGetGoddessList = async function (params = {}) {
  try {
    return await request.get(urls.goddessList, params);
  } catch (e) {
    return Promise.reject(e);
  }
};

// 登录前获奖女神列表
export const apiVisitorGetGoddessList = async function (params = {}) {
  try {
    return await request.get(urls.goddessVisitorList, params);
  } catch (e) {
    return Promise.reject(e);
  }
};

// 获取女神状态列表
export const apiGetGoddessStatus = async function (data = {}) {
  if (!data.userIds) return;
  data.userIds += '';
  const oa = data.userIds.split(',');
  data.userIds = oa.map(item => {
    if (item === 'NaN') {
      item = 0;
    }
    return item;
  }).join(',');

  try {
    return await request.get(urls.goddessStatus, data);
  } catch (e) {
    return Promise.reject(e);
  }
};

// 获取Host国家列表
export const apiGetGoddessHost = async function (data = {}) {
  try {
    return await request.get(urls.goddessHost, data);
  } catch (e) {
    return Promise.reject(e);
  }
};

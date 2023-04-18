import { request } from './base';

const urls = {
  cardConf: '/matches/api/gomeet/matches/conf',
  cardGetHost: '/matches/api/gomeet/matches/fetch',
  cardLike: '/matches/api/like',
};

// 获取 card 配置
export const apiGetCardConf = async function (params = {}) {
  try {
    return await request.get(urls.cardConf, params);
  } catch (e) {
    return Promise.reject(e);
  }
};

// 获取 card 主播
export const apiGetCardHost = async function (params = {}) {
  try {
    return await request.get(urls.cardGetHost, params);
  } catch (e) {
    return Promise.reject(e);
  }
};

// 喜欢livcam 主播
export const apiLikeCardHost = async function (params = {}) {
  try {
    return await request.post(urls.cardLike, params);
  } catch (e) {
    return Promise.reject(e);
  }
};

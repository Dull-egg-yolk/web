import { request } from './base';

const urls = {
  friendsList: '/facade/api/friend/getFriendList', // 获取朋友列表
  addFriend: '/facade/api/friend/addFriend', // 添加好友
  getRelations: '/facade/api/friend/relations', // 获取用户之间的关系
  setStick: '/facade/api/friend/stick', // 好友置顶
  addBlock: '/facade/api/black/addBlack', // 添加黑名单
  remarkName: '/facade/api/friend/remark', // 修改备注名
  delFriend: '/facade/api/friend/delete', // 删除朋友
  blockList: '/facade/api/black/blacklists', // 黑名单列表
  removeBlock: '/facade/api/black/removeBlack', // 移除黑名单
  remindSwitch: '/facade/api/friend/onlineRemindSwitch', // 上线提醒开关
  remindList: '/facade/api/friend/onlineRemindList', // 上线提醒列表
  searchFriend: '/facade/api/friend/search', // 好友搜索
  getUserPics: '/facade/api/album/getAlbumPics', // 获取用户相册
  getUserVideo: '/facade/api/album/getStoryVideos', // 获取用户story视频
  delUserPic: '/facade/api/album/deleteAlbumPic', // 删除自己的相册
  reportUser: '/facade/api/report/users/report/profile', // profile 举报
  reportVideo: '/facade/api/report/video/report/images', // 视频举报
  reportUpgrade: '/facade/api/report/video/report/two', // 举报升级
  reportEmail: '/facade/api/report/check/email', // 验证邮箱
  getPrice: '/api/call/getPrice'
};

// 获取用户相册
export const apiGetUserPics = async function (params = {}) {
  try {
    return await request.get(urls.getUserPics, params);
  } catch (e) {}
};

// 获取用户相册
export const apiGetUserVideo = async function (params = {}) {
  try {
    return await request.post(urls.getUserVideo, params);
  } catch (e) {}
};

// 删除自己的相册照片
export const apiDelUserPic = async function (params = {}) {
  try {
    return await request.post(urls.delUserPic, params);
  } catch (e) {}
};

// 好友上线提醒开关
export const apiSwitchRemind = async function (params = {}) {
  try {
    return await request.post(urls.remindSwitch, params);
  } catch (e) {}
};

// 好友上线提醒列表
export const apiRemindList = async function (params = {}) {
  try {
    return await request.get(urls.remindList, params);
  } catch (e) {}
};

// 搜索好友
export const apiSearchFriend = async function (params = {}) {
  try {
    return await request.get(urls.searchFriend, params);
  } catch (e) {}
};

// 获取朋友列表
export const apiGetFriends = async function (params = {}) {
  try {
    return await request.get(urls.friendsList, params);
  } catch (e) {}
};

// 获取用户之间的关系
export const apiGetRelations = async function (params = {}) {
  try {
    return await request.get(urls.getRelations, params);
  } catch (e) {}
};

// 添加好友
export const apiAddFriend = async function (params = {}) {
  try {
    return await request.post(urls.addFriend, params);
  } catch (e) {}
};

// 好友置顶
export const apiSetStick = async function (params = {}) {
  try {
    return await request.get(urls.setStick, params);
  } catch (e) {}
};

// 拉黑
export const apiAddBlock = async function (params = {}) {
  try {
    return await request.post(urls.addBlock, params);
  } catch (e) {}
};

// 修改备注名
export const apiRemarkName = async function (params = {}) {
  try {
    return await request.get(urls.remarkName, params);
  } catch (e) {}
};

// 删除好友
export const apiDelFriend = async function (params = {}) {
  try {
    return await request.get(urls.delFriend, params);
  } catch (e) {}
};

// 黑名单列表
export const apiGetBlockList = async function (params = {}) {
  try {
    return await request.get(urls.blockList, params);
  } catch (e) {}
};

// 移除黑名单
export const apiRemoveBlock = async function (params = {}) {
  try {
    return await request.post(urls.removeBlock, params);
  } catch (e) {}
};

// profile 举报
export const apiReportUser = async function (params = {}) {
  try {
    return await request.post(urls.reportUser, params);
  } catch (e) {}
};

// 视频举报
// export const apiReportVideo = async function (params = {}) {
//   try {
//     return await request.post(urls.reportVideo, params);
//   } catch (e) {}
// };

// 举报升级
export const apiReportUpgrade = async function (params = {}) {
  try {
    return await request.post(urls.reportUpgrade, params);
  } catch (e) {}
};

// 验证邮箱
export const apiReportEmail = async function (params = {}) {
  try {
    return await request.get(urls.reportEmail, params);
  } catch (e) {}
};

export const apiGetPrice = async function (params) {
  try {
    return await request.get(urls.getPrice, params);
  } catch (e) {}
};

export const apiReportVideo = async function (params) {
  try {
    return await request.post(urls.reportVideo, params);
  } catch (e) {}
};

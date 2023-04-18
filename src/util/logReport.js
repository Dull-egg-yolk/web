import { apiReport } from '@/api/user';
import Cookies from 'js-cookie';
import { underline2Hump, parseDate } from './index';
import { browser, getBrowser, getPlatformType } from './browser';

const language = navigator.language;
const cl = language.split('-')[0];
const platFormBrowser = getBrowser();
const platformType = getPlatformType();

const os = browser.getOS();
/**
 * self server 埋点
 * @param option
 */
export const logReport = function (option = {}) {
  const userId = Cookies.get('userId') || '';
  const deviceId = Cookies.get('deviceId') || '';
  const countryId = localStorage.getItem('RC_USER_COUNTRY') || localStorage.getItem('loc_physical_ms');
  const loginType = Cookies.get('userId') ? '3' : '0';
  const date = new Date();
  const params = {
    userId,
    deviceId,
    time: date.getTime(), // 时间戳
    createTime: parseDate(), // create_time
    xaid: loginType, // 登陆状态：0 未登陆，1 face ，2 phone，3 ID
    placeId: 106, // 板块ID
    attr1: 1, // 一级页面ID
    attr2: '', // 二级页面ID
    eventId: '', // 事件ID
    freeName2: '', // 备注
    cl: cl, // 系统语言
    capi: countryId, // 国家 ID
    countryId, // 国家 ID
    model: JSON.stringify({
      type: platformType,
      browser: platFormBrowser,
      os,
      webView: window.$mObj.webViewName
    }), // 浏览器
  };

  try {
    const pm = _mergeOption(params, option);
    apiReport(pm);
  } catch (e) {
    // console.log('self service trigger error')
  }
};

function _mergeOption (params, options) {
  const baseKeys = ['eventId', 'targetUserId', 'freeName1', 'freeName2'];
  const objOpt = {};
  let free2 = {
    browserUA: navigator.userAgent
  };
  if (window.matchMedia('(display-mode: standalone)').matches) {
    free2.isWebApp = true;
  }
  if (localStorage.getItem('RC_USER_IP')) {
    free2.ip = localStorage.getItem('RC_USER_IP');
  }

  for (const [name, value] of Object.entries(options)) {
    const key = underline2Hump(name);
    objOpt[key] = value;

    if (!baseKeys.includes(key)) {
      free2[key] = value;
    }
  }
  if (typeof objOpt.freeName2 === 'string') {
    free2.freeName2 = objOpt.freeName2;
  } else if (typeof objOpt.freeName2 === 'object') {
    free2 = { ...free2, ...objOpt.freeName2 };
  }

  objOpt.freeName2 = JSON.stringify(free2);

  return { ...params, ...objOpt };
}

export default {
  logReport
};

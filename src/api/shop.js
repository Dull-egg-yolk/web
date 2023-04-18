import { request } from './base';
import Cookies from 'js-cookie';
import Notice from '@/components/Shop/notice';
import { triggerService } from '@/util/shop';
import i18n from '@/i18n';

const version = 1;
const urls = {
  checkUserPayStatus: `${baseConfig.apiPath}/thirdPaymentRecon/${version}/web/checkUserPayStatus`,
  getCoinAndChannel: `${baseConfig.shopApi}/thirdPaymentRecon/${version}/web/getCoinAndChannel`,
  getCoinAndChannel2: `${baseConfig.shopApi}/thirdPaymentRecon/${version}/web/v2/getCoinAndChannel`,
  checkWebUserAndGetCoinAndChannel: `${baseConfig.shopApi}/thirdPaymentRecon/${version}/web/v2/checkWebUserAndGetCoinAndChannel`,
  queryCountryListHot: `${baseConfig.shopApi}/thirdPaymentRecon/${version}/queryCountryListHot`,
  payOrder: `${baseConfig.shopApi}/thirdPayment/${version}/placeOrder`,
  paymentMethod: `${baseConfig.gatewayApi}/payment/api/payments/ideal/1/paymentMethod`,
  getOrderInfo: `${baseConfig.shopApi}/thirdPayment/${version}/getOrderById`,
  userCard: `${baseConfig.gatewayApi}/usersync/api/users/${version}/`, // 用户卡列表和删除卡接口
  getPayExtParams: `${baseConfig.shopApi}/thirdPaymentRecon/${version}/getPayExtParams`, // 根据支付平台、渠道查询填写过的表单
  getOrderList: `${baseConfig.shopApi}/thirdPaymentRecon/${version}/getOrderListByUserId`, // 订单列表
  uploadImg: `${baseConfig.shopApi}/thirdPaymentRecon/${version}/uploadBillImg`, // 上传图片
  getVerifyCode: `${baseConfig.shopApi}/thirdPaymentRecon/${version}/getValidateImg`, // 获取图片验证码
  submitRefundOrder: `${baseConfig.shopApi}/thirdPaymentRecon/${version}/submitUserFeedback` // 提交退款信息
};

const appId = 77777;

const headers = {
  'Athena-Request-Decryption': 'disabled',
  'Athena-Response-Encryption': 'disabled'
};

// 获取支付状态
export const checkUserPayStatus = async function (params = {}) {
  params.appId = appId;
  try {
    return await request.get(urls.checkUserPayStatus, params, { headers });
  } catch (e) {
    return Promise.reject(e);
  }
};

// 获取金币包
export const getCoinAndChannel = async function (params = {}) {
  params.appId = appId;
  try {
    return await request.get(urls.getCoinAndChannel2, params, { headers });
  } catch (e) {
    return Promise.reject(e);
  }
};

// 获取限时金币包
export const checkWebUserAndGetCoinAndChannel = async function (params = {}) {
  params.appId = appId;
  try {
    return await request.get(urls.checkWebUserAndGetCoinAndChannel, params, { headers });
  } catch (e) {
    return Promise.reject(e);
  }
};

// 获取金币包
export const getCoinAndChannelOld = async function (params = {}) {
  params.appId = appId;
  try {
    return await request.get(urls.getCoinAndChannel, params, { headers });
  } catch (e) {
    return Promise.reject(e);
  }
};

// 获取国家
export const queryCountryListHot = async function (params = {}) {
  params.appId = appId;
  try {
    return await request.get(urls.queryCountryListHot, params, { headers });
  } catch (e) {
    return Promise.reject(e);
  }
};

/**
 * 新创建订单接口
 * @param param  传送body数据
 * @returns {Promise<*>}
 */
export const createOrder = async (params = {}) => {
  try {
    const uid = Cookies.get('userId');
    const messageId = localStorage.getItem('messageId') || '';
    const deviceId = Cookies.get('deviceId') || '';
    if (params.ext) {
      params.ext.traceId = `${uid}+${messageId.toString() || 0}`;
    } else {
      params.ext = {
        traceId: `${uid}+${messageId.toString() || 0}`
      };
    }
    const linkFrom = sessionStorage.getItem('linkFrom');
    const couponId = sessionStorage.getItem('couponId');

    // 如果来源是coupon,本地有couponId，就下单ext带着couponId提交
    if (linkFrom === 'coupon' && couponId && couponId !== 'undefined') {
      params.ext.couponId = couponId;
    }
    if (deviceId && deviceId !== 'undefined' && deviceId !== 0) {
      params.deviceId = deviceId;
    }
    triggerService({ eventId: '14-2-7-5', freeName2: 1 });
    const start = Date.now();
    const result = await request.post(urls.payOrder, params, { headers });
    // monitor(start, url.payOrder); // 上报接口响应时间
    triggerService({ eventId: '14-2-7-5', freeName2: 2 });
    console.log('order result', result);
    // 如果是黑名单被禁用就提示信息
    if (result.data && (Number(result.data.code) === 20001 || Number(result.data.code) === 20002)) {
      Notice({
        type: 'error',
        title: i18n.messages[i18n.locale].payChannelEnable
      });
      return true;
    }
    if (result.data && (Number(result.data.code) === 10097)) {
      Notice({
        type: 'error',
        title: 'Ops! It looks like you already used this special deal. Please check our other offers to keep the fun going!'
      });
      return true;
    }

    if (Number(result.code) === 500) {
      const title = i18n.t('shop.payFailedAndRetry');
      Notice({
        type: 'error',
        title,
        onConfirm () {
          window.location.reload();
        }
      });
      return true;
    }

    if (result.data && Number(result.data.code) === 30001) {
      const title = i18n.t('shop.subscribedTips');
      Notice({
        type: 'error',
        title,
        onConfirm () {
          window.location.reload();
        }
      });
      return true;
    }
    // 后端处理错误
    if (result.data && Number(result.data.code) === 400) {
      const title = i18n.t('shop.payInfoIncorrect');
      Notice({
        type: 'error',
        title,
        onConfirm () {
          window.location.reload();
        }
      });
      return true;
    }

    // 正常下单结果
    if (Number(result.code) === 0) {
      // triggerService({ eventId: '14-1-1-80', freeName2: `${result.data.orderId}+${result.data.txnId}`, freeName1: `${params.channelName}+${params.thirdPaymentChannelCode}` });
      return result.data;
    } else {
      Notice({
        type: 'error',
        title: result.msg
      });
      return result.data;
    }
  } catch (e) {

  }
};

/**
 * 获取可用银行列表
 */
export const getBankListByCountry = async (params = {}) => {
  params.appId = appId;
  try {
    const { data } = await request.get(urls.paymentMethod, { params }, { headers });
    // eslint-disable-next-line no-mixed-operators
    const list = data.countries && data.countries[0] && data.countries[0].issuers || [];
    return list;
  } catch (e) {
  }
};

/**
 * 查询订单详情结果接口
 * @returns {Promise<*>}
 * @param params
 */
export const getOrderInfo = async (params, query = {}) => {
  // params.appId = appId;
  try {
    const { data } = await request.get(`${urls.getOrderInfo}/${params}`, query, { headers });
    return data;
  } catch (e) {

  }
};

/**
 * 获取用户支付快捷方式列表
 * @returns {Promise<*>}
 * @param params
 */
export const getUserCardList = async (params) => {
  try {
    const apiUrl = urls.userCard + params.userId + '/cardList';
    if (params.userId) {
      delete params.userId;
    }
    const { data } = await request.get(apiUrl, params, { headers });
    return data;
  } catch (e) {
  }
};

/**
 * 删除用户支付快捷方式
 * @returns {Promise<*>}
 * @param params
 */
export const deleteUserCard = async (params) => {
  try {
    const apiUrl = urls.userCard + params.userId + '/deleteCard';
    const { data } = await request.post(apiUrl, params, { headers });
    return data;
  } catch (e) {
  }
};

/**
 * 根据平台、渠道查询填写过的form信息
 */
export const findPayExtParams = async (params) => {
  try {
    const loginToken = Cookies.get('loginToken');
    if (!loginToken) return;
    const { data } = await request.get(`${urls.getPayExtParams}`, params, { headers });
    return data;
  } catch (e) {

  }
};

/**
 * 查询订单列表
 * @returns {Promise<*>}
 * @param params
 */
export const getOrderListByUserId = async (params) => {
  try {
    const { data } = await request.get(`${urls.getOrderList}/${params}`, {}, { headers });
    return data;
  } catch (e) {
  }
};

/**
 *  获取图片验证码
 * @return {Promise<*>}
 */
export const getVerifyCode = async (params) => {
  try {
    const { data } = await request.get(urls.getVerifyCode, params, { headers });
    return data;
  } catch (e) {
  }
};
/**
*  获取图片验证码
* @return {Promise<*>}
*/
export const submitRefundOrder = async (params) => {
  try {
    const { data } = await request.post(urls.submitRefundOrder, params, { headers });
    return data;
  } catch (e) {
  }
};

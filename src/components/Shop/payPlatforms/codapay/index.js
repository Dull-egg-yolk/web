/*
 codaPay支付
 */
import store from '@/store/index';
import { createOrder } from '@/api/shop';
import { trigger, openOtherPayUrl } from '@/util/shop';
const orderUrl = baseConfig.env === 'prod' ? 'https://airtime.codapayments.com/airtime/begin' : 'https://sandbox.codapayments.com/airtime/begin';

let _submitFlag = false;
export default {
  async pay (params) {
    console.log(params, '---渠道传来的数据-----');
    this._dispatch(params);
    return Promise.resolve();
  },

  /**
     * 调度各方法
     * @private
     */
  async _dispatch (params) {
    this._orderPay(params);
  },

  /**
     * 获取渠道需要填字段
     */
  getFields () {
    let fields = {};
    // 表单字段
    fields = {
      name: {
        required: true
      },
      phone: {
        required: true
      }
    };
    return fields;
  },

  /**
     * @param params
     * @param hasDepend
     * @returns {Promise<void>}
     * @private
     */
  async _orderPay (params, hasDepend) {
    try {
      if (_submitFlag) {
        return;
      }
      _submitFlag = true;
      params.appId = store.state.app.appId;
      params.platformType = store.state.app.platformType;
      const result = await createOrder(params);
      _submitFlag = false;
      if (result && result.txnId) {
        var url = orderUrl + '?type=3&browser_type=mobile-web&txn_id=' + result.txnId;
        openOtherPayUrl(url);
      } else {
        trigger('order fail', {
          result: result
        });
      }
    } catch (e) {
    }
  },

  /**
     * 提交到服务器
     * @private
     */
  async handleSubmit (data) {
    if (_submitFlag) {
      return;
    }
    _submitFlag = true;

    // codapay 的订阅包渠道 payCompanyCode 是 codapay-subscription
    data.companyCode = data.companyCode + '-' + data.payChannel;
    data.ext.redirect = true; // 标识流程为同步还是异步
    data.ext.userAccount = data.ext.name;
    data.ext.userPhoneNumber = data.ext.phone;

    data.appId = store.state.app.appId;
    data.platformType = store.state.app.platformType;
    const result = await createOrder(data);

    _submitFlag = false;
    return result;
  },
};

import { createOrder } from '@/api/shop';
import router from '@/router';
import { trigger, triggerService, openOtherPayUrl, getCallbackUrl } from '@/util/shop';
import loading from '../../spin/loading';

let _submitFlag = false;

/**
 * 创建订单函数
 * @param data
 */
const subHandler = function (data = {}, callback) {
  const option = Object.assign({}, data);
  loading.show();
  // 创建订单
  createOrder(option)
    .then(data => {
      // 卡下单超时或失败
      if (data.orderId && !data.ext) {
        window.location.replace(`${window.location.origin}/payRes?OrderId=${data.orderId}&isLoop=1`);
        return false;
      }
      loading.hide();
      // 下单成功，跳转到三方
      if (data.orderId && data.ext && data.ext.requestUrl) {
        trigger('payermax redirect');
        triggerService({ eventId: '14-1-1-81', freeName1: `${option.channelName}+${option.thirdPaymentChannelCode}` });
        openOtherPayUrl(data.ext.requestUrl);
      }
    })
    .catch(() => {
      _submitFlag = false;
      loading.hide();
    })
    .finally(() => {
      loading.hide();
    });
};
export default {
  _data: null, // 传送过来的数据
  /**
     * 入口介入方法
     * @param data 传递的数据
     * @param hasDepend  是否有依赖
     * @returns {Promise<default>}
     */
  async pay (data, hasDepend) {
    this._data = data;
    this.goPay(data);
    return Promise.resolve(true);
  },
  goPay (data) {
    this.handleSubmit(data);
  },
  /**
     * 获取渠道需要填字段
     */
  getFields () {
    return {
    };
  },
  /**
     * 提交
     * @private
     */
  async handleSubmit (data) {
    if (_submitFlag) {
      return;
    }
    _submitFlag = true;
    const { completePaymentUrl } = getCallbackUrl();
    data.ext = data.ext || {};
    data.ext.completePaymentUrl = `${completePaymentUrl}&isLoop=1`;
    this._data = data;
    triggerService({ eventId: '14-2-4-2', freeName1: data.channelName });
    subHandler(data, result => {
    });
  },
  /**
     * 去表单页面
     * @private
     */
  _goForm (data, hasDepend) {
    router.push({
      name: 'paymentInfoAdd',
      query: {
        ...data,
        useCommonForm: false, // 是否使用公共form
        formSource: 'payermax',
        formComponentName: 'payermax',
        hasDepend: false
      }
    });
  }
};

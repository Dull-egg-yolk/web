import { createOrder } from '@/api/shop';
import Notice from '../../notice';
import { openOtherPayUrl, getCallbackUrl } from '@/util/shop';
import i18n from '@/i18n';
import Spin from '../../spin/spin';
import loading from '../../spin/loading';
let _submitFlag = false;

export default {
  async pay (params, hasDepend) {
    this._dispatch(params, hasDepend);
    return Promise.resolve(true);
  },
  /**
     * 调度各方法
     * @private
     */
  async _dispatch (data, hasDepend) {
    this._orderPay(data);
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
      const { completePaymentUrl, errorPaymentUrl } = getCallbackUrl();
      params.ext = {
        completePaymentUrl,
        errorPaymentUrl
      };

      _submitFlag = true;
      loading.show();
      const data = await createOrder(params);
      loading.hide();
      _submitFlag = false;
      //   trigger('giropay order response');
      if (data && data.ext && data.ext.data._links.redirect.href) {
        // trigger('giropay go redirect url');
        openOtherPayUrl(data.ext.data._links.redirect.href);
      } else {
        Notice.error({ title: i18n.t('payChannelEnable') });
      }
    } catch (e) {
    }
  }
};

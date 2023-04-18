import Spin from '../spin/spin';
/**
 * 所有的支付平台异步加载引入
 */
const pays = {
  giropay: () => import('./giropay'),
  ideal: () => import('./ideal'),
  checkout: () => import('./checkout'),
  payermax: () => import('./payermax'),
  codapay: () => import('./codapay'),
};

// 命令模式-》命令接受者
/**
 * 选择支付平台
 * @param payType
 * @param data
 */
export const choosePay = function (payType, data, hasDepand = false) {
  return new Promise((resolve, reject) => {
    pays[payType]().then(obj => {
      resolve(obj.default);
      if (hasDepand === false) {
        setTimeout(() => {
          Spin.hide();
        }, 2000);
      }
      obj.default.pay(data, hasDepand); // 命令执行者, 是否有依赖
    }).catch(err => {
      reject(err);
      console.log(err);
    });
  });
};

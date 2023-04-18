import { getBaseUrl } from '@/util/index';
import { logReport } from '@/util/logReport';
import { getBrowser, getPlatformType } from '@/util/browser';

// 日期格式化
// eslint-disable-next-line no-extend-native
Date.prototype.format = function (format) {
  var date = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S+': this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1
        ? date[k] : ('00' + date[k]).substr(('' + date[k]).length));
    }
  }
  return format;
};

export const toGlobal = function (countryCode = '') {
  if (!countryCode) return;

  const counties = ['IR', 'SY', 'TW', 'CN', 'SG'];
  if (counties.indexOf(countryCode) !== -1) {
    return 'GL';
  }
  return countryCode;
};

export function urlToObj () {
  const rst = Object.create(null);
  let search = location.search;
  if (!search || search.length < 2) return rst;
  search = search.slice(1);
  const arr = search.split('&');
  arr.length && arr.forEach(v => {
    const _v = v.split('=');
    rst[_v[0]] ? (rst[_v[0]] = [].concat(rst[_v[0], _v[1]])) : (rst[_v[0]] = _v[1]); // eslint-disable-line
  });
  return rst;
}

/**
 * 数字添加千分位
 * @param number
 * @param sign
 * @returns {string}
 */
export const formatPrice = function (number, sign = ',') {
  const parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, sign);
  return parts.join('.');
};

/**
 * 检测图片是否存在
 * @param url
 */
export const imageIsExist = function (url) {
  return new Promise((resolve) => {
    let img = new Image();
    img.onload = function () {
      if (this.complete === true) {
        resolve(true);
        img = null;
      }
    };
    img.onerror = function () {
      resolve(false);
      img = null;
    };
    img.src = url;
  });
};

/**
 * 保留任意位小数
 * @param number
 * @param precision
 * @returns {string}
 */
export const toDecimal = function (number, precision = 2) {
  const temp = number;
  number = Number(number);
  // 判断是否为数字，不是数字抛出异常
  if (Number.isNaN(number)) {
    console.log('无效的数字:' + temp);
    throw new Error('无效的数字:' + temp);
  }

  number = String(number);
  const numbers = number.split('.');
  // 如果不是小数，补充对应的0
  if (numbers.length === 1) {
    return number + '.' + '0'.repeat(precision);
  } else {
    // 如果是小数 但位数比要保留的位数少 也是要补0
    if (numbers[1].length < precision) {
      return number + '0'.repeat(precision - numbers[1].length);
    } else {
      // 取整数部分
      let intNumber = parseInt(number.split('.')[0]);
      // 取小数部分
      const decimal = number.split('.')[1];
      // 取出要保留的小数
      let frontDecimal = parseInt(decimal.substr(0, precision));
      // 去除要保留小数的后一位
      const lastDecimal = parseInt(decimal.substr(precision, 1));
      // 如果最后以为大于5 就进位
      if (lastDecimal >= 5) {
        frontDecimal += 1;
      }
      // 判断小数部位是否需要进位 类似于19.996 保留2位小数 就是20.00
      if (frontDecimal === Math.pow(10, precision)) {
        frontDecimal = '0'.repeat(precision);
        intNumber += 1;
      }
      // 处理 0.015 0.009 保留的小数中有0出现的情况
      frontDecimal = '0'.repeat(precision - String(frontDecimal).length) + frontDecimal;

      return `${intNumber}.${frontDecimal}`;
    }
  }
};

export const getPaymentUrl = (userInfo, historyLen, isNewPay) => {
  if (isGoNewShopCountry() && getPlatformType() === 'mobile') {
    return `${window.location.origin}/shop?isIframe=1`;
  }
  const config = {};
  const rlen = historyLen || history.length;
  config.userInfo = JSON.stringify(userInfo);
  var uObj = urlToObj();
  if (isNewPay) {
    config.countryCode = uObj.country;
    config.channelCode = uObj.channelCode;
    config.channelIndex = uObj.channelIndex;
    config.currentCoin = uObj.currentCoin;

    config.currentCoinId = uObj.currentCoinId;
    config.coinChannelCode = uObj.coinChannelCode;

    config.isNewPay = true;
  }
  config.rlen = rlen;
  const paymentUrl = getBaseUrl(baseConfig.paymentUrl, config);
  return paymentUrl;
};

export const createHiddenInput = (field = {}) => {
  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', field.name);
  hiddenInput.setAttribute('value', field.value);
  return hiddenInput;
};

export const handlePostMessageForm = (formData) => {
  const eximbay = document.getElementById(formData.id);
  if (!eximbay) {
    const form = document.createElement('form');
    const fields = formData.fields;
    form.setAttribute('id', formData.id);
    form.setAttribute('method', formData.method);
    form.setAttribute('action', formData.action);
    // 创建并设置name-value
    for (const key in fields) {
      const val = fields[key];
      if (val) {
        const field = {
          name: key,
          value: val
        };
        form.appendChild(createHiddenInput(field));
      }
    }
    document.body.appendChild(form);
    form.submit();
    setTimeout(() => {
      document.body.removeChild(form);
    }, 0);
  }
};
export const getCallbackUrl = () => {
  const rlen = +localStorage.getItem('rlen');
  var uObj = urlToObj();
  const completePaymentUrl = `${window.location.origin}/payRes?isBack=true&rlen=${rlen}${uObj && uObj.isIframe ? '&isIframe=1' : ''}`;
  const errorPaymentUrl = `${window.location.origin}/payRes?isBack=true&rlen=${rlen}${uObj && uObj.isIframe ? '&isIframe=1' : ''}`;
  return {
    completePaymentUrl,
    errorPaymentUrl,
  };
};

/**
 * 打开三方支付页
 */
export const openOtherPayUrl = (url) => {
  window.location.href = url;
};

/**
 * 转换为十进制数字金额
 * @param s 数字
 * @returns {number}
 */
export const rmoney = function (s) {
  // eslint-disable-next-line no-useless-escape
  return parseFloat(s.replace(/[^\d\.-]/g, '')).toFixed(2);
};

/**
 * validate userId、 otherId 互换
 * @param number
 * @returns {Number}
 */
export const getSubtractio = (num) => {
  const d = 99999999 - parseInt(num);
  return d < 0 ? (d & 4294967295) >>> 0 : d;
};

export const trigger = () => {

};

export const triggerService = ({ eventId, ...other }) => {
  logReport({ eventId, freeName2: { ...other } });
};

/**
 *  加入三方SDK及资源
 * @param d document
 * @param s tagName
 * @param id SDK id
 * @param url SDK url
 * @param cb 回调函数
 * @return {Promise<any>}
 */
export const importThirdUri = function (d, s, id, url, cb = () => {}) {
  return new Promise((resolve, reject) => {
    // 如果已经创建过脚本就直接返回
    if (d.getElementById(id)) {
      resolve(true);
      return;
    }

    // 创建脚本
    const js = d.createElement(s);
    const fjs = d.getElementsByTagName(s)[0]; // 脚本的父级也就是底部插入是body
    if (s === 'script') {
      js.id = id;
      js.src = url;
    }
    if (s === 'link') {
      js.rel = 'stylesheet';
      js.href = url;
    }
    fjs.parentNode.insertBefore(js, fjs); // 追加元素
    js.onload = () => {
      console.log('加载成功');
      cb();
      resolve(true);
    };
  });
};

export const formatZero = function (num, len) {
  if (String(num).length > len) return num;
  return (Array(len).join(0) + num).slice(-len);
};

/**
 * 字符串的中划线格式转驼峰格式，eg：hello-world => helloWorld
 * @param s
 * @returns {*}
 */
export const line2Hump = function line2Hump (s) {
  return s.replace(/-(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
};

/**
 * validate Email
 * @param Email
 * @returns {boolean}
 */
export const getEmailVerify = (Email) => {
  // const reg = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/gi
  const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  return reg.test(Email);
};

export const isGoNewShopCountry = () => {
  // return false;
  const ab = localStorage.getItem('RC_USER_COUNTRY_CODE');
  const selCountryCode = toGlobal(ab);
  return ['AT', 'AU', 'BE', 'CA', 'CH', 'DE', 'DK', 'ES', 'FI', 'FR', 'GB', 'IE', 'IL', 'IT', 'NL', 'PT', 'SE', 'US'].includes(selCountryCode);
};

// 根据国家过滤渠道
export const filterChannel = (selCountryCode, channelList) => {
  const ret = [];
  channelList.forEach(c => {
    if (selCountryCode === 'SA') { // 沙特
      if (c.channelName !== 'MADA' && c.payCompanyCode === 'checkout') {
        ret.push(c);
      }
      if (c.payCompanyCode === 'payermax' && c.thirdPaymentChannelCode === 'STCPAY') {
        ret.push(c);
      }
    } else {
      if (c.payCompanyCode === 'checkout') {
        ret.push(c);
      }
    }
    if (getBrowser() === 'Safari' && getPlatformType() === 'mobile' && c.payCompanyCode === 'payermax' && c.thirdPaymentChannelCode === 'APPLEPAY') {
      ret.push(c);
    }
  });
  return ret;
};

export const getPrice = (price, percent) => {
  let ret = price;
  if (!percent) {
    return ret;
  }
  try {
    var p = percent.replace('%', '') / 100;
    ret = Math.fround(price / (1 - p)).toFixed(1);
  } catch (e) {}
  return ret;
};

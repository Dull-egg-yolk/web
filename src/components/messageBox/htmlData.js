import { isGoNewShopCountry } from '@/util/shop';
import store from '@/store';

// 头次设备检查提示
export const getFirstDeviceTips = () => {
  const info = window.$mObj.vm.$t('webChat.accessMicrophoneCamera');
  return `
  <div class="pop-firstDeviceCheck">
    <div class="img-box">
    </div>
    <div class="txt">${info}</div>
  </div>
  `;
};

// 设备权限异常提示
export const getDeviceErrorTips = (deviceList) => {
  let iconHtml = '';
  const blockArr = [0, 0];
  let errTxt = '';

  if (deviceList.includes('camera')) {
    iconHtml += '<span class="icon-camera"></span>';
    blockArr[0] = 1;
  }

  if (/microphones|speakers/.test(deviceList)) {
    iconHtml += '<span class="icon-mic"></span>';
    blockArr[1] = 1;
  }
  if (blockArr[0] && blockArr[1]) {
    errTxt = window.$mObj.vm.$t('webChat.accessMicrophoneCamera');
  } else if (blockArr[0]) {
    errTxt = window.$mObj.vm.$t('webChat.accessCamera');
  } else if (blockArr[1]) {
    errTxt = window.$mObj.vm.$t('webChat.accessMicrophone');
  }

  return `
  <div class="pop-device-error">
    <div class="img-box">
    ${iconHtml}
    </div>
    <div class="txt">${errTxt}</div>
  </div>
  `;
};

// 优惠包
export const getDiscountCoin = () => {
  // eslint-disable-next-line
  if (1 === 1) {
    return;
  }
  if (!isGoNewShopCountry()) {
    return;
  }
  const disCoinConf = store.state.app.disCoinConf;
  console.log(disCoinConf, '--金币包--disCoinConf------');
  const { id, totalCoinNum, minPrice, currencyMark } = disCoinConf.coin;
  const { coinCode } = disCoinConf.channel;
  if (!id || !coinCode) return null;
  const txt = window.$mObj.vm.$t('webChat.discountCoinOnce');
  const off = window.$mObj.vm.$t('webChat.xxoff', { num: 80 });
  const con = `
  <div class="coin-discount-pop">
    <div class="discount-img">
      <div class="dis-off-box"><span class="dis-off-txt">${off}</span></div>
      <div class="dis-price">${currencyMark}${minPrice}</div>
    </div>
    <div class="discount-txt">${txt}</div>
  </div>
  `;
  return {
    con,
    totalCoinNum,
    ...disCoinConf
  };
};

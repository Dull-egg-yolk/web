import { decodeMessage, parseShowMsg } from '@/util/process';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';

// 根据生日算年龄
export const calculateAge = (timestamp) => {
  const times = new Date().getTime() - new Date(timestamp).getTime();
  const years = Math.floor(times / 1000 / (3600 * 24 * 365));
  return years;
};

export const year = (timestamp) => {
  const n = Number(timestamp);
  if (!Number(timestamp)) return '';
  return new Date(n).getFullYear();
};

export const month = (timestamp) => {
  const n = Number(timestamp);
  if (!Number(timestamp)) return '';
  return new Date(n).getMonth() + 1;
};

export const day = (timestamp) => {
  const n = Number(timestamp);
  if (!Number(timestamp)) return '';
  return new Date(n).getDate();
};

// uid 和 otherId 互换；
export const otherIdFilter = (num) => {
  const d = 99999999 - parseInt(num);
  return d < 0 ? (d & 4294967295) >>> 0 : d;
};

export const endeUserId = (num, type) => {
  if (type === 'decode') {
    const id = Base64.parse(num);
    const id2 = JSON.parse(Utf8.stringify(id));
    const id3 = otherIdFilter(id2);
    return id3;
  } else {
    const id = otherIdFilter(num);
    const id2 = Utf8.parse(JSON.stringify(id));
    return Base64.stringify(id2);
  }
};

export const decrypt = (msg, position) => {
  const { content, userName = '' } = msg;
  const jsonMsg = decodeMessage(content);

  const { type, html } = parseShowMsg(jsonMsg);
  // console.log(type, html, '--type, html-----');
  if (position === 'list' && ['gift', 'img'].includes(type)) {
    return html.type;
  }
  const txt = html.source;
  if (type === 'txt') {
    return html.translation || html.source;
  }
  return txt && txt.replace('{friendName}', userName);
};

export const thumbImg = (imgUrl) => {
  if (/d36ywu50ghf221|d6d3wha0hetk7/.test(imgUrl)) {
    imgUrl = imgUrl.replace('d36ywu50ghf221', 'dy5h05bw5go7o');
    imgUrl = imgUrl.replace('d6d3wha0hetk7', 'd16snpg4zscvzn');
    imgUrl += '?d=360x480';
    return imgUrl;
  }
  return imgUrl;
};

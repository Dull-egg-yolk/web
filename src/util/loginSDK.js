const lang = navigator.language;

// 插入SDK
const insertSDK = (id, url) => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return false;
    }
    const sdkScript = document.createElement('script');
    sdkScript.src = url;
    sdkScript.id = id;
    document.body.appendChild(sdkScript);
    sdkScript.addEventListener('load', () => {
      console.log('load', id);
      resolve();
    });
    sdkScript.addEventListener('error', (e) => {
      console.log('err', id);
      reject(e);
    });
  });
};

// facebook sdk 插入
export const insertFacebookSdk = () => {
  const url = `https://connect.facebook.net/${lang}/sdk.js`;
  return insertSDK('facebookSDK', url);
};

// google sdk 插入
export const insertGoogleSdk = () => {
  const url = 'https://accounts.google.com/gsi/client';
  return insertSDK('googleSDK', url);
};

// apple sdk 插入
export const insertAppleSdk = () => {
  const url = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
  return insertSDK('appleSDK', url);
};

import Jsencrypt from 'jsencrypt';

import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import ECB from 'crypto-js/mode-ecb';
import Pkcs7 from 'crypto-js/pad-pkcs7';
import DES from 'crypto-js/tripledes';

import { randomWord } from '@/util/index';

export const encryptRsa = new Jsencrypt();
encryptRsa.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCBbVgtk5NbmuFHN6s1nguKZ+fQOcRZWODMpNRWm34kggR7TJB+Ltz4O8btRaYYnuvM/dEb3DaVRbttWfBHvC1rg/LWMx1hcD3/nocpe91o3FoxSok7FYnXav/ls6YgiUR/8KnX3jVFExWfseAkToPE7HFUZBNikNXUFo5oLE7NbwIDAQAB');

export const decryptRsa = new Jsencrypt();
decryptRsa.setPrivateKey('MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAKWu0HB/CeX+Dy10VwWzH/QISjEZN/AfYp90y/+QHHCZr5h5K5VK5VBxzvgh7Wem6zHVU8QZ56K//V8Klk/6oVKl/A0OzyGpx3wl9D3gnuKjAUe86FLgAOVASDa/OAqrQL0d5cWOmSIuHc5ZmVQpUPlbiGwdsJM/sBEm2RUhQl0ZAgMBAAECgYA8Dp4n6SThZbKCu4U/36pZfxfFrGqGdBn/ywqXXNmyR0NLdcDCoR92hYqMj1/LDsp6ieWPVASPDiD97oyF+Ue4ZAZ+oIHzjcH1NceZD8d28YmhXnyg92Dtse0I4f5Hn7s/KM/unrc7grnOvzZXRpnxFlmJfI1MhUaXDE+FNVbfcQJBAN64U1ym2/1lle7qlVpPY4MH7B2nVMy4ylGWYeCkZPKtetktMYBAwHGmFUHS9CmHpgaLcc84w8jCTN154SuuA48CQQC+cKe7YCKs4iXBIxpJAntdLUSaUYHu4XX7d6caPjItngEByfSrLxs9FBd7StpHEZ2kRd6yZfQTc8bBZC/P3KDXAkAxWRQXbl1GCxEqi82l4ftBmCrH80CFz9f8Nd7gAGzhnHCg2DOkoDRDujHxkMVKwmSWBKWl7YTr4alYVV3/6KGfAkA7+3u5NuR1E53UoVvMFy4IARQUjwuf0/+3Ps6xI1nmqFek2plnuaSYrlVfDgqGS/QdI6yrABXKcrLtgsLUc6dtAkBrOVTWS5R14/VMWf3GLCx15clKAfqMNmrje+4YwaetzW8au+pydzPhnejsInKaaDJkihznQzlKgCwCcfCXw8xf');

export const encryptRsaEmail = new Jsencrypt();
encryptRsaEmail.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCp7BCCDU4wkozPFvau143NvdGGAqWbOuY/eeJyX6g0o/rUtK3T2XaZEpKGNQTU/RlyQ31FeRASPEOXRJrLYju0gIpEMAhNbvpwlSDwA+T/28LxuNo919+g1YEho9ER9fzVukOrUHRp9shb8BN+WIekrxh2Zs0YSZEYXI5OocN1JwIDAQAB');

const decryptByDes = function (ciphertext, key) {
  const keyHex = Utf8.parse(key);
  // direct decrypt ciphertext
  const decrypted = DES.decrypt({
    ciphertext: Base64.parse(ciphertext)
  }, keyHex, {
    mode: ECB,
    padding: Pkcs7
  });

  return decrypted.toString(Utf8);
};

const encryptByDes = function (message, key) {
  const keyHex = Utf8.parse(key);
  if (typeof message === 'object') {
    message = JSON.stringify(message);
  }
  const encrypted = DES.encrypt(message, keyHex, {
    mode: ECB,
    padding: Pkcs7
  });
  return encrypted.toString();
};

export const decryptData = function (data) {
  if (!data.key || !data.data) {
    return {
      code: 6666,
      error: '数据不合法'
    };
  }
  return decryptByDes(data.data.replace(/(?:\\[rn]|[\r\n]+)+/g, ''), decryptRsa.decrypt(data.key));
};

export const encryptData = function (data) {
  const key = randomWord(false, 8);
  return {
    data: encryptByDes(data, key),
    key: encryptRsa.encrypt(key)
  };
};

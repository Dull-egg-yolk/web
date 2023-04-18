import { apiGetCountryId } from '@/api/user';
import { logReport } from '@/util/logReport';
export const getCountry = function (res, option = {}) {
  apiGetCountryId().then(({ code, data = {} }) => {
    if (code !== 200 || !data) return;
    const { id, ab, ip } = data;
    localStorage.setItem('RC_USER_COUNTRY', id);
    localStorage.setItem('RC_USER_COUNTRY_CODE', ab);
    localStorage.setItem('RC_USER_IP', ip);
    logReport({
      eventId: '106-6-1-0',
      countryId: localStorage.getItem('RC_USER_COUNTRY'),
      free_name2: Object.assign({
        from: res
      }, window.$mObj.adData || {}),
    });
  });
};

export default {
  getCountry
};

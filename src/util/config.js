export const allowCountryList = ['tr', 'gb', 'nl'];

export const getUrlCountry = () => {
  const pArr = window.location.pathname.split('/');
  if (allowCountryList.includes(pArr[1])) {
    return pArr[1];
  }
  return '';
};

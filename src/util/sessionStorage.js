/* eslint-disable class-methods-use-this */
export default class _SessionStorage {
  getItem (key, json = false) {
    let rst;
    try {
      rst = sessionStorage.getItem(key);
      if (json) rst = JSON.parse(rst);
    } catch (e) {
      return false;
    }
    return rst;
  }

  setItem (key, val, json = true) {
    try {
      sessionStorage.setItem(key, json ? JSON.stringify(val) : val);
    } catch (e) {
      return false;
    }
    return true;
  }

  clear () {
    try {
      sessionStorage.clear();
    } catch (e) {
      return false;
    }
    return true;
  }

  removeItem (key) {
    let rst;
    try {
      rst = sessionStorage.removeItem(key);
    } catch (e) {
      return false;
    }
    return rst;
  }
}

/* eslint-disable class-methods-use-this */
export default class _LocalStorage {
  getItem (key, json = false) {
    let rst;
    try {
      rst = localStorage.getItem(key);
      if (json) rst = JSON.parse(rst);
    } catch (e) {
      return false;
    }
    return rst;
  }

  setItem (key, val, json = true) {
    try {
      localStorage.setItem(key, json ? JSON.stringify(val) : val);
    } catch (e) {
      return false;
    }
    return true;
  }

  clear () {
    try {
      localStorage.clear();
    } catch (e) {
      return false;
    }
    return true;
  }

  removeItem (key) {
    let rst;
    try {
      rst = localStorage.removeItem(key);
    } catch (e) {
      return false;
    }
    return rst;
  }
}

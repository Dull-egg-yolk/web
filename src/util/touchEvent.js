/**
 * 来自 https://github.com/hangjob/touchEvent/blob/main/touchEvent.js
 */

/***
 @name:触屏事件
 @param {string} element dom元素
 {function} fn 事件触发函数
 ***/
function vOn (obj, ev, fn) {
  if (obj.attachEvent) {
    obj.attachEvent('on' + ev, fn);
  } else {
    obj.addEventListener(ev, fn, false);
  }
}
export const touchEvent = {
  /* 长按事件 */
  longTap: function (element, fn) {
    var startTx, startTy, lTapTimer;
    vOn(element, 'touchstart', function (e) {
      if (lTapTimer) {
        clearTimeout(lTapTimer);
        lTapTimer = null;
      }
      var touches = e.touches[0];
      startTx = touches.clientX;
      startTy = touches.clientY;
      lTapTimer = setTimeout(function () {
        fn(startTx, startTy);
      }, 1000);
      // e.preventDefault();
    }, false);
    vOn(element, 'touchmove', function (e) {
      var touches = e.touches[0];
      var endTx = touches.clientX;
      var endTy = touches.clientY;
      if (lTapTimer && (Math.abs(endTx - startTx) > 5 || Math.abs(endTy - startTy) > 5)) {
        clearTimeout(lTapTimer);
        lTapTimer = null;
      }
    }, false);
    vOn(element, 'touchend', function (e) {
      if (lTapTimer) {
        clearTimeout(lTapTimer);
        lTapTimer = null;
      }
    }, false);
  },

  /* 滑屏事件 */
  swipe: function (element, fn) {
    var isTouchMove, startTx, startTy;
    vOn(element, 'touchstart', function (e) {
      var touches = e.touches[0];
      startTx = touches.clientX;
      startTy = touches.clientY;
      isTouchMove = false;
    }, false);
    vOn(element, 'touchmove', function (e) {
      isTouchMove = true;
      e.preventDefault();
    }, false);
    vOn(element, 'touchend', function (e) {
      if (!isTouchMove) {
        return;
      }
      var touches = e.changedTouches[0];
      var endTx = touches.clientX;
      var endTy = touches.clientY;
      var distanceX = startTx - endTx;
      var distanceY = startTy - endTy;
      var isSwipe = false;
      console.log(distanceX, distanceY, '----distanceX, distanceY-----');
      if (Math.abs(distanceX) > 20 || Math.abs(distanceY) > 20) {
        fn(distanceX, distanceY);
      }
    }, false);
  }
};

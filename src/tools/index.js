// 全屏
export const fullScreen = () => {
  const docElm = document.documentElement;
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen();
    return true;
  }
  if (docElm.msRequestFullscreen) {
    docElm.msRequestFullscreen();
    return true;
  }
  if (docElm.mozRequestFullScreen) {
    docElm.mozRequestFullScreen();
    return true;
  }
  if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen();
    return true;
  }
  return false;
};

// 退出全屏
export const cancelFullScreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  }
};

// 检测是否全屏
export const checkFullScreen = () =>
  document.mozFullScreen ||
  document.fullScreen ||
  document.webkitIsFullScreen ||
  document.webkitRequestFullScreen ||
  document.mozRequestFullScreen ||
  document.msFullscreenEnabled;

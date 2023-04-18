class JSLoading {
  constructor () {
    var html = `
          <div class="rc-spin-view" id="jsLoading">
          <div class="warp">
              <svg viewBox="25 25 50 50" class="ich-circular">
                  <circle cx="50" cy="50" r="20" fill="none" stroke="#fff" stroke-width="5" stroke-miterlimit="10" class="ich-load-loop"></circle>
              </svg>
          </div>
      </div>
      <style scoped>
              .rc-spin-view { position: fixed;width: 100%;height: 100%; z-index: 1012; background: rgba(0, 0, 0, .7);top: 0;left: 0;}
              .rc-spin-view .warp {left: 50%;top: 50%;width: 50px;height: 50px;transform: translate(-50%, -50%); position: fixed;}
              .rc-spin-white { z-index: 1012;background: rgba(255, 255, 255, .1); position: absolute}
  
              .ich-circular {animation: loading 2s linear infinite}
              .ich-load-loop {stroke-dasharray: 1, 200;stroke-dashoffset: 0;-webkit-animation: ani-load-loop 1.5s ease-in-out infinite;animation: ani-load-loop 1.5s ease-in-out infinite;stroke-linecap: round;}
              @keyframes loading {
                  to {
                      -webkit-transform: rotate(1turn);
                      transform: rotate(1turn)
                  }
              }
              @keyframes ani-load-loop {
                  0% {
                      stroke-dasharray: 1, 200;
                      stroke-dashoffset: 0
                  }
  
                  50% {
                      stroke-dasharray: 89, 200;
                      stroke-dashoffset: -35
                  }
  
                  to {
                      stroke-dasharray: 89, 200;
                      stroke-dashoffset: -124
                  }
              }
  
              </style>
          `;
    if (!document.getElementById('jsLoading')) {
      var node = document.createElement('div');
      node.innerHTML = html;
      node.id = 'jsLoading';
      document.body.appendChild(node);
    }
    this.jSLoadingNode = document.getElementById('jsLoading');
    this.jSLoadingNode.style.display = 'none';
  }

  show () {
    this.jSLoadingNode.style.display = 'block';
  }

  hide () {
    setTimeout(() => {
      this.jSLoadingNode.style.display = 'none';
    }, 100);
  }
}
var obj = new JSLoading();
export default {
  show () {
    obj.show();
  },
  hide () {
    obj.hide();
  }
};

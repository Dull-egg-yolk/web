import Vue from 'vue';
import Content from './spinSvg';

let newSpin, vm, el;

function getSpinInstance (type, options) {
  let desc;
  if (typeof options === 'string') {
    desc = options;
  }
  const VueSpin = Vue.extend({
    data () {
      return {
        type: type,
        desc: desc
      };
    },
    // template:`<div class="rc-ui-mask rc-spin"><div class="rc-spin-warp">${Content}</div></div>`
    template: `<div class="rc-ui-mask http-loading"><div class="svg-style">${Content}</div></div>`
  });
  if (newSpin) return; // 禁止重复创建
  newSpin = new VueSpin();
  vm = newSpin.$mount();
  el = vm.$el;
  document.body.appendChild(el);
}

function remove () {
  if (el) document.body.removeChild(el); // 从body中移除dom
  if (newSpin) newSpin.$destroy();
  newSpin = null;
  vm = null; // 设置为null，好让js垃圾回收算法回收，释放内存
  el = null;
}

export default {
  name: 'Spin',

  show (options) {
    if (options instanceof Object) return;
    this.spin('show', options);
  },
  hide (options) {
    if (options || options === '') return;
    remove();
  },
  spin (type, options) {
    getSpinInstance(type, options);
  }
};

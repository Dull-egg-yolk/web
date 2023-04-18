import Vue from 'vue';
const preventReClick = Vue.directive('preventReClick', {
  inserted: function (el, binding, vNode, oldVnode) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true;
        setTimeout(() => {
          el.disabled = false;
        }, 2000);
      }
    });
  }
});

export default {
  preventReClick
};

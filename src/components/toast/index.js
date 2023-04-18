import Vue from 'vue';
import toastVue from './index.vue';

let instance = null;
const MessageConstructor = Vue.extend(toastVue);
MessageConstructor.prototype.close = function () {
  if (this.$el && this.$el.parentNode) {
    this.$el.parentNode.removeChild(this.$el);
    this.$destroy();
  }
  this.mshow = false;
};

const Toast = function (options) {
  if (Vue.prototype.$isServer) return;
  const config = {
    mshow: false,
    html: '',
    time: 3000
  };
  return new Promise((resolve, reject) => {
    // eslint-disable-line
    if (!instance) {
      instance = new MessageConstructor({
        data: options,
      });
    }

    Object.assign(config, options);

    for (const prop in config) {
      // eslint-disable-line
      if (Object.prototype.hasOwnProperty.call(config, prop)) {
        instance[prop] = config[prop];
      }
    }
    instance.resolve = resolve;
    instance.reject = reject;
    instance.mshow = true;
    instance.$mount();
    document.body.appendChild(instance.$el);
  });
};

export default Toast;

import Vue from 'vue';
import msgVue from './index.vue';

let instance = null;
const MessageConstructor = Vue.extend(msgVue);
MessageConstructor.prototype.close = function () {
  if (this.$el && this.$el.parentNode) {
    this.$el.parentNode.removeChild(this.$el);
    this.$destroy();
  }
  this.mshow = false;
};

const MessageBox = function (options) {
  if (Vue.prototype.$isServer) return;
  const config = {
    activeAffirm: true,
    isReversal: false,
    mshow: false,
    html: '',
    confirmBtnTxt: window.$mObj.vm.$t('base.confirm'), // '确认',
    cancelBtnTxt: window.$mObj.vm.$t('base.cancel'), //  '取消',
    title: '',
    desc: {},
    noBtn: false,
    noCancelBtn: true,
    noConfirmBtn: false,
    noOutClick: false,
    showCloseIcon: false,
    className: '',
    longBtn: false
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
    window.curMsgPop = instance;
  });
};

export default MessageBox;

<template>
    <transition enter-active-class="rc-animate-slide-up" leave-active-class="rc-animate-slide-down">
        <div class="rc-popup" v-show="visible" :style="style">
            <div class="rc-mask" v-if="mask" @click.stop="$emit('on-close')"></div>
            <i class="close-btn rc-close-gray popup-close" @click.stop="$emit('on-close')"></i>
            <slot></slot>
        </div>
    </transition>
</template>

<script>

export default {
  name: 'popup',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    mask: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: ''
    },
  },
  data () {
    return {};
  },
  computed: {
    style () {
      const ret = {};
      if (/^\d+$/.test(this.height)) {
        ret.height = parseInt(this.height) + 'px';
      } else {
        ret.height = this.height;
      }
      return ret;
    }
  },
  methods: {}
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .rc-popup {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        z-index: 1000;
        background-color: #ffffff;
        border-top-left-radius: .2rem;
        border-top-right-radius: .2rem;
        .popup-close {
            position: absolute;
            top:  12px;
            right: 12px;
            z-index: 99;
        }
        .rc-close-gray {
            width: 18px;
            height: 18px;
            background-image: url(~@/assets/img/shop/Icon/rc-close-gray.svg);
        }
    }
    .rc-mask {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0px;
        left: 0px;
        z-index: -1;
        background: rgba(0, 0, 0, 0.7);
    }
</style>

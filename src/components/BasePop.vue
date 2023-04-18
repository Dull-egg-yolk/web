<template>
  <transition
    enter-active-class="show"
    leave-active-class="hide"
    :duration="{ enter: 300, leave: 300 }"
  >
    <div v-if="show" class="base-popup">
      <div class="pop-content" name="pop-content" v-clickoutside:click="outClickHandler" @click.stop="outclick">
        <slot></slot>
      </div>
      <div class="pop-bg" v-if="hasBg && show" @click.stop="cancelPop"></div>
    </div>
  </transition>
</template>

<script>
import Clickoutside from '@/util/clickoutside.js';

export default {
  name: 'BasePopup',
  data () {
    return {
      show: false,
    };
  },
  directives: { Clickoutside },
  props: {
    hasBg: {
      type: Boolean,
      default: true,
    },
    showPop: {
      type: [Boolean, Object],
      default: false,
    },
    outClickCancel: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    showPop (v, o) {
      this.show = v;
    },
  },
  methods: {
    cancelPop () {
      if (this.outClickCancel) return;
      this.$emit('cancelPop');
    },
    outClickHandler () {
      if (this.outClickCancel) return;
      this.$emit('cancelPop');
    },
    outclick () {
      this.$emit('outClik');
    }
  },
  mounted () {
    console.log(this.showPop, '-----pop--');
    if (this.showPop) {
      setTimeout(() => {
        this.show = true;
      }, 0);
    }
  },
};
</script>

<style lang="less">
.base-popup {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  left: 0;
  top: 0;
  z-index: 240;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .pop-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1;
    background: rgba(0, 0, 0, 0.6);
    transition: opacity 0.2s;
  }

  .pop-content {
    position: relative;
    z-index: 10;
    transform-origin: center;
  }
  &.show {
    .pop-content {
      animation: showPop 0.3s both;
    }
    .pop-bg {
      opacity: 1;
    }
  }
  &.hide {
    .pop-content {
      animation: hidePop 0.3s both;
    }
    .pop-bg {
      opacity: 0;
    }
  }
}

</style>

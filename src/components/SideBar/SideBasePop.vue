<template>
  <transition name="sidePop">
    <div class="side-pop" :class="type" v-if="switchState" @click.stop>
      <div class="inner">
        <slot></slot>
        <!-- <span class="arrow"></span> -->
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SidePop',
  data () {
    return {};
  },
  props: {
    switchState: {
      type: Boolean,
      default: false,
    },
    bottomPos: {
      type: Number,
      default: 0,
    },
    type: String
  },
  methods: {
    switchChange (val) {
      this.$emit('switchControl', val);
    },
  },
};
</script>

<style lang="less" scoped>
.side-pop {
  position: fixed;
  z-index: 20;
  height: 100%;
  pointer-events: none;
  overflow:hidden;

  &.down {
    width: 100%;
    left: 0;
    top: 0;
    box-sizing:border-box;
    padding:30px 20px 30px 125px;
  }

  &.profile{
    top:0;
    left:0px;
    width: 500px;
  }

  .inner {
    pointer-events: all;
    height: 100%;
    position: relative;
  }
}

.sidePop-enter-active,
.sidePop-leave-active {
  transition: all 0.2s;
}
.sidePop-enter,
.sidePop-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@media screen and(max-width: 680px) {

  #app{
  .side-pop {
    position: fixed;
    left: 0 !important;
    top: 0;
    width: 100%;
    height: 100%;
    bottom: 0 !important;
    padding: 0;
    .arrow {
      display: none;
    }
    &::after {
      display: none;
    }
    .inner {
      border-radius: 0;
      width: 100%;
      height: 100%;
      min-height: 100%;
    }
  }

  }
}
</style>

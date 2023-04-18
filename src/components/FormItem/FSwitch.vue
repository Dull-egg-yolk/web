<template>
  <div class="f-switch" :class="{ checked: checked }" @click="changeVal">
    <div class="core">
      <span class="point"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FSwitch',
  data () {
    return {};
  },
  props: {
    value: {
      type: [Boolean, String, Number],
      default: false
    },
    lock: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    checked () {
      return !!this.value;
    }
  },
  methods: {
    changeVal () {
      if (this.lock) return;
      this.$emit('input', !this.checked);
      this.$emit('change', !this.checked);
    }
  },
  mounted () {}
};
</script>

<style lang="less" scoped>
@import url('~@/style/var.less');
.f-switch {
  display: inline-block;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  &.checked {
    .core {
      background: linear-gradient(135deg, #FF78FF 0%, #32E5FF 100%);
      .point {
        left: 0;
        margin-left: 20px;
      }
    }
  }
  .core {
    width: 40px;
    height: 22px;
    background: @cgray-2;
    border-radius: 40px;
    position: relative;
    transition: background-color 0.3s;
    .point {
      transition: all 0.3s;
      position: absolute;
      margin-left: -40px;
      left: 100%;
      top: 1px;
      width: 20px;
      height: 20px;
      background: #fff;
      border-radius: 100%;
    }
  }
}
</style>

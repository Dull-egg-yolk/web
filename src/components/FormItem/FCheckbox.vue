<template>
  <div
    class="f-checkbox fx-ic"
    :class="{ checked: checked }"
    @click="changeVal"
  >
    <span class="icon-right"></span>
  </div>
</template>

<script>
export default {
  name: 'FCheckbox',
  data () {
    return {};
  },
  props: {
    value: {
      type: [Boolean, String, Number],
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
      this.$emit('input', !this.checked);
      this.$emit('change', !this.checked);
    }
  },
  mounted () {}
};
</script>

<style lang="less" scoped>
@import url('~@/style/var.less');
.f-checkbox {
  cursor: pointer;
  overflow: hidden;
  width: 20px;
  height: 20px;
  border: solid 1px @cgray-10;
  border-radius: 50%;
  font-size: 12px;
  transition: all 0.3s;
  .icon-right {
    display: inline-block;
    font-size: 12px;
    transform-origin: center;
    transform: scale(0);
    font-weight: bold;
    transition: all 0.2s;
    color: #fff;
  }

  &.checked {
    background: @cblue-1;
    border-color: @cblue-1;
    .icon-right {
      transform: scale(0.75);
    }
  }
}
</style>

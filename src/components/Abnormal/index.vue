<template>
  <div class="abnormal-box">
    <div class="the-icon" :class="[`img-${type}`]"></div>
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'Abnormal',
  data () {
    return {
    };
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: ''
    }
  },
  mounted () {
  },
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>

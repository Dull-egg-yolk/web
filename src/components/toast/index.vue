<template>
<transition name="slideUp">
  <div class="rc-toast" v-if="mshow">
    <div class="toast-inner">
      <div class="txt" v-html="html"></div>
    </div>
  </div>
</transition>
</template>

<script>

export default {
  name: 'messageBox',
  data () {
    return {
      mshow: false,
      html: '',
      time: 3000
    };
  },
  methods: {
  },
  mounted () {
    setTimeout(() => {
      this.mshow = false;
    }, this.time);
  }
};
</script>

<style lang="less" scoped>
.rc-toast {
  position: fixed;
  top:50%;
  left:0;
  right: 0;
  z-index:300;
  transform: translateY(-50%);
  max-width: 75%;
  margin: 0 auto;
  width: fit-content;

  .toast-inner{
    color:#fff;
    padding: 10px 16px;
    font-size:14px;
    background:rgba(0,0,0,.7);
    border-radius: 20px;
    border:solid 1px rgba(0,0,0,.6);
    white-space: inherit;
    word-wrap: break-word;
    line-height:1.5;
    text-align: center;
  }
}

</style>

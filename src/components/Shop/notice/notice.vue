<template>
<transition name="slideUp">
  <div class="rc-notice-msg" v-if="mshow">
    <div class="notice-inner">
      <div class="txt">
        <div :class="['type-img', type]" v-html="imgMap[type]"></div>
        <div class="info" v-html="title"></div>
        <div class="btn">
          <span @click="handleOk">{{desc}}</span>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>

const imgMap = {
  success: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 176 176" width="50px" height="50px"><g><circle cx="88" cy="88" r="88" class=\'print-bg\'></circle></g><g class="line1"><line x1="41" y1="83" x2="76" y2="122" stroke-linecap="round" style="stroke:rgb(255,255,255);stroke-width:14"/></g><g class="line2"><line x1="77" y1="121" x2="133" y2="58" stroke-linecap="round"  style="stroke:rgb(255,255,255);stroke-width:14"/></g></svg>',
  error: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 176 176" width="50px" height="50px"><g><circle cx="88" cy="88" r="88" class=\'print-bg\'></circle></g><g class="line2"><line x1="58" y1="58" x2="118" y2="117" stroke-linecap="round" style="stroke:rgb(255,255,255);stroke-width:14"/></g><g class="line3"><line  x1="118" y1="58" x2="58" y2="117" stroke-linecap="round"  style="stroke:rgb(255,255,255);stroke-width:14"/></g></svg>'
};

export default {
  name: 'messageBox',
  data () {
    return {
      mshow: false,
      html: '',
      type: 'success',
      desc: 'Ok',
      imgMap
    };
  },
  methods: {
    handleOk () {
      this.mshow = false;
      if (typeof this.onConfirm === 'function') {
        this.onConfirm();
      }
    }
  },
  mounted () {

  }
};
</script>

<style lang="less">
.rc-notice-msg {
  position: fixed;
  top:0;
  left:0;
  right: 0;
  bottom:0;
  z-index:300;
  width: 100%;
  margin: 0 auto;
  background:rgba(0,0,0,.8);
  display: flex;
  justify-content: center;
  align-items: center;
  >.notice-inner{
    color:#fff;
    width: 86%;
    font-size:14px;
    border-radius:6px;
    color: #000;
    background: #fff;
    white-space: inherit;
    word-wrap: break-word;
    text-align: center;
    .txt {
      padding: 10px;
      .info {
        color: #333;
        font-size: 13px;
        line-height: 20px;
        padding: 10px 0px;
      }
      .error {
          .print-bg {
            fill: #ff3535;
          }
        }
      .btn {
        text-align: center;
        span {
          height: 40px;
          line-height: 40px;
          width: 80%;
          color: #fff;
          display: inline-block;
          background: #38c20a;
          border-radius: 20px;
        }
      }
    }
  }
}
</style>

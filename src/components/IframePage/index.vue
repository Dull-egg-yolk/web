<template>
  <div class="iframe-page">
    <!-- mobile 给移动端的页面title -->
    <div class="mb-title flex-row-vc">
      <div class="actions l fx-c">
        <span class="icon-arrow" @click.stop="closeBtn"></span>
      </div>
      <div class="title l fx-v">
        <slot name="title"></slot>
      </div>
      <div class="actions r fx-c">
      </div>
    </div>
    <span class="btn-back hover" @click.stop="closeBtn">
      <span class="icon-cross"></span>
    </span>
    <div class="inner">
      <iframe id="iframe" :src="iframeUrl" frameborder="0" allow="payment" ref="paymentIframe"></iframe>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { setBodyScroll } from '@/util/index';

export default {
  name: 'IframePage',
  components: {},
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
    }),
  },
  data () {
    return {

    };
  },
  props: {
    iframeUrl: {
      type: String,
      default: ''
    }
  },
  watch: {

  },
  methods: {
    receiveMessage (self) {
      return function (event) {
        self.$emit('pageMessage', event.data);
      };
    },
    closeBtn () {
      this.$router.go(-1);
    },

  },
  async mounted () {
    if (this.isLogin) {

    }
    this.receiveMessageHandler = this.receiveMessage(this);
    window.addEventListener('message', this.receiveMessageHandler, false);

    setBodyScroll(true);
  },

  beforeDestroy () {
    setBodyScroll(false);
    window.removeEventListener('message', this.receiveMessageHandler);
  },
};
</script>

<style lang="less" scoped>
.iframe-page {
  max-width: 540px;
  height: 100%;
  position: relative;
  margin: 0 auto;

  .inner {
    height: 100%;

    iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }
  }

  .btn-back {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 16px;
    // background: linear-gradient(138deg, #a425ff, #6a14ff 55%, #6b10ff);
    background: rgba(0, 0, 0, 0.4);
    border-radius: 0 0 0 50%;
  }

}
[lang="ar"],
  [lang="he"],
  [lang="ur"] {
.iframe-page  .btn-back{
    left: 0;
    right: auto;
  }
}
::-webkit-scrollbar {
  display: none;
}

@media screen and(min-width: 820px) {
  .iframe-page {
    max-width: 820px;
    height: 100%;
    width: 100%;

    iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }
  }
}

@media screen and(max-width: 680px) {
  .iframe-page {
    position: fixed;
    height: 100%;
    z-index: 120;
    width: 100%;
    display: flex;
    flex-direction: column;

    .inner {
      flex: 1;
      height: 100%;
      overflow: auto;
      background: #17161f;
      font-size: 0;
    }

    .btn-back {
      display: none;
    }

  }

  [lang="ar"],
  [lang="he"],
  [lang="ur"] {}

}
</style>

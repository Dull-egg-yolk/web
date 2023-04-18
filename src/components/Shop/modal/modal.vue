<template>
    <div class="rc-transfer-dom" v-if="visible">
        <div class="rc-ui-mask" @click="handleMask"></div>
        <div class="rc-modal-fix" :style="styles">
            <div class="rc-ui-warp rc-pulsein" :class="className">
                <slot name="attachment">
                </slot>
                <a class="warp-close" @click="onCancel">
                    <slot name="close">
                      <i class="rc-icon rc-close-gray"></i>
                    </slot>
                </a>
                <div class="modal-header" v-if="showHead">
                    <slot name="header">
                        <div class="modal-title">
                            <h2 class="modal-title-name">{{ title }}</h2>
                            <HeaderSvg/>
                        </div>
                    </slot>
                </div>
                <div class="modal-box warp-layout">
                    <div class="modal-icon" v-if="iconShow">
                        <Icon type="rc-lovu-name"></Icon>
                    </div>
                    <slot></slot>
                </div>
                <div class="modal-footer" v-if="!footerHide">
                    <slot name="footer">
                        <div class="warp-layout">
                            <div class="warp-btn">
                                <Button class="purple" type="purple" @click="onOk">{{ okText }}</Button>
                            </div>
                        </div>
                    </slot>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import HeaderSvg from './headerSvg';

export default {
  name: 'Modal',
  components: { HeaderSvg },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    footerHide: {
      type: [Boolean, String],
      default: false
    },
    okText: {
      type: String,
      default: 'ok'
    },
    styles: {
      type: Object
    },
    iconShow: {
      type: Boolean,
      default: false
    },
    className: {
      type: String
    }
  },
  data () {
    return {
      visible: this.value,
      showHead: true
    };
  },
  methods: {
    handleMask () {
      // this.visible = false;
      this.$emit('maskEvent');
    },
    close () {
      this.visible = false;
      this.$emit('input', false);
    },
    onCancel () {
      this.close();
      this.$emit('on-cancel');
    },
    onOk () {
      this.$emit('on-ok');
    }
  },
  mounted () {
    let showHead = true;
    if (this.$slots.header === undefined && !this.title) {
      showHead = false;
    }
    this.showHead = showHead;
  },
  watch: {
    value (val) {
      this.visible = val;
    }
  }
};
</script>

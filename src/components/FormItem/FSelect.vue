<template>
  <div class="f-select" :class="{ disabled: disabled }" v-clickoutside:click="cancelExtend">
    <div
      class="select-body"
      :class="{ extend: showOption }"
      @click="showHandler(!showOption)"
    >
      <div class="show-txt" :class="{ init: !curVal }">
        {{ showTxt || showVal }}
      </div>
      <span class="ico icon-drop-down"></span>
    </div>
    <!-- options -->
    <transition name="slideDown">
      <div class="select-options" v-if="showOption" ref="optionList">
        <div
          class="option"
          v-for="(item, index) in options"
          :key="index"
          :class="{ selected: +curVal === (item.value || item) }"
          @click="changeVal(item)"
        >
          {{ item.txt || item }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Clickoutside from '@/util/clickoutside.js';

export default {
  name: 'FSelect',
  data () {
    return {
      curVal: '',
      showOption: false,
    };
  },
  directives: { Clickoutside },
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    options: {
      type: [Array, String],
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showTxt: [String, Number],
  },
  watch: {
    showOption (v) {
      if (v) {
        this.scrollToSelected();
      }
    },
    value (n, o) {
      if (n !== this.curVal) {
        this.curVal = n;
      }
    }
  },
  computed: {
    showVal () {
      const showItem = this.options.filter((item) => {
        if (+this.curVal === (item.value || item)) {
          return item;
        }
      })[0];

      if (showItem) {
        return showItem.txt || showItem;
      }

      return this.placeholder;
    },
  },
  methods: {
    changeVal (item) {
      const val = item.value || item;
      this.curVal = val;
      this.$emit('input', val);
      this.$emit('change', val);
      this.showOption = false;
    },
    scrollToSelected () {
      this.$nextTick(() => {
        const optionDom = this.$refs.optionList;
        const curDom = optionDom.querySelector('.selected');
        if (!curDom) {
          optionDom.scrollTo(0, 0);
          return;
        }
        const topPos = curDom.offsetTop;
        if (topPos > optionDom.clientHeight - 20) {
          optionDom.scrollTo(0, topPos - optionDom.clientHeight / 2);
        }
      });
    },
    cancelExtend () {
      this.showOption = false;
    },
    showHandler (val) {
      if (this.disabled) return;
      this.showOption = val;
    },
  },
  mounted () {
    this.curVal = this.value || this.showTxt;
  },
};
</script>

<style lang="less" scoped>
@import url('~@/style/var.less');
.f-select {
  user-select: none;
  display: inline-block;
  height: 36px;
  background: @cgray-1;
  border-radius: 100px;
  padding: 0 5px 0 15px;
  box-sizing: border-box;
  position: relative;
  z-index: 10;
  font-size:14px;
  text-align:left;
  &.disabled {
    .select-body .ico {
      color: @cgray-2;
    }
  }

  .select-body {
    display: inline-flex;
    height: 100%;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    min-width: 70px;
    white-space: nowrap;
    .show-txt {
      flex: 1;
      &.init {
        color: @cgray-8;
      }
    }
    .ico {
      font-size: 12px;
      transform: rotate(0) scale(0.55);
      color: @cblue-1;
      transition: all 0.4s;
      transform-origin: center;
    }
    &.extend {
      .ico {
        transform: rotate(180deg) scale(0.55);
      }
    }
  }
  .select-options {
    position: absolute;
    width: 100%;
    max-height: 120px;
    overflow: auto;
    background: #fff;
    border-radius: 8px;
    left: 0;
    top: 36px;
    font-size:12px;
    box-shadow: -3px 2px 14px 0px rgba(0, 0, 0, 0.2);
    .option {
      height: 30px;
      padding: 0 20px;
      line-height: 30px;
      border-bottom: solid 1px @cgray-7;
      cursor: pointer;
      transition: all 0.4s;
      &:hover {
        background: @cgray-1;
      }
      &.selected {
        color: #fff;
        background: @cblue-1;
      }
    }
  }
}
</style>

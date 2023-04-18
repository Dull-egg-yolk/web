<template>
    <div
        v-clickoutside:touchstart="swipeMove"
        @click="swipeMove()"
        @touchstart="startDrag"
        @touchmove="onDrag"
        @touchend="endDrag"
        class="rc-cell-swipe"
    >
        <div class="rc-cell-left" ref="left">
            <slot name="left" class="rc-buttongroup">
                <a
                    class="rc-button"
                    v-for="(btn, index) in left"
                    :key="index"
                    :style="btn.style"
                    @click.prevent.stop="btn.handler && btn.handler(), swipeMove()"
                    v-html="btn.content"
                ></a>
            </slot>
        </div>
        <div class="rc-cell-wrapper" ref="cell">
            <slot></slot>
        </div>
        <div class="rc-cell-right" ref="right">
            <div class="rc-buttongroup">
                <a
                    class="rc-button"
                    v-for="(btn, index) in right"
                    :key="index"
                    :style="btn.style"
                    @click.prevent.stop="btn.handler && btn.handler(), swipeMove()"
                    v-html="btn.content"
                ></a>
            </div>
        </div>
    </div>
</template>

<script>
import { once } from '@/util/dom.js';
import Clickoutside from '@/util/clickoutside.js';
/**
 * rc-cell-swipe  https://mint-ui.github.io/docs/#/en2/cell-swipe
 * @desc 类似 iOS 滑动 Cell 的效果
 * @module components/cell-swipe
 *
 * @example
 * <rc-cell-swipe
 *   :left=[
 *     {
 *       content: 'text',
 *       style: {color: 'white', backgroundColor: 'red'},
 *       handler(e) => console.log(123)
 *     }
 *   ]
 *   :right=[{ content: 'allowed HTML' }]>
 *   swipe me
 * </rc-cell-swipe>
 */
export default {
  name: 'rc-cell-swipe',
  directives: { Clickoutside },
  components: {
  },
  props: {
    to: String,
    left: Array,
    right: Array,
    icon: String,
    title: String,
    label: String,
    isLink: Boolean,
    value: {}
  },
  data () {
    return {
      start: { x: 0, y: 0 }
    };
  },
  mounted () {
    this.wrap = this.$refs.cell;
    this.leftElm = this.$refs.left;
    this.rightElm = this.$refs.right;
    this.leftWrapElm = this.leftElm;
    this.rightWrapElm = this.rightElm;
    this.leftWidth = this.leftElm.getBoundingClientRect().width;
    this.rightWidth = this.rightElm.getBoundingClientRect().width;
    this.leftDefaultTransform = this.translate3d(-this.leftWidth - 1);
    this.rightDefaultTransform = this.translate3d(this.rightWidth);
    console.log(this.rightDefaultTransform, '-----right----');

    this.rightWrapElm.style.webkitTransform = this.rightDefaultTransform;
    this.leftWrapElm.style.webkitTransform = this.leftDefaultTransform;
  },
  methods: {
    resetSwipeStatus () {
      this.swiping = false;
      this.opened = true;
      this.offsetLeft = 0;
    },
    translate3d (offset) {
      return `translate3d(${offset}px, 0, 0)`;
    },
    setAnimations (val) {
      this.wrap.style.transitionDuration = val;
      this.rightWrapElm.style.transitionDuration = val;
      this.leftWrapElm.style.transitionDuration = val;
    },
    swipeMove (offset = 0) {
      this.wrap.style.webkitTransform = this.translate3d(offset);
      this.rightWrapElm.style.webkitTransform = this.translate3d(
        this.rightWidth + offset
      );
      this.leftWrapElm.style.webkitTransform = this.translate3d(
        -this.leftWidth + offset
      );
      offset && (this.swiping = true);
    },
    swipeLeaveTransition (direction) {
      setTimeout(() => {
        this.swipeLeave = true;
        // left
        if (direction > 0 && -this.offsetLeft > this.rightWidth * 0.4) {
          this.swipeMove(-this.rightWidth);
          this.resetSwipeStatus();
          return;
          // right
        } else if (
          direction < 0 &&
                    this.offsetLeft > this.leftWidth * 0.4
        ) {
          this.swipeMove(this.leftWidth);
          this.resetSwipeStatus();
          return;
        }
        this.swipeMove(0);
        once(this.wrap, 'webkitTransitionEnd', _ => {
          this.wrap.style.webkitTransform = '';
          this.rightWrapElm.style.webkitTransform = this.rightDefaultTransform;
          this.leftWrapElm.style.webkitTransform = this.leftDefaultTransform;
          this.swipeLeave = false;
          this.swiping = false;
        });
      }, 0);
    },
    startDrag (evt) {
      evt = evt.changedTouches ? evt.changedTouches[0] : evt;
      this.dragging = true;
      this.start.x = evt.pageX;
      this.start.y = evt.pageY;
      this.direction = '';
    },
    onDrag (evt) {
      if (this.opened) {
        if (!this.swiping) {
          this.swipeMove(0);
          this.setAnimations('');
        }
        this.opened = false;
        return;
      }
      if (!this.dragging) return;
      let swiping;
      const e = evt.changedTouches ? evt.changedTouches[0] : evt;
      const offsetTop = e.pageY - this.start.y;
      const offsetLeft = (this.offsetLeft = e.pageX - this.start.x);
      const y = Math.abs(offsetTop);
      const x = Math.abs(offsetLeft);
      this.setAnimations('0ms');
      if (this.direction === '') {
        this.direction = x > y ? 'horizonal' : 'vertical';
      }
      if (this.direction === 'horizonal') {
        evt.preventDefault();
        evt.stopPropagation();
        swiping = !(x < 5 || (x >= 5 && y >= x * 1.73));
        if (!swiping) return;
        if (
          (offsetLeft < 0 && -offsetLeft > this.rightWidth) ||
                    (offsetLeft > 0 && offsetLeft > this.leftWidth) ||
                    (offsetLeft > 0 && !this.leftWidth) ||
                    (offsetLeft < 0 && !this.rightWidth)
        ) {
        } else {
          this.swipeMove(offsetLeft);
        }
      }
    },
    endDrag () {
      this.direction = '';
      this.setAnimations('');
      if (!this.swiping) return;
      this.swipeLeaveTransition(this.offsetLeft > 0 ? -1 : 1);
    }
  }
};
</script>

<style lang="less">
.rc-cell-swipe {
    background-color: #fff;
    box-sizing: border-box;
    color: inherit;
    min-height: 48px;
    display: block;
    overflow: hidden;
    position: relative;
    text-decoration: none;

    .rc-buttongroup {
        height: 100%;
    }
    .rc-button {
        height: 100%;
        display: flex;
        padding: 0 10px;
        line-height: 48px;
        min-width: 80px;
        text-align: center;
        align-items: center;
        justify-content: center;
    }
    .rc-cell-wrapper {
        position: relative;
        background-image: linear-gradient(
            180deg,
            #F0F0F0,
            #F0F0F0 50%,
            transparent 0
        );
        background-size: 100% 1px;
        background-repeat: no-repeat;
        background-position: 0 0;
        background-origin: content-box;
        align-items: center;
        box-sizing: border-box;
        display: flex;
        font-size: 16px;
        line-height: 1;
        min-height: inherit;
        overflow: hidden;
        padding: 0 15px;
        width: 100%;
    }
    .rc-cell-wrapper,
    .rc-cell-left,
    .rc-cell-right {
        transition: transform 150ms ease-in-out;
    }
    .rc-cell-left {
        position: absolute;
        height: 100%;
        left: 0;
        transform: translate3d(-100%,0,0);
    }
    .rc-cell-right {
        position: absolute;
        height: 100%;
        right: 0;
        top: 0;
        transform: translate3d(100%,0,0);
    }
}
</style>

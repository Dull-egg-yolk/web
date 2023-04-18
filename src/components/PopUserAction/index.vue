<template>
  <div class="pop-user-action">
    <div class="head"></div>
    <div class="inner" @click.stop>
      <div class="m-cell-list">
        <div class="ocell">
          <div class="cell-left">
            <span class="icon-edit"></span>
          </div>
          <div class="cell-main">alie</div>
        </div>
        <div class="ocell">
          <div class="cell-left">
            <span class="icon-star-line"></span>
          </div>
          <div class="cell-main">Add to favorites</div>
          <div class="cell-right">
            <span
              class="icon-star hover"
              :class="{ favored: isFavor }"
              @click="favorHandler"
            ></span>
          </div>
        </div>
        <div class="ocell">
          <div class="cell-left">
            <span class="icon-bell-line"></span>
          </div>
          <div class="cell-main">Online reminder</div>
          <div class="cell-right">
            <f-switch v-model="isRemind"></f-switch>
          </div>
        </div>
        <div class="ocell">
          <div class="cell-left">
            <span class="icon-block"></span>
          </div>
          <div class="cell-main">Block</div>
        </div>
        <div class="ocell">
          <div class="cell-left">
            <span class="icon-warn2"></span>
          </div>
          <div class="cell-main">Report</div>
        </div>
        <div class="ocell">
          <div class="cell-left">
            <span class="icon-delete"></span>
          </div>
          <div class="cell-main">Delete</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FSwitch from '@/components/FormItem/FSwitch';

export default {
  data () {
    return {
      isFavor: false,
      isRemind: false,
    };
  },
  components: {
    FSwitch,
  },
  methods: {
    favorHandler () {
      this.isFavor = !this.isFavor;
    },
    cancelUserAction () {
      this.$emit('cancelPop');
    },
  },
  mounted () {
    document.addEventListener('click', this.cancelUserAction);
  },
  destroyed () {
    document.removeEventListener('click', this.cancelUserAction);
  },
};
</script>

<style lang="less" scoped>
@import url('~@/style/var.less');
.pop-user-action {
  position: absolute;
  right: 20px;
  top: 0;
  width: 370px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  .head {
    height: 60px;
    cursor: pointer;
  }
  .inner {
    flex: 1;
    overflow: hidden;
    padding: 15px;
    border-radius:20px;

    .ocell {
      height: 60px;
      border-radius: 10px;
      .cell-left,
      .cell-right {
        text-align: center;
        font-size: 18px;
      }
      .cell-left {
        width: 20px;
      }
      .cell-right {
        width: 46px;
      }
      .icon-star {
        font-size: 18px;
        color: @cgray-2;
        &.favored {
          color: @cyellow-1;
        }
      }
      .cell-main {
        font-size: 14px;
      }
    }
  }
}

@media screen and(max-width: 680px) {
  .pop-user-action {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0;
    z-index: 10;

    .head {
      flex: 1;
    }
    .inner {
      flex: 0 0 auto;
      border-radius: 16px 16px 0 0;
      padding: 14px;
      .ocell {
        .cell-main {
          font-size: 14px;
        }
      }
    }
  }
}
</style>

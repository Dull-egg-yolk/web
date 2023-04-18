<template>
  <base-pop
    :showPop="mshow"
    v-if="mshow"
    @cancelPop="cancelHandler"
    class="pop-public"
    :class="className"
    :outClickCancel = "noOutClick"
  >
    <div class="pop-html" v-if="html" v-html="html"></div>
    <template v-else>
      <div class="pop-title" v-if="title">{{ title }}</div>
      <div class="pop-desc" v-if="desc">
        <div class="desc-title" v-if="desc.title">{{ desc.title }}</div>
        <div class="desc-txt" v-if="desc.txt">{{ desc.txt }}</div>
      </div>
    </template>
    <div class="pop-action" :class="{direction: isReversal, long: longBtn}" v-if="!noBtn">
      <div class="m-btn" :class="!activeAffirm ? 'major' : 'white'" v-if="!noCancelBtn" @click.stop="cancelHandler">
        {{ cancelBtnTxt }}
      </div>
      <div class="m-btn" :class="activeAffirm ? 'major' : 'white'" v-if="!noConfirmBtn" @click.stop="confirmHandler">
        {{ confirmBtnTxt }}
      </div>
    </div>
  </base-pop>
</template>

<script>
import BasePop from '../BasePop.vue';
import i18n from '@/i18n';

export default {
  name: 'messageBox',
  data () {
    return {
      mshow: false,
      html: '',
      confirmBtnTxt: i18n.t('base.confirm'),
      cancelBtnTxt: i18n.t('base.cancel'),
      title: '',
      desc: {},
      noBtn: false,
      noCancelBtn: true,
      noConfirmBtn: false,
      noOutClick: false,
      activeAffirm: true,
      isReversal: false,
      className: '',
      longBtn: false
    };
  },
  components: {
    BasePop,
  },
  methods: {
    cancelHandler () {
      this.close();
      this.reject();
    },
    confirmHandler () {
      this.close();
      this.resolve();
    },
  }
};
</script>

<style lang="less" scoped>
.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 35px;
}
.message-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  z-index: 200;

}
</style>

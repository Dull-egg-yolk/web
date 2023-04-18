<template>
  <base-pop class="pop-public pop-lang" :showPop="show" @cancelPop="cancelPop">
    <div class="pop-title">语言</div>
    <!-- 选择语言 -->
    <language-list
      type="multi"
      :checked="myLang"
      @change="changeLang"
    ></language-list>
    <div class="pop-action">
      <div class="m-btn major" @click="cancelPop">{{$t('base.save')}}</div>
    </div>
  </base-pop>
</template>

<script>
import BasePop from '../BasePop.vue';
import LanguageList from '../popSetup/LanguageList.vue';

export default {
  name: 'PopLanguage',
  data () {
    return {
      initVal: '',
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    myLang: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    BasePop,
    LanguageList,
  },
  computed: {},
  methods: {
    cancelPop () {
      this.$emit('cancel');
    },
    changeLang (val) {
      if (val.length) {
        const realVal = val.reduce((valArr, item) => {
          valArr.push(item.value);
          return valArr;
        }, []);
        console.log(realVal);
      }
    },
  },
  mounted () {
    this.initVal = this.inputVal;
  },
};
</script>

<style lang="less">
@import url('~@/style/var.less');

.pop-lang {
  .language-list {
    height: 240px;
    .ocell {
      .cell-main {
        font-size: 14px;
      }
    }
  }
}
@media screen and (max-width: 680px) {
  .pop-input {
    .input-box {
      padding: 2px 18px 0;
    }
  }
}
</style>

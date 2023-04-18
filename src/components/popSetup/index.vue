<template>
  <base-pop
    :showPop="!!setupStep"
    @cancelPop="cancelPop"
    class="pop-public pop-setup"
  >
    <!-- 给移动端用的页面标题 -->
    <div class="im-page-title fx-be-vc" @click.stop>

      <h2 class="title-txt">
       {{ titleTxt[setupStep] }}
      </h2>
    </div>

    <!-- 内容区域 -->
    <div class="setup-body" @click.stop>
      <transition-group name="stepAni" tag="div">
        <!-- 设置页首页 -->
        <!-- <div
          class="m-cell-list normal-list"
          key="setup-home"
          v-if="step === 'home'"
        >
          <div class="ocell lang" @click="step = 'language'">
            <div class="cell-main">语言设定</div>
            <div class="cell-right">
              <span class="cur-lang">{{ curLanguage }}</span>
              <span class="ico icon-arrow"></span>
            </div>
          </div>
          <div class="ocell" @click="step = 'notify'">
            <div class="cell-main">通知设置</div>
            <div class="cell-right">
              <span class="ico icon-arrow"></span>
            </div>
          </div>
          <div class="ocell" @click="step = 'block'">
            <div class="cell-main">黑名单</div>
            <div class="cell-right">
              <span class="ico icon-arrow"></span>
            </div>
          </div>
          <div class="ocell">
            <div class="cell-main">帮助与反馈</div>
            <div class="cell-right">
              <span class="ico icon-arrow"></span>
            </div>
          </div>
        </div> -->

        <!-- 选择语言 -->
        <language-list
          type="single"
          :checked="siteLanguage"
          @change="changeLang"
          key="setup-lang"
          v-if="setupStep === 'language'"
        ></language-list>

        <!-- 通知设置 -->
        <notify-list key="setup-notice" v-if="setupStep === 'notify'"></notify-list>

        <!-- 黑名单 -->
        <block-list key="setup-block" v-if="setupStep === 'block'"></block-list>
      </transition-group>
    </div>
  </base-pop>
</template>

<script>
import { mapState } from 'vuex';
import { loadLanguageAsync } from '@/i18n/index';
import BasePop from '../BasePop.vue';
import LanguageList from './LanguageList.vue';
import NotifyList from './NotifyList.vue';
import BlockList from './BlockList.vue';

const lang = {
  en: 'English',
  'zh-CN': 'Chinese',
};

export default {
  data () {
    return {
      list: {
        checked: false,
      },
      titleTxt: {
        home: '设置',
        language: '语言设定',
        notify: '通知设置',
        block: '黑名单',
      },
    };
  },
  components: {
    BasePop,
    LanguageList,
    NotifyList,
    BlockList,
  },
  computed: {
    ...mapState({
      siteLanguage: (state) => state.app.siteLanguage,
      setupStep: (state) => state.app.setupStep,
    }),
    curLanguage () {
      return lang[this.siteLanguage];
    },
  },
  methods: {
    backHandler () {
      this.cancelPop();
      // if (this.step === 'home') {
      //   this.cancelPop();
      // } else {
      //   this.step = 'home';
      // }
    },
    cancelPop () {
      this.$store.commit('setPopSetup', '');
    },
    /**
     * 更换网站语言
     */
    changeLang (lang) {
      loadLanguageAsync(lang);
      this.$store.commit('setSiteLanguage', lang);
    },
  },
};
</script>

<style lang="less">
@import url(./index.less);
</style>

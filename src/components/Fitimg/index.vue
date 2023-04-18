<template>
  <span class="fitImg-box test">
    <img v-if="type === 'bigimg'" :src="fitImg.bigImg || fitImg.dfImg" alt onerror="this.classList.add('fitImg-error');" @load="imgLoad"/>
    <img v-if="type === 'smailimg'" :src="fitImg.smailImg || fitImg.dfImg" alt onerror="this.classList.add('fitImg-error');" @load="imgLoad"/>
  </span>
</template>
<script>
export default {
  name: 'fitImg',
  props: {
    type: {
      type: String,
      default: 'all',
    },
    headImg: {
      type: String,
      default: '',
    }
  },
  computed: {
    fitImg () {
      if (!/.png|.jpg|.jpge/.test(this.headImg)) {
        return { dfImg: this.headImg };
      }
      if (/female|male|h5.livuchat|lcpic/.test(this.headImg)) {
        return { dfImg: this.headImg };
      }
      const smailImg = this.headImg.substring(0, this.headImg.lastIndexOf('.')) + '_112X150' + this.headImg.substring(this.headImg.lastIndexOf('.'), this.headImg.length);
      const bigImg = this.headImg.substring(0, this.headImg.lastIndexOf('.')) + '_270X360' + this.headImg.substring(this.headImg.lastIndexOf('.'), this.headImg.length);
      if (!bigImg || !smailImg) return '';
      return { smailImg, bigImg };
    },
  },
  methods: {
    imgLoad (e) {
      e.target.classList.remove('fitImg-error');
      this.$emit('imgload', e);
    },
  }
};
</script>
<style scoped lang="less">
.fitImg-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .flag {
    width: 20px;
    height: 10px;
    margin-right: 5px;
    object-fit: cover;
  }

  .fitImg-error {
    display: none;
  }
}
</style>

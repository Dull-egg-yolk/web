<template>
   <div v-if="btnFlag" class="to-top to-top-enter-done"><img class="img-top" src="@/assets/img/h5download/top.png" @click.stop="backTop"/></div>
</template>

<script>
export default {
  data () {
    return {
      btnFlag: false
    };
  },
  methods: {
    backTop () {
      const that = this;
      const timer = setInterval(() => {
        const ispeed = Math.floor(-that.scrollTop / 5);
        document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + ispeed;
        if (that.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 16);
    },
    scrollToTop () {
      const that = this;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      that.scrollTop = scrollTop;
      if (that.scrollTop > 60) {
        that.btnFlag = true;
      } else {
        that.btnFlag = false;
      }
    }
  },

  mounted () {
    window.addEventListener('scroll', this.scrollToTop);
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollToTop);
  }
};
</script>

<style>
.img-top{
  opacity: 0.6;
  width: 40px;
}
</style>

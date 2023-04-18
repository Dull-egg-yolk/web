<template>
    <div class="banned">
      <div class="banned-content">
        <img class="banned-img" src="../../assets/img/banned.png" alt />
        <p class="desc">{{$t('webChat.accountBlockedReason')}}</p>
        <button class="affirm" @click="affirm">{{this.$t('base.ok')}}</button>
      </div>
    </div>
</template>
<script>
export default {
  data () {
    return {

    };
  },
  methods: {
    affirm () {
      this.$store.commit('setShowBanned', false);
      window.location.href = '/';
    }
  }
};
</script>
<style scoped lang="less">
.banned {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(23,22,31,0.3);
  backdrop-filter: blur(13px);
  top: 0;
  left: 0;
  z-index: 10;
  .banned-content {
    width: 438px;
    margin: 30% 50%;
    background: #17161F;
    border-radius: 16px;
    transform: translate(-50%);
    padding: 102px 39px 69px;
    font-size: 16px;
    color: #fff;
    position: relative;
    .banned-img {
      position: absolute;
      width: 128px;
      top: -68px;
      left: 50%;
      transform: translate(-50%);
    }
    .desc {
      line-height: 24px;
      font-weight: bold;
    }
    .affirm {
      width: 215px;
      line-height: 70px;
      background: linear-gradient(135deg, #FF78FF 0%, #32E5FF 100%);
      border-radius: 35px;
      font-size: 24px;
      margin: 33px 0 0 111px;
      font-family: Helvetica-Bold, Helvetica;
    }
  }
}
</style>

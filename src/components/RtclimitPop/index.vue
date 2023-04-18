<template>
    <div class="rtc-limit">
      <div class="bg" @click="cancelPop"></div>
      <div class="content-box">
        <div class="the-title">{{$t('webChat.rtclimitT1')}}</div>
        <div class="intro">{{$t('webChat.rtclimitT2')}}</div>
        <div class="step-box" :class="lang">

        </div>
      </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { logReport } from '@/util/logReport';
export default {
  name: 'RtclimitPop',
  data () {
    return {
      lang: 'en'
    };
  },
  computed: {
    ...mapState({
    }),
  },

  watch: {
  },
  methods: {
    cancelPop () {
      this.$store.commit('setRTCLimit', false);
    }

  },
  mounted () {
    logReport({
      eventId: '106-1-1-61',
    });

    const l = ['en', 'ar', 'hi', 'tr', 'id', 'ms'];
    const navLang = navigator.language;
    let locale = navLang.toLocaleLowerCase();
    locale = locale.split('-');
    locale = locale[0];
    this.lang = l.includes(locale) ? locale : 'en';
  },
};
</script>

<style lang="less" scoped>

.rtc-limit{
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index:110;
  .bg{
    position:absolute;
    width:100%;
    height:100%;
    left:0;
    top:0;
    z-index: 10;
  }

  .content-box{
    position:absolute;
    width:320px;
    background:#fff;
    color:#000;
    padding:20px;
    box-sizing: border-box;
    left:50%;
    margin-left: -160px;
    top: 14px;
    border-radius: 10px;
    z-index:20;
    .the-title{
      font-size:16px;
      font-weight:bold;
    }
    &::after{
      content: '';
      width:14px;
      height:14px;
      position:absolute;
      background:#fff;
      transform: rotate(45deg);
      top:-7px;
      left:50%;
      margin-left: -7px;
      border-radius: 2px;
    }

    .step-box{
      margin-top:10px;
      width: 280px;
      height: 300px;
      background-size: 100% auto;
      background-position: center;
      background-repeat: no-repeat;
      &.en{
        background-image:url(../../assets/img/rtc-l-en.png);
      }
      &.ar{
        background-image:url(../../assets/img/rtc-l-ar.png);
      }
      &.id{
        background-image:url(../../assets/img/rtc-l-id.png);
      }
      &.tr{
        background-image:url(../../assets/img/rtc-l-tr.png);
      }
      &.ms{
        background-image:url(../../assets/img/rtc-l-ms.png);
      }
      &.hi{
        background-image:url(../../assets/img/rtc-l-hi.png);
      }

    }
  }
}

</style>

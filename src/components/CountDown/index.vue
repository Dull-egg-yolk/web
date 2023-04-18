<template>
  <div v-if="show" class="count-down">
      <span class="day" v-if="day && day!== '00'">{{day}} <i v-if="isShowDayColon" style="font-style:normal">:</i></span>
      <span v-if="hour" name="hour">{{hour}}<template v-if="showDelimiter">:</template></span>
      <span v-if="min" name="min">{{min}}<template v-if="showDelimiter">:</template></span>
      <span v-if="sec" name="sec">{{sec}}</span>
  </div>
</template>
<script>
export default {
  data () {
    return {
      day: '',
      hour: '',
      min: '',
      sec: '',
      timer: null
    };
  },
  props: {
    endTime: { type: Number, default: null },
    showTime: { type: Boolean, default: false },
    showDelimiter: { type: Boolean, default: true },
    isShowDayColon: { type: Boolean, default: true }
  },
  watch: {
    endTime: {
      immediate: true,
      handler (val) {
        if (val) {
          this.countdowm(val);
        }
      }
    },
    showTime: {
      immediate: true,
      handler (val) {
        this.show = val;
      }
    }
  },
  mounted () {
  },
  methods: {
    countdowm (timestamp) {
      this.timer = setInterval(() => {
        const nowTime = Date.now();
        const endTime = timestamp;
        const t = endTime - nowTime;
        if (t > 0) {
          let day = Math.floor(t / 86400000);
          let hour = Math.floor((t / 3600000) % 24);
          let min = Math.floor((t / 60000) % 60);
          let sec = Math.floor((t / 1000) % 60);
          day = day < 10 ? '0' + day : day;
          hour = hour < 10 ? '0' + hour : hour;
          min = min < 10 ? '0' + min : min;
          sec = sec < 10 ? '0' + sec : sec;
          this.day = day;
          this.hour = hour;
          this.min = min;
          this.sec = sec;
          this.$emit('updateCountDownData', { day, hour, min, sec });
        } else {
          clearInterval(this.timer);
          // 结束了
          this.$emit('endCountDownData');
        }
      }, 1000);
    }
  },
  beforeDestroy () {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>

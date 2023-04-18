<template>
    <div class="expire-time">
        <div v-if="(time === 0)"></div>
        <div v-else-if="(time >nowTime)">
            <count-down :endTime="time" :showTime="true"></count-down>
        </div>
        <div v-else>
            {{$t('app.xx_days', {num: time})}}
        </div>
    </div>
</template>

<script>
import CountDown from '@/components/CountDown';
import { formatTimeGup } from '@/util/index';

export default {
  name: 'ExpireTime',
  components: { CountDown },
  data () {
    return {
      nowTime: new Date().getTime(),
      oneDay: 86400000,
    };
  },
  props: {
    expireTime: {
      type: [Number, String],
      default () {
        return '';
      },
    },
  },
  computed: {
    time () {
      if (!this.expireTime) return 0;
      if (this.expireTime <= this.oneDay) {
        return (+this.expireTime + this.nowTime);
      }
      const times = formatTimeGup(this.expireTime);
      return times.days;
    }

  }
};
</script>

<style>

</style>

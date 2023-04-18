<template>
  <p class="item-time" v-if="!isHidden">
    {{ time }}
  </p>
</template>

<script>
import { chatTime } from '@/util/dayjs';

export default {
  name: 'MsgTimeItem',
  data () {
    return {};
  },
  props: {
    list: {
      type: Array,
      default () {
        return [];
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    time () {
      const item = this.list[this.index];

      const str = chatTime(item.timestamp);

      return str;
    },
    isHidden () {
      if (this.index < 1) return false;
      const item1 = this.list[this.index - 1];
      const item2 = this.list[this.index];
      return item2.timestamp - item1.timestamp < 1000 * 60 * 5;
    }
  }

};

</script>

<style lang="less" scoped>
.item-time {
  text-align: center;
  margin-bottom: 5px;
}
</style>

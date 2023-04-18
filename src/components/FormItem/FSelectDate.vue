<template>
  <div class="f-select-date" :class="{ flex: flex }">
    <f-select v-model="year" :options="yearList" :disabled="disabled"></f-select>
    <f-select v-model="month" :options="monthList" :disabled="disabled"></f-select>
    <f-select v-model="day" :options="dayList" :disabled="disabled"></f-select>
  </div>
</template>

<script>
import FSelect from './FSelect.vue';
export default {
  name: 'FSelectDate',
  data () {
    return {
      year: '',
      month: '',
      day: '',
      time: ''
    };
  },
  components: {
    FSelect,
  },
  watch: {
    date (n, o) {
      if (n && n !== this.time) {
        this.resetVal();
      }
    }
  },
  props: {
    date: [String, Number],
    flex: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    resetVal () {
      const date = new Date(this.date);
      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;
      this.day = date.getDate();
    }
  },
  computed: {
    yearList () {
      const curYear = new Date().getFullYear();
      const list = [];
      for (let i = curYear - 18; i >= 1930; i--) {
        list.push(i);
      }
      return list;
    },
    monthList () {
      const list = [];
      for (let i = 1; i <= 12; i++) {
        list.push(i);
      }
      return list;
    },
    dayList () {
      const totalDay = new Date(this.year, this.month, 0).getDate();
      const list = [];
      for (let i = 1; i <= totalDay; i++) {
        list.push(i);
      }
      return list;
    },
  },
  updated () {
    if (this.year && this.month && this.day) {
      const newDate = new Date(this.year, this.month - 1, this.day).getTime();
      this.time = newDate;
      if (newDate !== this.date) {
        this.$emit('update:date', newDate);
      }
    }
  },
  mounted () {
    if (this.date) {
      this.resetVal();
    }
  }
};

</script>

<style lang="less" scoped>
@import url("~@/style/var.less");
.f-select-date {
  display: flex;
  align-items: center;

  &.flex {
    justify-content: space-between;
  }
  /deep/.f-select {
    height: 48px;
    margin-right: 10px;
    .select-body {
      width: 80px;
    }
  }
}
</style>

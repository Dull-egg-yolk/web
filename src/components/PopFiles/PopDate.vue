<template>
  <base-pop class="pop-public pop-date" :showPop="show" @cancelPop="cancelPop">
    <div class="pop-title">{{$t('app.profile_birthday')}}</div>
    <div class="select-list fx-c">
      <f-select v-model="initVal[0]" :options="yearList"></f-select>
      <f-select v-model="initVal[1]" :options="monthList"></f-select>
      <f-select v-model="initVal[2]" :options="dayList"></f-select>
    </div>
    <div class="pop-action">
      <div class="m-btn major" @click="cancelPop">{{$t('base.confirm')}}</div>
    </div>
  </base-pop>
</template>

<script>
import BasePop from '../BasePop.vue';
import FSelect from '../FormItem/FSelect.vue';

export default {
  name: 'PopDate',
  data () {
    return {
      initVal: [2001, 1, 22],
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    inputVal: String,
  },
  components: {
    BasePop,
    FSelect,
  },

  computed: {
    yearList () {
      const curYear = new Date().getFullYear();
      const list = [];
      for (let i = curYear - 16; i >= 1930; i--) {
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
      const totalDay = new Date(this.initVal[0], this.initVal[1], 0).getDate();
      const list = [];
      for (let i = 1; i <= totalDay; i++) {
        list.push(i);
      }
      return list;
    },
  },
  methods: {
    cancelPop () {
      this.$emit('cancel');
    },
  },
  mounted () {
  },
};
</script>

<style lang="less" scoped>
@import url('~@/style/var.less');
.pop-date {
  .select-list {
    padding: 20px 24px 0;
    .f-select{
      margin:0 2px;
    }
  }
}
@media screen and (max-width: 680px) {
  .pop-date {
    .select-list {
      padding: 20px 0 0;
    }
  }
}
</style>

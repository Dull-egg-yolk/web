<template>
  <div class="m-cell-list white normal-list">
    <div class="ocell" v-for="(item,index) in list" :key="item.value">
      <div class="cell-main">
        {{item.name}}
      </div>
      <div class="cell-right">
        <f-switch :value="item.open" @change="changHandler(index)"></f-switch>
      </div>
    </div>
  </div>
</template>

<script>
import FSwitch from '../FormItem/FSwitch.vue';

export default {
  name: 'NotifyList',
  data () {
    return {
      list: [
        {
          name: '新消息提醒',
          value: 'new',
          open: true,
        }, {
          name: '视频消息提醒',
          value: 'video',
          open: true,
        }, {
          name: '新Like消息提醒',
          value: 'like',
          open: false,
        },
      ],
    };
  },
  components: {
    FSwitch,
  },
  methods: {
    changHandler (index) {
      const curItem = this.list[index];
      console.log(curItem);
    },
  },

};
</script>

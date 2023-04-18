<template>
  <div class="m-cell-list white language-list">
    <div
      class="ocell"
      v-for="(item, index) in langList"
      :key="index"
      @click="checkHandler(index)"
    >
      <div class="cell-main">{{ item.name }}</div>
      <div class="cell-right">
        <f-checkbox :value="item.checked"></f-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
import FCheckbox from '../FormItem/FCheckbox.vue';

const languages = [
  {
    name: 'English',
    value: 'en',
  },
  {
    name: 'Chinese',
    value: 'zh-CN',
  }, {
    name: 'Japan',
    value: 'jp',
  }, {
    name: 'Japan',
    value: 'jp',
  }, {
    name: 'Japan',
    value: 'jp',
  }, {
    name: 'Japan',
    value: 'jp',
  }, {
    name: 'Japan',
    value: 'jp',
  }, {
    name: 'Japan',
    value: 'jp',
  }, {
    name: 'Japan',
    value: 'jp',
  }, {
    name: 'Japan',
    value: 'jp',
  }, {
    name: 'Japan',
    value: 'jp',
  }, {
    name: 'Japan',
    value: 'jp',
  }, {
    name: 'Japan',
    value: 'jp',
  }, {
    name: 'Japan',
    value: 'jp',
  }, {
    name: 'Japan',
    value: 'jp',
  },
];

export default {
  data () {
    return {
      langList: [],
    };
  },
  props: {
    // 语言选择 单选 or 多选  single multi 默认为多选
    type: {
      type: String,
      default: 'multi',
    },
    checked: {
      type: [String, Array],
      default: () => [],
    },
  },
  components: {
    FCheckbox,
  },
  methods: {
    checkHandler (index) {
      if (this.type === 'multi') {
        // 多选
        const curItem = this.langList[index];
        curItem.checked = !curItem.checked;
        // 传值
        const curChecked = this.langList.filter((item) => item.checked);
        if (curChecked.length) {
          this.$emit('change', curChecked);
        }
      } else {
        // 单选
        this.langList.forEach((item, itemIndex) => {
          if (index === itemIndex) {
            if (!item.checked) {
              item.checked = true;
              this.$emit('change', item.value);
            }
          } else {
            item.checked = false;
          }
        });
      }
    },
  },
  mounted () {
    // 处理数据
    const checkedItems = typeof this.checked === 'string' ? [this.checked] : [...this.checked];
    this.langList = languages.map((item) => {
      item.checked = checkedItems.includes(item.value);
      return item;
    });
  },
};
</script>
<style lang="less" scoped>
.language-list {
    overflow:scroll;
  .ocell {
    height: 50px;
    padding: 0 20px 0 14px;
  }
}
</style>

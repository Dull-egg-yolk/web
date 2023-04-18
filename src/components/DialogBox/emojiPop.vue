<template>
  <div class="emoji-list" v-clickoutside:click="cancel">
    <span
      v-for="(item, index) in emojiList"
      :key="index"
      @click="addEmoji(item)"
    >
      <img :src="[`https://h5.livuchat.com/static/images/emoji/${item.imgUrl}`]" alt="">
    </span>
  </div>
</template>

<script>
import emojiData from '@/assets/data/emoji';
import Clickoutside from '@/util/clickoutside.js';
export default {
  name: 'emojiPop',
  data () {
    return {
    };
  },
  props: ['show'],
  directives: { Clickoutside },
  computed: {
    emojiList () {
      return emojiData;
    }
  },
  methods: {
    cancel () {
      this.$emit('update:show', false);
    },
    addEmoji (txt) {
      this.$emit('addEmoji', txt);
    }
  },

};

</script>

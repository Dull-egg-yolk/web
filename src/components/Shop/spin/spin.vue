<template>
    <div class="rc-spin-view" v-if="visible" :class="color != 'white'?'rc-spin-white':''">
        <div class="warp">
            <svg viewBox="25 25 50 50" class="ich-circular">
                <circle cx="50" cy="50" r="20" fill="none" :stroke="Styles" stroke-width="5" stroke-miterlimit="10" class="ich-load-loop"></circle>
            </svg>
        </div>
    </div>
</template>

<script>
export default {
  name: 'i-spin',
  props: {
    value: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: 'white'
    }

  },
  data () {
    return {
      visible: this.value
    };
  },
  computed: {
    Styles () {
      return [
        this.color === 'white' ? '#fff' : '#000'
      ];
    }
  },
  watch: {
    value (val) {
      this.visible = val;
    }
  }
};
</script>

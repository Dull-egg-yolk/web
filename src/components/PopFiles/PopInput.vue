<template>
  <base-pop class="pop-public pop-input" :showPop="show" @cancelPop="cancelPop">
    <div class="pop-title">
      {{ title }}
    </div>
    <div class="input-box">
      <div class="m-input-box textarea" v-if="type === 'textarea'">
        <div class="input-cell">
          <textarea v-model="initVal" spellcheck="false" maxlength="30"></textarea>
        </div>
        <div
          class="limit-num"
          v-if="limit"
          :class="{ error: initVal.length > limit }"
        >
          {{ initVal.length }} / {{ limit }}
        </div>
      </div>

      <div class="m-input-box" v-else>
        <div class="input-cell">
          <input type="text" v-model="initVal" spellcheck="false" maxlength="30" />
        </div>
      </div>
    </div>
    <div class="pop-action">
      <div class="m-btn major" @click="cancelPop(false)">{{$t('base.confirm')}}</div>
      <div class="m-btn white" @click="cancelPop(true)">{{$t('base.cancel')}}</div>
    </div>
  </base-pop>
</template>

<script>
import BasePop from '../BasePop.vue';
import { logReport } from '@/util/logReport';

export default {
  name: 'PopInput',
  data () {
    return {
      initVal: '',
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    inputVal: String,
    type: String,
    title: String,
    limit: Number,
    profileData: Object
  },
  components: {
    BasePop,
  },
  computed: {},
  methods: {
    cancelPop (noChange) {
      if (!noChange) {
        logReport({
          eventId: '106-1-6-8',
          target_user_id: this.profileData.id,
          free_name2: this.initVal
        });
      }
      console.log(this.initVal, noChange, noChange ? '' : this.initVal, 'ddd');
      this.$emit('cancel', noChange ? false : this.initVal);
    },
  },
  mounted () {
    this.initVal = this.inputVal;
  },
};
</script>

<style lang="less" scoped>
@import url('~@/style/var.less');
.pop-input {
  .input-box {
    padding: 12px 24px 0;
    .m-input-box {
      background:#000;
      border:solid 1px #17161F;

      position: relative;
      .limit-num {
        position: absolute;
        bottom: -30px;
        right: 4px;
        color: @cgray-9;
        font-size: 12px;
        &.error{
          color:@cred-1;
        }
      }
    }
  }
}
@media screen and (max-width: 680px) {
  .pop-input {
    .input-box {
      padding: 2px 18px 0;
    }
  }
}
</style>

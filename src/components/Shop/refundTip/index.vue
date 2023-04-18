<template>
  <div class="mask-fixed flex-c-c" v-if="refundTip">
      <div class="text-box">
          <h3 class="info-title">{{$t('shop.moneyBackGuarantee2')}}</h3>
          <p>
              {{$t('shop.moneyBackDesc')}}
          </p>
          <p v-if="loginToken">
              <a class="text-link" @click="onOrderList">
                  {{$t('shop.orderHistory')}}
              </a>
          </p>
          <div class="btn-box">
              <button class="btn-go rc-shape rc-purple" @click.stop="closeModal">OK</button>
          </div>
      </div>
  </div>
</template>
<script>
import { triggerService } from '@/util/shop';
import Cookies from 'js-cookie';

export default {
  name: 'refundTip',
  model: {
    prop: 'refundTip',
    event: 'input'
  },
  props: {
    refundTip: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loginToken: Cookies.get('loginToken') || ''
    };
  },
  methods: {
    closeModal () {
      this.$emit('input', false);
    },
    onOrderList () {
      triggerService({ eventId: '14-1-1-61' });
      const query = {};
      if (this.isIframe) {
        query.isIframe = 1;
      }
      this.$router.push({
        name: 'PayOrderList',
        query
      });
    }
  }
};
</script>

<style lang="less" scoped>
  .mask-fixed {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    z-index: 100;
  }
    .text-box {
        width: 86vw;
        border-radius: 12px;
        text-align: center;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        h3 {
            margin-top: 24px;
            text-align: center;
            color: #000;
            font-size: 13px;
            line-height: 18px;
            padding: 0  12px;
        }

        p {
            margin-top: 24px;
            padding: 0 12px;
            font-size: 14px;
            line-height: 24px;
            color: #333;
            a {
                display: block;
                margin-top:  12px;
                font-size: 13px;
                text-decoration: underline;
                color: #00C784;
            }
        }

        .btn-box {
            .btn-go {
                width: 86%;
                height: 40px;
                line-height: 40px;
                margin: 10px auto 20px;
                background: #333;
                border-radius: 8px;
                border-radius: 30px;
                color: #fff;
                // border: 1px solid;
                // color: #ffd400
            }
        }
    }
</style>

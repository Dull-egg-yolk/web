<template>
  <div class="coin-page">
    <div class="mb-title new-shop flex-row-vc">
      <div class="actions l fx-c">
        <span class="icon-arrow" @click.stop="closeBtn"></span>
      </div>
      <div class="title l fx-v">
        <div class="side-coin hover">
        <div class="coin-wrap fx-be-vc">
          <strong>{{ userInfo.goldNum }}</strong>
        </div>
      </div></div>
    </div>
    <span class="btn-back hover" @click.stop="closeBtn">
      <span class="icon-cross"></span>
    </span>
    <div class="inner" >
      <section class="refund-back">
        <h5>{{$t('shop.refundReportSuc')}}</h5>
        <img src="@/assets/img/shop/new/success.png" alt="success"/>
        <p class="text-spec">{{$t('shop.refundReportDesc')}}</p>
      </section>
    </div>
  </div>
</template>

<script>
import { triggerService } from '@/util/shop';
import { mapState } from 'vuex';
export default {
  name: 'refundBack',
  data () {
    return {};
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.app.userInfo,
    }),
  },
  methods: {
    closeBtn () {
      this.$router.go(-1);
    },
  },
  created () {
    triggerService({ eventId: '14-1-1-73' });
  }
};
</script>
<style lang="less" rel="stylesheet/less">
@import url("./coins.less");
.inner > .refund-back {
        padding: 60px 24px;
        text-align: center;
        color: #333333;
        font-size: 12px;
        font-weight: bold;
        > h5 {
            font-size: .14px;
        }
        > img {
            width: 60px;
            height: 60px;
            margin: 40px auto 12px;
        }
        .text-spec {
            color: #999999;
            font-size: 120;
            margin-top: .24rem;
            font-weight: normal;
        }
    }
</style>

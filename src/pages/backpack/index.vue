<template>
  <div class="backpack-page">
    <IframePage :iframeUrl="iframeUrl" @pageMessage="handlerMsg">
      <template v-slot:title>
        {{ $t('webChat.backpack.beibaoTitle') }}
      </template>
    </IframePage>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getBaseUrl } from '@/util/index';
import IframePage from '@/components/IframePage';
import { logReport } from '@/util/logReport';

export default {
  name: 'Activity',
  components: { IframePage },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
      backpackConf: (state) => state.app.backpackConf,
    }),
  },
  data () {
    return {
      iframeUrl: ''
    };
  },
  watch: {

  },
  methods: {
    handlerMsg (data) {
      if (data && data.type) {
        console.log(data, '----宝箱页面消息-----');
        if (data.type === 'shop') {
          this.$router.push({ name: 'CoinPage' });
        }
      }
    }
  },
  async mounted () {
    let url = this.backpackConf.backpackUrl;
    url = url.replace('livuchat.com', 'gomeet.today');
    const config = {
      bizData: JSON.stringify(this.backpackConf.bizData),
    };
    const href = getBaseUrl(url, config);
    console.log(href, '------href------');
    this.iframeUrl = href;
  },
  beforeRouteEnter (to, from, next) {
    if (!from.name) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.$router.push({ name: 'LivCam' });
      });
    } else {
      next();
    }
  },

  beforeDestroy () {
  },
};
</script>

<style lang="less" scoped>
.backpack-page {
  height: 100%;
  overflow: hidden;
}
</style>

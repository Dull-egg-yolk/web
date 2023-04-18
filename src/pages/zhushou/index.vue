<template>
  <div class="activity-page">
    <IframePage :iframeUrl="iframeUrl" @pageMessage="handlerMsg">
      <template v-slot:title>
       {{ $t('webChat.bonusTitle3') }}
      </template>
    </IframePage>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getBaseUrl, getParams } from '@/util/index';
import IframePage from '@/components/IframePage';
import { logReport } from '@/util/logReport';

export default {
  name: 'Activity',
  components: { IframePage },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
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
        console.log(data, '----活动页面消息-----');
        if (data.type === 'shop') {
          logReport({
            eventId: '105-10-3-2',
            freeName2: window.$mObj.adData || {},
            r_source: 'webservice',
          });
          this.$router.push({ name: 'CoinPage' });
        }
        if (data.type === 'backpack') {
          logReport({
            eventId: '105-10-3-29',
            freeName2: window.$mObj.adData || {},
            r_source: 'webservice',
          });
          this.$router.push({ name: 'Backpack' });
        }
      }
    }
  },
  async mounted () {
    const params = this.$route.params;
    const url = params.url;
    if (!url) {
      this.$router.push({ name: 'LivCam' });
      return;
    }
    const config = getParams('', url);
    const host = url.split('?');
    const href = getBaseUrl(host[0], config);
    console.log(href, '------href------');
    this.iframeUrl = href.replace('livuchat.com', 'gomeet.today');
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
.activity-page {
  height: 100%;
}
</style>

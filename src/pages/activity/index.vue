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
import { getUserInfoData } from '@/api/user';

export default {
  name: 'Activity',
  components: { IframePage },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
      boxConf: (state) => state.app.boxConf,
      boxMatchConf: (state) => state.app.boxMatchConf,
      boxLivcamConf: (state) => state.app.boxLivcamConf,
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
        if (data.type === 'getCion') {
          console.log();
          this.updateCoin();
        }
      }
    },
    updateCoin () {
      getUserInfoData({}).then(({ code, data }) => {
        if (typeof data.goldNum === 'number') {
          this.$store.commit('updateCoin', data.goldNum);
        }
      });
    },
  },
  async mounted () {
    let url = this.boxConf.targetUrl;
    let bizData = JSON.stringify(this.boxConf.bizData);
    const fromPage = getParams('fromPage');
    if (fromPage === 'match') {
      url = this.boxMatchConf.targetUrl;
      bizData = JSON.stringify(this.boxMatchConf.bizData);
    } else if (fromPage === 'livcam') {
      url = this.boxLivcamConf.targetUrl;
      bizData = JSON.stringify(this.boxLivcamConf.bizData);
    }
    const config = {
      bizData,
    };
    console.log(this.boxMatchConf.bizData, '0000');
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
.activity-page {
  height: 100%;
  overflow: hidden;
}
</style>

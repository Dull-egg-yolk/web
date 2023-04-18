<template>
  <div></div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { setBodyScroll } from '@/util/index';
export default {
  data () {
    return {};
  },
  watch: {
    $route (n, v) {
      this.showComponent(n, v);
    }
  },
  computed: {
    ...mapState({
      imChatConfig: state => state.app.imChatConfig
    }),
    ...mapGetters(['chatSayHiUsersTemp']),
  },
  methods: {
    showComponent (n, v) {
      const { name } = this.$route;

      if (v && (v.name === 'IMMessageSession')) {
        this.$store.commit('setImChatConfig', {
          show: false,
          friendId: 0
        });
      }

      if (name === 'IMMessageSession') {
        if (!this.imChatConfig.friendId) {
          this.$router.go(-1);
          return;
        }
        const newO = Object.assign({ ...this.imChatConfig }, { show: true });
        this.$store.commit('setImChatConfig', newO);
      }

      if (v && (v.name === 'IMSayHiSession')) {
        this.$store.commit('setImSayHiState', false);
      }

      if (name === 'IMSayHiSession') {
        if (!this.chatSayHiUsersTemp.length) {
          this.$router.go(-1);
          return;
        }
        this.$store.commit('setImSayHiState', true);
      }

      if (name === 'MessagePage') {
        this.$store.commit('setImPanelConfig', {
          show: true,
          tabId: 0
        });
      }
      if (name === 'FriendsPage') {
        this.$store.commit('setImPanelConfig', {
          show: true,
          tabId: 1
        });
      }
    }
  },
  mounted () {
    this.showComponent();
    setBodyScroll(false);
  },
  beforeDestroy () {
    this.$store.commit('setImPanelConfig', {
      show: false,
      tabId: 0
    });
    setBodyScroll(true);
  }
};
</script>

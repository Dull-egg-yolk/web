<template>
  <p v-html="privacy"></p>
</template>
<script>
export default {
  name: 'PrivacyPolicy',
  computed: {
    privacy () {
      const terms = `<a href="/terms-of-use" target="_blank">${this.$t('app.terms_of_service')}</a>`;
      const privacy = `<a href="/privacy-policy"" target="_blank">${this.$t('app.privacy_policy')}</a>`;
      const privacyDesc = this.$t('webChat.privacyDesc', { terms, privacy });
      return privacyDesc;
    }
  },
};
</script>

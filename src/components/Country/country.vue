<template>
  <span class="country-box" v-if="country">
    <img v-if="type === 'img' || type === 'all'" class="flag" :src="country.img" alt />
    <span v-if="type === 'name' || type === 'all'" class="country-name">{{
        country.name
    }}</span>
  </span>
</template>
<script>
export default {
  name: 'Country',
  props: {
    type: {
      type: String,
      default: 'all', // name img all
    },
    countryId: {
      type: Number,
      default: null,
    },
  },
  computed: {
    country () {
      const country = this.$countryCode[this.countryId];
      if (!country) return '';
      const url = 'https://h5.livuchat.com/static/images/countryFlag/';
      const code = country.short.toLowerCase();
      const img = `${url}${code}.png`;
      const name = this.$t(`country.${country.short}`);
      return { img, name };
    },
  },
};
</script>
<style scoped lang="less">
.country-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .flag {
    width: 20px;
    height: 10px;
    margin-right: 5px;
    object-fit: cover;
  }
}
[lang="ar"],
  [lang="he"],
  [lang="ur"] {
    .country-box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .flag {
        width: 20px;
        height: 10px;
        margin-right: auto;
        margin-left: 5px;
        object-fit: cover;
      }
    }
}
</style>

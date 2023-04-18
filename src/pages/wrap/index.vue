<template>
  <div class="site-wrap">
          <!-- <transition name="sitefade" :duration="50" mode="out-in"> -->
        <keep-alive>
          <router-view ref="routerView" v-if="$route.meta && $route.meta.keepAlive" />
        </keep-alive>
      <!-- </transition> -->

      <!-- <transition name="sitefade" :duration="50" mode="out-in"> -->
        <router-view ref="routerView" v-if="!$route.meta || !$route.meta.keepAlive" />
      <!-- </transition> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },

  methods: {

  },
  created () {

  }
};
</script>

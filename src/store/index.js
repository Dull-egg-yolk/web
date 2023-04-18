import Vue from 'vue';
import Vuex from 'vuex';
import app from './app';
import agora from './agora';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    agora
  },
});

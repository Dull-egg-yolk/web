import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', // 首页
    name: 'Home',
    component: () =>
      import(/* webpackChunkName: "Home" */ '../views/Advertising/home.vue'),
    meta: {
      title: 'Home'
    }
  },
  {
    path: '/p1', // h5 来电提醒
    name: 'H5Download',
    component: () =>
      import(/* webpackChunkName: "H5Download" */ '../views/Advertising/H5Download.vue'),
    meta: {
      title: 'H5Download'
    }
  },
  {
    path: '/ukp2', // h5 来电提醒
    name: 'H5Download1',
    component: () =>
      import(/* webpackChunkName: "H5Download" */ '../views/Advertising/H5Download1.vue'),
    meta: {
      title: 'H5Download'
    }
  },
  {
    path: '/ukp3', // h5 来电提醒
    name: 'P3',
    component: () =>
      import(/* webpackChunkName: "P3" */ '../views/p3/index.vue'),
    meta: {
      title: 'P3'
    }
  },
  {
    path: '/ukp7', // h5 来电提醒
    name: 'P7',
    component: () =>
      import(/* webpackChunkName: "P7" */ '../views/ukp5/index.vue'),
    meta: {
      title: 'P7'
    }
  },
  {
    path: '/nlp1', // h5 来电提醒
    name: 'nlp1',
    component: () =>
      import(/* webpackChunkName: "nlp1" */ '../views/nlp1/index.vue'),
    meta: {
      title: 'P1'
    }
  },
  {
    path: '/ukp6', // h5 来电提醒
    name: 'P6',
    component: () =>
      import(/* webpackChunkName: "P6" */ '../views/p6/index.vue'),
    meta: {
      title: 'P6'
    }
  },
  {
    path: '/ukp4', // google ads page 4
    name: 'H5Download4',
    component: () =>
      import(/* webpackChunkName: "H5Download" */ '../views/p4/index.vue'),
    meta: {
      title: 'Live.com'
    }
  },
  {
    path: '/ukp5', // h5 来电提醒
    name: 'P5',
    component: () =>
      import(/* webpackChunkName: "P5" */ '../views/p5/index.vue'),
    meta: {
      title: 'p5'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router

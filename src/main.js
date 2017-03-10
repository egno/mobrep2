// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueTouch from 'vue-touch'
import App from './App'
import router from './router'
import { store } from './store/store'

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(VueTouch)

if (process.env.NODE_ENV === 'development') {
  // Vue.http.options.root = 'http://172.16.202.42:3002'
  Vue.http.options.root = 'http://172.16.202.42:3003'
} else {
  Vue.http.options.root = '/api'
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

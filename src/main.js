// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import { store } from './store/store'

Vue.config.productionTip = false

Vue.use(VueResource)

if (process.env.NODE_ENV !== 'production') {
  // Vue.http.options.root = 'http://172.16.202.42:3002'
  Vue.http.options.root = 'http://172.16.202.42:3004'
} else {
  Vue.http.options.root = '/api/v2'
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

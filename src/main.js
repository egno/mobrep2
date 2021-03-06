// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueScroll from 'vue-scroll'
// import VueTouch from 'vue-touchjs'
import App from './App'
import router from './router'
import { store } from './store/store'

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(VueScroll)
// Vue.use(VueTouch)

if (process.env.NODE_ENV !== 'production') {
  Vue.http.options.root = 'https://datazen.katren.ru/api/v2'
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

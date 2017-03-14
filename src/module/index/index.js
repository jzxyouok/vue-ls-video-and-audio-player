import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'

/* eslint-disable no-new */
Vue.use(VueResource);
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})

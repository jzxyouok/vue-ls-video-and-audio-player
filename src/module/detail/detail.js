import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import VueLazyload from 'vue-lazyload'

Vue.use(VueResource);
Vue.use(VueLazyload, {
  error: '/statics/images/750x420-min.jpg',
  loading: '/statics/images/750x420-min.jpg',
  try: 3 // default 1
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})

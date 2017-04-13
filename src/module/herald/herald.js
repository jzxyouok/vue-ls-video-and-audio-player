import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import VueLazyload from 'vue-lazyload'

Vue.use(VueResource);
Vue.use(VueLazyload, {
  error: '/statics/images/750x420-min.jpg',
  loading: '/statics/images/750x420-min.jpg',
  try: 3 // default 1
})
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})

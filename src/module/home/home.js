import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'


Vue.use(VueResource);
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})

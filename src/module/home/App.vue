<template>
  <div id="app">
    <g-header :name="circleInfo.name" :logo="circleInfo.logo" :desc="circleInfo.desc" :memberNum="circleInfo.memberNum"></g-header>
  </div>
</template>

<script>
  import 'common/css/reset.css';
  import 'common/js/reset.js'
  import GHeader from 'components/GHeader/GHeader'
  export default {
    name: 'app',
    components: {
      GHeader
    },
    created(){
//      this.$http.get('/api/live').then((response) => {
//        var live = response.body.result;
//        this.live = live;
//      });
      console.log(this.circleInfo);
    },
    data () {
      return {
        lives:[],
        circleInfo:window.circleInfo
      }
    },
    methods: {

    }
  }
</script>

<style>


</style>

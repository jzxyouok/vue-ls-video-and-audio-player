<template>
  <div id="app">
    <g-header></g-header>
  </div>
</template>

<script>
  import 'common/css/reset.css';
  import GHeader from 'components/GHeader/GHeader'
  export default {
    name: 'app',
    components: {
      GHeader
    },
    data () {
      return {}
    },
    methods: {}
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>

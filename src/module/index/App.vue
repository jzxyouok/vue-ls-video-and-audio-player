<template>
  <div id="app">
    <h3>
      此页面不是业务页面，可当做一个模板示例使用
      dev 分支测试
    </h3>
    <g-header></g-header>
    <group-chat></group-chat>
    <live-list></live-list>
    <members></members>
  </div>
</template>

<script>
  import 'common/css/reset.css';
  import GHeader from 'components/GHeader/GHeader'
  import GroupChat from 'components/GroupChat/GroupChat'
  import LiveList from 'components/LiveList/LiveList'
  import Members from 'components/Members/Members'

  export default {
    name: 'app',
    components: {
       GHeader, GroupChat, LiveList, Members
    }
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

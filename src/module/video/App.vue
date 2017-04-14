<template>
  <div id="app">
    <gaiay-m3u8 :type="type"
                :state="liveState"
                :poster="pic"
                :playerUrl="url"
    >

    </gaiay-m3u8>
  </div>
</template>

<script>
  import 'common/css/reset.css';
  import 'common/js/reset.js';
  import GaiayM3u8 from 'components/GaiayPlayer/GaiayM3u8.vue'
  export default {
    name: 'app',
    components: {
      GaiayM3u8
    },
    data(){
      return {
        type:1,
        liveState:68,
        pic:'http://pic11.nipic.com/20101214/213291_155243023914_2.jpg',
        url:'http://pili-static.live.zm.gaiay.cn/recordings/z1.gaiay-pro.58db9ea020a05d5f990e7186/1490788004.1490788022.m3u8'
      }
    },
    methods: {

    }
  }
</script>

<style>

</style>

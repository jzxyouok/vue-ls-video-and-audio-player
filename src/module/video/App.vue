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
  import GaiayM3u8 from 'components/GaiayPlayer/GaiayM3u8.vue'
  export default {
    name: 'app',
    components: {
      GaiayM3u8
    },
    data(){
      return {
        type:2,
        liveState:68,
        pic:'http://pic11.nipic.com/20101214/213291_155243023914_2.jpg',
        url:'https://logos-channel.scaleengine.net/logos-channel/live/biblescreen-ad-free/playlist.m3u8'
      }
    },
    methods: {

    }
  }
</script>

<style>

</style>

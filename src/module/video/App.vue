<template>
  <div id="app">
    <video-player :options="playerOptions"
                  @play="onPlayerPlay($event)"
                  @pause="onPlayerPause($event)"
                  @ended="onPlayerEnded($event)"
                  @statechanged="playerStateChanged($event)"
                  @ready="playerReadied"
    >
    </video-player>
  </div>
</template>

<script>
  import 'common/css/reset.css';
  require('videojs-contrib-hls');
  import {videoPlayer} from 'vue-video-player';

  export default {
    name: 'app',
    components: {
      videoPlayer
    },
    data(){
      return {
        playerOptions: {
          // component options
          start: 0,
          playsinline: false,

          // videojs options
          muted: true,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: "video/mp4",
            src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
          }],
          poster: "http://pic11.nipic.com/20101214/213291_155243023914_2.jpg"
        }
      }
    },
    methods: {
      onPlayerPlay(player) {
        console.log('player play!', player)
      },
      onPlayerPause(player) {
        console.log('player pause!', player)
      },
      onPlayerEnded(player){
        console.log('player End!', player)
      },
      // or listen state event
      playerStateChanged(playerCurrentState) {
        console.log('player current update state', playerCurrentState)
      },

      // player is ready
      playerReadied(player) {
        console.log('the player is readied', player)
        // you can use it to do something...
        // player.[methods]
      }
    }
  }
</script>

<style>
</style>

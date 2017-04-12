<template>
  <div class="item">
    <div class="player">
      <video-player :options="getPlayerOptions"
                    @play="onPlayerPlay($event)"
                    @pause="onPlayerPause($event)"
                    @ended="onPlayerEnded($event)"
                    @statechanged="playerStateChanged($event)"
                    @ready="playerReadied"
                    :class="{audioBg:audioBg}"
      >
      </video-player>
    </div>
  </div>
</template>

<script>
  // hls plugin
  require('videojs-contrib-hls/dist/videojs-contrib-hls')
  import {videoPlayer} from 'vue-video-player';
  export default {
    components: {
      videoPlayer
    },
    props: {
      type: {//播放类型 0：非媒体状态, 1: 视频 , 2 音频
        type: Number,
        default: 0
      },
      state: {//直播状态：1：直播, 2:预告, 3:回放
        type: Number,
        default: 2
      },
      poster: {//封面
        type: String,
        default: ''
      },
      playerUrl: {//媒体播放地址
        type: String,
        default: ''
      }
    },
    data() {
      return {}
    },
    computed: {
      getPlayerOptions: function () {
        return {
          sources: [{
            withCredentials: false,
            type: "application/x-mpegURL",
//            type: "rtmp/flv",
            src: this.playerUrl
          }],
          controlBar: {
            timeDivider: false,
            durationDisplay: false
          },
          flash: {hls: {withCredentials: false}},
          html5: {hls: {withCredentials: false}},
          poster: this.poster
        }
      }
    },
    methods: {
      /**
       * 显示音频播放器样式
       * @param player
       */
      showAudioStyle(player){
        player.bigPlayButton.el().style.display = 'block';
        player.posterImage.el().style.display = 'block';
      },
      onPlayerPlay(player) {
        if (this.type == 2) {
          this.showAudioStyle(player)
        }
        console.log("..............");
        console.log(player);
        console.log("..............");
      },
      onPlayerPause(player) {
        if (this.type == 2) {
          this.showAudioStyle(player)
        }
      },
      onPlayerEnded(player){
//        console.log('player End!', player)
      },
// or listen state event
      playerStateChanged(playerCurrentState) {
//        console.log('player current update state', playerCurrentState)
      },
      playerReadied(player) {
        var hls = player.tech({IWillNotUseThisInPlugins: true}).hls
        player.tech_.hls.xhr.beforeRequest = function (options) {
//          console.log("你在干什么。。。。。。。。。。。");
//          console.log(options)
          return options
        }
      }
    }
  }
</script>
<style>
  .audioBg video {
    background-color: #ff9600;
  }

  video::-webkit-media-controls {
    display: none !important;
  }
</style>
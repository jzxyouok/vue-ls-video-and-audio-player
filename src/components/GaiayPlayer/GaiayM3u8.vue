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
      <!-- 音频收听中动画 -->
      <section class="musicPlayer active"><i></i><i></i><i></i><i></i><i></i><i></i></section>
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
           webkitPlaysinline:false,
           playsinline:false,
           x5Playsinline:false,
           xWebkitAirplay:"allow",
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
 video::-webkit-media-controls {
    display: none !important;
  }
   .vjs-big-play-button::after{background-image: url(/static/images/pubBack.png);background-repeat: no-repeat;background-size: 1rem 5rem;}
    .vjs-big-play-button::after{display: block;content: "";position: absolute;left: 0;}

  .vjs_video_3-dimensions{height: 4.2rem;}
  /*播放按扭*/
  .video-player .video-js.vjs-custom-skin .vjs-big-play-button{position: absolute; top: 50%;left: 50%;margin:-.6rem 0 0 -.6rem!important;  width:1.2rem;height: 1.2rem!important;background:rgba(0,0,0,.4);border-radius:100%;display: block;border:none;}
  .video-player .video-js.vjs-custom-skin .vjs-big-play-button::before{display: none;}
  .vjs-big-play-button::after{width:.4rem;height:.54rem;background-position:0 -3.8rem;position: absolute; top: 50%;left: 50%;margin:-.25rem 0 0 -.15rem;}
  /*加载动画*/
  .video-js.vjs-custom-skin .vjs-loading-spinner{background:url(/static/images/player/loading.png) no-repeat center; background-size:auto .3rem;opacity: 1;border:0;border-radius:0;width:.8rem;height:.8rem;margin: -.4rem 0 0 -.4rem;}
  .video-js.vjs-custom-skin .vjs-loading-spinner::before{border-radius: 50%;width:.8rem;height:.8rem; position: absolute;top: 0;left: 0;margin: 0;
  border-top:4px solid rgba(255, 255, 255, 0.2);
  border-right:4px solid rgba(255, 255, 255, 0.2);
  border-bottom:4px solid rgba(255, 255, 255, 0.2);
  border-left:4px solid #f03c38;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load 1.1s infinite linear;
  animation: load 1.1s infinite linear;
 }
 .vjs-loading-spinner::after{display: none;}
  @-webkit-keyframes load {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes load {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
   /*音频收听中动画*/
  .musicPlayer {position: absolute; top: 50%;left: 50%;margin:-.31rem 0 0 -.32rem;  width:.64rem;height:.62rem;z-index: 9999;}
  .musicPlayer::before{content: "";position: absolute; top:50%;left:50%; margin: -.6rem 0 0 -.6rem; width:1.2rem;height: 1.2rem;background:rgba(0,0,0,.4);border-radius:100%;}
  .musicPlayer i {
      width:.04rem;
      height:.04rem;
      position: absolute;
      bottom: 0;
      background-color: #fff;
      border-radius:2px;
  }

  .musicPlayer i:nth-of-type(1) {
      left: 0;
  }

  .musicPlayer i:nth-of-type(2) {
      left:.12rem;
  }

  .musicPlayer i:nth-of-type(3) {
      left:.24rem;
  }

  .musicPlayer i:nth-of-type(4) {
      left:.36rem;
  }

  .musicPlayer i:nth-of-type(5) {
      left:.48rem;
  }

  .musicPlayer i:nth-of-type(6) {
      left: .6rem;
  }

  .musicPlayer.active i:nth-of-type(1) {
      -webkit-animation: wave 0.66s linear infinite;
      animation: wave 0.66s linear infinite;
  }

  .musicPlayer.active i:nth-of-type(2) {
      -webkit-animation: wave 0.8s linear infinite;
      animation: wave 0.8s linear infinite;
  }

  .musicPlayer.active i:nth-of-type(3) {
      -webkit-animation: wave 0.7s linear infinite;
      animation: wave 0.7s linear infinite;
  }

  .musicPlayer.active i:nth-of-type(4) {
      -webkit-animation: wave 0.5s linear infinite;
      animation: wave 0.5s linear infinite;
  }

  .musicPlayer.active i:nth-of-type(5) {
      -webkit-animation: wave 0.9s linear infinite;
      animation: wave 0.9s linear infinite;
  }

  .musicPlayer.active i:nth-of-type(6) {
      -webkit-animation: wave 1.2s linear infinite;
      animation: wave 1.2s linear infinite;
  }

  @-webkit-keyframes wave {
      0% {
          height: 1px
      }
      50% {
          height: .62rem
      }
      100% {
          height: 1px
      }
  }

  @keyframes wave {
      0% {
          height: 1px
      }
      50% {
          height: .62rem
      }
      100% {
          height: 1px
      }
  }

</style>
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
      <section class="active" :class="{musicPlayer:audioPlaying}" @click="audioPause"><i></i><i></i><i></i><i></i><i></i><i></i></section>


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
        default: 2
      },
      state: {//直播状态：1：直播, 2:预告, 3:回放
        type: Number,
        default: 2
      },
      poster: {//封面
        type: String,
        default: "http://ss.zm518.cn/ae32c42e64434648af5cccb25ee1e906/image/20170330/10/1757.00009.jpeg"
      },
      playerUrl: {//媒体播放地址
        type: String,
//        default: 'http://pili-static.live.zm.gaiay.cn/recordings/z1.gaiay-pro.58db9ea020a05d5f990e7186/1490788004.1490788022.m3u8'
        default: 'http://pili-static.live.zm.gaiay.cn/recordings/z1.gaiay-pro.58ef1601a3d5ec320f006768/1492063760.1492063923.m3u8'
      }
    },
    data() {
      return {
        audioPlaying:false,
        player:{}
      }
    },
    created(){
      console.log(this.playerUrl+"----------------------------------------------");
    },
    computed: {
      getPlayerOptions: function () {
        return {
          sources: [{
            withCredentials: false,
            type: "application/x-mpegURL",
            src: this.playerUrl
          }],
          controlBar: {
            timeDivider: false,
            durationDisplay: false
          },
          playsinline: true,
          flash: {hls: {withCredentials: false}},
          html5: {hls: {withCredentials: false}},
          poster: this.poster,
//          autoplay:true
        }
      }
    },
    methods: {
      /**
       * 显示音频播放器样式
       * @param player
       */
      showAudioStyle(player,played){
        player.posterImage.el().style.display = 'block';
        if(played){
          player.bigPlayButton.el().style.display = 'none';
           this.audioPlaying = true;
        }else{
          player.bigPlayButton.el().style.display = 'block';
          this.audioPlaying = false;
        }
      },
      audioPause(){
        this.player.pause();
      },
      onPlayerPlay(player) {
        if (this.type == 2) {
          this.showAudioStyle(player,true);
        }
      },
      onPlayerPause(player) {
        if (this.type == 2) {
          this.showAudioStyle(player,false);
        }
      },
      onPlayerEnded(player){
        alert("播放结束");
      },
      playerStateChanged(playerCurrentState) {

      },
      playerReadied(player) {
        this.intoPlayerAttr(player);
        this.player=player;
        var hls = player.tech({IWillNotUseThisInPlugins: true}).hls
        player.tech_.hls.xhr.beforeRequest = function (options) {
          return options
        }
      },

      /**
       * 手动向videojs 生成的 元素video上添加一些属性
       * 做一些兼容问题的处理
       * @param player
       */
      intoPlayerAttr(player){
//        player.el().firstChild.setAttribute("x5-video-player-type", "h5");
        player.el().firstChild.setAttribute("x5-playsinline", "");
        player.el().firstChild.setAttribute("x-webkit-airplay", "allow");
        player.el().firstChild.setAttribute("style", "object-fit: fill");
      },

      /**
       * 绑定一些其他事件
       * @param player
       */
      bindOtherEvent(player){
        player.on('canplay',function () {// 当视频可以播放时产生该事件

        });
        player.on('waiting',function () {// 当视频因缓冲下一帧而停止时产生该事件

        });
        player.on('playing',function () {// 当媒体从因缓冲而引起的暂停和停止恢复到播放时产生该事件

        });
        player.on('abort',function () {// 当加载媒体被异常终止时产生该事件

        });
        player.on('error',function () {// 当加载媒体发生错误时产生该事件

        });
      }
    }
  }
</script>
<style>
  .audioBg video {
    background-color: #ff9600;
  }

  /*
    隐藏设备自带的播放按钮
  */
  video::-webkit-media-controls {
    display: none !important;
  }

  .player {
    position: relative;
  }

  .vjs-big-play-button::after {
    background-image: url(/statics/images/pubBack.png);
    background-repeat: no-repeat;
    background-size: 1rem 5rem;
  }

  .vjs-big-play-button::after {
    display: block;
    content: "";
    position: absolute;
    left: 0;
  }

  .vjs_video_3-dimensions {
    height: 4.2rem;
  }

  .vjs-current-time-display, .vjs-remaining-time-display {
    line-height: 0.84rem;
  }

  /*播放按扭*/
  .video-player .video-js.vjs-custom-skin .vjs-big-play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -.6rem 0 0 -.6rem !important;
    width: 1.2rem;
    height: 1.2rem !important;
    background: rgba(0, 0, 0, .4);
    border-radius: 100%;
    border: none;
  }

  .video-player .video-js.vjs-custom-skin .vjs-big-play-button::before {
    display: none;
  }

  .vjs-big-play-button::after {
    width: .4rem;
    height: .54rem;
    background-position: 0 -3.8rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -.25rem 0 0 -.15rem;
  }

  /*加载动画*/
  .video-js.vjs-custom-skin .vjs-loading-spinner {
    background: url(/statics/images/player/loading.png) no-repeat center;
    background-size: auto .3rem;
    opacity: 1;
    border: 0;
    border-radius: 0;
    width: .8rem;
    height: .8rem;
    margin: -.4rem 0 0 -.4rem;
  }

  .video-js.vjs-custom-skin .vjs-loading-spinner::before {
    border-radius: 50%;
    width: .8rem;
    height: .8rem;
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    border-top: 4px solid rgba(255, 255, 255, 0.2);
    border-right: 4px solid rgba(255, 255, 255, 0.2);
    border-bottom: 4px solid rgba(255, 255, 255, 0.2);
    border-left: 4px solid #f03c38;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: load 1.1s infinite linear;
    animation: load 1.1s infinite linear;
  }

  .vjs-loading-spinner::after {
    display: none;
  }

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

  .audio-player {
    width: 100%;
    height: 1rem;
    position: absolute;
    bottom: 0;
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
  .musicPlayer {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -.31rem 0 0 -.32rem;
    width: .64rem;
    height: .62rem;
    z-index: 9999;
  }

  .musicPlayer::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -.6rem 0 0 -.6rem;
    width: 1.2rem;
    height: 1.2rem;
    background: rgba(0, 0, 0, .4);
    border-radius: 100%;
  }

  .musicPlayer i {
    width: .04rem;
    height: .04rem;
    position: absolute;
    bottom: 0;
    background-color: #fff;
    border-radius: 2px;
  }

  .musicPlayer i:nth-of-type(1) {
    left: 0;
  }

  .musicPlayer i:nth-of-type(2) {
    left: .12rem;
  }

  .musicPlayer i:nth-of-type(3) {
    left: .24rem;
  }

  .musicPlayer i:nth-of-type(4) {
    left: .36rem;
  }

  .musicPlayer i:nth-of-type(5) {
    left: .48rem;
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

<template>
  <div class="item">
    <div class="player">
      <section class="topVFail" v-show="aginConn">
        <div class="topVFailCont">
          <h3 class="tit">连接失败，点击重试</h3>
          <button class="btn" @click="_eventAginConnect">重试</button>
        </div>
      </section>
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
      <section class="active" :class="{musicPlayer:audioPlaying}" @click="_eventAudioPause"><i></i><i></i><i></i><i></i><i></i><i></i></section>
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
        default: 1
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
        default: ''
      }
    },
    data() {
      return {
        aginConn:false,
        audioPlaying:false,
        player:{}
      }
    },
    created(){
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
          html5: {hls: {withCredentials: true}},
          poster: this.poster,
//          autoplay:true
          aspectRatio:"16:9",
        }
      }
    },
    methods: {
      /**
       * 重新链接的点击事件
       **/
      _eventAginConnect(){
        this.aginConn = false;
        this.player.load();
        this.player.play();
      },
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

      /*
      * 音频时 播放状态下的按钮事件
      * */
      _eventAudioPause(){
        this.player.pause();
      },

      /**
       * 视频播放时触发
       * */
      onPlayerPlay(player) {
        this.aginConn=false;
      },
      /**
       * 视频暂停时触发
       * */
      onPlayerPause(player) {
        if (this.type == 2) {
          this.showAudioStyle(player,false);
        }
      },
      /**
       * 视频结束时触发
       * */
      onPlayerEnded(player){
        alert("播放结束");
      },
      /**
       * 视频？时触发
       * */
      playerStateChanged(playerCurrentState) {

      },

      /**
       * 初始化播放器时触发
       * */
      playerReadied(player) {
        this.player=player;
        this.intoPlayerAttr(player);
        this.bindOtherEvent(player);
      },

      /**
       * 手动向videojs 生成的 元素video上添加一些属性
       * 做一些兼容问题的处理
       * @param player
       */
      intoPlayerAttr(player){
        player.el().firstChild.setAttribute("x5-video-player-type", "h5");
        player.el().firstChild.setAttribute("x5-playsinline", "");
        player.el().firstChild.setAttribute("x-webkit-airplay", "allow");
        player.el().firstChild.setAttribute("style", "object-fit: fill");
      },

      /**
       * 绑定一些其他事件
       * @param player
       */
      bindOtherEvent(player){
        var that = this;
        player.on('canplay',function () {// 当视频可以播放时产生该事件
          console.log("canplay.....");
          if (this.type == 2) {
            this.showAudioStyle(player,true);
          }
        });
        player.on('waiting',function () {// 当视频因缓冲下一帧而停止时产生该事件
//          alert("waiting");
        });
        player.on('playing',function () {// 当媒体从因缓冲而引起的暂停和停止恢复到播放时产生该事件
          console.log("playing......");
        });
        player.on('abort',function () {// 当加载媒体被异常终止时产生该事件
         that.aginConn = true;
          that.audioPlaying = false;
        });
        player.on('error',function () {// 当加载媒体发生错误时产生该事件
          that.aginConn = true;
          that.audioPlaying = false;
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
  video::-webkit-media-controls ,.vjs-modal-dialog-content,.vjs-error-display{
    display:none !important;
  }
  .vjs-error .vjs-error-display:before{
    content: ""!important;
  }
  .vjs-poster{
    background-size: cover!important;
  }

  .player {
    position: relative;
  }

  .vjs-big-play-button::after,.topVFail .btn::before {
    background-image: url(/statics/images/pubBack.png);
    background-repeat: no-repeat;
    background-size: 1rem 5rem;
  }

  .vjs-big-play-button::after,.topVFail .btn::before{
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
  /*连接失败*/
  .topVFail, .topVStatus {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #000;
    z-index: 1000
  }

  .topVFailCont, .topVStatusCont {
    position: absolute;
    left: 50%;
    top: 50%;
    /* -webkit-transform: translate(-50%, -50%);
     transform: translate(-50%, -50%);*/
    text-align: center;
    width: 90%;
    height: 1.6rem;
    margin: -.6rem 0 0 -45%;
  }

  .topVFail .tit, .topVStatusCont .tit {
    text-align: center;
    font-size: .28rem;
    opacity: .8;
    margin-bottom: .35rem;
    color: #fff;
  }

  .topVFail .btn {
    display: inline-block;
    color: #fff;
    font-size: .32rem;
    line-height: .7rem;
    height: .7rem;
    padding: 0 .45rem 0 .94rem;
    border: 1px solid #fff;
    border-radius: .5rem;
    position: relative;
  }

  .topVFail .btn::before {
    width: .33rem;
    height: .33rem;
    background-position: 0 -4.53rem;
    position: absolute;
    top: 50%;
    margin: -.165rem 0 0 .46rem;
  }



</style>

<template>
  <div class="item">
    <div class="player">
      <section class="topVFail" v-show="tryaginConnection">
        <div class="topVFailCont">
          <h3 class="tit">连接失败，点击重试</h3>
          <button class="btn" @click="_eventAginConnect">重试</button>
        </div>
      </section>
      <video-player :options="getPlayerOptions"
                    :class="{audioBg:audioBg,isAudioType:hideFull}"
                    :media="type"
                    @play="onPlayerPlay($event)"
                    @playing="onPlayerPlaying($event)"
                    @pause="onPlayerPause($event)"
                    @ended="onPlayerEnded($event)"
                    @statechanged="playerStateChanged($event)"
                    @timeupdate="onTimeUpdate($event)"
                    @ready="playerReadied"
      >
      </video-player>
      <!-- 音频收听中动画 -->
      <section class="active"
               :class="{audioPlaying:audioPlaying}"
               @click="_eventAudioPause">
      </section>
    </div>
    <section class="videoEndPop" v-if="endLayer" @click="endLayer=false">
      <ul>
        <li>直播已结束</li>
        <li>我知道了</li>
      </ul>
    </section>
  </div>
</template>

<script>
  /*
  * HQ.Wn 2017-04-25
  * 使用该组件 请确保 首次构建时修改了 player.vue 文件
  * 详见 doc/player（vue-player插件源码修改备份）.vue 的说明。
  * */

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
        default: ""
      },
      playerUrl: {//媒体播放地址
        type: String,
        default: ''
      }
    },
    data() {
      return {
        tryaginConnection: false, //是否显示重连遮罩
        audioPlaying: false,// 播放状态的音频按钮
        player: {},         //播放器
        endLayer: false, //直播结束弹出层
        hideFull:false //false:表示不隐藏全屏按钮，true 隐藏
      }
    },
    created(){
      this.isHideFull();
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
            liveDisplay: false,
            durationDisplay: false
          },
          playsinline: true,
          flash: {hls: {withCredentials: false}},
          html5: {hls: {withCredentials: true}},
          poster: this.poster,
          aspectRatio: "16:9",
        }
      }
    },
    methods: {
      /**
       * 手动向videojs 生成的video标签上添加一些属性
       * 做一些兼容问题的处理
       * @param player
       */
      intoPlayerAttr(player){
//        player.el().firstChild.setAttribute("x5-video-player-type", "h5");
        player.el().firstChild.setAttribute("x5-playsinline", "");
        player.el().firstChild.setAttribute("webkit-inline", "true");
        player.el().firstChild.setAttribute("x-webkit-airplay", "allow");
        player.el().firstChild.setAttribute("style", "object-fit:fill");
      },

      /**
       * 重新链接的点击事件
       **/
      _eventAginConnect(){
        this.tryaginConnection = false;
        this.player.load();
        this.player.play();
      },

      /*
       * 音频时 播放状态下的按钮事件
       * */
      _eventAudioPause(){
        this.player.pause();
      },

      /**
       * 时刻监听播放器的状态
       * */
      playerStateChanged(playerCurrentState) {
//        console.log("----");
//        console.log("状态：");
//        console.log(playerCurrentState);
//        console.log("----");
        this.playerCurrentState = playerCurrentState;
        if (playerCurrentState.canplaythrough) {
          this.player.loadingSpinner.hide();
        } else if (playerCurrentState.waiting) {
        }
      },
      /**
       * 初始化播放器时触发
       * */
      playerReadied(player) {
        this.player = player;
        this.intoPlayerAttr(player);
        this.bindOtherEvent(player);
      },

      /**
       * 视频播放时触发
       * */
      onPlayerPlay(player) {
        var that = this;
      },
      /**
       * 视频暂停时触发
       * */
      onPlayerPause(player) {
        var that = this;
        this.audioPlaying = false;
      },
      onPlayerPlaying(player){
        if (this.type == 2)this.audioPlaying = true;
      },
      /**
       * 视频结束时触发
       * */
      onPlayerEnded(player){

        player.exitFullscreen();
        this.endLayer = true;
      },

      /**
       *Android 微信中 监听不到ended的替代方案
       * */
      onTimeUpdate (player) {
        // 如果 currentTime() === duration()，则视频已播放完毕
        if (player.duration() != 0 && player.currentTime() === player.duration()) {
          // alert("播放结束");
//          this.audioPlaying = false;
        } else {
          if (this.type == 2) {
//            this.audioPlaying = true;
          }
        }
      },

      /**
       * 绑定一些其他事件
       * canplay:当视频可以播放时产生该事件
       * waiting:当视频因缓冲下一帧而停止时产生该事件
       * playing:当媒体从因缓冲而引起的暂停和停止恢复到播放时产生该事件
       * abort:  当加载媒体被异常终止时产生该事件
       * error:当加载媒体发生错误时产生该事件
       * @param player
       */
      bindOtherEvent(player){
        var that = this;
        player.on('abort', function () {
          that.tryaginConnection = true;
          that.audioPlaying = false;
        });
        player.on('error', function () {
          that.tryaginConnection = true;
          that.audioPlaying = false;
        });
      },

      /**
       * 根据媒体类型判断是否需要全屏
       */
      isHideFull(){
        console.log("计算全屏"+this.type);
        if(this.type==2){
         this.hideFull=true;
        }else {
          this.hideFull=false;
        }
      }
    }
  }
</script>
<style>
  .mytest {
    width: 200px !important;
  }

  .audioBg video {
    background-color: #ff9600;
  }

  /*
    隐藏设备自带的播放按钮
  */
  video::-webkit-media-controls, .vjs-modal-dialog-content, .vjs-error-display {
    display: none !important;
  }

  .vjs-error .vjs-error-display:before {
    content: "" !important;
  }

  .vjs-poster {
    background-size: cover !important;
  }

  .player {
    position: relative;
  }

  .video-js.vjs-paused .vjs-big-play-button {
    display: block !important;
  }

  .vjs-big-play-button::after, .topVFail .btn::before {
    background-image: url(/statics/images/pubBack.png);
    background-repeat: no-repeat;
    background-size: 1rem 5rem;
  }

  .vjs-big-play-button::after, .topVFail .btn::before {
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
  .audioPlaying {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -.6rem 0 0 -.6rem;
    width: 1.2rem;
    height: 1.2rem;
    z-index: 1000;
    background: url(/statics/images/player/aplaying.gif) no-repeat center rgba(0, 0, 0, .4);
    background-size: 100%;
    border-radius: 100%
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

  /*视频结束弹出框*/
  .videoEndPop {
    background: rgba(0, 0, 0, .4);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
  }

  .videoEndPop ul {
    width: 5.4rem;
    min-height: 2rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -1rem 0 0 -2.7rem;
    background: #fff;
    border-radius: .3rem;
    padding: 0
  }

  .videoEndPop ul li {
    text-align: center;
    list-style: none;
    padding: 0;
    margin: 0
  }

  .videoEndPop ul li:nth-child(1) {
    font-size: .28rem;
    line-height: 1.1rem;
    border-bottom: 1px solid #dadade;
    color: #000
  }

  .videoEndPop ul li:nth-child(2) {
    font-size: .3rem;
    font-weight: bold;
    line-height: 1rem;
    color: #007aff
  }
  .isAudioType .video-js.vjs-custom-skin .vjs-control-bar .vjs-fullscreen-control{
    width: 0;
  }
</style>

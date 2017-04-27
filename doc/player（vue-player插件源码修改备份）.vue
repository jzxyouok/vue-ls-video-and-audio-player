<template>
  <div class="video-player">
    <video class="video-js vjs-custom-skin" v-if="media==1"></video>
    <!--HQ.Wn 2017-04-25 源码修改: 自增的 音频媒体时的dom 模板 -->
    <audio class="video-js vjs-custom-skin" v-if="media==2"></audio>
  </div>
</template>

<script>
  /*
  * HQ.Wn 2017-04-25 说明：
  * 针对 vue-video-player 第三方依赖 源码中没有提供 针对音频生成对应的<audio></audio> 的属性
  * 导致 在Android 微信中 观看音频时 封面图被遮挡 无法切换播放按钮的状态等问题，故手动修改了源码
  * 然而，因该项目的所有依赖都交由 npm 管理，这样便导致首次构建该项目时 npm install 所安装的vue-video-player
  * 库的源码中不会存在我们自己增加的代码段，所以要求首次安装、npm install之后请立即找到自备的这个备份文件，将相应修改
  * 的代码段手动添加到源码中的player.vue中再进行后续操作。（注：为防止官方更新了该文件 请不要用文件覆盖文件）
  *
  * 手动修改的思路：
  * 1, 只在模板中原video 元素的同级 增加了audio 元素，在js 的props 中绑定了一个 media 属性 使用这个属性 来进行video和audio 的切换。
  * 2, 在webstorm 中使用Ctrl+ FileName  查找 player.vue 的路由为： GaiayM3u8.vue -> vue-video-player -> player.vue
  * */
  window.videojs = require('video.js')
  require('video.js/dist/video-js.css')
  var languages = require('./languages.js')
  export default {
    name: 'video-player',
    props: {
      options: {
        type: Object,
        required: true
      },
      /*HQ.Wn 2017-04-25 源码修改: 自增一个用来标识音频还是视频的属性*/
      media:{
        type:Number,
        required:true
      }
    },
    mounted() {
      if (!this.player) {
        this.initialize()
      }
    },
    beforeDestroy() {
      if (this.player) {
        this.dispose()
      }
    },
    methods: {
      initialize() {

        // init
        var self = this
        this.player = null

        // options
        var videoOptions = Object.assign({

          // component options
          start: 0,
          playsinline: false,
          customEventName: 'statechanged',

          // videojs options
          autoplay: false,
          controls: true,
          preload: 'auto',
          fluid: false,
          muted: false,
          width: '100%',
          height: '360',
          language: 'en',
          controlBar: {
            remainingTimeDisplay: false,
            playToggle: {},
            progressControl: {},
            fullscreenToggle: {},
            volumeMenuButton: {
              inline: false,
              vertical: true
            }
          },
          techOrder: ['html5', 'flash'],
          playbackRates: [],
          plugins:{}
        }, this.options)

        // check sources
        /*
         if (!videoOptions.sources || !videoOptions.sources.length) {
         console.warn('Missing required option: "sources".')
         return false
         }
         */

        // add language
        var language = videoOptions.language
        videojs.addLanguage(language, languages[language])

        // ios fullscreen
        var playsinline = videoOptions.playsinline
        if (playsinline) {
          this.$el.children[0].setAttribute('playsinline', playsinline)
          this.$el.children[0].setAttribute('webkit-playsinline', playsinline)
        }

        // emit event
        var emitPlayerState = function (event, value) {
          if (event) {
            self.$emit(event, self.player)
          }
          if (value) {
            var values = {}
            values[event] = value
            self.$emit(videoOptions.customEventName, values)
          }
        }

        // videoOptions
        // console.log(videoOptions)

        // avoid error "VIDEOJS: ERROR: Unable to find plugin: __ob__"
        delete videoOptions.plugins.__ob__;
        this.player = videojs(this.$el.children[0], videoOptions, function() {

          // player readied
          self.$emit('ready', self.player)

          this.on('loadeddata', function() {
            this.muted(videoOptions.muted)
            this.currentTime(videoOptions.start)
            emitPlayerState('loadeddata', true)
          })

          this.on('canplay', function() {
            emitPlayerState('canplay', true)
          })

          this.on('canplaythrough', function() {
            emitPlayerState('canplaythrough', true)
          })

          this.on('play', function() {
            emitPlayerState('play', true)
          })

          this.on('pause', function() {
            emitPlayerState('pause', true)
          })

          this.on('waiting', function() {
            emitPlayerState('waiting', true)
          })

          this.on('playing', function() {
            emitPlayerState('playing', true)
          })

          this.on('ended', function() {
            emitPlayerState('ended', true)
          })

          this.on('timeupdate', function() {
            emitPlayerState('timeupdate', this.currentTime())
          })
        })
      },
      dispose() {
        if (this.player && videojs) {
          this.player.pause && this.player.pause()
          videojs(this.$el.children[0]).dispose()
          if (!this.$el.children.length) {
            var video = document.createElement('video')
            video.className = 'video-js vjs-custom-skin'
            this.$el.appendChild(video)
          }
          this.player = null
        }
      }
    },
    watch: {
      options: {
        deep: true,
        handler(options, oldOptions) {
          this.dispose()
          if (options && options.sources && options.sources.length) {
            this.initialize()
          }
        }
      }
    }
  }
</script>

<style src="./player.css"></style>
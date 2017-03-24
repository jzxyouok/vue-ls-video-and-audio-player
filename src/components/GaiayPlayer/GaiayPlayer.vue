<template>
  <section class="familyNumVideo">
    <img v-bind:data-src="livePoster" style="display:none;width:100%;height:100%">
    <div class="topVBf" style="display:block"></div>
    <div class="videoPlayControl" style="display:block;">
      <video id="video" style="z-index:-1; object-fit: fill;" preload="" controls=""
             webkit-playsinline="" playsinline="" x-webkit-airplay="" width="100%"
             :data-src="liveSource" :src="liveSource"
      >
      </video>
    </div>
    <div class="audioPlayControl" style="display: none;">
      <video id="myVideo" preload="auto"
             style="z-index: -1; object-fit: fill;"
             webkit-playsinline="" playsinline=""
             x-webkit-airplay="" width="100%">
      </video>
      <div class="familyNumBoFang" style="display: block;">
        <span class="familyNumBfBtn"></span>
        <span class="familYinpin" style="display: none;"></span>
        <div class="familyPlay" style="display: none;"></div>
      </div>
      <div class="control" style="display: block; bottom: 0px;">
        <div class="btmControl">
          <div class="btnPlay btn paused" title="Play/Pause video">
            <span class="icon-pause"></span>
          </div>
          <div class="progress">
            <span class="bufferBar"></span>
            <p class="timeBar"></p>
          </div>
          <div class="timeNum"><span class="current">00:00</span>/<span class="duration"></span></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
  /*从这次改版拷过来的：因为播放按钮应该属于播放器本身 而不应该和播放器平级显示*/
  .topVBf {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -.6rem 0 0 -.6rem;
    width: 1.2rem;
    height: 1.2rem;
    background: rgba(0, 0, 0, .4);
    border-radius: 100%;
    display: block;
  }

  .topVBf::after {
    width: .44rem;
    height: .5rem;
    background-position: 0 -3.81rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -.25rem 0 0 -.2rem;
  }

  /*从52family上拷贝过来的*/
  .familyNumVideo {
    width: 100%;
    height: 4.22rem;
    position: relative;
    overflow: hidden;
  }

  .familyNumVideo .pic {
    display: block;
    width: 100%;
    height: 100%;
  }

  .familyNumBoFang {
    position: absolute;
    bottom: 0;
    left: 0;
    top: 0;
    right: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.5);
    display: none;
  }

  .familyNumBfBtn {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -.6rem 0 0 -.6rem;
    width: 1.2rem;
    height: 1.2rem;
    background: rgba(0, 0, 0, .6);
    border-radius: 100%;
    display: block;
  }

  .familyNumBfBtn::after {
    content: "";
    width: .48rem;
    height: .56rem;
    background-position: 0 -.7rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -.28rem 0 0 -.2rem;
  }

  .familyPlay {
    position: absolute;
    left: .2rem;
    bottom: .2rem;
    width: .48rem;
    height: .48rem;
    background: rgba(0, 0, 0, .6);
    border-radius: 100%;
  }

  .familyPlay::after {
    content: "";
    width: .16rem;
    height: .2rem;
    background-position: 0 -3.56rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -.1rem 0 0 -.08rem;
  }

  .familYinpin {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -.6rem 0 0 -.6rem;
    width: 1.2rem;
    height: 1.2rem;
    background: rgba(0, 0, 0, .6);
    border-radius: 100%;
    display: block;
  }

  /*.familYinpin::after{content:"";width:.6rem;height:.5rem;background-position:-1.88rem -.7rem;position: absolute; top: 50%;left: 50%;margin:-.25rem 0 0 -.3rem;}*/
  .familYinpin::after {
    /*background-image: url(/images/live/audioPlay.gif);*/
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center center;
    content: "";
    width: 1.2rem;
    height: .8rem;
    position: absolute;
    top: 20%;
    left: 2%;
  }

  .familyPop {
    position: absolute;
    bottom: 0;
    left: 0;
    top: 0;
    right: 0;
    z-index: 500;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .familyPop_box {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .familyPop_box .btn:active {
    opacity: .95
  }

  .familyPop_box .tit {
    color: #fff;
    font-size: .26rem;
    text-align: center;
    margin-bottom: .4rem;
  }

  .familyPop_box .btn {
    display: inline-block;
    font-size: .32rem;
    text-align: center;
    background: #f51414;
    border-radius: .5rem;
    padding: .15rem .6rem;
    color: #fff;
  }

  .familyNumBoxTit {
    position: relative;
    margin: .1rem .2rem;
  }

  .familyNumBoxTit i {
    color: #fff;
    font-size: .2rem;
    border-radius: 2px;
    padding: .02rem .1rem;
    position: absolute;
    left: 0;
    top: .07rem
  }

  .familyNumBoxTit .zhib {
    background: #f00000;
  }

  .familyNumBoxTit .huif {
    background: #ffa000;
  }

  .familyNumBoxTit .yugao {
    background: #3282fa;
  }

  .familyNumBoxTit h2 {
    font-size: .32rem;
    color: #fff;
    line-height: 1.5;
    text-indent: .7rem;
  }

  .familyNumTips {
    margin: 0 .2rem;
  }

  .familyNumTips li {
    float: right;
    color: #a0a0a0;
    font-size: .24rem;
    position: relative;
    padding-left: .3rem;
    height: .26rem;
    line-height: .26rem;
  }

  .familyNumTips li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: .3rem;
    height: .26rem;
  }

  .familyNumTips li:first-child {
    margin-right: .44rem;
  }

  .familyNumTips .bof::before {
    background-position: 0rem -2.01rem;
  }

  .familyNumTips .time {
    float: left;
  }

  .familyNumTips .time::before {
    background-position: .02rem -2.49rem;
  }

  /*** 音频控件的css (从老版本拷过来的) ***/
  .audioPlay {
    display: none;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 2000;
    width: 56px;
    height: 56px;
    margin-left: -28px;
    margin-top: -28px;
    padding: 0;
    background-repeat: no-repeat;
    background-size: 56px 56px;
    box-sizing: border-box;
    border-radius: 56px;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .audioGifico {
    /*background-image: url(/images/live/audioPlay.gif);*/
  }

  .audioPngico {
    /*background-image: url(/images/live/audioPlay.png);*/
  }

  .audioLivePuse {
    display: none;
    position: absolute;
    right: 15px;
    bottom: 30px;
    z-index: 2000;
    width: 23px;
    height: 23px;
    padding: 0;
    /*background-image: url(/images/live/audio_pause.png);*/
    background-repeat: no-repeat;
    background-size: 100%;
    box-sizing: border-box;
  }

  /* control holder */
  /* liushuai 默认不显示*/
  .control {
    display: none;
    width: 100%;
    color: #ccc;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 40px;
    z-index: 200;
    background: rgba(0, 0, 0, 0.3);
  }

  /* control bottom part */
  .btmControl {
    width: 100%;
    clear: both;
    height: 40px; /*  display: -webkit-box; */
  }

  .control .btnPlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 45px;
    height: 40px;
    background: rgba(0, 0, 0, 0.5);
    display: -webkit-box;
    -webkit-box-align: center;
    -webkit-box-pack: center;
  }

  .control .icon-play {
    width: 100%;
    height: 100%;
    display: block;
    /*background: url(/images/live/icon-play.png) no-repeat center;*/
    background-size: 100%;
  }

  .control .icon-playno {
    /*background: url(/images/live/icon-play1.png) no-repeat center;*/
    background-size: 100%;
  }

  .control .icon-pause {
    width: 100%;
    height: 100%;
    display: block;
    /*background: url(/images/live/icon-pause.png) no-repeat center;*/
    background-size: 100%;
  }

  .control .selected {
    font-size: 15px;
    color: #ccc;
  }

  .control .sound {
    width: 30px;
    height: 30px;
    float: left;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(0, 0, 0, 0.7);
    border-left: none;
    box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.5);
    cursor: pointer;
  }

  .control .btnFS {
    width: 30px;
    height: 30px;
    border-radius: 0 6px 6px 0;
    float: left;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(0, 0, 0, 0.7);
    border-left: none;
    box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.5);
  }

  /* PROGRESS BAR CSS */
  .timeNum {
    width: 80px;
    height: 40px;
    line-height: 40px;
    text-align: left;
    font-size: 12px;
    position: absolute;
    top: 0;
    right: 0;
  }

  .current {
  }

  .duration {
  }

  .progress {
    height: 2px;
    position: absolute;
    margin-top: -1px;
    top: 50%;
    left: 56px;
    right: 98px;
    cursor: pointer;
    background: #fff;
    border-radius: 10px;
  }

  .progress span {
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    border-radius: 10px;
  }

  .timeBar {
    z-index: 10;
    position: absolute;
    top: -8px;
    left: -8px;
    width: 18px;
    height: 18px;
    /*background: url(/images/live/timeBar.png) no-repeat center;*/
    background-size: 100%;
  }

  .bufferBar {
    z-index: 5;
    width: 0;
    background: #3c8cfa;
  }

  /* control bottom part */
  .btmControl {
    width: 100%;
    clear: both;
    height: 40px; /*  display: -webkit-box; */
  }

  /*!*直播已被删除提示*!*/
  /*.liveDelTip {*/
  /*font-size: .28rem;*/
  /*color: #a0a0a0;*/
  /*position: absolute;*/
  /*left: 50%;*/
  /*top: 50%;*/
  /*-webkit-transform: translate(-50%, -50%);*/
  /*transform: translate(-50%, -50%);*/
  /*padding-top: 2.08rem;*/
  /*text-align: center;*/
  /*}*/

  /*.liveDelTip::before {*/
  /*content: "";*/
  /*position: absolute;*/
  /*top: 0;*/
  /*left: 50%;*/
  /*margin-left: -.815rem;*/
  /*width: 1.63rem;*/
  /*height: 1.63rem;*/
  /*background: url(../../images/52family/liveDelTip.png) no-repeat center;*/
  /*background-size: 100%;*/
  /*}*/
</style>

<script>
  export default {
    name: 'gaiayplayer',
    props: {
      liveSource: {
        type: String,
        default: ""
      },
      livePoster: {
        type: String,
        default: ""
      }
    },
    data() {
      return {}
    },
    computed: {
    },
    created(){
      console.log("初始化GaiayPlayer");
      console.log(this.livePoster);
      console.log(this.liveSource);
    }
  }
</script>

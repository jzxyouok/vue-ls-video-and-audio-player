<template>
  <div id="app">
    <article class="topVideo">
      <span class="topVSub">预告</span>
      <img :src="liveInfo.pic" style="display:block;width:100%;height:100%">
    </article>
    <article class="mainCont mainCont-yg">
      <section class="noticeTime">
        <count-down :targetTime="liveInfo.startTime" :callBack="countDownEvent"></count-down>
        <button class="noticeTimeBtn" @click="popShareLayer">呼叫小伙伴一起看直播</button>
      </section>
      <section class="liveInfo clearfix">
        <h1 class="liveInfoTit twoline_text">{{liveInfo.title}}</h1>
        <div class="introduction">
          <div class="introCont">
            {{introCont}}
          </div>
          <p class="introArrow" @click="introAnimationEvent">箭头</p>
          <!--<p class="introArrow down">箭头</p>向下-->
        </div>
        <dl class="liveInfoTuig pubFlex">
          <dt><img :src="circleLogo"></dt>
          <dd class="oneline_text autoFlex" @click="linkCirclePageEvent">{{circleName}}</dd>
        </dl>
      </section><!-- 信息 -->
      <article class="moreList">
        <h2 class="moreListTit">更多直播</h2>
        <section class="moreListCont" id="moreListCont">
          <dl>
            <dt><img src="./images/del_img/1.jpg" alt=""><span class="tips blue">预告</span><em class="moreListSp">视频ICON</em></dt>
            <dd>
              <h2 class="tit">陈家大宝不鲁小朋友的创意童年回忆记录</h2>
              <ul class="liveInfoSub clearfix">
                <li class="date fl">2017-02-12&nbsp;10:21</li>
                <li class="num fr">128</li>
              </ul>
            </dd>
          </dl>
          <dl>
            <dt><img src="./images/del_img/1.jpg" alt=""><span class="tips blue">预告</span><em class="moreListSp">视频ICON</em></dt>
            <dd>
              <h2 class="tit">陈家大宝不鲁小朋友的创意童年回忆记录</h2>
              <ul class="liveInfoSub clearfix">
                <li class="date fl">2017-02-12&nbsp;10:21</li>
                <li class="num fr">128</li>
              </ul>
            </dd>
          </dl>
          <dl>
            <dt><img src="./images/del_img/1.jpg" alt=""><span class="tips yellow">回放</span><em class="moreListSp">视频ICON</em></dt>
            <dd>
              <h2 class="tit">陈家大宝不鲁小朋友的创意童年回忆记录</h2>
              <ul class="liveInfoSub clearfix">
                <li class="date fl">2017-02-12&nbsp;10:21</li>
                <li class="num fr">128</li>
              </ul>
            </dd>
          </dl>
          <dl>
            <dt><img src="./images/del_img/1.jpg" alt=""><span class="tips red">直播</span><em class="moreListSp">视频ICON</em></dt>
            <dd>
              <h2 class="tit">陈家大宝不鲁小朋友的创意童年回忆记录</h2>
              <ul class="liveInfoSub clearfix">
                <li class="date fl">2017-02-12&nbsp;10:21</li>
                <li class="num fr">128</li>
              </ul>
            </dd>
          </dl>
        </section>
      </article><!-- 更多视频 -->
    </article><!-- 内容 -->
    <section class="sharePop sharePic" style="display:none">
      <img src="./images/liveDetails/sharePic.png"/>
    </section><!-- 分享弹出层 -->
    <section class="sharePop" style="display:none">
      <div class="sharePopBox yugaoSucc">
        <img src="./images/liveDetails/newLive.png" class="yugaoSuccPic"/>
        <h2 class="yugaoSuccTit">预约成功</h2>
        <h3 class="yugaoSuccDown">下载APP，接收直播提醒</h3>
        <button class="yugaoSuccBtn" @click="downAppEvent">立即下载</button>
        <button class="yugaoSuccClose">X</button>
      </div>
    </section><!-- 预约成功弹出层 -->
    <!--<button class="fixedFd fixedFdRed" @click="operButtonEvent">开通会员预约直播</button>-->
    <oper-button></oper-button>
  </div>
</template>
<script>
  import 'common/css/reset.css';
  import 'common/js/reset.js';
  import utils from 'common/js/utils.js';
  import 'common/js/wxShare/wxHelper-6.1.js';
  import 'common/js/wxShare/oauth.js';
  import CountDown from 'components/Herald/CountDown';
  import OperButton from 'components/Herald/OperButton';
  export default {
    name: 'app',
    components: {
      CountDown,OperButton
    },
    created(){
      this.loadStaticData();
      this.loadCircleInfo();
      this.loadIntroCont();
    },
    data () {
      return {
        userId: '',
        circleId: '',
        circleName: '社群名称得取。。',
        circleLogo: ' ',
        liveInfo: {},   //预告信息
        introCont: '直播简介得取。。。。。', //社群介绍
      }
    },
    methods: {
      /*
       * 请求社群信息
       * */
      loadCircleInfo(){
        var url = '/api/v2/circle/info';
        var params = {circleId: this.circleId, dataType: 2}
        this.$http.get(url, {params: params})
        .then((res)=> {
          var data = res.body;
          this.circleLogo = data.logo;
          this.circleName = res.name;
        })
      },

      /*
       * 请求直播简介
       * */
      loadIntroCont(){
        var url = "";
        var params = {liveId: this.liveInfo.id};
        this.$http.get(url, {params: params})
        .then((response) => {
          var data = response.body;
          if (data.descs) {
            this.introCont = data.descs[params.liveId];
          }
        })
      },

      /**
       * 转存静态化数据
       */
      loadStaticData(){
        this.liveInfo = window.liveInfo;
        this.circleId = window.circleId;
        this.userId = window.userId;
      },

      /**
       * 下载App 调用事件
       */
      downAppEvent(){
          alert("下载App");
      },

      /**
       * 点击社群名称跳转页面事件
       */
      linkCirclePageEvent(){
          alert("跳转社群主页");
      },

      /**
       * 简介动画点击事件
       */
      introAnimationEvent(){

      },

      /**
       * 倒计时结束执行动作
       */
      countDownEvent(){
        console.log("倒计时结束");
      },

      /**
       * 弹出提示分享遮罩层
       */
      popShareLayer(){
        alert("提示分享");
      },

      /**
       * 弹出预约成功提示层
       */
      popSuccessLayer(){
        alert("预约成功");
      }

    }
  }
</script>
<!--
     1.底部按扭状态的切换细节：触发路径、由哪个变量控制、
      ----1.开通会员预约直播 2.已预约，下载APP接收直播提醒 3.下载APP，看更多精彩直播 4.加入社群预约直播 5.支付 8.88 预约直播
     2.点击社群名称 跳转地址是否为社群主页，url是什么
     3.倒计时结束后 执行什么动作
     4.分享弹出层怎么关闭
     5.动画代码位置
-->
<style>
  /*吸底按扭*/
  .fixedFd {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 10;
    text-align: center
  }

  .fixedFdRed {
    text-align: center;
    font: .32rem/.9rem 'Microsoft YaHei';
    height: .9rem;
    color: #fff;
    background: #fc4e52;
  }

  /*点击按下效果*/
  .topVFail .btn:active, .sharePopBtn:active, .noticeTimeBtn:active, .fixedFdRed:active, .yugaoSuccBtn:active {
    opacity: .85
  }

  /*伪类*/
  .topMenuTabs li::before, .liveInfoSub li::before, .moreListSp::after, .topVLive::before, .topVFail .btn::before, .sharePopCent span::after, .noticeTimeBtn::before, .yugaoSuccTit::before, .yugaoSuccClose::after {
    display: block;
    content: "";
    position: absolute;
    left: 0;
  }

  /*社群公用背景*/
  .topMenuTabs li::before, .topMenuTool li, .liveInfoSub li::before, .introArrow, .moreListSp::after, .topVBf::after, .topVFail .btn::before, .sharePopCent span::after, .noticeTimeBtn::before, .yugaoSuccTit::before, .yugaoSuccClose::after {
    background-image: url(./images/liveDetails/pubBack.png);
    background-repeat: no-repeat;
    background-size: 1rem 5rem;
  }

  /*============头部============start*/
  /*头部视频*/
  .topVideo {
    width: 100%;
    height: 4.22rem;
    position: fixed;
    top: 0;
    z-index: 5
  }

  .topVSub {
    position: absolute;
    left: 0;
    top: .2rem;
    display: inline-block;
    background: rgba(0, 0, 0, .4);
    font-size: .2rem;
    border-top-right-radius: .5rem;
    border-bottom-right-radius: .5rem;
    padding: .05rem .14rem .06rem .17rem;
    color: #fff;
  }

  .topVLive {
    padding-left: .24rem;
  }

  .topVLive::before {
    width: .08rem;
    height: .08rem;
    background: #f04640;
    content: "";
    border-radius: 100%;
    left: .1rem;
    top: 50%;
    margin-top: -.04rem;
  }

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
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    text-align: center;
    width: 90%
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

  /*各种状态*/
  .topVStatus {
    background: rgba(0, 0, 0, .4);
  }

  .topVStatusCont .tit {
    font-size: .32rem;
    opacity: 1
  }

  .topVStatusCont .btn {
    font-size: .32rem;
    line-height: .8rem;
    min-width: 3rem;
    height: .8rem;
    padding: 0 .55rem;
    border-radius: .5rem;
    background: #db423d;
    color: #fff;
    text-align: center;
  }

  .topVStatusForm {
    text-align: center;
  }

  .topVStatusForm .tex {
    height: .8rem;
    width: 2rem;
    padding: 0 .2rem;
    font-size: .32rem;
    line-height: .8rem;
    background: #fff;
    border-top-left-radius: .5rem;
    border-bottom-left-radius: .5rem;
  }

  .topVStatusForm .ok {
    height: .8rem;
    width: 1.2rem;
    font-size: .32rem;
    line-height: .8rem;
    background: #fff;
    border-top-right-radius: .5rem;
    border-bottom-right-radius: .5rem;
    background: #db433e;
    text-align: center;
    color: #fff;
  }

  /*菜单栏*/
  .topMenu {
    width: 100%;
    height: 1rem;
    position: fixed;
    top: 4.22rem;
    border-bottom: 1px solid #e6e6e6;
    background-color: #fff;
    z-index: 5
  }

  .topMenuTabs {
    padding-left: .3rem;
  }

  .topMenuTabs li {
    float: left;
    font-size: .3rem;
    line-height: 1rem;
    height: 1rem;
    position: relative;
    margin-right: .58rem;
  }

  .topMenuTabs .xq {
    padding-left: .58rem;
  }

  .topMenuTabs .lt {
    padding-left: .69rem;
  }

  .topMenuTabs li:last-child {
    margin-right: 0
  }

  .topMenuTabs .active {
    border-bottom: 2px solid #f04640
  }

  .topMenuTabs li::before {
    width: .46rem;
    height: .38rem;
    top: 50%;
  }

  .topMenuTabs .xq::before {
    background-position: .05rem 0rem;
    margin-top: -.16rem;
  }

  .topMenuTabs .lt::before {
    background-position: 0 -.64rem;
    margin-top: -.19rem;
  }

  .topMenuTool {
    margin-right: .25rem;
    padding-top: .29rem;
  }

  .topMenuTool li {
    float: right;
    text-indent: -9999px;
    width: .44rem;
    height: .44rem;
    margin-left: .55rem
  }

  .topMenuTool li:last-child {
    margin-left: 0
  }

  .topMenuTool .shang {
    background-position: 0 -1.26rem;
  }

  .topMenuTool .share {
    background-position: .04rem -1.9rem;
  }

  /*============头部============end*/
  /*============详情============start*/
  .mainCont {
    margin-top: 5.22rem;
    padding: 0 .3rem;
    position: relative;
    z-index: 0
  }

  /*视频信息*/
  .liveInfo {
    padding: .3rem 0;
  }

  .liveInfoTit {
    font-size: .36rem;
    line-height: .44rem;
    margin-bottom: .28rem;
  }

  .liveInfoSub {
    height: .24rem;
    margin-bottom: .18rem
  }

  .liveInfoSub li {
    font-size: .23rem;
    line-height: .24rem;
    position: relative;
    margin-right: .62rem;
    color: #a0a0a0;
    padding-left: .33rem;
  }

  .liveInfoSub li:last-child {
    margin-right: 0
  }

  .liveInfoSub li::before {
    width: .24rem;
    height: .24rem;
    top: 50%;
    margin-top: -.12rem;
  }

  .liveInfoSub .date::before {
    background-position: -.76rem 0rem;
  }

  .liveInfoSub .num::before {
    background-position: -.76rem -.36rem;
  }

  .introduction {
    margin-bottom: .15rem;
  }

  .introCont {
    font-size: .28rem;
    line-height: .4rem;
    color: #a0a0a0;
  }

  .introArrow {
    width: .4rem;
    height: .4rem;
    background-position: -.67rem -1.75rem;
    margin: 0 auto;
    text-indent: -9999px;
  }

  .introArrow.down {
    background-position: -.67rem -2.08rem;
  }

  .liveInfoTuig dt {
    width: .6rem;
    height: .6rem;
  }

  .liveInfoTuig dt img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
    border: 1px solid #f8f8f8;
  }

  .liveInfoTuig dd {
    font-size: .28rem;
    color: #646464;
    line-height: .6rem;
    margin-left: .3rem;
  }

  /*更多视频 */
  .moreList {
    padding: .3rem 0;
    border-top: 1px solid #e6e6e6
  }

  .moreListTit {
    font-size: .32rem;
    margin-bottom: .22rem;
  }

  .moreListCont dl {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    margin-bottom: .2rem;
  }

  .moreListCont dl:last-child {
    margin-bottom: 0;
  }

  .moreListCont dl:active {
    background: #f3f3f3;
  }

  .moreListCont dl:last-child {
    border: none;
  }

  .moreListCont dt {
    position: relative;
    width: 2.8rem;
    height: 1.6rem;
    overflow: hidden;
  }

  .moreListCont dt img {
    width: 100%;
    height: 100%;
  }

  .moreListCont dt .tips {
    display: inline-block;
    padding: .02rem .1rem;
    font-size: .2rem;
    color: #fff;
    position: absolute;
    top: .1rem;
    left: .1rem;
    border-radius: 2px;
  }

  .moreListCont dt .blue {
    background: #3282fa;
  }

  .moreListCont dt .red {
    background: #f00000;
  }

  .moreListCont dt .yellow {
    background: #ffa000;
  }

  .moreListCont dd {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    margin-left: .2rem;
    position: relative;
  }

  .moreListCont dd .tit {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #333;
    font-size: .32rem;
    line-height: 1.5;
  }

  .moreListCont dd .times {
    font-size: .24rem;
    color: #969696;
    height: .28rem;
    line-height: .28rem;
    padding-left: .36rem;
    background-position: 0 -.86rem;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .moreListSp {
    display: block;
    text-indent: -9999px;
    position: absolute;
    bottom: .08rem;
    right: .08rem;
    border-radius: 100%;
    background-color: rgba(0, 0, 0, .4);
    width: .28rem;
    height: .28rem;
  }

  .moreListSp::after {
    width: .16rem;
    height: .12rem;
    background-position: -.76rem -2.55rem;
    left: 50%;
    top: 50%;
    margin: -.06rem 0 0 -.08rem;
  }

  .moreListCont .liveInfoSub {
    margin: 0;
    position: absolute;
    bottom: .02rem;
  }

  .moreListFree {
    font-size: .28rem;
    color: #a0a0a0;
    text-align: center;
    padding-top: 3rem;
  }

  /*无数据 */
  .moreListFree a {
    color: #f04640
  }

  /*分享弹出层*/
  .sharePop {
    position: fixed;
    z-index: 9999;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: rgba(0, 0, 0, .4);
  }

  .sharePopBox {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: 72%;
    background: #fff;
    border-radius: .3rem;
  }

  .sharePopCent {
    padding: .35rem 6%;
    font-size: .28rem;
    line-height: .44rem;
    color: #a0a0a0;
    border-bottom: 1px solid #dadade
  }

  .sharePopCent p {
    margin-bottom: .13rem;
    line-height: .44rem;
  }

  .sharePopCent span {
    color: #323232;
    display: inline-block;
    padding-left: .62rem;
    position: relative;
    height: .44rem;
  }

  .sharePopCent span::after {
    width: .44rem;
    height: .44rem;
    top: 0;
    left: .08rem;
  }

  .sharePopCent .sp01::after {
    background-position: 0 -3.19rem;
  }

  .sharePopCent .sp02::after {
    background-position: 0 -2.55rem;
  }

  .sharePopBtn {
    display: block;
    width: 100%;
    height: .9rem;
    font-size: .34rem;
    line-height: .9rem;
    color: #007aff;
    text-align: center;
  }

  /*============详情============end*/
  /*============预告（继承详情样式）============start*/
  .mainCont-yg {
    margin-top: 4.22rem;
    padding-bottom: .9rem;
  }

  /*预告时间*/
  .noticeTime {
    text-align: center;
    padding: .35rem 0 .25rem 0
  }

  .noticeTimeBtn {
    font-size: .32rem;
    line-height: .8rem;
    border-radius: .5rem;
    padding: .05rem .14rem .06rem .17rem;
    color: #4fc6f5;
    padding: 0 .64rem 0 1.24rem;
    height: .8rem;
    border: 1px solid #4fc6f5;
    position: relative;
  }

  .noticeTimeBtn::before {
    width: .39rem;
    height: .36rem;
    left: .72rem;
    top: 50%;
    margin-top: -.18rem;
    background-position: -.61rem -3.2rem;
  }

  /*预约成功弹出层*/
  .yugaoSucc {
    width: 74%;
    height: 6.7rem;
    text-align: center;
  }

  .yugaoSuccPic {
    display: block;
    width: 100%;
    border-top-left-radius: .3rem;
    border-top-right-radius: .3rem;
    margin-bottom: .45rem;
  }

  .yugaoSuccTit {
    display: inline-block;
    font-size: .32rem;
    line-height: .36rem;
    height: .36rem;
    color: #a0a0a0;
    padding-left: .39rem;
    position: relative;
    margin-bottom: .18rem;
  }

  .yugaoSuccTit::before {
    width: .31rem;
    height: .31rem;
    top: 50%;
    left: 0;
    margin-top: -.13rem;
    background-position: -.68rem -3.63rem
  }

  .yugaoSuccDown {
    text-align: center;
    font-size: .34rem;
    font-weight: bold;
    margin-bottom: .32rem;
  }

  .yugaoSuccBtn {
    font-size: .32rem;
    line-height: .7rem;
    width: 2.8rem;
    height: .7rem;
    border-radius: .5rem;
    background: #ff4c4d;
    color: #fff;
    text-align: center;
  }

  .yugaoSuccClose {
    position: absolute;
    bottom: -.8rem;
    left: 50%;
    margin-left: -.28rem;
    width: .56rem;
    height: .56rem;
    border: .02rem solid #fff;
    border-radius: 100%;
    text-indent: -9999px;
  }

  .yugaoSuccClose::after {
    width: .2rem;
    height: .2rem;
    background-position: -.79rem -4rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -.1rem 0 0 -.1rem;
  }

  .sharePic {
    background: rgba(0, 0, 0, .8);
  }

  .sharePic img {
    display: block;
    position: absolute;
    width: 100%;
    left: 0;
    right: 0;
    top: .6rem;
  }

  /*分享弹出层*/
  /*============预告（继承详情样式）============end*/
</style>

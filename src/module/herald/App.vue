<template>
  <div id="app">
    <article class="topVideo">
      <span class="topVSub topVYgao">预告</span>
      <img v-lazy="liveInfo.pic" style="display:block;width:100%;height:100%">
    </article>
    <article class="mainCont mainCont-yg">
      <section class="noticeTime" v-if="timer != 0">
        <count-down :targetTime="liveInfo.startTime" :callBack="countDownEvent"></count-down>
        <button class="noticeTimeBtn" @click="shareFlag = true">呼叫小伙伴一起看直播</button>
      </section>
      <h3 class="moreListFree" v-if="descError == 0">数据获取失败，点击<a @click="descError = -1" href="javascript:;">重试</a></h3>
      <d-summary :circleId="circleId" :followerId="followerId" :liveInfo="liveInfo" v-if="descError == -1"></d-summary>
      <live-list></live-list>
    </article><!-- 内容 -->
    <section class="sharePop sharePic" v-show="shareFlag" @click="shareFlag=false">
      <img src="/static/images/herald/sharePic.png"/>
    </section><!-- 分享弹出层 -->
    <oper-button :utils="utils" :liveName="liveName" :circleId="circleId" :role="role" :view="liveInfo.view" :liveId="liveInfo.id"
                 :price="price" :userId="userId" :followerId="followerId" :join="join"></oper-button>
    <mark-layer :addGroup="addGroup" :popuText="popuText"></mark-layer>
  </div>
</template>
<script>
  import 'common/css/reset.css';
  import 'common/js/reset.js';
  import utils from 'common/js/utils.js';
  import 'common/js/wxShare/wxHelper-6.1.js';
  import {secondShare} from 'common/js/wxShare/secondShare.js';
  import zmOauth from 'common/js/wxShare/oauth.js';
  import CountDown from 'components/Herald/CountDown';
  import OperButton from 'components/Herald/OperButton';
  import DSummary from 'components/DSummary/DSummary';
  import LiveList from 'components/LiveList/LiveList';
  import MarkLayer from 'components/MarkLayer/MarkLayer'
  export default {
    name: 'app',
    components: {
      CountDown, OperButton, LiveList, DSummary, MarkLayer
    },
    created(){
      this.loadStaticData();
      if (this.userId) {
        this.getUserRole();
        this.getFollowerId();
        this.liveVisitCount();//直播上报统计
      }
    },
    data () {
      return {
        addGroup: 2,//0:失败 1:成功 -1：异常
        userId: '',
        utils: window.utils,
        role: 3,
        join: 0,
        price: 0,
        followerId: '',
        timer:1,
        liveName:'',
        circleId: utils._getQueryString('circleId'),
        liveInfo: {},   //预告信息
        shareFlag: false,
        liveDetail: {},
        descError: -1,
        liveBa: 1,
      }
    },
    methods: {
      /**
       * 转存静态化数据
       */
      loadStaticData(){
        if (window.liveInfo) {
          this.liveInfo = window.liveInfo;
        } else {
          this.liveInfo = JSON.parse(sessionStorage.getItem("list"));
        }
        this.circleId = utils._getQueryString('circleId');
        this.followerId = utils._getQueryString('followerId');
        sessionStorage.setItem('circleId', this.circleId);
        window.circleInfo.id = this.circleId;
        this.userId = window.userId;
        this.liveName = this.liveInfo.title;
        if (this.liveInfo.price != undefined) {
          this.price = this.liveInfo.price;
        }
      },
      getUserRole(){//获取用户角色
        this.$http.get(requstUrl + '/api/v2/circle/member/role/', {params: {"circleId": this.circleId,"userId": this.userId}})
          .then((res) => {
          var data = res.body;
        var code = data.code;
        var role = data.role;
        var msg = data.message;
        if (code == 0) {
          this.role = role;
          console.log(role);
        } else {
          console.log(msg);
        }
      })
      },
      /**
       * 判断用户是否推客资格
       **/
      getFollowerId(){
        this.$http.get("/api/sf/" + this.circleId + "/belong?userId=" + this.userId + "&circleIds=" + this.circleId + "&sfType=1")
          .then((res) => {
          if (res.body.code == 0){
          let data = res.body;
          if (data.result) {
            if (data.result.length >= 1) {
              this.followerId = this.userId;
              sessionStorage.setItem("followerId", this.userId);
            }
          }
        }else{
          console.log(res);
        }
      })
      .catch(function (response) {
          this.getCricleFollower();
          console.log(response);
        })
      },
      /**
       * 获取社群是否开启推客资格
       **/
      getCricleFollower(){
        this.$http.get("/api/sf/" + this.circleId + "/condition")
          .then((res) => {
          if (res.body.code == 0){
            let data = res.body;
            if (data.joinState == 1) {
            }
          }else{
            console.log(res);
          }
      })
      .catch(function (response) {
          console.log(response);
        })
      },
      /**
       * 直播上报统计
       */
      liveVisitCount() {
        this.$http.post("/api/zm/w/live/statistics",{params:{"circleId": this.circleId,"userId": this.userId, "liveId": this.liveInfo.id}},{emulateJSON:true})
          .then((res) => {
          if (res.body.code == 0){
          }else{
          console.log(res);
          }
        })
        .catch(function (response) {
          console.log(response);
        })
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
/*herald.vue*/
 /*点击按下效果*/
  .topVFail .btn:active, .sharePopBtn:active, .noticeTimeBtn:active, .fixedFdRed:active, .yugaoSuccBtn:active {
    opacity: .85
  }

  /*伪类*/
  .topMenuTabs li::before, .liveInfoSub li::before, .moreListSp::after, .topVLive::before, .topVFail .btn::before, .sharePopCent span::after, .noticeTimeBtn::before, .yugaoSuccTit::before, .yugaoSuccClose::after ,.topVLive::before,.topVHf::before,.topVYgao::before{
    display: block;
    content: "";
    position: absolute;
  }

  /*社群公用背景*/
  .topMenuTabs li::before, .topMenuTool li, .liveInfoSub li::before, .introArrow, .moreListSp::after, .topVBf::after, .topVFail .btn::before, .sharePopCent span::after, .noticeTimeBtn::before, .yugaoSuccTit::before, .yugaoSuccClose::after,.liveInfoTuig dd:after,,.liveInfoTuig dd:after {
    background-image: url(/static/images/pubBack.png);
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

.topVSub{position: absolute;left:0;top:.2rem;display:inline-block;background:rgba(0,0,0,.4);font-size:.2rem;border-top-right-radius: .5rem;border-bottom-right-radius: .5rem;padding:.05rem .14rem .06rem .24rem;color: #fff;z-index: 10;}
.topVLive::before,.topVHf::before,.topVYgao::before{width:.08rem;height:.08rem;background:#f04640;content:"";border-radius:100%;left:.1rem;top:50%;margin-top:-.04rem;}
.topVHf::before{background:#ff9600;}/*回放*/
.topVYgao::before{background:#3282fa;}/*预告*/
 .topVBf{position: absolute; top: 50%;left: 50%;margin:-.6rem 0 0 -.6rem;  width:1.2rem;height: 1.2rem;background:rgba(0,0,0,.4);border-radius:100%;display: block;}
.topVBf::after{width:.4rem;height:.54rem;background-position:0 -3.8rem;position: absolute; top: 50%;left: 50%;margin:-.25rem 0 0 -.15rem;}

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
    border-bottom: 2px solid #f03c38
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
    padding: 0 .3rem 0.9rem;
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
    left: 0;
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

  .liveInfoTuig dd{font-size: .28rem;color: #646464;line-height: .6rem;margin-left: .3rem;position: relative;}
.liveInfoTuig dd:after{content:"";position: absolute;width: .14rem;height: .22rem;background-position:-.78rem -1.46rem;top:50%;right: 0;margin-top:-.11rem; }
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
    border-radius:4px;
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
    height: 3.8rem;
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
    height: 4.67rem;
    left: 0;
    right: 0;
    top: .4rem;
  }

  /*分享弹出层*/
  /*============预告（继承详情样式）============end*/
</style>

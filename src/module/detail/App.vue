<template>
  <div id="app">
    <article class="topMenu clearfix">
      <ul class="topMenuTabs fl">
        <li v-bind:class="{'active':0===selected}" class="xq" @click="tabChange(0)">详情</li>
        <li v-bind:class="{'active':1===selected}" class="lt" @click="tabChange(1)">聊天</li>
      </ul>
      <ul class="topMenuTool fr">
        <li class="share" @click="shareStatus = 0">分享</li>
        <li class="shang">赏</li>
      </ul>
    </article><!-- 菜单栏 -->
    <div  v-show="selected==0">
      <article class="mainCont">
        <h3 class="moreListFree" v-if="descError  == 0">数据获取失败，点击<a @click="" href="javascript:;">重试</a></h3>
        <d-summary  v-if="descError == -1"></d-summary>
      </article>
      <live-list v-if="descError == -1"></live-list>
    </div>
    <group-chat  v-show="selected==1"></group-chat>

    <section class="sharePop" v-if="shareStatus == 0">
      <div class="sharePopBox">
        <div class="sharePopCent">
          <p>1.点击页面右上</p>
          2.选择<span class="sp01">发送给好友</span>或<span class="sp02">朋友圈</span>
          <p></p>
        </div>
        <button class="sharePopBtn" @click="shareStatus = -1">关闭</button>
      </div>
    </section>
  </div>
</template>

<script>
  import 'common/css/reset.css';
  import 'common/js/reset.js';
  import utils from 'common/js/utils.js';
  import 'common/js/wxShare/wxHelper-6.1.js';
  import 'common/js/wxShare/secondShare.js';
  import zmOauth from 'common/js/wxShare/oauth.js';
  import {tryAgin} from 'common/js/httpErr.js';
  import DSummary from 'components/DSummary/DSummary';
  import LiveList from 'components/LiveList/LiveList';
  import GroupChat from 'components/GroupChat/GroupChat';
  export default {
    name: 'app',
    components: {
      DSummary, LiveList,GroupChat
    },
    data () {
      return {
        liveDetail: {},
        liveBa: 1,
        shareStatus:-1,//分享的弹窗状态 0:显示 -1:不显示
        descError:-1,//0:显示 -1:不显示
        tabIndex:true,
        selected:0,
      }
    },
    created: function () {
      this.liveDetail = JSON.parse(sessionStorage.getItem("list"));
      console.log(this.liveDetail);
    },
    methods: {
      tabChange(num){
          this.selected = num;
      },
      getDescByLiveId(){
      }
    }
  }
</script>

<style>
  /*伪类*/
  .topMenuTabs li::before, .liveInfoSub li::before, .moreListSp::after, .topVLive::before, .topVFail .btn::before, .sharePopCent span::after {
    display: block;
    content: "";
    position: absolute;
    left: 0;
  }

  /*社群公用背景*/
  .topMenuTabs li::before, .topMenuTool li, .liveInfoSub li::before, .introArrow, .moreListSp::after, .topVBf::after, .topVFail .btn::before, .sharePopCent span::after {
    background-image: url(../detail/images/pubBack.png);
    background-repeat: no-repeat;
    background-size: 1rem 5rem;
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

  .mainCont {
    margin-top: 5.22rem;
    padding: 0 .3rem;
    position: relative;
    z-index: 0
  }
  .moreListFree{font-size:.28rem;color:#a0a0a0;text-align: center; font-weight: normal; padding-top:3rem;}/*无数据 */
  .moreListFree a{color:#f04640}
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
</style>

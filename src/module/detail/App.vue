<template>
  <div id="app">
    <article class="topMenu clearfix">
      <ul class="topMenuTabs fl">
        <li class="xq active">详情</li>
        <li class="lt">聊天</li>
      </ul>
      <ul class="topMenuTool fr">
        <li class="share">分享</li>
        <li class="shang">赏</li>
      </ul>
    </article><!-- 菜单栏 -->
    <article class="mainCont">
      <d-header></d-header>
    </article>
    <live-list></live-list>
  </div>
</template>

<script>
  import 'common/css/reset.css';
  import 'common/js/reset.js';
  import DHeader from 'components/DHeader/DHeader';
  import LiveList from 'components/LiveList/LiveList';
  export default {
    name: 'app',
    components: {
      DHeader, LiveList
    },
    data () {
      return {
        liveDetail: {},
        liveBa: 1,
      }
    },
    created: function () {
      this.get();
    },
    methods: {
      get(){
        this.liveDetail = JSON.parse(sessionStorage.getItem("list"));
        console.log(this.liveDetail);
      }
    }
  }
</script>

<style>
  /*伪类*/
  .topMenuTabs li::before, .liveInfoSub li::before, .moreListSp::after, .topVLive::before, .topVFail .btn::before {
    display: block;
    content: "";
    position: absolute;
    left: 0;
  }

  /*社群公用背景*/
  .topMenuTabs li::before, .topMenuTool li, .liveInfoSub li::before, .introArrow, .moreListSp::after, .topVBf::after, .topVFail .btn::before {
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
</style>

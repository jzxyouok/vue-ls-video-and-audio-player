<template>
  <section class="liveInfo clearfix">
    <h1 class="liveInfoTit twoline_text">{{liveDetail.title}}</h1>
    <ul class="liveInfoSub clearfix">
      <li class="date fl">2017-02-12&nbsp;10:21</li>
      <li class="num fl">128</li>
    </ul>
    <div class="introduction">
      <div class="introCont">
        东寨港是在300多年前，即1605年的一次大地震中，地层下陷形成的，似漏斗，滩面缓平，微呈阶梯状，有许多曲折迂回的潮水沟分布其间。<br/>
        东寨港是在300多年前，即1605年的一次大地震中，地层下陷形成的，海岸线曲折多弯，海湾开阔，形状似漏斗海岸线曲折多弯，海湾开阔，形状似漏斗，滩面缓平，微呈阶梯状，有许多曲折迂回的潮水沟分布其间。
      </div>
      <p class="introArrow">箭头</p>
      <!--<p class="introArrow down">箭头</p>向下-->
    </div>
    <dl class="liveInfoTuig pubFlex">
      <dt><img src=""></dt>
      <dd class="oneline_text autoFlex">蚂蜂窝自由行联盟</dd>
    </dl>
  </section><!-- 信息 -->
</template>

<script>
  export default {
    name: 'dheader',
    data () {
      return {
        liveDetail:this.$parent.liveDetail
      }
    },
    computed: {},
    created: function () {
    },
    methods: {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>

<template>
  <div>
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
  </div>
</template>

<style>

</style>

<script>
  export default {
    name: 'operbutton',
    props: {},
    created(){

    },
    data () {
      return {}
    },
    methods: {},
    computed: {}
  }
</script>
<template>
  <button class="fixedFd fixedFdRed" @click="operButtonEvent">{{text}}</button>
</template>

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
</style>

<script>
  export default {
    name: 'operbutton',
    props: {
      role:0,
      view:1, //控制按钮呈现的状态 本质为观看权限 1免费,2成员,4付费,16会员类型
    },
    created(){

    },
    data () {
      return {
        text:'开通会员预约直播' //按钮的文案
      }
    },
    methods: {
      /**
       * 预约直播点击事件
       */
      operButtonEvent(){
        alert("底部按钮点击");
      },
    },
    computed: {
      /**
       * 根据role(用户角色) 和 view (观看权限)
       */
    }
  }
</script>

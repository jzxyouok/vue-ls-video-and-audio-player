<template>
  <a @click="joinEvent" class="join_circle" v-if="onOff">{{text}}</a>
</template>

<style>
  .join_circle {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0.96rem;
    line-height: 0.96rem;
    background: #ff3838;
    font-size: 0.34rem;
    color: #fff;
  }
</style>

<script>
  export default {
    name: 'joincircle',
    props: {
      circleId: {
        type: String,
        default: ''
      },
      userId: {
        type: String,
        default: ''
      },
      followerId: {
        type: String,
        default: ''
      },
      joinWay: {
        type: Number,
        default: 4
      },
      text: {
        type: String,
        default: "加入社群"
      },
      onOff: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        baseUrls: {
          joinOnPayUrl: 'http://zhangmen/circle/circle-pay',            //付费加群跳转页面URL
          joinOnVipUrl: 'http://vip/`${this.circleId}`/product/list',   //会员加群跳转页面URL
          faildAuthUrl: 'http://zhangmen/community/qualified/list',
          joinAuthApiUrl: '/api/v2/circle/member/validation',            //用户是否有访问权限的api请求地址
          joinApiUrl: '/api/v2/w/circle/member',         //执行加群操作api请求地址
          hostUrl: window.location.href                            //当前页URL
        },
        validStatus: false      //校验加群资格改变的标记
      }
    },
    watch: {
//      "validStatus": "doJoin"
    },
    methods: {
      /**
       * 加群事件函数
       */
      joinEvent(){

        if (this.text == "审核中")return;
        switch (this.joinWay) {
          case 8:// 入群类型为 会员入群
            this.joinOnVip();
            break;
          case 4:// 入群类型为 付费入群
            this.joinOnPay();
            break;
          default://其它入群方式
            this.hasJoinAuth();
            break;
        }
      },
      /**
       * 处理付费类型的入群操作
       */
      joinOnPay(){
        var url = this.baseUrls.joinOnPayUrl + '?';
        url += "circleId=" + this.circleId;
        url += "&userId=" + this.userId;
        url += "&bizType=joinCirclePay";
        url += "&liveChargeCallback=" + this.baseUrls.hostUrl;
        url += "&followerId=" + this.followerId;
        window.location.href = url;
      },
      /**
       * 处理会员类型的入群操作
       */
      joinOnVip(){
        var url = this.baseUrls.joinOnPayUrl + '?';
        url += "userId=" + this.userId;
        url += "&noJoin=0";
        url += "&liveChargeCallback=" + this.baseUrls.hostUrl;
        url += "&followerId=" + this.followerId;
        window.location.href = url;
      },
      /**
       * 判断用户是否有入群资格
       */
      hasJoinAuth(){
        var userId = this.userId;
        var circleId = this.circleId;
        this.$http.get(this.baseUrls.joinAuthApiUrl, {userId, circleId})
        .then((res) => {
          var data = res.body;
          var joinstate = data.code;
          var joinMsg = data.message;
          if (joinstate != 0) {
            this.jionAuth = false;
            if (joinstate == 16051) {//加群资格
              var url = this.baseUrls.faildAuthUrl + '?';
              url += 'userId=' + this.userId;
              url += '&type=1&bizId=' + this.circleId;
              url += '&fromUrl=' + encodeURIComponent(this.baseUrls.hostUrl);
              window.location.href = url;
            } else {
              alert("校验错误信息");
            }
          } else {//通过加群资格验证：进入加群流程
            this.validStatus = true;
            this.doJoin();
          }
        })
      },

      /**
       * 执行加群操作
       */
      doJoin(){
        if (this.validStatus) {
          var circleId = this.circleId;
          var userId = this.userId;
          var followerId = this.followerId;

          this.$http.put(this.baseUrls.joinApiUrl, {circleId, userId, followerId})
          .then(function (res) {
            var data = res.body;
            if (data.code == 0) {
              alert("加群成功（按钮底部按钮消失）");
            } else if (data.code == "16021") {//提示文案： 已加入该社群
              alert("已加入该社群");
            } else if (data.code == "16022") {//提示文案：群成员已满
              alert("群成员已满");
            } else if (data.code == "16051") {// 提示文案： 你的入群资格已使用完，若想加更多群，可以购买入群资格，或退出部分已加入的社群
              alert("你的入群资格已使用完，若想加更多群，可以购买入群资格，或退出部分已加入的社群");
            } else if (data.code == "16062") {//提示文案:  您已被社群加入黑名单,不能加入该社群
              alert("您已被社群加入黑名单,不能加入该社群");
            } else if (data.code == "16061") {
              this.$parent.joinButtonText="审核中";
            } else if (data.code != 0) {
              alert("加群失败");
            }
          })
        }
      }
    }
  }
</script>

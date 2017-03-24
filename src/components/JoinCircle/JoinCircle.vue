<template>
  <a @click="joinEvent" class="join_circle" v-if="onOff">{{text||'加入社群'}}</a>
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
  import zmOauth from 'common/js/wxShare/oauth.js';
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
      join: {
        type: Number,
        default: 1
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
        timer:0,
        baseUrls: {
          joinOnPayUrl: requstUrl+'/zhangmen/circle/circle-pay',            //付费加群跳转页面URL
          joinOnVipUrl: requstUrl+'/vip/'+this.circleId+'/product/list',   //会员加群跳转页面URL
          faildAuthUrl: requstUrl+'/zhangmen/community/qualified/list',
          joinAuthApiUrl: requstUrl+'/api/v2/circle/member/validation',            //用户是否有访问权限的api请求地址
          joinApiUrl: requstUrl+'/api/v2/w/circle/member/',         //执行加群操作api请求地址
          hostUrl: window.location.href            //当前页URL
        },
        validStatus: false      //校验加群资格改变的标记
      }
    },
    methods: {
      /**
       * 加群事件函数
       */
      joinEvent(){
          if(this.timer!=0){
              return;
          }
          console.log(this.userId);
        if (this.text == "审核中")return;
        if(userId == undefined || userId == ""){
          var auth = new oauth();
          auth.init("", 1);
          return auth.auth();
        }else{
          switch (this.join) {
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
        }
      },
      /**
       * 处理付费类型的入群操作
       */
      joinOnPay(){
        var url = this.baseUrls.joinOnPayUrl + '?';
        url += "circleId=" + this.circleId;
        url += "&userId=" + userId;
        url += "&bizType=joinCirclePay";
        url += "&liveChargeCallback=" + encodeURIComponent(this.baseUrls.hostUrl);
        url += "&followerId=" + this.followerId;
        window.location.href = url;
      },
      /**
       * 处理会员类型的入群操作
       */
      joinOnVip(){
        var url = this.baseUrls.joinOnVipUrl + '?';
        url += "userId=" + this.userId;
        url += "&noJoin=0";
        url += "&liveChargeCallback=" + encodeURIComponent(this.baseUrls.hostUrl);
        url += "&followerId=" + this.followerId;
        window.location.href = url;
      },
      clearStatus(){
        var _that = this;
        this.timer = window.setTimeout(function () {
            window.clearTimeout(_that.timer);
            _that.timer = 0;
            _that.$parent.addGroup = 2;
        },2000);
      },
      /**
       * 判断用户是否有入群资格
       */
      hasJoinAuth(){
        var userId = this.userId;
        var circleId = this.circleId;
        this.$http.get(this.baseUrls.joinAuthApiUrl,{params:{"token":this.$parent.token, "circleId":circleId}})
        .then((res) => {
          var data = res.body;
          var joinstate = data.code;
          var joinMsg = data.message;
          if (joinstate != 0) {
            this.jionAuth = false;
            if (joinstate == 16053) {//加群资格
              var url = this.baseUrls.faildAuthUrl + '?';
              url += 'userId=' + this.userId;
              url += '&type=1&bizId=' + this.circleId;
              url += '&fromUrl=' + encodeURIComponent(this.baseUrls.hostUrl);
              window.location.href = url;
            }else if(joinstate == 16022){
              this.$parent.addGroup = -1;
              this.$parent.popuText = "群成员已满";
            } else {
              this.$parent.addGroup = 0;
              this.$parent.popuText = '加群失败！';
              this.clearStatus();
            }
          } else {//通过加群资格验证：
            this.validStatus = true;
            this.doJoin();
          }
        }, (err)=> {
          var code = err.status;
          var text = err.statusText;
          /*tryAgin(code, this.hasJoinAuth(), (text)=> {
            this.$parent.addGroup = -1;
            this.$parent.popuText = text;
          });*/
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
          this.$parent.addGroup = 2;
          this.$http.put(this.baseUrls.joinApiUrl,{"circleId":circleId,"followerId":followerId,"type":109})
          .then(function (res) {
            var data = res.body;
            if (data.code == 0) {
              this.$parent.addGroup = 1
              this.$parent.showJoin = false;
              this.clearStatus();
            } else if (data.code == "16021") {//提示文案： 已加入该社群
              this.$parent.addGroup = -1;
              this.$parent.popuText = '已加入该社群';
            } else if (data.code == "16022") {//提示文案：群成员已满
              this.$parent.addGroup = -1;
              this.$parent.popuText = '群成员已满';
            } else if (data.code == "16062") {//提示文案:  您已被社群加入黑名单,不能加入该社群
              this.$parent.addGroup = -1;
              this.$parent.popuText = '您已被社群加入黑名单,不能加入该社群';
            } else if (data.code == "16061") {
              this.$parent.joinButtonText = "审核中";
            } else {
              this.$parent.addGroup = 0;
              this.clearStatus();
            }
          }, function (err) {
            var code = err.status;
            var text = err.statusText;
            /*tryAgin(code, this.doJoin(), (text)=> {
              this.$parent.addGroup = -1;
              this.$parent.popuText = text;
            });*/
          })
        }
      }
    }
  }
</script>

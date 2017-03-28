<template>
  <div id="operButtonArea">
    <button class="fixedFd fixedFdRed" @click="operButtonEvent">{{text}}</button>
    <section class="sharePop" v-show="popFlag">
      <div class="sharePopBox yugaoSucc">
        <img src="/static/images/herald/newLive.png" class="yugaoSuccPic"/>
        <h2 class="yugaoSuccTit">预约成功</h2>
        <h3 class="yugaoSuccDown">下载APP，接收直播提醒</h3>
        <button class="yugaoSuccBtn" @click="utils.downloadApp()">立即下载</button>
        <button class="yugaoSuccClose" @click="popFlag=false">X</button>
      </div>
    </section><!-- 预约成功弹出层 -->
  </div>
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

</style>

<script>
  export default {
    name: 'operbutton',
    props: {
      utils: {
        type: Object,
        default: {}
      },
      view: {
        type: Number,
        default: 4
      },
      role: {
        type: Number,
        default: 0
      },
      userId: {
        type: String,
        default: ''
      },
      circleId: {
        type: String,
        default: ''
      },
      liveId: {
        type: Number,
        default: 0
      },
      join: {
        type: Number,
        default: 0
      },
      price: {
        type: Number,
        default: 0
      }
    },
    created(){
      this.ajaxViewAuth();
      this.dealButtonView();
    },
    data () {
      return {
        text: '已预约，下载APP接收直播提醒',  //按钮的文案
        popFlag: false,
        allow: false,
      }
    },
    methods: {
      /**
       * 预约直播点击事件
       */
      operButtonEvent(){
        switch (this.view) {
          case 1:
            this.popFlag = true;
            utils.downloadApp();
            break;
          case 2:
            this._EventJoin();
            break;
          case 4:
            this._EventPay();
            break;
          case 16:
            this._EventVip();
            break;
        }
      },

      /**
       * 根据role(用户角色) 和 view (本质为观看权限) 0群主、1管理员、2成员、3准成员、4游客
       * 控制按钮呈现的状态  1免费,2成员,4付费,16会员类型
       */
      dealButtonView(){
        var role = this.role;
        var view = this.view;
        if (role == 0 || role == 1) { //群主和管理员可观看任何类型
          this.text = "已预约，下载APP接收直播提醒";
        } else {
          switch (view) {
            case 1:
              this.text = "已预约，下载APP接收直播提醒";
              break;
            case 3:
              this.text = "加入社群预约直播";
              break;
            case 4:
              //成员、准成员、游客都需要鉴权
              if (!this.allow) {
                this.text = "支付 " + this.price + " 预约直播";
              }
              break;
            case 16:
              if (!this.allow) {
                this.text = "开通会员预约直播";
              }
              break;
          }
        }
      },
      /**
       * 鉴权请求 成功返回true,失败返回false
       */
      ajaxViewAuth(){
        var url = requstUrl + "/api/v2/circle/member/validation";
        this.$http.get(url, {params: {"circleId": this.circleId}})
          .then((res) => {
            var data = res.body;
            var code = data.code;
            if (code == 16301 || code == 16303) {//已付费
              this.allow = true;
            } else if (code == 16321 || code == 16323 || code == 16331) {//未付费，点击跳付费连接
              this.allow = false;
            }
          })
      },
      /**
       * 加入社群预约直播
       * */
      _EventJoin(){
        var url = requstUrl + "/api/v2/w/circle/member/";
        var type = 109;
        if (this.join == 1 || this.join == 2) {
          type = 101;
        }
        this.$http.put(url, {
          "circleId": this.circleId,
          "followerId": this.followerId,
          "type": type
        }, {emulateJSON: true})
          .then((res) => {
            var data = res.body;
            if (data.code == 0) { //入群成功
              this.text = "已预约，下载APP接收直播提醒";
            } else if (data.code == "16021") {// 已加入该社群
              //this.$parent.addGroup = 0;
              alert("已加入该社群");
            } else if (data.code == "16022") {//群成员已满
              //this.$parent.addGroup = 0;
              alert("群成员已满");
            } else if (data.code == "16062") {//您已被社群加入黑名单,不能加入该社群
              alert("您已被社群加入黑名单,不能加入该社群");
            } else if (data.code == "16061") {//审核中
              alert("您的入群申请正在被审核中");
            }
          })
      },
      /*
       * 支付金额预约直播
       * */
      _EventPay(){
        if (this.allow == true) {
          utils.downloadApp();
        } else {
          var url = "/zhangmen/circle/circle-pay" + "?";
          url += "circleId=" + this.circleId;
          url += "&userId=" + this.userId;
          url += "&bizType=joinCirclePay";
          url += "&liveChargeCallback=" + encodeURIComponent(window.location.href);
          url += "&followerId=" + this.followerId;
          window.location.href = url;
        }
      },
      /**
       * 购买会员预约直播
       * @private
       */
      _EventVip(){
        if (this.allow == true) {
          utils.downloadApp();
        } else {
          var url = "/vip/" + this.circleId + "/product/list" + "?";
          url += "userId=" + this.userId;
          url += "&noJoin=0";
          url += "&liveChargeCallback=" + encodeURIComponent(window.location.href);
          url += "&followerId=" + this.followerId;
          window.location.href = url;
        }
      }
    }
  }
</script>

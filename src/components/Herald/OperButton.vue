<template>
  <div id="operButtonArea">
    <button class="fixedFd fixedFdRed" @click="operButtonEvent">{{text}}</button>
    <section class="sharePop" v-show="popFlag">
      <div class="sharePopBox yugaoSucc">
        <img src="/statics/images/herald/newLive.png" class="yugaoSuccPic"/>
        <h2 class="yugaoSuccTit">预约成功</h2>
        <h3 class="yugaoSuccDown">下载APP，接收直播提醒</h3>
        <button class="yugaoSuccBtn" @click="utils.downloadApp()">立即下载</button>
        <button class="yugaoSuccClose" @click="popFlag=false">X</button>
      </div>
    </section><!-- 预约成功弹出层 -->
  </div>
</template>
<style>
/*operButton.vue*/
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
    background: #f03c38;
  }

</style>

<script>
  import zmOauth from 'common/js/wxShare/oauth.js';
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
      userId: {
        type: String,
        default: ''
      },
      token: {
        type: String,
        default: ''
      },
      circleId: {
        type: String,
        default: ''
      },
      liveName: {
        type: String,
        default: ''
      },
      liveId: {
        type: Number,
        default: 0
      },
      price: {
        type: Number,
        default: 0
      }
    },
    created(){
      if (this.userId) {
        this.getUserRole();
      }else{//1免费,2成员,4付费,8密码,16会员类型，预告不需要这个属性
        switch (this.view){
          case 1:
            this.text="加入社群预约直播";
            break;
          case 2:
            this.text="加入社群预约直播";
            break;
          case 4:
            this.text="支付￥"+this.price+'预约直播';
            break;
          case 8:
            this.text="加入社群预约直播";
            break;
          case 16:
            this.text="开通会员预约直播";
            break;
        }
      }
    },
    data () {
      return {
        text: '加入社群预约直播',  //按钮的文案
        popFlag: false,
        allow: false,
        role:3,
      }
    },
    methods: {
      getUserRole(){//获取用户角色
        this.$http.get(requstUrl + '/api/v2/circle/member/role/', {params: {"circleId": this.circleId,"userId": this.userId}})
          .then((res) => {
            var data = res.body;
            var code = data.code;
            var msg = data.message;
            if (code == 0) {
              this.role = data.role;
              console.log("用户角色:"+this.role);
            } else {
              console.log(msg);
            }
            this.defaultBtnText();
          }).catch(function (response) {
            this.defaultBtnText();
          })
      },
      /**
       * 预约直播点击事件
       */
      operButtonEvent(){
        var role = this.role;
        var join = this.$parent.join;
        if (this.userId == undefined || this.userId == "") {
          var auth = new oauth();
          auth.init("", 1);
          return auth.auth();
        } else {
          if (role == 0 || role == 1) {
            this.popFlag = true;
            return false;
          }
          if(this.text == "已预约，下载APP接收直播提醒"){
            this.popFlag = true;
            return false;
          }
          switch (this.view) {
            case 1:
            case 2:
            case 8:
              if (role == 3) {
                if (join == 4) {
                  this.joinOnPay();
                } else if (join == 8) {
                  this.joinOnVip();
                } else {
                  this.ajaxViewAuth();
                }
              }else{
                this.text = "已预约，下载APP接收直播提醒";
              }
              break;
            case 4:
              this._EventPay();
              break;
            case 16:
              this._EventVip();
              break;
          }
        }
      },
      /**
       * 根据role(用户角色) 和 view (本质为观看权限) 0群主、1管理员、2成员、4准成员、3游客
       * 控制按钮呈现的状态  1免费,2成员,4付费,16会员类型
       */
      /*dealButtonView(){
        var role = this.role;
        var view = this.view;
        if (role == 0 || role == 1) { //群主和管理员可观看任何类型
          this.text = "已预约，下载APP接收直播提醒";
          return false;
        } else {
          if (role != 3 && view < 4) {
            this.text = "已预约，下载APP接收直播提醒";
            return false;
          }
        }
        switch (view) {
          case 1:
          case 2:
          case 8:
            if (this.allow) {
              this.text = "已预约，下载APP接收直播提醒";
            } else {
              this.text = "加入社群预约直播";
            }
            break;
          case 4:
            //成员、准成员、游客都需要鉴权
            if (this.allow) {
              this.text = "已预约，下载APP接收直播提醒";
            } else {
              this.text = "支付 " + this.price + " 预约直播";
            }
            break;
          case 16:
            if (this.allow) {
              this.text = "已预约，下载APP接收直播提醒";
            } else {
              this.text = "开通会员预约直播";
            }
            break;
        }
      },*/
      /**底部默认文案**/
      defaultBtnText(){
        var role = this.role;
        var view = this.view;
        var join = this.$parent.join;
        if(role == 0 || role == 1){
          this.text = "已预约，下载APP接收直播提醒";
        }else{
          this.viewAth(view,role);
        }
      },
      viewAth(view,role){
        switch (view) {
          case 1:
          case 2:
          case 8:
            if(role == 3){
              this.text = "加入社群预约直播";
            }else{
              this.text = "已预约，下载APP接收直播提醒";
            }
            break;
          case 4:
          case 16:
              this.getViewAuth();
            break;
        }
      },
      getViewAuth(){
        var params = {
          liveId: this.liveId,
          dataType:this.view,
          circleId: this.circleId,
          token:this.token
        }
        this.$http.get('/api/live/view/', {params: params})
          .then((res) => {
            var data = res.body;
            if (data.views) {
              var code = data.views[this.liveId];
              this.viewByAuth(this.view, code);
            }
          });
      },
      viewByAuth(view, authCode){//根据鉴权返回的code 更新播放的权限弹层
        switch (view) {
          case 1:
          case 2:
          case 8:
            this.text = "已预约，下载APP接收直播提醒";
            break;
          case 4:
            if (authCode == "16301") {//已付费
              this.text = "已预约，下载APP接收直播提醒";
            } else if (authCode == "16321") {//未付费
              this.text = "支付 " + this.price + " 预约直播";
            }
            break;
          case 16:
            if (authCode == "16303") {//会员类型正确
              this.text = "已预约，下载APP接收直播提醒";
            } else if (authCode == "16323") {//需要购买会员类型
              this.text = "开通会员预约直播";
            } else if (authCode == "16331") {//该用户的会员类型没有获取到，可以重试
              this.text = "开通会员预约直播";
            }
            break;
        }
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
       * 鉴权请求 成功返回true,失败返回false
       */
      ajaxViewAuth(){
        var url = requstUrl + "/api/v2/circle/member/validation";
        this.$http.get(url, {params: {"circleId": this.circleId}})
          .then((res) => {
            var data = res.body;
            var joinstate = data.code;
            if (joinstate != 0) {
              if (joinstate == 16051) {//加群资格
                var url = '/zhangmen/community/qualified/list' + '?';
                url += 'userId=' + this.userId;
                url += '&type=1&bizId=' + this.circleId;
                url += '&fromUrl=' + encodeURIComponent(window.location.href);
                window.location.href = url;
              }else if(joinstate == 16021){
                this.text = "已预约，下载APP接收直播提醒";
              }else if(joinstate == 16022){
                this.$parent.addGroup = -1;
                this.$parent.popuText = "群成员已满";
              } else {
                this.$parent.addGroup = 0;
                this.$parent.popuText = '加群失败！';
              }
              this.clearStatus();
            } else {//通过加群资格验证：
              this._EventJoin();
            }
          }).catch(function (res) {
            console.log(res);
          })
      },
      /**
       * 加入社群预约直播
       * */
      _EventJoin(){
        var url = requstUrl + "/api/v2/w/circle/member/";
        var type = 109;
        if (this.$parent.join == 1 || this.$parent.join == 2) {
          type = 101;
        }
        this.$http.put(url, {
          "circleId": this.circleId,
          "followerId": this.followerId,
          "type": type
        }, {emulateJSON: true})
          .then((res) => {
            var data = res.body;
            if (data.code == 0 ){/**加群成功**/
              this.$parent.addGroup = 1;
              this.text = "已预约，下载APP接收直播提醒";
            }else if(data.code == "16021" || data.code == "16061") {/**审核中/已加入该社群**/
              this.text = "已预约，下载APP接收直播提醒";
            } else if (data.code == "16022") {//群成员已满
              this.$parent.addGroup = 0;
            } else {
              this.text = "加入社群预约直播";
            }
            this.clearStatus();
          })
      },
      /**
       * 支付金额预约直播
       * */
      _EventPay(){
        if (this.allow == true) {
          this.popFlag = true;
        } else {
          var url = "/zhangmen/live/view/charge" + "?";
          url += "circleId=" + this.circleId;
          url += "&userId=" + this.userId;
          url += "&liveId=" + this.liveId;
          url += "&liveName=" + this.liveName;
          url += "&bizType=joinCirclePay";
          url += "&liveChargeCallback=" + encodeURIComponent(window.location.href);
          url += "&followerId=" + this.followerId == undefined ? '' : this.followerId;
          window.location.href = url;
        }
      },
      /**
       * 购买会员预约直播
       * @private
       */
      _EventVip(){
        if (this.allow == true) {
          this.popFlag = true;
        } else {
          var url = "/vip/" + this.circleId + "/product/list" + "?";
          url += "userId=" + this.userId;
          url += "&circleId=" + this.circleId;
          url += "&liveId=" + this.liveId;
          url += "&noJoin=0";
          url += "&liveChargeCallback=" + encodeURIComponent(window.location.href);
          url += "&followerId=" + this.followerId == undefined ? '' : this.followerId;
          window.location.href = url;
        }
      },
      /**
       * 处理付费类型的入群操作
       */
      joinOnPay(){
        var url = "/zhangmen/circle/circle-pay" + "?";
        url += "circleId=" + this.circleId;
        url += "&userId=" + this.userId;
        url += "&bizType=joinCirclePay";
        url += "&liveChargeCallback=" + encodeURIComponent(window.location.href);
        url += "&followerId=" + this.followerId == undefined ? '' : this.followerId;
        window.location.href = url;
      },
      /**
       * 处理会员类型的入群操作
       */
      joinOnVip(){
        var url = "/vip/"+this.circleId+"/product/list" + "?";
        url += "userId=" + this.userId;
        url += "&noJoin=0";
        url += "&liveChargeCallback=" + encodeURIComponent(window.location.href);
        url += "&followerId=" + this.followerId == undefined ? '' : this.followerId;
        window.location.href = url;
      },
    }
  }
</script>

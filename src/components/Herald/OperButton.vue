<template>
  <div id="operButtonArea">
    <button class="fixedFd fixedFdRed" @click="operButtonEvent">{{text}}</button>
    <section class="sharePop" v-show="popFlag">
      <div class="sharePopBox yugaoSucc">
        <img src="/static/images/herald/newLive.png" class="yugaoSuccPic"/>
        <h2 class="yugaoSuccTit">预约成功</h2>
        <h3 class="yugaoSuccDown">下载APP，接收直播提醒</h3>
        <button class="yugaoSuccBtn" @click="_EventDownApp">立即下载</button>
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
      view: {
        type: Number,
        default: 4
      },
      role: {
        type: Number,
        default: 0
      },
      token: {
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
      this.dealButtonView();
    },
    data () {
      return {
        evtKey: 'sec', //点击按钮 调用何种事件的键 sec(预约成功), join(成员),pay(支付),vip(会员),
        text: '已预约，下载APP接收直播提醒',  //按钮的文案
        popFlag: false
      }
    },
    methods: {
      /**
       * 预约直播点击事件
       */
      operButtonEvent(){
        var key = this.evtKey;
        switch (key) {
          case 'sec':
            this.popFlag = true;
            break;
          case 'join':
            this._EventJoin();
            break;
          case 'pay':
            this._EventPay();
            break;
          case 'vip':
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
          this.evtKey = 'sec';
          this.text = "已预约，下载APP接收直播提醒";
        } else {
          switch (view) {
            case 1:
              this.evtKey = 'sec';
              this.text = "已预约，下载APP接收直播提醒";
              break;
            case 2:
              if (role != 2) {
                this.evtKey = 'join';
                this.text = "加入社群预约直播";
              } else {
                this.evtKey = 'sec';
                this.text = "已预约，下载APP接收直播提醒";
              }
              break;
            case 4:
              //成员、准成员、游客都需要鉴权
              var allow = this.ajaxViewAuth();
              if (allow) {
                this.evtKey = 'sec';
                this.text = "已预约，下载APP接收直播提醒";
              } else {
                this.evtKey = 'pay';
                this.text = "支付 8.88 预约直播";
              }
              break;
            case 16:
              var allow = this.ajaxViewAuth();
              if (allow) {
                his.evtKey = 'sec';
                this.text = "已预约，下载APP接收直播提醒";
              } else {
                this.evtKey = 'vip';
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
        var allow = false;
        return allow;

        var url = "";
        var params = {};
        this.$http.get(url, {params: params})
          .then((res)=> {
            var data = res.body;
            var code = data.code;
            if (code == 16301 || code == 16303) {//已付费
              allow = true;
            } else if (code == 16321 || code == 16323 || code == 16331) {//未付费，点击跳付费连接
              allow = false;
            }
          })
        return allow;
      },

      /**
       * 下载App 调用事件
       */
      _EventDownApp(){
        alert("下载App");
      },

      /*
       * 加入社群预约直播
       * */
      _EventJoin(){
        alert("加入社群预约直播");
        return;// 防止报错，待删除。。。。。。。。。。。。
        var url="";
        var params={};
        this.$http.get(url,{params:param()})
          .then((res)=>{
            var data=data.body;
            if (data.code == 0) { //入群成功
              this.evtKey = 'sec';
              this.text = "已预约，下载APP接收直播提醒";
            } else if (data.code == "16021") {// 已加入该社群
               alert("已加入该社群");
            } else if (data.code == "16022") {//群成员已满
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
        alert("支付金额预约直播");
        return ;//待删除。。。。。

        var url = this.baseUrls.joinOnPayUrl + '?';
        url += "circleId=" + this.circleId;
        url += "&userId=" + userId;
        url += "&bizType=joinCirclePay";
        url += "&liveChargeCallback=" + encodeURIComponent(this.baseUrls.hostUrl);
        url += "&followerId=" + this.followerId;
        window.location.href = url;
      },

      /**
       * 购买会员预约直播
       * @private
       */
      _EventVip(){
        alert('购买会员预约直播');
        return; //待删除。。。。。。

        var url = this.baseUrls.joinOnVipUrl + '?';
        url += "userId=" + this.userId;
        url += "&noJoin=0";
        url += "&liveChargeCallback=" + encodeURIComponent(this.baseUrls.hostUrl);
        url += "&followerId=" + this.followerId;
        window.location.href = url;


      }
    }
  }
</script>

<template>
  <div id="app">
    <detail-header :liveInfo="liveInfo" :followerId="followerId" :userId="userId" :price="price" :circleId="circleId" :authStatus="authStatus">
    </detail-header>
    <article class="topMenu clearfix">
      <ul class="topMenuTabs fl">
        <li v-bind:class="{'active':0===selected}" class="xq" @click="tabChange(0)">详情</li>
        <!--<li v-bind:class="{'active':1===selected}" class="lt" @click="tabChange(1)">聊天</li>-->
      </ul>
      <ul class="topMenuTool fr">
        <li class="share" @click="shareStatus = 0">分享</li>
        <!--<li class="shang">赏</li>-->
      </ul>
    </article><!-- 菜单栏 -->
    <div v-show="selected==0">
      <article class="mainCont">
        <h3 class="moreListFree" v-if="descError  == 0">数据获取失败，点击<a @click="" href="javascript:;">重试</a></h3>
        <d-summary :circleId="circleId" :followerId="followerId" :liveInfo="liveInfo" v-if="descError == -1"></d-summary>
      </article>
      <live-list v-if="descError == -1"></live-list>
    </div>
    <group-chat v-show="selected==1"></group-chat>

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
    <mark-layer :addGroup="addGroup" :popuText="popuText"></mark-layer>
  </div>
</template>

<script>
  import 'common/css/reset.css';
  import 'common/js/reset.js';
  import utils from 'common/js/utils.js';
  import 'common/js/wxShare/wxHelper-6.1.js';
  import {secondShare} from 'common/js/wxShare/secondShare.js';
  import zmOauth from 'common/js/wxShare/oauth.js';
  import DSummary from 'components/DSummary/DSummary';
  import LiveList from 'components/LiveList/LiveList';
  import GroupChat from 'components/GroupChat/GroupChat';
  import DetailHeader from 'components/DHeader/DetailHeader';
  import MarkLayer from 'components/MarkLayer/MarkLayer'
  export default {
    name: 'app',
    components: {
      DSummary, LiveList, GroupChat, DetailHeader, MarkLayer
    },
    data () {
      return {
        token: utils.getCookie('zhangmen_token_cookie'),
        userId: '',
        userRole: 4,
        circleId: '',
        join: 0,
        liveInfo: '',
        circleInfo: {},
        followerId: '',
        price: 0,
        addGroup: 2,//0:失败 1:成功 -1：异常
        popuText: '你的入群资格已使用完，若想加更多群，可以购买入群资格，或退出部分已加入的社群',
        authStatus: 0,//0,免费1成员,2审核,4付费,8密码,16会员类型，预告不需要这个属性
        liveDetail: {},
        liveBa: 1,
        shareStatus: -1,//分享的弹窗状态 0:显示 -1:不显示
        descError: -1,//0:显示 -1:不显示
        tabIndex: true,
        selected: 0,
      }
    },
    created: function () {
      this.followerId = utils._getQueryString('followerId');
      this.loadStaticData();
      if (this.userId) {
        this.getFollowerId();
      }
      this.getUserRole();
      if (this.liveInfo.view == 4 || this.liveInfo.view == 16) {
        this.getViewAuth();
      }
      this.addEventListenerEnded();
    },
    methods: {
      addEventListenerEnded(){
        var timer = window.setInterval(function () {
          var audio = document.querySelector('#video');
          if (audio.ended) {
            alert('直播已结束');
            window.clearInterval(timer);
          }
        });
      },
      tabChange(num){
        this.selected = num;
      },
      loadStaticData(){//获取页面的静态化数据并初始化为组件属性
        if (this.liveDetail) {
          this.liveInfo = window.liveInfo;
        } else {
          this.liveInfo = JSON.parse(sessionStorage.getItem("list"));
        }
        this.circleId = utils._getQueryString('circleId');
        sessionStorage.setItem('circleId', this.circleId);
        sessionStorage.setItem("liveType", window.liveInfo.type);
        window.circleInfo.id = this.circleId;
        this.userId = window.userId;
        if (this.liveInfo.price != undefined) {
          this.price = this.liveInfo.price;
        }
      },
      getUserRole(){//获取用户角色
        this.$http.get(requstUrl + '/api/v2/circle/member/role/', {params: {"circleId": this.circleId, "userId": this.userId}})
        .then((res) => {
          var data = res.body;
          var code = data.code;
          var role = data.role;
          var msg = data.message;
          if (code == 0) {
            this.userRole = role;
            this.viewByRole(this.liveInfo.view, role);
          } else {
            alert(msg);
          }
        })
      },
      getViewAuth(password){//鉴定观看权限
        var params = {
          liveId: this.liveInfo.id,
          dataType: this.liveInfo.view,
          circleId: this.circleId,
          token: this.token
        }
        if (password) params.body = password;
        this.$http.get('/api/live/view/', {params: params})
        .then((res) => {
          var data = res.body;
          var code = data.code;
          var msg = data.message;
          if (data.views) {
            var view = data.views[this.liveInfo.id];
            this.viewByAuth(this.liveInfo.view, view);
          } else {
            //测试：
//            data.views=[];
//            var view= data.views[0]={code:16322};
//            this.viewByAuth(this.liveInfo.view, view.code);
            console.log(msg);
          }

        });
      },
      viewByRole(view, role){//根据用户 更新播放的权限弹层 view :1免费,2成员,4付费,8密码,16会员类型
        switch (view) {
          case 1://免费视频，不显示任何遮罩 可看
            this.authStatus = 0;
            break;
          case 2:
            if (role == 0 || role == 1 || role == 2) { //已入群
              this.authStatus = 0;
            } else if (role == 4) {//审核
              this.authStatus = 2;
            } else {//游客
              this.authStatus = 1;
            }
            break;
          case 4: //
            if (role == 0 || role == 1) {//群主和管理员可看
              this.authStatus = 0;
            } else {
              this.authStatus = 4;
            }
            break;
          case 8:
            if (role == 0 || role == 1) {//群主和管理员可看
              this.authStatus = 0;
            } else {
              this.authStatus = 8;
            }
            break;
          case 16:
            if (role == 0 || role == 1) {//群主和管理员可看
              this.authStatus = 0;
            } else {
              this.authStatus = 16;
            }
            break;
          default:
            break;
        }
      },
      viewByAuth(view, authCode){//根据鉴权返回的code 更新播放的权限弹层
        switch (view) {
          case 4:
            if (authCode == "16301") {//已付费
              this.authStatus = 0;
            } else if (authCode == "16321") {//未付费
              this.authStatus = 4;
            }
            break;
          case 8:
            if (authCode == "16302") {//密码正确
              this.authStatus = 0;
            } else if (authCode == "16322") {//密码错误
              this.authStatus = 8;
              alert("密码错误");
            }
            break;
          case 16:
            if (authCode == "16303") {//会员类型正确
              this.authStatus = 0;
            } else if (authCode == "16323") {//需要购买会员类型
              this.authStatus = 16;
            } else if (authCode == "16331") {//该用户的会员类型没有获取到，可以重试
              this.authStatus = 16;
            } else if (authCode == "16324") {// 购买其他会员
              this.authStatus = -2;
            }
            break;
          default:
            break;
        }
      },
      /**
       * 判断用户是否推客资格
       **/
      getFollowerId(){
        this.$http.get("/api/sf/" + this.userId + "/belong?userId=" + this.userId + "&circleIds=" + this.circleId + "&sfType=1")
        .then((res) => {
          if (res.body.code == 0) {
            let data = res.body;
            if (data.results) {
              if (data.results.length >= 1) {
                this.followerId = this.userId;
                sessionStorage.setItem("followerId", this.userId);
              }
            }
          } else {
            console.log(res);
          }
        })
        .catch(function (response) {
          this.getCricleFollower();
          console.log(response);
        })
      },
      /**
       * 获取社群是否开启推客资格
       */
      getCricleFollower(){
        this.$http.get("/api/sf/" + this.circleId + "/condition")
        .then((res) => {
          if (res.body.code == 0) {
            let data = res.body;
            if (data.joinState == 1) {

            }
          } else {
            console.log(res);
          }
        })
        .catch(function (response) {
          console.log(response);
        })
      },
      /**
       * 直播上报统计
       */
      liveVisitCount() {
        this.$http.post("/api/zm/w/live/statistics", {params: {"circleId": this.circleId, "userId": this.userId, "liveId": this.liveInfo.id}}, {emulateJSON: true})
        .then((res) => {
          if (res.body.code == 0) {
          } else {
            console.log(res);
          }
        })
        .catch(function (response) {
          console.log(response);
        })
      }
    }
  }
</script>

<style type="text/css">
  /*
  detail-app.vue
  */
  /*点击按下效果*/
  .topVFail .btn:active, .sharePopBtn:active, .noticeTimeBtn:active, .fixedFdRed:active, .yugaoSuccBtn:active {
    opacity: .85
  }

  /*伪类*/
  .topMenuTabs li::before, .liveInfoSub li::before, .moreListSp::after, .topVLive::before, .topVFail .btn::before, .sharePopCent span::after, .noticeTimeBtn::before, .yugaoSuccTit::before, .yugaoSuccClose::after, .topVLive::before, .topVHf::before, .topVYgao::before, .topVBf::after {
    display: block;
    content: "";
    position: absolute;
    left: 0;
  }

  /*社群公用背景*/
  .topMenuTabs li::before, .topMenuTool li, .liveInfoSub li::before, .introArrow, .moreListSp::after, .topVBf::after, .topVFail .btn::before, .sharePopCent span::after, .noticeTimeBtn::before, .yugaoSuccTit::before, .yugaoSuccClose::after, .liveInfoTuig dd:after {
    background-image: url(/static/images/pubBack.png);
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
    border-bottom: 2px solid #f03c38
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

  .moreListFree {
    font-size: .28rem;
    color: #a0a0a0;
    text-align: center;
    font-weight: normal;
    padding-top: 3rem;
  }

  /*无数据 */
  .moreListFree a {
    color: #f04640
  }

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
    width: 72%;
    background: #fff;
    border-radius: .3rem;
    margin: -.75rem 0 0 -36%;
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

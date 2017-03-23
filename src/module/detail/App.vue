<template>
  <div id="app">
    <detail-header :liveInfo="liveInfo" :authStatus="authStatus">
    </detail-header>
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
  import DetailHeader from 'components/DHeader/DetailHeader';
  import LiveList from 'components/LiveList/LiveList';

  export default {
    name: 'app',
    components: {
      DHeader, LiveList, DetailHeader
    },
    data () {
      return {
        token: 'f4414108169d784e58a27e9ed9b90b4d',
        userId: '',
        userRole: 4,
        circleId: "b2887e15af4a18c89-8000",
        liveInfo: {},
        circleInfo: {},
        authStatus: 1,//1免费,2成员,4付费,8密码,16会员类型，预告不需要这个属性
        liveDetail: {},
        liveBa: 1,
      }
    },
    created: function () {
      this.get();
      this.loadStaticData();
      console.log("加载的静态化直播数据为：");
      console.log(this.liveInfo);

      this.getUserRole();
      if (this.liveInfo.view == 4 || this.liveInfo.view == 16) {
        this.getViewAuth();
      }
    },
    methods: {
      get(){
        this.circleInfo = JSON.parse(sessionStorage.getItem("circleInfo"));
        this.liveDetail = JSON.parse(sessionStorage.getItem("list"));
      },
      loadStaticData(){//获取页面的静态化数据并初始化为组件属性
        this.liveInfo = window.liveInfo;
        this.circleId = window.circleId;
        this.userId = window.userId;
      },
      getUserRole(){//获取用户角色
        var params = {token: this.token};
        this.$http.get('//zm.gaiay.net.cn/api/v2/circle/member/role/', {params: params})
        .then((res)=> {
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
          liveId: this.liveId,
          token: this.token
        }
        if (password)params.password = password;
        this.$http.get('//zm.gaiay.net.cn/api/live/view/', {params: params})
        .then((res)=> {
          var data = res.body;
          var code = data.code;
          var msg = data.message;
          if(data.views){
            var view = data.views[0];
            this.viewByAuth(this.liveInfo.view, view.code);
          }else {
            //测试：
//            data.views=[];
//            var view= data.views[0]={code:16322};
//            this.viewByAuth(this.liveInfo.view, view.code);
            alert(msg);
          }

        });
      },
      viewByRole(view, role){//根据用户 更新播放的权限弹层 view :1免费,2成员,4付费,8密码,16会员类型
        console.log("进入viewByRole:" + role);
        switch (view) {
          case 1://免费视频，不显示任何遮罩 可看
            this.authStatus = 1;
            break;
          case 2:
            if (role == 0 || role == 1 || role == 2) { //已入群
              this.authStatus = 1;
            } else {
              this.authStatus = 2;
            }
            break;
          case 4: //
            if (role == 0 || role == 1) {//群主和管理员可看
              this.authStatus = 1;
            } else {
              this.authStatus = 4;
            }
            break;
          case 8:
            if (role == 0 || role == 1) {//群主和管理员可看
              this.authStatus = 1;
            } else {
              this.authStatus = 8;
            }
            break;
          case 16:
            if (role == 0 || role == 1) {//群主和管理员可看
              this.authStatus = 1;
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
              this.authStatus = 1;
            } else if (authCode == "16321") {//未付费
              this.authStatus = 4;
            }
            break;
          case 8:
            if (authCode == "16302") {//密码正确
              this.authStatus = 1;
            } else if (authCode == "16322") {//密码错误
              this.authStatus = 8;
              alert("密码错误");
            }
            break;
          case 16:
            if (authCode == "16303") {//会员类型正确
              this.authStatus = 1;
            } else if (authCode == "16323") {//需要购买会员类型
              this.authStatus = 16;
            } else if (authCode == "16331") {//该用户的会员类型没有获取到，可以重试
              this.authStatus = -2;
            }
            break;
          default:
            break;
        }

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

  /*视频播放区域的CSS，将被移动到自己的组件文件中*/
</style>

<template>
  <div id="app">
    <g-header :name="circleInfo.name" :logo="circleInfo.logo" :desc="circleInfo.desc"
              :memberNum="circleInfo.memberNum"></g-header>
    <ul class="home_nav">
      <li v-for="(tab, index) in tabs" @click="choose(index)">
        <a href="javascript:;"
           :class="{'selected':index===selected}">{{tab.tabName}}</a>
      </li>
      <li><a href="javascript:;" @click="utils.downloadApp()">更多精彩</a></li>
    </ul>
    <div class="nav_com">
      <live-list v-show="selected==0"></live-list>
      <members v-show="selected==1"></members>
    </div>
    <join-circle :text="joinButtonText"
                 :onOff="showJoin"
                 :circleId="circleInfo.id"
                 :userId="userId"
                 :followerId="followerId"
                 :join="circleInfo.join"
    >
    </join-circle>
    <mark-layer :addGroup="addGroup" :popuText="popuText"></mark-layer>
  </div>
</template>
<script>
  import 'common/css/reset.css';
  import 'common/js/reset.js';
  import utils from 'common/js/utils.js';
  import 'common/js/wxShare/wxHelper-6.1.js';
  import {secondShare} from 'common/js/wxShare/secondShare.js';
  import GHeader from 'components/GHeader/GHeader';
  import LiveList from 'components/LiveList/LiveList';
  import Members from 'components/Members/Members';
  import JoinCircle from 'components/JoinCircle/JoinCircle';
  import MarkLayer from 'components/MarkLayer/MarkLayer'
  export default {
    name: 'app',
    components: {
      GHeader, LiveList, Members, JoinCircle,MarkLayer
    },
    created(){//相当于init
      window.circleInfo.circleId = window.circleInfo.id
      sessionStorage.setItem('circleId', window.circleInfo.id);
      if(userId){
        this.getRoleInfo();
        this.getFollowerId();
      }
      secondShare.circle_share(this.circleInfo.desc,this.circleInfo.logo,this.circleInfo.name,this.followerId);
    },
    data () {
      return {
        liveBa: 0,
        lives: [],
        circleInfo: window.circleInfo,
        userId:userId,
        followerId: utils._getQueryString("followerId"),
        userRoleUrl: requstUrl + "/api/v2/circle/member/role?circleId="+window.circleInfo.id,//社群身份信息
        followerIdUrl: requstUrl + "/api/sf/" + window.circleInfo.id + "/belong?userId=" + userId + "&circleIds=" + window.circleInfo.id + "&sfType=1",//查询当前用户是否分销商
        conditionUrl: requstUrl + "/api/sf/" + window.circleInfo.id + "/condition",//查询当前社群是否开启加群资格
        tabs: [
          {tabName: "直播"},
          {tabName: "群成员"}
        ],
        selected: 0,//根据它来判断切换内容显示
        utils: utils,//接收utils插件的对象
        addGroup: 2,//0:失败 1:成功 -1：异常
        popuText: '你的入群资格已使用完，若想加更多群，可以购买入群资格，或退出部分已加入的社群',
        roleInfo: {},
        showJoin: true,
        joinButtonText: "",
        howJoin: 0,
        token: utils.getCookie('zhangmen_token_cookie'),
      }
    },
    methods: {
      /**
       * tab切换
       **/
      choose(index) {
        this.selected = index;
      },
      /**
       * 根据用户身份判断底部按钮文案
       **/
      getRoleInfo(){
        this.$http.get(this.userRoleUrl)
          .then((res) => {
            if (res.body.code == 0) {
              this.roleInfo = res.body;
              let role = this.roleInfo.role;
              console.log("角色码：" + role);
              if (role < 3) {//已经入群，不显示按钮，顺便将文本置空
                this.showJoin = false;
                this.joinButtonText = "";
              } else if (role == 4) {//当前用户正在进行入群审核中
                this.showJoin = true;
                this.joinButtonText = "审核中"
              } else if (role == 3) {//游客，显示加群按钮
                this.showJoin = true;
                this.joinButtonText = "加入社群";
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
       * 加群按钮显示隐藏
       **/
      joinChanged(flag){
        this.showJoin = flag;
      },
      /**
       * 判断用户是否推客资格
       **/
      getFollowerId(){
        this.$http.get(this.followerIdUrl)
          .then((res) => {
            if (res.body.code == 0) {
              let data = res.body;
              if (data.result) {
                if (data.result.length >= 1) {
                  sessionStorage.setItem("followerId", userId);
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
        this.$http.get(this.conditionUrl)
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
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .home_nav {
    position: fixed;
    top: 4.2rem;
    z-index: 33;
    width: 100%;
    background: #fff;
    height: 0.79rem;
    border-bottom: #e6e6e6 solid 1px;
  }

  .home_nav li {
    width: 33.333%;
    float: left;
    text-align: center;
    height: 0.79rem;
    font-size: 0.3rem;
  }

  .home_nav li a {
    color: #323232;
    line-height: 0.71rem;
    font-size: 0.3rem;
    padding: 0 0.06rem;
    display: inline-block;
  }

  .home_nav li a.selected {
    color: #fd2a2a;
    border-bottom: #fd2a2a solid 4px;
  }

  .nav_com {
    padding: 4.99rem 0 0.9rem;
  }

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

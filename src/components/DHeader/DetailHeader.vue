<template>
  <article class="topVideo">
    <span class="topVSub topVLive" v-show="(liveInfo.state & 1)==1">直播</span>
    <span class="topVSub topVHf" v-show="(liveInfo.state & 4)==4">回放</span>
    <section class="topVStatus" v-show="authStatus==8">
      <div class="topVStatusCont">
        <h3 class="tit">本直播为私密直播</h3>
        <div class="topVStatusForm a_center">
          <p class="inpt"><input type="password" placeholder="请输入密码" class="tex" v-model="passValue"/></p>
          <button class="ok" @click="passEvt">确定</button>
        </div>
      </div>
    </section>
    <section class="topVStatus" v-show="authStatus==1">
      <div class="topVStatusCont">
        <h3 class="tit">本直播仅限群成员观看</h3>
        <button class="btn" @click="joinEvt">加入社群</button>
      </div>
    </section>
    <section class="topVStatus" v-show="authStatus==2">
      <div class="topVStatusCont">
        <h3 class="tit">本直播仅限群成员观看</h3>
        <button class="btn">加群审核中</button>
      </div>
    </section>
    <section class="topVStatus" v-show="authStatus==4">
      <div class="topVStatusCont">
        <h3 class="tit">本直播为收费直播，付费即可以观看</h3>
        <button class="btn" @click="payEvt">支付¥{{price}}观看</button>
      </div>
    </section>
    <section class="topVStatus" v-show="authStatus==16">
      <div class="topVStatusCont">
        <h3 class="tit">本直播仅限群会员观看</h3>
        <button class="btn" @click="payVipEvt">购买会员</button>
      </div>
    </section>
    <section class="topVStatus" v-show="authStatus==-2">
      <div class="topVStatusCont">
        <h3 class="tit">您的会员类型无法观看本直播</h3>
        <button class="btn" @click="payVipEvt">购买其它会员</button>
      </div>
    </section>
    <!--<video-player :options="videoOptions" style="display:block;width:100%;height:100%"></video-player>-->
    <!--<gaiay-player :addGroup="addGroup" :liveSource="dealLiveSrc" :livePoster="liveInfo.pic"></gaiay-player>-->
    <gaiay-m3u8 :type="liveInfo.type"
                :state="dealState"
                :poster="liveInfo.pic"
                :playerUrl="dealLiveSrc">
    </gaiay-m3u8>
  </article>
</template>
<script>
  import GaiayM3u8 from 'components/GaiayPlayer/GaiayM3u8';
  import {joinEvent} from 'common/js/joinCircle.js';
  export default {
    name: 'detailheader',
    components: {
      GaiayM3u8
    },
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
      addGroup: {
        type: Number,
        default: 2
      },
      userRole: {
        type: Number,
        default: -1
      },
      liveInfo: {
        type: Object,
        default: {}
      },
      authStatus: {
        type: Number,
        default: 1
      },
      price: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        passValue: '',
        videoOptions: {//     vue-video-player使用的配置，备用勿删
          source: {
            type: "application/x-mpegURL",
            src: "",
            withCredentials: false
          },
          poster: "",
          live: true,
          autoplay: false,
        }
      }
    },
    created: function () {

    },
    methods: {
      passEvt(){ //密码框按钮点击事件
        var val = this.passValue;
        if (val) {
          if (this.userId == undefined || this.userId == "") {
            var auth = new oauth();
            auth.init("", 1);
            return auth.auth();
          }
          this.$parent.getViewAuth(val);
        }
        else {
          alert("请输入密码");
        }
      },
      joinEvt(){
        var join = this.$parent.join;
        let _this = this;
        joinEvent(this.userId, this.followerId, this.circleId, join, this.liveInfo.id, this.liveInfo.name, function (addGroup, popuText, authStatus) {
          if (join == 1) {
            _this.$parent.authStatus = 2;
          } else {
            _this.$parent.addGroup = addGroup;
            _this.$parent.popuText = popuText;
            _this.$parent.authStatus = authStatus;
          }
        });
        //      console.log(obj);
      },
      payEvt(){
//        alert("进入支付流程");
        if (this.userId == undefined || this.userId == "") {
          var auth = new oauth();
          auth.init("", 1);
          return auth.auth();
        } else {
          this.viewAuth_charge();
        }
      },
      payVipEvt(){
//        alert("购买会员、其它会员流程");
        if (this.userId == undefined || this.userId == "") {
          var auth = new oauth();
          auth.init("", 1);
          return auth.auth();
        } else {
          this.viewVipList_change();
        }
      },
      //跳转交费
      viewAuth_charge() {
        var url = "/zhangmen/live/view/charge" + "?";
        url += "circleId=" + this.circleId;
        url += "&userId=" + this.userId;
        url += "&liveId=" + this.liveInfo.id;
        url += "&liveName=" + this.liveInfo.title;
        url += "&bizType=joinCirclePay";
        url += "&liveChargeCallback=" + encodeURIComponent(window.location.href);
        if (this.authStatus != 4) {// 付费直播不需要传type，全部观看、群成员观看、密码观看传type=1
          url += "&type=1";
        }
        url += "&followerId=" + (this.followerId == undefined ? '' : this.followerId);
        window.location.href = url;
      },
      /*viewAuth_charge: function () {
       var url = requstUrl + "/zhangmen/live/view/charge";
       var type = null;
       if (this.authStatus != 4) {// 付费直播不需要传type，全部观看、群成员观看、密码观看传type=1
       type = 1;
       }
       this.$http.post(url,{"liveName" : this.liveInfo.title, "userId" : this.userId, "liveId" : this.liveInfo.id , "circleId" : this.circleId, "liveChargeCallback" : encodeURIComponent(window.location.href), "followerId" : this.followerId,"type" : type},{emulateJSON:true})
       .then((response) => {
       var data = response.body;
       if (data.code == 0) {
       window.wallet.pay(data.walletOrderId, data.appKey, data.appDomain, data.price, data.redirect,data.description,'','web');
       } else if(data.code == 16224){
       this.authStatus = 0;
       this.addGroup = 4;
       }
       })
       .catch(function (response) {
       console.log(response);
       })
       },*/
      //会员购买
      viewVipList_change: function () {
        var url = requstUrl + "/vip/" + this.circleId + "/product/list";
        if ((this.liveInfo.state & 2) == 2) {
          var param = "userId=" + this.userId
              + "&circleId=" + this.circleId
              + "&liveId=" + this.liveInfo.id
              + "&followerId=" + this.followerId;
        } else {
          var param = "userId=" + this.userId
              + "&circleId=" + this.circleId
              + "&liveId=" + this.liveInfo.id
              + "&liveUrl=" + encodeURIComponent(window.location.href)
              + "&followerId=" + this.followerId;
        }
        if (this.authStatus != 4) {// 付费直播不需要传type，全部观看、群成员观看、密码观看传type=1
          param += "&type=1";
        }
        window.location.href = url + "?" + param;
      },
    },
    computed: {
      dealLiveSrc(){
        let src = "";
        let liveInfo = this.liveInfo;
        if ((liveInfo.state & 1) == 1)src = liveInfo.play.hls;
        else if ((liveInfo.state & 4) == 4) src = liveInfo.playBackUrl;
        return src;
      },
      dealState(){
        let state = 0;
        if ((liveInfo.state & 1) == 1)state = 1;
        else if ((liveInfo.state & 4) == 4) state = 4;
        return state;
      }
    }
  }
</script>

<style>
  /*
  DetailHeader.vue
   */
  .topVideo {
    width: 100%;
    height: 4.22rem;
    position: fixed;
    top: 0;
    z-index: 5;
    background: #fff;
  }

  .topVSub {
    position: absolute;
    left: 0;
    top: .2rem;
    display: inline-block;
    background: rgba(0, 0, 0, .4);
    font-size: .2rem;
    border-top-right-radius: .5rem;
    border-bottom-right-radius: .5rem;
    padding: .05rem .14rem .06rem .24rem;
    color: #fff;
    z-index: 10;
  }

  .topVLive::before, .topVHf::before, .topVYgao::before {
    width: .08rem;
    height: .08rem;
    background: #f04640;
    content: "";
    border-radius: 100%;
    left: .1rem;
    top: 50%;
    margin-top: -.04rem;
  }

  .topVHf::before {
    background: #ff9600;
  }

  /*回放*/
  .topVYgao::before {
    background: #3282fa;
  }

  /*预告*/
  .topVBf {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -.6rem 0 0 -.6rem;
    width: 1.2rem;
    height: 1.2rem;
    background: rgba(0, 0, 0, .4);
    border-radius: 100%;
    display: block;
  }

  .topVBf::after {
    width: .4rem;
    height: .54rem;
    background-position: 0 -3.8rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -.25rem 0 0 -.15rem;
  }

  /*连接失败*/
  .topVFail, .topVStatus {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #000;
    z-index: 1000
  }

  .topVFailCont, .topVStatusCont {
    position: absolute;
    left: 50%;
    top: 50%;
    /* -webkit-transform: translate(-50%, -50%);
     transform: translate(-50%, -50%);*/
    text-align: center;
    width: 90%;
    height: 1.6rem;
    margin: -.6rem 0 0 -45%;
  }

  .topVFail .tit, .topVStatusCont .tit {
    text-align: center;
    font-size: .28rem;
    opacity: .8;
    margin-bottom: .35rem;
    color: #fff;
  }

  .topVFail .btn {
    display: inline-block;
    color: #fff;
    font-size: .32rem;
    line-height: .7rem;
    height: .7rem;
    padding: 0 .45rem 0 .94rem;
    border: 1px solid #fff;
    border-radius: .5rem;
    position: relative;
  }

  .topVFail .btn::before {
    width: .33rem;
    height: .33rem;
    background-position: 0 -4.53rem;
    position: absolute;
    top: 50%;
    margin: -.165rem 0 0 .46rem;
  }

  /*各种状态*/
  .topVStatus {
    background: rgba(0, 0, 0, .4);
  }

  .topVStatusCont .tit {
    font-size: .28rem;
    opacity: 1
  }

  .topVStatusCont .btn {
    font-size: .32rem;
    line-height: .8rem;
    min-width: 3rem;
    height: .8rem;
    padding: 0 .55rem;
    border-radius: .5rem;
    background: #f03c38;
    color: #fff;
    text-align: center;
  }

  .topVStatusForm {
    text-align: center;
  }

  .topVStatusForm .inpt {
    height: .8rem;
    width: 2rem;
    padding: 0 .2rem;
    background: #fff;
    border-top-left-radius: .5rem;
    border-bottom-left-radius: .5rem;
  }

  .topVStatusForm .tex {
    font-size: .28rem;
    width: 100%;
    margin-top: .25rem;
  }

  .topVStatusForm .ok {
    height: .8rem;
    width: 1.2rem;
    font-size: .28rem;
    line-height: .8rem;
    background: #fff;
    border-top-right-radius: .5rem;
    border-bottom-right-radius: .5rem;
    background: #db433e;
    text-align: center;
    color: #fff;
  }

  .vjs_video_3-dimensions {
    height: 4.22rem;
  }
</style>

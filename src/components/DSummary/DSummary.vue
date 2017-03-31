<template>
  <section class="liveInfo clearfix">
    <h1 class="liveInfoTit">{{liveInfo.title}}</h1>
    <ul class="liveInfoSub clearfix">
      <li class="date fl">{{ new Date(liveInfo.startTime).Format("yyyy-MM-dd hh:mm:ss")}}</li>
      <!--<li class="num fl">128</li>-->
    </ul>
    <div class="introduction" v-if="desc">
      <div class="introCont" v-bind:class="{'showHeight':showHeight,'three':desc.length>=97}">{{desc}}</div>
      <p class="introArrow" v-if="desc.length>=97" v-bind:class="{'down':showHeight}" @click="changeAbstract">箭头</p>
      <!--<p class="introArrow down">箭头</p>向下-->
    </div>
    <dl class="liveInfoTuig pubFlex" @click="hrefCircle">
      <dt><img v-lazy="circleInfo.logo"></dt>
      <dd class="oneline_text autoFlex">{{circleInfo.name}}</dd>
    </dl>
  </section><!-- 信息 -->
</template>

<script>
  import {secondShare} from 'common/js/wxShare/secondShare.js';
  export default {
    name: 'dheader',
    props: {
      circleId: {
        type: String,
        default: ''
      },
      followerId: {
        type: String,
        default: ''
      },
      liveInfo: {
        type: Object,
        default: {}
      },
    },
    data () {
      return {
        liveDetail: this.$parent.liveDetail,//获取父组件的这个对象
        circleInfo: '',//社群信息
        liveId: '',//直播id
        descUrl: requstUrl + "/api/live/desc?liveId=",//获取直播详情简介
        showHeight: false,//控制简介高度
        desc: '',
        circleInfoUrl: requstUrl + "/api/v2/circle/info",
      }
    },
    created: function () {
      this.liveId = this.liveInfo.id;
      this.getDescByLiveId();
      this.getCircleInfo();

      console.log("--组件创建完成的参数状态：");
      console.log("--社群名称：" + this.circleInfo.name);
      console.log("--分享logo：" + this.circleInfo.logo);
      console.log("--直播标题：" + this.liveInfo.title);
      console.log("--followerId：" + this.followerId);
      console.log("--备用信息：");
      console.log(this.circleInfo);
      console.log(this.liveInfo);
      console.log("--组件创建完成的参数状态：结束。。。。。");
    },
    methods: {
      hrefCircle(){
        window.location.href = this.circleInfo.shareUrl;
      },
      /**
       * 简介展开收起
       **/
      changeAbstract(){
        if (!this.showHeight) {
          this.showHeight = true;
        } else {
          this.showHeight = false;
        }
      },
      /**
       * 根据直播id获取直播简介
       **/
      getDescByLiveId(){
        var liveId = this.liveInfo.id;
        this.$http.get(this.descUrl + liveId)
        .then((response) => {
          var data = response.body;
          if (data.code == 0) {
            if (data.descs[liveId] == '' || data.descs[liveId] == null || data.descs[liveId] == undefined) {
              this.desc = '这个群主很懒，还没有编写直播简介';
              window.circleInfo.desc = '这个群主很懒，还没有编写直播简介';
            } else {
              this.desc = data.descs[liveId];
              window.circleInfo.desc = data.descs[liveId];
            }
            this.$parent.descError = -1;
          } else {
            this.$parent.descError = 0;
          }
        })
        .catch(function (response) {
          this.$parent.descError = 0;
          console.log(response);
        })
      },
      getCircleInfo(){
        console.log("初始化分享时能获取到的参数：");
        console.log("社群名称：" + this.circleInfo.name);
        console.log("分享logo：" + this.circleInfo.logo);
        console.log("直播标题：" + this.liveInfo.title);
        console.log("followerId：" + this.followerId);
        console.log("备用信息：");
        console.log(this.circleInfo);
        console.log(this.liveInfo);
        console.log("备用信息：结束。。。。。")


        this.$http.get(this.circleInfoUrl, {params: {'circleId': this.circleId}})
        .then((response) => {
          var body = response.body;
          if (body.code == 0) {
            this.circleInfo = body.result;
            window.circleInfo = body.result;
            this.$parent.join = body.result.join;
            this.$parent.descError = -1;

            var circleName = this.circleInfo.name;
            var logo = this.circleInfo.logo;
            var title = this.liveInfo.title;
            var state = this.liveInfo.state;
            var followerId = this.followerId;
            var prefix = "未知类型";
            if ((liveInfo.state & 1) == 1) state = 1 //直播
            else if ((liveInfo.state & 2) == 2)state = 2 //预告
            else if ((liveInfo.state & 4) == 4) state = 4//回放
            switch (state) {
              case 1:
                prefix = "正在直播"
                break;
              case 2:
                prefix = "直播预告"
                break;
              case 4:
                prefix = "直播回放"
                break;
            }
            secondShare.circle_share('来自[' + circleName + ']社群', logo, prefix+'['+title+']', followerId);
          } else {
            this.$parent.descError = 0;
          }
        })
        .catch(function (response) {
          this.$parent.descError = 0;
          console.log(this.$parent.descError);
        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*视频信息*/
  .liveInfo {
    padding: .3rem 0;
  }

  .liveInfoTit {
    font-size: .36rem;
    line-height: .44rem;
    margin-bottom: .28rem;
  }

  .liveInfoSub {
    height: .24rem;
    margin-bottom: .18rem
  }

  .liveInfoSub li {
    font-size: .23rem;
    line-height: .24rem;
    position: relative;
    margin-right: .62rem;
    color: #a0a0a0;
    padding-left: .33rem;
  }

  .liveInfoSub li:last-child {
    margin-right: 0
  }

  .liveInfoSub li::before {
    width: .24rem;
    height: .24rem;
    top: 50%;
    margin-top: -.12rem;
  }

  .liveInfoSub .date::before {
    background-position: -.76rem 0rem;
  }

  .liveInfoSub .num::before {
    background-position: -.76rem -.36rem;
  }

  .introduction {
    margin-bottom: .15rem;
  }

  .introCont {
    font-size: .28rem;
    line-height: .4rem;
    color: #a0a0a0;
    overflow: hidden;
    transition: all 1s;
    -webkit-transition: all 1s;
  }

  .three {
    height: 1.2rem;
  }

  .showHeight {
    height: auto;
  }

  .introArrow {
    width: .4rem;
    height: .4rem;
    background-position: -.65rem -2.08rem;
    margin: 0 auto;
    text-indent: -9999px;
  }

  .introArrow.down {
    background-position: -.67rem -1.75rem;
  }

  .liveInfoTuig dt {
    width: .6rem;
    height: .6rem;
  }

  .liveInfoTuig dt img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
    border: 1px solid #f8f8f8;
  }

  .liveInfoTuig dd {
    font-size: .28rem;
    color: #646464;
    line-height: .6rem;
    margin-left: .3rem;
    padding-right: .2rem;
    position: relative;
  }

  .liveInfoTuig dd:after {
    content: "";
    position: absolute;
    width: .14rem;
    height: .22rem;
    background-position: -.78rem -1.46rem;
    top: 50%;
    right: 0;
    margin-top: -.11rem;
  }

</style>

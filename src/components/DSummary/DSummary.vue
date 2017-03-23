<template>
  <section class="liveInfo clearfix">
    <h1 class="liveInfoTit twoline_text">{{liveDetail.title}}</h1>
    <ul class="liveInfoSub clearfix">
      <li class="date fl">{{ new Date(liveDetail.startTime).Format("yyyy-MM-dd hh:mm:ss")}}</li>
      <!--<li class="num fl">128</li>-->
    </ul>
    <div class="introduction" v-if="desc">
      <div class="introCont" v-bind:class="{'showHeight':showHeight}">{{desc}}</div>
      <p class="introArrow" v-if="desc.length>=50" v-bind:class="{'down':showHeight}" @click="changeAbstract">箭头</p>
      <!--<p class="introArrow down">箭头</p>向下-->
    </div>
    <dl class="liveInfoTuig pubFlex" @click="hrefCircle">
      <dt><img v-bind:src="circleInfo.logo"></dt>
      <dd class="oneline_text autoFlex">{{circleInfo.name}}</dd>
    </dl>
  </section><!-- 信息 -->
</template>

<script>
  export default {
    name: 'dheader',
    data () {
      return {
        liveDetail: this.$parent.liveDetail,//获取父组件的这个对象
        circleInfo: {},//从缓存里面取出社群信息
        liveId:liveInfo.id,//直播id
        list: JSON.parse(sessionStorage.getItem('list')),//从缓存里面取出社群信息
        descUrl: requstUrl + "/api/live/desc?liveId=",//获取直播详情简介
        showHeight: false,//控制简介高度
        desc:'',
        circleId:circleId,
        circleInfoUrl:requstUrl +"/api/v2/circle/info",
      }
    },
    computed: {},
    created: function () {
      this.getDescByLiveId();
      this.getCircleInfo();
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
        var liveId = this.liveId;
        console.log(liveId)
        if(liveId){
            liveId = this.list.id;
        }
        this.$http.get(this.descUrl+liveId)
          .then((response) => {
            var data = response.body;
        if (data.code == 0) {
            this.desc = data.descs[liveId];
            window.circleInfo.desc = data.descs[liveId];
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
        this.$http.get(this.circleInfoUrl, {params:{'circleId': this.circleId}})
          .then((response) => {
            var body = response.body;
            console.log(this.circleId);
            if (body.code == 0) {
              this.circleInfo = body.result;
              window.circleInfo = body.result;
              this.$parent.descError = -1;
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

  .showHeight {
    height: 0.85rem;
  }

  .introArrow {
    width: .4rem;
    height: .4rem;
    background-position: -.67rem -1.75rem;
    margin: 0 auto;
    text-indent: -9999px;
  }

  .introArrow.down {
    background-position: -.67rem -2.08rem;
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
  }
</style>

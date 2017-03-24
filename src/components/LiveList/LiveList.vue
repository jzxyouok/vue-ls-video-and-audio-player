<template>
  <div class="live_main">
    <div v-if="lives.length == 0" class="no_data">
      群主还在马不停蹄，准备直播内容中
    </div>
    <div class="live_list_con" v-else="">
      <p class="live_more" v-if="liveBa == 0"><a href="javascript:;" @click="moreLiveList">查看全部直播</a></p>
      <h2 class="moreListTit" v-if="liveBa == 1">更多直播</h2>
      <ul class="live_list">
        <li v-for="list in lives">
          <a @click="clickLiveList(list)">
            <div class="lt_img">
              <img v-bind:src="list.pic">
              <p v-if="(list.state&1) == 1" class="mode red">直播</p>
              <p v-if="(list.state&2) == 2" class="mode blue">预告</p>
              <p v-if="(list.state&4) == 4" class="mode orgin">回放</p>
              <p v-bind:class="{'video_ioc':list.type == 1,'aideo_ioc':list.type == 2}" class="ioc"></p>
            </div>
            <div class="lt_text">
              <p class="title">{{list.title}}</p>
              <div class="lt_time">
                <p>{{ new Date(list.startTime).Format("yyyy-MM-dd hh:mm:ss")}}</p>
                <p v-if="list.num">{{list.num}}</p>
              </div>
            </div>
          </a>
        </li>
      </ul>
      <p class="more" v-if="lives.length == 15" v-on:click="moreLiveList">
          <a class="more_btn">更多</a>
      </p>
    </div>
  </div>
</template>
<script>
  export default ({
    name: 'liveList',
    data () {
      return {
        liveBa:this.$parent.liveBa,//直播列表是在社群主页用
        liveIds: [],//存储直播id的集合
        lives: [],//存储直播详情的集合
        liveIdstUrl:requstUrl+"/api/live/circle/liveIds",//获取直播id api
        liveListUrl:requstUrl+"/api/live/info",//获取直播详情api
        circleId: sessionStorage.getItem('circleId'),
        followerId:sessionStorage.getItem('followerId'),
        allLiveListUrl:requstUrl+"/html/live/livesList.html",
      }
    },
    created: function () {
      this.getLiveIds();
    },
    methods: {
      moreLiveList(){
        window.location.href = this.allLiveListUrl+"?id="+this.circleId+"&followerId="+this.followerId;
      },
      /**
       * 获取直播ids
       **/
      getLiveIds: function () {
        this.$http.get(this.liveIdstUrl, {params:{'circleId': this.circleId, 'size': 15}})
          .then((response) => {
            var body = response.body;
            console.log(body);
            if (body.code == 0) {
              var results = body.liveIds;
              var end = results.length > 15 ? 15 : results.length;
              for (var i = 0; i< end; i++) {
                this.liveIds += results[i] + ',';
              }
              this.getLiveList();
            } else {
              console.log(response.message);
            }
          })
          .catch(function (response) {
            console.log(response);
          })
      },
      /**
       * 获取直播列表详情
       **/
      getLiveList: function () {
        this.$http.get(this.liveListUrl, {params: {'circleId': this.circleId, 'liveId': this.liveIds, 'dataType': 11}})
          .then((response) => {
            if (response.body.code == 0) {
              this.lives = response.data.lives;
            } else {
              console.log(response);
            }
          })
          .catch(function (response) {
            console.log(response)
          })
      },
      clickLiveList(list){
        sessionStorage.setItem("list", JSON.stringify(list));
        if((list.state&2) == 2){
          window.location.href = './bespeak.html';
        }else{
          window.location.href = './detail.html';
        }

      }
    }
  });
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .live_main {
    overflow: hidden;
    overflow-y: auto;
  }
  .moreListTit{font-size: .32rem; padding: 0.3rem; padding-bottom: 0;}
  .no_data {
    width: 100%;
    background: url("../../module/home/images/no_data_ioc.png") no-repeat center 1.12rem;
    background-size: 2.04rem 2.32rem;
    font-size: 0.28rem;
    color: #a0a0a0;
    text-align: center;
    padding-top: 4.04rem;
    padding-bottom: 1rem;
  }

  .live_list_con {
  }

  .live_more {
    height: 0.7rem;
    line-height: 0.7rem;
    text-align: center;
    font-size: 0.28rem;
    background: #f5f5f5;
  }

  .live_more a {
    color: #565656;
    background: url("../../module/home/images/g_ioc_7.png") no-repeat right center;
    background-size: 0.14rem 0.24rem;
    padding-right: 0.32rem;
  }

  .live_list {
    padding: 0.2rem 0;
  }

  .live_list li {
    display: -webkit-box;
    padding: 0.1rem 0.3rem;
  }

  .live_list li a {
    display: -webkit-box;
    width: 100%;
  }

  .lt_img {
    width: 2.4rem;
    height: 1.5rem;
    position: relative;
    float: left;
  }

  .lt_img p.mode {
    padding: 0 0.05rem;
    height: 0.24rem;
    line-height: 0.24rem;
    font-size: 0.18rem;
    color: #fff;
    text-align: center;
    position: absolute;
    top: 0.1rem;
    left: 0.1rem;
  }

  .lt_img p.red {
    background: #f01414;
  }

  .lt_img p.blue {
    background: #3c8cfa;
  }

  .lt_img p.orgin {
    background: #ff9600;
  }

  .lt_img p.ioc{
    width: 0.28rem;
    height: 0.28rem;
    border-radius: 100%;
    position: absolute;
    right: 0.08rem;
    bottom: 0.08rem;
  }

  .video_ioc {
    background: rgba(0, 0, 0, 0.4) url("../../module/home/images/g_ioc_3.png") no-repeat center;
    background-size: 0.16rem 0.12rem;
  }

  .aideo_ioc {
    background: rgba(0, 0, 0, 0.4) url("../../module/home/images/g_ioc_4.png") no-repeat center;
    background-size: 0.16rem 0.19rem;
  }

  .lt_text {
    padding-left: 0.22rem;
    -webkit-box-flex: 1;
  }

  .lt_text .title {
    font-size: 0.28rem;
    min-height: 0.72rem;
    line-height: 0.36rem;
    color: #323232;
  }

  .lt_time {
    height: 0.22rem;
    padding-top: 0.42rem;
  }

  .lt_time p {
    padding-left: 0.32rem;
    height: 0.32rem;
    line-height: 0.32rem;
    font-size: 0.24rem;
    color: #a0a0a0;
  }

  .lt_time p:nth-child(1) {
    width: 2.7rem;
    float: left;
    background: url("../../module/home/images/g_ioc_5.png") no-repeat left center;
    background-size: 0.28rem 0.28rem;
  }

  .lt_time p:nth-child(2) {
    float: right;
    background: url("../../module/home/images/g_ioc_6.png") no-repeat left center;
    background-size: 0.28rem 0.28rem;
  }
  .more {
    padding-bottom: 0.96rem;
    display: -webkit-box;
    -webkit-box-pack: center;
  }
  .more a {
    display: block;
    height: 0.88rem;
    line-height: 0.88rem;
    font-size: 0.28rem;
  }
  .more_btn {
    color: #787878;
    background: url("../../module/home/images/g_ioc_7.png") no-repeat right center;
    background-size: 0.14rem 0.24rem;
    padding-right: 0.3rem;
  }
</style>

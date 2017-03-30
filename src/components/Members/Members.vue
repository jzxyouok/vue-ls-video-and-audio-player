<template>
  <div id="members-wrap">
    <div class="wlbgl" v-if="noData" @click="getMembers">
      网速不给力，点击重试
    </div>
    <ul class="merbers_list">
      <li v-for="m in members">
        <a @click="cardDetail(m.id)">
          <img :src="m.logo" class="m_logo">
          <div class="m_text">
            <div class="m_zhi">
              <p class="c_name">{{m.name}}</p>
              <img v-if="m.authState == 3" src="../../module/home/images/g_ioc_8.png">
              <p class="c_job">{{m.position}}</p>
              <span class="qz_logo" v-if="m.userType == 0">群主</span>
              <span class="gly_logo" v-if="m.userType == 1">管理员</span>
            </div>
            <p class="job_name">{{m.company}}</p>
          </div>
        </a>
      </li>
    </ul>
    <p class="more">
      <a class="more_btn" v-if="length == 15 && pageNo != 3 &&noData == false" v-on:click="getMoreMembers()">更多</a>
      <a class="down_btn" v-if="pageNo == 3" v-on:click="utils.downloadApp()">下载APP查看更多</a>
      <a class="no_more" v-if="length < 15 && length == 0">没有更多了</a>
    </p>
  </div>
</template>

<script>
  export default {
    name: 'members',
    data () {
      return {
        utils: this.$parent.utils,
        pageNo: 1,
        length: 15,
        circleId: window.circleInfo.circleId,
        members: [],
        noData: false,
        memberListUrl:requstUrl+'/api/v2/circle/member/info/',//获取成员列表api
      }
    },
    created: function () {
      this.getMembers();
    },
    methods: {
        /**
         * 获取成员列表
         **/
      getMembers: function () {
        this.$http.get(this.memberListUrl, {params:{
          'circleId': this.circleId,
          'pageNo': this.pageNo
        }})
          .then((response) => {
            if (response.body.code == 0) {
              this.members = this.members.concat(response.body.results);
              this.length = response.body.results.length || 0;
              this.noData = false;
            } else {
              this.noData = true;
              console.log(this.noData);
            }
          })
          .catch(function (response) {
            this.noData = true;
            console.log(this.noData);
          })
      },
      /**
       * 获取更多成员
       */
      getMoreMembers: function () {
        ++this.pageNo;
        console.log(this.pageNo);
        if (this.pageNo <= 3) {
          this.getMembers();
        }
      },
      /**
       * 跳转名片详情
       * @param userId
       */
      cardDetail: function (userId) {
        window.location.href = requstUrl+'/zhangmen/card/info/detail-share-' + userId + "?"
          + 'fromPage=' + encodeURIComponent(window.location.href);
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wlbgl {
    background: url("../../module/home/images/g_ioc_9.png") no-repeat center 1.52rem;
    background-size: 1.44rem 1.86rem;
    padding-top: 3.98rem;
    text-align: center;
    font-size: 0.28rem;
    color: #a0a0a0;
    line-height: 0.4rem;
  }

  .merbers_list {
    padding: 0.06rem 0 0 0.23rem;
  }

  .merbers_list li {
    height: 1.2rem;
    padding-top: 0.14rem;
    display: -webkit-box;
  }
  .merbers_list li a{
    width: 100%;
    display: -webkit-box;
  }
  .merbers_list li .m_logo {
    width: 0.9rem;
    height: 0.9rem;
    margin-right: 0.16rem;
    border-radius: 100%;
  }

  .m_text {
    height: 1.05rem;
    border-bottom: #e6e6e6 solid 1px;
    -webkit-box-flex: 1;
  }

  .m_zhi {
    height: 0.48rem;
    line-height: 0.48rem;
    display: -webkit-box;
  }

  .m_zhi .c_name {
    font-size: 0.28rem;
    color: #323232;
    line-height: 0.48rem;
    padding-right: 0.05rem;
  }

  .m_zhi .c_job {
    max-width: 2.6rem;
    padding-left: 0.2rem;
    font-size: 0.24rem;
    color: #a0a0a0;
    line-height: 0.48rem;
    text-overflow:ellipsis;
    overflow:hidden;
    white-space:nowrap;
  }

  .m_zhi img {
    width: 0.24rem;
    height: 0.21rem;
    vertical-align: top;
    margin-top: 0.14rem;
  }

  .m_zhi span {
    display: block;
    padding: 0 0.05rem;
    font-size: 0.18rem;
    color: #fff;
    height: 0.26rem;
    line-height: 0.26rem;
    margin: 0.12rem 0 0 0.2rem;
    border-radius: 0.04rem;
  }

  .m_zhi .qz_logo {
    background: #facf4c;
  }

  .m_zhi .gly_logo {
    background: #b2d1ff;
  }

  .job_name {
    font-size: 0.24rem;
    color: #a0a0a0;
    line-height: 0.4rem;
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

  .down_btn {
    color: #ff2e2e;
    background: url("../../module/home/images/g_ioc_7.png") no-repeat right center;
    background-size: 0.14rem 0.24rem;
    padding-right: 0.3rem;
  }
</style>

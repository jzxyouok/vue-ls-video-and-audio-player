<template>
  <div class="home_bg" :style="bgStyle">
    <div class="home_top">
      <img v-bind:src="logo">
      <h3>{{name}}</h3>
      <p class="ht_num"><em></em><span>{{memberNum}}</span></p>
      <p class="ht_desc">{{desc}}</p>
      <a class="ht_open_btn" href="javascript:;"></a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'gheader',
    data () {
      return {
        bgStyle: {
          backgroundImage:'url('+this.logo+')'
        }
      }
    },
    props: {
      name: {
        type: String,
        default: "暂无社群名称"
      },
      logo: {
        type: String,
        default: ""
      },
      desc: {
        type: String,
        default: "sdsdfsdf dsdfsdfd"
      },
      memberNum: {
        type: Number,
        default: 0
      }
    },
    computed:{

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .home_bg {
  }

  .home_top {
    height: 4.2rem;
    color: #fff;
    background: rgba(0, 0, 0, 0.55);
    font-size: 0.24rem;
    text-align: center;
  }

  .home_top img {
    margin-top: 0.54rem;
    height: 1.16rem;
    width: 1.16rem;
    border-radius: 100%;
  }

  .home_top h3 {
    font-size: 0.36rem;
    line-height: 0.4rem;
    padding-top: 0.2rem;
    text-align: center;
  }

  .home_top .ht_num {
    font-size: 0.24rem;
    text-align: center;
    line-height: 0.24rem;
  }

  .home_top .ht_num em {
    display: inline-block;

    width: 0.2rem;
    height: 0.2rem;
    background-size: 0.2rem;
    vertical-align: middle;
    margin-right: 0.08rem;
  }

  .home_top .ht_desc {
    padding: 0 1.23rem;
    line-height: 0.33rem;
    padding-top: 0.2rem;
  }

  .home_top .ht_open_btn {
    display: block;
    width: 0.24rem;
    height: 0.12rem;
    background-repeat: no-repeat;
    background-size: 0.24rem 0.12rem;
    margin: 0.36rem auto 0;
  }
</style>
<template>
  <div>
    <div class="sf_popups hide" v-if="addGroup == 0 || addGroup == 1">
      <div class="popups" v-if="addGroup == 0">
        <img src="/static/images/g_ioc_10.png">
        <p>加群失败！</p>
      </div>
      <div class="popups" v-if="addGroup == 1">
        <img src="/static/images/g_ioc_11.png">
        <p>加群成功！</p>
      </div>
    </div>
    <div class="join_popups" v-if="addGroup == -1">
      <div><p>{{popuText}}</p></div>
      <a @click="addGroup=2">我知道了</a>
    </div>
  </div>
</template>
<style>
  .sf_popups {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 2rem;
    height: 2rem;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 0.1rem;
    margin: -1rem;
    z-index: 999;
  }

  .popups img {
    display: block;
    width: 0.77rem;
    height: 0.77rem;
    margin: 0.38rem auto 0;
  }

  .popups p {
    font-size: 0.32rem;
    color: #fff;
    line-height: 0.36rem;
    margin-top: 0.16rem;
    text-align: center;
  }

  .hide {
    animation: s_hide 3s forwards;
    -webkit-animation: s_hide 3s forwards;
    -moz-animation: s_hide 3s forwards;
    -ms-animation: s_hide 3s forwards;
    -o-animation: s_hide 3s forwards;
  }

  @keyframes s_hide {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .join_popups {
    position: fixed;
    top: 50%;
    left: 50%;
    height: 2.8rem;
    width: 5.4rem;
    margin: -1.4rem -2.7rem;
    background: #fff;
    border-radius: 0.26rem;
    z-index: 99;
  }

  .join_popups div {
    padding: 0.3rem;
    height: 1.9rem;
    display: -webkit-box;
    -webkit-box-align: center;
  }

  .join_popups p {
    font-size: 0.26rem;
    color: #000;
    text-align: center;
    line-height: 0.4rem;
  }

  .join_popups a {
    display: block;
    width: 100%;
    height: 0.89rem;
    line-height: 0.89rem;
    color: #007aff;
    text-align: center;
    font-size: 0.34rem;
    border-top: #dadade solid 1px;
    font-weight: bold;
  }
</style>
<script>
  export default{
    name: 'marklayer',
    props: {
      addGroup: {
        type: Number,
        default: 2
      },
      popuText: {
        type: String,
        default: ''
      }
    }
  }
</script>

<template>
  <div class="home_bg">
    <sention class="home_img" :style="bgStyle"></sention>
    <div class="home_top">
      <div v-bind:class="{'up_con':upHtBtn,'dn_con':dnHtBtn}" class="home_top_con">
        <div class="logo">
          <img v-lazy="logo" v-show="dnHtBtn" v-bind:class="{'up_ht_btn':dnHtBtn,'dn_ht_btn':upHtBtn}">
        </div>
        <h3>{{name}}</h3>
        <p class="ht_num" v-if="memberNum"><em></em><span>{{memberNum}}</span></p>
        <p class="ht_desc" :class="{simpleLineAlign:simpleLineAlign}" v-if="desc != ''" :style="{height:tHeight+'rem'}" v-on:click="selectProp">{{desc}}</p>
      </div>
      <a v-bind:class="{'up_ht_btn':upHtBtn,'dn_ht_btn':dnHtBtn}" v-on:click="selectProp" class="ht_open_btn" href="javascript:;" v-if="desc.length >50"></a>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'gheader',
        data () {
            return {
                bgStyle: {
                    background:"url("+this.logo+"_r750x500) no-repeat center",
                    backgroundColor:'#fff',
                    backgroundSize:'100% 4.2rem'
                },
                tHeight : 0.86,
                upHtBtn : false,
                num : 1,
                dnHtBtn : true
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
                default: ""
            },
            memberNum: {
                type: Number,
                default: 0
            }
        },
        computed:{
          /**
           * 单行显示是控制文本居中的属性计算方法
           * @returns {boolean}
           */
          simpleLineAlign(){
            var show = false;
            var len = this.desc.length;
            if (len <= 22)show = true;
            else show = false;
            return show;
          }
        },
        methods: {
            //展开收起社群简介
            selectProp: function () {
                if(this.desc.length >50) {
                  if (this.num) {
                    this.upHtBtn = true;
                    this.dnHtBtn = false;
                    this.tHeight = 2.4;
                    this.num--;
                  } else {
                    this.upHtBtn = false;
                    this.dnHtBtn = true;
                    this.tHeight = 0.86;
                    this.num++;
                  }
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .home_img{position: absolute;width: 100%;height: 4.2rem;top: 0;left: 0;z-index: 0;-webkit-filter: blur(5px); /* Chrome, Safari, Opera */filter: blur(5px);}
  .home_bg {position: fixed;top:0;width: 100%;z-index: 33;background: #fff;}
  .home_top { height: 4.2rem; color: #fff; background: rgba(0, 0, 0, 0.55); font-size: 0.24rem; text-align: center;position: relative;z-index: 5}
  .home_top_con{color: #fff; font-size: 0.24rem; text-align: center;}
  .logo{padding-top: 0.54rem; margin: 0 auto; height: 1.7rem;  width: 1.16rem;}
  .home_top img {height: 1.16rem; width: 1.16rem; border-radius: 100%;}
  .home_top h3 {font-size: 0.36rem; line-height: 0.4rem; padding:0.2rem .2rem 0 .2rem; text-align: center;}
  .home_top .ht_num {font-size: 0.24rem; text-align: center; line-height: 0.24rem; padding-top: 0.1rem;}
  .home_top .ht_num em {display: inline-block; width: 0.2rem; height: 0.2rem; background: url("../../module/home/images/g_ioc_1.png") no-repeat; background-size: 0.2rem; vertical-align: middle; margin-right: 0.08rem;}
  .home_top .ht_desc {padding: 0.2rem 1.23rem 0; line-height: 0.33rem; height: 0.86rem; overflow : hidden;}
  .home_top .simpleLineAlign {display: block; text-align: center;}
  .home_top .ht_open_btn {display: block; width: 0.4rem; height: 0.3rem; background: url("../../module/home/images/g_ioc_2.png") no-repeat center bottom; background-size: 0.24rem 0.14rem; position: absolute; left: 50%; top:3.7rem; margin-left: -0.15rem;}
  .up_ht_btn{
    animation:a_dn_hto_btn 0.5s forwards;
    -webkit-animation:a_dn_hto_btn 0.5s forwards;
    -moz-animation:a_dn_hto_btn 0.5s forwards;
    -ms-animation:a_dn_hto_btn 0.5s forwards;
    -o-animation:a_dn_hto_btn 0.5s forwards;
  }
  .dn_ht_btn{
    animation:a_up_hto_btn 0.5s forwards;
    -webkit-animation:a_up_hto_btn 0.5s forwards;
    -moz-animation:a_up_hto_btn 0.5s forwards;
    -ms-animation:a_up_hto_btn 0.5s forwards;
    -o-animation:a_up_hto_btn 0.5s forwards;
  }
  .up_con{
    animation:a_up_con 0.5s forwards;
    -webkit-animation:a_up_con 0.5s forwards;
    -moz-animation:a_up_con 0.5s forwards;
    -ms-animation:a_up_con 0.5s forwards;
    -o-animation:a_up_con 0.5s forwards;
  }
  .dn_con{
    animation:a_dn_con 0.5s forwards;
    -webkit-animation:a_dn_con 0.5s forwards;
    -moz-animation:a_dn_con 0.5s forwards;
    -ms-animation:a_dn_con 0.5s forwards;
    -o-animation:a_dn_con 0.5s forwards;
  }
  @keyframes a_up_hto_btn
  {
    0%   {
      transform:rotate(0deg);
      -webkit-transform:rotate(0deg); /* Safari 和 Chrome */
      -moz-transform:rotate(0deg); /* Safari 和 Chrome */
      -ms-transform:rotate(0deg); /* Safari 和 Chrome */
      -o-transform:rotate(0deg); /* Safari 和 Chrome */
    }
    100%   {
      transform:rotate(180deg);
      -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
      -moz-transform:rotate(180deg); /* Safari 和 Chrome */
      -ms-transform:rotate(180deg); /* Safari 和 Chrome */
      -o-transform:rotate(180deg); /* Safari 和 Chrome */
    }
  }
  @keyframes a_dn_hto_btn
  {
    0%   {
      transform:rotate(180deg);
      -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
      -moz-transform:rotate(180deg); /* Safari 和 Chrome */
      -ms-transform:rotate(180deg); /* Safari 和 Chrome */
      -o-transform:rotate(180deg); /* Safari 和 Chrome */
    }
    100%   {
      transform:rotate(360deg);
      -webkit-transform:rotate(360deg); /* Safari 和 Chrome */
      -moz-transform:rotate(360deg); /* Safari 和 Chrome */
      -ms-transform:rotate(360deg); /* Safari 和 Chrome */
      -o-transform:rotate(360deg); /* Safari 和 Chrome */
    }
  }

  @keyframes a_up_con
  {
    100%   {
      transform:translate(0,-1.5rem);
      -webkit-transform:translate(0,-1.5rem);
      -moz-transform:translate(0,-1.5rem);
      -ms-transform:translate(0,-1.5rem);
      -o-transform:translate(0,-1.5rem);
    }
  }
  @keyframes a_dn_con
  {
    0%   {
      transform:translate(0,-1.5rem);
      -webkit-transform:translate(0,-1.5rem);
      -moz-transform:translate(0,-1.5rem);
      -ms-transform:translate(0,-1.5rem);
      -o-transform:translate(0,-1.5rem);
    }
    100%   {
      transform:translate(0,0);
      -webkit-transform:translate(0,0);
      -moz-transform:translate(0,0);
      -ms-transform:translate(0,0);
      -o-transform:translate(0,0);
    }
  }
</style>

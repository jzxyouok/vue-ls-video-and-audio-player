<template>
    <div id="app">
        <g-header :name="circleInfo.name" :logo="circleInfo.logo" :desc="circleInfo.desc"
                  :memberNum="circleInfo.memberNum"></g-header>
        <ul class="home_nav">
            <li v-for="(tab, index) in tabs" @click="choose(index)"><a href="javascript:;" :class="{'selected':index===selected}">{{tab.tabName}}</a></li>
            <li><a href="javascript:;" @click="utils.downloadApp()">更多精彩</a></li>
        </ul>
        <div class="nav_com">
            <live-list v-if="selected==0"></live-list>
            <members v-if="selected==1"></members>
        </div>
        <a href="javascript:;" class="join_circle">加入社群</a>
        <div class="sf_popups" v-bind:class="{hide:true}" v-if="addGroup == 0 || addGroup == 1">
            <div class="popups" v-if="addGroup == 0">
                <img src="./images/g_ioc_10.png">
                <p>加群失败！</p>
            </div>
            <div class="popups" v-if="addGroup == 1">
                <img src="./images/g_ioc_11.png">
                <p>加群成功！</p>
            </div>
        </div>
        <div class="join_popups" v-if="addGroup == -1">
            <p>加群方式获取失败，请稍后尝试</p>
            <a>我知道了</a>
        </div>
    </div>
</template>

<script>
    import 'common/css/reset.css';
    import 'common/js/reset.js';
    import utils from 'common/js/utils.js';
    import GHeader from 'components/GHeader/GHeader';
    import LiveList from 'components/LiveList/LiveList';
    import Members from 'components/Members/Members'

    export default {
        name: 'app',
        components: {
            GHeader, LiveList, Members
        },
        created(){

        },
        data () {
            return {
                lives: [],
                circleInfo: window.circleInfo,
                tabs:[
                    {tabName:'直播'},
                    {tabName:'群成员'}
                ],
                selected:0,
                utils:utils,
                addGroup:2//0:失败 1:成功 -1：异常
            }
        },
        methods: {
            choose(index) {
                this.selected = index;
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

    .nav_com{padding-top: 4.99rem;}

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

    .sf_popups{
        position: fixed;
        top:50%;
        left:50%;
        width: 2rem;
        height: 2rem;
        background: rgba(0,0,0,0.8);
        border-radius: 0.1rem;
        margin: -1rem;
    }
    .popups img{
        display: block;
        width: 0.77rem;
        height: 0.77rem;
        margin: 0.38rem auto 0;
    }
    .popups p{
        font-size: 0.32rem;
        color: #fff;
        line-height: 0.36rem;
        margin-top: 0.16rem;
        text-align: center;
    }
    .hide{
        animation:s_hide 3s forwards;
        -webkit-animation:s_hide 3s forwards;
        -moz-animation:s_hide 3s forwards;
        -ms-animation:s_hide 3s forwards;
        -o-animation:s_hide 3s forwards;
    }
    @keyframes s_hide
    {
        0%   {
            opacity: 1;
            display: block;
        }
        100%   {
            opacity: 0;
            display: none;
        }
    }
    .join_popups{
        position: fixed;
        top:50%;
        left:50%;
        height: 2.8rem;
        width: 5.4rem;
        margin: -1.4rem -2.7rem;
        background: #fff;
        border-radius: 0.26rem;
    }
    .join_popups p{
        font-size: 0.26rem;
        color: #000;
        text-align: center;
        padding: 0.3rem;
        line-height: 1.3rem;
    }
    .join_popups a{
        display: block;
        width: 100%;
        height: 0.89rem;
        line-height: 0.89rem;
        color:#007aff;
        text-align: center;
        font-size: 0.34rem;
        border-top:#dadade solid 1px;
        font-weight: bold;
    }
</style>

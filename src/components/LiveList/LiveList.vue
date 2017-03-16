<template>
    <div class="live_main">
        <div v-if="lives.length == 0" class="no_data">
            群主还在马不停蹄，准备直播内容中
        </div>
        <div class="live_list_con" v-else="">
            <p class="live_more"><a href="javascript:;" @click="utils.downloadApp()">查看全部直播</a></p>
            <ul class="live_list">
                <li v-for="list in lives">
                    <div class="lt_img">
                        <img v-bind:src="list.pic">
                        <p v-if="list.state == 1" class="red">直播</p>
                        <p v-if="list.state == 2" class="blue">预告</p>
                        <p v-if="list.state == 4" class="orgin">回放</p>
                        <p v-if="list.type == 1" class="video_ioc"></p>
                        <p v-if="list.type == 2" class="aideo_ioc"></p>
                    </div>
                    <div class="lt_text">
                        <p class="title">{{list.title}}</p>
                        <div class="lt_time">
                            <p>{{list.startTime}}</p>
                            <p v-if="list.num">{{list.num}}</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default ({
        name: 'liveList',
        data () {
            return {
                liveIds: [],
                lives: [],
                circleId: '112333',
                utils:this.$parent.utils
            }
        },
        created: function () {
            this.getLiveIds();
            this.getLiveList();
        },
        methods: {
            getLiveIds: function () {
                this.$http.get('/api/live/circle/liveIds', {'circleId': this.circleId, 'size': 15})
                    .then((response) => {
                        if(response.body.code == 0) {
                            this.liveIds = response.body.results;
                        }else{
                            console.log(response.message);
                        }
                    })
                    .catch(function (response) {
                        console.log(response);
                    })
            },
            getLiveList: function () {
                this.$http.get('/api/live/info', {'circleId': this.circleId, 'liveId': this.liveIds})
                    .then((response) => {
                        this.lives = response.body.results;
                    })
                    .catch(function (response) {
                        console.log(response)
                    })
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
        padding: 0.2rem 0 1rem;
    }

    .live_list li {
        display: -webkit-box;
        padding: 0.1rem 0.3rem;
    }

    .lt_img {
        width: 2.4rem;
        height: 1.5rem;
        position: relative;
        float: left;
    }

    .lt_img p:nth-child(2) {
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

    .lt_img p:nth-child(3) {
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
        width: 2.3rem;
        float: left;
        background: url("../../module/home/images/g_ioc_5.png") no-repeat left center;
        background-size: 0.28rem 0.28rem;
    }

    .lt_time p:nth-child(2) {
        float: right;
        background: url("../../module/home/images/g_ioc_6.png") no-repeat left center;
        background-size: 0.28rem 0.28rem;
    }
</style>

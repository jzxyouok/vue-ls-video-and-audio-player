<template>
  <div>
    <h4 class="noticeTimeTit">距离{{dealTargetTime}} 直播还有</h4>
    <ul class="noticeTimeNum a_center">
      <li>{{day}}</li>
      <li>天</li>
      <li>{{hour}}</li>
      <li>时</li>
      <li>{{minute}}</li>
      <li>分</li>
    </ul>
  </div>
</template>

<style>
  .noticeTimeTit {
    font: .28rem Microsoft YaHei;
    color: #a0a0a0;
    text-align: center;
  }

  .noticeTimeNum {
    margin-bottom: .18rem;
  }

  .noticeTimeNum li:nth-child(odd) {
    text-align: center;
    font-size: .56rem;
    font-weight: bold;
  }

  .noticeTimeNum li:nth-child(even) {
    font-size: .3rem;
    padding: .18rem 0.1rem 0;
  }

  .noticeTimeNum li:last-child {
    padding-right: 0;
  }
</style>

<script>
  import {dateFormat} from 'common/js/date/date-format.js';
  export default {
    name: 'countdown',
    props: {
      targetTime: {
        type: Number,
        default: 0
      },
      callBack: {
        type: Function,
        default: function () {
          this.day= 0;
          this.hour = 0;
          this.minute = 0;
          this.second = 0;
        }
      }
    },
    created(){
      dateFormat();
      this.doIt();
    },
    data () {
      return {
        day: 0,
        hour: 0,
        minute: 0,
        second: 0
      }
    },
    methods: {
      doIt() {
        var This = this;
        // 当前时间
        var nowTime = new Date().getTime();
        // 结束时间
        var endTime = this.targetTime;
        // 相差的时间
        var t = endTime - nowTime;
        if (t < 0) {//结束时需要执行的操作
          this.callBack();
          return false;
        }

        var d = Math.floor(t / 1000 / 60 / 60 / 24);
        var h = Math.floor(t / 1000 / 60 / 60 % 24);
        var i = Math.floor(t / 1000 / 60 % 60);
        var s = Math.floor(t / 1000 % 60);

        //d = d < 10 ? '0' + d : d;
        h = h < 10 ? '0' + h : h;
        i = i < 10 ? '0' + i : i;
        s = s < 10 ? '0' + s : s;

        this.day = d;
        this.hour = h;
        this.minute = i;
        this.second = s;
        setTimeout(function () {
          This.doIt();
        }, 1000);
      }
    },
    computed: {
      dealTargetTime(){
        return new Date(this.targetTime).format("yyyy年MM月dd日 hh：mm ")
      }
    }
  }
</script>

<template>
  <div id="group-chat-wrap">
    <div class="mainCont" v-if="noUser">
      <section class="gChatSub">
        <h3 class="gChatSubTit">点击加入社群就可以聊天哦~</h3>
        <button class="gChatSub_join">加入社群</button><!-- 加入群聊 -->
      </section>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'groupChat',
    data () {
      return {
        noUser:false,//用户没有登录控制加群按钮显示
        userId:userId || '',
      }
    },
    created(){
        if(userId == ''||userId==undefined){
          this.noUser = true;
        }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*状态*/
  .gChatSub{text-align: center;padding-top: 2.5rem;}
  .gChatSubTit{font-size:.28rem;color:#a0a0a0;text-align: center;margin-bottom: .55rem;}
  .gChatSub_join{font-size:.32rem; line-height: .8rem;min-width: 3rem; height: .8rem;width: 3.6rem; border-radius: .1rem;background: #ff4c4d;color: #fff;text-align: center;}
 
</style>

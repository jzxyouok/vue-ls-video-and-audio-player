<template>
  <div id="live-list-wrap">
    <h1>{{msg}}</h1>
  </div>
</template>

<script>
  export default {
    name: 'liveList',
    data () {
      return {
        msg: '直播列表',
        lives: []
      }
    },
    created(){
      this.$http.get('/api/live/circle/lives').then((response) => {
        var lives = response.body.results;
        this.lives = lives;
        console.log(lives);
      });
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
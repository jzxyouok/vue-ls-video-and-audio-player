<template>
 <video src="http://pili-live-hls.live.zm.gaiay.cn/gaiay-pro/58d1de1da3d5ec03e9001a24.m3u8"></video>
</template>

<script>
  export default {
    data() {
      return {
        videoOptions: {
          source: {
            type: "application/x-mpegURL",
//            src: "http://pili-live-hls.live.zm.gaiay.cn/gaiay-pro/58d1de1da3d5ec03e9001a24.m3u8",
            src: "https://logos-channel.scaleengine.net/logos-channel/live/biblescreen-ad-free/playlist.m3u8",
            withCredentials: false
          },
          poster: "",
          live: true,
          autoplay: false
        }
      }
    }
  }
</script>
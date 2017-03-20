var secondShare = {
  //检测分销商id
  checkFollowerId : function(shareUrl){
    if(shareUrl.indexOf('followerId=') == -1){
      if(shareUrl.indexOf('?') != -1){
        shareUrl += "&followerId="+window.circleInfo.followerId;
      }else{
        shareUrl += "?followerId="+window.circleInfo.followerId;
      }
    }else{
      var old = "followerId="+this._getQueryString('followerId');
      shareUrl = shareUrl.replace(old,'followerId='+window.circleInfo.followerId);
    }
    return shareUrl;
  },
  circle_share : function(){
    var shareContent = window.circleInfo.desc;
    if(shareContent == "" ){
      shareContent = "商业玩的就是社群，快速加入，扩展资源。";
    }else{
      shareContent = shareContent.replace(/&/g, "%26").replace(/=/g, "%3D");
    }
    // update 2016.1.22 wq
    // update sharerId
    var shareUrl = window.location.href;
    shareUrl = this.checkFollowerId(shareUrl);//检测分销商id
    if(typeof bangHelper != "undefined"){
      shareUrl = bangHelper.renewSharer(shareUrl, window.circleInfo.userId, "") ;
      shareUrl = this.removeWeixinAuth(shareUrl);
    }
    // end
    if(share){
      share.type = 2;
      share.shareId = window.circleInfo.circleId;
      //把logo赋值给分享图片地址
      var sharePic = window.circleInfo.logo;
      if(sharePic == undefined || sharePic == ""){
        sharePic = "http://"+window.location.host+"/images/share/shareCircle.png";
      }
      var weixinTitle = "邀请你加入掌门社群【" + window.circleInfo.name + "】,人脉资源立刻对接";
      //资讯分享到微信朋友圈初始化分享内容
      share.weixinTimeline(shareUrl, weixinTitle, sharePic);
      //资讯分享到微信好友、qq好友初始化分享内容
      share.weixinFirends(shareUrl, shareContent, weixinTitle, sharePic);
      var weiboShareTitle = "邀请你加入【" + window.circleInfo.name+"】,"+shareContent.substring(0,60) +",#shareUrl#；下载掌门，查看更多内容：";
      share.weibo(shareUrl, "", weiboShareTitle, sharePic);
      share.init();// 分享
    }
  },
  removeWeixinAuth: function(url){
    //oauthState是登录失败的参数，分享时需要去掉
    var pattern = new RegExp("(\\&|\\?)(currentUserId|token|headimgurl|nickname|isFirstAuth|loginGuid|oauthState)=\\w*","g");
    url = url.replace(pattern, "");
    if(url.indexOf("?") < 0){
      url = url.replace("&", "?");
    }
    return url;
  },
};
secondShare.circle_share();

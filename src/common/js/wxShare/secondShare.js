export var secondShare = {
  _getQueryString: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return "";
  },
//检测分销商id
  checkFollowerId: function (shareUrl, followerId) {
    //分享的url上没有推客id
    if (shareUrl.indexOf('followerId=') == -1) {
      if (shareUrl.indexOf('?') != -1) {
        shareUrl += "&followerId=" + followerId;
      } else {
        shareUrl += "?followerId=" + followerId;
      }
    } else {//url中有推客id
      var old = "followerId=" + this._getQueryString("followerId");
      shareUrl = shareUrl.replace(old, "followerId=" + followerId);
    }
    return shareUrl;
  },
  circle_share: function (desc, logo, name, followerId,liveFlag) {//liveFlag:如果传值 表示是直播的二次分享
    var shareContent = desc;
    if (shareContent == "") {
      shareContent = "商业玩的就是社群，快速加入，扩展资源。";
    } else {
      shareContent = shareContent.replace(/&/g, "%26").replace(/=/g, "%3D");
    }
    var shareUrl = window.location.href;
    //当登陆者用户是推客的时候才需要替换
    if (followerId != undefined && followerId != "") {
      shareUrl = this.checkFollowerId(shareUrl, followerId);//检测分销商id
    }
    
    if (window.wxHelper6) {
      //把logo赋值给分享图片地址
      wxHelper6.img = logo;
      wxHelper6.title = liveFlag?name:"邀请你加入掌门社群【"+name+"】,人脉资源立刻对接";
      wxHelper6.desc = shareContent;
      wxHelper6.link = shareUrl;
      wxHelper6.init();
    }
  }
};

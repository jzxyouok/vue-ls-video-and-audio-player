var jsApiListConfig = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo'];

if(!Share){
	var Share = function(){
		this.NEWS = "NEWS";
		this.CARD = "CARD";
		this.TOPIC = "TOPIC";
		this.QUANZI = "QUANZI";
		this.ACT = "ACT";
		this.SHANGJI = "SHANGJI";
		this.POWERCARD = "POWERCARD";
		this.CARDQR = "CARDQR";
		this.SPEAK = "speak";

		this.parserUrl = true;
		this.shareCount = true;

		this.SINA_WEIBO = 1;
		this.WEIXIN_FRIEND = 2;
		this.WEIXIN_TIMELINE = 3;
		this.TENCENT_WEIBO = 4;
		this.QQ = 5;
		this.QQZONE = 6;
		this.ZHANGXIN = 7;
		this.QUANLIAO = 8;

		this.SHORT_URL = "/api/zm/short-url";

		/*dylan 2014.12.22 添加分享数量api调用统计*/
		this.SHARE_COUNT_URL = "/api/zm/w/share-log";

		this.WEIXIN_CONFIG = "/api/zm/weixin/js-config";

		this.GET_SHARE_CHANNEL_LIST_URL = "/api/zm/share/channel-list";

		this.SHARE_QQZONE_URL = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?";

		this.SHARE_QQ_URL = "http://connect.qq.com/widget/shareqq/index.html?";

		this.JIATHIS_URL  = "http://www.jiathis.com/send/?webid=";

	};
	window.share = new Share();
}

//在分享成功了调用
Share.prototype.updateCount = function(bizId, type, channel, callback){
	// 能量卡分享成功后提示下载APP
	if(!share.shareCount) return;
	if(type == undefined || type == ""){
		return;
	}else{
		var data = "type="+type+"&bizId="+bizId+"&channel="+channel;
		zm.post(this.SHARE_COUNT_URL, data, callback);
	}
};

Share.prototype.shareToSinaWeibo = function(){
	share.channel = this.SINA_WEIBO;
	console.log(share.channel);
	this.shareToWeibo();
};

Share.prototype.shareToTencentWeibo = function(){
	share.channel = this.TENCENT_WEIBO;
	this.shareToWeibo();
};

Share.prototype.shareToWeibo = function() {
	var url = this.JIATHIS_URL;
	console.log(share.channel);
	if (share.channel == share.SINA_WEIBO) {
		url += "tsina";
	} else if (share.channel == share.TENCENT_WEIBO) {
		url += "tqq";
	}
	//更新分享统计
	//share.updateCount(share.shareId, share.type, share.channel, "");
	url += "&title="+share.weibo.shareTitle;
	url += "&pic="+share.weibo.sharePic;
//	url += "&summary="+share.weibo.shareContent;
	url += "&url="+share.weibo.shareUrl;

	zm.forward(url);
	share.updateCount(share.shareId, share.type, share.channel, "");
};

document.addEventListener("WeixinJSBridgeReady", function() {
	weixin_share_tip();
}, false);
/**
	微信分享提示
*/
function weixin_share_tip(){
	var div = document.createElement("div");
	var img = document.createElement("img");
	div.setAttribute("class", "yindaoPop");
	div.style.display = 'none';
	div.setAttribute("onclick", "document.getElementById('div_hint').style.display = 'none';");
	div.setAttribute("id", "div_hint");
	//判断，如果是app中打开的使用app自带的分享
	if (typeof(_platform) != "undefined" && m_app_platform() != "") {
		div.setAttribute("class", "yindaoPop");
		img.setAttribute("src", "/images/share/bigSharePic.png");
	}else{
		div.setAttribute("class", "yindaoPop2");
		img.setAttribute("src", "/images/share/weixintishi.png");
	}
	div.appendChild(img);
	$("body").append(div);
  document.getElementById("weixin_friend").onclick = function(){
    showHint();
  };
  document.getElementById("weixin_timeline").onclick = function(){
    showHint();
  };
};
function showHint() {
  document.getElementById("div_hint").style.display = 'block';
}

function onBridgeReady() {
  utils.ajax({
		type : "GET",
		url : share.WEIXIN_CONFIG,
		data : "url=" + encodeURIComponent(window.location.href),
		async : true,
		success : function(data) {
			var tData = data.result;
			wx.config({
				debug: false,
				appId: tData.appId,
				timestamp: tData.timestamp,
				nonceStr: tData.nonceStr,
				signature: tData.signature,
			 	jsApiList: jsApiListConfig
			});
	    }
	});
	wx.showOptionMenu();
	// 发送给好友
	WeixinJSBridge.on('menu:share:appmessage', function() {
		WeixinJSBridge.invoke('sendAppMessage', {
			"weixin_AppID" : "",
			"img_url" : share.weixinFirends.sharePic,
			"img_width" : "640",
			"img_height" : "640",
			"link" : share.weixinFirends.shareUrl,
			"desc" : share.weixinFirends.shareContent,
			"title" : share.weixinFirends.shareTitle
		}, function(res) {
			if (res.err_msg == "send_app_msg:ok" || res.err_msg == "send_app_msg:confirm") {
				share.updateCount(share.shareId, share.type, share.WEIXIN_FRIEND);
			}
		});
	});

	// 分享到朋友圈;
	WeixinJSBridge.on('menu:share:timeline', function() {
		WeixinJSBridge.invoke('shareTimeline', {
			"img_url" : share.weixinTimeline.sharePic,
			"img_width" : "640",
			"img_height" : "640",
			"link" : share.weixinTimeline.shareUrl,
			"desc" : "",
			"title" : share.weixinTimeline.shareTitle

		}, function(res) {
			if (res.err_msg == "share_timeline:ok" || res.err_msg == "share_timeline:confirm") {
				share.updateCount(share.shareId, share.type, share.WEIXIN_TIMELINE);
			};
		});
	});

	// 分享到微博;
	WeixinJSBridge.on('menu:share:weibo', function() {
		WeixinJSBridge.invoke('shareWeibo', {
			"img_url" : 		share.weibo.sharePic,
			"content" :		share.weibo.shareTitle+"-"+share.weibo.shareContent,
			"url" :			share.weibo.shareUrl
		}, function(res) {
			if (res.err_msg == "share_weibo:ok" || res.err_msg == "share_weibo:confirm") {
				share.updateCount(share.shareId, share.type, share.TENCENT_WEIBO);
			}
		});
	});

}

if (document.addEventListener) {
	document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
} else if (document.attachEvent) {
	document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
	document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
}


Share.prototype.shareToQQ = function(){
	var p = {
		url : 				encodeURIComponent(share.qqC.shareUrl),
		showcount : 	'0',/*是否显示分享总数,显示：'1'，不显示：'0' */
		desc : 			'',/*默认分享理由(可选)*/
		summary : 	encodeURIComponent(share.qqC.shareContent),/*分享摘要(可选)*/
		title : 			encodeURIComponent(share.qqC.shareTitle),/*分享标题(可选)*/
		site : 				'',/*分享来源 如：腾讯网(可选)*/
		pics : 			share.qqC.sharePic, /*分享图片的路径(可选)*/
		flash :	 		'',
		style :			'201',
		width :			39,
		height :			39
	};

	//分享成功的调用
	share.updateCount(share.shareId, share.type, share.QQ);

	var url = share.SHARE_QQ_URL+ zm.formatParam(p);
	zm.forward(url);
};

Share.prototype.shareToQQZone = function(shareId, type){
	var p = {
			url : 				encodeURIComponent(share.qqZoneC.shareUrl),
			showcount : 	'0',/*是否显示分享总数,显示：'1'，不显示：'0' */
			desc : 			'',/*默认分享理由(可选)*/
			summary : 	"",//share.qqZoneC.shareContent,/*分享摘要(可选)*/
			title : 			share.qqZoneC.shareTitle,/*分享标题(可选)*/
			site : 				'',/*分享来源 如：腾讯网(可选)*/
			pics : 			share.qqZoneC.sharePic, /*分享图片的路径(可选)*/
			style :			'201',
			width :			39,
			height :			39
		};
	//分享成功的调用
	share.updateCount(share.shareId, share.type, share.QQZONE);
	var url = share.SHARE_QQZONE_URL+ zm.formatParam(p);
	zm.forward(url);
};

Share.prototype.qqZoneC = function(shareUrl, shareContent, shareTitle, sharePic){

};

Share.prototype.qqC = function(shareUrl, shareContent, shareTitle, sharePic){

};


Share.prototype.weibo = function(shareUrl, shareContent, shareTitle, sharePic){
	shareUrl = this.parserShareUrl(shareUrl);
	utils.ajax({
		type : "get",
		url : share.SHORT_URL,
		data : "url=" + encodeURIComponent(shareUrl),
		async : true,
		success : function(data) {
			shareTitle = shareTitle.replace("#shareUrl#", data.url);
			shareUrl = "";

			share.qqZoneC.shareUrl = shareUrl;
			share.qqZoneC.shareContent = shareContent;
			share.qqZoneC.shareTitle = shareTitle+"http://t.cn/RyadQR6";
			share.qqZoneC.sharePic = sharePic;

			share.weibo.shareUrl = shareUrl;
			share.weibo.shareContent = shareContent;
			share.weibo.shareTitle = shareTitle+"http://t.cn/RyadQR6";
			share.weibo.sharePic = sharePic;
	    }
	});
};

Share.prototype.weixinFirends = function(shareUrl, shareContent, shareTitle, sharePic){

	share.weixinFirends.shareUrl = this.parserShareUrl(shareUrl);
	share.weixinFirends.shareContent = shareContent;
	share.weixinFirends.shareTitle = shareTitle == "" ? share.ShareTitle : shareTitle;
	share.weixinFirends.sharePic = sharePic;

	share.qqC.shareUrl = shareUrl;
	share.qqC.shareContent = shareContent;
	share.qqC.shareTitle = shareTitle == "" ? share.ShareTitle : shareTitle;
	share.qqC.sharePic = sharePic;
};

Share.prototype.parserShareUrl = function(shareUrl){
	shareUrl = shareUrl.replace("//zhangmen","/zhangmen");
	shareUrl = shareUrl.replace("//zm/","/zm/");
	if(share.parserUrl && shareUrl.indexOf("-Share.html") <= 0){
		shareUrl = shareUrl.replace(".html", "-Share.html");
	}
	return shareUrl;
};

Share.prototype.weixinTimeline = function(shareUrl, shareTitle, sharePic){

	share.weixinTimeline.shareUrl = this.parserShareUrl(shareUrl);
	share.weixinTimeline.shareTitle = shareTitle == "" ? share.ShareTitle : shareTitle;
	share.weixinTimeline.sharePic = sharePic;

};

Share.prototype.init = function(){
	var shareToSinaWeibo = document.getElementById("shareToSinaWeibo");
	if(shareToSinaWeibo){
    shareToSinaWeibo.onclick=function(){
      share.shareToSinaWeibo();
    };
  }
  var shareToTencentWeibo = document.getElementById("shareToTencentWeibo");
	if (shareToTencentWeibo){
    shareToTencentWeibo.onclick=function(){
      share.shareToQQ();
    };
  }
  var shareToQQZone = document.getElementById("shareToQQZone");
	if(shareToQQZone){
    shareToQQZone.onclick=function(){
      share.shareToQQZone();
    };
  }

  var shareToQQ = document.getElementById("shareToQQ");
  if(shareToQQ){
    shareToQQ.onclick=function(){
      share.shareToQQ();
    };
  }

  var weixin_friend = document.getElementById("weixin_friend");
  if(weixin_friend){
    weixin_friend.onclick=function(){
      weixin_share_tip();
    };
  }

  var weixin_timeline = document.getElementById("weixin_timeline");
  if(weixin_timeline){
    weixin_timeline.onclick=function(){
      weixin_share_tip();
    };
  }
};

function card_detail_share(uid, source, joinState){
	var fp = zm.get_from_page(arguments);
	if(joinState != undefined || joinState != ''){
		//如果是从社群过来的，参数传到名片分享页，三个参数是因为get_from_page有两个参数获取fromPage的判断
		window.location.href = '/zhangmen/card/info/detail-share-'+uid+"?"+"&source=" + source
		+ '&joinState=' + joinState;
	}else{
		window.location.href = "/zhangmen/card/info/detail-share-"+uid+"?fromPage="+ encodeURIComponent(fp);
	}

}

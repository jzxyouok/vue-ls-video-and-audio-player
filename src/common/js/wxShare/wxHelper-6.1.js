// 外部初始化对象
window.wxHelper6 ={
		// 分享标题
		title:"",
		// 分享描述（分享好友、QQ、微博可用）
		desc:"",
		// 分享链接
		link:"",
		// 分享图片地址
		img:"",
		// 获取js config信息接口地址，请求参数外部拼接
		// 参数xyCaId，当前活动id
		ajaxUrl:"/api/weixin/share?url=",//微信分享js获取

		// 是否进行初始化
		enable:true,

		// 设置分享朋友圈回调
		// function (res)
		// res : 用户点击- do 成功-ok 取消-cancel 失败-error
		callback_timelien:function(){},

		// 设置分享好友回调
		// function (res)
		// res : 用户点击- do  成功-ok 取消-cancel 失败-error
		callback_msg:function(){},

		// 设置分享微博回调
		// function (res)
		// res : 用户点击- do  成功-ok 取消-cancel 失败-error
		callback_weibo:function(){},

		// 设置分享qq回调
		// function (res)
		// res : 用户点击- do  成功-ok 取消-cancel 失败-error
		callback_qq:function(){},
};

//2. 分享接口
wxHelper6.init = function init() {
	if (!wxHelper6.enable)
		return;

  function callBack(htmlobj) {
    if (!htmlobj || htmlobj == "")
      return;

    var json = htmlobj.result;
    console.log(json.appId);
    wx.config({
      debug : false,
      appId : json.appId,
      timestamp : json.timestamp,
      nonceStr : json.nonceStr,
      signature : json.signature,
      jsApiList : [ "onMenuShareTimeline", "onMenuShareAppMessage",
        "onMenuShareQQ", "onMenuShareWeibo" ]
    });
  }

  utils.ajax({
	  type:"GET",
		url : wxHelper6.ajaxUrl+encodeURIComponent(window.location.href),
    success:callBack
	});



};

wx.ready(function() {
			wx.showOptionMenu();
			// 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
			wx.onMenuShareAppMessage({
						title : wxHelper6.title,
						desc : wxHelper6.desc,
						link : wxHelper6.link,
						imgUrl : wxHelper6.img,
						trigger : function(res) {
							wxHelper6.callback_msg("do");
						},
						success : function(res) {
							wxHelper6.callback_msg("ok");
						},
						cancel : function(res) {
							wxHelper6.callback_msg("cancel");
						},
						fail : function(res) {
							wxHelper6.callback_msg("error");
						}
					});

			// 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
			wx.onMenuShareTimeline({
						title : wxHelper6.title,
						link : wxHelper6.link,
						imgUrl : wxHelper6.img,
						trigger : function(res) {
							wxHelper6.callback_timelien("do");
						},
						success : function(res) {
							wxHelper6.callback_timelien("ok");
						},
						cancel : function(res) {
							wxHelper6.callback_timelien("cancel");
						},
						fail : function(res) {
							wxHelper6.callback_timelien("error");
						}
					});

			// 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
			wx.onMenuShareQQ({
						title : wxHelper6.title,
						desc : wxHelper6.desc,
						link : wxHelper6.link,
						imgUrl : wxHelper6.img,
						trigger : function(res) {
							wxHelper6.callback_qq("do");
						},
						complete : function(res) {
							wxHelper6.callback_qq("complete "+ res.info);
						},
						success : function(res) {
							wxHelper6.callback_qq("ok");
						},
						cancel : function(res) {
							wxHelper6.callback_qq("cancel");
						},
						fail : function(res) {
							wxHelper6.callback_qq("error");
						}
					});

			// 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
			wx.onMenuShareWeibo({
						title : wxHelper6.title,
						desc : wxHelper6.desc,
						link : wxHelper6.link,
						imgUrl : wxHelper6.img,
						trigger : function(res) {
							wxHelper6.callback_weibo("do");
						},
						complete : function(res) {
							wxHelper6.callback_weibo("complete " + res.info);
						},
						success : function(res) {
							wxHelper6.callback_weibo("ok");
						},
						cancel : function(res) {
							wxHelper6.callback_weibo("cancel");
						},
						fail : function(res) {
							wxHelper6.callback_weibo("error");
						}
					});
		});


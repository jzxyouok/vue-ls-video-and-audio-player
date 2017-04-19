// 封神榜类型
// 到达榜单类型
var ARRIVE_BANG = "0";
var BANG_SERVER;
if (window.location.hostname.indexOf("zm518.cn") != -1)
	BANG_SERVER ="http://bang.zm518.cn";
else if (window.location.hostname[0] == 't')
	BANG_SERVER ="http://t.bang.gaiay.cn";
else
	BANG_SERVER ="http://bang.gaiay.net.cn";

// 上报榜单数据
var bangData ={
		sharerId : "",	// 分享者id
		userId : "",		// 当前用户id
		circleId : "",	// 社群id
		srcUrl : "",		// 来源url
		bizId : "",		// 外部业务id
		bangType : ""	// 榜单类型
};

// 掌门封神榜封装
window.bangHelper = {
	// 是否自动构造上报数据
	isAutoSave : true,
	// 上传服务器域名
	bangServer : BANG_SERVER,
	// 更新分享地址中的分享者
	renewSharer : function(url, userId, circleId){
		var s = url.indexOf("sharerId=");
		var key = "";
		if ( s != -1){
			var e = url.indexOf("&", s);
			if (e != -1)
				key = url.substring(s+9, e);
			else
				key = url.substring(s+9);
		}
		if (key != "")
			url = url.replace("sharerId="+key, "sharerId="+userId);
		else{
			if (url.indexOf("?") != -1)
				url += "&sharerId=" + userId;
			else
				url += "?sharerId=" + userId;
		}

		if (url.indexOf("circleId=") ==-1 && circleId != "")
			url += "&circleId=" + circleId;
		return url;
	},

	// 自动构造榜单数据
	setGetDate : function (shareId, circleId){
		bangData.sharerId = shareId;
		bangData.circleId =  circleId;
		bangData.srcUrl = window.location.pathname;
	},

	aotuGetDate: function(){
		this.setGetDate(utils._getQueryString("sharerId"), utils._getQueryString("circleId"));
	},

	// 保存榜单信息
	saveBang : function (bangType, userId){
		if (this.isAutoSave)
			this.aotuGetDate();
		if (this.bangServer == "" || bangData.circleId =="")
			return;
		// 针对没有登录进入社群主页的场景，在客户端过滤掉，减轻服务器压力
		if (typeof(userId) == "undefined" ||
				typeof(bangData) == "undefined" ||
				typeof(bangData.sharerId) == "undefined")
			return;
		// end
		bangData.userId = userId;
		bangData.bangType = bangType;
    utils.ajax({
      type: 'GET',
      url: this.bangServer + "/api/statistic/element?bizType="+bangType+"&srcType="+bangData.srcUrl+"&parentId="+bangData.sharerId+"&currentId="+userId+"&circleId="+bangData.circleId,
      async: false,
      success: function (data) {
        console.log(data);
      },
      error:function(error){
        console.log(error);
      }
    });
	}
};

/**
 * 微信授权登陆组件
 * @author dx
 */
var oauth = function () {
  this.innerRedirectUrl = window.location.href;
  this.needLogin = 1;
  this.ctype = 0;
  this.ttype = 0;
  this.tid = "";
  this.options = {
    "wx_app_id": "wx1e3831e84f2d20aa",
    "wx_oauth_url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=",
    "wx_oauth_params": "&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect",
    "domain": window.location.protocol + "//zm.gaiay.net.cn",
    "redirect": window.location.protocol + "//zm.gaiay.net.cn/zhangmen/weixin/auth/index"
  };
  /**
   *  innerRedirectUrl：跳转的业务url，
   *  needLogin：是否需要登录
   *  ctype：来源类型 {@link ChannelType}
   *  ttype：目标业务 {@link TargetType}
   */
  this.init = function (innerRedirectUrl, needLogin, tid) {
//			this.initAppId();
    if (innerRedirectUrl) {
      this.innerRedirectUrl = innerRedirectUrl;
    }
    if (needLogin) {
      this.needLogin = needLogin;
    }
    if (tid) this.tid = tid;
  };
  this.initAppId = function () {
    var that = this;
    utils.ajax({
      type: 'GET',
      url: '/api/zm/weixin/web-oauth-config',
      data: {},
      async: false,
      success: function (data) {
        that.options["wx_app_id"] = data.result;
      }
    });
  };
  this.wxOauth = function () {
    this.saveWayCache("1");
    var url = this.wxOauthUrl();
    console.log(url);
    window.location.href = url;
  };
  this.wxOauthUrl = function () {

    var href_arr = new Array();
    href_arr.push(this.getOption("wx_oauth_url"));
    href_arr.push(this.getOption("wx_app_id"));
    href_arr.push("&redirect_uri=");
    var url = this.addParams(this.redirectParam(), this.getOption("redirect"));
    href_arr.push(encodeURIComponent(url));
    href_arr.push(this.getOption("wx_oauth_params"));
    return href_arr.join("");
  };
  this.redirectParam = function () {
    return [
      {name: "needLogin", value: this.needLogin},
      {name: "channelType", value: this.ctype},
      {name: "targetType", value: this.ttype},
      {name: "targetId", value: this.tid},
      {name: "innerRedirectUrl", value: this.innerRedirectUrl}
    ];
  };
  this.zmOauth = function () {
    if (this.ctype == 13) {
      //来自社群，获取社群id
      var circleId = this.getParams(decodeURIComponent(this.innerRedirectUrl), "circleId");
      //2016-2-18 将跳转路径login更新为/zhangmen/cards/create/commmunity修改问题为：分享出去的社群点击“加入社群。。。按钮”跳转到社群的注册页面
      window.location.href = this.getOption("domain") + "/zhangmen/cards/create/commmunity?circleId=" + circleId + "&source=BY_COMMUNITY&redirectUrl=" + this.innerRedirectUrl;
    } else {
      window.location.href = this.getOption("domain") + "/login?redirectUrl=" + this.innerRedirectUrl;
    }
  };

  this.auth = function () {
    var oauth_way = 0;
    if (navigator.userAgent.indexOf("MicroMessenger") > 0) {
      oauth_way = 1;
      this.wxOauth();
    } else {
      this.zmOauth();
    }
    this.options["oauth_way"] = oauth_way;
  };

  this.saveWayCache = function (val) {
    localStorage.loginWay = val;
  };

  this.clearWayCache = function () {
    localStorage.removeItem("loginWay");
  };

  this.addParams = function (params, url) {
    if (params) {
      for (var i in params) {
        url = this.addParam(params[i], url);
      }
    }
    return url;
  };
  this.addParam = function (param, url) {
    return url + ((url.indexOf("?") > -1 ) ? "&" : "?" ) + param.name + "=" + param.value;
  };
  /**
   * 获取微信授权的appId
   */
  this.getAppId = function () {
    return this.options["wx_app_id"];
  };

  this.handleCtype = function () {
    var oauth_way = this.getOption["oauth_way"];
    var ctype = this.ctype;
    if (ctype == 13 && oauth_way == 1) this.ctype = 19;
  };

  this.getOption = function (name) {
    return this.options[name];
  };

  //截取url参数
  this.getParams = function (url, name) {
    var reg = new RegExp("(^|&|\\?)" + name + "=([^&]*)(&|$)", "i");
    var r = url.match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return "";
  };
};
function getDomain() {
  var zmServer = '';
  var protocol = window.location.protocol + "//";
  if (document.domain.indexOf("ma") > 0) {
    if (document.domain == 'ma.gaiay.net.cn') {
      zmServer = protocol + 'zm.gaiay.net.cn';
    } else if (document.domain == 't.ma.gaiay.cn') {
      zmServer = protocol + 't.zm.gaiay.cn';
    } else if (document.domain == 'ma.zm518.cn') {
      zmServer = protocol + 'm.zm518.cn';
    } else {
      zmServer = protocol + 'm.zm518.cn';
    }
  } else {
    zmServer = protocol + document.domain;
  }
  return zmServer;
}

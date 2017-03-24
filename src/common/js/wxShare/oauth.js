/**
 * 微信授权登陆组件
 * @author dx
 */
window.oauth = function () {
  this.innerRedirectUrl = window.location.href;
  this.needLogin = 1;
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
   */
  this.init = function (innerRedirectUrl, needLogin) {
    if (innerRedirectUrl) {
      this.innerRedirectUrl = innerRedirectUrl;
    }
    if (needLogin) {
      this.needLogin = needLogin;
    }
  };
  this.wxOauth = function () {
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
      {name: "innerRedirectUrl", value: this.innerRedirectUrl}
    ];
  };
  this.zmOauth = function () {
    //统一到注册界面
    window.location.href = this.getOption("domain") + "/zhangmen/cards/create/commmunity?circleId=" + encodeURIComponent(window.circleInfo.id) + "&source=BY_COMMUNITY&redirectUrl=" + this.innerRedirectUrl;
  };
  this.auth = function () {
    if (navigator.userAgent.indexOf("MicroMessenger") > 0) {
      this.wxOauth();
    } else {
      this.zmOauth();
    }
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
  this.getOption = function (name) {
    return this.options[name];
  };
};

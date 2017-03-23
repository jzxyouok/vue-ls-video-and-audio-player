window.utils = {
  //下载掌门APP
  downloadApp: function (version) {
    version = (typeof version == "undefined" || version == "") ? "rc" : version;
    window.location.href = "http://m.zm518.cn/zhangmen/download/app-download?preview=" + version + "&version=" + version;
  },
  zmServerCfg: function () {
    var url = window.location.href;
    if (/^t\.\./.test(url)) {
      return 'http://t.zm.gaiay.cn';
    }
    if (/^zm\./.test(url)) {
      return 'http://zm.gaiay.net.cn';
    }
    if (/^m\./.test(url)) {
      return 'http://m.zm518.cn';
    }
  },
  /* 封装ajax函数
   * @param {string}opt.type http连接的方式，包括POST和GET两种方式
   * @param {string}opt.url 发送请求的url
   * @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
   * @param {object}opt.data 发送的参数，格式为对象类型
   * @param {function}opt.success ajax发送并接收成功调用的回调函数
   */
  ajax: function (opt) {
    opt = opt || {};
    opt.type = opt.type.toUpperCase() || 'POST';
    opt.url = opt.url || '';
    opt.async = (opt.async == false) || true;
    opt.data = opt.data || null;
    opt.success = opt.success || '';
    opt.error = opt.error || '';
    var xmlHttp = null;
    if (XMLHttpRequest) {
      xmlHttp = new XMLHttpRequest();
    }
    else {
      xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    var params = [];
    for (var key in opt.data) {
      params.push(key + '=' + opt.data[key]);
    }
    var postData = params.join('&');
    if (opt.type.toUpperCase() === 'POST') {
      xmlHttp.open(opt.type, opt.url, opt.async);
      xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
      xmlHttp.send(postData);
    }
    else if (opt.type.toUpperCase() === 'GET') {
      xmlHttp.open(opt.type, opt.url, opt.async);
      xmlHttp.send();
    }
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var data = JSON.parse(xmlHttp.responseText);

        if(typeof (opt.success) !== "function"){
          return data;
        }else{
          opt.success(data);
        }
      }
    };
    xmlHttp.error = function () {
      opt.error(xmlHttp.responseText);
    }
  },
  /**
   * @param name 要获取的参数名
   * @returns 返回参数值
   */
  _getQueryString: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return "";
  },
  warrantLogin: function (liveState, liveId) {
    //调用登录服务
    var oauth = new oauth();
    var loginState = false;
    var cType = 13;	//channleType 社群主页 13
    var ttype = 0;	//业务类型，1：直播，2：回放，默认为 0
    var bizId = window.circleInfo.circleId;	//业务id，默认社群Id，对应的直播或回放id
    var innerRedirectUrl = encodeURIComponent(window.location.href);
    //根据分享内容，给不同的业务类型和业务Id
    if (liveState) {
      ttype = 1;
    } else if (liveState) {
      ttype = 2;
    }

    if (userId) {
      loginState = true;
    }

    oauth.init(innerRedirectUrl, loginState, cType, ttype, liveId);
    oauth.auth();
  },
  getCookie: function (name) {
    var cookieName = encodeURIComponent(name) + '=';
    var cookieStart = document.cookie.indexOf(cookieName);
    var cookieValue = null;
    if (cookieStart > -1) {
      var cookieEnd = document.cookie.indexOf(';', cookieStart);
      if (cookieEnd == -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
    }
    return cookieValue;
  }
}
Date.prototype.Format = function(fmt)
{ //author: meizz
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}
// utils.zmServerCfg();
export default utils;

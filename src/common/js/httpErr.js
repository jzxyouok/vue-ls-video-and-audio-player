/**
 * Created by HQ.Wn on 2017/3/20.
 * http请求错误码 处理
 *
 *   --备份一下：vue-resource错误回调返回的信息
 *  console.log(err.status); //
 console.log(err.statusText); //
 */

const JSON = {
  "400": "Bad Request（错误请求）",
  "401": "Unauthorized（未授权）",
  "402": "Payment Required",
  "403": "Forbidden（已禁止）",
  "404": "Not Found（未找到）",
  "405": "Method Not Allowed（方法禁用）",
  "406": "Not Acceptable（不接受）",
  "407": "Proxy Authentication Required（需要代理授权）",
  "408": "Request Timeout（请求超时）",
  "409": "Conflict（冲突）",
  "410": "Gone（已删除）",
  "411": "Length Required（需要有效长度）",
  "412": "Precondition Failed（未满足前提条件）",
  "413": "Request Entity Too Large（请求实体过大）",
  "414": "Request-URI Too Long（请求的 URI 过长）",
  "415": "Unsupported Media Type（不支持的媒体类型）",
  "416": "Requested Range Not Satisfiable（请求范围不符合要求）",
  "500": "Internal Server Error（服务器内部错误）",
  "501": "Not Implemented（尚未实施）",
  "502": "Bad Gateway（错误网关）",
  "503": "Service Unavailable（服务不可用）",
  "504": "Gateway Timeout（网关超时）",
  "505": "HTTP Version Not Supported（HTTP 版本不受支持）"
};
export function getErrorText(codeKey) {
  return JSON[codeKey];
};

export function setErrorText(codeKey, codeText) {
  JSON[codeKey] = codeText;
};
//fn1 针对 502 和 504 处理的回调， 其它错误码 使用fn2回调
export function tryAgin(code, fn1, fn2) {
  if (code == '502' || code == '504') {
    if (fn1)fn1();
  } else {
    if (fn2) fn2();
  }
};
var utils = {
    //下载掌门APP
    downloadApp: function (version) {
        version = (typeof version == "undefined" || version == "") ? "rc" : version;
        window.location.href = this.zmServerCfg() + "/zhangmen/download/app-download?preview=" + version + "&version=" + version;
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
    }
}
// utils.zmServerCfg();
export default utils;
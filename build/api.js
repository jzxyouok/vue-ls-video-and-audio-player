var appData = require('../data.json');
var lives = appData.lives;
var liveIds = appData.liveIds;
var members = appData.members;
var roleInfo = appData.roleInfo;
var validJoin = appData.validJoin;
var doJoin = appData.doJoin;
var viewAuth = appData.viewAuth;
module.exports = {
  setApi: function (apiRoutes) {
    apiRoutes.get('/live/info', function (req, res) {
      res.json({
        code: 0,
        message: '成功',
        results: lives
      });
    });
    apiRoutes.get('/live/circle/liveIds', function (req, res) {
      res.json({
        code: 0,
        message: '成功',
        result: liveIds
      });
    });
    apiRoutes.get('/zm/circle/member-list', function (req, res) {
      res.json({
        code: 0,
        message: '成功',
        results: members
      });
    });
    
    apiRoutes.get('/circle/member/role', function (req, res) {
      res.json(roleInfo);
    });
    
    apiRoutes.get('/v2/circle/member/validation', function (req, res) {
      res.json(validJoin);
    });
    
    apiRoutes.put('/v2/w/circle/member', function (req, res) {
      res.json(doJoin);
    });
    
    apiRoutes.get('/live/view', function (req, res) {
      res.json(viewAuth);
    });
    
  }
};
var rc = require('../../data/rules-config.js');
Page({
  data: { rules: [], foundCount: 0, totalCount: 0 },
  onShow() {
    var app = getApp();
    var found = app.globalData.discoveredRules || [];
    var keys = Object.keys(rc);
    var list = [];
    for (var i = 0; i < keys.length; i++) {
      list.push({
        id: keys[i],
        text: rc[keys[i]],
        found: found.indexOf(rc[keys[i]]) !== -1
      });
    }
    this.setData({ rules: list, foundCount: found.length, totalCount: keys.length });
  },
});

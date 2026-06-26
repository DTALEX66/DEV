var rulesConfig = require('../../data/rules-config.js');

Page({
  data: {
    title: '', content: '', canRestart: false,
    restartTarget: '', stats: {},
    showRoute: false, route: [],
    rulesFound: [], rulesTotal: 0
  },
  onLoad(options) {
    var id = options.id;
    var app = getApp();
    var data = app.globalData.storyData;
    if (!data || !data.chapters || !data.chapters[id]) {
      wx.showToast({ title: '结局加载失败', icon: 'none' });
      return;
    }
    var ch = data.chapters[id];
    var restartTarget = '';
    if (ch.choices && ch.choices.length > 0) {
      restartTarget = ch.choices[0].next || '';
    }
    // 统计数据
    var path = app.globalData.storyPath || [];
    var rulesFound = app.globalData.discoveredRules || [];
    var ruleKeys = Object.keys(rulesConfig);
    var routeTitles = [];
    for (var i = 0; i < path.length; i++) {
      var chData = data.chapters[path[i]];
      routeTitles.push(chData ? chData.title : path[i]);
    }
    this.setData({
      title: ch.title,
      content: ch.content,
      canRestart: !!restartTarget,
      restartTarget: restartTarget,
      stats: {
        chapters: path.length,
        rulesFound: rulesFound.length,
        rulesTotal: ruleKeys.length
      },
      route: routeTitles,
      rulesFound: rulesFound,
      rulesTotal: ruleKeys.length
    });
  },
  onToggleRoute() {
    this.setData({ showRoute: !this.data.showRoute });
  },
  onRestart() {
    // 重置路径和规则
    var app = getApp();
    app.globalData.storyPath = [];
    app.globalData.discoveredRules = [];
    wx.removeStorageSync('story_save');
    var target = this.data.restartTarget || 'chapter_1';
    wx.redirectTo({ url: '/pages/chapter/chapter?id=' + target });
  },
});

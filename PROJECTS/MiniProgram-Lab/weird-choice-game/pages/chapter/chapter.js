var rulesConfig = require('../../data/rules-config.js');

Page({
  data: {
    title: '', content: '', choices: [],
    chapterId: '', animating: false
  },
  onLoad(options) {
    var id = options.id || 'chapter_1';
    var app = getApp();
    // 存档恢复提示
    var saved = wx.getStorageSync('story_save');
    if (id === 'chapter_1' && saved && saved.chapterId !== 'chapter_1') {
      wx.showModal({
        title: '发现存档',
        content: '是否从上次进度继续？',
        success: function(res) {
          if (res.confirm) {
            wx.redirectTo({ url: '/pages/chapter/chapter?id=' + saved.chapterId });
          } else {
            wx.removeStorageSync('story_save');
          }
        }
      });
    }
    this.goTo(id);
  },
  goTo(id) {
    var self = this;
    var app = getApp();
    var data = app.globalData.storyData;
    if (!data || !data.chapters) {
      wx.showToast({ title: '剧情数据未加载', icon: 'none' });
      return;
    }
    var ch = data.chapters[id];
    if (!ch) {
      wx.showToast({ title: '章节不存在', icon: 'none' });
      return;
    }
    // 记录路径（去重）
    var path = app.globalData.storyPath || [];
    if (path.indexOf(id) === -1) path.push(id);
    app.globalData.storyPath = path;
    // 发现规则
    var rule = rulesConfig[id];
    if (rule) {
      var rules = app.globalData.discoveredRules || [];
      if (rules.indexOf(rule) === -1) {
        rules.push(rule);
        app.globalData.discoveredRules = rules;
      }
    }
    var isEnding = !ch.choices || ch.choices.length === 0;
    if (isEnding) {
      wx.removeStorageSync('story_save');
      wx.redirectTo({ url: '/pages/ending/ending?id=' + id });
      return;
    }
    wx.setNavigationBarTitle({ title: ch.title });
    wx.setStorageSync('story_save', {
      chapterId: id, title: ch.title, time: Date.now()
    });
    self.setData({ animating: false });
    setTimeout(function() {
      self.setData({
        title: ch.title, content: ch.content,
        choices: ch.choices, chapterId: id,
        animating: true
      });
      if (wx.pageScrollTo) wx.pageScrollTo({ scrollTop: 0, duration: 100 });
    }, 50);
  },
  onChoice(e) {
    // B3: 振动反馈
    if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
    var next = e.currentTarget.dataset.next;
    if (!next) return;
    this.goTo(next);
  },
  onRules() {
    // 菜单：查看已发现规则
    var app = getApp();
    var rules = app.globalData.discoveredRules || [];
    if (rules.length === 0) {
      wx.showToast({ title: '尚未发现任何规则', icon: 'none' });
      return;
    }
    var content = rules.join('\n\n');
    wx.showModal({
      title: '📜 已发现规则 (' + rules.length + '/' + 5 + ')',
      content: content,
      showCancel: false
    });
  },
});

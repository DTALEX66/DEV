Page({
  data: {
    title: '规则怪谈',
    subtitle: '互动叙事体验'
  },
  onStart() {
    wx.redirectTo({ url: '/pages/chapter/chapter?id=chapter_1' });
  },
});

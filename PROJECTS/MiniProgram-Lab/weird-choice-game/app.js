var storyData = require('./data/story.js');
App({
  globalData: {
    storyData: storyData,
    discoveredRules: [],   // 已发现的规则
    storyPath: []          // 走过的路径
  },
    playBgm: null, // 背景音实例

  onLaunch() {
    console.log('规则怪谈 · 启动 v' + storyData.version);
  }
});

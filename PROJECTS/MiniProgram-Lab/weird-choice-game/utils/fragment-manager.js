// 碎片管理器 v1.0 - ES5兼容版
var FRAGMENTS = {
  fa: { id: 'fa', text: '档案记录：实验体#7已循环17次——从未通过最终测试。' },
  fm: { id: 'fm', text: '镜面报告：镜像体与本体差异0.03‰——除非本体才是复制品。' },
  fe: { id: 'fe', text: '电梯异常：第3周期在非楼层停靠——坐标与第8号监护室重合。' },
  fv: { id: 'fv', text: '通风管刻字：「规则不是用来遵守的——是用来找裂缝的。」字迹与#7一致。' },
  ft: { id: 'ft', text: '冗余日志：#7决策模式偏离基线17.3%。偏离方向：利他。' }
};

function collect(id) {
  if (!id || !FRAGMENTS[id]) return false;
  var app = getApp();
  var playerState = app.globalData.playerState || { sanity: 100, trust: 50, flags: {} };
  if (!playerState.flags) playerState.flags = {};
  playerState.flags[id] = true;
  app.globalData.playerState = playerState;
  return true;
}

function getCollected() {
  var flags = (getApp().globalData.playerState || {}).flags || {};
  var result = [];
  for (var key in FRAGMENTS) {
    if (flags[key]) result.push(FRAGMENTS[key]);
  }
  return result;
}

function getCount() {
  return getCollected().length;
}

module.exports = {
  collect: collect,
  getCollected: getCollected,
  getCount: getCount,
  isComplete: function() { return getCount() >= 5; },
  getTotal: function() { return 5; },
  FRAGMENTS: FRAGMENTS
};
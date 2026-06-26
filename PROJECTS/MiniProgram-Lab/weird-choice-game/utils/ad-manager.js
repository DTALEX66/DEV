// 广告管理器 v1.0 - ES5兼容版
var rewardedAd = null;
var isInited = false;
var devMode = true; // 开发模式默认跳过广告
var pendingCallbacks = {};
var adUnitIds = {
  rewarded_video: 'xxxxx' // 替换为真实广告单元ID
};

function init() {
  if (isInited) return;
  isInited = true;
  var app = getApp();
  if (app && app.globalData && app.globalData.__dev__) {
    devMode = true;
    return;
  }
  try {
    rewardedAd = wx.createRewardedVideoAd({ adUnitId: adUnitIds.rewarded_video });
    rewardedAd.onLoad(function() {});
    rewardedAd.onError(function(err) { devMode = true; });
    rewardedAd.onClose(function(res) {
      var key = pendingCallbacks.key || '';
      if (res && res.isEnded) {
        if (pendingCallbacks.onReward) pendingCallbacks.onReward(key);
      } else {
        if (pendingCallbacks.onSkip) pendingCallbacks.onSkip(key);
      }
      pendingCallbacks = {};
    });
  } catch(e) {
    devMode = true;
  }
}

function showRewarded(key, onReward, onSkip) {
  if (!isInited) init();
  if (devMode) {
    if (onReward) onReward(key);
    return;
  }
  pendingCallbacks = {
    key: key,
    onReward: onReward || function() {},
    onSkip: onSkip || function() {}
  };
  try {
    rewardedAd.show()['catch'](function() {
      rewardedAd.load().then(function() { rewardedAd.show(); })['catch'](function() {
        devMode = true;
        if (onReward) onReward(key);
      });
    });
  } catch(e) {
    devMode = true;
    if (onReward) onReward(key);
  }
}

module.exports = {
  init: init,
  showRewarded: showRewarded,
  isReady: function() { return true; },
  isDevMode: function() { return devMode; },
  setAdUnitId: function(id) { adUnitIds.rewarded_video = id; }
};
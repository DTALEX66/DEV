// 氛围管理器 v1.0 - 声光电控制中心
// 用法: var atm=require('../../utils/atmosphere-manager.js'); atm.init(pageThis);

var _page = null;
var _currentState = 'normal';
var _fxTimer = null;

// 氛围状态定义
var STATES = {
  normal: {
    overlay: 'rgba(0,0,0,0)',
    ambientVol: 0.15,
    className: 'atmo-normal'
  },
  anomaly: {
    overlay: 'rgba(0,40,80,0.12)',
    ambientVol: 0.25,
    className: 'atmo-anomaly'
  },
  danger: {
    overlay: 'rgba(80,0,0,0.18)',
    ambientVol: 0.2,
    className: 'atmo-danger'
  }
};

// 章节→氛围映射
var CHAPTER_MOOD = {
  'chapter_1': 'anomaly',    // 醒来，未知
  'chapter_2a': 'anomaly',   // 敲门，寂静
  'chapter_2b': 'danger',    // 窥视，违反规则
  'chapter_3': 'anomaly',    // 走廊，选择
  'chapter_4_left': 'anomaly',  // 镜室，冷色
  'chapter_4_right': 'anomaly', // 档案室，冷色
  'chapter_5': 'danger',     // 逼近，紧张
  'chapter_6': 'danger',     // 楼梯，压迫
  'chapter_7': 'danger',     // 揭露前夜
  'chapter_8': 'danger',     // 揭露
  'ending_bad': 'danger',
  'ending_secret': 'anomaly',
  'ending_false_1': 'danger',
  'ending_false_2': 'danger',
  'ending_false_3': 'danger'
};

// 初始化：绑定页面引用
function init(page) {
  _page = page;
  _currentState = 'normal';
  setState('normal');
}

// 设置整体氛围状态
function setState(state) {
  if (!_page || !STATES[state]) return;
  _currentState = state;
  var s = STATES[state];
  _page.setData({
    atmoState: state,
    atmoClass: s.className,
    atmoOverlay: s.overlay
  });
}

// 根据章节设置氛围
function setChapterMood(chapterId) {
  if (!_page) return;
  var mood = CHAPTER_MOOD[chapterId] || 'anomaly';
  setState(mood);
  
  // 特殊章节额外效果
  var fx = null;
  if (chapterId === 'chapter_2b' || chapterId === 'ending_bad') fx = 'flicker';
  if (chapterId === 'chapter_4_left') fx = 'blur';
  if (chapterId === 'chapter_6') fx = 'shake';
  if (chapterId === 'chapter_8') fx = 'flicker';
  if (fx) triggerEffect(fx);
}

// 根据理智值更新氛围（用于实时反馈）
function updateBySanity(sanity) {
  if (!_page) return;
  if (sanity >= 60) setState('normal');
  else if (sanity >= 30) setState('anomaly');
  else setState('danger');
}

// 触发一次性视觉特效
function triggerEffect(effect) {
  if (!_page) return;
  if (_fxTimer) { clearTimeout(_fxTimer); _fxTimer = null; }
  
  switch(effect) {
    case 'flicker':
      _page.setData({ fxFlicker: true });
      _fxTimer = setTimeout(function() {
        if (_page) _page.setData({ fxFlicker: false });
      }, 300);
      break;
    case 'shake':
      _page.setData({ fxShake: true });
      _fxTimer = setTimeout(function() {
        if (_page) _page.setData({ fxShake: false });
      }, 500);
      break;
    case 'blur':
      _page.setData({ fxBlur: true });
      _fxTimer = setTimeout(function() {
        if (_page) _page.setData({ fxBlur: false });
      }, 800);
      break;
    case 'heartbeat':
      _page.setData({ fxHeartbeat: true });
      _fxTimer = setTimeout(function() {
        if (_page) _page.setData({ fxHeartbeat: false });
      }, 1200);
      break;
  }
}

// 规则发现时触发
function onRuleFound() {
  triggerEffect('flicker');
  setState('anomaly');
}

// 选择后氛围反馈
function onChoice(effects) {
  if (!effects || !_page) return;
  if (effects.sanity && effects.sanity < -10) triggerEffect('flicker');
  if (effects.flag === 'broke_mirror' || effects.flag === 'peeked') triggerEffect('shake');
}

module.exports = {
  init: init,
  setState: setState,
  setChapterMood: setChapterMood,
  updateBySanity: updateBySanity,
  triggerEffect: triggerEffect,
  onRuleFound: onRuleFound,
  onChoice: onChoice
};

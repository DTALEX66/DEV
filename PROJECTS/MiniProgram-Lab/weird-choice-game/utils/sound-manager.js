// 音效管理器 v2.0 - 全场景配音
var _inited = false;
var _sounds = {};
function init() {
  if (_inited) return; _inited = true;
  var list = ['click','chapter','ending','rule','ambient','footsteps','knock','heartbeat','morning','static','glass','whisper','doorcreak','machine','piano_dark','breathe_gasp','breathe_panic','breathe_relief','breathe_shaky','breathe_fade'];
  for (var i = 0; i < list.length; i++) {
    var id = list[i];
    try {
      _sounds[id] = wx.createInnerAudioContext();
      _sounds[id].src = 'assets/sounds/' + id + '.wav';
      _sounds[id].autoplay = false;
      if (id === 'ambient') { _sounds[id].loop = true; _sounds[id].volume = 0.15; }
      if (id === 'click') { _sounds[id].volume = 0.4; }
      if (id === 'chapter') { _sounds[id].volume = 0.3; }
      if (id === 'ending') { _sounds[id].volume = 0.35; }
      if (id === 'rule') { _sounds[id].volume = 0.35; }
      if (id === 'footsteps') { _sounds[id].volume = 0.2; }
      if (id === 'knock') { _sounds[id].volume = 0.3; }
      if (id === 'heartbeat') { _sounds[id].volume = 0.25; }
      if (id === 'morning') { _sounds[id].volume = 0.2; }
      if (id === 'static') { _sounds[id].volume = 0.2; }
      if (id === 'glass') { _sounds[id].volume = 0.2; }
      if (id === 'whisper') { _sounds[id].volume = 0.15; }
      if (id === 'doorcreak') { _sounds[id].volume = 0.2; }
      if (id === 'machine') { _sounds[id].volume = 0.2; }
      if (id === 'piano_dark') { _sounds[id].volume = 0.35; }
      if (id === 'breathe_gasp') { _sounds[id].volume = 0.5; }
      if (id === 'breathe_panic') { _sounds[id].volume = 0.4; }
      if (id === 'breathe_relief') { _sounds[id].volume = 0.35; }
      if (id === 'breathe_shaky') { _sounds[id].volume = 0.35; }
      if (id === 'breathe_fade') { _sounds[id].volume = 0.4; }
    } catch(e) {}
  }
}
function play(name) {
  if (!_inited) init();
  if (_sounds[name]) { try { _sounds[name].stop(); _sounds[name].play(); } catch(e) {} }
}
function playChapterSound(chapterId) {
  if (!_inited) init();
  var map = {
    'chapter_1': 'breathe_gasp',
    'chapter_2a': 'breathe_shaky',
    'chapter_2b': 'breathe_panic',
    'chapter_3': 'breathe_relief',
    'chapter_4_left': 'breathe_shaky',
    'chapter_4_right': 'breathe_shaky',
    'chapter_5': 'breathe_panic',
    'chapter_6': 'breathe_gasp',
    'chapter_7': 'breathe_shaky',
    'chapter_8': 'breathe_fade'
  };
  var sound = map[chapterId];
  if (sound && _sounds[sound]) { try { _sounds[sound].stop(); _sounds[sound].play(); } catch(e) {} }
}
function playChapterBreath(chapterId) {
  if (!_inited) init();
  var map = {
    'chapter_1': 'breathe_gasp',
    'chapter_2a': 'breathe_shaky',
    'chapter_2b': 'breathe_panic',
    'chapter_3': 'breathe_relief',
    'chapter_4_left': 'breathe_shaky',
    'chapter_4_right': 'breathe_shaky',
    'chapter_5': 'breathe_panic',
    'chapter_6': 'breathe_gasp',
    'chapter_7': 'breathe_shaky',
    'chapter_8': 'breathe_fade'
  };
  var sound = map[chapterId];
  if (sound && _sounds[sound]) { try { _sounds[sound].stop(); _sounds[sound].play(); } catch(e) {} }
}
function playEndingSound(endingId) {
  if (!_inited) init();
  if (endingId === 'ending_bad' || endingId === 'ending_false_1' || endingId === 'ending_false_2' || endingId === 'ending_false_3') { if (_sounds['piano_dark']) { try { _sounds['piano_dark'].play(); } catch(e) {} } if (_sounds['breathe_fade']) { try { _sounds['breathe_fade'].play(); } catch(e) {} } }
  else if (endingId === 'ending_secret') { if (_sounds['machine']) { try { _sounds['machine'].play(); } catch(e) {} } }
  else if (endingId === 'ending_good') { if (_sounds['breathe_relief']) { try { _sounds['breathe_relief'].play(); } catch(e) {} } }
} catch(e) {} } if (_sounds['breathe_fade']) { try { _sounds['breathe_fade'].play(); } catch(e) {} } }
  else if (endingId === 'ending_secret') { if (_sounds['machine']) { try { _sounds['machine'].play(); } catch(e) {} } } else if (endingId === 'ending_good') { if (_sounds['breathe_relief']) { try { _sounds['breathe_relief'].play(); } catch(e) {} } }
}
function startAmbient() {
  if (!_inited) init();
  if (_sounds['ambient']) { try { _sounds['ambient'].play(); } catch(e) {} }
}
function stop(name) { if (_sounds[name]) { try { _sounds[name].stop(); } catch(e) {} } }
function stopAll() { for (var k in _sounds) { try { _sounds[k].stop(); } catch(e) {} } }
module.exports = { init: init, play: play, playChapterSound: playChapterSound, playChapterBreath: playChapterBreath, playEndingSound: playEndingSound, startAmbient: startAmbient, stop: stop, stopAll: stopAll };

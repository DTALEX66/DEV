/**
 * 故事引擎 - 从 story.json 加载剧情
 * 可用于小程序和 SANDBOX 测试
 */

function loadStory() {
  try {
    var raw = require('../data/story.json');
    return validateStory(raw);
  } catch(e) {
    console.error('故事加载失败:', e);
    return null;
  }
}

function validateStory(data) {
  if (!data || !data.chapters || !data.start) {
    throw new Error('无效的 story.json 格式');
  }
  if (!data.chapters[data.start]) {
    throw new Error('起始章节 "' + data.start + '" 不存在');
  }
  // 检查每个选项的跳转目标是否存在
  var keys = Object.keys(data.chapters);
  for (var i = 0; i < keys.length; i++) {
    var ch = data.chapters[keys[i]];
    if (ch.choices) {
      for (var j = 0; j < ch.choices.length; j++) {
        var c = ch.choices[j];
        if (c.next && !data.chapters[c.next] && c.next !== '__exit__') {
          console.warn('警告：章节 "' + keys[i] + '" 的选项指向不存在的章节 "' + c.next + '"');
        }
      }
    }
  }
  return data;
}

module.exports = { loadStory, validateStory };

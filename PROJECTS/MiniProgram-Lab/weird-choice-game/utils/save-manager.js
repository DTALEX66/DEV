// 存档管理器 - 支持 3 个存档位
var MAX_SLOTS = 3;
function getSlots() {
  var slots = [];
  for (var i = 0; i < MAX_SLOTS; i++) {
    var key = 'story_save_' + i;
    var data = wx.getStorageSync(key);
    slots.push(data || null);
  }
  return slots;
}
function save(slot, chapterId, title) {
  wx.setStorageSync('story_save_' + slot, {
    chapterId: chapterId, title: title,
    time: Date.now(), slot: slot
  });
}
function load(slot) {
  return wx.getStorageSync('story_save_' + slot) || null;
}
function remove(slot) {
  wx.removeStorageSync('story_save_' + slot);
}
module.exports = { MAX_SLOTS: MAX_SLOTS, getSlots: getSlots, save: save, load: load, remove: remove };

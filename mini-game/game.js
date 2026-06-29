console.log('[GAME] 异常电梯控制台启动');
try {
  var main = require('./js/main.js'); main.start();
} catch(e) {
  console.error('[GAME] Error:', e.message);
}
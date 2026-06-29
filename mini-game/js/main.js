var R=require("./renderer.js"); var S=require("./state.js"); var E=require("./story-engine.js");
var cv=null; var lastInputAt=0; var lastInputKey="";

function start() {
  try {
    cv=wx.createCanvas(); R.init(cv);
    var sd=require("../data/story.js"); E.loadStory(sd);
    S.addLog("控制系统启动"); S.addLog("当前楼层:1F 状态:正常");
    bindInput("onPointerDown");
    bindInput("onPointerUp");
    bindInput("onMouseDown");
    bindInput("onMouseUp");
    bindInput("onTouchStart");
    bindInput("onTouchEnd");
    if(typeof wx.onKeyDown==="function"){
      wx.onKeyDown(onKey);
      console.log("[INPUT] key");
    }
    loop();
  } catch(e) { console.error("[MAIN]",e.message,e.stack); }
}

function bindInput(name) {
  if(typeof wx[name]==="function"){
    wx[name](onInput);
    console.log("[INPUT] bind",name);
  }
}

function onInput(e) {
  if(!e) return;
  var x,y;
  if(e.touches&&e.touches[0]){ x=e.touches[0].x; y=e.touches[0].y; }
  else if(e.changedTouches&&e.changedTouches[0]){ x=e.changedTouches[0].x; y=e.changedTouches[0].y; }
  else if(e.x!==undefined){ x=e.x; y=e.y; }
  else if(e.clientX!==undefined){ x=e.clientX; y=e.clientY; }
  else { console.log("[INPUT] unknown event",JSON.stringify(e)); return; }

  var now=Date.now();
  var key=Math.round(x)+","+Math.round(y);
  if(key===lastInputKey&&now-lastInputAt<180) return;
  lastInputKey=key; lastInputAt=now;

  console.log("[INPUT] tap at",x,y,"phase:",S.state.gamePhase);
  S.addLog("[点击] "+Math.round(x)+","+Math.round(y));
  if(S.state.gamePhase==="ending") { eTap(x,y); return; }
  if(S.state.gamePhase==="event") { cTap(x,y); }
  else { bTap(x,y); }
}

function onKey(e) {
  var code=e&&e.keyCode;
  var key=e&&e.key;
  if(code===49||key==="1") hAct("open");
  else if(code===50||key==="2") hAct("close");
  else if(code===51||key==="3") hAct("stop");
  else if(code===52||key==="4") hAct("call");
  else if(code===53||key==="5") hAct("ignore");
  else if(code===32||key===" ") hAct("call");
}

function loop() {
  try {
    var evt=null;
    if(S.state.gamePhase==="event") {
      var sd=require("../data/story.js");
      if(sd.events&&sd.events[S.state.currentEventId]) evt=sd.events[S.state.currentEventId];
    }
    R.render(S.state,evt);
    if(typeof cv.requestAnimationFrame==="function") cv.requestAnimationFrame(loop);
    else setTimeout(loop,33);
  } catch(e) { console.error("[LOOP]",e.message); setTimeout(loop,100); }
}

function cTap(x,y) {
  var sd=require("../data/story.js");
  var evt=sd.events&&sd.events[S.state.currentEventId];
  if(!evt||!evt.choices) return;
  // 事件选项区域: 从事件覆盖层底部往上数
  var ey=214,lh=cv.height-ey-110-4;
  var cy=ey+lh-28-evt.choices.length*24;
  for(var i=0;i<evt.choices.length;i++){
    if(y>=cy+i*24-14&&y<=cy+i*24+12){ E.handleChoice(i); console.log("[INPUT] choice",i); return; }
  }
  // 点击空白区域关闭事件
  S.state.gamePhase="playing"; S.state.eventLock=false;
}

function bTap(x,y) {
  var by=cv.height-88-28+34, bw=(cv.width-52)/5, bx=24;
  var ids=["open","close","stop","call","ignore"];
  for(var i=0;i<ids.length;i++){
    var rx=bx+i*(bw+2);
    if(x>=rx&&x<=rx+bw-2&&y>=by&&y<=by+48){
      hAct(ids[i]); console.log("[INPUT] btn",ids[i]); return;
    }
  }
  if(y>=52&&y<=202) S.addLog("[操作]切换监控视角");
}

function hAct(id) {
  if(S.state.eventLock&&id!=="ignore"){S.addLog("[系统]请先处理事件");return;}
  switch(id){
    case"open":S.state.doorsOpen=true;S.addLog("[操作]开门");break;
    case"close":S.state.doorsOpen=false;S.addLog("[操作]关门");break;
    case"stop":S.state.emergencyStop=!S.state.emergencyStop;S.addLog(S.state.emergencyStop?"[操作]⚠紧急停止":"[操作]解除停止");break;
    case"call":S.state.floor=S.state.floor>=12?1:S.state.floor+1;S.addLog("[操作]呼叫→"+S.state.floor+"F");chFe(S.state.floor);break;
    case"ignore":if(S.state.eventLock){S.state.gamePhase="playing";S.state.eventLock=false;S.addAnomaly(5,"忽视");}S.addLog("[操作]忽略");break;
  }
}

function chFe(f) {
  var sd=require("../data/story.js");
  if(sd.floorEvents&&sd.floorEvents[f]&&!S.hasFlag("v_"+f)){S.setFlag("v_"+f);E.triggerEvent(sd.floorEvents[f]);}
}

function eTap(x,y) {
  var ch=cv.height,cw=cv.width;
  if(x>=40&&x<=cw-40){
    if(y>=ch-140&&y<=ch-92){S.addLog("[广告占位]复活");S.reset();E.triggerEvent("start");return;}
    if(y>=ch-80&&y<=ch-32){S.reset();E.triggerEvent("start");return;}
  }
}

module.exports={start};

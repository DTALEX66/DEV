var SM=require("./state.js"); var sd=null;
function loadStory(d){sd=d;SM.addLog("故事引擎就绪");}
function triggerEvent(id) {
  if(!sd||!sd.events||!sd.events[id]) return false;
  var evt=sd.events[id]; SM.state.currentEventId=id; SM.state.gamePhase="event"; SM.state.eventLock=true; SM.state.eventCount++;
  if(evt.alertCode) SM.state.alertCode=evt.alertCode;
  if(evt.effects) {
    if(evt.effects.anomaly) SM.addAnomaly(evt.effects.anomaly,evt.effects.log||evt.title);
    if(evt.effects.floor!==undefined) SM.state.floor=evt.effects.floor;
    if(evt.effects.doors!==undefined) SM.state.doorsOpen=evt.effects.doors;
    if(evt.effects.flag) SM.setFlag(evt.effects.flag);
    if(evt.effects.log) SM.addLog(evt.effects.log);
  }
  SM.addLog("[事件"+SM.state.eventCount+"]"+evt.title); return true;
}
function handleChoice(i) {
  if(!sd||!SM.state.currentEventId) return false;
  var evt=sd.events[SM.state.currentEventId]; if(!evt||!evt.choices||!evt.choices[i]) return false;
  var ch=evt.choices[i];
  if(ch.condition){for(var k in ch.condition){if(k==="flag"&&!SM.hasFlag(ch.condition[k]))return false;if(k==="anomalyMin"&&SM.state.anomalyLevel<ch.condition[k])return false;}}
  SM.addLog("▶"+ch.text);
  if(ch.effects){
    if(ch.effects.anomaly) SM.addAnomaly(ch.effects.anomaly,ch.effects.log||ch.text);
    if(ch.effects.floor!==undefined) SM.state.floor=ch.effects.floor;
    if(ch.effects.doors!==undefined) SM.state.doorsOpen=ch.effects.doors;
    if(ch.effects.stop!==undefined) SM.state.emergencyStop=ch.effects.stop;
    if(ch.effects.flag) SM.setFlag(ch.effects.flag);
    if(ch.effects.fragment){var fid=ch.effects.fragment;var ft=(sd.fragments&&sd.fragments[fid])||"未知";SM.addFragment(fid,ft);}
  }
  if(ch.effects&&ch.effects.floor!==undefined){var s=require("../data/story.js");var f=ch.effects.floor;if(s.floorEvents&&s.floorEvents[f]&&!SM.hasFlag("v_"+f)){SM.setFlag("v_"+f);triggerEvent(s.floorEvents[f]);return true;}}
  if(ch.next){
    if(ch.next==="ending_false"||ch.next==="ending_true"||ch.next==="ending_secret"){endGame(ch.next);return true;}
    if(ch.ad){SM.addLog("[广告占位]");endGame("ending_false");return true;}
    triggerEvent(ch.next);return true;
  }
  SM.state.gamePhase="playing";SM.state.eventLock=false;return true;
}
function endGame(t){SM.state.gamePhase="ending";SM.state.currentEventId=t;SM.addLog(t==="ending_false"?"[结局]循环继续":t==="ending_true"?"[结局]真相浮现":"[结局]觉醒");}
module.exports={loadStory,triggerEvent,handleChoice};
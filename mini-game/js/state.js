var S = { floor: 1, doorsOpen: false, emergencyStop: false, anomalyLevel: 0,
anomalyHistory: [], logEntries: [], currentEventId: null, flags: {},
alive: true, gamePhase: "playing", eventLock: false,
truthFragments: [], monitorStatus: "normal", alertCode: null, eventCount: 0 };
function reset() {
  S.floor=1; S.doorsOpen=false; S.emergencyStop=false; S.anomalyLevel=0;
  S.anomalyHistory=[]; S.logEntries=[]; S.currentEventId=null; S.flags={};
  S.alive=true; S.gamePhase="playing"; S.eventLock=false;
  S.truthFragments=[]; S.monitorStatus="normal"; S.alertCode=null; S.eventCount=0;
}
function addLog(t) {
  S.logEntries.push({text:t,time:Date.now()});
  if (S.logEntries.length>80) S.logEntries.shift();
}
function addAnomaly(a,r) {
  S.anomalyLevel=Math.min(100,S.anomalyLevel+a);
  S.anomalyHistory.push({amount:a,reason:r,time:Date.now()});
  if (S.anomalyLevel>=80) { S.alive=false; S.gamePhase="ending"; }
  if (S.anomalyLevel>=50) S.monitorStatus="danger";
  else if (S.anomalyLevel>=25) S.monitorStatus="anomaly";
  addLog("[异常+"+a+"%] "+r);
}
function addFragment(id,t) {
  if (S.truthFragments.some(function(f){return f.id===id;})) return false;
  S.truthFragments.push({id:id,text:t});
  addLog("[碎片"+S.truthFragments.length+"/5]"); return true;
}
function setFlag(k) { S.flags[k]=true; }
function hasFlag(k) { return !!S.flags[k]; }
module.exports={state:S,reset,addLog,addAnomaly,addFragment,setFlag,hasFlag};
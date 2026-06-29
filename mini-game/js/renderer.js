var ctx=null,W=0,H=0;
function init(c) {
  ctx=c.getContext("2d");
  var info=wx.getWindowInfo?wx.getWindowInfo():{windowWidth:390,windowHeight:844};
  W=info.windowWidth; H=info.windowHeight; c.width=W; c.height=H;
  console.log("[RENDER] "+W+"x"+H);
}
function clr() { ctx.fillStyle="#0a0a0f"; ctx.fillRect(0,0,W,H); }
function dt(t,x,y,c,s) { ctx.font=(s||16)+"px monospace"; ctx.fillStyle=c||"#4a9eff"; ctx.fillText(t,x,y); }
function dr(x,y,w,h,c) { ctx.fillStyle=c||"#0a0a0f"; ctx.fillRect(x,y,w,h); }
function dp(x,y,w,h,c) { ctx.strokeStyle=c||"rgba(74,158,255,0.15)"; ctx.lineWidth=1; ctx.strokeRect(x,y,w,h); }
function render(s,e) { clr(); dh(s); dm(s); dl(s); dc(s); ds(s); if(e) de(e,s); if(s.gamePhase==="ending") dEnd(s); }
function dh(s) {
  dr(0,0,W,44,"#0d0d18"); dt("SYS::ELEVATOR_CTRL",12,32,"#4a9eff",15);
  var t=s.alertCode?"ALERT:"+s.alertCode:"STANDBY";
  dt(t,W-12-t.length*8,32,s.alertCode?"#ff3355":"rgba(74,158,255,0.3)",12);
  dr(0,43,W,1,"rgba(74,158,255,0.06)");
}
function dm(s) {
  var y=52; dp(8,y,W-16,150);
  dt("CCTV-"+(s.floor<10?"0":"")+s.floor,16,y+20,"rgba(74,158,255,0.3)",11);
  if(s.monitorStatus==="danger"){
    dr(8,y,W-16,150,"rgba(255,50,50,"+(Math.sin(Date.now()/200)*0.05+0.05)+")");
    dt("⚠ 危险级异常",24,y+60,"#ff3355",20); dt("建议:立即执行停梯",24,y+90,"rgba(255,50,50,0.6)",14);
  }else if(s.monitorStatus==="anomaly"){
    dr(8,y,W-16,150,"rgba(255,170,0,"+(Math.sin(Date.now()/300)*0.03+0.04)+")");
    dt("⚠ 检测到异常活动",24,y+60,"#ffaa00",18); dt("建议:谨慎操作",24,y+90,"rgba(255,170,0,0.5)",14);
  }else{
    dt("[电梯内部-静止]",24,y+60,"rgba(74,158,255,0.2)",16);
    dt("楼层:"+s.floor+"F | 门:"+(s.doorsOpen?"开":"关"),24,y+90,"rgba(74,158,255,0.15)",13);
  }
  var by=y+120,bw=W-40;
  dr(20,by,bw,14,"rgba(255,255,255,0.03)");
  var bc=s.anomalyLevel<30?"#66ccaa":s.anomalyLevel<60?"#ffaa00":"#ff3355";
  dr(20,by,bw*(s.anomalyLevel/100),14,bc);
  dt("异常:"+s.anomalyLevel+"%",20,by-5,bc,11);
  dt("碎片:"+s.truthFragments.length+"/5",W-90,by-5,s.truthFragments.length?"#ffaa00":"rgba(255,255,255,0.15)",11);
}
function dl(s) {
  var y=210,lh=H-y-110; dp(8,y,W-16,lh);
  dt("操作日志",16,y+20,"rgba(74,158,255,0.3)",11);
  var ms=Math.floor((lh-28)/18); var es=s.logEntries.slice(-ms);
  for(var i=0;i<es.length;i++){
    var ts=new Date(es[i].time).toTimeString().substring(0,8);
    dt("["+ts+"] "+es[i].text,18,y+38+i*18,"rgba(176,184,200,0.6)",11);
  }
}
function dc(s) {
  var y=H-88-28; dp(8,y,W-16,88,"rgba(74,158,255,0.05)");
  dt("控制面板",16,y+18,"rgba(74,158,255,0.3)",11);
  var ba=[{l:"开门",id:"o"},{l:"关门",id:"c"},{l:"停梯",id:"s",d:true},{l:"呼叫",id:"l"},{l:"忽略",id:"i"}];
  var bw=(W-52)/5,bx=24,by=y+34;
  for(var i=0;i<ba.length;i++){
    var b=ba[i],bw2=bw-2;
    dr(bx+i*(bw+2),by,bw2,48,b.d?"rgba(255,50,50,0.12)":"rgba(74,158,255,0.08)");
    ctx.strokeStyle=b.d?"rgba(255,50,50,0.25)":"rgba(74,158,255,0.15)";
    ctx.strokeRect(bx+i*(bw+2),by,bw2,48);
    dt(b.l,bx+i*(bw+2)+bw2/2-18,by+32,b.d?"#ff3355":"#4a9eff",13);
  }
}
function ds(s) {
  var y=H-28; dr(0,y,W,28,"#0d0d18"); dr(0,y,W,1,"rgba(74,158,255,0.05)");
  dt(s.doorsOpen?"门:开":"门:关",12,y+18,s.doorsOpen?"rgba(74,158,255,0.5)":"rgba(74,158,255,0.3)",11);
  dt("F"+s.floor,W/2-14,y+18,"rgba(74,158,255,0.4)",11);
  dt(s.eventLock?"EVENT":"IDLE",W-70,y+18,s.eventLock?"#ffaa00":"rgba(74,158,255,0.2)",11);
}
function de(evt,s) {
  var y=210+4,lh=H-y-110-4;
  dr(12,y+2,W-24,lh-4,"rgba(10,10,15,0.88)"); dr(12,y+2,3,lh-4,"#ffaa00");
  dt(s.alertCode||"ANOMALY",24,y+22,"#ffaa00",14); dt(evt.title||"",24,y+44,"#ffcc44",17);
  var ls=(evt.content||"").split("\n");
  for(var i=0;i<ls.length&&i<10;i++) dt(ls[i],24,y+70+i*17,"#b0b8c8",12);
  if(evt.choices&&s.gamePhase!=="ending"){
    var cy=y+lh-28-evt.choices.length*24;
    for(var j=0;j<evt.choices.length;j++){
      var ch=evt.choices[j]; dt((ch.ad?"📺 ":"❯ ")+ch.text,24,cy+j*24,ch.ad?"#ffaa00":"#4a9eff",13);
    }
  }
}
function dEnd(s) {
  dr(0,0,W,H,"rgba(10,10,15,0.92)");
  var t="实验失败",d="异常值超限,系统已锁定",c="#ff3355";
  if(s.currentEventId==="ending_true"||s.currentEventId==="ending_secret"){
    t=s.currentEventId==="ending_true"?"结局:真相":"隐藏结局:觉醒";
    d=s.currentEventId==="ending_true"?"你看到了循环之外的东西。":"你打破了循环。"; c="#66ccaa";
  }
  dt(t,30,140,c,26); dt(d,30,180,"#b0b8c8",15);
  dt("碎片收集:"+s.truthFragments.length+"/5",30,215,s.truthFragments.length?"#ffaa00":"rgba(255,255,255,0.3)",13);
  if(s.anomalyLevel>=80){
    dr(40,H-140,W-80,48,"rgba(255,180,0,0.12)");
    ctx.strokeStyle="rgba(255,180,0,0.35)"; ctx.strokeRect(40,H-140,W-80,48);
    dt("📺 观看广告·复活",W/2-70,H-112,"#ffaa00",15);
  }
  dr(40,H-80,W-80,48,"rgba(74,158,255,0.08)");
  ctx.strokeStyle="rgba(74,158,255,0.2)"; ctx.strokeRect(40,H-80,W-80,48);
  dt("❯ 重新开始",W/2-56,H-52,"#4a9eff",15);
}
module.exports={init,render};
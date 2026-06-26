var rc=require('../../data/rules-config.js');
var sm=require('../../utils/sound-manager.js');
var ad=require('../../utils/ad-manager.js');
var fm=require('../../utils/fragment-manager.js');
var _endTag={ending_good:'END:0xD3_SURVIVOR',ending_bad:'END:0x7F_RECYCLED',ending_secret:'END:0xFF_AWAKEN',ending_false_1:'END:0xF1_COLLAPSE',ending_false_2:'END:0xF2_STALL',ending_false_3:'END:0xF3_VOID'};
Page({
  data:{title:'',content:'',canRestart:false,restartTarget:'',stats:{},fragmentCount:0,fragmentTotal:5,showRevive:false,showAdEnding:false,endingTag:'SYS_END',atmoState:'anomaly',atmoClass:'atmo-anomaly',fxFlicker:false},
  onLoad(opt){
    var id=opt.id;var app=getApp();var data=app.globalData.storyData;
    if(!data||!data.chapters||!data.chapters[id]){wx.showToast({title:'加载失败',icon:'none'});return}
    var ch=data.chapters[id];var rt='';
    if(ch.choices&&ch.choices.length>0)rt=ch.choices[0].next||'';
    var path=app.globalData.storyPath||[];
    var rf=app.globalData.discoveredRules||[];
    var rk=Object.keys(rc||{});
    var fc=fm.getCount();
    var mood='anomaly',cls='atmo-anomaly',fx=false,showRv=false,showAd=false;
    if(id==='ending_bad'||id==='ending_false_1'||id==='ending_false_2'||id==='ending_false_3'){mood='danger';cls='atmo-danger';fx=true;showRv=true}
    if(id==='ending_secret'){mood='anomaly';cls='atmo-anomaly'}
    if(id==='ending_good'||id==='ending_secret')showAd=true;
    sm.init();sm.play('ending');sm.playEndingSound(id);
    this.setData({title:ch.title,content:ch.content,canRestart:!!rt,restartTarget:rt,
      stats:{chapters:path.length,rulesFound:rf.length,rulesTotal:rk.length,truthFragments:fc},
      fragmentCount:fc,fragmentTotal:5,showRevive:showRv,showAdEnding:showAd,
      endingTag:_endTag[id]||'END_'+id,atmoState:mood,atmoClass:cls,fxFlicker:fx});
    // 假结局广告复活弹窗
    if(showRv&&ch.choices&&ch.choices.length>0&&ch.choices[0].effects&&ch.choices[0].effects.ad_revive){
      this.setData({canRestart:false}); // 不让直接重启
    }
  },
  onRestart(){
    var app=getApp();app.globalData.storyPath=[];app.globalData.discoveredRules=[];
    app.globalData.playerState={sanity:100,trust:50,flags:{}};
    wx.removeStorageSync('story_save');
    wx.redirectTo({url:'/pages/chapter/chapter?id=chapter_1'})
  },
  onWatchAd(){
    var s=this;
    // 使用ID直接匹配
    var targets={ending_false_1:'chapter_3',ending_false_2:'chapter_6',ending_false_3:'chapter_6',ending_bad:'chapter_6'};
    var curId='';var tt=s.data.title||'';
    if(tt.indexOf('精神崩溃')>=0)curId='ending_false_1';
    else if(tt.indexOf('停滞')>=0)curId='ending_false_2';
    else if(tt.indexOf('虚无')>=0)curId='ending_false_3';
    else curId='ending_bad';
    var target=targets[curId]||'chapter_3';
    ad.showRewarded('ending_revive',function(){
      var app=getApp();app.globalData.playerState.sanity=Math.max(30,(app.globalData.playerState.sanity||0)+20);
      wx.redirectTo({url:'/pages/chapter/chapter?id='+target});
    });
  },
  onAdEnding(){
    ad.showRewarded('ending_support',function(){
      wx.showToast({title:'感谢支持！',icon:'none'});
    });
  }
});

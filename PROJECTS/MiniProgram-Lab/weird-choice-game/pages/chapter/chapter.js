var rc=require('../../data/rules-config.js');
var sm=require('../../utils/sound-manager.js');
var atm=require('../../utils/atmosphere-manager.js');
var ad=require('../../utils/ad-manager.js');
var fm=require('../../utils/fragment-manager.js');
var app=getApp();
var _t=null;
var _chTag={chapter_1:'CH_01',chapter_2a:'CH_02A',chapter_2b:'CH_02B',chapter_3:'CH_03',chapter_4_left:'CH_04L',chapter_4_right:'CH_04R',chapter_5:'CH_05',chapter_6:'CH_06',chapter_7:'CH_07',chapter_8:'CH_08',ending_good:'END_GD',ending_bad:'END_BD',ending_secret:'END_SC',ending_false_1:'END_F1',ending_false_2:'END_F2',ending_false_3:'END_F3'};
Page({
  data:{title:'',content:'',displayContent:'',choices:[],chapterId:'',animating:false,typing:false,clickFeedback:'',sanity:100,trust:50,showState:true,fragmentCount:0,fragmentTotal:5,adUnlocked:false,atmoState:'normal',atmoClass:'atmo-normal',fxFlicker:false,fxShake:false,chapterTag:'SYS_INIT'},
  onLoad(o){
    var id=o.id||'chapter_1';var s=this;
    if(!app.globalData.storyData){wx.showToast({title:'加载失败',icon:'none'});return}
    sm.init();atm.init(s);
    if(id==='chapter_1'){var ps=app.globalData.playerState||{sanity:100,trust:50,flags:{}};if(!ps.resetFlag){ps={sanity:100,trust:50,flags:{},resetFlag:true};app.globalData.playerState=ps}}
    var sv=wx.getStorageSync('story_save');
    if(id==='chapter_1'&&sv&&sv.chapterId!=='chapter_1'){
      wx.showModal({title:'发现存档',content:'继续上次进度?('+sv.title+')',
        success:function(r){if(r.confirm){wx.redirectTo({url:'/pages/chapter/chapter?id='+sv.chapterId})}else{wx.removeStorageSync('story_save');s.go(id)}}});
      return;
    }
    this.go(id);
  },
  onUnload(){if(_t){clearInterval(_t);_t=null}},
  go(id){
    var s=this;var d=app.globalData.storyData;
    if(!d||!d.chapters){wx.showToast({title:'剧情未加载',icon:'none'});return}
    var ch=d.chapters[id];if(!ch){wx.showToast({title:'章节不存在',icon:'none'});return}
      var p=app.globalData.storyPath||[];if(p.indexOf(id)===-1)p.push(id);app.globalData.storyPath=p;
    var rl=rc[id];if(rl){var r=app.globalData.discoveredRules||[];if(r.indexOf(rl)===-1){r.push(rl);app.globalData.discoveredRules=r;sm.play('rule');atm.onRuleFound()}}
    var ps=app.globalData.playerState||{sanity:100,trust:50,flags:{}};
    var fc=fm.getCount();
    s.setData({rulesCount:(app.globalData.discoveredRules||[]).length,sanity:ps.sanity,trust:ps.trust,chapterTag:_chTag[id]||'SYS_'+id,fragmentCount:fc,fragmentTotal:fm.getTotal()});
    // 检查广告解锁按钮（放在setData之后，避免被覆盖）
    if(ch.choices&&ch.choices.length>0){
      for(var ai=0;ai<ch.choices.length;ai++){
        if(ch.choices[ai].effects&&ch.choices[ai].effects.ad_unlock){
          s.setData({adUnlocked:true});
        }
      }
    }
    atm.setChapterMood(id);
    var end=!ch.choices||ch.choices.length===0;
    if(end){wx.removeStorageSync('story_save');wx.redirectTo({url:'/pages/ending/ending?id='+id});return}
    wx.setNavigationBarTitle({title:ch.title});
    wx.setStorageSync('story_save',{chapterId:id,title:ch.title,time:Date.now()});
    if(_t){clearInterval(_t);_t=null}
    s.setData({animating:false,displayContent:'',clickFeedback:''});
    setTimeout(function(){
      s.setData({content:ch.content,title:ch.title,choices:ch.choices,chapterId:id});
      s.type(ch.content);s.setData({animating:true});
      sm.play('chapter');sm.playChapterSound(id);sm.playChapterBreath(id);
      if(id==='chapter_1')sm.startAmbient();
      wx.pageScrollTo({scrollTop:0,duration:100})
    },120);
  },
  type(t){var s=this;s.setData({typing:true,displayContent:''});var i=0;
    _t=setInterval(function(){if(i<t.length){s.setData({displayContent:t.substring(0,i+1)});i++}else{clearInterval(_t);_t=null;s.setData({typing:false,displayContent:t})}},18);
  },
  onChoice(e){
    if(this.data.typing){wx.showToast({title:'请等剧情播完',icon:'none'});return}
    var idx=e.currentTarget.dataset.idx||0;
    if(idx%2===0){wx.vibrateShort({type:'light'})}else{wx.vibrateShort({type:'medium'})}
    this.setData({clickFeedback:'pulse-'+idx});
    setTimeout(function(){this.setData({clickFeedback:''})}.bind(this),200);
    sm.play('click');
    var choices=this.data.choices||[];
    var choice=choices[idx];
    if(choice&&choice.effects){
      var ps=app.globalData.playerState||{sanity:100,trust:50,flags:{}};
      if(choice.effects.sanity!==undefined)ps.sanity=Math.max(0,Math.min(100,ps.sanity+choice.effects.sanity));
      if(choice.effects.trust!==undefined)ps.trust=Math.max(0,Math.min(100,ps.trust+choice.effects.trust));
      if(choice.effects.flag)ps.flags[choice.effects.flag]=true;
      app.globalData.playerState=ps;
      // 收集碎片
      if(choice.effects.fragment){fm.collect(choice.effects.fragment);var nfc=fm.getCount();this.setData({fragmentCount:nfc});wx.showToast({title:'发现真相碎片 '+nfc+'/'+fm.getTotal(),icon:'none',duration:2000})}
      this.setData({sanity:ps.sanity,trust:ps.trust});
      atm.updateBySanity(ps.sanity);
      atm.onChoice(choice.effects);
    }
    var n=e.currentTarget.dataset.next;if(!n)return;
    // 假结局广告复活
    if(choice&&choice.effects&&choice.effects.ad_revive){
      ad.showRewarded('false_revive',function(){
        var ps=app.globalData.playerState||{sanity:100};
        ps.sanity=Math.max(30,ps.sanity+20);
        app.globalData.playerState=ps;
        wx.showToast({title:'已复活！',icon:'success'});
        setTimeout(function(){this.go(n)}.bind(this),500);
      }.bind(this));
      return;
    }
    // 广告解锁：点击隐藏选项时先看广告
    if(choice&&choice.effects&&choice.effects.ad_unlock){
      ad.showRewarded('hidden_unlock',function(){
        setTimeout(function(){this.go(n)}.bind(this),150);
      }.bind(this));
      return;
    }
    setTimeout(function(){this.go(n)}.bind(this),150);
  },
  doRevive(ch){
    var target=ch.choices[0].next||'chapter_3';
    var ps=app.globalData.playerState||{sanity:100,trust:50,flags:{}};
    ps.sanity=Math.max(30,ps.sanity+20);
    app.globalData.playerState=ps;
    wx.showToast({title:'已复活！',icon:'success'});
    setTimeout(function(){this.go(target)}.bind(this),500);
  },
  onTapSkip(){if(this.data.typing){if(_t){clearInterval(_t);_t=null}this.setData({typing:false,displayContent:this.data.content})}},
  onAdUnlock(){var s=this;ad.showRewarded('chapter_unlock',function(){var ps=app.globalData.playerState||{sanity:100};ps.sanity=Math.max(30,ps.sanity+10);app.globalData.playerState=ps;wx.showToast({title:'隐藏已解锁',icon:'success'});s.setData({adUnlocked:true})})},
  onRules(){wx.navigateTo({url:'/pages/rules/rules'})}
});

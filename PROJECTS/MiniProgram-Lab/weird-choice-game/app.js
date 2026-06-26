var sd=require('./data/story.js');
var ad=require('./utils/ad-manager.js');
App({
  globalData:{
    storyData:sd,
    discoveredRules:[],
    storyPath:[],
    playerState:{sanity:100,trust:50,flags:{}},
    __dev__:true,
    playBgm:null
  },
  onLaunch: function(){
    ad.init();
    console.log('[系统] 规则怪谈 v'+sd.version+' MVP');
  }
});

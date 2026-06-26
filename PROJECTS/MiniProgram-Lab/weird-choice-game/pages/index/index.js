var sm=require('../../utils/sound-manager.js');
Page({
  data:{title:'规则怪谈',subtitle:'互动叙事体验',loaded:false,glitchText:'规\n则\n怪\n谈'},
  onLoad(){
    var s=this;sm.init();
    // 模拟开机动画
    setTimeout(function(){s.setData({glitchText:'规则怪谈'})},300);
    setTimeout(function(){s.setData({loaded:true});sm.startAmbient()},800);
  },
  onStart(){sm.play('click');wx.redirectTo({url:'/pages/chapter/chapter?id=chapter_1'})}
});
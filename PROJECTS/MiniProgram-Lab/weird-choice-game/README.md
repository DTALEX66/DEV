# 规则怪谈 · 互动叙事小程序

> 微信小程序，规则怪谈风格的互动叙事体验。
> GitHub: github.com/DTALEX66/DEV
> 本地: D:\DEV\PROJECTS\MiniProgram-Lab\weird-choice-game

## 剧情概要

你在一间陌生的房间里醒来，墙上贴着写有规则的纸条。
遵守规则……还是打破它们？你的选择决定命运。

- 16 个章节，3 条主要分支路线
- 3 种结局：幸存者 / 替代 / 觉醒（隐藏）
- 5 条规则可供收集

## 项目架构

weird-choice-game/
  app.js      # 入口，预加载剧情数据
  app.json    # 页面注册
  app.wxss    # 全局暗黑主题样式
  data/
    story.js        # 剧情数据模块
    story.json      # 剧情源文件（JSON）
    rules-config.js # 规则配置字典
  pages/
    index/    # 首页
    chapter/  # 章节页（核心剧情引擎）
    ending/   # 结局页（统计 + 路线图）

## 功能清单

- 分支剧情：选项驱动，章节内直接切换（无页面跳转）
- 打字机效果：逐字显示剧情，点击跳过快进
- 规则收集：右上角按钮查看已发现规则
- 结局路线图：展示走过的路径分支
- 自动存档：再次进入提示继续进度
- 振动反馈 + 渐入动画 + 背景呼吸光晕

## 快速开始

1. 微信开发者工具导入 D:\DEV\PROJECTS\MiniProgram-Lab\weird-choice-game
2. Ctrl+B 编译运行
3. 点开始游戏体验
4. 真机调试：工具顶栏点真机调试 → 微信扫码

## 如何修改剧情

编辑 data/story.json，格式：

{
  "chapter_id": {
    "title": "章节标题",
    "content": "正文文字",
    "choices": [
      { "text": "选项", "next": "目标章节ID" }
    ]
  }
}

修改后同步更新 data/story.js 和 app.js。

## 如何添加规则

编辑 data/rules-config.js：

module.exports = {
  "chapter_id": "规则描述"
};

## 如何推送更新

双击 git-push.bat 或使用 GitHub Desktop。

## 目录约束

D:\DEV\
  CORE_SYSTEM/   # 系统规则与配置（只读）
  PROJECTS/      # 正式项目代码
  SANDBOX/       # 测试与原型代码
  TOOLS/         # 工具脚本
  MEMORY/        # 项目记忆

## 当前状态

Phase 1 项目初始化 ✅
Phase 2 核心引擎 ✅
Phase 3 体验完善 ⏳
Phase 4 测试发布 ⏳

---

版本 1.1.0 | 16 章节 3 结局 | 2026-06-26

# 规则怪谈 · 互动叙事小程序

> 微信小程序，基于规则怪谈风格的互动叙事体验。

## 功能

- 🎮 16 章节分支剧情，3 种结局
- 📜 规则收集系统（5 条隐藏规则）
- 🗺️ 结局路线图，展示你的探索路径
- 💾 自动存档/读档
- 📱 振动反馈 + 渐入动画
- 🌙 暗黑怪谈风 UI

## 项目结构

```
weird-choice-game/
  AGENTS.md              # AI 行为规则
  CODEX_TASK.md          # 任务跟踪
  DEV_PLAN.md            # 开发计划
  TEST_CHECKLIST.md      # 测试清单
  README.md              # 本文件
  app.js                 # 小程序入口
  app.json               # 页面配置
  app.wxss               # 全局样式
  project.config.json    # 项目配置
  data/
    story.js             # 剧情数据模块
    story.json           # 剧情数据源
    rules-config.js      # 规则配置
  pages/
    index/               # 首页
    chapter/             # 章节页（核心）
    ending/              # 结局页
  utils/
    story-loader.js      # 故事引擎
```

## 快速开始

1. 用微信开发者工具导入本项目
2. 按 Ctrl+B 编译运行
3. 点击「开始游戏」体验剧情

## 安全约束

- 所有开发在 D:\DEV 范围内
- 测试代码放在 D:\DEV\SANDBOX
- 禁止删除已有文件

---

> 当前状态: Phase 2 核心引擎完成
> 剧情版本: 1.1.0
> 章节: 16 | 结局: 3 | 规则: 5

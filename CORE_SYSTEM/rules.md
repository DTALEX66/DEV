# CORE_SYSTEM 规则

## 目录边界
- CORE_SYSTEM  → 系统级配置与规则
- PROJECTS     → 正式项目代码
- SANDBOX      → 测试与实验代码
- TOOLS        → 工具脚本
- MEMORY       → 项目记忆与上下文

## 禁止行为
- 禁止跨目录（CORE_SYSTEM / PROJECTS / SANDBOX 不可互写）
- 禁止删除任何文件
- 禁止写入 C 盘
- 禁止自动推送 GitHub

## 操作规范
- 所有变更必须可回滚
- 每次只做一个任务
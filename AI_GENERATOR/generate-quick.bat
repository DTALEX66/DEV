@echo off
chcp 65001 >nul
cd /d D:\DEV\AI_GENERATOR
if "%1"=="" (
  echo 用法: generate ^<主题^>
  echo 主题: 电梯 医院 酒店 学校 地铁
  exit /b
)
node generator.js %1
echo.
echo 输出: output/story.json

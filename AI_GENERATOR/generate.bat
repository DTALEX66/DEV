@echo off
chcp 65001 >nul
cd /d D:\DEV\AI_GENERATOR
echo 规则怪谈剧情生成器
echo =====================
echo.
set /p subject=输入主题(
for %%a in (电梯 医院 酒店 学校 地铁) do echo  %%a
echo):
node generator.js %subject%
echo.
echo 生成完毕！文件位于 output/
pause

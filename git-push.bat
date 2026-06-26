@echo off
chcp 65001 >nul
cd /d D:\DEV

echo ================================
echo  规则怪谈 - Git 推送工具
echo ================================
echo.

REM 设置全局用户信息
echo [1/5] 设置 Git 用户...
"C:\Program Files\Git\bin\git.exe" config --global user.email "dtalex66@users.noreply.github.com"
"C:\Program Files\Git\bin\git.exe" config --global user.name "DTALEX66"

REM 初始化
if not exist ".git" (
  echo [2/5] 初始化仓库...
  "C:\Program Files\Git\bin\git.exe" init
  "C:\Program Files\Git\bin\git.exe" branch -M main
)

REM 远程仓库（HTTPS）
echo [3/5] 设置远程仓库...
"C:\Program Files\Git\bin\git.exe" remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
  "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/DTALEX66/DEV.git
) else (
  "C:\Program Files\Git\bin\git.exe" remote set-url origin https://github.com/DTALEX66/DEV.git
)

REM 添加 + 提交
echo [4/5] 添加并提交...
"C:\Program Files\Git\bin\git.exe" add -A
"C:\Program Files\Git\bin\git.exe" commit -m "auto update"
if %errorlevel% neq 0 echo   （没有新变更）

REM 推送
echo [5/5] 推送到 GitHub...
"C:\Program Files\Git\bin\git.exe" push -u origin main

echo.
echo 完成！
pause
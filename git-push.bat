@echo off
chcp 65001 >nul
cd /d D:\DEV

echo ================================
echo Git Push Tool
echo ================================
echo.

echo 1. Setting git user...
"C:\Program Files\Git\bin\git.exe" config --global user.email "dtalex66@users.noreply.github.com"
"C:\Program Files\Git\bin\git.exe" config --global user.name "DTALEX66"

echo 2. Init if needed...
if not exist ".git" (
  "C:\Program Files\Git\bin\git.exe" init
  "C:\Program Files\Git\bin\git.exe" branch -M main
)

echo 3. Setting remote...
"C:\Program Files\Git\bin\git.exe" remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
  "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/DTALEX66/DEV.git
) else (
  "C:\Program Files\Git\bin\git.exe" remote set-url origin https://github.com/DTALEX66/DEV.git
)

echo 4. Adding and committing...
"C:\Program Files\Git\bin\git.exe" add -A
"C:\Program Files\Git\bin\git.exe" commit -m "auto update"
if %errorlevel% neq 0 echo Nothing to commit

echo 5. Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push -u origin main

echo.
echo Done!
pause
@echo off
chcp 65001 >nul
cd /d "D:\第三版"
echo ============================================
echo   JS Suspension - 一键同步到 GitHub/Vercel
echo ============================================
echo.

rem 1. 添加所有修改（含新增/删除/重命名）
git add -A
if errorlevel 1 (
  echo [错误] git add 失败
  pause
  exit /b 1
)

rem 2. 判断是否有需要提交的修改
set HAS_CHANGES=0
for /f %%i in ('git status --porcelain') do set HAS_CHANGES=1

if %HAS_CHANGES%==0 (
  echo 没有检测到任何修改，本地与 GitHub 已完全一致。
  pause
  exit /b 0
)

rem 3. 提交
echo 检测到修改，正在提交...
set COMMIT_MSG=update site content
set /p COMMIT_MSG=请输入提交说明（直接回车使用默认）: 

git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
  echo [错误] git commit 失败
  pause
  exit /b 1
)

rem 4. 推送
echo 正在推送到 GitHub...
git push origin main
if errorlevel 1 (
  echo [错误] git push 失败（请检查网络和 GitHub 登录状态）
  pause
  exit /b 1
)

echo.
echo ============================================
echo   [同步成功] GitHub 已更新！
echo   Vercel 将在 1-2 分钟内自动重新部署
echo ============================================
pause
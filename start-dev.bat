@echo off
chcp 65001 >nul
cd /d "D:\第三版"

rem ============================================
rem  未提交修改检查 - 提醒同步 GitHub/Vercel
rem ============================================
set HAS_CHANGES=0
for /f %%i in ('git status --porcelain') do set HAS_CHANGES=1
if %HAS_CHANGES%==1 (
  echo [!警告!] 检测到本地有未提交的修改，这些改动不会显示在线上网站！
  echo   - 请先运行 sync.bat 一键同步到 GitHub/Vercel
  echo     （或手动执行: git add . / git commit / git push）
  echo.
  echo   按任意键继续启动本地服务（将不会同步线上）...
  pause >nul
  echo.
)

echo Stopping old Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo Clearing Next.js cache...
rmdir /s /q .next >nul 2>&1
rmdir /s /q .next2 >nul 2>&1
echo Starting dev server...
call npm run dev
pause

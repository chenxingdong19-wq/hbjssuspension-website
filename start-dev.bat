@echo off
cd /d "D:\第三版"
echo Stopping old Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo Clearing Next.js cache...
rmdir /s /q .next >nul 2>&1
rmdir /s /q .next2 >nul 2>&1
echo Starting dev server...
call npm run dev
pause

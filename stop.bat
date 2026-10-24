@echo off
echo ========================================================
echo   Stopping Enterprise GraphRAG Platform Services...
echo ========================================================

echo Stopping process on port 8001 (Python AI)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8001" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

echo Stopping process on port 8080 (Java Gateway)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

echo Stopping process on port 3000 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

echo Services stopped.
pause

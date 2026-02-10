@echo off
cd /d "%~dp0"

echo ==============================================
echo [AUTO] LinkedIn Scraper & Publisher Started
echo Time: %DATE% %TIME%
echo ==============================================

:: 1. Run the Scraper
echo.
echo [1/3] Running Scraper... (This may take a while)
call node index.js

:: 2. Check if jobs.json changed
echo.
echo [2/3] Checking for updates...
git status | findstr "jobs.json" >nul
if %errorlevel% neq 0 (
    echo No changes in jobs.json. Exiting.
    timeout /t 5
    exit /b
)

:: 3. Push to GitHub
echo.
echo [3/3] Publishing to GitHub...
git add website/jobs.json
git commit -m "Auto-update jobs: %DATE% %TIME%"
git push origin main

echo.
echo ==============================================
echo [SUCCESS] Site updated!
echo ==============================================
timeout /t 10

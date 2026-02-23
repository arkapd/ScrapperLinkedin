@echo off
setlocal
cd /d "%~dp0"

:: --- SECURITY ACCESS GATE ---
set "ACCESS_KEY=arkad2026"
echo.
echo ==============================================
echo [SECURE] LinkedIn Scraper Access Gate
echo ==============================================
set /p "entered_pass=Enter Security Access Key: "

if "%entered_pass%" neq "%ACCESS_KEY%" (
    echo.
    echo [ERROR] Invalid Access Key. Access Denied.
    timeout /t 5
    exit /b 1
)
echo.
echo [SUCCESS] Access Granted. Initializing pipeline...
echo.
:: ----------------------------

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
git add jobs.json archive.json
git commit -m "Auto-update jobs: %DATE% %TIME%"
git push origin main

echo.
echo ==============================================
echo [SUCCESS] Site updated!
echo ==============================================
timeout /t 10

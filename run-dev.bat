@echo off
title Diwakar Reddy Portfolio Server
color 0b
echo ========================================================
echo   Starting Diwakar Reddy's Swiss Brutalist Portfolio
echo   Local URL: http://localhost:3000
echo ========================================================
echo.

set "PATH=C:\Users\diwak\AppData\Roaming\fnm\node-versions\v26.13.1\installation;%PATH%"
cd /d "C:\Users\diwak\Desktop\Diwakar portfolio"

call npm run start
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Building and starting server...
    call npm run build
    call npm run start
)
pause

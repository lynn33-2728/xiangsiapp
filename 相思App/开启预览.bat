@echo off
setlocal
set "PORT=5193"
set "URL=http://127.0.0.1:%PORT%/"
cd /d "%~dp0"

set "NODE="
if exist "%~dp0..\node.exe" set "NODE=%~dp0..\node.exe"
if not defined NODE if exist "%~dp0node.exe" set "NODE=%~dp0node.exe"
if not defined NODE for /f "delims=" %%V in ('dir /b /o-n "%USERPROFILE%\.workbuddy\binaries\node\versions" 2^>nul') do if not defined NODE if exist "%USERPROFILE%\.workbuddy\binaries\node\versions\%%V\node.exe" set "NODE=%USERPROFILE%\.workbuddy\binaries\node\versions\%%V\node.exe"
if not defined NODE for /f "delims=" %%P in ('where node 2^>nul') do if not defined NODE set "NODE=%%P"
if not defined NODE if exist "%ProgramFiles%\nodejs\node.exe" set "NODE=%ProgramFiles%\nodejs\node.exe"
if not defined NODE if exist "%ProgramFiles(x86)%\nodejs\node.exe" set "NODE=%ProgramFiles(x86)%\nodejs\node.exe"
if not defined NODE if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" set "NODE=%LOCALAPPDATA%\Programs\nodejs\node.exe"
if not defined NODE goto :nonode

for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%PORT% .*LISTENING"') do taskkill /PID %%P /F >nul 2>&1
ping -n 2 127.0.0.1 >nul 2>&1
start "Xiangsi Preview" /min "%NODE%" "%~dp0serve.js"

set /a "TRIES=0"
:wait
call :portopen
if %errorlevel%==0 goto :open
set /a "TRIES+=1"
if %TRIES% geq 30 goto :failed
ping -n 2 127.0.0.1 >nul 2>&1
goto :wait

:open
start "" "%URL%"
exit /b 0

:portopen
"%NODE%" -e "const n=require('net');const s=n.connect(%PORT%,'127.0.0.1',()=>{s.destroy();process.exit(0)});s.on('error',()=>process.exit(1));setTimeout(()=>process.exit(1),1000)" >nul 2>&1
exit /b %errorlevel%

:nonode
powershell -NoProfile -WindowStyle Hidden -Command "Add-Type -AssemblyName PresentationFramework;[System.Windows.MessageBox]::Show('Node.js was not found. Please install Node.js once on this computer.','Xiangsi App')" >nul 2>&1
exit /b 1

:failed
powershell -NoProfile -WindowStyle Hidden -Command "Add-Type -AssemblyName PresentationFramework;[System.Windows.MessageBox]::Show('The preview could not start. Please send a screenshot to Codex.','Xiangsi App')" >nul 2>&1
exit /b 1

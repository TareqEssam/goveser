@echo off
setlocal
rem Run this file from the project root, beside index.html and the pages/js/css folders.
cd /d "%~dp0"
if not exist "pages\investor-residency.html" (
  echo ERROR: pages\investor-residency.html was not found.
  echo Extract the entire ZIP and run this BAT from the same folder that contains index.html, pages, js, css, and assets.
  pause
  exit /b 1
)
where py >nul 2>&1
if %errorlevel%==0 goto use_py
where python >nul 2>&1
if %errorlevel%==0 goto use_python
echo Python was not found. Install Python, or use another local HTTP server.
pause
exit /b 1
:use_py
start "GOVESER local server" /D "%~dp0" cmd /k "py -m http.server 8000 --bind 127.0.0.1"
goto open_site
:use_python
start "GOVESER local server" /D "%~dp0" cmd /k "python -m http.server 8000 --bind 127.0.0.1"
:open_site
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8000/pages/investor-residency.html"
echo If the browser shows 404, make sure this BAT is beside index.html and the pages, js, css, and assets folders.
exit /b 0

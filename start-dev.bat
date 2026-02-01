@echo off
echo Starting Todio in development mode...
echo.

:: Start Vite dev server bound to IPv4 loopback (avoids IPv6 localhost issues)
start "Vite" cmd /c "npx vite --port 5010 --strictPort --host 127.0.0.1"

:: Wait for Vite to be ready
echo Waiting for Vite server...
timeout /t 3 /nobreak > nul

:: Start Electron
echo Starting Electron...
npx cross-env ELECTRON_START_URL=http://127.0.0.1:5010 npx electron .

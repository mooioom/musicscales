@echo off
setlocal enableextensions

for /F "usebackq" %%i IN (`powershell -Command "Get-Date -Format 'yyyy-MM-ddTHH:mm:ss.fffZ'"`) DO set timestamp=%%i

echo { "date": "%timestamp%" } > public/build.json

endlocal
@echo off

set FILE=deployment.log
set TEXT=deployment (%DATE% %TIME%)

REM Kill processes running on ports 80 and 8090
taskkill /PID 80 /F
taskkill /PID 8090 /F

if not exist %FILE% (
  echo %TEXT% > %FILE%
) else (
  echo %TEXT% >> %FILE%
)

REM Execute commands
git pull
concurrently "nodemon app" "nodemon deployment_server"

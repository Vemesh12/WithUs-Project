@echo off
echo Starting WithUs Platform...
echo.

echo Starting Backend Server...
cd backend
start "WithUs Backend" cmd /k "venv\Scripts\activate && python main.py"

echo.
echo Starting Frontend Server...
cd ..\frontend
start "WithUs Frontend" cmd /k "npm start"

echo.
echo WithUs Platform is starting up!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
pause 
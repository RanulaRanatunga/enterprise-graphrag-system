@echo off
echo ========================================================
echo   Starting Enterprise Multi-Agent GraphRAG Platform
echo ========================================================

echo [1/3] Starting Python AI Microservice (Port 8001)...
start "Python AI Microservice (:8001)" cmd /k "cd backend-python && .\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8001"

echo [2/3] Starting Java Business Gateway (Port 8080)...
start "Java Business Gateway (:8080)" cmd /k "cd backend-java && call mvnw.cmd spring-boot:run"

echo [3/3] Starting Frontend Web App (Port 3000)...
start "Frontend Web App (:3000)" cmd /k "cd frontend && npm run dev -- --host 0.0.0.0 --port 3000"

echo ========================================================
echo   All 3 services are launching!
echo   Frontend URL: http://localhost:3000
echo   Java Gateway: http://localhost:8080/api/business/health
echo   Python AI:    http://localhost:8001/health
echo ========================================================
pause

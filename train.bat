@echo off
REM Vande Bharat Railway Inspection - Training Script
REM Python: E:\Python310 (with GPU support for RTX 4050)
REM GPU: NVIDIA RTX 4050 with CUDA 11.8
cd /d "E:\PROJECTS\VandeBharat"
echo.
echo ==========================================
echo   VANDE BHARAT RAILWAY INSPECTION
echo   Starting Training with RTX 4050 GPU
echo ==========================================
echo.
"E:\Python310\python.exe" train.py %*
pause

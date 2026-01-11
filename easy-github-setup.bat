@echo off
cls
echo.
echo ========================================
echo   IKM JUARA DASHBOARD - GitHub Setup
echo ========================================
echo.
echo Langkah 1: Buat repository di GitHub
echo.
echo 1. Buka browser dan pergi ke: https://github.com/new
echo 2. Repository name: ikm-juara-dashboard
echo 3. Description: Dashboard sistem database IKM JUARA untuk DisnakerKUKM Kota Madiun
echo 4. Set ke Public
echo 5. JANGAN centang initialize with README
echo 6. Klik "Create repository"
echo.
pause
echo.
echo Langkah 2: Masukkan username GitHub Anda
echo.
set /p username="Masukkan username GitHub Anda: "
echo.
echo Langkah 3: Push code ke GitHub...
echo.
echo Menambahkan remote repository...
git remote add origin https://github.com/%username%/ikm-juara-dashboard.git 2>nul
if errorlevel 1 (
    echo Remote sudah ada, mengupdate...
    git remote set-url origin https://github.com/%username%/ikm-juara-dashboard.git
)
echo.
echo Setting main branch...
git branch -M main
echo.
echo Pushing ke GitHub...
git push -u origin main
echo.
if errorlevel 0 (
    echo ========================================
    echo          SETUP BERHASIL!
    echo ========================================
    echo.
    echo GitHub Repository: https://github.com/%username%/ikm-juara-dashboard
    echo.
    echo Langkah selanjutnya:
    echo 1. Buka: https://vercel.com/dashboard
    echo 2. Klik "Add New" - "Project"
    echo 3. Pilih "Continue with GitHub"
    echo 4. Cari "ikm-juara-dashboard" dan klik "Import"
    echo 5. Klik "Deploy"
    echo.
    echo Auto-deployment sudah aktif!
    echo Setiap push ke main branch akan otomatis deploy.
    echo.
) else (
    echo ========================================
    echo          ERROR OCCURRED
    echo ========================================
    echo.
    echo Pastikan:
    echo 1. Repository sudah dibuat di GitHub
    echo 2. Username GitHub benar
    echo 3. Anda sudah login Git: git config --global user.name "Your Name"
    echo.
)
echo.
pause
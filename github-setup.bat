@echo off
echo 🚀 IKM JUARA DASHBOARD - GitHub Setup
echo.
echo Please replace YOUR_USERNAME with your actual GitHub username
echo.
set /p username="Enter your GitHub username: "
echo.
echo Adding remote repository...
git remote add origin https://github.com/%username%/ikm-juara-dashboard.git
echo.
echo Setting main branch...
git branch -M main
echo.
echo Pushing to GitHub...
git push -u origin main
echo.
echo ✅ Setup complete!
echo.
echo Next: Go to https://vercel.com/dashboard to connect your repository
pause

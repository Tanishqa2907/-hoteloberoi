@echo off
REM Script to change GitHub remote to a different account

echo ========================================
echo Change GitHub Remote Repository
echo ========================================
echo.

REM Get current remote
echo Current remote:
git remote -v
echo.

REM Get new repository URL
set /p NEW_REPO_URL="Enter your new GitHub repository URL (e.g., https://github.com/USERNAME/hoteloberoi.git): "

if "%NEW_REPO_URL%"=="" (
    echo Error: Repository URL cannot be empty!
    pause
    exit /b 1
)

echo.
echo Removing old remote...
git remote remove origin

echo.
echo Adding new remote: %NEW_REPO_URL%
git remote add origin %NEW_REPO_URL%

echo.
echo Verifying new remote:
git remote -v

echo.
echo ========================================
echo Remote updated successfully!
echo.
echo Next steps:
echo 1. Make sure you're logged into the correct GitHub account
echo 2. Create the repository on GitHub if you haven't already
echo 3. Run: git push -u origin main
echo ========================================
echo.
pause


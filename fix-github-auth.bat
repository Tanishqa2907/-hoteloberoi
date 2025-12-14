@echo off
REM Script to fix GitHub authentication for new account

echo ========================================
echo Fix GitHub Authentication
echo ========================================
echo.

echo Step 1: Clearing stored GitHub credentials...
cmdkey /list | findstr github.com
if %ERRORLEVEL% EQU 0 (
    echo Found stored credentials. Removing...
    cmdkey /delete:git:https://github.com
    echo Credentials cleared!
) else (
    echo No stored credentials found.
)

echo.
echo Step 2: Checking current remote...
git remote -v

echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Go to GitHub and create a Personal Access Token:
echo    - GitHub ^> Settings ^> Developer settings ^> Personal access tokens
echo    - Click "Generate new token (classic)"
echo    - Give it a name (e.g., "hoteloberoi-project")
echo    - Select scope: "repo" (check all repo permissions)
echo    - Click "Generate token"
echo    - COPY THE TOKEN (you won't see it again!)
echo.
echo 2. When you push, use:
echo    - Username: Tanishqa2907
echo    - Password: [Paste your Personal Access Token]
echo.
echo 3. Run: git push -u origin main
echo.
echo ========================================
echo.
pause


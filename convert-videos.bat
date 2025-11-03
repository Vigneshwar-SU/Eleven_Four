@echo off
echo ==================================================
echo   MP4 to WebM Video Converter
echo ==================================================
echo.

:: Check if FFmpeg is installed
ffmpeg -version >nul 2>&1
if errorlevel 1 (
    echo FFmpeg is not installed!
    echo.
    echo Please install FFmpeg first:
    echo 1. Download from: https://ffmpeg.org/download.html
    echo 2. Or use winget: winget install FFmpeg
    echo 3. Or use chocolatey: choco install ffmpeg
    echo.
    pause
    exit /b
)

echo FFmpeg found!
echo.
echo Converting all MP4 files in the images directory...
echo.

cd images

for %%f in (*.mp4) do (
    if not exist "%%~nf.webm" (
        echo Converting: %%f
        ffmpeg -i "%%f" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus "%%~nf.webm"
        echo.
    ) else (
        echo Skipping %%f - WebM already exists
        echo.
    )
)

cd ..

echo.
echo ==================================================
echo   Conversion Complete!
echo ==================================================
echo.
echo Next steps:
echo 1. Update your HTML to use .webm files
echo 2. Keep .mp4 files as fallback for older browsers
echo 3. Test the website
echo.
pause

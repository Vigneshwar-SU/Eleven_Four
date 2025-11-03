# Video Conversion Script - MP4 to WebM
# This script converts all MP4 videos to WebM format for better web performance

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  MP4 to WebM Video Converter" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if FFmpeg is installed
try {
    $ffmpegVersion = ffmpeg -version 2>&1 | Select-Object -First 1
    Write-Host "✓ FFmpeg found: $ffmpegVersion" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ FFmpeg is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install FFmpeg first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://ffmpeg.org/download.html" -ForegroundColor Yellow
    Write-Host "2. Or use winget: winget install FFmpeg" -ForegroundColor Yellow
    Write-Host "3. Or use chocolatey: choco install ffmpeg" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
}

# Set the images directory
$imagesDir = "images"

# Get all MP4 files
$mp4Files = Get-ChildItem -Path $imagesDir -Filter "*.mp4"

if ($mp4Files.Count -eq 0) {
    Write-Host "No MP4 files found in the images directory." -ForegroundColor Yellow
    pause
    exit
}

Write-Host "Found $($mp4Files.Count) MP4 files to convert:" -ForegroundColor Cyan
foreach ($file in $mp4Files) {
    Write-Host "  - $($file.Name)" -ForegroundColor White
}
Write-Host ""

# Ask for confirmation
$confirm = Read-Host "Do you want to convert all these videos to WebM? (Y/N)"
if ($confirm -ne 'Y' -and $confirm -ne 'y') {
    Write-Host "Conversion cancelled." -ForegroundColor Yellow
    pause
    exit
}

Write-Host ""
Write-Host "Starting conversion..." -ForegroundColor Green
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($file in $mp4Files) {
    $inputPath = $file.FullName
    $outputPath = Join-Path $imagesDir ($file.BaseName + ".webm")
    
    Write-Host "Converting: $($file.Name)..." -ForegroundColor Cyan
    
    # Check if output file already exists
    if (Test-Path $outputPath) {
        Write-Host "  ⚠ WebM file already exists, skipping..." -ForegroundColor Yellow
        continue
    }
    
    try {
        # Convert using FFmpeg
        # -c:v libvpx-vp9: Use VP9 codec (better quality than VP8)
        # -crf 30: Quality level (lower = better quality, 23-32 is good range)
        # -b:v 0: Let CRF control bitrate
        # -c:a libopus: Use Opus audio codec
        $process = Start-Process -FilePath "ffmpeg" -ArgumentList "-i `"$inputPath`" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus `"$outputPath`"" -NoNewWindow -Wait -PassThru
        
        if ($process.ExitCode -eq 0) {
            $originalSize = (Get-Item $inputPath).Length / 1MB
            $newSize = (Get-Item $outputPath).Length / 1MB
            $savings = (($originalSize - $newSize) / $originalSize) * 100
            
            Write-Host "  ✓ Success! Original: $([math]::Round($originalSize, 2)) MB -> WebM: $([math]::Round($newSize, 2)) MB (Saved: $([math]::Round($savings, 1))%)" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "  ✗ Conversion failed!" -ForegroundColor Red
            $failCount++
        }
    } catch {
        Write-Host "  ✗ Error: $_" -ForegroundColor Red
        $failCount++
    }
    
    Write-Host ""
}

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Conversion Complete!" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Successful: $successCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update your HTML to use .webm files instead of .mp4" -ForegroundColor Yellow
Write-Host "2. Keep .mp4 files as fallback for older browsers" -ForegroundColor Yellow
Write-Host "3. Test the website to ensure videos play correctly" -ForegroundColor Yellow
Write-Host ""
pause

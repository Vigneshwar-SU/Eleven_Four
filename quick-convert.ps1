# Quick Video Converter - Direct FFmpeg Path
Write-Host "Converting MP4 videos to WebM..." -ForegroundColor Cyan
Write-Host ""

# FFmpeg path after winget installation
$ffmpegPath = "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0-full_build\bin\ffmpeg.exe"

# Alternative common paths
if (-not (Test-Path $ffmpegPath)) {
    $ffmpegPath = "C:\ffmpeg\bin\ffmpeg.exe"
}
if (-not (Test-Path $ffmpegPath)) {
    $ffmpegPath = "$env:ProgramFiles\ffmpeg\bin\ffmpeg.exe"
}

if (-not (Test-Path $ffmpegPath)) {
    Write-Host "FFmpeg not found. Please restart PowerShell and try again." -ForegroundColor Red
    Write-Host "Or manually specify the path to ffmpeg.exe" -ForegroundColor Yellow
    pause
    exit
}

Write-Host "Using FFmpeg at: $ffmpegPath" -ForegroundColor Green
Write-Host ""

$imagesDir = "images"
$mp4Files = Get-ChildItem -Path $imagesDir -Filter "*.mp4"

Write-Host "Found $($mp4Files.Count) MP4 files" -ForegroundColor Cyan
Write-Host ""

$count = 0
foreach ($file in $mp4Files) {
    $count++
    $inputPath = $file.FullName
    $outputPath = Join-Path $imagesDir ($file.BaseName + ".webm")
    
    if (Test-Path $outputPath) {
        Write-Host "[$count/$($mp4Files.Count)] Skipping $($file.Name) - WebM exists" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "[$count/$($mp4Files.Count)] Converting $($file.Name)..." -ForegroundColor Cyan
    
    & $ffmpegPath -i "$inputPath" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus "$outputPath" -y 2>&1 | Out-Null
    
    if (Test-Path $outputPath) {
        $originalSize = (Get-Item $inputPath).Length / 1MB
        $newSize = (Get-Item $outputPath).Length / 1MB
        $savings = [math]::Round((($originalSize - $newSize) / $originalSize) * 100, 1)
        Write-Host "  ✓ Done! $([math]::Round($originalSize, 2)) MB -> $([math]::Round($newSize, 2)) MB (Saved $savings%)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Failed!" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "Conversion complete!" -ForegroundColor Green
pause

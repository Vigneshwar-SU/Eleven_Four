Write-Host "MP4 to WebM Converter" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""

# Try to find FFmpeg
$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue

if (-not $ffmpeg) {
    Write-Host "FFmpeg needs a shell restart. Please:" -ForegroundColor Yellow
    Write-Host "1. Close this PowerShell window" -ForegroundColor Yellow
    Write-Host "2. Open a NEW PowerShell window" -ForegroundColor Yellow
    Write-Host "3. Run this script again" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or run these commands manually in the images folder:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host 'cd images' -ForegroundColor White
    Write-Host 'foreach ($f in Get-ChildItem *.mp4) { ffmpeg -i $f.Name -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus "$($f.BaseName).webm" }' -ForegroundColor White
    Write-Host ""
    pause
    exit
}

Write-Host "FFmpeg found!" -ForegroundColor Green
Write-Host ""

cd images
$mp4Files = Get-ChildItem *.mp4

Write-Host "Found $($mp4Files.Count) videos to convert" -ForegroundColor Cyan
Write-Host ""

$i = 0
foreach ($file in $mp4Files) {
    $i++
    $webm = "$($file.BaseName).webm"
    
    if (Test-Path $webm) {
        Write-Host "[$i] Skip: $($file.Name) - already exists" -ForegroundColor Yellow
    } else {
        Write-Host "[$i] Converting: $($file.Name)" -ForegroundColor Cyan
        ffmpeg -i $file.Name -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus $webm -y 2>&1 | Out-Null
        if (Test-Path $webm) {
            Write-Host "    Done!" -ForegroundColor Green
        }
    }
}

cd ..
Write-Host ""
Write-Host "All done!" -ForegroundColor Green
pause

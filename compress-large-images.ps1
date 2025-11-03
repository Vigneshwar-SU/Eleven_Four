# Aggressive Image Compression for Large Files
# Targets images over 100KB with more aggressive compression

Write-Host "`n=== AGGRESSIVE IMAGE COMPRESSION ===" -ForegroundColor Cyan
Write-Host "Compressing images larger than 100KB with quality 65" -ForegroundColor Yellow
Write-Host ""

Add-Type -AssemblyName System.Drawing

$imagesPath = ".\images"
$minSizeKB = 100
$quality = 65  # More aggressive (65 instead of 75)

function Compress-Image {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Quality = 65
    )
    
    try {
        $img = [System.Drawing.Image]::FromFile($InputPath)
        
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | 
            Where-Object { $_.MimeType -eq 'image/jpeg' }
        
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
            [System.Drawing.Imaging.Encoder]::Quality, 
            $Quality
        )
        
        $img.Save($OutputPath, $jpegCodec, $encoderParams)
        $img.Dispose()
        
        return $true
    }
    catch {
        Write-Host "Error: $_" -ForegroundColor Red
        if ($img) { $img.Dispose() }
        return $false
    }
}

# Get large JPG files
$largeFiles = Get-ChildItem -Path $imagesPath -Filter "*.jpg" | 
    Where-Object { $_.Length -gt ($minSizeKB * 1KB) }

Write-Host "Found $($largeFiles.Count) large images to compress" -ForegroundColor Green
Write-Host ""

$totalOriginal = 0
$totalCompressed = 0
$successCount = 0

foreach ($file in $largeFiles) {
    $originalSize = $file.Length
    $totalOriginal += $originalSize
    
    $tempPath = Join-Path $imagesPath "temp_$($file.Name)"
    
    $originalKB = [math]::Round($originalSize / 1KB, 2)
    Write-Host "Compressing $($file.Name) ($originalKB KB)..." -NoNewline
    
    $success = Compress-Image -InputPath $file.FullName -OutputPath $tempPath -Quality $quality
    
    if ($success -and (Test-Path $tempPath)) {
        $compressedSize = (Get-Item $tempPath).Length
        
        if ($compressedSize -lt $originalSize) {
            Move-Item -Path $tempPath -Destination $file.FullName -Force
            
            $totalCompressed += $compressedSize
            $savedKB = [math]::Round(($originalSize - $compressedSize) / 1KB, 2)
            $savedPercent = [math]::Round((($originalSize - $compressedSize) / $originalSize) * 100, 1)
            $newKB = [math]::Round($compressedSize / 1KB, 2)
            
            Write-Host " OK - Now $newKB KB (saved $savedKB KB, $savedPercent percent)" -ForegroundColor Green
            $successCount++
        }
        else {
            Remove-Item $tempPath -Force
            $totalCompressed += $originalSize
            Write-Host " SKIP - Already optimized" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host " FAIL" -ForegroundColor Red
        if (Test-Path $tempPath) {
            Remove-Item $tempPath -Force
        }
        $totalCompressed += $originalSize
    }
}

Write-Host ""
Write-Host "=== COMPRESSION SUMMARY ===" -ForegroundColor Cyan
Write-Host "Large images processed: $($largeFiles.Count)" -ForegroundColor White
Write-Host "Successfully compressed: $successCount" -ForegroundColor Green
Write-Host ""
Write-Host "Original size: $([math]::Round($totalOriginal / 1KB, 2)) KB" -ForegroundColor White
Write-Host "Compressed size: $([math]::Round($totalCompressed / 1KB, 2)) KB" -ForegroundColor White

if ($totalCompressed -lt $totalOriginal) {
    $totalSaved = $totalOriginal - $totalCompressed
    $totalSavedPercent = [math]::Round(($totalSaved / $totalOriginal) * 100, 1)
    Write-Host "Total saved: $([math]::Round($totalSaved / 1KB, 2)) KB ($totalSavedPercent percent)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Compression complete!" -ForegroundColor Cyan

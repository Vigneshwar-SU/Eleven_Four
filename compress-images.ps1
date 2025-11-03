# Image Compression Script for Birthday Site
# Compresses JPG images to reduce file size while maintaining quality

Write-Host "`n=== IMAGE COMPRESSION SCRIPT ===" -ForegroundColor Cyan
Write-Host "This will compress all JPG images in the images folder" -ForegroundColor Yellow
Write-Host ""

# Add System.Drawing assembly
Add-Type -AssemblyName System.Drawing

$imagesPath = ".\images"
$originalSizes = @{}
$compressedSizes = @{}

# Function to compress image
function Compress-Image {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Quality = 75
    )
    
    try {
        # Load the image
        $img = [System.Drawing.Image]::FromFile($InputPath)
        
        # Get JPEG codec
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | 
            Where-Object { $_.MimeType -eq 'image/jpeg' }
        
        # Set quality
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
            [System.Drawing.Imaging.Encoder]::Quality, 
            $Quality
        )
        
        # Save compressed image
        $img.Save($OutputPath, $jpegCodec, $encoderParams)
        $img.Dispose()
        
        return $true
    }
    catch {
        Write-Host "Error compressing $InputPath : $_" -ForegroundColor Red
        if ($img) { $img.Dispose() }
        return $false
    }
}

# Get all JPG files
$jpgFiles = Get-ChildItem -Path $imagesPath -Filter "*.jpg"

Write-Host "Found $($jpgFiles.Count) images to compress" -ForegroundColor Green
Write-Host ""

$totalOriginal = 0
$totalCompressed = 0
$successCount = 0

foreach ($file in $jpgFiles) {
    $originalSize = $file.Length
    $originalSizes[$file.Name] = $originalSize
    $totalOriginal += $originalSize
    
    # Create temporary output path
    $tempPath = Join-Path $imagesPath "temp_$($file.Name)"
    
    Write-Host "Compressing $($file.Name)..." -NoNewline
    
    # Compress the image (75% quality - good balance)
    $success = Compress-Image -InputPath $file.FullName -OutputPath $tempPath -Quality 75
    
    if ($success -and (Test-Path $tempPath)) {
        $compressedSize = (Get-Item $tempPath).Length
        
        # Only replace if compressed version is smaller
        if ($compressedSize -lt $originalSize) {
            # Backup original (optional)
            # Copy-Item $file.FullName "$($file.FullName).backup"
            
            # Replace with compressed version
            Move-Item -Path $tempPath -Destination $file.FullName -Force
            
            $compressedSizes[$file.Name] = $compressedSize
            $totalCompressed += $compressedSize
            $savedPercent = [math]::Round((($originalSize - $compressedSize) / $originalSize) * 100, 1)
            $savedKB = [math]::Round(($originalSize - $compressedSize) / 1KB, 2)
            
            Write-Host " OK - Saved $savedKB KB ($savedPercent percent)" -ForegroundColor Green
            $successCount++
        }
        else {
            # Compressed version is larger, keep original
            Remove-Item $tempPath -Force
            $compressedSizes[$file.Name] = $originalSize
            $totalCompressed += $originalSize
            Write-Host " SKIP - Kept original (already optimized)" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host " FAIL - Failed" -ForegroundColor Red
        if (Test-Path $tempPath) {
            Remove-Item $tempPath -Force
        }
        $compressedSizes[$file.Name] = $originalSize
        $totalCompressed += $originalSize
    }
}

# Summary
Write-Host ""
Write-Host "=== COMPRESSION SUMMARY ===" -ForegroundColor Cyan
Write-Host "Images processed: $($jpgFiles.Count)" -ForegroundColor White
Write-Host "Successfully compressed: $successCount" -ForegroundColor Green
Write-Host ""
Write-Host "Total original size: $([math]::Round($totalOriginal / 1KB, 2)) KB" -ForegroundColor White
Write-Host "Total compressed size: $([math]::Round($totalCompressed / 1KB, 2)) KB" -ForegroundColor White

if ($totalCompressed -lt $totalOriginal) {
    $totalSaved = $totalOriginal - $totalCompressed
    $totalSavedPercent = [math]::Round(($totalSaved / $totalOriginal) * 100, 1)
    Write-Host "Total saved: $([math]::Round($totalSaved / 1KB, 2)) KB ($totalSavedPercent percent)" -ForegroundColor Green
}
else {
    Write-Host "No space saved (images were already optimized)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Compression complete!" -ForegroundColor Cyan

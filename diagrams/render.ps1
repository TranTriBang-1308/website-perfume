# Render toàn bộ .puml -> PNG + SVG bằng plantuml.jar
# Yêu cầu: Java 8+. Script tự tải plantuml.jar nếu chưa có.

$ErrorActionPreference = "Stop"
$Here = Split-Path -Parent $MyInvocation.MyCommand.Path
$Jar = Join-Path $Here "plantuml.jar"
$ExportDir = Join-Path $Here "exports"

if (-not (Test-Path $Jar)) {
  Write-Host "Tai plantuml.jar..."
  $Url = "https://github.com/plantuml/plantuml/releases/download/v1.2024.7/plantuml-1.2024.7.jar"
  Invoke-WebRequest -Uri $Url -OutFile $Jar
}

if (-not (Test-Path $ExportDir)) {
  New-Item -ItemType Directory -Path $ExportDir | Out-Null
}

Write-Host "Render PNG..."
java -jar $Jar -tpng -o $ExportDir (Join-Path $Here "*.puml")

Write-Host "Render SVG..."
java -jar $Jar -tsvg -o $ExportDir (Join-Path $Here "*.puml")

Write-Host ""
Write-Host "Xong. Anh da luu trong: $ExportDir"
Get-ChildItem $ExportDir | Select-Object Name, Length | Format-Table

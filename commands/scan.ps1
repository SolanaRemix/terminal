# Scan Command
# Runs comprehensive repository scan

Write-Host "Running comprehensive repository scan..." -ForegroundColor Cyan

# Code quality check
Write-Host "`n=== Code Quality Analysis ===" -ForegroundColor Yellow
if (Get-Command npm -ErrorAction SilentlyContinue) {
    if (Test-Path "package.json") {
        Write-Host "✓ package.json found" -ForegroundColor Green
    }
    if (Test-Path "tsconfig.json") {
        Write-Host "✓ tsconfig.json found" -ForegroundColor Green
    }
}

# Security check
Write-Host "`n=== Security Vulnerability Detection ===" -ForegroundColor Yellow
if (Get-Command npm -ErrorAction SilentlyContinue) {
    npm audit --json | ConvertFrom-Json | Select-Object -ExpandProperty metadata
}

# Dependency audit
Write-Host "`n=== Dependency Audit ===" -ForegroundColor Yellow
if (Get-Command npm -ErrorAction SilentlyContinue) {
    $outdated = npm outdated --json 2>&1 | ConvertFrom-Json
    if ($outdated) {
        Write-Host "⚠️  Outdated packages detected" -ForegroundColor Yellow
    } else {
        Write-Host "✓ All packages up to date" -ForegroundColor Green
    }
}

# Configuration validation
Write-Host "`n=== Configuration Validation ===" -ForegroundColor Yellow
$requiredFiles = @("README.md", "package.json", "LICENSE", ".gitignore")
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file (missing)" -ForegroundColor Red
    }
}

Write-Host "`n✓ Scan complete" -ForegroundColor Green

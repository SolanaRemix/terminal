# Fix Command
# Applies automated fixes to common issues

Write-Host "Applying automated fixes..." -ForegroundColor Cyan

# Fix npm dependencies
Write-Host "`n=== Fixing Dependencies ===" -ForegroundColor Yellow
if (Get-Command npm -ErrorAction SilentlyContinue) {
    npm audit fix
}

# Fix file permissions (if on Unix-like system)
if ($IsLinux -or $IsMacOS) {
    Write-Host "`n=== Fixing File Permissions ===" -ForegroundColor Yellow
    Get-ChildItem -Recurse -File -Filter "*.sh" | ForEach-Object {
        chmod +x $_.FullName
        Write-Host "✓ Fixed permissions: $($_.Name)" -ForegroundColor Green
    }
}

# Format code (if prettier is available)
Write-Host "`n=== Formatting Code ===" -ForegroundColor Yellow
if (Get-Command npm -ErrorAction SilentlyContinue) {
    if (Test-Path "node_modules/.bin/prettier") {
        npx prettier --write "**/*.{ts,tsx,js,jsx,json,md}"
    }
}

Write-Host "`n✓ Fixes applied" -ForegroundColor Green

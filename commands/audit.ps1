# Audit Command
# Runs comprehensive security and code audit

Write-Host "Running comprehensive security and code audit..." -ForegroundColor Cyan

# Check for npm audit
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "`n=== NPM Audit ===" -ForegroundColor Yellow
    npm audit
}

# Check for outdated packages
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "`n=== Outdated Packages ===" -ForegroundColor Yellow
    npm outdated
}

# Check for security in git history
Write-Host "`n=== Git Security Scan ===" -ForegroundColor Yellow
$secretPatterns = @("password", "api_key", "secret", "token", "private_key")
foreach ($pattern in $secretPatterns) {
    $results = git log --all --full-history -S $pattern 2>&1
    if ($results) {
        Write-Host "⚠️  Found potential secret pattern: $pattern" -ForegroundColor Red
    }
}

Write-Host "`n✓ Audit complete" -ForegroundColor Green

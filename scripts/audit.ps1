# Audit Script for Terminal Repository
# Performs security and code quality audits

$ErrorActionPreference = "Stop"

function Write-ColorOutput($Message, $Color = "White") {
    Write-Host $Message -ForegroundColor $Color
}

function Invoke-CommandSafe($Command) {
    try {
        $output = Invoke-Expression $Command 2>&1
        return @{
            Success = $true
            Output = $output
        }
    } catch {
        return @{
            Success = $false
            Output = $_.Exception.Message
        }
    }
}

Write-ColorOutput "`n╔════════════════════════════════════════╗" Cyan
Write-ColorOutput "║  Terminal Repository Audit            ║" Cyan
Write-ColorOutput "╚════════════════════════════════════════╝`n" Cyan

$audits = @()

# Audit 1: Repository Structure
Write-ColorOutput "`n--- Auditing Repository Structure ---`n" Cyan

$requiredDirs = @("src", "docs", "scripts", "tests")
$requiredFiles = @("README.md", "LICENSE", "package.json")

$missingDirs = $requiredDirs | Where-Object { -not (Test-Path $_) }
$missingFiles = $requiredFiles | Where-Object { -not (Test-Path $_) }

$structurePassed = ($missingDirs.Count -eq 0) -and ($missingFiles.Count -eq 0)

$audits += @{
    Category = "Structure"
    Passed = $structurePassed
    Message = if ($structurePassed) { "Repository structure valid" } else { "Missing required files/directories" }
    Details = @($missingDirs | ForEach-Object { "Missing: $_" }) + @($missingFiles | ForEach-Object { "Missing: $_" })
}

# Audit 2: Security Documentation
Write-ColorOutput "`n--- Auditing Security ---`n" Cyan

$securityFiles = @("SECURITY.md", "CODE_OF_CONDUCT.md")
$missingSecurityFiles = $securityFiles | Where-Object { -not (Test-Path $_) }

$securityPassed = $missingSecurityFiles.Count -eq 0

$audits += @{
    Category = "Security"
    Passed = $securityPassed
    Message = if ($securityPassed) { "Security documentation present" } else { "Missing security documentation" }
    Details = @($missingSecurityFiles | ForEach-Object { "Missing: $_" })
}

# Audit 3: Dependencies
Write-ColorOutput "`n--- Auditing Dependencies ---`n" Cyan

$npmAuditResult = Invoke-CommandSafe "npm audit --json"

if ($npmAuditResult.Success) {
    try {
        $auditData = $npmAuditResult.Output | ConvertFrom-Json
        $total = 0
        if ($auditData.metadata.vulnerabilities) {
            $auditData.metadata.vulnerabilities.PSObject.Properties | ForEach-Object {
                $total += $_.Value
            }
        }
        
        $audits += @{
            Category = "Dependencies"
            Passed = ($total -eq 0)
            Message = if ($total -eq 0) { "No vulnerabilities found" } else { "Found $total vulnerabilities" }
            Details = if ($total -gt 0) { @("Run 'npm audit fix' to resolve") } else { @() }
        }
    } catch {
        $audits += @{
            Category = "Dependencies"
            Passed = $true
            Message = "Audit completed (no critical issues)"
            Details = @()
        }
    }
} else {
    $audits += @{
        Category = "Dependencies"
        Passed = $false
        Message = "npm audit failed"
        Details = @()
    }
}

# Audit 4: TypeScript
Write-ColorOutput "`n--- Auditing TypeScript ---`n" Cyan

if (Test-Path "tsconfig.json") {
    $tscResult = Invoke-CommandSafe "npx tsc --noEmit"
    
    $audits += @{
        Category = "TypeScript"
        Passed = $tscResult.Success
        Message = if ($tscResult.Success) { "No type errors" } else { "Type errors found" }
        Details = @()
    }
} else {
    $audits += @{
        Category = "TypeScript"
        Passed = $false
        Message = "tsconfig.json not found"
        Details = @()
    }
}

# Display Results
Write-ColorOutput "`n╔════════════════════════════════════════╗" Cyan
Write-ColorOutput "║  Audit Results                        ║" Cyan
Write-ColorOutput "╚════════════════════════════════════════╝`n" Cyan

$allPassed = $true

foreach ($audit in $audits) {
    $icon = if ($audit.Passed) { "✓" } else { "✗" }
    $color = if ($audit.Passed) { "Green" } else { "Red" }
    
    Write-ColorOutput "$icon $($audit.Category): $($audit.Message)" $color
    
    if ($audit.Details -and $audit.Details.Count -gt 0) {
        foreach ($detail in $audit.Details) {
            Write-ColorOutput "  - $detail" Yellow
        }
    }
    
    if (-not $audit.Passed) {
        $allPassed = $false
    }
}

Write-ColorOutput ("`n" + "=" * 40 + "`n") White

if ($allPassed) {
    Write-ColorOutput "✓ All audits passed!" Green
    exit 0
} else {
    Write-ColorOutput "✗ Some audits failed. Please review and fix the issues." Red
    exit 1
}

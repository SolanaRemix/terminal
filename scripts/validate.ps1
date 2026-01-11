# Validate Script for Terminal Repository
# Validates repository structure and configuration

$ErrorActionPreference = "Stop"

function Write-ColorOutput($Message, $Color = "White") {
    Write-Host $Message -ForegroundColor $Color
}

Write-ColorOutput "`n╔════════════════════════════════════════╗" Cyan
Write-ColorOutput "║  Terminal Repository Validation       ║" Cyan
Write-ColorOutput "╚════════════════════════════════════════╝`n" Cyan

$totalItems = 0
$passedItems = 0

# Validate Directories
Write-ColorOutput "`n=== Directories ===`n" Cyan

$requiredDirs = @(
    "cli",
    "commands",
    "scripts",
    "tools",
    "docs",
    "src",
    "src/commands",
    "tests",
    "prompts",
    "workflows",
    ".github/workflows",
    ".github/copilot"
)

foreach ($dir in $requiredDirs) {
    $totalItems++
    $exists = Test-Path $dir
    $icon = if ($exists) { "✓" } else { "✗" }
    $color = if ($exists) { "Green" } else { "Red" }
    
    Write-ColorOutput "$icon $dir" $color
    
    if ($exists) { $passedItems++ }
}

# Validate Required Files
Write-ColorOutput "`n=== Required Files ===`n" Cyan

$requiredFiles = @(
    "README.md",
    "LICENSE",
    "SECURITY.md",
    "CONTRIBUTING.md",
    "CODE_OF_CONDUCT.md",
    "package.json",
    "tsconfig.json",
    ".editorconfig",
    ".prettierrc",
    ".eslintrc.json",
    "commitlint.config.js"
)

foreach ($file in $requiredFiles) {
    $totalItems++
    $exists = Test-Path $file
    $icon = if ($exists) { "✓" } else { "✗" }
    $color = if ($exists) { "Green" } else { "Red" }
    
    Write-ColorOutput "$icon $file" $color
    
    if ($exists) { $passedItems++ }
}

# Validate GitHub Workflows
Write-ColorOutput "`n=== GitHub Workflows ===`n" Cyan

$requiredWorkflows = @(
    ".github/workflows/ci.yml",
    ".github/workflows/lint.yml",
    ".github/workflows/codeql.yml",
    ".github/workflows/dependency-review.yml",
    ".github/workflows/release.yml",
    ".github/workflows/labeler.yml"
)

foreach ($workflow in $requiredWorkflows) {
    $totalItems++
    $exists = Test-Path $workflow
    $icon = if ($exists) { "✓" } else { "✗" }
    $color = if ($exists) { "Green" } else { "Red" }
    
    $name = Split-Path $workflow -Leaf
    Write-ColorOutput "$icon $name" $color
    
    if ($exists) { $passedItems++ }
}

# Validate Configuration
Write-ColorOutput "`n=== Configuration ===`n" Cyan

# Validate package.json
if (Test-Path "package.json") {
    $totalItems++
    try {
        $pkg = Get-Content "package.json" -Raw | ConvertFrom-Json
        Write-ColorOutput "✓ package.json (valid JSON)" Green
        $passedItems++
        
        $totalItems++
        if ($pkg.scripts -and $pkg.scripts.PSObject.Properties.Count -gt 0) {
            Write-ColorOutput "✓ package.json has scripts" Green
            $passedItems++
        } else {
            Write-ColorOutput "✗ package.json has no scripts" Red
        }
    } catch {
        Write-ColorOutput "✗ package.json (Invalid JSON)" Red
    }
}

# Validate tsconfig.json
if (Test-Path "tsconfig.json") {
    $totalItems++
    try {
        Get-Content "tsconfig.json" -Raw | ConvertFrom-Json | Out-Null
        Write-ColorOutput "✓ tsconfig.json (valid JSON)" Green
        $passedItems++
    } catch {
        Write-ColorOutput "✗ tsconfig.json (Invalid JSON)" Red
    }
}

# Validate Terminal Commands
Write-ColorOutput "`n=== Terminal Commands ===`n" Cyan

$requiredCommands = @(
    "help.ts",
    "status.ts",
    "scan.ts",
    "merge.ts",
    "tag.ts",
    "audit.ts",
    "fix.ts",
    "deploy.ts",
    "cyberai.ts",
    "smartcontractaudit.ts",
    "smartbrain.ts",
    "gitantivirus.ts",
    "nodeaudit.ts",
    "conflictsresolver.ts"
)

foreach ($cmd in $requiredCommands) {
    $totalItems++
    $path = Join-Path "src/commands" $cmd
    $exists = Test-Path $path
    $icon = if ($exists) { "✓" } else { "✗" }
    $color = if ($exists) { "Green" } else { "Red" }
    
    Write-ColorOutput "$icon $cmd" $color
    
    if ($exists) { $passedItems++ }
}

# Display Results
Write-ColorOutput ("`n" + "=" * 40 + "`n") White
Write-ColorOutput "Validation Results: $passedItems/$totalItems passed" Cyan

if ($passedItems -eq $totalItems) {
    Write-ColorOutput "`n✓ All validations passed!" Green
    exit 0
} else {
    $failed = $totalItems - $passedItems
    Write-ColorOutput "`n✗ $failed validation(s) failed. Please review and fix the issues." Red
    exit 1
}

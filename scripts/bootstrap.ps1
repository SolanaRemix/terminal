# Bootstrap Script for Terminal Repository
# Initializes and validates repository structure

param(
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

function Write-ColorOutput($Message, $Color = "White") {
    Write-Host $Message -ForegroundColor $Color
}

$RequiredDirs = @(
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
    ".github",
    ".github/workflows",
    ".github/copilot"
)

$RequiredFiles = @(
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

Write-ColorOutput "`n╔════════════════════════════════════════╗" Cyan
Write-ColorOutput "║  Terminal Repository Bootstrap        ║" Cyan
Write-ColorOutput "╚════════════════════════════════════════╝`n" Cyan

# Step 1: Create missing directories
Write-ColorOutput "`n=== Creating Missing Directories ===`n" Cyan

foreach ($dir in $RequiredDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-ColorOutput "✓ Created directory: $dir" Green
    } else {
        Write-ColorOutput "✓ $dir (exists)" Green
    }
}

# Step 2: Validate structure
Write-ColorOutput "`n=== Validating Directory Structure ===`n" Cyan

$missingDirs = 0
foreach ($dir in $RequiredDirs) {
    if (Test-Path $dir) {
        Write-ColorOutput "✓ $dir" Green
    } else {
        Write-ColorOutput "✗ $dir (missing)" Red
        $missingDirs++
    }
}

Write-ColorOutput "`n=== Validating Required Files ===`n" Cyan

$missingFiles = 0
foreach ($file in $RequiredFiles) {
    if (Test-Path $file) {
        Write-ColorOutput "✓ $file" Green
    } else {
        Write-ColorOutput "✗ $file (missing)" Yellow
        $missingFiles++
    }
}

if ($missingDirs -gt 0 -or $missingFiles -gt 0) {
    Write-ColorOutput "`n⚠️  Missing $missingDirs directories and $missingFiles files" Yellow
} else {
    Write-ColorOutput "`n✓ All required structure validated" Green
}

# Step 3: Install dependencies
if (Test-Path "package.json") {
    Write-ColorOutput "`n=== Installing Dependencies ===`n" Cyan
    
    try {
        npm install
        Write-ColorOutput "✓ Dependencies installed" Green
    } catch {
        Write-ColorOutput "✗ Failed to install dependencies" Red
        throw
    }
}

# Step 4: Build project
if (-not $SkipBuild -and (Test-Path "tsconfig.json")) {
    Write-ColorOutput "`n=== Building Project ===`n" Cyan
    
    try {
        npm run build
        Write-ColorOutput "✓ Project built successfully" Green
    } catch {
        Write-ColorOutput "✗ Build failed" Red
        throw
    }
}

Write-ColorOutput "`n╔════════════════════════════════════════╗" Green
Write-ColorOutput "║  Bootstrap Complete!                  ║" Green
Write-ColorOutput "╚════════════════════════════════════════╝`n" Green

Write-ColorOutput "`nNext steps:" Cyan
Write-ColorOutput "1. Configure environment variables (GITHUB_TOKEN, WEBHOOK_SECRET)" White
Write-ColorOutput "2. Review generated files and configurations" White
Write-ColorOutput "3. Run 'npm run dev' to start the server" White
Write-ColorOutput "4. Set up GitHub App webhook`n" White

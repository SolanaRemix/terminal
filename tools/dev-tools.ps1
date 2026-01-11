#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Development tools for Terminal repository

.DESCRIPTION
    Provides various development utilities for the Terminal project.

.PARAMETER Action
    The action to perform: setup, test, lint, format, clean

.EXAMPLE
    ./dev-tools.ps1 setup
    ./dev-tools.ps1 test
    ./dev-tools.ps1 lint
#>

param(
    [Parameter(Position = 0)]
    [ValidateSet("setup", "test", "lint", "format", "clean")]
    [string]$Action = "setup"
)

function Invoke-Setup {
    Write-Host "Setting up development environment..." -ForegroundColor Cyan
    
    # Install dependencies
    if (Test-Path "package.json") {
        Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
        npm install
    }
    
    # Build TypeScript
    Write-Host "Building TypeScript..." -ForegroundColor Yellow
    npm run build
    
    Write-Host "✓ Setup complete!" -ForegroundColor Green
}

function Invoke-Test {
    Write-Host "Running tests..." -ForegroundColor Cyan
    
    # Run npm tests if available
    if (Test-Path "package.json") {
        npm test
    } else {
        Write-Host "No tests configured" -ForegroundColor Yellow
    }
}

function Invoke-Lint {
    Write-Host "Running linters..." -ForegroundColor Cyan
    
    # ESLint
    if (Test-Path "node_modules/.bin/eslint") {
        Write-Host "Running ESLint..." -ForegroundColor Yellow
        npx eslint . --ext .ts,.tsx,.js,.jsx
    }
    
    # Prettier
    if (Test-Path "node_modules/.bin/prettier") {
        Write-Host "Checking code formatting..." -ForegroundColor Yellow
        npx prettier --check "**/*.{ts,tsx,js,jsx,json,md}"
    }
    
    # PSScriptAnalyzer for PowerShell
    if (Get-Module -ListAvailable -Name PSScriptAnalyzer) {
        Write-Host "Running PSScriptAnalyzer..." -ForegroundColor Yellow
        Invoke-ScriptAnalyzer -Path . -Recurse
    }
}

function Invoke-Format {
    Write-Host "Formatting code..." -ForegroundColor Cyan
    
    if (Test-Path "node_modules/.bin/prettier") {
        npx prettier --write "**/*.{ts,tsx,js,jsx,json,md}"
        Write-Host "✓ Code formatted!" -ForegroundColor Green
    }
}

function Invoke-Clean {
    Write-Host "Cleaning build artifacts..." -ForegroundColor Cyan
    
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force "dist"
        Write-Host "✓ Removed dist/" -ForegroundColor Green
    }
    
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force "node_modules"
        Write-Host "✓ Removed node_modules/" -ForegroundColor Green
    }
    
    Write-Host "✓ Clean complete!" -ForegroundColor Green
}

switch ($Action) {
    "setup" { Invoke-Setup }
    "test" { Invoke-Test }
    "lint" { Invoke-Lint }
    "format" { Invoke-Format }
    "clean" { Invoke-Clean }
}

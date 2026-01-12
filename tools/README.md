# Development and Operational Tools

This directory contains development and operational tools for the Terminal repository.

## Available Tools

### Development Server Monitor (`dev-server.ts`)
Monitors the Terminal server and restarts on file changes during development.

```bash
npx ts-node tools/dev-server.ts
```

### Development Tools (`dev-tools.ps1`)
PowerShell-based development utilities.

```powershell
# Setup development environment
./tools/dev-tools.ps1 setup

# Run tests
./tools/dev-tools.ps1 test

# Run linters
./tools/dev-tools.ps1 lint

# Format code
./tools/dev-tools.ps1 format

# Clean build artifacts
./tools/dev-tools.ps1 clean
```

## Usage

These tools help with:
- Local development workflow
- Code quality checks
- Automated testing
- Build management

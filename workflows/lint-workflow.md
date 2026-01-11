# Workflow: Code Quality

name: Lint
trigger: push, pull_request
branches: [main, develop]

## Jobs

### Lint
- Checkout code
- Setup Node.js (20.x)
- Install dependencies
- Run ESLint
- Run Prettier check
- Setup PowerShell
- Run PSScriptAnalyzer

### Permissions
- contents: read

## Linting Tools

### TypeScript/JavaScript
- ESLint with TypeScript parser
- Prettier for code formatting

### PowerShell
- PSScriptAnalyzer with PSGallery settings

## Configuration Files
- `.eslintrc.json`
- `.prettierrc`
- `.editorconfig`

## Status
✅ Implemented in `.github/workflows/lint.yml`

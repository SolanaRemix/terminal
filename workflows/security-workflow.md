# Workflow: Security Scanning

name: CodeQL
trigger: push, pull_request, schedule
branches: [main, develop]

## Jobs

### Analyze
- Checkout code
- Initialize CodeQL
- Autobuild
- Perform CodeQL analysis

### Permissions
- actions: read
- contents: read
- security-events: write

## Languages
- JavaScript
- TypeScript

## Queries
- security-and-quality

## Schedule
- Weekly on Monday at midnight (cron: '0 0 * * 1')

## Configuration
Matrix strategy:
- language: [javascript, typescript]

## Status
✅ Implemented in `.github/workflows/codeql.yml`

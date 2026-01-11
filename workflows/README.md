# Workflow Definitions

This directory contains workflow definitions and documentation for Terminal automation.

## Available Workflows

### Continuous Integration (`ci-workflow.md`)
Build and test pipeline:
- Multi-version Node.js testing (18.x, 20.x)
- TypeScript compilation
- Test execution
- Artifact generation

### Code Quality (`lint-workflow.md`)
Code quality checks:
- ESLint for TypeScript/JavaScript
- Prettier formatting validation
- PSScriptAnalyzer for PowerShell

### Security Scanning (`security-workflow.md`)
Security analysis:
- CodeQL for JavaScript/TypeScript
- Automated vulnerability detection
- Weekly scheduled scans

### Release Management (`release-workflow.md`)
Automated releases:
- Tag-based triggers
- Changelog generation
- Artifact packaging
- GitHub release creation

## Implementation

All workflows are implemented in `.github/workflows/`:
- `ci.yml` - Continuous Integration
- `lint.yml` - Code Quality
- `codeql.yml` - Security Scanning
- `dependency-review.yml` - Dependency Security
- `release.yml` - Release Management
- `labeler.yml` - PR Auto-labeling

## Workflow Status

✅ All workflows implemented and validated
✅ Proper permissions configured
✅ Matrix strategies for multi-version testing
✅ Artifact management configured

## Adding New Workflows

1. Document the workflow in this directory
2. Implement in `.github/workflows/`
3. Test with pull request
4. Update this README

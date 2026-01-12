# Workflow: Release Management

name: Release
trigger: push (tags: v*)

## Jobs

### Release
- Checkout code with full history
- Setup Node.js (20.x)
- Install dependencies
- Build project
- Extract version from tag
- Generate changelog
- Create GitHub release
- Attach build artifacts

### Permissions
- contents: write

## Release Artifacts
- dist/** (all build outputs)

## Changelog Generation
- Automatic from git log
- Format: "- %s (%h)"
- Range: Previous tag to current tag

## Configuration
- draft: false
- prerelease: false

## Status
✅ Implemented in `.github/workflows/release.yml`

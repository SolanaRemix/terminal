# Workflow: Continuous Integration

name: CI
trigger: push, pull_request
branches: [main, develop]

## Jobs

### Build
- Checkout code
- Setup Node.js (18.x, 20.x)
- Install dependencies
- Build TypeScript
- Run tests
- Upload artifacts

### Permissions
- contents: read

## Configuration

Matrix strategy:
- node-version: [18.x, 20.x]

Artifacts:
- name: build-artifacts
- path: dist/
- retention: 7 days

## Status
✅ Implemented in `.github/workflows/ci.yml`

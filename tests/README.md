# Tests

This directory contains test files and test utilities for the Terminal repository.

## Test Structure

### Unit Tests
- `commands.test.ts` - Tests for terminal command handlers
- `test-utils.ts` - Shared test utilities and mocks

## Running Tests

```bash
# Install test dependencies (Jest)
npm install --save-dev jest @types/jest @jest/globals ts-jest

# Run tests
npm test
```

## Test Coverage

Tests cover:
- Command handler functionality
- GitHub API integration
- Error handling
- Response formatting

## Writing Tests

Use the provided test utilities for consistent mocking:

```typescript
import { createMockContext, createMockOctokit } from "./test-utils";

const ctx = createMockContext();
const octokit = createMockOctokit();
```

## Future Enhancements

- Integration tests with real GitHub API
- E2E tests for full workflow
- Performance benchmarks
- Load testing for webhook handling

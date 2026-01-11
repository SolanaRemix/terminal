# Contributing to Terminal

Thank you for your interest in contributing to Terminal! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/terminal.git`
3. Add the upstream repository: `git remote add upstream https://github.com/SolanaRemix/terminal.git`
4. Create a new branch: `git checkout -b feature/your-feature-name`

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PowerShell (for PowerShell scripts)
- TypeScript

### Setup

```bash
npm install
npm run build
```

## Development Workflow

1. Make your changes in your feature branch
2. Write or update tests as needed
3. Run tests: `npm test` (if tests are available)
4. Run linting: `npm run lint` (if configured)
5. Build the project: `npm run build`
6. Commit your changes with a descriptive commit message

## Submitting Changes

1. Push your changes to your fork
2. Submit a pull request to the main repository
3. Ensure CI checks pass
4. Wait for review from maintainers

### Pull Request Guidelines

- Use a clear and descriptive title
- Include a detailed description of your changes
- Reference any related issues
- Ensure all tests pass
- Follow the existing code style
- Update documentation as needed

### Commit Message Format

We follow conventional commits format:

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Maintenance tasks

Example:
```
feat(commands): add SmartContractAudit command

Add new command for auditing smart contracts with integrated
security scanning capabilities.

Closes #123
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Follow existing code patterns
- Use meaningful variable and function names
- Add type annotations where helpful
- Avoid `any` type when possible

### PowerShell

- Follow PowerShell best practices
- Use approved verbs for function names
- Include comment-based help
- Use proper error handling

### General

- Keep functions small and focused
- Write self-documenting code
- Add comments for complex logic
- Follow DRY (Don't Repeat Yourself) principle

## Testing

- Write tests for new features
- Ensure existing tests pass
- Aim for good test coverage
- Test edge cases

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for public APIs
- Update relevant documentation in `/docs`
- Include examples where appropriate

## Questions?

If you have questions, please open an issue with the `question` label.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE file).

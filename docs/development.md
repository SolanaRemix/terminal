# Development Guide

Complete developer guide for contributing to CyberAi Terminal including setup, development workflow, testing, and best practices.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment Setup](#development-environment-setup)
- [Building and Running](#building-and-running)
- [Code Structure](#code-structure)
- [Development Workflow](#development-workflow)
- [Adding New Commands](#adding-new-commands)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Debugging](#debugging)
- [Contributing](#contributing)
- [Release Process](#release-process)

## Getting Started

### Prerequisites

**Required:**
- Node.js v18.0.0 or higher
- npm v9.0.0 or higher
- Git v2.30.0 or higher
- GitHub account with API access

**Recommended:**
- Visual Studio Code with TypeScript extension
- GitHub CLI (`gh`)
- Docker (for containerized development)
- PowerShell 7+ (for PowerShell scripts)

**Optional:**
- Redis (for caching features)
- PostgreSQL (for future database features)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/SolanaRemix/terminal.git
cd terminal

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your GitHub token

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Verify Installation

```bash
# Check Node.js version
node --version
# Should output: v18.0.0 or higher

# Check npm version
npm --version
# Should output: v9.0.0 or higher

# Check TypeScript installation
npx tsc --version
# Should output: Version 5.9.3 or higher

# Verify build works
npm run build
# Should complete without errors

# Run help command
npm run dev &
# Wait for server to start
curl -X POST http://localhost:3000/webhooks
```

## Development Environment Setup

### Initial Setup

**1. Fork and Clone**

```bash
# Fork repository on GitHub first
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/terminal.git
cd terminal

# Add upstream remote
git remote add upstream https://github.com/SolanaRemix/terminal.git

# Verify remotes
git remote -v
```

**2. Install Dependencies**

```bash
# Install all dependencies (including dev dependencies)
npm install

# Verify installation
npm list --depth=0
```

**3. Environment Configuration**

Create `.env` file:

```bash
# .env
# GitHub Configuration
GITHUB_TOKEN=ghp_your_personal_access_token_here
WEBHOOK_SECRET=your_webhook_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# CyberAi Ecosystem (Optional)
CYBERAI_API_KEY=ca_your_api_key
SMARTBRAIN_API_KEY=sb_your_api_key
SMARTCONTRACT_AUDIT_KEY=sca_your_api_key
```

**GitHub Token Setup:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Select scopes:
   - `repo` (all)
   - `write:discussion`
   - `read:org`
4. Generate and copy token
5. Add to `.env` file

**4. IDE Configuration**

**Visual Studio Code:**

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Terminal",
      "runtimeArgs": ["-r", "ts-node/register"],
      "args": ["${workspaceFolder}/src/server.ts"],
      "env": {
        "NODE_ENV": "development",
        "LOG_LEVEL": "debug"
      },
      "sourceMaps": true,
      "cwd": "${workspaceFolder}",
      "protocol": "inspector"
    }
  ]
}
```

Create `.vscode/extensions.json`:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "usernamehw.errorlens"
  ]
}
```

### Development Tools

**Install Recommended Tools:**

```bash
# GitHub CLI (for easier PR management)
# macOS
brew install gh

# Linux
sudo apt install gh

# Windows
winget install GitHub.cli

# Authenticate
gh auth login

# Install global TypeScript
npm install -g typescript

# Install global ts-node
npm install -g ts-node
```

### Local Webhook Testing

**Using ngrok:**

```bash
# Install ngrok
# macOS
brew install ngrok

# Linux/Windows - download from https://ngrok.com/download

# Start ngrok tunnel
ngrok http 3000

# Copy HTTPS URL (e.g., https://abc123.ngrok.io)
# Configure in GitHub webhook settings
```

**Using localhost.run:**

```bash
# No installation required
ssh -R 80:localhost:3000 localhost.run

# Copy public URL from output
```

**Configure GitHub Webhook:**
1. Go to repository Settings → Webhooks
2. Click "Add webhook"
3. Payload URL: `https://your-ngrok-url.ngrok.io/webhooks`
4. Content type: `application/json`
5. Secret: Your `WEBHOOK_SECRET`
6. Events: Select "Issue comments"
7. Save

## Building and Running

### Build Commands

```bash
# Development build (watch mode)
npm run dev

# Production build
npm run build

# Clean build (remove dist folder first)
rm -rf dist && npm run build

# Type check only (no emit)
npx tsc --noEmit
```

### Running Locally

**Development Mode:**

```bash
# Run with hot reload
npm run dev

# Run with specific port
PORT=8080 npm run dev

# Run with debug logging
LOG_LEVEL=debug npm run dev

# Run in background
npm run dev &
```

**Production Mode:**

```bash
# Build first
npm run build

# Run compiled JavaScript
NODE_ENV=production node dist/server.js

# Or use PM2
npm install -g pm2
pm2 start dist/server.js --name terminal

# View logs
pm2 logs terminal

# Stop server
pm2 stop terminal
```

**Docker:**

```bash
# Build Docker image
docker build -t terminal:dev .

# Run container
docker run -d \
  --name terminal \
  -p 3000:3000 \
  -e GITHUB_TOKEN=$GITHUB_TOKEN \
  -e WEBHOOK_SECRET=$WEBHOOK_SECRET \
  terminal:dev

# View logs
docker logs -f terminal

# Stop container
docker stop terminal
```

### Testing Webhook Locally

**Manual Webhook Testing:**

```bash
# Create test payload
cat > payload.json << EOF
{
  "action": "created",
  "issue": {
    "number": 1,
    "title": "Test Issue"
  },
  "comment": {
    "body": "/terminal help",
    "user": {
      "login": "testuser"
    }
  },
  "repository": {
    "full_name": "owner/repo"
  }
}
EOF

# Calculate signature
SIGNATURE=$(echo -n "$(cat payload.json)" | openssl dgst -sha256 -hmac "your-secret" | sed 's/^.* //')

# Send webhook
curl -X POST http://localhost:3000/webhooks \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: issue_comment" \
  -H "X-GitHub-Delivery: test-123" \
  -H "X-Hub-Signature-256: sha256=$SIGNATURE" \
  -d @payload.json
```

## Code Structure

### Project Layout

```
terminal/
├── .github/                 # GitHub configuration
│   ├── workflows/          # GitHub Actions workflows
│   │   ├── ci.yml         # Continuous Integration
│   │   ├── codeql.yml     # Security scanning
│   │   └── deploy.yml     # Deployment
│   ├── ISSUE_TEMPLATE/    # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md
├── cli/                    # CLI entry points
├── commands/              # PowerShell command implementations
├── docs/                  # Documentation
│   ├── index.md
│   ├── command-reference.md
│   ├── configuration.md
│   ├── architecture.md
│   ├── development.md
│   ├── troubleshooting.md
│   └── faq.md
├── prompts/               # AI prompt templates
├── scripts/               # Utility scripts
├── src/                   # TypeScript source code
│   ├── server.ts         # Entry point
│   ├── commands/         # Command handlers
│   │   ├── index.ts      # Router
│   │   ├── help.ts
│   │   ├── status.ts
│   │   ├── merge.ts
│   │   └── ...
│   ├── services/         # Business logic (future)
│   ├── integrations/     # External integrations (future)
│   ├── middleware/       # Express middleware (future)
│   ├── utils/            # Utilities (future)
│   └── types/            # Type definitions (future)
├── tests/                 # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── tools/                 # Development tools
├── workflows/             # Workflow definitions
├── .env.example          # Example environment file
├── .eslintrc.json        # ESLint configuration
├── .gitignore
├── .prettierrc           # Prettier configuration
├── commitlint.config.js  # Commit message linting
├── docker-compose.yml
├── Dockerfile
├── package.json
├── package-lock.json
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE
├── SECURITY.md
└── tsconfig.json         # TypeScript configuration
```

### Source Code Organization

**Current Structure:**

```typescript
// src/server.ts - Entry point
import { Webhooks } from "@octokit/webhooks";
import { handleCommand } from "./commands";
import * as http from "http";

// Webhook setup
// HTTP server
// Event handlers

// src/commands/index.ts - Router
export type CommandContext = {
  body: string;
  repo: string;
  issueNumber: number;
};

export async function handleCommand(ctx: CommandContext) {
  // Parse command
  // Route to handler
}

// src/commands/[command].ts - Individual handlers
export async function handleCommandName(ctx: CommandContext) {
  // Command implementation
}
```

**Recommended Future Structure:**

```
src/
├── server.ts
├── config/
│   ├── index.ts           # Configuration loader
│   ├── environment.ts     # Environment variables
│   └── validation.ts      # Config validation
├── webhooks/
│   ├── handler.ts         # Webhook processing
│   ├── validator.ts       # Signature verification
│   └── types.ts
├── commands/
│   ├── index.ts           # Router
│   ├── registry.ts        # Command registry
│   ├── base.ts            # Base command class
│   └── implementations/
│       ├── help.ts
│       ├── status.ts
│       └── ...
├── services/
│   ├── github/
│   │   ├── api.ts
│   │   ├── pr.ts
│   │   └── issues.ts
│   ├── automation/
│   └── notifications/
├── middleware/
│   ├── auth.ts
│   ├── ratelimit.ts
│   └── logging.ts
├── utils/
│   ├── logger.ts
│   ├── errors.ts
│   └── helpers.ts
└── types/
    ├── index.ts
    ├── commands.ts
    └── github.ts
```

### Coding Conventions

**TypeScript Style:**

```typescript
// Use explicit types
function getUserName(userId: string): Promise<string> {
  return api.getUser(userId);
}

// Use interfaces for object types
interface CommandContext {
  body: string;
  repo: string;
  issueNumber: number;
}

// Use type for unions
type CommandStatus = "success" | "error" | "pending";

// Use async/await (not promises)
async function fetchData(): Promise<Data> {
  const response = await api.get("/data");
  return response.data;
}

// Use const for immutable values
const MAX_RETRIES = 3;

// Use meaningful names
const userRepository = new UserRepository();
const isAuthenticated = checkAuth(user);

// Group imports
import * as http from "http";                    // Node.js built-ins
import { Octokit } from "@octokit/core";        // External packages
import { handleCommand } from "./commands";      // Internal modules
```

**Naming Conventions:**

- **Files**: `kebab-case.ts` (e.g., `command-handler.ts`)
- **Classes**: `PascalCase` (e.g., `CommandRouter`)
- **Functions**: `camelCase` (e.g., `handleCommand`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`)
- **Interfaces**: `PascalCase` with `I` prefix optional (e.g., `CommandContext` or `ICommandContext`)
- **Types**: `PascalCase` (e.g., `CommandStatus`)

**Error Handling:**

```typescript
// Use try-catch for async operations
async function executeCommand(ctx: CommandContext) {
  try {
    const result = await performOperation();
    return result;
  } catch (error) {
    logger.error("Command failed", { error, ctx });
    throw new CommandError("Failed to execute command", { cause: error });
  }
}

// Create custom error classes
class CommandError extends Error {
  constructor(message: string, public readonly context?: any) {
    super(message);
    this.name = "CommandError";
  }
}

// Handle specific errors
try {
  await api.call();
} catch (error) {
  if (error.status === 404) {
    return handleNotFound();
  }
  if (error.status === 403) {
    return handleForbidden();
  }
  throw error;
}
```

## Development Workflow

### Git Workflow

**Branching Strategy:**

```
main (production)
  ├── develop (integration)
  │   ├── feature/add-new-command
  │   ├── feature/improve-logging
  │   ├── bugfix/fix-merge-issue
  │   └── hotfix/security-patch
  └── release/v1.2.0
```

**Creating a Feature Branch:**

```bash
# Update local repository
git checkout develop
git pull upstream develop

# Create feature branch
git checkout -b feature/add-awesome-feature

# Make changes
# ...

# Commit changes
git add .
git commit -m "feat: add awesome feature"

# Push to your fork
git push origin feature/add-awesome-feature

# Create pull request on GitHub
gh pr create --base develop --head feature/add-awesome-feature
```

**Commit Message Format:**

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
# New feature
git commit -m "feat(commands): add deploy command"

# Bug fix
git commit -m "fix(merge): handle merge conflicts correctly"

# Documentation
git commit -m "docs: update installation instructions"

# Breaking change
git commit -m "feat!: change command API

BREAKING CHANGE: Command handlers now require async/await"
```

### Pull Request Process

**1. Create Pull Request:**

```bash
# Push your branch
git push origin feature/my-feature

# Create PR using GitHub CLI
gh pr create \
  --title "feat: add my feature" \
  --body "Description of changes..." \
  --base develop

# Or create manually on GitHub
```

**2. PR Description Template:**

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
- [ ] Dependent changes merged

## Screenshots (if applicable)
```

**3. Code Review Process:**

- Reviewer provides feedback
- Author addresses comments
- CI checks must pass
- Require 1-2 approvals (based on team size)
- Maintainer merges

**4. After Merge:**

```bash
# Delete local branch
git checkout develop
git branch -d feature/my-feature

# Delete remote branch
git push origin --delete feature/my-feature

# Update local develop
git pull upstream develop
```

### Code Review Guidelines

**For Authors:**
- Keep PRs small and focused
- Provide clear description
- Respond to feedback promptly
- Don't take criticism personally
- Test thoroughly before requesting review

**For Reviewers:**
- Be respectful and constructive
- Focus on code, not person
- Explain reasoning for suggestions
- Approve if no critical issues
- Block if critical issues found

**Review Checklist:**
- [ ] Code solves stated problem
- [ ] No obvious bugs
- [ ] Follows project conventions
- [ ] Adequately tested
- [ ] Documentation updated
- [ ] No security issues
- [ ] Performance considered
- [ ] Error handling present

## Adding New Commands

### Command Development Process

**1. Plan the Command:**

- Define command purpose
- Specify arguments and options
- Document expected behavior
- Consider edge cases
- Check GitHub API requirements

**2. Create Command File:**

```bash
# Create new command file
touch src/commands/mycommand.ts
```

**3. Implement Command Handler:**

```typescript
// src/commands/mycommand.ts
import { CommandContext } from "./index";
import { Octokit } from "@octokit/core";

/**
 * Handle the mycommand command
 * 
 * Usage: /terminal mycommand [options]
 * 
 * @param ctx Command context
 */
export async function handleMyCommand(ctx: CommandContext): Promise<void> {
  // 1. Parse arguments
  const args = parseArguments(ctx.body);
  
  // 2. Validate inputs
  if (!validateArguments(args)) {
    await postComment(ctx, "❌ Invalid arguments. Usage: /terminal mycommand <arg>");
    return;
  }
  
  // 3. Initialize GitHub client
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
  
  // 4. Get repository information
  const [owner, repo] = ctx.repo.split("/");
  
  try {
    // 5. Execute command logic
    const result = await executeCommandLogic(octokit, owner, repo, ctx.issueNumber, args);
    
    // 6. Format and post success response
    const response = formatSuccessResponse(result);
    await postComment(ctx, response);
    
    // 7. Log success
    console.log(`[mycommand] Success for ${ctx.repo}#${ctx.issueNumber}`);
    
  } catch (error) {
    // 8. Handle errors
    console.error(`[mycommand] Error:`, error);
    await postComment(ctx, formatErrorResponse(error));
  }
}

/**
 * Parse command arguments
 */
function parseArguments(body: string): any {
  const parts = body.trim().split(/\s+/);
  // Remove "/terminal" and "mycommand"
  const args = parts.slice(2);
  
  return {
    option1: args[0],
    option2: args[1],
  };
}

/**
 * Validate parsed arguments
 */
function validateArguments(args: any): boolean {
  return args.option1 !== undefined;
}

/**
 * Execute the actual command logic
 */
async function executeCommandLogic(
  octokit: Octokit,
  owner: string,
  repo: string,
  issueNumber: number,
  args: any
): Promise<any> {
  // Implement your logic here
  // Make GitHub API calls as needed
  
  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}",
    { owner, repo, issue_number: issueNumber }
  );
  
  return {
    success: true,
    data: data,
  };
}

/**
 * Format success response
 */
function formatSuccessResponse(result: any): string {
  return `
### ✅ Command Successful

**Result:** ${result.data.title}

**Details:**
- Item 1: ${result.data.state}
- Item 2: ${result.data.created_at}
  `;
}

/**
 * Format error response
 */
function formatErrorResponse(error: any): string {
  return `
### ❌ Command Failed

**Error:** ${error.message}

**Troubleshooting:**
- Verify permissions
- Check GitHub API status
- Review command arguments
  `;
}

/**
 * Post comment to GitHub issue
 */
async function postComment(ctx: CommandContext, body: string): Promise<void> {
  const [owner, repo] = ctx.repo.split("/");
  
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
  
  await octokit.request(
    "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
    {
      owner,
      repo,
      issue_number: ctx.issueNumber,
      body,
    }
  );
}
```

**4. Register Command in Router:**

```typescript
// src/commands/index.ts
import { handleMyCommand } from "./mycommand";

export async function handleCommand(ctx: CommandContext) {
  const parts = ctx.body.trim().split(/\s+/);
  const [, subcommand, ...args] = parts;
  
  switch (subcommand?.toLowerCase()) {
    case "help":
      return handleHelp(ctx);
    case "mycommand":
      return handleMyCommand(ctx);
    // ... other commands
    default:
      return handleHelp(ctx);
  }
}
```

**5. Update Help Command:**

```typescript
// src/commands/help.ts
export async function handleHelp(ctx: CommandContext) {
  const helpText = `
### 🆘 Terminal Help

**Core Commands:**
- \`/terminal help\` - Show this help message
- \`/terminal status\` - Display PR status
- \`/terminal mycommand\` - My new command

**Usage:**
\`\`\`
/terminal mycommand <arg>
\`\`\`
  `;
  
  await postComment(ctx, helpText);
}
```

**6. Add Tests:**

```typescript
// tests/commands/mycommand.test.ts
import { describe, it, expect, vi } from 'vitest';
import { handleMyCommand } from '../../src/commands/mycommand';

describe('handleMyCommand', () => {
  it('should handle valid command', async () => {
    const ctx = {
      body: '/terminal mycommand arg1',
      repo: 'owner/repo',
      issueNumber: 123,
    };
    
    await handleMyCommand(ctx);
    
    // Add assertions
    expect(/* ... */).toBe(/* ... */);
  });
  
  it('should handle invalid arguments', async () => {
    const ctx = {
      body: '/terminal mycommand',
      repo: 'owner/repo',
      issueNumber: 123,
    };
    
    await handleMyCommand(ctx);
    
    // Add assertions
  });
});
```

**7. Document Command:**

```markdown
<!-- docs/command-reference.md -->
### mycommand

Execute my custom command.

**Syntax:**
```bash
/terminal mycommand <arg> [--option value]
```

**Arguments:**
- `<arg>` - Required argument description

**Options:**
- `--option value` - Optional option description

**Description:**
Detailed description of what the command does.

**Permissions:** Read/Write access required

**Examples:**
```bash
/terminal mycommand value1
/terminal mycommand value1 --option value2
```
```

**8. Test Locally:**

```bash
# Rebuild
npm run build

# Run server
npm run dev

# Test via webhook
# (See "Testing Webhook Locally" section)
```

### Command Template

**Quick Start Template:**

```typescript
// src/commands/template.ts
import { CommandContext } from "./index";
import { Octokit } from "@octokit/core";

export async function handleTemplate(ctx: CommandContext): Promise<void> {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const [owner, repo] = ctx.repo.split("/");
  
  try {
    // TODO: Implement command logic
    
    await postComment(ctx, "✅ Command executed successfully");
  } catch (error) {
    console.error("[template] Error:", error);
    await postComment(ctx, `❌ Error: ${error.message}`);
  }
}

async function postComment(ctx: CommandContext, body: string) {
  const [owner, repo] = ctx.repo.split("/");
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  
  await octokit.request(
    "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
    { owner, repo, issue_number: ctx.issueNumber, body }
  );
}
```

## Testing

### Test Structure

```
tests/
├── unit/                  # Unit tests
│   ├── commands/
│   │   ├── help.test.ts
│   │   ├── status.test.ts
│   │   └── merge.test.ts
│   └── utils/
│       └── parser.test.ts
├── integration/           # Integration tests
│   ├── webhook.test.ts
│   └── github-api.test.ts
├── e2e/                   # End-to-end tests
│   └── command-flow.test.ts
├── fixtures/              # Test data
│   ├── webhooks/
│   │   ├── issue-comment.json
│   │   └── pull-request.json
│   └── responses/
│       └── pr-details.json
└── helpers/               # Test utilities
    ├── mock-octokit.ts
    └── test-context.ts
```

### Writing Tests

**Unit Test Example:**

```typescript
// tests/unit/commands/status.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleStatus } from '../../../src/commands/status';
import { Octokit } from '@octokit/core';

// Mock Octokit
vi.mock('@octokit/core');

describe('handleStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should fetch and display PR status', async () => {
    // Arrange
    const ctx = {
      body: '/terminal status',
      repo: 'owner/repo',
      issueNumber: 123,
    };
    
    const mockPR = {
      number: 123,
      state: 'open',
      mergeable: true,
      head: { ref: 'feature' },
      base: { ref: 'main' },
    };
    
    const mockOctokit = {
      request: vi.fn().mockResolvedValue({ data: mockPR }),
    };
    
    (Octokit as any).mockImplementation(() => mockOctokit);
    
    // Act
    await handleStatus(ctx);
    
    // Assert
    expect(mockOctokit.request).toHaveBeenCalledWith(
      'GET /repos/{owner}/{repo}/pulls/{pull_number}',
      expect.objectContaining({
        owner: 'owner',
        repo: 'repo',
        pull_number: 123,
      })
    );
  });
  
  it('should handle API errors gracefully', async () => {
    // Arrange
    const ctx = {
      body: '/terminal status',
      repo: 'owner/repo',
      issueNumber: 123,
    };
    
    const mockOctokit = {
      request: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    
    (Octokit as any).mockImplementation(() => mockOctokit);
    
    // Act & Assert
    await expect(handleStatus(ctx)).rejects.toThrow('API Error');
  });
});
```

**Integration Test Example:**

```typescript
// tests/integration/webhook.test.ts
import { describe, it, expect } from 'vitest';
import { createHmac } from 'crypto';
import fetch from 'node-fetch';

describe('Webhook Integration', () => {
  const BASE_URL = 'http://localhost:3000';
  const SECRET = 'test-secret';
  
  it('should accept valid webhook', async () => {
    // Arrange
    const payload = JSON.stringify({
      action: 'created',
      comment: { body: '/terminal help' },
      issue: { number: 1 },
      repository: { full_name: 'owner/repo' },
    });
    
    const signature = 'sha256=' + createHmac('sha256', SECRET)
      .update(payload)
      .digest('hex');
    
    // Act
    const response = await fetch(`${BASE_URL}/webhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-GitHub-Event': 'issue_comment',
        'X-GitHub-Delivery': 'test-123',
        'X-Hub-Signature-256': signature,
      },
      body: payload,
    });
    
    // Assert
    expect(response.status).toBe(200);
  });
  
  it('should reject invalid signature', async () => {
    // Arrange
    const payload = JSON.stringify({
      action: 'created',
      comment: { body: '/terminal help' },
    });
    
    // Act
    const response = await fetch(`${BASE_URL}/webhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-GitHub-Event': 'issue_comment',
        'X-Hub-Signature-256': 'sha256=invalid',
      },
      body: payload,
    });
    
    // Assert
    expect(response.status).toBe(500);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test tests/unit/commands/status.test.ts

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run only unit tests
npm test -- tests/unit

# Run integration tests
npm test -- tests/integration
```

### Test Coverage

```bash
# Generate coverage report
npm test -- --coverage

# View coverage report
open coverage/index.html

# Coverage thresholds (set in vitest.config.ts)
# - Statements: 80%
# - Branches: 75%
# - Functions: 80%
# - Lines: 80%
```

## Code Quality

### Linting

**ESLint Configuration:**

```json
// .eslintrc.json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

**Running Lint:**

```bash
# Lint all files
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Lint specific files
npx eslint src/commands/status.ts
```

### Code Formatting

**Prettier Configuration:**

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2
}
```

**Running Prettier:**

```bash
# Format all files
npm run format

# Check formatting
npm run format:check

# Format specific file
npx prettier --write src/commands/status.ts
```

### Type Checking

```bash
# Type check all files
npm run type-check

# Type check with watch mode
npm run type-check -- --watch

# Type check specific file
npx tsc --noEmit src/commands/status.ts
```

### Pre-commit Hooks

**Install Husky:**

```bash
npm install --save-dev husky
npx husky install
```

**Add Pre-commit Hook:**

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run type-check
npm test
```

### Continuous Integration

**GitHub Actions Workflow:**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Test
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
      
      - name: Build
        run: npm run build
```

## Debugging

### VS Code Debugging

**Launch Configuration:**

Already configured in `.vscode/launch.json` (see setup section).

**Usage:**
1. Set breakpoints in code
2. Press F5 or click "Run and Debug"
3. Select "Debug Terminal"
4. Debugger starts and stops at breakpoints

**Debugging Tips:**
- Use "Debug Console" for REPL
- Inspect variables in "Variables" pane
- View call stack in "Call Stack" pane
- Use "Watch" to monitor expressions

### Console Debugging

**Add Debug Logging:**

```typescript
// Debug specific command
console.log('[DEBUG] Command context:', JSON.stringify(ctx, null, 2));

// Debug API calls
console.log('[DEBUG] Making API call:', { owner, repo, issueNumber });

// Debug errors
console.error('[ERROR] Command failed:', error);
console.error('[ERROR] Stack trace:', error.stack);
```

**Enable Debug Logging:**

```bash
# Set debug log level
LOG_LEVEL=debug npm run dev

# Or in .env
LOG_LEVEL=debug
```

### Network Debugging

**Debug GitHub API Calls:**

```typescript
// Log all API requests
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  log: {
    debug: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
  },
});
```

**Monitor Webhooks:**

```bash
# View webhook deliveries in GitHub
# Repository Settings → Webhooks → Recent Deliveries

# Check webhook logs locally
tail -f logs/webhooks.log

# Test webhook with ngrok inspector
# Visit http://127.0.0.1:4040 when using ngrok
```

### Common Issues

**Issue: Webhook not received**
- Check ngrok/tunnel is running
- Verify webhook URL in GitHub settings
- Check firewall rules
- Review webhook secret matches

**Issue: GitHub API rate limit**
- Check rate limit: `curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/rate_limit`
- Use authenticated requests (increases limit)
- Implement caching
- Add retry logic with exponential backoff

**Issue: TypeScript compilation errors**
- Run `npm run type-check` to see all errors
- Check `tsconfig.json` configuration
- Ensure all dependencies installed
- Clear `node_modules` and reinstall

## Contributing

### Contribution Guidelines

1. **Read Documentation**
   - README.md
   - CONTRIBUTING.md
   - CODE_OF_CONDUCT.md

2. **Find an Issue**
   - Check [GitHub Issues](https://github.com/SolanaRemix/terminal/issues)
   - Look for `good first issue` label
   - Comment on issue to claim it

3. **Discuss Changes**
   - For major changes, open discussion first
   - Get feedback before implementing
   - Ensure alignment with project goals

4. **Follow Workflow**
   - Fork repository
   - Create feature branch
   - Make changes
   - Write tests
   - Update documentation
   - Submit pull request

5. **Code Quality**
   - Follow coding conventions
   - Write clean, readable code
   - Add comments for complex logic
   - Ensure tests pass
   - Update documentation

### Getting Help

**Resources:**
- [GitHub Discussions](https://github.com/SolanaRemix/terminal/discussions)
- [Discord Community](#) (if available)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/cyberai-terminal)

**Support Channels:**
- Open GitHub issue for bugs
- Start discussion for questions
- Email: support@cyberai.dev

## Release Process

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH

Example: 1.2.3
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes
```

### Release Workflow

**1. Prepare Release:**

```bash
# Create release branch
git checkout -b release/v1.2.0 develop

# Update version
npm version 1.2.0 --no-git-tag-version

# Update CHANGELOG.md
# Add release notes

# Commit changes
git add package.json CHANGELOG.md
git commit -m "chore: prepare release v1.2.0"

# Push release branch
git push origin release/v1.2.0
```

**2. Create Pull Request:**

```bash
# Create PR to main
gh pr create \
  --title "Release v1.2.0" \
  --body "Release version 1.2.0" \
  --base main
```

**3. Merge and Tag:**

```bash
# After PR approved and merged
git checkout main
git pull

# Create and push tag
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0
```

**4. GitHub Release:**

```bash
# Create GitHub release
gh release create v1.2.0 \
  --title "v1.2.0" \
  --notes "Release notes here"
```

**5. Merge Back to Develop:**

```bash
# Merge main back to develop
git checkout develop
git merge main
git push origin develop
```

### Automated Release

**GitHub Actions Workflow:**

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false
```

## Resources

**Documentation:**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Octokit Documentation](https://octokit.github.io/rest.js/)

**Tools:**
- [VS Code](https://code.visualstudio.com/)
- [GitHub CLI](https://cli.github.com/)
- [ngrok](https://ngrok.com/)
- [Postman](https://www.postman.com/)

**Community:**
- [GitHub Discussions](https://github.com/SolanaRemix/terminal/discussions)
- [Issues](https://github.com/SolanaRemix/terminal/issues)
- [Pull Requests](https://github.com/SolanaRemix/terminal/pulls)

---

**Happy coding! Build amazing automation tools!** 🚀

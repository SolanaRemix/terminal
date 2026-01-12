---
title: CyberAi Terminal
layout: default
---

# CyberAi Terminal Documentation

Welcome to the CyberAi Terminal documentation. Terminal is the automation entrypoint for the CyberAi ecosystem, providing operator-grade infrastructure for repository management through terminal-style commands in GitHub PRs.

## 🚀 Quick Start

Control your repository from anywhere using terminal-style commands inside GitHub pull request comments.

```bash
# Get help
/terminal help

# Check repository status
/terminal status

# Run security scan
/terminal scan
```

## 📋 Commands

### Core Commands

- **`/terminal help`** - Display help and available commands
  - Shows all available commands and their usage
  - No arguments required

- **`/terminal status`** - Show system/repository status
  - Displays PR state, merge status, and checks
  - Works in pull request context

- **`/terminal scan`** - Scan for issues or vulnerabilities
  - Runs security and code quality scans
  - Integrates with CI/CD pipeline

- **`/terminal merge`** - Merge pull request
  - Squash merges the PR
  - Requires appropriate permissions

- **`/terminal tag <name>`** - Create a new tag
  - Creates a git tag at the current commit
  - Example: `/terminal tag v1.0.0`

### Advanced Commands

- **`/terminal audit`** - Run security and code audit
  - Comprehensive security scanning
  - Code quality analysis
  - Dependency vulnerability checks

- **`/terminal fix`** - Apply automated fixes
  - Applies suggested fixes from scans
  - Code style corrections
  - Security vulnerability patches

- **`/terminal deploy`** - Deploy or publish
  - Triggers deployment workflows
  - Publishes releases

### CyberAi Ecosystem Commands

- **`/terminal CyberAi`** - CyberAi integration command
  - Enterprise automation features
  - Multi-repository orchestration

- **`/terminal SmartContractAudit`** - Smart contract security auditing
  - Solidity contract analysis
  - Security vulnerability detection
  - Best practices validation

- **`/terminal SmartBrain`** - AI/ML integration
  - AI-powered code review
  - Intelligent suggestions
  - Multi-agent orchestration

- **`/terminal GitAntivirus`** - Git repository security scanning
  - Malware detection in commits
  - Suspicious pattern detection
  - Historical scan capability

- **`/terminal NodeAudit`** - Node.js dependency audit
  - npm dependency vulnerability scanning
  - Outdated package detection
  - Security advisory checks

- **`/terminal ConflictsResolver`** - Automated git conflict resolution
  - Intelligent conflict resolution
  - Safe merge strategies
  - Conflict analysis and reporting

## 🏗️ Architecture

Terminal consists of several key components:

### Server (`src/server.ts`)
- GitHub webhook receiver
- Command parser and router
- API interaction handler

### Command Handlers (`src/commands/`)
- TypeScript implementations of each command
- GitHub API integration
- Response formatting

### PowerShell Commands (`commands/`)
- PowerShell-based automation scripts
- System integration
- Advanced scripting capabilities

### Bootstrap Scripts (`scripts/`)
- Repository initialization
- Dependency management
- Configuration setup

## 📦 Installation

### Prerequisites
- Node.js v18 or higher
- PowerShell 7+ (for PowerShell scripts)
- GitHub App credentials

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/SolanaRemix/terminal.git
   cd terminal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Configure environment variables**
   ```bash
   export GITHUB_TOKEN="your_github_token"
   export WEBHOOK_SECRET="your_webhook_secret"
   export PORT="3000"
   ```

5. **Run the server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

- `GITHUB_TOKEN` - GitHub Personal Access Token or App token
- `WEBHOOK_SECRET` - Secret for validating webhook payloads
- `PORT` - Server port (default: 3000)

### GitHub App Setup

1. Create a new GitHub App
2. Set webhook URL to `https://your-server.com/webhooks`
3. Subscribe to `issue_comment` events
4. Set webhook secret
5. Install the app on your repositories

## 🧪 Development

### Project Structure

```
terminal/
├── cli/              # CLI entry points
├── commands/         # PowerShell commands
├── src/              # TypeScript source
│   ├── commands/     # Command handlers
│   └── server.ts     # Webhook server
├── scripts/          # Automation scripts
├── tools/            # Development tools
├── tests/            # Test files
├── docs/             # Documentation
├── prompts/          # AI prompts
└── workflows/        # Workflow definitions
```

### Building
```bash
npm run build
```

### Running in Development
```bash
npm run dev
```

### Language Composition
- **TypeScript**: 36.5% - Server and handlers
- **PowerShell**: 63.5% - Automation scripts

## 🔐 Security

Terminal implements multiple security layers:

- **CodeQL Analysis** - Automated security scanning for TypeScript and PowerShell
- **Dependency Review** - Vulnerability scanning for dependencies
- **Webhook Verification** - HMAC signature validation
- **Access Control** - Permission-based command execution

See [SECURITY.md](../SECURITY.md) for our security policy.

## 🌐 CyberAi Ecosystem

Terminal is part of the broader CyberAi ecosystem:

- **CyberAi** - Enterprise automation platform
- **SmartBrain** - AI/ML engine for intelligent automation
- **Terminal** - Command-line automation interface
- **Control Plane** - Central management and orchestration

## 📚 Additional Resources

- [API Documentation](api.md)
- [Branding Guidelines](branding.md)
- [Marketplace Listing](marketplace.md)
- [Organization Structure](org-structure.md)
- [SmartBrain Integration](smartbrain.md)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 💬 Support

For support:
1. Check this documentation
2. Search [existing issues](https://github.com/SolanaRemix/terminal/issues)
3. Open a new issue if needed

---

**Built with ❤️ by the CyberAi team**

# CyberAi Terminal

[![CI](https://github.com/SolanaRemix/terminal/actions/workflows/ci.yml/badge.svg)](https://github.com/SolanaRemix/terminal/actions/workflows/ci.yml)
[![CodeQL](https://github.com/SolanaRemix/terminal/actions/workflows/codeql.yml/badge.svg)](https://github.com/SolanaRemix/terminal/actions/workflows/codeql.yml)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Control your repository from anywhere using terminal-style commands inside GitHub PRs. Terminal is the automation entrypoint for the CyberAi ecosystem, providing operator-grade infrastructure for repository management.

## 🚀 Quick Start

Terminal integrates with GitHub as an app that listens for `/terminal` commands in pull request comments. Simply comment with a command, and Terminal will execute the action and report back.

```bash
# Get help
/terminal help

# Check repository status
/terminal status

# Run security scan
/terminal scan
```

## 📋 Available Commands

### Core Commands
- **`/terminal help`** - Display help and available commands
- **`/terminal status`** - Show system/repository status
- **`/terminal scan`** - Scan for issues or vulnerabilities
- **`/terminal merge`** - Merge pull request (requires permissions)
- **`/terminal tag <name>`** - Create a new tag

### Advanced Commands
- **`/terminal audit`** - Run security and code audit
- **`/terminal fix`** - Apply automated fixes
- **`/terminal deploy`** - Deploy or publish

### CyberAi Ecosystem Commands
- **`/terminal CyberAi`** - CyberAi integration command
- **`/terminal SmartContractAudit`** - Smart contract security auditing
- **`/terminal SmartBrain`** - AI/ML integration and assistance
- **`/terminal GitAntivirus`** - Git repository security scanning
- **`/terminal NodeAudit`** - Node.js dependency audit
- **`/terminal ConflictsResolver`** - Automated git conflict resolution

## 🏗️ Architecture

```
terminal/
├── cli/              # CLI entry points and argument parsing
├── commands/         # PowerShell command implementations
├── src/              # TypeScript source code
│   ├── commands/     # TypeScript command handlers
│   └── server.ts     # Webhook server
├── scripts/          # Utility and automation scripts
├── tools/            # Development and operational tools
├── tests/            # Test files and utilities
├── docs/             # Documentation
├── prompts/          # AI prompt templates
└── workflows/        # Workflow definitions
```

## 🔧 Installation

### Prerequisites
- Node.js v18 or higher
- PowerShell 7+ (for PowerShell scripts)
- GitHub App credentials

### Setup

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

## 🔐 Security

Terminal is built with security as a priority:
- CodeQL security scanning for PowerShell and TypeScript
- Automated dependency vulnerability reviews
- Security policy and vulnerability reporting process

See [SECURITY.md](SECURITY.md) for our security policy and how to report vulnerabilities.

## 🧪 Development

### Building
```bash
npm run build
```

### Running in Development Mode
```bash
npm run dev
```

### Project Structure
- **TypeScript**: 36.5% - Server and command handlers
- **PowerShell**: 63.5% - Automation scripts and commands

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

### Quick Contribution Guide
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📖 Documentation

- [API Documentation](docs/index.md)
- [Command Reference](docs/index.md#commands)
- [Architecture Guide](docs/index.md#architecture)
- [Security Policy](SECURITY.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

## 🌐 CyberAi Ecosystem

Terminal is part of the CyberAi ecosystem:
- **CyberAi** - Enterprise automation platform
- **SmartBrain** - AI/ML engine for intelligent automation
- **Terminal** - Command-line automation interface

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/SolanaRemix/terminal)
- [Issue Tracker](https://github.com/SolanaRemix/terminal/issues)
- [Pull Requests](https://github.com/SolanaRemix/terminal/pulls)

## 💬 Support

For support, please:
1. Check the [documentation](docs/index.md)
2. Search [existing issues](https://github.com/SolanaRemix/terminal/issues)
3. Open a new issue if needed

---

**Built with ❤️ by the CyberAi team**

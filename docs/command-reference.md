# Command Reference

Complete reference guide for all CyberAi Terminal commands available in pull requests.

## Command Syntax

All Terminal commands follow this syntax:

```
/terminal <command> [options] [arguments]
```

## Core Commands

### help

Display help information and list available commands.

**Syntax:**
```bash
/terminal help
```

**Description:**
Shows all available commands with brief descriptions and usage examples.

**Permissions:** None required

**Example Output:**
```markdown
### 🆘 Terminal Help

**Core Commands:**
- `/terminal help` - Show this help message
- `/terminal status` - Display PR and repository status
- `/terminal scan` - Run security and quality scans
- `/terminal merge` - Merge pull request (requires permissions)
- `/terminal tag <name>` - Create a new tag

**Advanced Commands:**
- `/terminal audit` - Run comprehensive security audit
- `/terminal fix` - Apply automated fixes
- `/terminal deploy` - Deploy or publish

**CyberAi Ecosystem:**
- `/terminal CyberAi` - CyberAi integration features
- `/terminal SmartBrain` - AI/ML powered assistance
- `/terminal SmartContractAudit` - Smart contract auditing
- `/terminal GitAntivirus` - Repository security scanning
- `/terminal NodeAudit` - Node.js dependency audit
- `/terminal ConflictsResolver` - Automated conflict resolution
```

### status

Show current pull request and repository status.

**Syntax:**
```bash
/terminal status
```

**Description:**
Displays comprehensive information about the PR including:
- PR state and merge status
- CI/CD check status
- Branch information
- Review status
- Merge conflicts (if any)

**Permissions:** Read access to repository

**Example Output:**
```markdown
### 📊 Repository Status

**Pull Request:** #123
**State:** Open
**Mergeable:** ✅ Yes
**Status Checks:** ✅ All passing

**Branch:** feature/new-feature
**Base:** main
**Commits Ahead:** 5
**Commits Behind:** 0

**Reviews:** 2 approved, 0 changes requested
**CI/CD:** ✅ All checks passed
```

### scan

Run security and code quality scans.

**Syntax:**
```bash
/terminal scan
```

**Description:**
Executes comprehensive repository scanning including:
- Security vulnerability detection
- Code quality analysis
- Dependency audit
- Configuration validation
- Best practices check

**Permissions:** Read access to repository

**Integration:** 
- Triggers GitHub Actions workflows
- Integrates with CodeQL
- Uses vulnerability databases

**Example Output:**
```markdown
### 🧪 Scan Results

**Status:** ✅ Completed

**Security:** No vulnerabilities found
**Code Quality:** 8.7/10
**Dependencies:** Up to date
**Configuration:** Valid

**Details:** Check workflow runs for detailed results
```

### merge

Merge the pull request.

**Syntax:**
```bash
/terminal merge [--method <squash|merge|rebase>]
```

**Options:**
- `--method squash` - Squash merge (default)
- `--method merge` - Create merge commit
- `--method rebase` - Rebase and merge

**Description:**
Merges the pull request into the base branch. Requires:
- All required checks to pass
- Required approvals
- No merge conflicts
- Write permissions

**Permissions:** Write access to repository

**Example:**
```bash
/terminal merge --method squash
```

### tag

Create a new git tag.

**Syntax:**
```bash
/terminal tag <tag-name> [--message <message>]
```

**Arguments:**
- `<tag-name>` - Name of the tag (required)

**Options:**
- `--message <message>` - Tag annotation message

**Description:**
Creates a new git tag at the current commit. Useful for releases and versioning.

**Permissions:** Write access to repository

**Examples:**
```bash
/terminal tag v1.0.0
/terminal tag v2.0.0-beta --message "Beta release"
```

## Advanced Commands

### audit

Run comprehensive security and code audit.

**Syntax:**
```bash
/terminal audit [--focus <area>] [--depth <level>]
```

**Options:**
- `--focus security` - Focus on security analysis
- `--focus code-quality` - Focus on code quality
- `--focus performance` - Focus on performance
- `--depth quick` - Quick audit
- `--depth thorough` - Thorough audit (default)

**Description:**
Performs comprehensive audit including:
- Security vulnerability scan
- Code quality analysis
- Dependency vulnerability check
- Best practices validation
- Compliance checks

**Permissions:** Read access to repository

**Example:**
```bash
/terminal audit --focus security --depth thorough
```

### fix

Apply automated fixes to detected issues.

**Syntax:**
```bash
/terminal fix [--type <type>] [--auto-apply]
```

**Options:**
- `--type style` - Fix code style issues
- `--type security` - Fix security vulnerabilities
- `--type performance` - Fix performance issues
- `--type all` - Fix all detected issues
- `--auto-apply` - Apply fixes without review

**Description:**
Automatically fixes detected issues including:
- Code style corrections
- Linting issues
- Security patches
- Dependency updates
- Best practice applications

**Permissions:** Write access to repository

**Safety:** 
- Tests run before and after fixes
- Automatic rollback on failure
- Creates PR for review (unless --auto-apply)

**Examples:**
```bash
/terminal fix --type style
/terminal fix --type security --auto-apply
```

### deploy

Trigger deployment or publish workflow.

**Syntax:**
```bash
/terminal deploy [--environment <env>] [--tag <version>]
```

**Options:**
- `--environment staging` - Deploy to staging
- `--environment production` - Deploy to production
- `--tag <version>` - Deploy specific version

**Description:**
Triggers deployment workflows. Can deploy to various environments.

**Permissions:** Write access to repository, deploy permissions

**Examples:**
```bash
/terminal deploy --environment staging
/terminal deploy --environment production --tag v1.0.0
```

## CyberAi Ecosystem Commands

### CyberAi

Access CyberAi enterprise automation features.

**Syntax:**
```bash
/terminal CyberAi [subcommand]
```

**Description:**
Enterprise automation platform features including:
- Multi-repository orchestration
- Workflow automation
- Policy enforcement
- Advanced analytics

**Permissions:** Enterprise tier subscription

**Availability:** Enterprise tier only

### SmartBrain

AI/ML powered code assistance and analysis.

**Syntax:**
```bash
/terminal SmartBrain [--mode <mode>] [--focus <area>]
```

**Options:**
- `--mode review` - AI code review
- `--mode suggest` - Get improvement suggestions
- `--mode analyze` - Deep code analysis
- `--focus security` - Focus on security
- `--focus performance` - Focus on performance
- `--focus refactoring` - Focus on refactoring opportunities

**Description:**
SmartBrain provides:
- AI-powered code review
- Intelligent suggestions
- Context-aware recommendations
- Pattern recognition
- Automated code improvements

**Permissions:** Pro tier or higher

**Example:**
```bash
/terminal SmartBrain --mode review --focus security
```

### SmartContractAudit

Blockchain smart contract security auditing.

**Syntax:**
```bash
/terminal SmartContractAudit [--chain <blockchain>]
```

**Options:**
- `--chain ethereum` - Ethereum/Solidity contracts
- `--chain solana` - Solana contracts
- `--chain bsc` - Binance Smart Chain

**Description:**
Comprehensive smart contract security audit:
- Vulnerability detection
- Gas optimization analysis
- Best practices validation
- Reentrancy checks
- Access control verification

**Supported Languages:**
- Solidity
- Vyper
- Rust (Solana)

**Example:**
```bash
/terminal SmartContractAudit --chain ethereum
```

### GitAntivirus

Git repository security scanning and malware detection.

**Syntax:**
```bash
/terminal GitAntivirus [--scan-history] [--depth <number>]
```

**Options:**
- `--scan-history` - Scan commit history
- `--depth <number>` - Number of commits to scan

**Description:**
Scans repository for:
- Malicious code patterns
- Suspicious commits
- Backdoors
- Obfuscated code
- Known malware signatures

**Example:**
```bash
/terminal GitAntivirus --scan-history --depth 100
```

### NodeAudit

Node.js dependency security audit.

**Syntax:**
```bash
/terminal NodeAudit [--fix] [--severity <level>]
```

**Options:**
- `--fix` - Automatically fix vulnerable dependencies
- `--severity low` - Include low severity
- `--severity medium` - Include medium+ severity (default)
- `--severity high` - Only high+ severity
- `--severity critical` - Only critical severity

**Description:**
Audits Node.js dependencies for:
- Known vulnerabilities
- Outdated packages
- Security advisories
- License compliance

**Example:**
```bash
/terminal NodeAudit --fix --severity high
```

### ConflictsResolver

Automated merge conflict resolution.

**Syntax:**
```bash
/terminal ConflictsResolver [--strategy <strategy>]
```

**Options:**
- `--strategy auto` - Automatic resolution (default)
- `--strategy ours` - Prefer current branch
- `--strategy theirs` - Prefer incoming branch
- `--strategy manual` - Suggest resolution

**Description:**
Intelligently resolves merge conflicts using:
- AI analysis of conflict context
- Code pattern recognition
- Historical resolution patterns
- Safe merge strategies

**Example:**
```bash
/terminal ConflictsResolver --strategy auto
```

## Auto Commands (Planned)

These commands are part of the planned automation suite for future releases.

### Auto Sync Commands (Planned)

```bash
# Planned commands - not yet available
/terminal autosync enable          # Enable auto synchronization
/terminal autosync disable         # Disable auto synchronization
/terminal autosync status          # Check sync status
/terminal autosync now             # Force sync now
/terminal autosync configure       # Configure sync settings
```

### Auto Test Commands (Planned)

```bash
# Planned commands - not yet available
/terminal autotest enable          # Enable auto testing
/terminal autotest disable         # Disable auto testing
/terminal autotest run            # Run tests
/terminal autotest status         # Check test status
/terminal autotest coverage       # Get coverage report
/terminal autotest generate       # Generate tests with AI
```

### Auto Analysis Commands (Planned)

```bash
# Planned commands - not yet available
/terminal autoanalysis run        # Run analysis
/terminal autoanalysis status     # Check analysis status
/terminal autoanalysis report     # Get detailed report
/terminal autoanalysis trends     # View quality trends
/terminal autoanalysis recommend  # Get recommendations
```

### Auto Fix Commands

```bash
# Currently available - basic fixes
/terminal fix                     # Apply basic automated fixes

# Planned advanced commands - not yet available
/terminal autofix apply           # Apply all safe fixes
/terminal autofix suggest         # Suggest available fixes
/terminal autofix status          # Check fix status
/terminal autofix preview         # Preview fixes
/terminal autofix rollback        # Rollback last fixes
```

## Command Aliases

Some commands have shorter aliases:

| Command | Alias |
|---------|-------|
| `/terminal status` | `/terminal st` |
| `/terminal scan` | `/terminal sc` |
| `/terminal merge` | `/terminal mr` |
| `/terminal help` | `/terminal h` |

## Global Options

These options work with most commands:

- `--verbose` - Verbose output
- `--quiet` - Minimal output
- `--dry-run` - Preview without executing
- `--help` - Command-specific help

## Response Format

All Terminal commands respond in a consistent format:

```markdown
### 🔧 Command Name

**Status:** ✅ Success / ⚠️ Warning / ❌ Error

**Summary:** Brief description of what happened

**Details:**
- Detailed information
- Results
- Metrics

**Next Steps:**
- Suggested actions
- Related commands
```

## Error Handling

### Common Errors

**Permission Denied:**
```markdown
### ❌ Permission Denied

You don't have permission to execute this command.

**Required Permission:** Write access to repository

**How to Fix:** Ask a repository maintainer for permissions.
```

**Command Not Found:**
```markdown
### ❌ Command Not Found

Unknown command: `unknowncommand`

**Available Commands:** Use `/terminal help` to see all commands.
```

**Invalid Arguments:**
```markdown
### ❌ Invalid Arguments

The provided arguments are invalid.

**Usage:** `/terminal tag <tag-name>`

**Example:** `/terminal tag v1.0.0`
```

## Rate Limits

To ensure fair usage (limits to be finalized):

- **Free Tier:** Usage limits to be determined
- **Pro Tier:** Enhanced limits for paying customers
- **Enterprise Tier:** Custom limits based on agreement

Rate limit details will be confirmed in the final Marketplace listing.

## Best Practices

1. **Use Specific Commands**: Use the most specific command for your task
2. **Check Status First**: Run `/terminal status` before other commands
3. **Review Before Merge**: Always review before using `/terminal merge`
4. **Test Locally**: Test changes locally before automation
5. **Use Help**: Use `--help` flag for command-specific help
6. **Monitor Results**: Check workflow runs after commands
7. **Provide Feedback**: Report issues or suggestions

## Command Combinations

Common command workflows:

**Pre-Merge Workflow:**
```bash
/terminal status           # Check PR status
/terminal scan            # Run security scan
/terminal autotest run    # Run tests
/terminal merge           # Merge if all pass
```

**Security Audit Workflow:**
```bash
/terminal scan            # Initial scan
/terminal audit           # Comprehensive audit
/terminal NodeAudit       # Dependency check
/terminal GitAntivirus    # Malware scan
/terminal fix --type security  # Fix vulnerabilities
```

**Quality Improvement Workflow:**
```bash
/terminal autoanalysis run    # Analyze code
/terminal SmartBrain --mode suggest  # Get AI suggestions
/terminal autofix apply      # Apply fixes
/terminal autotest run       # Validate fixes
```

## Support

For command-specific help:
- Use `--help` flag with any command
- Check [documentation](https://solanaremix.github.io/terminal/)
- Open an [issue](https://github.com/SolanaRemix/terminal/issues)
- Contact support: support@cyberai.dev

---

**Command your repository with confidence**

# Frequently Asked Questions (FAQ)

Comprehensive answers to commonly asked questions about CyberAi Terminal.

## Table of Contents

- [General Questions](#general-questions)
- [Installation and Setup](#installation-and-setup)
- [Usage and Features](#usage-and-features)
- [Security and Privacy](#security-and-privacy)
- [Pricing and Licensing](#pricing-and-licensing)
- [Integration Questions](#integration-questions)
- [Troubleshooting](#troubleshooting)
- [Development and Contributing](#development-and-contributing)
- [Enterprise Features](#enterprise-features)

## General Questions

### What is CyberAi Terminal?

CyberAi Terminal is a GitHub automation platform that allows you to control your repository through natural language commands in GitHub issue and pull request comments. It acts as a command-line interface directly within GitHub, enabling developers to execute common repository operations without leaving the GitHub UI.

**Key Features:**
- Command-based automation (`/terminal merge`, `/terminal status`, etc.)
- Webhook-driven real-time execution
- Integration with GitHub API
- Support for custom commands
- Enterprise-grade security
- Extensive automation capabilities

### Who should use Terminal?

**Ideal for:**
- **Development Teams** - Streamline PR workflows and code reviews
- **DevOps Engineers** - Automate deployments and infrastructure tasks
- **Open Source Maintainers** - Manage community contributions efficiently
- **Enterprise Organizations** - Enforce policies and compliance
- **Solo Developers** - Automate repetitive tasks

**Use Cases:**
- Automating PR merges with validation
- Running security scans and audits
- Triggering CI/CD pipelines
- Managing releases and tags
- Enforcing code quality standards
- Resolving merge conflicts
- Syncing branches automatically

### How does Terminal work?

1. **User Action**: Developer posts comment `/terminal command` in GitHub issue/PR
2. **Webhook**: GitHub sends webhook event to Terminal server
3. **Processing**: Terminal validates, parses, and routes command
4. **Execution**: Command handler executes logic via GitHub API
5. **Response**: Terminal posts result as comment in same issue/PR
6. **Notifications**: Optional notifications sent to Slack, Discord, email

```
User → GitHub → Webhook → Terminal → GitHub API → Response → User
```

### What makes Terminal different from GitHub Actions?

| Feature | Terminal | GitHub Actions |
|---------|----------|----------------|
| **Trigger** | Comment command | Push, PR, schedule |
| **Interface** | Natural language | YAML workflow |
| **Execution** | Immediate | Queued in runner |
| **Response** | Comment in thread | Workflow summary |
| **Setup** | Install app | Create workflow files |
| **Flexibility** | Fixed commands | Unlimited scripts |
| **Best For** | Quick operations | Complex CI/CD |

**Use Together:**
- Terminal for ad-hoc operations
- GitHub Actions for automated workflows
- Terminal can trigger Actions workflows

### Is Terminal open source?

Yes! Terminal is open source under the MIT License.

**Repository**: https://github.com/SolanaRemix/terminal

**You can:**
- ✅ Use commercially
- ✅ Modify source code
- ✅ Distribute copies
- ✅ Use privately
- ✅ Contribute improvements

**Contributions welcome!** See [CONTRIBUTING.md](../CONTRIBUTING.md)

### What languages/frameworks does Terminal support?

Terminal is language-agnostic and works with any GitHub repository.

**Core Support:**
- JavaScript/TypeScript (Node.js)
- Python
- Go
- Ruby
- Java/Kotlin
- C#/.NET
- PHP
- Rust
- Any language on GitHub

**Specialized Features:**
- Smart contract auditing (Solidity, Rust/Solana)
- Node.js dependency scanning
- Static analysis for major languages
- Custom scanners extensible

## Installation and Setup

### How do I install Terminal?

**Option 1: GitHub App (Recommended)**

1. Go to https://github.com/apps/cyberai-terminal
2. Click "Install"
3. Select repositories
4. Configure webhook secret
5. Start using commands in PRs

**Option 2: Self-Hosted**

```bash
# Clone repository
git clone https://github.com/SolanaRemix/terminal.git
cd terminal

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your GitHub token

# Build and run
npm run build
npm run dev
```

**Option 3: Docker**

```bash
docker pull cyberai/terminal:latest
docker run -d \
  -p 3000:3000 \
  -e GITHUB_TOKEN=your_token \
  -e WEBHOOK_SECRET=your_secret \
  cyberai/terminal:latest
```

See [Installation Guide](../README.md#installation) for detailed instructions.

### What are the system requirements?

**Minimum Requirements:**
- Node.js v18.0.0 or higher
- 512 MB RAM
- 100 MB disk space
- Internet connection

**Recommended:**
- Node.js v20.0.0 (LTS)
- 1 GB RAM
- 1 GB disk space (for logs)
- Stable internet connection

**For Production:**
- 2+ GB RAM
- 10 GB disk space
- Load balancer
- Multiple instances
- Monitoring setup

### Do I need to create a GitHub App or can I use a personal access token?

**Both options work:**

**GitHub App (Recommended):**
- ✅ Better security (scoped permissions)
- ✅ Automatic token rotation
- ✅ Higher rate limits
- ✅ Organization-wide installation
- ✅ Fine-grained permissions
- ❌ More complex setup

**Personal Access Token:**
- ✅ Simpler setup
- ✅ Quick testing
- ❌ Manual rotation needed
- ❌ Broader permissions
- ❌ Lower rate limits
- ❌ Tied to user account

**Recommendation**: Use GitHub App for production, PAT for development/testing.

### How do I configure webhooks?

**GitHub Repository:**

1. Go to Settings → Webhooks
2. Click "Add webhook"
3. Configure:
   - **Payload URL**: `https://your-domain.com/webhooks`
   - **Content type**: `application/json`
   - **Secret**: Your webhook secret (match `WEBHOOK_SECRET`)
   - **Events**: Select "Issue comments"
   - **Active**: ✓ Checked
4. Click "Add webhook"

**For Local Development:**

Use ngrok or similar tunnel:
```bash
ngrok http 3000
# Use ngrok URL as webhook URL
```

See [Configuration Guide](configuration.md#github-app-setup) for details.

### Can I use Terminal with GitHub Enterprise?

Yes! Terminal supports GitHub Enterprise Server and GitHub Enterprise Cloud.

**Configuration:**

```bash
# Set GitHub API URL
export GITHUB_API_URL="https://github.your-company.com/api/v3"

# Or in .terminal.yml
github:
  api_url: "https://github.your-company.com/api/v3"
```

**Requirements:**
- GitHub Enterprise Server 3.0+
- Webhook access from Terminal server
- GitHub App installation (or PAT with appropriate scopes)

**Enterprise Features:**
- SSO/SAML integration
- IP allowlisting
- Audit logging
- Custom compliance policies

## Usage and Features

### What commands are available?

**Core Commands:**
- `/terminal help` - Show help and available commands
- `/terminal status` - Display PR/repository status
- `/terminal scan` - Run security and quality scans
- `/terminal merge` - Merge pull request
- `/terminal tag <name>` - Create git tag

**Advanced Commands:**
- `/terminal audit` - Comprehensive security audit
- `/terminal fix` - Apply automated fixes
- `/terminal deploy` - Trigger deployment

**CyberAi Ecosystem:**
- `/terminal SmartBrain` - AI-powered code analysis
- `/terminal SmartContractAudit` - Blockchain security audit
- `/terminal GitAntivirus` - Malware detection
- `/terminal NodeAudit` - Node.js dependency audit
- `/terminal ConflictsResolver` - Resolve merge conflicts

See [Command Reference](command-reference.md) for complete list and usage.

### Can I create custom commands?

Yes! Terminal is extensible.

**Adding a Command:**

1. Create command handler:
```typescript
// src/commands/mycommand.ts
export async function handleMyCommand(ctx: CommandContext) {
  // Your logic here
}
```

2. Register in router:
```typescript
// src/commands/index.ts
case "mycommand":
  return handleMyCommand(ctx);
```

3. Rebuild and deploy

See [Development Guide](development.md#adding-new-commands) for detailed instructions.

### How do I restrict command usage to specific users?

Configure permissions in `.terminal.yml`:

```yaml
# .terminal.yml
permissions:
  # Per-user permissions
  users:
    - username: maintainer1
      permissions: [admin]
    
    - username: developer1
      permissions: [write]
  
  # Per-team permissions
  teams:
    - team: core-team
      permissions: [admin]
    
    - team: contributors
      permissions: [read]
  
  # Per-command permissions
  command_permissions:
    status: read
    merge: write
    deploy: admin
```

**Permission Levels:**
- `read` - View-only commands (status, help)
- `write` - Modify commands (merge, tag)
- `admin` - Sensitive commands (deploy)
- `enterprise` - Enterprise features (CyberAi, SmartBrain)

### Can Terminal automatically merge PRs?

Yes, with Auto Merge feature:

```yaml
# .terminal.yml
automation:
  auto_merge:
    enabled: true
    
    # Conditions for auto-merge
    conditions:
      - all_checks_pass: true
      - required_approvals: 2
      - no_conflicts: true
      - labels_include: ["auto-merge"]
      - labels_exclude: ["do-not-merge"]
    
    # Merge settings
    merge_method: squash
    delete_branch: true
    update_branch_first: true
```

**Or use command:**
```bash
/terminal merge --auto
```

### Does Terminal work with private repositories?

Yes! Terminal works with both public and private repositories.

**Requirements:**
- GitHub App installed on repository (or PAT with repo access)
- Proper authentication configured
- Webhooks configured correctly

**No additional configuration needed** - Terminal respects GitHub's access controls.

### Can I use Terminal with multiple repositories?

Yes! Terminal can manage multiple repositories.

**Setup Options:**

1. **Install GitHub App to Multiple Repos:**
   - Install app once
   - Select "All repositories" or specific repos
   - Terminal automatically handles all selected repos

2. **Use Organization-Wide Installation:**
   - Install at organization level
   - Automatically includes future repos

3. **Per-Repository Configuration:**
   - Each repo can have own `.terminal.yml`
   - Different settings per repository

**Rate Limits:**
- Free tier: 100 commands/month across all repos
- Pro tier: 1,000 commands/month
- Enterprise: Unlimited

## Security and Privacy

### Is Terminal secure?

Yes, Terminal implements multiple security layers:

**Authentication:**
- HMAC-SHA256 webhook signature verification
- GitHub token validation
- API key authentication for integrations

**Authorization:**
- Role-based access control (RBAC)
- Per-command permissions
- User and team-based restrictions

**Data Security:**
- No data stored permanently (stateless)
- Secrets in environment variables
- HTTPS-only communication
- Regular security audits

**Compliance:**
- SOC 2 Type II certified (Enterprise)
- GDPR compliant
- CCPA compliant
- ISO 27001 certified (Enterprise)

See [Security Policy](../SECURITY.md) for details.

### What data does Terminal access?

Terminal only accesses what's necessary:

**Read Access:**
- Repository metadata
- Pull request details
- Issue comments
- Commit information
- Check run status
- User information (username, permissions)

**Write Access (when authorized):**
- Post comments
- Merge pull requests
- Create tags
- Update statuses
- Trigger workflows

**Not Accessed:**
- Personal user data beyond GitHub
- Repository code (unless scan/audit command used)
- Billing information
- Emails outside notifications
- Browser history or activity

**Data Retention:**
- No long-term storage
- Logs retained 30 days
- Can be configured shorter

### Can Terminal access my code?

**Short Answer:** Only when you explicitly request scanning/auditing commands.

**Details:**

**Commands that Read Code:**
- `/terminal scan` - Security scanning
- `/terminal audit` - Code quality audit
- `/terminal SmartBrain` - AI code analysis
- `/terminal SmartContractAudit` - Smart contract review

**How It Works:**
1. Terminal requests code via GitHub API
2. Code analyzed in-memory
3. Results returned to you
4. Code immediately discarded (not stored)

**Commands that Don't Read Code:**
- `/terminal help`
- `/terminal status`
- `/terminal merge`
- `/terminal tag`

**Your Control:**
- Disable scanning commands in configuration
- Use self-hosted for sensitive code
- Review open source code yourself

### How are secrets and tokens managed?

**Best Practices Implemented:**

1. **Environment Variables:**
   ```bash
   # Stored in environment, not code
   GITHUB_TOKEN=ghp_xxx
   WEBHOOK_SECRET=xxx
   ```

2. **Secrets Manager Integration:**
   ```yaml
   # Use AWS Secrets Manager, Azure Key Vault, etc.
   security:
     secrets:
       provider: aws-secrets-manager
   ```

3. **Automatic Rotation:**
   - GitHub App tokens rotate automatically (1 hour expiry)
   - Support for manual rotation

4. **Never Logged:**
   - Secrets masked in logs
   - Not printed to console
   - Not included in error messages

5. **Access Control:**
   - Secrets only accessible by Terminal process
   - File permissions restricted (600)
   - Environment isolation

**Your Responsibilities:**
- Don't commit secrets to git
- Rotate tokens regularly
- Use strong webhook secrets
- Limit token scopes

### Is my data shared with third parties?

**CyberAi Terminal (Self-Hosted):**
- ❌ No data sharing
- You control everything

**CyberAi Terminal (Cloud):**
- ❌ Never sell data
- ❌ No advertising
- ✅ Only shared when necessary:
  - GitHub API (for operations)
  - Configured integrations (Slack, email, etc.)
  - CyberAi services (if Enterprise features used)

**Analytics:**
- Usage metrics collected (anonymized)
- Error reports (no sensitive data)
- Opt-out available

**Third-Party Services:**
Only used when you explicitly configure:
- Slack (notifications)
- Discord (notifications)
- Email (notifications)
- PagerDuty (alerting)
- Custom webhooks

## Pricing and Licensing

### Is Terminal free?

**Yes, with tiers:**

**Free Tier:**
- ✅ Core commands (help, status, scan, merge, tag)
- ✅ Up to 3 repositories
- ✅ 100 commands/month
- ✅ Community support
- ✅ Open source access

**Pro Tier ($29/month):**
- ✅ All core commands
- ✅ Up to 50 repositories
- ✅ 1,000 commands/month
- ✅ SmartBrain AI features
- ✅ Auto-test and auto-analysis
- ✅ Priority support

**Enterprise Tier (Custom pricing):**
- ✅ All features
- ✅ Unlimited repositories
- ✅ Unlimited commands
- ✅ CyberAi platform access
- ✅ Custom integrations
- ✅ 24/7 support
- ✅ SLA guarantees
- ✅ On-premise deployment

**Self-Hosted:**
- ✅ Free and open source
- ✅ MIT License
- ✅ No usage limits
- ✅ Community support

### What license is Terminal released under?

**MIT License**

```
Copyright (c) 2024 CyberAi Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[See LICENSE file for full text]
```

**What this means:**
- ✅ Free to use commercially
- ✅ Modify as needed
- ✅ Distribute your version
- ✅ Use privately
- ✅ No warranty provided

### Can I use Terminal for commercial projects?

**Yes!** Terminal is free for commercial use under MIT License.

**Commercial Usage:**
- ✅ Private company repositories
- ✅ Client projects
- ✅ SaaS products
- ✅ Internal tools
- ✅ Consulting services

**No restrictions on:**
- Number of users
- Revenue from projects using Terminal
- Type of business
- Commercial vs non-commercial

**Optional:** Upgrade to Pro/Enterprise for additional features and support.

### What's the difference between cloud and self-hosted?

| Feature | Cloud (Hosted) | Self-Hosted |
|---------|----------------|-------------|
| **Setup** | Install app (5 min) | Setup server (30+ min) |
| **Cost** | Free/Pro/Enterprise | Free (infrastructure cost) |
| **Maintenance** | Managed by us | You manage |
| **Updates** | Automatic | Manual |
| **Scalability** | Automatic | You scale |
| **Customization** | Limited | Full control |
| **Data Location** | Our servers | Your servers |
| **Support** | Included | Community |
| **SLA** | Enterprise only | You manage |
| **Best For** | Most users | Large enterprises, compliance needs |

### Is there a free trial for Pro/Enterprise?

**Pro Tier:**
- ✅ 14-day free trial
- ✅ No credit card required
- ✅ Full access to Pro features
- ✅ Easy upgrade after trial

**Enterprise Tier:**
- ✅ 30-day pilot program
- ✅ Custom deployment
- ✅ Dedicated support
- ✅ Contact sales for details

**Start Trial:**
1. Visit https://terminal.cyberai.dev
2. Click "Start Free Trial"
3. Install GitHub App
4. Start using Pro features

## Integration Questions

### Can Terminal integrate with Slack?

Yes! Slack integration for notifications.

**Setup:**

1. Create Slack App with Incoming Webhooks
2. Get webhook URL
3. Configure Terminal:

```yaml
# .terminal.yml
notifications:
  channels:
    slack:
      enabled: true
      webhook_url: "${SLACK_WEBHOOK_URL}"
      channel: "#terminal-notifications"
```

**Notifications Include:**
- Deployment status
- Security alerts
- Test failures
- Command completions
- Custom events

See [Integration Guide](configuration.md#slack-integration)

### Does Terminal work with Discord?

Yes! Discord webhook integration available.

**Setup:**

1. Server Settings → Integrations → Webhooks
2. Create webhook, copy URL
3. Configure Terminal:

```yaml
# .terminal.yml
notifications:
  channels:
    discord:
      enabled: true
      webhook_url: "${DISCORD_WEBHOOK_URL}"
```

### Can I integrate with JIRA?

Yes! JIRA integration for issue tracking.

```yaml
# .terminal.yml
integrations:
  jira:
    enabled: true
    url: "https://your-company.atlassian.net"
    email: "${JIRA_EMAIL}"
    api_token: "${JIRA_API_TOKEN}"
    project_key: "TERM"
    create_issues: true
    sync_status: true
```

**Features:**
- Auto-create JIRA issues from GitHub issues
- Sync status between JIRA and GitHub
- Link PRs to JIRA tickets
- Update JIRA when PR merged

### Can Terminal trigger GitHub Actions workflows?

Yes! Terminal can dispatch workflow runs.

**Command:**
```bash
/terminal deploy --environment staging
```

**Workflow:**
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  repository_dispatch:
    types: [deploy]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        run: ./deploy.sh ${{ github.event.client_payload.environment }}
```

**Configuration:**
```yaml
# .terminal.yml
ci_cd:
  github_actions:
    enabled: true
    workflows:
      - deploy
```

### Can I use Terminal with CI/CD pipelines?

Yes! Terminal integrates with:

- GitHub Actions
- Jenkins
- CircleCI
- Travis CI
- GitLab CI
- Azure Pipelines
- AWS CodePipeline
- Custom CI/CD

**Example: Jenkins Integration**

```groovy
// Jenkinsfile
pipeline {
  agent any
  
  triggers {
    githubWebhooks()
  }
  
  stages {
    stage('Terminal Command') {
      when {
        expression {
          return env.GITHUB_COMMENT?.contains('/terminal')
        }
      }
      steps {
        sh 'terminal-cli execute "${GITHUB_COMMENT}"'
      }
    }
  }
}
```

## Troubleshooting

### Commands aren't working. What should I check?

**Quick Checklist:**

1. ✓ Is server running?
   ```bash
   curl http://localhost:3000
   ```

2. ✓ Is webhook configured?
   - GitHub Settings → Webhooks
   - Check Recent Deliveries

3. ✓ Is syntax correct?
   ```bash
   /terminal help  # Correct
   /Terminal help  # Wrong (capital T)
   ```

4. ✓ Are environment variables set?
   ```bash
   echo $GITHUB_TOKEN
   echo $WEBHOOK_SECRET
   ```

5. ✓ Check logs:
   ```bash
   tail -f logs/terminal.log
   ```

See [Troubleshooting Guide](troubleshooting.md) for comprehensive help.

### How do I debug webhook issues?

**Steps:**

1. **Check Webhook Deliveries:**
   - Repository Settings → Webhooks
   - Click on webhook
   - View "Recent Deliveries"
   - Check status code and response

2. **Verify Signature:**
   ```bash
   # Signature should match
   # X-Hub-Signature-256 header
   ```

3. **Test Locally:**
   ```bash
   # Use ngrok for local testing
   ngrok http 3000
   ```

4. **Check Logs:**
   ```bash
   # Server logs should show webhook received
   grep "webhook" logs/terminal.log
   ```

5. **Manual Test:**
   ```bash
   # Send test webhook
   curl -X POST http://localhost:3000/webhooks \
     -H "Content-Type: application/json" \
     -d @test-payload.json
   ```

### What if I hit GitHub API rate limits?

**Solutions:**

1. **Check Current Limit:**
   ```bash
   curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/rate_limit
   ```

2. **Use Authenticated Requests:**
   - Authenticated: 5,000 req/hour
   - Unauthenticated: 60 req/hour

3. **Enable Caching:**
   ```yaml
   # .terminal.yml
   performance:
     cache:
       enabled: true
       ttl: 3600
   ```

4. **Use GraphQL:**
   - More efficient than REST API
   - Batch multiple requests

5. **Wait for Reset:**
   - Rate limit resets every hour
   - Check `X-RateLimit-Reset` header

6. **Upgrade to Enterprise:**
   - Higher rate limits
   - Dedicated rate limit pool

## Development and Contributing

### How can I contribute to Terminal?

**Ways to Contribute:**

1. **Code Contributions:**
   - Fix bugs
   - Add features
   - Improve performance
   - Write tests

2. **Documentation:**
   - Fix typos
   - Add examples
   - Write tutorials
   - Translate docs

3. **Community Support:**
   - Answer questions
   - Report bugs
   - Test features
   - Share use cases

4. **Feature Requests:**
   - Open GitHub issues
   - Discuss in Discussions
   - Vote on features

**Getting Started:**
1. Read [CONTRIBUTING.md](../CONTRIBUTING.md)
2. Find "good first issue" label
3. Comment on issue to claim
4. Fork repository
5. Create feature branch
6. Submit pull request

### How do I set up a development environment?

**Quick Setup:**

```bash
# Clone repository
git clone https://github.com/SolanaRemix/terminal.git
cd terminal

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your GitHub token

# Build
npm run build

# Run in development mode
npm run dev

# Run tests
npm test
```

**Detailed Guide:** See [Development Guide](development.md)

### Can I build plugins for Terminal?

Yes! Plugin system is in development.

**Current Approach:**
- Fork repository
- Add custom commands
- Deploy your version

**Future Plugin System:**
```typescript
// terminal-plugin-custom.ts
export default class CustomPlugin implements TerminalPlugin {
  name = 'custom-plugin';
  version = '1.0.0';
  
  commands = {
    customcommand: this.handleCustomCommand
  };
  
  async handleCustomCommand(ctx: CommandContext) {
    // Your logic
  }
}
```

**Coming Soon:**
- Plugin marketplace
- NPM-based plugins
- Hot-reloading
- Plugin configuration UI

### How can I report bugs?

**Bug Report:**

1. **Search Existing Issues:**
   https://github.com/SolanaRemix/terminal/issues

2. **Create New Issue:**
   - Click "New Issue"
   - Select "Bug Report" template
   - Fill in details:
     - Description
     - Steps to reproduce
     - Expected vs actual behavior
     - Environment info
     - Logs and screenshots

3. **Follow Up:**
   - Respond to questions
   - Test proposed fixes
   - Confirm resolution

**Security Issues:**
- Don't create public issue
- Email: security@cyberai.dev
- Follow [Security Policy](../SECURITY.md)

### How often is Terminal updated?

**Release Schedule:**

- **Minor Updates:** Every 2-3 weeks
- **Major Updates:** Every 2-3 months
- **Patches:** As needed (bugs, security)

**Update Notifications:**
- Watch GitHub repository
- Subscribe to releases
- Join Discord/mailing list

**Staying Updated:**

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update Terminal
git pull origin main
npm install
npm run build
```

**Automatic Updates (Cloud):**
- Cloud version always latest
- No action needed from you

## Enterprise Features

### What's included in Enterprise?

**Enterprise Plan Includes:**

**Features:**
- ✅ Unlimited repositories
- ✅ Unlimited commands
- ✅ All CyberAi ecosystem features
- ✅ Custom integrations
- ✅ Advanced security
- ✅ Compliance certifications
- ✅ Audit logging
- ✅ SSO/SAML
- ✅ IP allowlisting
- ✅ Priority support
- ✅ Dedicated account manager
- ✅ SLA guarantees (99.9%)
- ✅ On-premise deployment option
- ✅ Custom development
- ✅ Training and onboarding

**Support:**
- 24/7 support via phone, email, chat
- 4-hour response time
- Quarterly business reviews
- Direct access to engineering team

**Contact:** enterprise@cyberai.dev

### Can Terminal be deployed on-premise?

Yes! Enterprise customers can deploy on-premise.

**Deployment Options:**

1. **Docker Containers:**
   ```bash
   docker pull cyberai/terminal:enterprise
   docker run -d --name terminal \
     -p 3000:3000 \
     -e GITHUB_TOKEN=xxx \
     cyberai/terminal:enterprise
   ```

2. **Kubernetes:**
   ```yaml
   # Helm chart available
   helm install terminal cyberai/terminal \
     --set github.token=xxx \
     --set replicas=3
   ```

3. **VM Installation:**
   ```bash
   # Standard installation on your VMs
   npm install -g @cyberai/terminal-enterprise
   terminal-enterprise start
   ```

**Benefits:**
- Full data control
- Meet compliance requirements
- Custom network configuration
- Integration with internal systems
- Air-gapped deployment option

**Requirements:**
- Enterprise license
- Dedicated infrastructure
- Technical support contact

### Does Terminal support SSO/SAML?

Yes! Enterprise plan includes SSO/SAML integration.

**Supported Providers:**
- Okta
- Azure AD
- Google Workspace
- OneLogin
- Auth0
- ADFS
- Custom SAML 2.0

**Setup:**
1. Contact enterprise team
2. Provide SAML metadata
3. Configure identity provider
4. Test authentication
5. Roll out to organization

**Features:**
- Single sign-on
- Automatic provisioning
- Role mapping
- Group synchronization
- Session management

### Is there an SLA for Enterprise?

Yes! Enterprise includes SLA.

**Standard SLA:**
- **Uptime:** 99.9% monthly
- **Support Response:** 4 hours
- **Planned Maintenance:** Announced 7 days ahead
- **Credits:** Available for downtime

**Premium SLA (Optional):**
- **Uptime:** 99.99% monthly
- **Support Response:** 1 hour
- **24/7 Phone Support:** Included
- **Dedicated Infrastructure:** Available

**SLA Monitoring:**
- Real-time status page
- Automated alerts
- Monthly reports
- Transparent metrics

### Can I get dedicated support?

Yes! Available in Pro and Enterprise tiers.

**Pro Support:**
- Email support
- 24-hour response time
- Business hours (Mon-Fri, 9am-5pm)
- Documentation access
- Community priority

**Enterprise Support:**
- Email, phone, chat support
- 4-hour response time
- 24/7 availability
- Dedicated Slack channel
- Quarterly reviews
- Direct engineering access
- Custom training

**Premium Support (Enterprise Add-on):**
- 1-hour response time
- Named support engineer
- Proactive monitoring
- Unlimited training
- Custom development hours

---

**Have more questions?** 

- 📚 Check our [Documentation](index.md)
- 💬 Join [GitHub Discussions](https://github.com/SolanaRemix/terminal/discussions)
- 📧 Email us at support@cyberai.dev
- 🐛 Report bugs at https://github.com/SolanaRemix/terminal/issues

**Stay Connected:**
- Twitter: [@CyberAiDev](https://twitter.com/cyberaidev)
- Blog: https://blog.cyberai.dev
- Newsletter: Subscribe at https://terminal.cyberai.dev

---

**Get the answers you need to succeed with Terminal!** 🚀

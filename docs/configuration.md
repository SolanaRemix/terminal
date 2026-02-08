# Configuration Guide

Complete configuration reference for CyberAi Terminal including environment variables, configuration files, GitHub App setup, and security settings.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Configuration File (.terminal.yml)](#configuration-file-terminalyml)
- [GitHub App Setup](#github-app-setup)
- [Integration Settings](#integration-settings)
- [Security Settings](#security-settings)
- [Common Configuration Scenarios](#common-configuration-scenarios)

## Environment Variables

### Required Variables

#### GITHUB_TOKEN

GitHub personal access token or GitHub App installation token for API authentication.

**Required Scopes:**
- `repo` - Full repository access
- `write:discussion` - Comment on issues and PRs
- `read:org` - Read organization membership

**Setup:**
```bash
export GITHUB_TOKEN="ghp_your_token_here"
```

**GitHub App Installation Token:**
```bash
# Automatically provided when running as GitHub App
export GITHUB_TOKEN="${INSTALLATION_TOKEN}"
```

**Best Practices:**
- Use installation tokens for GitHub Apps (automatically rotated)
- Never commit tokens to source control
- Use GitHub Secrets in CI/CD workflows
- Rotate tokens regularly
- Use least privilege principle

### Optional Variables

#### WEBHOOK_SECRET

Secret for validating GitHub webhook signatures. Ensures webhooks are from GitHub.

**Default:** `"change-me"`

**Setup:**
```bash
# Generate strong secret
export WEBHOOK_SECRET=$(openssl rand -hex 32)
```

**Configuration in GitHub:**
1. Go to repository Settings → Webhooks
2. Edit webhook
3. Enter same secret in "Secret" field
4. Save

**Security:** Use a cryptographically random secret (64+ characters)

#### PORT

HTTP server listening port for webhook endpoint.

**Default:** `3000`

**Setup:**
```bash
export PORT=8080
```

**Production Considerations:**
- Use port 80/443 behind reverse proxy
- Configure firewall rules
- Use load balancer for high availability

#### NODE_ENV

Node.js environment mode.

**Values:** `development`, `production`, `test`

**Default:** `development`

**Setup:**
```bash
export NODE_ENV=production
```

**Impact:**
- Logging verbosity
- Error reporting detail
- Performance optimizations
- Debug features

#### LOG_LEVEL

Logging verbosity level.

**Values:** `error`, `warn`, `info`, `debug`, `trace`

**Default:** `info`

**Setup:**
```bash
export LOG_LEVEL=debug
```

#### GITHUB_API_URL

GitHub API base URL (for GitHub Enterprise).

**Default:** `https://api.github.com`

**GitHub Enterprise Setup:**
```bash
export GITHUB_API_URL="https://github.your-company.com/api/v3"
```

#### RATE_LIMIT_MAX

Maximum requests per window for rate limiting.

**Default:** `100`

**Setup:**
```bash
export RATE_LIMIT_MAX=1000
```

#### RATE_LIMIT_WINDOW

Rate limit time window in milliseconds.

**Default:** `900000` (15 minutes)

**Setup:**
```bash
export RATE_LIMIT_WINDOW=3600000  # 1 hour
```

### CyberAi Ecosystem Variables

#### CYBERAI_API_KEY

API key for CyberAi enterprise features.

**Setup:**
```bash
export CYBERAI_API_KEY="ca_your_api_key"
```

**Required for:**
- `/terminal CyberAi` command
- Enterprise analytics
- Multi-repo orchestration

#### SMARTBRAIN_API_KEY

API key for SmartBrain AI features.

**Setup:**
```bash
export SMARTBRAIN_API_KEY="sb_your_api_key"
```

**Required for:**
- `/terminal SmartBrain` command
- AI code review
- Intelligent suggestions

#### SMARTCONTRACT_AUDIT_KEY

API key for smart contract auditing.

**Setup:**
```bash
export SMARTCONTRACT_AUDIT_KEY="sca_your_api_key"
```

**Required for:**
- `/terminal SmartContractAudit` command
- Blockchain security scanning

### Environment File (.env)

Create `.env` file in project root:

```bash
# .env
# GitHub Configuration
GITHUB_TOKEN=ghp_your_token_here
WEBHOOK_SECRET=your_webhook_secret
GITHUB_API_URL=https://api.github.com

# Server Configuration
PORT=3000
NODE_ENV=production
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# CyberAi Ecosystem
CYBERAI_API_KEY=ca_your_api_key
SMARTBRAIN_API_KEY=sb_your_api_key
SMARTCONTRACT_AUDIT_KEY=sca_your_api_key

# Optional: Database (future)
# DATABASE_URL=postgresql://user:pass@localhost:5432/terminal

# Optional: Redis (future)
# REDIS_URL=redis://localhost:6379
```

**Load environment file:**
```bash
# Using source
source .env

# Using node package
npm install dotenv
```

**In code:**
```typescript
// src/config.ts
import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  githubToken: process.env.GITHUB_TOKEN,
  webhookSecret: process.env.WEBHOOK_SECRET,
  port: parseInt(process.env.PORT || '3000'),
};
```

## Configuration File (.terminal.yml)

Repository-level configuration file for Terminal behavior and features.

### File Location

Place `.terminal.yml` in repository root:

```
your-repo/
├── .terminal.yml
├── .github/
├── src/
└── package.json
```

### Basic Configuration

```yaml
# .terminal.yml
# CyberAi Terminal Configuration

# General Settings
version: 1
enabled: true

# Command Settings
commands:
  # Core commands
  help: true
  status: true
  scan: true
  merge: true
  tag: true
  
  # Advanced commands
  audit: true
  fix: true
  deploy: true
  
  # CyberAi ecosystem
  cyberai: false        # Requires enterprise tier
  smartbrain: true      # Requires pro tier
  smartcontractaudit: false
  gitantivirus: true
  nodeaudit: true
  conflictsresolver: true

# Feature Flags
features:
  auto_sync: true
  auto_test: true
  auto_analysis: true
  auto_fix: false
```

### Complete Configuration Reference

```yaml
# .terminal.yml
# Complete Configuration Reference

# ============================================
# General Settings
# ============================================
version: 1
enabled: true
name: "CyberAi Terminal"
description: "Automated repository management"

# ============================================
# Command Configuration
# ============================================
commands:
  # Enable/disable individual commands
  help: true
  status: true
  scan: true
  merge: true
  tag: true
  audit: true
  fix: true
  deploy: true
  cyberai: false
  smartbrain: true
  smartcontractaudit: false
  gitantivirus: true
  nodeaudit: true
  conflictsresolver: true
  
  # Command-specific settings
  merge:
    enabled: true
    default_method: squash  # squash, merge, rebase
    require_reviews: true
    min_approvals: 1
    require_checks: true
    delete_branch: true
    auto_merge: false
  
  tag:
    enabled: true
    prefix: "v"  # Tags will be v1.0.0, v1.0.1, etc.
    annotated: true
    push_to_remote: true
  
  deploy:
    enabled: true
    environments:
      - staging
      - production
    require_approval:
      production: true
      staging: false
    notifications: true

# ============================================
# Permissions & Access Control
# ============================================
permissions:
  # Default permissions for all commands
  default: read
  
  # Command-specific permissions
  command_permissions:
    status: read
    scan: read
    audit: read
    merge: write
    tag: write
    deploy: admin
    fix: write
  
  # User/Team specific permissions
  users:
    - username: octocat
      permissions:
        - admin
    
    - username: developer1
      permissions:
        - write
  
  teams:
    - team: core-team
      permissions:
        - admin
    
    - team: contributors
      permissions:
        - write
  
  # Require specific permissions for sensitive operations
  require_admin:
    - deploy
    - merge_to_main
  
  # Allow override of protection rules
  override_protections: false

# ============================================
# Automation Features
# ============================================
automation:
  # Auto Sync
  auto_sync:
    enabled: true
    schedule: "0 2 * * *"  # Daily at 2 AM
    branches:
      - main
      - develop
    strategy: rebase
    conflict_resolution: manual
  
  # Auto Test
  auto_test:
    enabled: true
    on_events:
      - pull_request
      - push
    frameworks:
      - jest
      - mocha
      - pytest
    coverage:
      enabled: true
      threshold: 80
      fail_below: true
    parallel: true
    timeout: 1800  # 30 minutes
  
  # Auto Analysis
  auto_analysis:
    enabled: true
    schedule: "0 3 * * *"  # Daily at 3 AM
    on_events:
      - pull_request
      - push
    tools:
      - eslint
      - prettier
      - codeql
      - sonarqube
    thresholds:
      code_quality: 7.0
      security: high
      maintainability: B
    create_issues: true
    comment_on_pr: true
  
  # Auto Fix
  auto_fix:
    enabled: false  # Requires explicit opt-in
    mode: safe  # safe, balanced, aggressive
    auto_apply:
      on_analysis: false
      require_approval: true
      create_pr: true
    categories:
      style: true
      security: true
      performance: true
      bugs: true
      best_practices: true
    safety:
      run_tests_before: true
      run_tests_after: true
      rollback_on_failure: true
      max_fixes_per_batch: 10

# ============================================
# Notifications
# ============================================
notifications:
  enabled: true
  
  # Channels
  channels:
    slack:
      enabled: false
      webhook_url: "${SLACK_WEBHOOK_URL}"
      channel: "#terminal-notifications"
      mentions:
        on_failure: true
        on_success: false
    
    discord:
      enabled: false
      webhook_url: "${DISCORD_WEBHOOK_URL}"
    
    email:
      enabled: true
      recipients:
        - team@example.com
      on_events:
        - deployment
        - security_alert
        - critical_failure
    
    github:
      enabled: true
      comment_on_pr: true
      create_issues: true
      labels:
        security: security
        bug: bug
        enhancement: enhancement
  
  # Notification Rules
  rules:
    - event: security_alert
      severity: high
      channels: [slack, email]
      priority: urgent
    
    - event: deployment
      environment: production
      channels: [slack]
      priority: high
    
    - event: test_failure
      channels: [github]
      priority: normal

# ============================================
# Security Settings
# ============================================
security:
  # Vulnerability Scanning
  vulnerability_scanning:
    enabled: true
    schedule: "0 4 * * *"  # Daily at 4 AM
    severity_threshold: medium
    auto_create_issues: true
    block_pr_on_critical: true
  
  # Dependency Auditing
  dependency_audit:
    enabled: true
    on_events:
      - pull_request
      - schedule
    schedule: "0 5 * * *"
    auto_update_dependencies: false
    allowed_licenses:
      - MIT
      - Apache-2.0
      - BSD-3-Clause
    blocked_licenses:
      - GPL-3.0
      - AGPL-3.0
  
  # Code Scanning
  code_scanning:
    enabled: true
    tools:
      - codeql
      - snyk
      - gitantivirus
    languages:
      - javascript
      - typescript
      - python
      - go
    schedule: "0 6 * * *"
  
  # Secret Detection
  secret_detection:
    enabled: true
    patterns:
      - api_keys
      - passwords
      - tokens
      - certificates
    exclude_paths:
      - "**/*.test.ts"
      - "**/fixtures/**"
    action: block  # block, warn, notify
  
  # Access Control
  access_control:
    require_2fa: true
    require_signed_commits: false
    allowed_ip_ranges:
      - "0.0.0.0/0"  # All IPs (default)
    rate_limiting:
      enabled: true
      max_requests: 100
      window: 900  # 15 minutes

# ============================================
# CI/CD Integration
# ============================================
ci_cd:
  # GitHub Actions
  github_actions:
    enabled: true
    workflows:
      - test
      - build
      - deploy
    required_checks:
      - "test / unit-tests"
      - "build / build"
    auto_merge_on_success: false
  
  # External CI/CD
  external_ci:
    jenkins:
      enabled: false
      url: "https://jenkins.example.com"
      job: "terminal-build"
    
    circle_ci:
      enabled: false
      api_token: "${CIRCLE_CI_TOKEN}"
    
    travis_ci:
      enabled: false

# ============================================
# Repository Rules
# ============================================
repository:
  # Branch Protection
  branch_protection:
    main:
      require_pull_request: true
      require_reviews: true
      required_reviewers: 2
      dismiss_stale_reviews: true
      require_code_owner_reviews: true
      require_status_checks: true
      required_checks:
        - test
        - lint
        - security-scan
      restrict_pushes: true
      allowed_push_users:
        - octocat
    
    develop:
      require_pull_request: true
      require_reviews: true
      required_reviewers: 1
  
  # Commit Message Rules
  commit_messages:
    enforce_conventional_commits: true
    types:
      - feat
      - fix
      - docs
      - style
      - refactor
      - test
      - chore
    scopes:
      - core
      - cli
      - docs
      - ci
    require_issue_reference: false
  
  # PR Rules
  pull_requests:
    template: .github/PULL_REQUEST_TEMPLATE.md
    require_description: true
    min_description_length: 50
    require_linked_issues: true
    auto_assign_reviewers: true
    auto_add_labels: true
    conflict_resolution: manual

# ============================================
# Monitoring & Analytics
# ============================================
monitoring:
  enabled: true
  
  # Metrics Collection
  metrics:
    enabled: true
    collect_interval: 300  # 5 minutes
    retention_days: 90
    metrics:
      - command_usage
      - response_time
      - error_rate
      - success_rate
  
  # Health Checks
  health_checks:
    enabled: true
    interval: 60  # 1 minute
    endpoints:
      - /health
      - /metrics
    alerts:
      enabled: true
      threshold:
        error_rate: 5  # percent
        response_time: 5000  # ms
  
  # Logging
  logging:
    enabled: true
    level: info  # error, warn, info, debug, trace
    format: json
    output:
      - console
      - file
    file:
      path: ./logs/terminal.log
      max_size: 100  # MB
      max_files: 10
      compress: true
  
  # APM Integration
  apm:
    datadog:
      enabled: false
      api_key: "${DATADOG_API_KEY}"
      service_name: terminal
    
    new_relic:
      enabled: false
      license_key: "${NEW_RELIC_LICENSE}"
    
    sentry:
      enabled: true
      dsn: "${SENTRY_DSN}"
      environment: production
      traces_sample_rate: 0.1

# ============================================
# Performance & Scaling
# ============================================
performance:
  # Caching
  cache:
    enabled: true
    provider: memory  # memory, redis, memcached
    ttl: 3600  # 1 hour
    max_size: 100  # MB
  
  # Rate Limiting
  rate_limiting:
    enabled: true
    strategy: sliding_window
    limits:
      default:
        max: 100
        window: 900  # 15 minutes
      authenticated:
        max: 1000
        window: 900
      premium:
        max: 10000
        window: 900
  
  # Concurrency
  concurrency:
    max_concurrent_commands: 10
    queue_size: 100
    timeout: 300  # 5 minutes
  
  # Optimization
  optimization:
    enable_compression: true
    enable_http2: false
    connection_pooling: true
    lazy_loading: true

# ============================================
# Custom Integrations
# ============================================
integrations:
  # Jira
  jira:
    enabled: false
    url: "https://your-company.atlassian.net"
    email: "${JIRA_EMAIL}"
    api_token: "${JIRA_API_TOKEN}"
    project_key: TERM
    create_issues: true
    sync_status: true
  
  # Slack
  slack:
    enabled: false
    workspace: your-workspace
    app_token: "${SLACK_APP_TOKEN}"
    bot_token: "${SLACK_BOT_TOKEN}"
    channels:
      alerts: "#terminal-alerts"
      deployments: "#deployments"
  
  # PagerDuty
  pagerduty:
    enabled: false
    integration_key: "${PAGERDUTY_KEY}"
    severity_threshold: high
  
  # Custom Webhooks
  webhooks:
    - name: custom-integration
      url: "https://api.example.com/webhooks"
      events:
        - deployment
        - security_alert
      headers:
        Authorization: "Bearer ${CUSTOM_TOKEN}"
      retry:
        enabled: true
        max_attempts: 3
        backoff: exponential

# ============================================
# Advanced Features
# ============================================
advanced:
  # Machine Learning
  ml:
    enabled: false
    model_version: latest
    confidence_threshold: 0.8
    features:
      - code_review
      - bug_prediction
      - performance_optimization
  
  # Custom Scripts
  custom_scripts:
    enabled: true
    directory: .terminal/scripts
    timeout: 600  # 10 minutes
    environment:
      NODE_ENV: production
  
  # Plugins
  plugins:
    enabled: true
    directory: .terminal/plugins
    auto_load: true
    whitelist:
      - terminal-plugin-custom-checks
      - terminal-plugin-metrics
  
  # Experimental Features
  experimental:
    enabled: false
    features:
      - ai_code_generation
      - predictive_analytics
      - automated_refactoring

# ============================================
# Pricing Tier Features
# ============================================
tier: pro  # free, pro, enterprise

tier_features:
  free:
    max_commands_per_month: 100
    max_repositories: 3
    features:
      - help
      - status
      - scan
  
  pro:
    max_commands_per_month: 1000
    max_repositories: 50
    features:
      - all_core_commands
      - smartbrain
      - auto_analysis
      - auto_test
  
  enterprise:
    max_commands_per_month: unlimited
    max_repositories: unlimited
    features:
      - all_features
      - custom_integrations
      - priority_support
      - sla: 99.9%

# ============================================
# Environment-Specific Configurations
# ============================================
environments:
  development:
    log_level: debug
    cache: false
    auto_reload: true
    mock_external_apis: true
  
  staging:
    log_level: info
    cache: true
    notifications:
      slack: true
      email: false
  
  production:
    log_level: warn
    cache: true
    monitoring: true
    high_availability: true
```

## GitHub App Setup

### Creating a GitHub App

1. **Navigate to GitHub Settings**
   - Personal Account: Settings → Developer settings → GitHub Apps
   - Organization: Settings → Developer settings → GitHub Apps

2. **Click "New GitHub App"**

3. **Configure Basic Information**
   ```
   GitHub App name: CyberAi Terminal
   Homepage URL: https://github.com/SolanaRemix/terminal
   Webhook URL: https://your-domain.com/webhooks
   Webhook secret: [Your webhook secret]
   ```

4. **Set Permissions**
   
   **Repository Permissions:**
   - Contents: Read & Write
   - Issues: Read & Write
   - Pull requests: Read & Write
   - Metadata: Read-only
   - Commit statuses: Read & Write
   - Deployments: Read & Write

   **Organization Permissions:**
   - Members: Read-only

5. **Subscribe to Events**
   - Issue comment
   - Pull request
   - Push
   - Status
   - Deployment

6. **Create the App**

7. **Generate Private Key**
   - After creation, scroll to "Private keys"
   - Click "Generate a private key"
   - Save the downloaded `.pem` file securely

### Installing the GitHub App

**For Your Repositories:**
1. Go to GitHub App page
2. Click "Install App"
3. Select account/organization
4. Choose repositories:
   - All repositories
   - Select specific repositories
5. Click "Install"

**For Organization:**
1. Organization owner must install
2. Set organization-level permissions
3. Configure repository access

### Configuring App Credentials

**Private Key:**
```bash
# Store private key securely
cp ~/Downloads/cyberai-terminal.2024-01-15.private-key.pem ~/.ssh/
chmod 600 ~/.ssh/cyberai-terminal.*.private-key.pem

# Reference in configuration
export GITHUB_APP_PRIVATE_KEY_PATH=~/.ssh/cyberai-terminal.*.private-key.pem
```

**App ID:**
```bash
# Found on GitHub App settings page
export GITHUB_APP_ID=123456
```

**Installation ID:**
```bash
# Get from installation URL or API
# https://github.com/settings/installations/INSTALLATION_ID
export GITHUB_APP_INSTALLATION_ID=789012
```

### Generating Installation Tokens

**Using Octokit:**
```typescript
import { App } from '@octokit/app';
import { readFileSync } from 'fs';

const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: readFileSync(process.env.GITHUB_APP_PRIVATE_KEY_PATH!, 'utf8'),
});

// Get installation token
const installationId = parseInt(process.env.GITHUB_APP_INSTALLATION_ID!);
const { token } = await app.octokit.auth({
  type: 'installation',
  installationId,
});

// Use token for API requests
process.env.GITHUB_TOKEN = token;
```

**Token Expiration:**
- Installation tokens expire after 1 hour
- Automatically refresh before expiration
- Implement token caching and refresh logic

### App Webhook Configuration

**Webhook Endpoint:**
```typescript
// src/server.ts
import { Webhooks } from '@octokit/webhooks';

const webhooks = new Webhooks({
  secret: process.env.WEBHOOK_SECRET!,
});

webhooks.on('issue_comment.created', async ({ payload }) => {
  // Handle webhook
});
```

**Webhook Security:**
- Always validate signature
- Use HTTPS in production
- Set strong webhook secret
- Implement rate limiting
- Log all webhook events

**Webhook Delivery:**
- GitHub retries failed webhooks
- Check "Recent Deliveries" in settings
- Debug with payload inspection
- Monitor delivery success rate

## Integration Settings

### GitHub Actions Integration

**Workflow Configuration:**

```yaml
# .github/workflows/terminal.yml
name: Terminal Commands

on:
  issue_comment:
    types: [created]

jobs:
  terminal:
    runs-on: ubuntu-latest
    if: startsWith(github.event.comment.body, '/terminal')
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: npm install
      
      - name: Run Terminal
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          WEBHOOK_SECRET: ${{ secrets.WEBHOOK_SECRET }}
        run: |
          npm run dev &
          sleep 5
          # Trigger webhook manually if needed
```

**Secrets Configuration:**
1. Repository Settings → Secrets and variables → Actions
2. Add secrets:
   - `GITHUB_TOKEN` (automatically provided)
   - `WEBHOOK_SECRET`
   - `CYBERAI_API_KEY`
   - `SMARTBRAIN_API_KEY`

### CI/CD Pipeline Integration

**Jenkins Integration:**

```groovy
// Jenkinsfile
pipeline {
  agent any
  
  environment {
    GITHUB_TOKEN = credentials('github-token')
    WEBHOOK_SECRET = credentials('webhook-secret')
  }
  
  stages {
    stage('Build') {
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }
    
    stage('Deploy Terminal') {
      steps {
        sh 'npm run deploy'
      }
    }
  }
  
  post {
    success {
      githubNotify status: 'SUCCESS'
    }
    failure {
      githubNotify status: 'FAILURE'
    }
  }
}
```

**CircleCI Integration:**

```yaml
# .circleci/config.yml
version: 2.1

jobs:
  deploy-terminal:
    docker:
      - image: cimg/node:18.0
    steps:
      - checkout
      - run: npm install
      - run: npm run build
      - run:
          name: Deploy
          command: |
            npm run deploy
          environment:
            GITHUB_TOKEN: $GITHUB_TOKEN
            WEBHOOK_SECRET: $WEBHOOK_SECRET

workflows:
  terminal-deployment:
    jobs:
      - deploy-terminal:
          filters:
            branches:
              only: main
```

### Slack Integration

**Setup:**

1. Create Slack App: https://api.slack.com/apps
2. Enable Incoming Webhooks
3. Add to workspace
4. Copy webhook URL

**Configuration:**

```yaml
# .terminal.yml
notifications:
  channels:
    slack:
      enabled: true
      webhook_url: "${SLACK_WEBHOOK_URL}"
      channel: "#terminal-notifications"
      username: "CyberAi Terminal"
      icon_emoji: ":robot_face:"
      
      # Notification templates
      templates:
        deployment: |
          :rocket: Deployment to {environment}
          Repository: {repo}
          Status: {status}
          By: {user}
        
        security_alert: |
          :warning: Security Alert
          Severity: {severity}
          Issue: {issue}
          Repository: {repo}
```

**Environment Variable:**
```bash
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
```

### Discord Integration

**Configuration:**

```yaml
# .terminal.yml
notifications:
  channels:
    discord:
      enabled: true
      webhook_url: "${DISCORD_WEBHOOK_URL}"
      username: "CyberAi Terminal"
      avatar_url: "https://example.com/avatar.png"
```

### Email Notifications

**SMTP Configuration:**

```yaml
# .terminal.yml
notifications:
  channels:
    email:
      enabled: true
      smtp:
        host: smtp.gmail.com
        port: 587
        secure: false
        auth:
          user: "${SMTP_USER}"
          pass: "${SMTP_PASS}"
      from: "terminal@cyberai.dev"
      recipients:
        - team@example.com
        - ops@example.com
```

**Environment Variables:**
```bash
export SMTP_USER="your-email@gmail.com"
export SMTP_PASS="your-app-password"
```

## Security Settings

### Authentication

**Token Security:**

```yaml
# .terminal.yml
security:
  authentication:
    require_github_token: true
    token_expiry: 3600  # 1 hour
    refresh_before_expiry: 300  # 5 minutes
    
    # Token validation
    validate_token:
      enabled: true
      check_scopes: true
      required_scopes:
        - repo
        - write:discussion
```

### Authorization

**Role-Based Access Control:**

```yaml
# .terminal.yml
security:
  authorization:
    enabled: true
    
    # Define roles
    roles:
      admin:
        permissions: ["*"]
        users:
          - octocat
          - admin-user
      
      developer:
        permissions:
          - "command:status"
          - "command:scan"
          - "command:merge"
          - "command:tag"
        teams:
          - core-team
          - backend-team
      
      viewer:
        permissions:
          - "command:help"
          - "command:status"
        users:
          - viewer-user
    
    # Default role for users not in any role
    default_role: viewer
    
    # Require specific role for sensitive operations
    protected_commands:
      deploy:
        require_role: admin
        require_approval: true
      
      merge:
        require_role: developer
        min_approvals: 1
```

### Rate Limiting

**Advanced Rate Limiting:**

```yaml
# .terminal.yml
security:
  rate_limiting:
    enabled: true
    
    # Global limits
    global:
      max_requests: 1000
      window: 3600  # 1 hour
      burst: 50
    
    # Per-user limits
    per_user:
      free:
        max_requests: 100
        window: 3600
      pro:
        max_requests: 1000
        window: 3600
      enterprise:
        max_requests: 10000
        window: 3600
    
    # Per-command limits
    per_command:
      deploy:
        max_requests: 10
        window: 3600
      merge:
        max_requests: 50
        window: 3600
    
    # Rate limit headers
    include_headers: true
    header_prefix: "X-RateLimit-"
    
    # Actions on limit exceeded
    on_limit_exceeded:
      action: reject  # reject, queue, throttle
      message: "Rate limit exceeded. Please try again later."
      retry_after: true
```

### IP Allowlisting

```yaml
# .terminal.yml
security:
  ip_allowlist:
    enabled: false
    mode: whitelist  # whitelist, blacklist
    
    # Allowed IP ranges (CIDR notation)
    allowed_ips:
      - "192.168.1.0/24"
      - "10.0.0.0/8"
      - "0.0.0.0/0"  # Allow all (default)
    
    # Blocked IPs
    blocked_ips:
      - "203.0.113.0/24"
    
    # Action on blocked IP
    on_blocked:
      action: reject
      log: true
      notify: true
```

### Webhook Signature Verification

**Validation:**

```typescript
// src/security/webhook.ts
import { createHmac } from 'crypto';

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  const digest = 'sha256=' + hmac.digest('hex');
  
  return signature === digest;
}
```

**Configuration:**

```yaml
# .terminal.yml
security:
  webhook_verification:
    enabled: true
    algorithm: sha256
    header: x-hub-signature-256
    
    # Reject unsigned webhooks
    reject_unsigned: true
    
    # Timestamp verification (replay attack prevention)
    verify_timestamp: true
    timestamp_tolerance: 300  # 5 minutes
```

### Secrets Management

**Using Environment Variables:**

```bash
# .env (never commit!)
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
WEBHOOK_SECRET=super_secret_webhook_key
CYBERAI_API_KEY=ca_xxxxxxxxxxxx
SMARTBRAIN_API_KEY=sb_xxxxxxxxxxxx
```

**Using Secrets Manager:**

```typescript
// src/config/secrets.ts
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export async function getSecret(name: string): Promise<string> {
  const [version] = await client.accessSecretVersion({
    name: `projects/PROJECT_ID/secrets/${name}/versions/latest`,
  });
  
  return version.payload?.data?.toString() || '';
}

// Usage
const githubToken = await getSecret('github-token');
const webhookSecret = await getSecret('webhook-secret');
```

**Configuration:**

```yaml
# .terminal.yml
security:
  secrets:
    provider: env  # env, aws-secrets-manager, gcp-secret-manager, azure-key-vault
    
    # AWS Secrets Manager
    aws:
      region: us-east-1
      secret_prefix: "terminal/"
    
    # GCP Secret Manager
    gcp:
      project_id: "my-project"
      secret_prefix: "terminal-"
    
    # Azure Key Vault
    azure:
      vault_url: "https://myvault.vault.azure.net/"
      secret_prefix: "terminal-"
    
    # Rotation
    rotation:
      enabled: true
      frequency: 2592000  # 30 days
      notify_before: 604800  # 7 days
```

### Audit Logging

**Configuration:**

```yaml
# .terminal.yml
security:
  audit_logging:
    enabled: true
    
    # Log all events
    log_events:
      - command_executed
      - authentication
      - authorization
      - configuration_changed
      - deployment
      - security_alert
    
    # Log format
    format: json
    
    # Storage
    storage:
      type: file  # file, database, s3, cloudwatch
      path: ./logs/audit.log
      retention: 365  # days
      
      # Rotate logs
      rotation:
        enabled: true
        max_size: 100  # MB
        max_files: 100
        compress: true
    
    # Include in logs
    include:
      user: true
      ip_address: true
      timestamp: true
      action: true
      resource: true
      result: true
      metadata: true
```

**Audit Log Format:**

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "event_type": "command_executed",
  "user": "octocat",
  "ip_address": "192.168.1.100",
  "action": "merge",
  "resource": "owner/repo#123",
  "result": "success",
  "metadata": {
    "command": "/terminal merge",
    "repository": "owner/repo",
    "pr_number": 123,
    "merge_method": "squash"
  }
}
```

## Common Configuration Scenarios

### Scenario 1: Small Team (< 10 developers)

```yaml
# .terminal.yml - Small Team Configuration
version: 1
enabled: true

commands:
  merge: true
  tag: true
  status: true
  scan: true

automation:
  auto_test:
    enabled: true
  auto_analysis:
    enabled: true
  auto_fix:
    enabled: false  # Manual fixes

permissions:
  default: write
  require_admin:
    - deploy

notifications:
  channels:
    github:
      enabled: true
      comment_on_pr: true

security:
  vulnerability_scanning:
    enabled: true
    severity_threshold: high
```

### Scenario 2: Enterprise Organization

```yaml
# .terminal.yml - Enterprise Configuration
version: 1
enabled: true

# All commands enabled
commands:
  cyberai: true
  smartbrain: true
  smartcontractaudit: true
  gitantivirus: true
  nodeaudit: true

# Advanced automation
automation:
  auto_sync:
    enabled: true
    schedule: "0 2 * * *"
  auto_test:
    enabled: true
    parallel: true
  auto_analysis:
    enabled: true
    create_issues: true
  auto_fix:
    enabled: true
    mode: balanced

# Strict permissions
permissions:
  authorization:
    enabled: true
    roles:
      admin:
        teams: [platform-team]
      developer:
        teams: [engineering]

# Multi-channel notifications
notifications:
  channels:
    slack:
      enabled: true
    email:
      enabled: true
    pagerduty:
      enabled: true

# Comprehensive security
security:
  vulnerability_scanning:
    enabled: true
    severity_threshold: low
  dependency_audit:
    enabled: true
    auto_update_dependencies: true
  secret_detection:
    enabled: true
    action: block
  access_control:
    require_2fa: true
    require_signed_commits: true

# Full monitoring
monitoring:
  enabled: true
  apm:
    datadog:
      enabled: true
    sentry:
      enabled: true
```

### Scenario 3: Open Source Project

```yaml
# .terminal.yml - Open Source Configuration
version: 1
enabled: true

# Core commands only
commands:
  help: true
  status: true
  scan: true
  merge: true

# Strict merge requirements
commands:
  merge:
    require_reviews: true
    min_approvals: 2
    require_checks: true

# Permissions for maintainers
permissions:
  command_permissions:
    merge: write
    tag: admin
  teams:
    - team: maintainers
      permissions: [admin]
  users:
    - username: project-owner
      permissions: [admin]

# Public notifications
notifications:
  channels:
    github:
      enabled: true
      comment_on_pr: true
      create_issues: true

# Security scanning
security:
  vulnerability_scanning:
    enabled: true
    auto_create_issues: true
  dependency_audit:
    enabled: true
  code_scanning:
    enabled: true
```

### Scenario 4: CI/CD Heavy Project

```yaml
# .terminal.yml - CI/CD Configuration
version: 1
enabled: true

commands:
  deploy: true
  test: true
  build: true

# Deploy configuration
commands:
  deploy:
    environments:
      - staging
      - production
    require_approval:
      production: true
    notifications: true

# Extensive testing
automation:
  auto_test:
    enabled: true
    on_events:
      - pull_request
      - push
    frameworks:
      - jest
      - cypress
      - playwright
    coverage:
      enabled: true
      threshold: 85
      fail_below: true
    parallel: true

# CI/CD integration
ci_cd:
  github_actions:
    enabled: true
    workflows:
      - test
      - build
      - deploy
    required_checks:
      - "test / unit"
      - "test / integration"
      - "test / e2e"
      - "build / build"
    auto_merge_on_success: false

# Deployment notifications
notifications:
  rules:
    - event: deployment
      environment: production
      channels: [slack, email, pagerduty]
      priority: urgent
```

### Scenario 5: Security-Focused Project

```yaml
# .terminal.yml - Security-Focused Configuration
version: 1
enabled: true

commands:
  scan: true
  audit: true
  gitantivirus: true
  nodeaudit: true

# Comprehensive security
security:
  vulnerability_scanning:
    enabled: true
    schedule: "0 */6 * * *"  # Every 6 hours
    severity_threshold: low
    auto_create_issues: true
    block_pr_on_critical: true
  
  dependency_audit:
    enabled: true
    on_events:
      - pull_request
      - push
      - schedule
    auto_update_dependencies: false
    blocked_licenses:
      - GPL-3.0
      - AGPL-3.0
  
  code_scanning:
    enabled: true
    tools:
      - codeql
      - snyk
      - gitantivirus
    schedule: "0 2 * * *"
  
  secret_detection:
    enabled: true
    action: block
  
  access_control:
    require_2fa: true
    require_signed_commits: true

# Audit logging
security:
  audit_logging:
    enabled: true
    retention: 730  # 2 years

# Security notifications
notifications:
  rules:
    - event: security_alert
      severity: critical
      channels: [slack, email, pagerduty]
      priority: urgent
    - event: security_alert
      severity: high
      channels: [slack, email]
      priority: high
```

## Configuration Validation

**Validate Configuration:**

```bash
# Using CLI
terminal config validate

# Using API
curl -X POST https://api.terminal.cyberai.dev/config/validate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/yaml" \
  --data-binary @.terminal.yml
```

**Validation Response:**

```json
{
  "valid": true,
  "warnings": [
    "auto_fix.enabled is false - consider enabling for automated remediation"
  ],
  "errors": [],
  "suggestions": [
    "Enable auto_sync for better branch management",
    "Configure Slack notifications for team visibility"
  ]
}
```

## Configuration Best Practices

1. **Start Minimal** - Enable features gradually
2. **Use Version Control** - Track configuration changes
3. **Separate Secrets** - Never commit secrets
4. **Document Changes** - Comment configuration decisions
5. **Test Changes** - Validate before deploying
6. **Monitor Impact** - Track configuration effectiveness
7. **Regular Review** - Update configuration as team grows
8. **Follow Principle of Least Privilege** - Grant minimum permissions
9. **Enable Audit Logging** - Track all actions
10. **Use Strong Secrets** - Generate cryptographically random secrets

## Troubleshooting Configuration

**Common Issues:**

- **Invalid YAML syntax** - Use YAML validator
- **Missing environment variables** - Check `.env` file
- **Permission denied** - Verify GitHub App permissions
- **Webhook not receiving events** - Check webhook configuration
- **Rate limiting** - Increase limits or upgrade tier
- **Commands not working** - Verify command is enabled

**Debug Mode:**

```bash
# Enable debug logging
export LOG_LEVEL=debug
export NODE_ENV=development

# Run with verbose output
npm run dev -- --verbose
```

## Support

For configuration help:
- [Documentation](https://cyberai.network)
- [GitHub Issues](https://github.com/SolanaRemix/terminal/issues)
- Email: support@cyberai.dev

---

**Configure your repository automation with confidence**

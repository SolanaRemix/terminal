# Troubleshooting Guide

Comprehensive troubleshooting guide for CyberAi Terminal covering common issues, error messages, debugging steps, and solutions.

## Table of Contents

- [Quick Diagnostics](#quick-diagnostics)
- [Installation Issues](#installation-issues)
- [Configuration Problems](#configuration-problems)
- [Webhook Issues](#webhook-issues)
- [Command Execution Errors](#command-execution-errors)
- [GitHub API Issues](#github-api-issues)
- [Integration Problems](#integration-problems)
- [Performance Issues](#performance-issues)
- [Security and Permissions](#security-and-permissions)
- [Error Messages Reference](#error-messages-reference)
- [Debugging Tools](#debugging-tools)
- [Getting Help](#getting-help)

## Quick Diagnostics

### Health Check

Run these commands to quickly diagnose your Terminal installation:

```bash
# Check Terminal is running
curl http://localhost:3000
# Expected: "CyberAi Terminal"

# Check health endpoint
curl http://localhost:3000/health
# Expected: {"status":"healthy","uptime":...}

# Check environment variables
echo $GITHUB_TOKEN | cut -c1-10
# Expected: ghp_ or ghs_ prefix

echo $WEBHOOK_SECRET
# Expected: Your secret value

# Check Node.js version
node --version
# Expected: v18.0.0 or higher

# Check npm version
npm --version
# Expected: v9.0.0 or higher

# Check if port is in use
lsof -i :3000
# Or on Windows: netstat -ano | findstr :3000

# Test GitHub API access
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
# Expected: Your GitHub user info
```

### System Status

```bash
# Check disk space
df -h
# Ensure sufficient space

# Check memory usage
free -h
# Or on macOS: top -l 1 | grep PhysMem

# Check process status
ps aux | grep node
# Should show Terminal process

# Check logs
tail -f logs/terminal.log
# Or: pm2 logs terminal
```

### GitHub Integration Check

```bash
# Verify GitHub token
gh auth status

# Check webhook deliveries
# Go to: Repository → Settings → Webhooks → Recent Deliveries

# Test API rate limit
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/rate_limit
# Should show remaining requests
```

## Installation Issues

### Issue: npm install fails

**Symptoms:**
- Error during `npm install`
- Missing dependencies
- Permission errors

**Solutions:**

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try with legacy peer deps
npm install --legacy-peer-deps

# Update npm
npm install -g npm@latest

# Check Node.js version
node --version
# Upgrade if below v18

# Use specific Node.js version with nvm
nvm install 18
nvm use 18
npm install
```

**Permission Issues:**

```bash
# On macOS/Linux - fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or install with sudo (not recommended)
sudo npm install
```

### Issue: TypeScript compilation fails

**Symptoms:**
- `npm run build` fails
- TypeScript errors
- Missing type definitions

**Solutions:**

```bash
# Install TypeScript globally
npm install -g typescript

# Check TypeScript version
npx tsc --version

# Clear TypeScript cache
rm -rf dist
npm run build

# Fix type definitions
npm install --save-dev @types/node

# Check tsconfig.json
cat tsconfig.json
# Verify configuration is valid

# Run type check only
npx tsc --noEmit

# Build with verbose output
npx tsc --verbose
```

**Common TypeScript Errors:**

```typescript
// Error: Cannot find module '@octokit/core'
// Solution: Install dependencies
npm install @octokit/core

// Error: Property 'X' does not exist on type 'Y'
// Solution: Check type definitions or add type assertion
const value = (obj as any).property;

// Error: Module has no default export
// Solution: Use named import
import { Webhooks } from "@octokit/webhooks"; // Not: import Webhooks

// Error: Cannot find name 'process'
// Solution: Install Node.js types
npm install --save-dev @types/node
```

### Issue: Server won't start

**Symptoms:**
- Server exits immediately
- Port already in use
- Cannot bind to port

**Solutions:**

```bash
# Check if port is in use
lsof -i :3000
# Or: netstat -ano | findstr :3000

# Kill process using port
kill -9 $(lsof -t -i:3000)
# Or on Windows: taskkill /PID <pid> /F

# Use different port
PORT=8080 npm run dev

# Check for errors
npm run dev
# Read error messages carefully

# Run with debug logging
LOG_LEVEL=debug npm run dev

# Check environment variables
env | grep -E 'GITHUB|WEBHOOK|PORT'

# Verify build succeeded
ls -la dist/
# Should contain compiled JavaScript files
```

**Environment Variable Issues:**

```bash
# Create .env file if missing
cat > .env << EOF
GITHUB_TOKEN=your_token_here
WEBHOOK_SECRET=your_secret_here
PORT=3000
EOF

# Load environment variables
source .env

# Or use dotenv
npm install dotenv
# Add to server.ts: require('dotenv').config();
```

## Configuration Problems

### Issue: GITHUB_TOKEN not working

**Symptoms:**
- 401 Unauthorized errors
- API calls fail
- "Bad credentials" message

**Diagnosis:**

```bash
# Test token
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user

# Check token scopes
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/rate_limit | jq '.resources'

# Verify token format
echo $GITHUB_TOKEN | grep -E '^(ghp|ghs)_'
# Should start with ghp_ or ghs_
```

**Solutions:**

1. **Regenerate Token:**
   - Go to https://github.com/settings/tokens
   - Generate new token with required scopes:
     - `repo` (all)
     - `write:discussion`
     - `read:org`
   - Update `.env` file

2. **Check Token Expiration:**
   - Tokens can expire
   - Set longer expiration or use no expiration

3. **Verify Token in Environment:**
   ```bash
   # Check token is set
   echo $GITHUB_TOKEN
   
   # If empty, load from .env
   export GITHUB_TOKEN=ghp_your_token_here
   ```

4. **Use GitHub App Token:**
   ```bash
   # For GitHub Apps, generate installation token
   # See Configuration Guide for details
   ```

### Issue: Commands not found

**Symptoms:**
- "/terminal command" does nothing
- No response in GitHub comments
- Command not recognized

**Diagnosis:**

```bash
# Check webhook deliveries
# GitHub → Settings → Webhooks → Recent Deliveries

# Check server logs
tail -f logs/terminal.log

# Verify command is registered
cat src/commands/index.ts | grep "case \"command\""

# Test locally
curl -X POST http://localhost:3000/webhooks \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: issue_comment" \
  -d '{
    "action": "created",
    "comment": {"body": "/terminal help"},
    "issue": {"number": 1},
    "repository": {"full_name": "owner/repo"}
  }'
```

**Solutions:**

1. **Verify Command Registration:**
   ```typescript
   // src/commands/index.ts
   switch (subcommand?.toLowerCase()) {
     case "mycommand":
       return handleMyCommand(ctx);
     // ...
   }
   ```

2. **Check Command Syntax:**
   ```bash
   # Correct
   /terminal help
   
   # Incorrect
   /terminal  help    # Extra spaces
   /Terminal help     # Uppercase
   terminal help      # Missing slash
   ```

3. **Rebuild and Restart:**
   ```bash
   npm run build
   # Restart server
   pm2 restart terminal
   # Or: kill and restart
   ```

### Issue: .terminal.yml not recognized

**Symptoms:**
- Configuration not applied
- Features not working
- Default settings used

**Diagnosis:**

```bash
# Check file exists
ls -la .terminal.yml

# Validate YAML syntax
# Use online validator or
npm install -g js-yaml
js-yaml .terminal.yml

# Check file location
pwd
# Should be in repository root
```

**Solutions:**

1. **Fix YAML Syntax:**
   ```yaml
   # Correct
   version: 1
   enabled: true
   
   # Incorrect
   version = 1  # Wrong syntax
   enabled:     # Missing value
   ```

2. **Verify File Name:**
   ```bash
   # Correct names
   .terminal.yml
   .terminal.yaml
   
   # Incorrect
   terminal.yml    # Missing dot
   .Terminal.yml   # Wrong case
   ```

3. **Check Permissions:**
   ```bash
   # File should be readable
   chmod 644 .terminal.yml
   ```

4. **Validate Configuration:**
   ```bash
   # Use Terminal CLI
   terminal config validate
   ```

## Webhook Issues

### Issue: Webhooks not received

**Symptoms:**
- No response to commands
- Webhook deliveries show errors
- Server doesn't log webhook events

**Diagnosis:**

```bash
# Check server is running
curl http://localhost:3000
# Should return "CyberAi Terminal"

# Check webhook configuration in GitHub
# Settings → Webhooks
# - URL should be correct
# - Secret should match WEBHOOK_SECRET
# - Content type: application/json
# - Events: Issue comments

# Check webhook deliveries
# Recent Deliveries → Click on delivery
# - Request: Check payload and headers
# - Response: Check status code and body

# Check ngrok tunnel (if using)
curl http://127.0.0.1:4040/api/tunnels
# Should show active tunnel
```

**Solutions:**

1. **Fix Webhook URL:**
   ```bash
   # Update webhook URL in GitHub
   # Use public URL (ngrok, server IP, domain)
   https://your-domain.com/webhooks
   
   # Not localhost
   # http://localhost:3000/webhooks  ❌
   ```

2. **Restart ngrok:**
   ```bash
   # Stop ngrok
   pkill ngrok
   
   # Start new tunnel
   ngrok http 3000
   
   # Update webhook URL with new ngrok URL
   ```

3. **Check Firewall:**
   ```bash
   # Allow port 3000
   sudo ufw allow 3000
   
   # Or use different port
   PORT=80 sudo npm run dev
   ```

4. **Verify Webhook Secret:**
   ```bash
   # Secret must match exactly
   echo $WEBHOOK_SECRET
   
   # Update in GitHub webhook settings
   ```

### Issue: Webhook signature verification fails

**Symptoms:**
- 401 or 500 errors
- "Invalid signature" in logs
- Webhooks rejected

**Diagnosis:**

```bash
# Check webhook secret
echo $WEBHOOK_SECRET

# Test signature calculation
PAYLOAD='{"action":"created"}'
SECRET="your-secret"
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')
echo "sha256=$SIGNATURE"

# Check GitHub webhook delivery
# Recent Deliveries → View details
# Compare X-Hub-Signature-256 header
```

**Solutions:**

1. **Match Webhook Secret:**
   ```bash
   # Ensure secret matches in:
   # 1. Environment variable
   echo $WEBHOOK_SECRET
   
   # 2. GitHub webhook settings
   # Settings → Webhooks → Edit → Secret
   
   # 3. Server code
   cat src/server.ts | grep WEBHOOK_SECRET
   ```

2. **Use Correct Algorithm:**
   ```typescript
   // Use SHA-256 (not SHA-1)
   const webhooks = new Webhooks({
     secret: process.env.WEBHOOK_SECRET
   });
   
   // Header should be X-Hub-Signature-256
   // Not X-Hub-Signature
   ```

3. **Check Payload:**
   ```typescript
   // Verify entire body, not parsed JSON
   const body = await getRawBody(req);
   webhooks.verifyAndReceive({
     payload: body, // Raw string, not JSON.parse(body)
     signature: req.headers['x-hub-signature-256']
   });
   ```

### Issue: Webhook timeouts

**Symptoms:**
- Webhook deliveries show timeout
- Server doesn't respond in time
- GitHub retries webhook

**Diagnosis:**

```bash
# Check server response time
time curl -X POST http://localhost:3000/webhooks \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'

# Check server logs for slow operations
grep -E "took|duration" logs/terminal.log

# Monitor server resource usage
top
# Check CPU and memory
```

**Solutions:**

1. **Respond Quickly:**
   ```typescript
   // Respond to webhook immediately
   webhooks.on("issue_comment.created", async ({ payload }) => {
     // Acknowledge webhook
     res.statusCode = 200;
     res.end("OK");
     
     // Process asynchronously
     setImmediate(async () => {
       await handleCommand({ payload });
     });
   });
   ```

2. **Optimize Command Processing:**
   ```typescript
   // Use parallel requests
   const [pr, commits, checks] = await Promise.all([
     getPullRequest(),
     getCommits(),
     getChecks(),
   ]);
   
   // Cache responses
   const cachedPR = await cache.get('pr:123') || await getPR();
   ```

3. **Increase Timeout:**
   ```typescript
   // Set longer timeout
   const server = http.createServer(app);
   server.timeout = 30000; // 30 seconds
   ```

4. **Use Queue System:**
   ```typescript
   // Add to queue instead of processing immediately
   await commandQueue.add('execute', { payload });
   ```

## Command Execution Errors

### Issue: merge command fails

**Symptoms:**
- "Cannot merge" error
- Merge conflicts
- Checks not passing

**Diagnosis:**

```bash
# Check PR status
gh pr view 123

# Check merge conflicts
gh pr diff 123

# Check required checks
gh pr checks 123

# Check branch protection
gh api repos/owner/repo/branches/main/protection
```

**Solutions:**

1. **Resolve Merge Conflicts:**
   ```bash
   # Locally resolve conflicts
   git checkout feature-branch
   git pull origin main
   # Resolve conflicts
   git add .
   git commit -m "Resolve conflicts"
   git push
   ```

2. **Wait for Checks:**
   ```bash
   # Wait for CI/CD to complete
   gh pr checks 123 --watch
   
   # Or check manually
   /terminal status
   ```

3. **Check Permissions:**
   ```bash
   # Verify write access
   gh api repos/owner/repo/collaborators/username/permission
   
   # Ensure token has repo scope
   curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/rate_limit
   ```

4. **Check Branch Protection:**
   ```bash
   # May require:
   # - Approvals
   # - Passing checks
   # - Up-to-date branch
   
   # Update branch
   /terminal sync
   ```

### Issue: status command shows wrong data

**Symptoms:**
- Outdated status
- Missing information
- Incorrect PR state

**Diagnosis:**

```bash
# Check GitHub API response
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/owner/repo/pulls/123

# Compare with Terminal response
/terminal status
```

**Solutions:**

1. **Clear Cache:**
   ```bash
   # If caching enabled
   redis-cli FLUSHDB
   
   # Or restart Terminal
   pm2 restart terminal
   ```

2. **Update GitHub App Permissions:**
   ```bash
   # Reinstall GitHub App with correct permissions
   # Settings → GitHub Apps → Edit → Permissions
   ```

3. **Check API Rate Limit:**
   ```bash
   curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/rate_limit
   
   # If exhausted, wait or increase limit
   ```

### Issue: deploy command fails

**Symptoms:**
- Deployment doesn't start
- "Not authorized" error
- Environment not found

**Diagnosis:**

```bash
# Check deployment settings
cat .terminal.yml | grep -A 10 "deploy:"

# Check GitHub deployment API
gh api repos/owner/repo/deployments

# Check GitHub Actions
gh run list --workflow=deploy.yml
```

**Solutions:**

1. **Configure Deployment:**
   ```yaml
   # .terminal.yml
   commands:
     deploy:
       enabled: true
       environments:
         - staging
         - production
       require_approval:
         production: true
   ```

2. **Set Up GitHub Actions:**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy
   on:
     workflow_dispatch:
       inputs:
         environment:
           required: true
   ```

3. **Check Permissions:**
   ```bash
   # Need deployment permission
   # Check repository settings
   ```

## GitHub API Issues

### Issue: Rate limit exceeded

**Symptoms:**
- "API rate limit exceeded" error
- 403 responses from GitHub
- Commands slow or failing

**Diagnosis:**

```bash
# Check rate limit status
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/rate_limit | jq '.'

# Output shows:
# - limit: Maximum requests
# - remaining: Requests left
# - reset: Unix timestamp when limit resets

# Check when limit resets
date -d @$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/rate_limit | jq '.rate.reset')
```

**Solutions:**

1. **Use Authenticated Requests:**
   ```typescript
   // Always include token
   const octokit = new Octokit({
     auth: process.env.GITHUB_TOKEN // 5000 req/hour
   });
   
   // Without auth: 60 req/hour
   ```

2. **Implement Caching:**
   ```typescript
   // Cache API responses
   const cache = new Map();
   
   async function getCachedPR(owner, repo, number) {
     const key = `${owner}/${repo}/${number}`;
     if (cache.has(key)) {
       return cache.get(key);
     }
     
     const pr = await octokit.request(...);
     cache.set(key, pr);
     return pr;
   }
   ```

3. **Use Conditional Requests:**
   ```typescript
   // Use ETag for conditional requests
   const { data, headers } = await octokit.request(
     'GET /repos/{owner}/{repo}/pulls/{number}',
     {
       owner,
       repo,
       pull_number: number,
       headers: {
         'If-None-Match': previousEtag
       }
     }
   );
   
   // 304 Not Modified = no rate limit cost
   ```

4. **Batch Requests:**
   ```typescript
   // Use GraphQL to batch requests
   const query = `
     query($owner: String!, $repo: String!) {
       repository(owner: $owner, name: $repo) {
         pullRequests(first: 10) {
           nodes {
             number
             title
             state
           }
         }
       }
     }
   `;
   ```

5. **Wait for Reset:**
   ```typescript
   // Wait for rate limit reset
   if (error.status === 403) {
     const resetTime = error.response.headers['x-ratelimit-reset'];
     const waitTime = (resetTime * 1000) - Date.now();
     await sleep(waitTime);
     // Retry request
   }
   ```

### Issue: 404 Not Found

**Symptoms:**
- "Not found" error
- Resource doesn't exist
- Cannot access repository

**Diagnosis:**

```bash
# Check repository exists
gh repo view owner/repo

# Check resource exists
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/owner/repo/pulls/123

# Check permissions
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/owner/repo
```

**Solutions:**

1. **Verify Repository Name:**
   ```bash
   # Use full repository name
   owner/repo  # Correct
   repo        # Incorrect
   ```

2. **Check Permissions:**
   ```bash
   # Token needs read access
   # Repository might be private
   # GitHub App might not be installed
   ```

3. **Verify Resource:**
   ```bash
   # PR might be closed or merged
   # Issue might be deleted
   # Branch might not exist
   ```

### Issue: 403 Forbidden

**Symptoms:**
- "Forbidden" error
- "Resource not accessible"
- Permission denied

**Diagnosis:**

```bash
# Check token scopes
curl -H "Authorization: token $GITHUB_TOKEN" -I \
  https://api.github.com/repos/owner/repo | grep X-OAuth-Scopes

# Check repository permissions
gh api repos/owner/repo/collaborators/username/permission

# Check branch protection
gh api repos/owner/repo/branches/main/protection
```

**Solutions:**

1. **Update Token Scopes:**
   - Regenerate token with required scopes
   - `repo`, `write:discussion`, `read:org`

2. **Grant Access:**
   ```bash
   # Add collaborator
   gh api repos/owner/repo/collaborators/username -X PUT
   
   # Or install GitHub App
   ```

3. **Check Branch Protection:**
   ```bash
   # May need to be admin
   # Or disable branch protection temporarily
   ```

## Integration Problems

### Issue: Slack notifications not working

**Symptoms:**
- No Slack messages
- "Webhook failed" error
- Connection timeout

**Diagnosis:**

```bash
# Test Slack webhook
curl -X POST $SLACK_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{"text":"Test message"}'

# Check configuration
cat .terminal.yml | grep -A 5 "slack:"

# Check environment variable
echo $SLACK_WEBHOOK_URL
```

**Solutions:**

1. **Verify Webhook URL:**
   ```bash
   # Format: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
   
   # Regenerate if invalid
   # Slack → Apps → Incoming Webhooks
   ```

2. **Check Configuration:**
   ```yaml
   # .terminal.yml
   notifications:
     channels:
       slack:
         enabled: true
         webhook_url: "${SLACK_WEBHOOK_URL}"
         channel: "#terminal-notifications"
   ```

3. **Test Manually:**
   ```bash
   curl -X POST $SLACK_WEBHOOK_URL \
     -H "Content-Type: application/json" \
     -d '{
       "text": "Test from Terminal",
       "channel": "#terminal-notifications"
     }'
   ```

### Issue: Email notifications not sending

**Symptoms:**
- Emails not received
- SMTP connection failed
- Authentication error

**Diagnosis:**

```bash
# Check SMTP settings
cat .terminal.yml | grep -A 10 "email:"

# Test SMTP connection
telnet smtp.gmail.com 587

# Check credentials
echo $SMTP_USER
echo $SMTP_PASS
```

**Solutions:**

1. **Configure SMTP:**
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
   ```

2. **Gmail Specific:**
   ```bash
   # Use App Password (not account password)
   # Google Account → Security → 2-Step Verification → App passwords
   
   # Allow less secure apps (not recommended)
   # Or use OAuth2
   ```

3. **Test Email:**
   ```bash
   # Use mail command
   echo "Test" | mail -s "Test" user@example.com
   
   # Or use node mailer
   npm install nodemailer
   ```

## Performance Issues

### Issue: Slow command execution

**Symptoms:**
- Commands take long time
- Webhook timeouts
- Slow GitHub API responses

**Diagnosis:**

```bash
# Measure command execution time
time /terminal status

# Check server logs for timing
grep "duration" logs/terminal.log

# Monitor server resources
top -pid $(pgrep -f "node.*server.js")

# Check network latency
ping api.github.com
traceroute api.github.com
```

**Solutions:**

1. **Enable Caching:**
   ```typescript
   // Cache frequently accessed data
   const cache = new NodeCache({ stdTTL: 600 });
   
   async function getData(key) {
     const cached = cache.get(key);
     if (cached) return cached;
     
     const data = await fetchData();
     cache.set(key, data);
     return data;
   }
   ```

2. **Optimize API Calls:**
   ```typescript
   // Parallel requests
   const [pr, commits] = await Promise.all([
     getPR(),
     getCommits()
   ]);
   
   // Use GraphQL for multiple resources
   const query = `{ repository { pullRequest { ... } } }`;
   ```

3. **Add Indexes:**
   ```sql
   -- If using database
   CREATE INDEX idx_repo_issue ON commands(repo, issue_number);
   ```

4. **Scale Horizontally:**
   ```bash
   # Run multiple instances behind load balancer
   pm2 start server.js -i 4  # 4 instances
   ```

### Issue: High memory usage

**Symptoms:**
- Server crashes with OOM
- Memory keeps increasing
- Slow performance

**Diagnosis:**

```bash
# Check memory usage
ps aux | grep node
top -pid $(pgrep -f "node.*server.js")

# Node.js heap stats
node --expose-gc --inspect server.js
# Connect Chrome DevTools

# Check for memory leaks
# Use clinic.js
npm install -g clinic
clinic doctor -- node server.js
```

**Solutions:**

1. **Increase Memory Limit:**
   ```bash
   # Set max memory
   NODE_OPTIONS="--max-old-space-size=4096" npm run dev
   ```

2. **Fix Memory Leaks:**
   ```typescript
   // Clear event listeners
   process.on('exit', () => {
     webhooks.removeAllListeners();
   });
   
   // Clear caches periodically
   setInterval(() => {
     cache.flushAll();
   }, 3600000);
   
   // Avoid global references
   // Use WeakMap for caching
   ```

3. **Use Streaming:**
   ```typescript
   // Stream large responses
   const stream = await octokit.request(...);
   stream.pipe(response);
   ```

## Security and Permissions

### Issue: Permission denied errors

**Symptoms:**
- "Permission denied"
- "Insufficient permissions"
- Cannot execute command

**Diagnosis:**

```bash
# Check user permissions
gh api repos/owner/repo/collaborators/username/permission

# Check token scopes
curl -H "Authorization: token $GITHUB_TOKEN" -I \
  https://api.github.com/repos/owner/repo | grep X-OAuth-Scopes

# Check repository settings
gh repo view owner/repo
```

**Solutions:**

1. **Grant Repository Access:**
   ```bash
   # Add as collaborator
   gh api repos/owner/repo/collaborators/username -X PUT \
     --input - <<< '{"permission":"write"}'
   
   # Or install GitHub App to repository
   ```

2. **Update Token Scopes:**
   ```bash
   # Create new token with required scopes:
   # - repo (all)
   # - write:discussion
   # - read:org
   
   # Update .env
   export GITHUB_TOKEN=new_token
   ```

3. **Check Command Permissions:**
   ```yaml
   # .terminal.yml
   permissions:
     command_permissions:
       merge: write
       deploy: admin
   ```

### Issue: Security scan failures

**Symptoms:**
- CodeQL alerts
- Vulnerability detected
- Secret exposed

**Solutions:**

1. **Fix Vulnerabilities:**
   ```bash
   # Update dependencies
   npm audit fix
   
   # Or update manually
   npm update package-name
   ```

2. **Remove Secrets:**
   ```bash
   # Remove from code
   # Never commit:
   # - API keys
   # - Tokens
   # - Passwords
   # - Private keys
   
   # Use environment variables
   # Or secrets manager
   ```

3. **Fix CodeQL Alerts:**
   ```bash
   # View alerts
   gh api repos/owner/repo/code-scanning/alerts
   
   # Fix code issues
   # Re-run CodeQL
   gh workflow run codeql.yml
   ```

## Error Messages Reference

### Common Error Messages

**"Bad credentials"**
```
Error: Bad credentials
```
**Cause:** Invalid or expired GitHub token  
**Solution:** Regenerate token and update `.env`

**"Not Found"**
```
Error: Not Found - https://api.github.com/repos/owner/repo
```
**Cause:** Repository doesn't exist or no access  
**Solution:** Verify repository name and permissions

**"Rate limit exceeded"**
```
Error: API rate limit exceeded
```
**Cause:** Too many API requests  
**Solution:** Wait for reset or implement caching

**"Validation Failed"**
```
Error: Validation Failed
```
**Cause:** Invalid request parameters  
**Solution:** Check API documentation and fix parameters

**"Resource not accessible by integration"**
```
Error: Resource not accessible by integration
```
**Cause:** GitHub App missing permissions  
**Solution:** Update app permissions and reinstall

**"Webhook signature verification failed"**
```
Error: Webhook signature verification failed
```
**Cause:** Invalid webhook secret  
**Solution:** Match secret in code and GitHub webhook

**"Cannot merge pull request"**
```
Error: Cannot merge pull request - merge conflicts
```
**Cause:** Merge conflicts or checks not passing  
**Solution:** Resolve conflicts and ensure checks pass

**"ECONNREFUSED"**
```
Error: connect ECONNREFUSED 127.0.0.1:3000
```
**Cause:** Server not running  
**Solution:** Start server with `npm run dev`

**"EADDRINUSE"**
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Cause:** Port already in use  
**Solution:** Kill process or use different port

**"MODULE_NOT_FOUND"**
```
Error: Cannot find module '@octokit/core'
```
**Cause:** Missing dependencies  
**Solution:** Run `npm install`

## Debugging Tools

### Logging

```typescript
// Add debug logging
const logger = {
  debug: (msg, ...args) => {
    if (process.env.LOG_LEVEL === 'debug') {
      console.log('[DEBUG]', msg, ...args);
    }
  },
  info: (msg, ...args) => console.log('[INFO]', msg, ...args),
  error: (msg, ...args) => console.error('[ERROR]', msg, ...args),
};

// Use throughout code
logger.debug('Processing command', ctx);
logger.info('Command successful');
logger.error('Command failed', error);
```

### GitHub CLI

```bash
# View PRs
gh pr list

# View PR details
gh pr view 123

# Check CI status
gh pr checks 123

# View workflow runs
gh run list

# View workflow logs
gh run view 123 --log
```

### Network Debugging

```bash
# Monitor HTTP requests
# Use Charles Proxy or mitmproxy

# Debug webhooks with ngrok inspector
# Visit http://127.0.0.1:4040

# Capture network traffic
tcpdump -i any port 3000 -w capture.pcap

# Analyze with Wireshark
wireshark capture.pcap
```

### Performance Profiling

```bash
# Install clinic.js
npm install -g clinic

# Profile CPU
clinic doctor -- node server.js

# Profile memory
clinic heapprofiler -- node server.js

# Flame graphs
clinic flame -- node server.js
```

## Getting Help

### Before Asking for Help

1. **Check This Guide** - Common issues covered here
2. **Search Issues** - Someone may have had same problem
3. **Read Logs** - Error messages often explain issue
4. **Test Locally** - Reproduce issue in development
5. **Gather Information** - Collect relevant details

### Information to Provide

When reporting issues, include:

```markdown
## Environment
- Terminal Version: 1.0.0
- Node.js Version: v18.20.0
- npm Version: v9.8.0
- Operating System: Ubuntu 22.04
- Deployment: Docker / PM2 / Local

## Issue Description
Clear description of the problem

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Logs
```
Relevant error messages and logs
```

## Configuration
```yaml
Relevant parts of .terminal.yml
```

## Additional Context
Screenshots, webhook deliveries, etc.
```

### Support Channels

**GitHub Issues:**
- Bug reports: https://github.com/SolanaRemix/terminal/issues
- Feature requests: https://github.com/SolanaRemix/terminal/issues

**GitHub Discussions:**
- Questions: https://github.com/SolanaRemix/terminal/discussions
- Ideas: https://github.com/SolanaRemix/terminal/discussions

**Documentation:**
- Main Docs: https://cyberai.network
- Configuration Guide: docs/configuration.md
- Architecture: docs/architecture.md
- Development: docs/development.md

**Community:**
- Discord: [Link if available]
- Stack Overflow: Tag `cyberai-terminal`

**Email Support:**
- General: support@cyberai.dev
- Security: security@cyberai.dev
- Enterprise: enterprise@cyberai.dev

**Response Times:**
- Community Support: Best effort
- Pro Support: 24 hours
- Enterprise Support: 4 hours (24/7)

### Emergency Contacts

**Critical Security Issues:**
- Email: security@cyberai.dev
- Follow responsible disclosure policy (SECURITY.md)

**Production Outages (Enterprise):**
- Email: oncall@cyberai.dev
- Phone: +1-XXX-XXX-XXXX

---

**Get unstuck and back to building automation!**

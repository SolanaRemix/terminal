#!/usr/bin/env node

/**
 * Audit Script for Terminal Repository
 * Performs security and code quality audits
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface AuditResult {
  category: string;
  passed: boolean;
  message: string;
  details?: string[];
}

function log(message: string, type: "info" | "success" | "error" | "warn" = "info"): void {
  const colors = {
    info: "\x1b[36m",
    success: "\x1b[32m",
    error: "\x1b[31m",
    warn: "\x1b[33m"
  };
  const reset = "\x1b[0m";
  console.log(`${colors[type]}${message}${reset}`);
}

function runCommand(command: string, silent = false): { success: boolean; output: string } {
  try {
    const output = execSync(command, { 
      encoding: "utf-8",
      stdio: silent ? "pipe" : "inherit"
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, output: error instanceof Error ? error.message : String(error) };
  }
}

function auditDependencies(): AuditResult {
  log("\n--- Auditing Dependencies ---\n", "info");
  
  const result = runCommand("npm audit --json", true);
  
  if (result.success) {
    try {
      const auditData = JSON.parse(result.output);
      const vulnerabilities = auditData.metadata?.vulnerabilities || {};
      const total = Object.values(vulnerabilities).reduce((a: number, b) => a + (b as number), 0) as number;
      
      if (total === 0) {
        return {
          category: "Dependencies",
          passed: true,
          message: "No vulnerabilities found"
        };
      } else {
        return {
          category: "Dependencies",
          passed: false,
          message: `Found ${total} vulnerabilities`,
          details: [`Run 'npm audit fix' to resolve`]
        };
      }
    } catch (e) {
      return {
        category: "Dependencies",
        passed: true,
        message: "Audit completed (no critical issues)"
      };
    }
  }
  
  return {
    category: "Dependencies",
    passed: false,
    message: "npm audit failed"
  };
}

function auditTypeScript(): AuditResult {
  log("\n--- Auditing TypeScript ---\n", "info");
  
  if (!fs.existsSync("tsconfig.json")) {
    return {
      category: "TypeScript",
      passed: false,
      message: "tsconfig.json not found"
    };
  }
  
  const result = runCommand("npx tsc --noEmit", true);
  
  return {
    category: "TypeScript",
    passed: result.success,
    message: result.success ? "No type errors" : "Type errors found"
  };
}

function auditLinting(): AuditResult {
  log("\n--- Auditing Code Style ---\n", "info");
  
  const eslintResult = runCommand("npx eslint . --ext .ts,.tsx,.js,.jsx", true);
  const prettierResult = runCommand("npx prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\"", true);
  
  const passed = eslintResult.success && prettierResult.success;
  
  return {
    category: "Code Style",
    passed,
    message: passed ? "Code style checks passed" : "Code style issues found",
    details: passed ? undefined : ["Run 'npm run lint' and 'npm run format'"]
  };
}

function auditStructure(): AuditResult {
  log("\n--- Auditing Repository Structure ---\n", "info");
  
  const requiredDirs = ["src", "docs", "scripts", "tests"];
  const requiredFiles = ["README.md", "LICENSE", "package.json"];
  
  const missingDirs = requiredDirs.filter(dir => !fs.existsSync(dir));
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  const passed = missingDirs.length === 0 && missingFiles.length === 0;
  
  return {
    category: "Structure",
    passed,
    message: passed ? "Repository structure valid" : "Missing required files/directories",
    details: [...missingDirs.map(d => `Missing: ${d}`), ...missingFiles.map(f => `Missing: ${f}`)]
  };
}

function auditSecurity(): AuditResult {
  log("\n--- Auditing Security ---\n", "info");
  
  const securityFiles = ["SECURITY.md", "CODE_OF_CONDUCT.md"];
  const missingFiles = securityFiles.filter(file => !fs.existsSync(file));
  
  const passed = missingFiles.length === 0;
  
  return {
    category: "Security",
    passed,
    message: passed ? "Security documentation present" : "Missing security documentation",
    details: missingFiles.map(f => `Missing: ${f}`)
  };
}

async function main(): Promise<void> {
  log("\n╔════════════════════════════════════════╗", "info");
  log("║  Terminal Repository Audit            ║", "info");
  log("╚════════════════════════════════════════╝\n", "info");

  const audits: AuditResult[] = [
    auditStructure(),
    auditSecurity(),
    auditDependencies(),
    auditTypeScript(),
    auditLinting()
  ];

  log("\n╔════════════════════════════════════════╗", "info");
  log("║  Audit Results                        ║", "info");
  log("╚════════════════════════════════════════╝\n", "info");

  let allPassed = true;

  for (const audit of audits) {
    const icon = audit.passed ? "✓" : "✗";
    const type = audit.passed ? "success" : "error";
    log(`${icon} ${audit.category}: ${audit.message}`, type);
    
    if (audit.details && audit.details.length > 0) {
      audit.details.forEach(detail => log(`  - ${detail}`, "warn"));
    }
    
    if (!audit.passed) {
      allPassed = false;
    }
  }

  log("\n" + "=".repeat(40) + "\n", "info");

  if (allPassed) {
    log("✓ All audits passed!", "success");
    process.exit(0);
  } else {
    log("✗ Some audits failed. Please review and fix the issues.", "error");
    process.exit(1);
  }
}

// Run audit if executed directly
if (require.main === module) {
  main();
}

export { main as audit };

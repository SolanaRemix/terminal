#!/usr/bin/env node

/**
 * Validate Script for Terminal Repository
 * Validates repository structure and configuration
 */

import * as fs from "fs";
import * as path from "path";

interface ValidationResult {
  category: string;
  items: Array<{
    name: string;
    passed: boolean;
    message?: string;
  }>;
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

function validateDirectories(): ValidationResult {
  const requiredDirs = [
    "cli",
    "commands",
    "scripts",
    "tools",
    "docs",
    "src",
    "src/commands",
    "tests",
    "prompts",
    "workflows",
    ".github/workflows",
    ".github/copilot"
  ];

  return {
    category: "Directories",
    items: requiredDirs.map(dir => ({
      name: dir,
      passed: fs.existsSync(dir) && fs.statSync(dir).isDirectory()
    }))
  };
}

function validateFiles(): ValidationResult {
  const requiredFiles = [
    "README.md",
    "LICENSE",
    "SECURITY.md",
    "CONTRIBUTING.md",
    "CODE_OF_CONDUCT.md",
    "package.json",
    "tsconfig.json",
    ".editorconfig",
    ".prettierrc",
    ".eslintrc.json",
    "commitlint.config.js"
  ];

  return {
    category: "Required Files",
    items: requiredFiles.map(file => ({
      name: file,
      passed: fs.existsSync(file) && fs.statSync(file).isFile()
    }))
  };
}

function validateWorkflows(): ValidationResult {
  const requiredWorkflows = [
    ".github/workflows/ci.yml",
    ".github/workflows/lint.yml",
    ".github/workflows/codeql.yml",
    ".github/workflows/dependency-review.yml",
    ".github/workflows/release.yml",
    ".github/workflows/labeler.yml"
  ];

  return {
    category: "GitHub Workflows",
    items: requiredWorkflows.map(workflow => ({
      name: path.basename(workflow),
      passed: fs.existsSync(workflow) && fs.statSync(workflow).isFile()
    }))
  };
}

function validateConfiguration(): ValidationResult {
  const items = [];

  // Validate package.json
  if (fs.existsSync("package.json")) {
    try {
      const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
      items.push({
        name: "package.json (valid JSON)",
        passed: true
      });
      items.push({
        name: "package.json has scripts",
        passed: !!pkg.scripts && Object.keys(pkg.scripts).length > 0
      });
    } catch (e) {
      items.push({
        name: "package.json",
        passed: false,
        message: "Invalid JSON"
      });
    }
  }

  // Validate tsconfig.json
  if (fs.existsSync("tsconfig.json")) {
    try {
      JSON.parse(fs.readFileSync("tsconfig.json", "utf-8"));
      items.push({
        name: "tsconfig.json (valid JSON)",
        passed: true
      });
    } catch (e) {
      items.push({
        name: "tsconfig.json",
        passed: false,
        message: "Invalid JSON"
      });
    }
  }

  return {
    category: "Configuration",
    items
  };
}

function validateCommands(): ValidationResult {
  const requiredCommands = [
    "help.ts",
    "status.ts",
    "scan.ts",
    "merge.ts",
    "tag.ts",
    "audit.ts",
    "fix.ts",
    "deploy.ts",
    "cyberai.ts",
    "smartcontractaudit.ts",
    "smartbrain.ts",
    "gitantivirus.ts",
    "nodeaudit.ts",
    "conflictsresolver.ts"
  ];

  return {
    category: "Terminal Commands",
    items: requiredCommands.map(cmd => ({
      name: cmd,
      passed: fs.existsSync(path.join("src/commands", cmd))
    }))
  };
}

async function main(): Promise<void> {
  log("\n╔════════════════════════════════════════╗", "info");
  log("║  Terminal Repository Validation       ║", "info");
  log("╚════════════════════════════════════════╝\n", "info");

  const validations: ValidationResult[] = [
    validateDirectories(),
    validateFiles(),
    validateWorkflows(),
    validateConfiguration(),
    validateCommands()
  ];

  let totalItems = 0;
  let passedItems = 0;

  for (const validation of validations) {
    log(`\n=== ${validation.category} ===\n`, "info");

    for (const item of validation.items) {
      totalItems++;
      const icon = item.passed ? "✓" : "✗";
      const type = item.passed ? "success" : "error";
      const message = item.message ? ` (${item.message})` : "";
      log(`${icon} ${item.name}${message}`, type);
      if (item.passed) passedItems++;
    }
  }

  log("\n" + "=".repeat(40) + "\n", "info");
  log(`Validation Results: ${passedItems}/${totalItems} passed`, "info");

  if (passedItems === totalItems) {
    log("\n✓ All validations passed!", "success");
    process.exit(0);
  } else {
    const failed = totalItems - passedItems;
    log(`\n✗ ${failed} validation(s) failed. Please review and fix the issues.`, "error");
    process.exit(1);
  }
}

// Run validation if executed directly
if (require.main === module) {
  main();
}

export { main as validate };

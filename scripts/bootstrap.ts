#!/usr/bin/env node

/**
 * Bootstrap Script for Terminal Repository
 * Initializes and validates repository structure
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

interface BootstrapResult {
  success: boolean;
  message: string;
}

const REQUIRED_DIRS = [
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
  ".github",
  ".github/workflows",
  ".github/copilot"
];

const REQUIRED_FILES = [
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

function checkDirectory(dir: string): boolean {
  const fullPath = path.join(process.cwd(), dir);
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
}

function createDirectory(dir: string): void {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    log(`✓ Created directory: ${dir}`, "success");
  }
}

function checkFile(file: string): boolean {
  const fullPath = path.join(process.cwd(), file);
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isFile();
}

function validateStructure(): BootstrapResult {
  log("\n=== Validating Directory Structure ===\n", "info");
  
  let missingDirs = 0;
  for (const dir of REQUIRED_DIRS) {
    if (checkDirectory(dir)) {
      log(`✓ ${dir}`, "success");
    } else {
      log(`✗ ${dir} (missing)`, "error");
      missingDirs++;
    }
  }

  log("\n=== Validating Required Files ===\n", "info");
  
  let missingFiles = 0;
  for (const file of REQUIRED_FILES) {
    if (checkFile(file)) {
      log(`✓ ${file}`, "success");
    } else {
      log(`✗ ${file} (missing)`, "warn");
      missingFiles++;
    }
  }

  if (missingDirs > 0 || missingFiles > 0) {
    return {
      success: false,
      message: `Missing ${missingDirs} directories and ${missingFiles} files`
    };
  }

  return {
    success: true,
    message: "All required structure validated"
  };
}

function createMissingDirectories(): void {
  log("\n=== Creating Missing Directories ===\n", "info");
  
  for (const dir of REQUIRED_DIRS) {
    createDirectory(dir);
  }
}

function installDependencies(): void {
  log("\n=== Installing Dependencies ===\n", "info");
  
  try {
    execSync("npm install", { stdio: "inherit" });
    log("✓ Dependencies installed", "success");
  } catch (error) {
    log("✗ Failed to install dependencies", "error");
    throw error;
  }
}

function buildProject(): void {
  log("\n=== Building Project ===\n", "info");
  
  try {
    execSync("npm run build", { stdio: "inherit" });
    log("✓ Project built successfully", "success");
  } catch (error) {
    log("✗ Build failed", "error");
    throw error;
  }
}

async function main(): Promise<void> {
  log("\n╔════════════════════════════════════════╗", "info");
  log("║  Terminal Repository Bootstrap        ║", "info");
  log("╚════════════════════════════════════════╝\n", "info");

  try {
    // Step 1: Create missing directories
    createMissingDirectories();

    // Step 2: Validate structure
    const validation = validateStructure();
    
    if (!validation.success) {
      log(`\n⚠️  ${validation.message}`, "warn");
    } else {
      log(`\n✓ ${validation.message}`, "success");
    }

    // Step 3: Install dependencies
    if (checkFile("package.json")) {
      installDependencies();
    }

    // Step 4: Build project
    if (checkFile("tsconfig.json")) {
      buildProject();
    }

    log("\n╔════════════════════════════════════════╗", "success");
    log("║  Bootstrap Complete!                  ║", "success");
    log("╚════════════════════════════════════════╝\n", "success");

    log("\nNext steps:", "info");
    log("1. Configure environment variables (GITHUB_TOKEN, WEBHOOK_SECRET)", "info");
    log("2. Review generated files and configurations", "info");
    log("3. Run 'npm run dev' to start the server", "info");
    log("4. Set up GitHub App webhook\n", "info");
  } catch (error) {
    log("\n✗ Bootstrap failed", "error");
    if (error instanceof Error) {
      log(error.message, "error");
    }
    process.exit(1);
  }
}

// Run bootstrap if executed directly
if (require.main === module) {
  main();
}

export { main as bootstrap, validateStructure };

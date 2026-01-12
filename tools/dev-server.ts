#!/usr/bin/env node

/**
 * Development Server Monitor
 * Monitors the Terminal server and restarts on file changes
 */

import { spawn } from "child_process";
import { watch } from "fs";
import * as path from "path";

let serverProcess: any = null;

function startServer() {
  if (serverProcess) {
    serverProcess.kill();
  }

  console.log("🚀 Starting Terminal server...");
  serverProcess = spawn("npx", ["ts-node", "src/server.ts"], {
    stdio: "inherit",
    shell: true
  });

  serverProcess.on("error", (err: Error) => {
    console.error("❌ Server error:", err);
  });

  serverProcess.on("exit", (code: number) => {
    if (code !== 0 && code !== null) {
      console.log(`⚠️  Server exited with code ${code}`);
    }
  });
}

console.log("👀 Watching for file changes...");

// Watch src directory for changes
watch(path.join(process.cwd(), "src"), { recursive: true }, (eventType, filename) => {
  if (filename && filename.endsWith(".ts")) {
    console.log(`📝 File changed: ${filename}`);
    console.log("🔄 Restarting server...");
    startServer();
  }
});

// Start initial server
startServer();

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down...");
  if (serverProcess) {
    serverProcess.kill();
  }
  process.exit(0);
});

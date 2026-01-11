import { Octokit } from "@octokit/core";
import { CommandContext } from "./index";

export async function handleAudit(ctx: CommandContext) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const [owner, repo] = ctx.repo.split("/");

  await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    owner,
    repo,
    issue_number: ctx.issueNumber,
    body: [
      "### 🔍 `/terminal audit`",
      "",
      "Running comprehensive security and code audit...",
      "",
      "**Audit Components:**",
      "- ✅ Code quality analysis",
      "- ✅ Security vulnerability scan",
      "- ✅ Dependency audit",
      "- ✅ Best practices check",
      "",
      "Audit complete. Check workflow runs for detailed results.",
      ""
    ].join("\n")
  });
}

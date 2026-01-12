import { Octokit } from "@octokit/core";
import { CommandContext } from "./index";

export async function handleDeploy(ctx: CommandContext) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const [owner, repo] = ctx.repo.split("/");

  await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    owner,
    repo,
    issue_number: ctx.issueNumber,
    body: [
      "### 🚀 `/terminal deploy`",
      "",
      "Initiating deployment workflow...",
      "",
      "**Deployment Steps:**",
      "1. Build artifacts",
      "2. Run tests",
      "3. Create release",
      "4. Deploy to production",
      "",
      "Check workflow runs for deployment status.",
      ""
    ].join("\n")
  });
}

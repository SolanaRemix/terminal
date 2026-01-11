import { Octokit } from "@octokit/core";
import { CommandContext } from "./index";

export async function handleCyberAi(ctx: CommandContext) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const [owner, repo] = ctx.repo.split("/");

  await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    owner,
    repo,
    issue_number: ctx.issueNumber,
    body: [
      "### 🤖 `/terminal CyberAi`",
      "",
      "CyberAi Enterprise Automation Platform",
      "",
      "**Available Features:**",
      "- Multi-repository orchestration",
      "- Advanced security scanning",
      "- Automated compliance checks",
      "- Enterprise workflow management",
      "",
      "For more information, visit the CyberAi documentation.",
      ""
    ].join("\n")
  });
}

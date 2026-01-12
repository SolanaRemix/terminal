import { Octokit } from "@octokit/core";
import { CommandContext } from "./index";

export async function handleHelp(ctx: CommandContext) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const [owner, repo] = ctx.repo.split("/");

  await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    owner,
    repo,
    issue_number: ctx.issueNumber,
    body: [
      "### 🧪 `/terminal help`",
      "",
      "**Core Commands:**",
      "- `/terminal help` - Display this help message",
      "- `/terminal status` - Show system/repository status",
      "- `/terminal scan` - Scan for issues or vulnerabilities",
      "- `/terminal merge` - Merge pull request",
      "- `/terminal tag <name>` - Create a new tag",
      "",
      "**Advanced Commands:**",
      "- `/terminal audit` - Run security and code audit",
      "- `/terminal fix` - Apply automated fixes",
      "- `/terminal deploy` - Deploy or publish",
      "",
      "**CyberAi Ecosystem Commands:**",
      "- `/terminal CyberAi` - CyberAi integration",
      "- `/terminal SmartContractAudit` - Smart contract auditing",
      "- `/terminal SmartBrain` - AI/ML integration",
      "- `/terminal GitAntivirus` - Git security scanning",
      "- `/terminal NodeAudit` - Node.js dependency audit",
      "- `/terminal ConflictsResolver` - Git conflict resolution",
      "",
      "For more information, see [documentation](https://github.com/SolanaRemix/terminal).",
      ""
    ].join("\n")
  });
}

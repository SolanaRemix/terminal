import { Octokit } from "@octokit/core";
import { CommandContext } from "./index";

export async function handleTag(ctx: CommandContext, args: string[]) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const [owner, repo] = ctx.repo.split("/");

  const tagName = args[0];
  if (!tagName) {
    return octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      owner,
      repo,
      issue_number: ctx.issueNumber,
      body: "⚠️ Usage: `/terminal tag v0.1-dashboard`"
    });
  }

  const latestCommit = await octokit.request(
    "GET /repos/{owner}/{repo}/commits/{branch}",
    { owner, repo, branch: "main" }
  );

  await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
    owner,
    repo,
    ref: `refs/tags/${tagName}`,
    sha: latestCommit.data.sha
  });

  await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    owner,
    repo,
    issue_number: ctx.issueNumber,
    body: `🏷️ Tag created: \`${tagName}\` on main`
  });
}

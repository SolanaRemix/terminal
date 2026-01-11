import { handleHelp } from "./help";
import { handleMerge } from "./merge";
import { handleTag } from "./tag";
import { handleScan } from "./scan";
import { handleStatus } from "./status";
import { handleAudit } from "./audit";
import { handleFix } from "./fix";
import { handleDeploy } from "./deploy";
import { handleCyberAi } from "./cyberai";
import { handleSmartContractAudit } from "./smartcontractaudit";
import { handleSmartBrain } from "./smartbrain";
import { handleGitAntivirus } from "./gitantivirus";
import { handleNodeAudit } from "./nodeaudit";
import { handleConflictsResolver } from "./conflictsresolver";

export type CommandContext = {
  body: string;
  repo: string;
  issueNumber: number;
};

export async function handleCommand(ctx: CommandContext) {
  const parts = ctx.body.trim().split(/\s+/);
  const [, subcommand, ...args] = parts;

  switch (subcommand?.toLowerCase()) {
    case "help":
      return handleHelp(ctx);
    case "merge":
      return handleMerge(ctx);
    case "tag":
      return handleTag(ctx, args);
    case "scan":
      return handleScan(ctx);
    case "status":
      return handleStatus(ctx);
    case "audit":
      return handleAudit(ctx);
    case "fix":
      return handleFix(ctx);
    case "deploy":
      return handleDeploy(ctx);
    case "cyberai":
      return handleCyberAi(ctx);
    case "smartcontractaudit":
      return handleSmartContractAudit(ctx);
    case "smartbrain":
      return handleSmartBrain(ctx);
    case "gitantivirus":
      return handleGitAntivirus(ctx);
    case "nodeaudit":
      return handleNodeAudit(ctx);
    case "conflictsresolver":
      return handleConflictsResolver(ctx);
    default:
      return handleHelp(ctx);
  }
}

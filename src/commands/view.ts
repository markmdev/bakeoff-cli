import chalk from "chalk";
import { getApiKey } from "../config";
import { request } from "../api";
import { formatBP, formatStatus, formatCategory, relativeTime } from "../format";

interface BakeDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  bounty: number;
  deadline: string;
  status: string;
  targetRepo?: string | null;
  attachments?: { filename: string; url: string }[];
  submissions?: { id: string; submissionType: string; submissionUrl: string; isWinner: boolean; submittedAt: string }[] | null;
  comments?: { id: string; content: string; agent: { id: string; name: string }; createdAt: string }[];
  acceptedAgents?: { id: string; name: string; acceptedAt: string }[];
  creatorAgent: { name: string };
  publishedAt: string;
}

export async function viewCommand(id: string): Promise<void> {
  const apiKey = getApiKey();
  const bake = await request<BakeDetail>({ path: `/bakes/${id}`, apiKey });

  const workerCount = bake.acceptedAgents?.length ?? 0;
  const commentCount = bake.comments?.length ?? 0;

  console.log(chalk.bold(bake.title));
  console.log(
    `${formatStatus(bake.status)}  ${formatCategory(bake.category)}  ${formatBP(bake.bounty)}  ${relativeTime(bake.deadline)}`
  );
  console.log(chalk.gray(`by ${bake.creatorAgent.name} · ${workerCount} workers · ${commentCount} comments`));
  if (bake.targetRepo) {
    console.log(chalk.gray(`repo: ${bake.targetRepo}`));
  }
  console.log();
  console.log(bake.description);

  if (bake.attachments && bake.attachments.length > 0) {
    console.log(chalk.bold("\nAttachments"));
    for (const a of bake.attachments) {
      console.log(`  ${a.filename}: ${a.url}`);
    }
  }

  if (bake.submissions && bake.submissions.length > 0) {
    console.log(chalk.bold("\nSubmissions"));
    for (const s of bake.submissions) {
      const winner = s.isWinner ? chalk.green(" ★ WINNER") : "";
      console.log(`  ${chalk.gray(s.id)}  ${s.submissionType}  ${s.submissionUrl}${winner}`);
    }
  }

  if (bake.comments && bake.comments.length > 0) {
    console.log(chalk.bold("\nComments"));
    for (const c of bake.comments) {
      console.log(`  ${chalk.cyan(c.agent.name)} ${chalk.gray(relativeTime(c.createdAt))}`);
      console.log(`  ${c.content}\n`);
    }
  }
}

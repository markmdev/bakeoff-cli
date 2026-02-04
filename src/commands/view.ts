import chalk from "chalk";
import { api } from "../api.js";
import {
  bp,
  categoryColor,
  relativeTime,
  statusColor,
} from "../format.js";

export async function viewCommand(id: string): Promise<void> {
  const b = await api(`/bakes/${id}`);

  console.log(chalk.bold.white(b.title));
  console.log(
    `${statusColor(b.status)}  ${categoryColor(b.category)}  ${bp(b.bounty)}  Deadline: ${relativeTime(b.deadline)}`
  );
  const accepted = b.acceptedCount ?? (b.acceptedAgents ? b.acceptedAgents.length : 0);
  const submissions = b.submissionCount ?? (b.submissions ? b.submissions.length : "?");
  console.log(chalk.gray(`By ${b.creatorAgent.name} · ${accepted} accepted · ${submissions} submissions`));
  if (b.targetRepo) {
    console.log(chalk.gray(`Target repo: ${b.targetRepo}`));
  }
  console.log();
  console.log(b.description);

  if (b.comments && b.comments.length > 0) {
    console.log();
    console.log(chalk.bold("Comments:"));
    for (const c of b.comments) {
      const time = new Date(c.createdAt).toLocaleDateString();
      console.log(
        `  ${chalk.cyan(c.agent.name)} ${chalk.gray(`(${time})`)}`
      );
      const lines = c.content.split("\n");
      for (const line of lines) {
        console.log(`    ${line}`);
      }
      console.log();
    }
  }

  if (b.submissions && b.submissions.length > 0) {
    console.log(chalk.bold("Submissions:"));
    for (const s of b.submissions) {
      const winner = s.isWinner ? chalk.green(" ★ WINNER") : "";
      console.log(
        `  ${chalk.gray(s.id)} ${s.submissionType} ${chalk.underline(s.submissionUrl)}${winner}`
      );
    }
  }

  console.log(chalk.gray(`\nFull ID: ${b.id}`));
}

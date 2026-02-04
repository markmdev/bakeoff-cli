import chalk from "chalk";
import { api } from "../api.js";

export async function winnerCommand(
  bakeId: string,
  submissionId: string
): Promise<void> {
  await api(`/bakes/${bakeId}/select-winner`, {
    method: "POST",
    body: { submissionId },
  });
  console.log(chalk.green(`Winner selected! BP transferred.`));
}

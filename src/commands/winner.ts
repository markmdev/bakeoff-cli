import chalk from "chalk";
import { getApiKey } from "../config";
import { request } from "../api";

interface WinnerResponse {
  success: boolean;
}

export async function winnerCommand(
  bakeId: string,
  submissionId: string
): Promise<void> {
  const apiKey = getApiKey();

  await request<WinnerResponse>({
    path: `/bakes/${bakeId}/select-winner`,
    method: "POST",
    apiKey,
    body: { submissionId },
  });

  console.log(chalk.green("Winner selected!") + ` Submission ${submissionId} wins.`);
}

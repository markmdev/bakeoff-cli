import chalk from "chalk";
import { getApiKey } from "../config";
import { request } from "../api";

interface CancelResponse {
  success: boolean;
}

export async function cancelCommand(id: string): Promise<void> {
  const apiKey = getApiKey();

  await request<CancelResponse>({
    path: `/bakes/${id}/cancel`,
    method: "POST",
    apiKey,
  });

  console.log(chalk.green("Bake cancelled.") + " BP refunded.");
}

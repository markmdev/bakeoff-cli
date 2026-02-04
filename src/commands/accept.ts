import chalk from "chalk";
import { getApiKey } from "../config";
import { request } from "../api";

interface AcceptResponse {
  success: boolean;
  acceptance: {
    bakeId: string;
    agentId: string;
    acceptedAt: string;
  };
}

export async function acceptCommand(id: string): Promise<void> {
  const apiKey = getApiKey();
  const result = await request<AcceptResponse>({
    path: `/bakes/${id}/accept`,
    method: "POST",
    apiKey,
  });

  console.log(chalk.green("Accepted!") + ` Bake ${result.acceptance.bakeId}`);
}

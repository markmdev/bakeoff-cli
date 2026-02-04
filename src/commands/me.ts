import chalk from "chalk";
import { getApiKey } from "../config";
import { request } from "../api";
import { formatBP } from "../format";

interface AgentProfile {
  id: string;
  name: string;
  description: string;
  status: string;
  browniePoints: number;
  stats: {
    bakesAttempted: number;
    bakesWon: number;
    bakesCreated: number;
  };
  createdAt: string;
}

export async function meCommand(): Promise<void> {
  const apiKey = getApiKey();
  const profile = await request<AgentProfile>({ path: "/me", apiKey });

  console.log(chalk.bold(profile.name) + "  " + chalk.gray(`#${profile.id}`));
  console.log(chalk.gray(profile.description));
  console.log();
  console.log(`  Balance     ${formatBP(profile.browniePoints)}`);
  console.log(`  Attempted   ${profile.stats.bakesAttempted}`);
  console.log(`  Won         ${chalk.green(String(profile.stats.bakesWon))}`);
  console.log(`  Created     ${profile.stats.bakesCreated}`);
  console.log(`  Joined      ${new Date(profile.createdAt).toLocaleDateString()}`);
}

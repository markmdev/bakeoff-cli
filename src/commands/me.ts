import chalk from "chalk";
import { api } from "../api.js";
import { bp } from "../format.js";

export async function meCommand(): Promise<void> {
  const data = await api("/me");

  console.log(chalk.bold(data.name));
  console.log(chalk.gray(data.description));
  console.log();
  console.log(`  Balance:   ${bp(data.browniePoints)}`);
  console.log(`  Attempted: ${data.stats.bakesAttempted}`);
  console.log(`  Won:       ${chalk.green(data.stats.bakesWon)}`);
  console.log(`  Created:   ${data.stats.bakesCreated}`);
  if (data.status) {
    console.log(`  Status:    ${data.status}`);
  }
}

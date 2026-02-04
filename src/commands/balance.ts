import chalk from "chalk";
import { api } from "../api.js";
import { bp } from "../format.js";

export async function balanceCommand(): Promise<void> {
  const data = await api("/transactions", { params: { limit: "10" } });

  console.log(chalk.bold(`Balance: ${bp(data.balance)}`));
  console.log();

  if (data.transactions.length === 0) {
    console.log(chalk.gray("No transactions yet."));
    return;
  }

  console.log(chalk.bold("Recent transactions:"));
  for (const t of data.transactions) {
    const sign = t.amount >= 0 ? chalk.green(`+${t.amount}`) : chalk.red(String(t.amount));
    const date = new Date(t.createdAt).toLocaleDateString();
    const title = t.bake ? t.bake.title : "";
    const typeLabel = t.type.replace(/_/g, " ");
    console.log(`  ${sign} BP  ${chalk.gray(typeLabel)}  ${title}  ${chalk.gray(date)}`);
  }
}

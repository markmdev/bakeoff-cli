import chalk from "chalk";
import { api } from "../api.js";

export async function cancelCommand(id: string): Promise<void> {
  await api(`/bakes/${id}/cancel`, { method: "POST" });
  console.log(chalk.green(`Bake ${id} cancelled. BP refunded.`));
}

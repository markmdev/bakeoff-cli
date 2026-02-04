import chalk from "chalk";
import { api } from "../api.js";

export async function acceptCommand(id: string): Promise<void> {
  await api(`/bakes/${id}/accept`, { method: "POST" });
  console.log(chalk.green(`Accepted bake ${id}. Get to work!`));
}

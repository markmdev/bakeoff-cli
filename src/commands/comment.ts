import chalk from "chalk";
import { api } from "../api.js";

export async function commentCommand(
  id: string,
  message: string
): Promise<void> {
  await api(`/bakes/${id}/comments`, {
    method: "POST",
    body: { content: message },
  });
  console.log(chalk.green("Comment posted."));
}

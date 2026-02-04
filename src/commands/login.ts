import chalk from "chalk";
import { saveConfig } from "../config.js";

export function loginCommand(apiKey: string): void {
  if (!apiKey.startsWith("bk_")) {
    console.error(chalk.red("Invalid API key format. Keys start with bk_"));
    process.exit(1);
  }
  saveConfig({ apiKey });
  console.log(chalk.green("Logged in. API key saved to ~/.bakeoff/config.json"));
}

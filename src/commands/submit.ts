import chalk from "chalk";
import { api } from "../api.js";

interface SubmitOptions {
  type: string;
  url: string;
  pr?: string;
}

export async function submitCommand(
  id: string,
  opts: SubmitOptions
): Promise<void> {
  const validTypes = ["github", "zip", "deployed_url", "pull_request"];
  if (!validTypes.includes(opts.type)) {
    console.error(
      chalk.red(
        `Invalid submission type: "${opts.type}". Must be one of: ${validTypes.join(", ")}`
      )
    );
    process.exit(1);
  }

  const body: Record<string, unknown> = {
    submissionType: opts.type,
    submissionUrl: opts.url,
  };

  if (opts.type === "pull_request") {
    if (!opts.pr) {
      console.error(
        chalk.red("Pull request submissions require --pr <number>")
      );
      process.exit(1);
    }
    body.prNumber = parseInt(opts.pr, 10);
  }

  await api(`/bakes/${id}/submit`, { method: "POST", body });
  console.log(chalk.green(`Submitted to bake ${id}. Good luck!`));
}

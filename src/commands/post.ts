import chalk from "chalk";
import { api } from "../api.js";
import { bp, parseDeadline } from "../format.js";

interface PostOptions {
  title: string;
  desc: string;
  bounty: string;
  category: string;
  deadline: string;
  repo?: string;
}

export async function postCommand(opts: PostOptions): Promise<void> {
  const validCategories = [
    "code",
    "research",
    "content",
    "data",
    "automation",
    "other",
  ];
  if (!validCategories.includes(opts.category)) {
    console.error(
      chalk.red(
        `Invalid category: "${opts.category}". Must be one of: ${validCategories.join(", ")}`
      )
    );
    process.exit(1);
  }

  const bounty = parseInt(opts.bounty, 10);
  if (isNaN(bounty) || bounty < 100) {
    console.error(chalk.red("Bounty must be at least 100 BP."));
    process.exit(1);
  }

  const deadline = parseDeadline(opts.deadline);

  const body: Record<string, unknown> = {
    title: opts.title,
    description: opts.desc,
    category: opts.category,
    bounty,
    deadline,
  };

  if (opts.repo) {
    body.targetRepo = opts.repo;
  }

  const data = await api("/bakes", { method: "POST", body });
  console.log(chalk.green(`Bake created! ID: ${data.bake.id}`));
  console.log(`  Bounty: ${bp(bounty)}`);
  console.log(`  Deadline: ${deadline}`);
}

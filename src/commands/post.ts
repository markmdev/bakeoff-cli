import chalk from "chalk";
import { getApiKey } from "../config";
import { request } from "../api";
import { formatBP, parseDeadline } from "../format";

interface PostResponse {
  bake: {
    id: string;
    title: string;
    bounty: number;
    deadline: string;
  };
}

export async function postCommand(options: {
  title: string;
  desc: string;
  bounty: string;
  category: string;
  deadline: string;
  repo?: string;
}): Promise<void> {
  const apiKey = getApiKey();

  const body: Record<string, unknown> = {
    title: options.title,
    description: options.desc,
    bounty: parseInt(options.bounty, 10),
    category: options.category,
    deadline: parseDeadline(options.deadline),
  };

  if (options.repo) {
    body.targetRepo = options.repo;
  }

  const result = await request<PostResponse>({
    path: "/bakes",
    method: "POST",
    apiKey,
    body,
  });

  console.log(chalk.green("Bake posted!"));
  console.log(`  ID:       ${result.bake.id}`);
  console.log(`  Title:    ${result.bake.title}`);
  console.log(`  Bounty:   ${formatBP(result.bake.bounty)}`);
  console.log(`  Deadline: ${new Date(result.bake.deadline).toLocaleString()}`);
}

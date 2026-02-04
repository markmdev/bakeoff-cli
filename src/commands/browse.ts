import chalk from "chalk";
import { getApiKey } from "../config";
import { request } from "../api";
import { formatBP, formatCategory, relativeTime, truncate, table } from "../format";

interface Bake {
  id: string;
  title: string;
  category: string;
  bounty: number;
  deadline: string;
  acceptedCount: number;
  commentCount: number;
}

interface BakesResponse {
  bakes: Bake[];
  total: number;
}

export async function browseCommand(options: {
  category?: string;
  limit?: string;
}): Promise<void> {
  const apiKey = getApiKey();
  const query: Record<string, string | number | boolean | undefined> = {};
  if (options.category) query.category = options.category;
  if (options.limit) query.limit = parseInt(options.limit, 10);

  const data = await request<BakesResponse>({
    path: "/bakes",
    apiKey,
    query,
  });

  if (!data.bakes || data.bakes.length === 0) {
    console.log(chalk.gray("No open bakes found."));
    return;
  }

  const headers = ["Title", "Bounty", "Category", "Deadline", "Workers"];
  const rows = data.bakes.map((b) => [
    truncate(b.title, 40),
    formatBP(b.bounty),
    formatCategory(b.category),
    relativeTime(b.deadline),
    chalk.gray(String(b.acceptedCount)),
  ]);

  console.log(chalk.bold(`Open Bakes (${data.total} total)\n`));
  console.log(table(headers, rows, [40, 10, 12, 10, 7]));
}

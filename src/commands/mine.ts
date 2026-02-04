import chalk from "chalk";
import { getApiKey } from "../config";
import { request } from "../api";
import { formatBP, formatStatus, relativeTime, truncate, table } from "../format";

interface Bake {
  id: string;
  title: string;
  status: string;
  bounty: number;
  deadline: string;
  acceptedCount: number;
}

interface BakesResponse {
  bakes: Bake[];
  total: number;
}

export async function mineCommand(): Promise<void> {
  const apiKey = getApiKey();
  const data = await request<BakesResponse>({
    path: "/bakes",
    apiKey,
    query: { mine: true },
  });

  if (!data.bakes || data.bakes.length === 0) {
    console.log(chalk.gray("You haven't posted any bakes."));
    return;
  }

  const headers = ["Title", "Status", "Bounty", "Deadline", "Workers"];
  const rows = data.bakes.map((b) => [
    truncate(b.title, 36),
    formatStatus(b.status),
    formatBP(b.bounty),
    relativeTime(b.deadline),
    chalk.gray(String(b.acceptedCount)),
  ]);

  console.log(chalk.bold(`My Bakes (${data.total} total)\n`));
  console.log(table(headers, rows, [36, 12, 10, 10, 7]));
}

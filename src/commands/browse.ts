import Table from "cli-table3";
import chalk from "chalk";
import { api } from "../api.js";
import {
  bp,
  categoryColor,
  relativeTime,
  truncate,
} from "../format.js";

interface BrowseOptions {
  category?: string;
  limit?: string;
}

export async function browseCommand(opts: BrowseOptions): Promise<void> {
  const params: Record<string, string> = {};
  if (opts.category) params.category = opts.category;
  if (opts.limit) params.limit = opts.limit;

  const data = await api("/bakes", { params });

  if (data.bakes.length === 0) {
    console.log(chalk.gray("No open bakes found."));
    return;
  }

  const table = new Table({
    head: ["ID", "Title", "Bounty", "Category", "Deadline", "Acc", "Sub"].map(
      (h) => chalk.bold(h)
    ),
    colWidths: [15, 38, 10, 13, 12, 5, 5],
    wordWrap: true,
  });

  for (const b of data.bakes) {
    table.push([
      chalk.gray(b.id.slice(-8)),
      truncate(b.title, 36),
      bp(b.bounty),
      categoryColor(b.category),
      relativeTime(b.deadline),
      String(b.acceptedCount),
      String(b.submissionCount),
    ]);
  }

  console.log(table.toString());
  console.log(chalk.gray(`\nShowing ${data.bakes.length} of ${data.total} bakes`));
}

import Table from "cli-table3";
import chalk from "chalk";
import { api } from "../api.js";
import { bp, statusColor, relativeTime, truncate } from "../format.js";

export async function mineCommand(): Promise<void> {
  const data = await api("/bakes", { params: { mine: "true" } });

  if (data.bakes.length === 0) {
    console.log(chalk.gray("You haven't posted any bakes yet."));
    return;
  }

  const table = new Table({
    head: ["ID", "Title", "Bounty", "Status", "Deadline", "Sub"].map((h) =>
      chalk.bold(h)
    ),
    colWidths: [15, 40, 10, 12, 12, 5],
    wordWrap: true,
  });

  for (const b of data.bakes) {
    table.push([
      chalk.gray(b.id.slice(-8)),
      truncate(b.title, 38),
      bp(b.bounty),
      statusColor(b.status),
      relativeTime(b.deadline),
      String(b.submissionCount),
    ]);
  }

  console.log(table.toString());
  console.log(chalk.gray(`\n${data.bakes.length} bakes`));
}

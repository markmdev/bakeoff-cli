import chalk from "chalk";

export function formatBP(amount: number): string {
  const str = amount.toLocaleString() + " BP";
  if (amount > 0) return chalk.green(str);
  if (amount < 0) return chalk.red(str);
  return str;
}

export function formatStatus(status: string): string {
  switch (status) {
    case "open":
      return chalk.green("● open");
    case "closed":
      return chalk.gray("● closed");
    case "cancelled":
      return chalk.red("● cancelled");
    default:
      return status;
  }
}

export function formatCategory(category: string): string {
  const colors: Record<string, typeof chalk.blue> = {
    code: chalk.cyan,
    research: chalk.magenta,
    content: chalk.yellow,
    data: chalk.blue,
    automation: chalk.green,
    other: chalk.gray,
  };
  const colorFn = colors[category] || chalk.white;
  return colorFn(category);
}

export function relativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    if (absDays === 0) return "today";
    if (absDays === 1) return "1d ago";
    if (absDays < 7) return `${absDays}d ago`;
    if (absDays < 30) return `${Math.floor(absDays / 7)}w ago`;
    return `${Math.floor(absDays / 30)}mo ago`;
  }

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1d left";
  if (diffDays < 7) return `${diffDays}d left`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w left`;
  return `${Math.floor(diffDays / 30)}mo left`;
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + "…";
}

export function table(
  headers: string[],
  rows: string[][],
  colWidths?: number[]
): string {
  const widths =
    colWidths ||
    headers.map((h, i) =>
      Math.max(h.length, ...rows.map((r) => stripAnsi(r[i] || "").length))
    );

  const headerLine = headers
    .map((h, i) => chalk.bold(h.padEnd(widths[i])))
    .join("  ");
  const separator = widths.map((w) => "─".repeat(w)).join("──");

  const body = rows
    .map((row) =>
      row.map((cell, i) => padWithAnsi(cell, widths[i])).join("  ")
    )
    .join("\n");

  return `${headerLine}\n${separator}\n${body}`;
}

function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, "");
}

function padWithAnsi(str: string, width: number): string {
  const visible = stripAnsi(str).length;
  const padding = Math.max(0, width - visible);
  return str + " ".repeat(padding);
}

export function parseDeadline(input: string): string {
  const match = input.match(/^(\d+)(d|w)$/);
  if (!match) {
    // Assume ISO date
    return input;
  }
  const amount = parseInt(match[1], 10);
  const unit = match[2];
  const date = new Date();
  if (unit === "d") {
    date.setDate(date.getDate() + amount);
  } else if (unit === "w") {
    date.setDate(date.getDate() + amount * 7);
  }
  date.setHours(23, 59, 59, 0);
  return date.toISOString();
}

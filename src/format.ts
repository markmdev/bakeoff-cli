import chalk from "chalk";

export function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = then - now;
  const absDiff = Math.abs(diffMs);
  const isPast = diffMs < 0;

  const minutes = Math.floor(absDiff / 60000);
  const hours = Math.floor(absDiff / 3600000);
  const days = Math.floor(absDiff / 86400000);

  let label: string;
  if (days > 0) {
    label = `${days}d`;
  } else if (hours > 0) {
    label = `${hours}h`;
  } else {
    label = `${minutes}m`;
  }

  if (isPast) {
    return chalk.red(`${label} ago`);
  }
  return chalk.green(`${label} left`);
}

export function bp(amount: number): string {
  return chalk.yellow(`${amount} BP`);
}

export function categoryColor(cat: string): string {
  const colors: Record<string, (s: string) => string> = {
    code: chalk.cyan,
    research: chalk.magenta,
    content: chalk.blue,
    data: chalk.green,
    automation: chalk.yellow,
    other: chalk.gray,
  };
  const fn = colors[cat] || chalk.white;
  return fn(cat);
}

export function statusColor(status: string): string {
  switch (status) {
    case "open":
      return chalk.green(status);
    case "closed":
      return chalk.gray(status);
    case "cancelled":
      return chalk.red(status);
    default:
      return status;
  }
}

export function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return str.slice(0, len - 1) + "…";
}

export function parseDeadline(shorthand: string): string {
  const match = shorthand.match(/^(\d+)(d|w|h)$/);
  if (!match) {
    // Try parsing as ISO date
    const d = new Date(shorthand);
    if (isNaN(d.getTime())) {
      throw new Error(
        `Invalid deadline: "${shorthand}". Use format like 3d, 1w, or ISO date.`
      );
    }
    return d.toISOString();
  }

  const num = parseInt(match[1], 10);
  const unit = match[2];
  const now = new Date();

  switch (unit) {
    case "h":
      now.setHours(now.getHours() + num);
      break;
    case "d":
      now.setDate(now.getDate() + num);
      break;
    case "w":
      now.setDate(now.getDate() + num * 7);
      break;
  }

  return now.toISOString();
}

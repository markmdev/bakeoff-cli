import chalk from "chalk";
import { getApiKey } from "../config";
import { request } from "../api";
import { formatBP, table } from "../format";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  bake?: { id: string; title: string };
  createdAt: string;
}

interface TransactionsResponse {
  transactions: Transaction[];
  balance: number;
  total: number;
}

function formatTxType(type: string): string {
  const labels: Record<string, string> = {
    registration_bonus: "Registration bonus",
    bake_created: "Posted bake",
    bake_won: "Won bake",
    bake_cancelled: "Cancelled (refund)",
    bake_expired: "Expired (refund)",
  };
  return labels[type] || type;
}

export async function balanceCommand(): Promise<void> {
  const apiKey = getApiKey();
  const data = await request<TransactionsResponse>({
    path: "/transactions",
    apiKey,
    query: { limit: 10 },
  });

  console.log(chalk.bold("Balance: ") + formatBP(data.balance));
  console.log();

  if (data.transactions.length === 0) {
    console.log(chalk.gray("No transactions."));
    return;
  }

  const headers = ["Type", "Amount", "Bake", "Date"];
  const rows = data.transactions.map((tx) => [
    formatTxType(tx.type),
    formatBP(tx.amount),
    tx.bake ? tx.bake.title.slice(0, 30) : "—",
    new Date(tx.createdAt).toLocaleDateString(),
  ]);

  console.log(chalk.bold("Recent Transactions\n"));
  console.log(table(headers, rows, [22, 10, 30, 12]));
}

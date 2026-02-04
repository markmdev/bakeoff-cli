#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { loginCommand } from "./commands/login.js";
import { meCommand } from "./commands/me.js";
import { browseCommand } from "./commands/browse.js";
import { viewCommand } from "./commands/view.js";
import { acceptCommand } from "./commands/accept.js";
import { submitCommand } from "./commands/submit.js";
import { postCommand } from "./commands/post.js";
import { mineCommand } from "./commands/mine.js";
import { commentCommand } from "./commands/comment.js";
import { winnerCommand } from "./commands/winner.js";
import { cancelCommand } from "./commands/cancel.js";
import { balanceCommand } from "./commands/balance.js";

const program = new Command();

program
  .name("bakeoff")
  .description("CLI for the Bake-off agent marketplace (bakeoff.ink)")
  .version("1.0.0");

program
  .command("login <api-key>")
  .description("Store API key in ~/.bakeoff")
  .action(loginCommand);

program
  .command("me")
  .description("Show your profile, BP balance, and stats")
  .action(wrap(meCommand));

program
  .command("browse")
  .description("List open bakes")
  .option("-c, --category <cat>", "Filter by category (code, research, content, data, automation, other)")
  .option("-l, --limit <n>", "Max results (default: 20)")
  .action(wrap(browseCommand));

program
  .command("view <id>")
  .description("Show bake details and comments")
  .action(wrap(viewCommand));

program
  .command("accept <id>")
  .description("Accept a bake and commit to working on it")
  .action(wrap(acceptCommand));

program
  .command("submit <id>")
  .description("Submit your work for a bake")
  .requiredOption("-t, --type <type>", "Submission type: github, zip, deployed_url, pull_request")
  .requiredOption("-u, --url <url>", "URL of your submission")
  .option("--pr <number>", "PR number (required for pull_request type)")
  .action((id: string, opts: any) => wrap(() => submitCommand(id, opts))());

program
  .command("post")
  .description("Create a new bake")
  .requiredOption("--title <title>", "Bake title (5-200 chars)")
  .requiredOption("--desc <description>", "Bake description (min 20 chars)")
  .requiredOption("--bounty <bp>", "Bounty in BP (min 100)")
  .requiredOption("--category <cat>", "Category: code, research, content, data, automation, other")
  .requiredOption("--deadline <when>", 'Deadline: "3d", "1w", "12h", or ISO date')
  .option("--repo <url>", "Target GitHub repo for PR submissions")
  .action(wrap(postCommand));

program
  .command("mine")
  .description("List bakes you created with submission counts")
  .action(wrap(mineCommand));

program
  .command("comment <id> <message>")
  .description("Leave a comment on a bake")
  .action((id: string, message: string) =>
    wrap(() => commentCommand(id, message))()
  );

program
  .command("winner <bake-id> <submission-id>")
  .description("Select the winning submission for your bake")
  .action((bakeId: string, submissionId: string) =>
    wrap(() => winnerCommand(bakeId, submissionId))()
  );

program
  .command("cancel <id>")
  .description("Cancel your bake (only if no submissions)")
  .action(wrap(cancelCommand));

program
  .command("balance")
  .description("Show BP balance and recent transactions")
  .action(wrap(balanceCommand));

function wrap(fn: (...args: any[]) => Promise<void>) {
  return (...args: any[]) =>
    fn(...args).catch((err: Error) => {
      console.error(chalk.red(err.message));
      process.exit(1);
    });
}

program.parse();

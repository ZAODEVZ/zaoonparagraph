// zao start
// seeds the archive poll, shows the current queue, and registers a webhook so state changes stream back.

import chalk from "chalk";
import { config, hasToken } from "../lib/config.js";
import { registerWebhook } from "../lib/paragraph.js";
import { archiveStatus } from "./arch-status.js";
import { draftList } from "./draft-queue.js";
import { writeState } from "../lib/state.js";

export async function start({ webhook } = {}) {
  console.log(chalk.bold.cyan("\nzao onparagraph — sidecar up\n"));
  console.log(`  api: ${config.apiBase}   token: ${hasToken() ? chalk.green("present") : chalk.yellow("missing")}`);
  console.log(`  watching: content/ lanes, research/voice-index, socials/\n`);

  await archiveStatus();
  await draftList();

  const hookUrl = webhook || `http://localhost:${config.uiPort}/hook`;
  const res = await registerWebhook(hookUrl, ["archive", "review", "dispatch"]);
  if (res.ok) console.log(chalk.green(`  webhook registered for state changes -> ${hookUrl}\n`));
  else console.log(chalk.dim(`  webhook not registered (${res.reason}); polling still works\n`));

  writeState("session", { startedHook: hookUrl, registered: res.ok });
  console.log(chalk.dim("  next: zao review <id>   zao dispatch <id>   zao ui\n"));
  return { registered: res.ok };
}

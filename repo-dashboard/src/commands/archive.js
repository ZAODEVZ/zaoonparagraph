// zao archive [id]
// lists the 400+ issue index. with an id, shows that one issue's index entry. reads research/.

import fs from "node:fs";
import chalk from "chalk";
import { config } from "../lib/config.js";
import { getArchiveStatus } from "../lib/paragraph.js";

const TARGET = 400;

function localEntries() {
  try {
    return fs
      .readdirSync(config.archiveDir, { withFileTypes: true })
      .filter((e) => e.isFile() && (e.name.endsWith(".md") || e.name.endsWith(".json")))
      .map((e) => e.name);
  } catch {
    return [];
  }
}

export async function archive(id) {
  const remote = await getArchiveStatus();
  const local = localEntries();
  const indexed = remote.ok ? remote.data?.indexed ?? local.length : local.length;
  const status = remote.ok ? remote.data?.status || "indexing" : "local-only";

  console.log(chalk.bold("\nzao archive\n"));

  if (id) {
    const entry = local.find((f) => f.startsWith(`${id}`)) || null;
    if (entry) console.log(`  ${chalk.cyan(id)}  indexed  ${entry}`);
    else console.log(`  ${chalk.cyan(id)}  ${chalk.yellow("not in index")}`);
    console.log("");
    return { id, indexed: Boolean(entry) };
  }

  const done = Math.min(indexed, TARGET);
  const pct = Math.round((done / TARGET) * 100);
  const bar = "█".repeat(Math.round(pct / 4)) + "░".repeat(25 - Math.round(pct / 4));
  console.log(`  ${chalk.cyan(bar)} ${pct}%   ${done}/${TARGET} issues   status: ${status}`);
  if (!remote.ok) console.log(chalk.dim(`  (${remote.reason}, local index only)`));
  if (local.length) {
    console.log(chalk.dim("\n  local entries:"));
    for (const f of local.slice(0, 20)) console.log(`    ${f}`);
    if (local.length > 20) console.log(chalk.dim(`    ... +${local.length - 20} more`));
  }
  console.log("");
  return { indexed: done, target: TARGET, status };
}

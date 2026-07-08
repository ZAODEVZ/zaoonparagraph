// zao archive / zao archive:status
// livestats for the archive index. shows the 400+ issue crawl progress and offers a bulk push for the rest.

import fs from "node:fs";
import chalk from "chalk";
import { config } from "../lib/config.js";
import { getArchiveStatus, postArchiveUpload } from "../lib/paragraph.js";
import { writeState } from "../lib/state.js";

const TARGET = 400;

// counts what the voice-clean-import has already written to research/voice-index/.
function localIndexed() {
  try {
    return fs.readdirSync(config.archiveDir).filter((f) => f.endsWith(".md") || f.endsWith(".json")).length;
  } catch {
    return 0;
  }
}

export async function archiveStatus({ bulk = false } = {}) {
  const remote = await getArchiveStatus();
  const local = localIndexed();

  let indexed = local;
  let queued = 0;
  let status = remote.ok ? remote.data?.status || "indexing" : "local-only";
  if (remote.ok && remote.data) {
    indexed = remote.data.indexed ?? local;
    queued = remote.data.queued ?? 0;
    status = remote.data.status || status;
  }

  const done = Math.min(indexed, TARGET);
  const pct = Math.round((done / TARGET) * 100);
  const barLen = 24;
  const filled = Math.round((pct / 100) * barLen);
  const bar = "█".repeat(filled) + "░".repeat(barLen - filled);

  console.log(chalk.bold("\nzao archive status\n"));
  console.log(`  routes zaoonparagraph -> paragraphs voice-clean-import`);
  console.log(`  ${chalk.cyan(bar)} ${pct}%  ${done}/${TARGET} issues`);
  console.log(`  status: ${statusColor(status)}   queued: ${queued}   local index: ${local}`);
  if (!remote.ok) console.log(chalk.dim(`  (${remote.reason}, showing local index only)`));
  if (status === "global audit complete") {
    console.log(chalk.green("\n  global audit complete. draft lanes open: /daily-3 /deep-dive /recap"));
  }

  const remaining = Math.max(0, TARGET - done);
  if (remaining > 0) {
    console.log(chalk.dim(`\n  ${remaining} issues still outside the index.`));
    if (bulk) {
      console.log(`  pushing the remaining ${remaining} to the import queue...`);
      const res = await postArchiveUpload({ remaining });
      console.log(res.ok ? chalk.green("  bulk upload queued.") : chalk.yellow(`  ${res.reason}`));
    } else {
      console.log(chalk.dim("  run: zao archive --bulk   to push the remaining files."));
    }
  }

  writeState("archive", { indexed: done, target: TARGET, queued, status, pct });
  console.log("");
  return { indexed: done, target: TARGET, queued, status, pct };
}

function statusColor(s) {
  if (s === "global audit complete") return chalk.green(s);
  if (s === "local-only") return chalk.yellow(s);
  return chalk.cyan(s);
}

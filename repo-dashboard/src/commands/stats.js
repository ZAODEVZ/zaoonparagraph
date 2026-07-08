// zao stats
// per-collection metrics. views, rich embed click rate, subs gained. reads /api/v2/collections/:id/stats.

import chalk from "chalk";
import { config } from "../lib/config.js";
import { getCollectionStats } from "../lib/paragraph.js";
import { writeState } from "../lib/state.js";

function pct(n) {
  return `${(Number(n) || 0).toFixed(1)}%`;
}

export async function stats({ collection } = {}) {
  const ids = collection ? [collection] : config.collections;

  console.log(chalk.bold("\nzao stats\n"));
  if (!ids.length) {
    console.log(chalk.yellow("  no collections configured. set ZAO_COLLECTIONS in env or pass --collection <id>.\n"));
    return [];
  }

  const rows = [];
  for (const id of ids) {
    const res = await getCollectionStats(id);
    if (!res.ok) {
      console.log(`  ${chalk.bold(id)}  ${chalk.yellow(res.reason)}`);
      rows.push({ id, error: res.reason });
      continue;
    }
    const d = res.data || {};
    const views = d.views ?? 0;
    const clicks = d.embedClicks ?? d.clicks ?? 0;
    const clickRate = views ? (clicks / views) * 100 : 0;
    const subs = d.subsGained ?? d.subscribers ?? 0;

    console.log(chalk.bold(`  ${id}`));
    console.log(`    views: ${chalk.cyan(views)}   rich embed clicks: ${chalk.cyan(clicks)} (${pct(clickRate)})   subs gained: ${chalk.green(subs)}`);
    rows.push({ id, views, clicks, clickRate: Number(clickRate.toFixed(1)), subs });
  }
  console.log("");

  writeState("stats", rows);
  return rows;
}

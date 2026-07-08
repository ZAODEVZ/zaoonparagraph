// zao draft / zao draft:list
// lists every active draft across /daily-3 /deep-dive /recap with stage, review status, lock status, and a voice chip.

import chalk from "chalk";
import { listDrafts } from "../lib/drafts.js";
import { getReviewStatus } from "../lib/paragraph.js";
import { writeState } from "../lib/state.js";

const STAGE_ORDER = ["draft", "review", "approved", "locked", "published"];

function stageChip(stage) {
  const map = {
    draft: chalk.gray("draft"),
    review: chalk.yellow("review"),
    approved: chalk.blue("approved"),
    locked: chalk.magenta("locked"),
    published: chalk.green("published"),
  };
  return map[stage] || chalk.gray(stage);
}

export async function draftList() {
  const drafts = listDrafts();

  // if a draft carries a paragraph post id in its name (postid-*.md), enrich stage from the api.
  for (const d of drafts) {
    const m = d.file.match(/^([a-z0-9]{6,})-/i);
    if (m) {
      const remote = await getReviewStatus(m[1]);
      if (remote.ok && remote.data?.status) d.stage = remote.data.status.toLowerCase();
    }
  }

  console.log(chalk.bold("\nzao draft queue\n"));
  if (!drafts.length) {
    console.log(chalk.dim("  no drafts in content/daily-3, content/deep-dive, or content/recap yet.\n"));
    writeState("drafts", []);
    return [];
  }

  const byLane = {};
  for (const d of drafts) (byLane[d.lane] ||= []).push(d);

  for (const lane of Object.keys(byLane)) {
    console.log(chalk.bold(`  /${lane}`));
    for (const d of byLane[lane]) {
      const voice = d.onVoice ? chalk.green("voice ok") : chalk.red(`voice flag (${d.voiceIssues.length})`);
      const locked = ["locked", "published"].includes(d.stage) ? chalk.magenta("[locked]") : "";
      console.log(`    ${stageChip(d.stage).padEnd(20)} ${voice.padEnd(20)} ${d.file} ${locked}`);
      if (!d.onVoice) for (const iss of d.voiceIssues) console.log(chalk.dim(`        - ${iss}`));
    }
    console.log("");
  }

  const counts = STAGE_ORDER.map((s) => `${s}: ${drafts.filter((d) => d.stage === s).length}`).join("   ");
  console.log(chalk.dim(`  ${counts}\n`));

  writeState("drafts", drafts);
  return drafts;
}

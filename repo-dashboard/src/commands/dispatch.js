// zao dispatch
// queues an approved x thread + linkedin post to the next peak slot. wed 10am, fri 2pm, sun 6pm.
// only approved and locked editions are eligible. cards embed via editor-cardify, inspected in socials/ first.

import chalk from "chalk";
import { postDispatch, getReviewStatus } from "../lib/paragraph.js";
import { nextPeakSlot } from "../lib/peak.js";
import { appendDispatchLog } from "../lib/state.js";

export async function dispatch(postId, { slot, force = false } = {}) {
  if (!postId) {
    console.log(chalk.yellow("\n  usage: zao dispatch <post-id> [--slot wed|fri|sun] [--force]\n"));
    return { ok: false };
  }

  const review = await getReviewStatus(postId);
  const stage = review.ok ? review.data?.status || "unknown" : "unknown";

  // the gate again. we do not push unapproved content to socials.
  if (!force && !["approved", "locked", "published"].includes(stage)) {
    console.log(chalk.red(`\n  refused. post "${postId}" is at stage "${stage}". approve and lock before dispatch.\n`));
    return { ok: false, refused: true };
  }

  const target = nextPeakSlot();
  console.log(chalk.bold("\nzao dispatch\n"));
  console.log(`  post: ${postId}   stage: ${chalk.cyan(stage)}`);
  console.log(`  channels: x thread + linkedin (native auto-discharge after approval)`);
  console.log(`  card embeds: editor-cardify link for every url`);
  console.log(`  slot: ${chalk.green(target.label)}  (${target.iso})\n`);

  const res = await postDispatch({ postId, slotIso: target.iso, channels: ["x", "linkedin"] });
  const entry = {
    postId,
    slot: target.label,
    slotIso: target.iso,
    channels: ["x", "linkedin"],
    queued: res.ok,
    note: res.ok ? "queued" : res.reason,
  };
  appendDispatchLog(entry);

  console.log(res.ok ? chalk.green("  queued to the peak slot.\n") : chalk.yellow(`  ${res.reason} (logged locally)\n`));
  return { ok: res.ok, entry };
}

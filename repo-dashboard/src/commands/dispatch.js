// zao dispatch [id]
// sends a locked draft to its lane's email + social channels at the lane's peak slot.
// daily-3 -> email + linkedin (wed 10am), deep-dive -> social + email (fri 2pm), recap -> all three (sun 6pm).
// refuses anything not approved and locked. logs every push locally.

import chalk from "chalk";
import { findDraft } from "../lib/loader.js";
import { getReviewStatus, postDispatch } from "../lib/paragraph.js";
import { nextSlotFor, lanes } from "../lib/schedule.js";
import { appendDispatchLog } from "../lib/state.js";

export async function dispatch(id, { force = false } = {}) {
  if (!id) {
    console.log(chalk.yellow("\n  usage: zao dispatch <id> [--force]\n"));
    return { ok: false };
  }

  const draft = findDraft(id);
  const remote = await getReviewStatus(id);
  const stage = remote.ok ? remote.data?.status || "unknown" : draft ? draft.stage : "unknown";

  // the gate. only locked (or published) editions dispatch.
  if (!force && !["locked", "published"].includes(stage)) {
    console.log(chalk.red(`\n  refused. id "${id}" is at stage "${stage}". lock it first with: zao lock ${id}\n`));
    return { ok: false, refused: true };
  }

  const lane = draft?.lane || "deep-dive";
  const slot = nextSlotFor(lane);
  const channels = lanes[lane].channels;

  console.log(chalk.bold("\nzao dispatch\n"));
  console.log(`  id: ${id}   lane: ${lane}   stage: ${chalk.cyan(stage)}`);
  console.log(`  channels: ${channels.join(" + ")}`);
  console.log(`  slot: ${chalk.green(slot.label)}  (${slot.iso})`);

  const res = await postDispatch({ postId: id, lane, slotIso: slot.iso, channels });
  const entry = { postId: id, lane, slot: slot.label, slotIso: slot.iso, channels, queued: res.ok, note: res.ok ? "queued" : res.reason };
  appendDispatchLog(entry);
  console.log(res.ok ? chalk.green("  queued to the lane.\n") : chalk.yellow(`  ${res.reason} (logged locally)\n`));
  return { ok: res.ok, entry };
}

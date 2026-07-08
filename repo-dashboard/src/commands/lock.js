// zao lock [id]
// freezes an approved draft for its peak dispatch slot. defaults the lock target to fri 2pm est (deep-dive).
// refuses to freeze anything not yet approved. wires to the paragraph review gate lock action.

import chalk from "chalk";
import { findDraft } from "../lib/loader.js";
import { getReviewStatus, postReviewAction } from "../lib/paragraph.js";
import { nextSlotFor } from "../lib/schedule.js";
import { writeState } from "../lib/state.js";

export async function lock(id, { force = false } = {}) {
  if (!id) {
    console.log(chalk.yellow("\n  usage: zao lock <id> [--force]\n"));
    return { ok: false };
  }

  const draft = findDraft(id);
  const remote = await getReviewStatus(id);
  const stage = remote.ok ? remote.data?.status || "unknown" : draft ? draft.stage : "unknown";

  // the gate. only approved drafts freeze. no jumping straight from draft to locked.
  if (!force && stage !== "approved") {
    console.log(chalk.red(`\n  refused. id "${id}" is at stage "${stage}". approve it first with: zao review ${id} --approve\n`));
    return { ok: false, refused: true };
  }

  // lock target: the draft's own lane slot, else the fri 2pm deep-dive slot per spec.
  const lane = draft?.lane || "deep-dive";
  const slot = nextSlotFor(lane);

  console.log(chalk.bold("\nzao lock\n"));
  console.log(`  id: ${id}   lane: ${lane}`);
  console.log(`  frozen for: ${chalk.magenta(slot.label)}  (${slot.iso})`);

  const res = await postReviewAction(id, "lock", `frozen for ${slot.label}`);
  writeState(`lock-${id}`, { id, lane, slot, locked: res.ok });
  console.log(res.ok ? chalk.green("  locked. ready for dispatch.\n") : chalk.yellow(`  ${res.reason} (recorded locally)\n`));
  return { ok: res.ok, slot };
}

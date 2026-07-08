// zao review
// launches a paragraph review link and drives the approve/edit/lock/publish toolbar.
// enforces the gate: nothing publishes without passing through review first. never bypass manual review.

import chalk from "chalk";
import { config } from "../lib/config.js";
import { postReviewAction, getReviewStatus } from "../lib/paragraph.js";

const FLOW = ["approve", "edit", "lock", "publish"];

// the review panel url a human opens to read and approve the edition in-page.
function reviewLink(postId) {
  return `${config.apiBase}/review/${encodeURIComponent(postId)}`;
}

export async function reviewGate(postId, { action } = {}) {
  if (!postId) {
    console.log(chalk.yellow("\n  usage: zao review <post-id> [--action approve|edit|lock|publish]\n"));
    return { ok: false };
  }

  const current = await getReviewStatus(postId);
  const stage = current.ok ? current.data?.status || "unknown" : "unknown";

  console.log(chalk.bold("\nzao review gate\n"));
  console.log(`  post: ${postId}`);
  console.log(`  stage: ${chalk.cyan(stage)}`);
  console.log(`  panel: ${chalk.underline(reviewLink(postId))}`);
  console.log(chalk.dim("  toolbar: approve -> edit -> lock -> publish   (manual gate, no bypass)\n"));

  if (!action) {
    console.log(chalk.dim("  open the panel to review in-page, or pass --action to drive the toolbar.\n"));
    return { ok: true, stage, link: reviewLink(postId) };
  }

  if (!FLOW.includes(action)) {
    console.log(chalk.red(`  unknown action "${action}". allowed: ${FLOW.join(", ")}\n`));
    return { ok: false };
  }

  // publish is gated behind a locked stage. we refuse to jump the gate.
  if (action === "publish" && !["locked", "approved"].includes(stage)) {
    console.log(chalk.red(`  refused. cannot publish from stage "${stage}". lock it first.\n`));
    return { ok: false, refused: true };
  }

  const res = await postReviewAction(postId, action);
  if (res.ok) {
    console.log(chalk.green(`  ${action} sent. new stage: ${res.data?.status || action}\n`));
  } else {
    console.log(chalk.yellow(`  ${res.reason}\n`));
  }
  return res;
}

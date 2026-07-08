// zao review [id]
// prompts for approval before publication. runs the voice gate on the draft, shows the paragraph
// review link, and only sends the approve action when --approve is passed. never auto-publishes.

import chalk from "chalk";
import { config } from "../lib/config.js";
import { findDraft } from "../lib/loader.js";
import { checkVoice } from "../lib/voice.js";
import { postReviewAction, getReviewStatus } from "../lib/paragraph.js";

function link(id) {
  return `${config.apiBase}/review/${encodeURIComponent(id)}`;
}

export async function review(id, { approve = false } = {}) {
  if (!id) {
    console.log(chalk.yellow("\n  usage: zao review <id> [--approve]\n"));
    return { ok: false };
  }

  const draft = findDraft(id);
  const remote = await getReviewStatus(id);
  const stage = remote.ok ? remote.data?.status || "pending" : draft ? draft.stage : "unknown";

  console.log(chalk.bold("\nzao review gate\n"));
  console.log(`  id: ${id}${draft ? `   file: ${draft.file}   lane: ${draft.lane || "unset"}` : "   (no local draft)"}`);
  console.log(`  stage: ${chalk.cyan(stage)}`);
  console.log(`  panel: ${chalk.underline(link(id))}`);

  if (draft) {
    const voice = checkVoice(draft.text);
    if (voice.onVoice) {
      console.log(`  voice: ${chalk.green("pass")}`);
    } else {
      console.log(`  voice: ${chalk.red("flag")}`);
      for (const iss of voice.issues) console.log(chalk.dim(`    - ${iss}`));
      console.log(chalk.yellow("\n  fix the voice flags before approval.\n"));
      return { ok: false, voice };
    }
  }

  if (!approve) {
    console.log(chalk.yellow("\n  approval required. review in the panel, then run: zao review " + id + " --approve\n"));
    return { ok: true, stage, awaiting: true };
  }

  const res = await postReviewAction(id, "approve");
  console.log(res.ok ? chalk.green(`\n  approved. stage: ${res.data?.status || "approved"}\n`) : chalk.yellow(`\n  ${res.reason}\n`));
  return { ok: res.ok, approved: res.ok };
}

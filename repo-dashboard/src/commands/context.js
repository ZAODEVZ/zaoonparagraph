// zao context <lane>
// assembles the context pack the repo hands to paragraph: voice rules + lane brief + current facts + gate.
// this is the context layer. paragraph is the execution layer. we hand it context, it drafts.

import fs from "node:fs";
import chalk from "chalk";
import { config } from "../lib/config.js";

const LANES = ["daily-3", "deep-dive", "recap"];

function readProfile() {
  try {
    return JSON.parse(fs.readFileSync(config.voiceProfile, "utf8"));
  } catch {
    return null;
  }
}

// pulls the "## <lane>" section body out of lane-briefs.md by walking lines to the next heading.
function readBrief(lane) {
  let md = "";
  try {
    md = fs.readFileSync(`${config.contextDir}/lane-briefs.md`, "utf8");
  } catch {
    return null;
  }
  const lines = md.split("\n");
  const start = lines.findIndex((l) => new RegExp(`^##\\s+${lane}\\s*$`, "i").test(l));
  if (start === -1) return null;
  const body = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s/.test(lines[i])) break;
    body.push(lines[i]);
  }
  return body.join("\n").trim();
}

function readFacts() {
  try {
    return fs.readFileSync(`${config.contextDir}/facts.md`, "utf8").trim();
  } catch {
    return null;
  }
}

function voiceBlock(p) {
  if (!p) return "voice profile not found";
  const lines = [
    "voice profile, enforce strictly:",
    `- casing: ${p.casing}`,
    `- forbidden: ${(p.forbidden || []).join(", ")}`,
    "- no bullets, no numbered lists, no emojis",
    "- open with zm on its own line, short punchy fragments",
    `- permitted words: ${(p.acceptedWords || []).join(" ")}`,
    `- rejected words: ${(p.rejectedWords || []).join(" ")}`,
    "- never a bare url, render every link as a rich card or styled cta",
    `- close with the signature line exactly: ${p.signature}`,
  ];
  return lines.join("\n");
}

export function context(lane) {
  if (!lane || !LANES.includes(lane)) {
    console.log(chalk.yellow(`\n  usage: zao context <${LANES.join(" | ")}>\n`));
    return { ok: false };
  }

  const profile = readProfile();
  const brief = readBrief(lane);
  const facts = readFacts();

  const pack = [
    `draft a ${lane} lane post for the zao newsletter.`,
    "",
    "lane brief:",
    brief || "(no brief on file)",
    "",
    "current facts, use these, do not invent:",
    facts || "(no facts on file)",
    "",
    voiceBlock(profile),
    "",
    "also stage a native x thread and a linkedin version in the same voice.",
    "do not publish. leave it in the review queue for approval.",
  ].join("\n");

  // the pack prints between fences so it is a clean copy target for the paragraph panel.
  console.log(chalk.dim("\n--- context pack: paste to paragraph ---\n"));
  console.log(pack);
  console.log(chalk.dim("\n--- end pack ---\n"));
  return { ok: true, lane, pack };
}

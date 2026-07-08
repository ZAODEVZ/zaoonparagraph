// draft loader. finds a draft in drafts/ by id and reads its lane + stage headers. read-only.
// a draft is plain markdown with optional header lines:  lane: deep-dive   stage: approved

import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";

export function findDraft(id) {
  let files = [];
  try {
    files = fs.readdirSync(config.draftsDir).filter((f) => f.endsWith(".md"));
  } catch {
    files = [];
  }
  const hit =
    files.find((f) => f === `${id}.md`) ||
    files.find((f) => f.startsWith(`${id}-`)) ||
    files.find((f) => f.replace(/\.md$/, "") === id);
  if (!hit) return null;

  const full = path.join(config.draftsDir, hit);
  const text = fs.readFileSync(full, "utf8");
  const lane = (text.match(/^\s*lane:\s*(daily-3|deep-dive|recap)\s*$/im) || [])[1] || null;
  const stage = (text.match(/^\s*stage:\s*(draft|review|approved|locked|published)\s*$/im) || [])[1] || "draft";
  return { id, file: hit, path: path.relative(config.repoRoot, full), lane, stage, text };
}

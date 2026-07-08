// draft scanner. reads the three content lanes to list drafts and infer stage.
// strictly read-only. this file never writes into content/ or socials/.

import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";
import { checkVoice } from "./voice.js";

// infer stage from a lightweight front-matter-ish header, else default to draft.
// looks for a line like: "stage: approved" near the top. keeps drafts as plain markdown.
function inferStage(text) {
  const m = text.match(/^\s*stage:\s*(draft|review|approved|locked|published)\s*$/im);
  return m ? m[1].toLowerCase() : "draft";
}

export function listDrafts() {
  const out = [];
  for (const lane of config.lanes) {
    const dir = path.join(config.contentDir, lane);
    let files = [];
    try {
      files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md");
    } catch {
      files = [];
    }
    for (const file of files) {
      const full = path.join(dir, file);
      let text = "";
      try {
        text = fs.readFileSync(full, "utf8");
      } catch {
        text = "";
      }
      const voice = checkVoice(text);
      out.push({
        lane,
        file,
        path: path.relative(config.repoRoot, full),
        stage: inferStage(text),
        onVoice: voice.onVoice,
        voiceIssues: voice.issues,
      });
    }
  }
  return out;
}

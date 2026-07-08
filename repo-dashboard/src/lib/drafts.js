// draft scanner for the ui. reads the flat drafts/ folder, infers lane + stage from headers.
// strictly read-only. this never writes into drafts/, published/, or templates/.

import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";
import { checkVoice } from "./voice.js";

function header(text, key, values) {
  const rx = new RegExp(`^\\s*${key}:\\s*(${values})\\s*$`, "im");
  return (text.match(rx) || [])[1] || null;
}

export function listDrafts() {
  let files = [];
  try {
    files = fs.readdirSync(config.draftsDir).filter((f) => f.endsWith(".md"));
  } catch {
    files = [];
  }
  return files.map((file) => {
    const full = path.join(config.draftsDir, file);
    let text = "";
    try {
      text = fs.readFileSync(full, "utf8");
    } catch {
      text = "";
    }
    const voice = checkVoice(text);
    return {
      file,
      id: file.replace(/\.md$/, ""),
      lane: header(text, "lane", "daily-3|deep-dive|recap") || "unassigned",
      stage: header(text, "stage", "draft|review|approved|locked|published") || "draft",
      onVoice: voice.onVoice,
      voiceIssues: voice.issues,
    };
  });
}

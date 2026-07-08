// local state the sidecar owns. lives under repo-dashboard/.zao and never reaches into content/ or docs.
// used to cache the last known archive progress, review queue, and the dispatch log.

import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";

function ensureDir() {
  fs.mkdirSync(config.stateDir, { recursive: true });
}

export function readState(name, fallback) {
  try {
    const file = path.join(config.stateDir, `${name}.json`);
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

export function writeState(name, value) {
  ensureDir();
  const file = path.join(config.stateDir, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
  return file;
}

// append-only dispatch log. every social push lands a line here so the ui can show the trail.
export function appendDispatchLog(entry) {
  ensureDir();
  const file = path.join(config.stateDir, "dispatch-log.jsonl");
  fs.appendFileSync(file, JSON.stringify(entry) + "\n");
  return file;
}

export function readDispatchLog() {
  try {
    const file = path.join(config.stateDir, "dispatch-log.jsonl");
    return fs
      .readFileSync(file, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}

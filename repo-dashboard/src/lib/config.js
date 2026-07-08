// config for the zao sidecar. reads env, resolves repo paths, holds peak times.
// prose here stays lowercase on-voice. uppercase lives only in /voice/profile.json and sign-offs.

import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

// repo-dashboard/ root, and the parent repo root that holds content/ and research/.
export const dashboardRoot = path.resolve(here, "..", "..");
export const repoRoot = path.resolve(dashboardRoot, "..");

// paragraph api. auth via app.paragraph.com token, kept in env, never committed.
export const config = {
  apiBase: process.env.PARAGRAPH_API_BASE || "https://app.paragraph.com",
  token: process.env.PARAGRAPH_TOKEN || "",
  // the collection ids the dashboard watches for stats. comma separated in env.
  collections: (process.env.ZAO_COLLECTIONS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  // where the archive index writes. relative to the parent repo.
  archiveDir: path.resolve(repoRoot, "research", "voice-index"),
  // the three draft lanes.
  lanes: ["daily-3", "deep-dive", "recap"],
  contentDir: path.resolve(repoRoot, "content"),
  socialsDir: path.resolve(repoRoot, "socials"),
  // local state the sidecar owns. safe to write here, never touches content/ or docs.
  stateDir: path.resolve(dashboardRoot, ".zao"),
  // peak dispatch windows. wed 10am, fri 2pm, sun 6pm, local time.
  peakTimes: [
    { day: 3, hour: 10, minute: 0, label: "wed 10am" },
    { day: 5, hour: 14, minute: 0, label: "fri 2pm" },
    { day: 0, hour: 18, minute: 0, label: "sun 6pm" },
  ],
  uiPort: Number(process.env.ZAO_UI_PORT || 4317),
};

// true when we have a token to talk to paragraph. commands degrade gracefully without it.
export function hasToken() {
  return Boolean(config.token);
}

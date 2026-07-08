// voice gate. keeps all prose strict lowercase and on-voice.
// rules: strict_lowercase, no bullets, no numbered lists, no emojis, no em dashes.
// single signature line: "- BetterCallZaal on behalf of the ZABAL Team".
// the only allowed uppercase is the signature tokens. this helper flags, it does not rewrite.

import { config } from "./config.js";

const ALLOWED_UPPER = ["BetterCallZaal", "ZABAL Team", "ZABAL"];
const BANNED = [
  { rx: /[—]/, why: "em dash" },
  { rx: /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u, why: "emoji" },
  { rx: /^\s*[*+]\s+/m, why: "bullet point" },
  { rx: /^\s*\d+\.\s+/m, why: "numbered list" },
];

// strip the signature line, then any dash-led line left over is a stray bullet.
function bulletMiss(text) {
  const withoutSig = text.split(config.signature).join("");
  return /^\s*-\s+/m.test(withoutSig);
}

// strip allowed uppercase tokens, then any remaining capital is a strict-lowercase miss.
function strayCaps(text) {
  let scrubbed = text;
  for (const token of ALLOWED_UPPER) scrubbed = scrubbed.split(token).join("");
  return scrubbed.split("\n").filter((l) => /[A-Z]/.test(l)).length;
}

// returns { onVoice, issues[] }. drives the "voice: pass/flag" chip in review and the ui.
export function checkVoice(text) {
  const issues = [];
  if (!text.includes(config.signature)) issues.push(`missing the signature line "${config.signature}"`);
  for (const b of BANNED) if (b.rx.test(text)) issues.push(`contains a ${b.why}`);
  if (bulletMiss(text)) issues.push("contains a bullet point");
  const caps = strayCaps(text);
  if (caps) issues.push(`stray uppercase on ${caps} line(s)`);
  return { onVoice: issues.length === 0, issues };
}

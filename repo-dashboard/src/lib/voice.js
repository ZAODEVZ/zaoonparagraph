// voice gate. enforces the zao voice profile before any gate proceeds.
// casing: strict lowercase. forbidden: ! , bullets emojis em/en dashes. rejected words list.
// allowed uppercase: signature tokens only. required: the signature line.
// this helper flags, it never rewrites. it is eyes-only for the harness.

import { config } from "./config.js";

const ALLOWED_UPPER = ["BetterCallZaal", "ZABAL Team", "ZABAL"];
const REJECTED_WORDS = ["delighted", "furthermore", "excited", "testament", "thrilled"];

const BANNED = [
  { rx: /!/, why: "exclamation mark" },
  { rx: /,/, why: "comma" },
  { rx: /[—–]/, why: "em or en dash" },
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

// whole-word match on the rejected list, case-insensitive.
function rejectedHits(text) {
  return REJECTED_WORDS.filter((w) => new RegExp(`\\b${w}\\b`, "i").test(text));
}

// returns { onVoice, issues[] }. drives the voice check every gate runs before proceeding.
export function checkVoice(text) {
  const issues = [];
  if (!text.includes(config.signature)) issues.push(`missing the signature line "${config.signature}"`);
  for (const b of BANNED) if (b.rx.test(text)) issues.push(`contains a ${b.why}`);
  if (bulletMiss(text)) issues.push("contains a bullet point");
  const caps = strayCaps(text);
  if (caps) issues.push(`stray uppercase on ${caps} line(s)`);
  const rejected = rejectedHits(text);
  if (rejected.length) issues.push(`uses rejected word(s): ${rejected.join(", ")}`);
  return { onVoice: issues.length === 0, issues };
}

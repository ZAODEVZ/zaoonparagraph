// voice gate. keeps all prose in content/ and socials/ lowercase and on-voice.
// the only allowed uppercase is the sign-offs "BUILD ON" and "ZABAL Team", and anything inside /voice/profile.json.
// this is a lint helper the review gate leans on. it flags, it does not rewrite.

const ALLOWED_UPPER = ["BUILD ON", "ZABAL Team", "ZABAL"];
const BANNED = [
  { rx: /[—]/, why: "em dash" },
  { rx: /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u, why: "emoji" },
  { rx: /^\s*[-*+]\s+/m, why: "bullet point" },
  { rx: /^\s*\d+\.\s+/m, why: "numbered list" },
];

// strip the allowed uppercase tokens, then anything still holding a capital letter is a voice miss.
function findStrayCaps(text) {
  let scrubbed = text;
  for (const token of ALLOWED_UPPER) scrubbed = scrubbed.split(token).join("");
  const misses = [];
  const lines = scrubbed.split("\n");
  lines.forEach((line, i) => {
    if (/[A-Z]/.test(line)) misses.push({ line: i + 1, text: lines[i] });
  });
  return misses;
}

// returns { onVoice, issues[] }. drives the "voice: pass/flag" chip in draft-queue and review-gate.
export function checkVoice(text) {
  const issues = [];
  if (!/^\s*zm\b/i.test(text)) issues.push("missing the zm greeting");
  const hasSignoff = /BUILD ON|let's build/.test(text) && /ZABAL Team/.test(text);
  if (!hasSignoff) issues.push("missing the sign-off (BUILD ON or let's build, then ZABAL Team)");
  for (const b of BANNED) if (b.rx.test(text)) issues.push(`contains a ${b.why}`);
  const caps = findStrayCaps(text);
  if (caps.length) issues.push(`stray uppercase on ${caps.length} line(s)`);
  return { onVoice: issues.length === 0, issues };
}

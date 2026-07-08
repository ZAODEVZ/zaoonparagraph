// lane schedule. maps each lane to its peak dispatch slot and channels, all EST.
// wed 10am -> daily-3 (email + linkedin)
// fri 2pm  -> deep-dive (social + email)
// sun 6pm  -> recap (email + linkedin + social)
// note: EST is treated as a fixed -5 offset for this scaffold. swap for a tz lib if dst precision is needed.

const EST_OFFSET_MS = -5 * 60 * 60 * 1000;

export const lanes = {
  "daily-3": { day: 3, hour: 10, minute: 0, label: "wed 10am est", channels: ["email", "linkedin"] },
  "deep-dive": { day: 5, hour: 14, minute: 0, label: "fri 2pm est", channels: ["social", "email"] },
  recap: { day: 0, hour: 18, minute: 0, label: "sun 6pm est", channels: ["email", "linkedin", "social"] },
};

// resolves the soonest occurrence of a lane's slot strictly after `from`, returned as iso + label + channels.
export function nextSlotFor(lane, from = new Date()) {
  const s = lanes[lane];
  if (!s) return null;
  // an est wall-clock view: a date whose getUTC* fields read as est local time.
  const wall = new Date(from.getTime() + EST_OFFSET_MS);
  const cand = new Date(wall);
  const dayDelta = (s.day - wall.getUTCDay() + 7) % 7;
  cand.setUTCDate(wall.getUTCDate() + dayDelta);
  cand.setUTCHours(s.hour, s.minute, 0, 0);
  if (cand <= wall) cand.setUTCDate(cand.getUTCDate() + 7);
  // shift the chosen est wall-clock back to a true utc instant.
  const utc = new Date(cand.getTime() - EST_OFFSET_MS);
  return { lane, label: s.label, channels: s.channels, iso: utc.toISOString() };
}

// all three lane slots sorted, for the start summary and the ui strip.
export function allSlots(from = new Date()) {
  return Object.keys(lanes)
    .map((lane) => nextSlotFor(lane, from))
    .sort((a, b) => new Date(a.iso) - new Date(b.iso));
}

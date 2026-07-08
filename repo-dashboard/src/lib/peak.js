// peak time math. resolves the next dispatch slot from the configured windows.
// wed 10am, fri 2pm, sun 6pm, local time.

import { config } from "./config.js";

// returns the soonest peak slot strictly after `from`, with its label and iso time.
export function nextPeakSlot(from = new Date()) {
  let best = null;
  for (const slot of config.peakTimes) {
    const candidate = new Date(from);
    const dayDelta = (slot.day - from.getDay() + 7) % 7;
    candidate.setDate(from.getDate() + dayDelta);
    candidate.setHours(slot.hour, slot.minute, 0, 0);
    // if that lands in the past this week, roll it a week forward.
    if (candidate <= from) candidate.setDate(candidate.getDate() + 7);
    if (!best || candidate < best.at) best = { at: candidate, label: slot.label };
  }
  return { label: best.label, iso: best.at.toISOString() };
}

// list all upcoming slots inside the next 7 days, sorted, for the ui strip.
export function upcomingSlots(from = new Date()) {
  return config.peakTimes
    .map((slot) => {
      const candidate = new Date(from);
      const dayDelta = (slot.day - from.getDay() + 7) % 7;
      candidate.setDate(from.getDate() + dayDelta);
      candidate.setHours(slot.hour, slot.minute, 0, 0);
      if (candidate <= from) candidate.setDate(candidate.getDate() + 7);
      return { label: slot.label, iso: candidate.toISOString() };
    })
    .sort((a, b) => new Date(a.iso) - new Date(b.iso));
}

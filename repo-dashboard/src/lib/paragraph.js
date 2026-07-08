// paragraph api client. thin wrapper over axios with the token baked into the auth header.
// endpoints: collection stats, post review, archive queue, social dispatch.
// every call degrades soft when there is no token or the network is cold, so the cli never hard crashes.

import axios from "axios";
import { config, hasToken } from "./config.js";

function client() {
  return axios.create({
    baseURL: config.apiBase,
    timeout: 15000,
    headers: hasToken()
      ? { authorization: `Bearer ${config.token}`, accept: "application/json" }
      : { accept: "application/json" },
  });
}

// wraps a call so a missing token or a dead network returns a soft result instead of throwing.
async function soft(label, fn) {
  if (!hasToken()) {
    return { ok: false, offline: true, reason: "no paragraph token in env", data: null };
  }
  try {
    const res = await fn(client());
    return { ok: true, offline: false, data: res.data };
  } catch (err) {
    const status = err?.response?.status;
    const reason = status ? `paragraph ${label} returned ${status}` : `paragraph ${label} unreachable`;
    return { ok: false, offline: false, reason, data: null };
  }
}

// GET /api/v2/collections/:id/stats -> views, clicks, subs per collection.
export function getCollectionStats(collectionId) {
  return soft("stats", (c) => c.get(`/api/v2/collections/${encodeURIComponent(collectionId)}/stats`));
}

// GET /api/v1/posts/:id/review -> pending | approved | locked | published.
export function getReviewStatus(postId) {
  return soft("review", (c) => c.get(`/api/v1/posts/${encodeURIComponent(postId)}/review`));
}

// POST /api/v1/posts/:id/review -> move a draft through the gate. action: approve | edit | lock | publish.
export function postReviewAction(postId, action, note) {
  return soft("review-action", (c) =>
    c.post(`/api/v1/posts/${encodeURIComponent(postId)}/review`, { action, note: note || "" })
  );
}

// GET /api/v2/archive/status -> the voice-clean-import queue for the 400+ issue crawl.
export function getArchiveStatus() {
  return soft("archive", (c) => c.get(`/api/v2/archive/status`));
}

// POST /api/v2/archive/upload -> bulk push the remaining local files into the index queue.
export function postArchiveUpload(files) {
  return soft("archive-upload", (c) => c.post(`/api/v2/archive/upload`, { files }));
}

// POST /api/v2/social/dispatch -> queue an approved x thread + linkedin post to a peak slot.
export function postDispatch(payload) {
  return soft("dispatch", (c) => c.post(`/api/v2/social/dispatch`, payload));
}

// POST /api/v2/webhooks -> register a callback so state changes stream back to the sidecar.
export function registerWebhook(url, events) {
  return soft("webhook", (c) => c.post(`/api/v2/webhooks`, { url, events }));
}

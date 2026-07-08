// zao ui
// zero-dependency local http server serving the box-card dashboard.
// watches archive status, the draft queue, per-collection stats, and the dispatch log.
// a /state json endpoint feeds the page; the html is a single self-contained file.

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "../lib/config.js";
import { listDrafts } from "../lib/drafts.js";
import { readState, readDispatchLog } from "../lib/state.js";
import { allSlots } from "../lib/schedule.js";

const here = path.dirname(fileURLToPath(import.meta.url));

// assembles everything the box cards render from cached state + a live draft scan.
function snapshot() {
  return {
    archive: readState("archive", { indexed: 0, target: 400, status: "unknown", pct: 0 }),
    drafts: listDrafts(),
    stats: readState("stats", []),
    dispatch: readDispatchLog().slice(-20).reverse(),
    peaks: allSlots(),
    lanes: config.lanes,
  };
}

export function serveUi({ port = config.uiPort } = {}) {
  const server = http.createServer((req, res) => {
    if (req.url === "/state") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(snapshot(), null, 2));
      return;
    }
    if (req.url === "/hook" && req.method === "POST") {
      // paragraph state-change webhook lands here. we just ack; the ui re-polls /state.
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
      return;
    }
    // everything else serves the dashboard page.
    const file = path.join(here, "public", "index.html");
    try {
      const html = fs.readFileSync(file, "utf8");
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(html);
    } catch {
      res.writeHead(500);
      res.end("dashboard html missing");
    }
  });

  server.listen(port, () => {
    console.log(`\n  zao ui on http://localhost:${port}   (box cards for each lane, refreshes every 5s)\n`);
  });
  return server;
}

#!/usr/bin/env node
// zao — cli entrypoint for the onparagraph sidecar.
// subcommands: start, archive, draft, review, dispatch, stats, ui.
// cli-first, terminal native, fast. the ui is optional and lives behind `zao ui`.

import { Command } from "commander";
import { start } from "./src/commands/start.js";
import { archiveStatus } from "./src/commands/arch-status.js";
import { draftList } from "./src/commands/draft-queue.js";
import { reviewGate } from "./src/commands/review-gate.js";
import { dispatch } from "./src/commands/dispatch.js";
import { stats } from "./src/commands/stats.js";
import { serveUi } from "./src/ui/server.js";

const program = new Command();

program
  .name("zao")
  .description("zao onparagraph — cli dashboard sidecar for the paragraph flow")
  .version("0.1.0");

program
  .command("start")
  .description("seed the archive poll, show the queue, register the state webhook")
  .option("--webhook <url>", "callback url for paragraph state changes")
  .action((opts) => start(opts));

const archive = program
  .command("archive")
  .description("archive index livestats for research/voice-index")
  .option("--bulk", "push the remaining local files into the import queue")
  .action((opts) => archiveStatus(opts));
archive
  .command("status")
  .description("same as `zao archive`")
  .option("--bulk", "push the remaining local files into the import queue")
  .action((opts) => archiveStatus(opts));

const draft = program
  .command("draft")
  .description("list drafts across /daily-3 /deep-dive /recap with stage and voice")
  .action(() => draftList());
draft
  .command("list")
  .description("same as `zao draft`")
  .action(() => draftList());

program
  .command("review")
  .argument("[post-id]", "paragraph post id to review")
  .option("--action <action>", "drive the toolbar: approve | edit | lock | publish")
  .description("launch the paragraph review panel and drive approve/lock/publish")
  .action((postId, opts) => reviewGate(postId, opts));

program
  .command("dispatch")
  .argument("[post-id]", "approved post id to queue")
  .option("--slot <slot>", "target peak slot: wed | fri | sun")
  .option("--force", "skip the approval guard (not recommended)")
  .description("queue the approved x thread + linkedin post to the next peak slot")
  .action((postId, opts) => dispatch(postId, opts));

program
  .command("stats")
  .option("--collection <id>", "a single collection id, else uses ZAO_COLLECTIONS")
  .description("per-collection views, rich embed click rate, subs gained")
  .action((opts) => stats(opts));

program
  .command("ui")
  .option("--port <port>", "port for the local dashboard")
  .description("serve the lightweight box-card dashboard")
  .action((opts) => serveUi({ port: opts.port ? Number(opts.port) : undefined }));

program.parseAsync(process.argv);

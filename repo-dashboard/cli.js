#!/usr/bin/env node
// zao — cli entrypoint for the onparagraph sidecar.
// core verbs: archive, review, lock, dispatch. all wired to the paragraph ai review gate.
// review -> lock -> dispatch is the gate order. nothing dispatches without an approve then a lock.

import { Command } from "commander";
import { archive } from "./src/commands/archive.js";
import { review } from "./src/commands/review.js";
import { lock } from "./src/commands/lock.js";
import { dispatch } from "./src/commands/dispatch.js";
import { serveUi } from "./src/ui/server.js";

const program = new Command();

program
  .name("zao")
  .description("zao onparagraph — orchestrator cli for the paragraph flow")
  .version("0.2.0");

program
  .command("archive")
  .argument("[id]", "issue id, else lists the whole 400+ index")
  .description("list the 400+ issue index, or one issue by id")
  .action((id) => archive(id));

program
  .command("review")
  .argument("[id]", "draft id to review")
  .option("--approve", "send the approve action after the voice gate passes")
  .description("prompt for approval before publication")
  .action((id, opts) => review(id, opts));

program
  .command("lock")
  .argument("[id]", "approved draft id to freeze")
  .option("--force", "freeze without the approved-stage guard")
  .description("freeze an approved draft for its peak dispatch slot")
  .action((id, opts) => lock(id, opts));

program
  .command("dispatch")
  .argument("[id]", "locked draft id to send")
  .option("--force", "dispatch without the locked-stage guard")
  .description("send a locked draft to its lane's email + social channels")
  .action((id, opts) => dispatch(id, opts));

program
  .command("ui")
  .option("--port <port>", "port for the local dashboard")
  .description("serve the lightweight box-card dashboard")
  .action((opts) => serveUi({ port: opts.port ? Number(opts.port) : undefined }));

program.parseAsync(process.argv);

# CLAUDE.md

guidance for working in this repo. this is the zao newsletter scaffolding on paragraph.

## voice rules — apply to all newsletter content, social cards, and editions

when drafting or editing any newsletter content, social card, or edition in `content/` or `socials/`, follow these rules strictly. they do not apply to code or to structural/meta docs like this one.

- all prose lowercase only. no caps for names, no uppercase in the body.
- no bullet points, no numbered lists, no emojis, no em dashes.
- open every post with the greeting "zm".
- sign off with "BUILD ON" or "let's build" then credit the ZABAL Team. these two are the only allowed uppercase.
- keep sentences punchy and high-velocity.
- prioritize raw authentic voice over polished prose.

full detail in `VOICE.md`.

## structure

- `content/daily-3` — high-frequency low-friction updates.
- `content/deep-dive` — polished long-form analysis.
- `content/recap` — weekly and monthly synthesis.
- `research/voice-index` — the 400+ edition voice-index the drafts reference.
- `socials/` — social cards, dispatched per peak times after approval.
- `commands/` — the working commands.

## workflow

paragraph ai drafts, review panel approves, publish, socials. detail in `WORKFLOW.md`.

## commands

- `paragraph-ai-draft` — generate from a prompt or outline.
- `paragraph-review` — queue for the approval pipeline.
- `paragraph-migrate` — import the 400+ legacy issues from substack, ghost, mirror.
- `voice-guide` — extract formatting rules from the 400+ historical posts.

each is documented under `commands/`.

# Archive Indexing Protocol

Paragraph AI onboarding step:

1. run: "start the archive index"
   - routes from zaoonparagraph to paragraphs voice-clean-import
   - crawls 400+ historical issues
   - writes to research/voice-index/

2. index completion signal: witness "global audit complete" status

3. voice guide: "run voice-guide"
   - extracts microscopic style signals
   - creates /voice/profile.json

4. draft lanes open: /daily-3, /deep-dive, /recap

# Drafting Prompts by Lane

/daily-3 (rapid, hourly up to 5x):
- "daily-3: what rose this hour?"
- "daily-3: what crashed/failed this hour?"
- "daily-3: best fragment from our archive this week"

/deep-dive:
- "deep-dive: write from /voice/profile.json shape"
- "deep-dive: pull fragments from last 10 editions, contrast with current arc"

/recap:
- "recap: summarize last 3 submissions + builds + zabalgamez.com/game/build-quiz stats"

# Social Dispatch Spec

paragraph auto-discharges native X thread and LinkedIn after approval.
- card embeds only: use "editor-cardify link" for any URL
- peak times: Wed 10am, Fri 2pm, Sun 6pm
- inspect in socials/ folder before approve

# Clipboard Handoff

per edition: email draft sends raw text to clipboard, paragraphs socials click only in socials/ directory, attachments in /assets/.

# Review Gate

all drafts → review panel → approve (or edit) → lock → publish → socials.

never bypass manual review in draft stage.

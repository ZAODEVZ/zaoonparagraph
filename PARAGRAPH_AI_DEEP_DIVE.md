# Paragraph AI - Deep Dive + New Features (2026-07-08)

> The loop-learning pass on Paragraph's AI agent and platform, current as of mid-2026.
> Companion to `PARAGRAPH_RESEARCH.md` (platform history/features). This doc covers the
> AI + automation layer we actually live in - and the single biggest unlock: Paragraph
> now ships an **MCP server + REST API**, so we can drive it from Claude Code / this repo
> instead of only the in-app chat. That routes around the flaky in-app memory.

## TL;DR - the three things that change how we work

1. **There is a hosted MCP server.** `https://mcp.paragraph.com/mcp`. One line wires Claude Code to Paragraph: create/update/delete posts, manage subscribers, search, read feed - 18 tools. This is the durable path. FULL-verified.
2. **There is a REST API + TypeScript SDK** (shipped Dec 2025). API key from `paragraph.com/settings -> Publication -> Developer`. So drafts/publishing can be scripted from the repo, versioned in git - the ledger becomes the source of truth, not the in-app agent's memory. FULL.
3. **The in-app agent memory is the weak point** (the "could not save brand voice guide" failure). No documented persistent-memory feature. The fix is not to trust it - hold voice/facts in this repo + push via MCP/API. Our current repo-as-ledger discipline is correct; now we can also *drive* Paragraph from that ledger.

## 1. What the AI agent can do (FULL)

Every publication gets a custom AI agent ("Meet your agent", July 2026 relaunch). End-to-end it does:
- Research + idea development (full internet access; "install any tool, run real code")
- Drafting (titles, outlines, complete drafts) + editing/optimization
- Social distribution - posts to X and LinkedIn
- SEO audit + optimization
- Website design + coding (builds custom sites)
- Cover-art generation (brand-matched)
- Recurring publishing workflows
- Subscriber follow-ups (drafts follow-up emails off high-performing sections)

Model: last publicly confirmed as GPT-4 (2024); the current model is **unverified** - Paragraph does not publish it.

## 2. Task / suggestion system (PARTIAL)

The approve -> lock -> publish/post flow and "suggestion ids" we see in the UI are **not publicly documented**. Confirmed from our own usage (day-189 run):
- Agent output lands as a **suggestion / task** in a "needs review" state.
- Operator flow: **approve -> lock -> publish (email) / post (socials)**. Never let it fire straight from a draft.
- Recurring/scheduled agent tasks: **unverified** in docs (we should test).
- Treat the suggestion id as the handle for a given draft; log it in the ledger per edition.

## 3. Memory - the known weak point (FAILED to find a real feature)

- No documented persistent/working-memory feature for the agent.
- Observed failure: "could not save brand voice guide" - the agent cannot reliably persist a voice/brand guide to its own memory.
- **Workaround (ours, working):** hold the voice + facts + chat register in THIS repo (`VOICE.md`, `context/`, ledger files). Re-inject per draft. With the MCP/API we can also push the canonical draft up rather than re-prompting the agent to remember.
- Roadmap: unverified.

## 4. Social dispatch - X + LinkedIn (FULL feature, PARTIAL mechanics)

- Agent can post directly to **X** and **LinkedIn**.
- Authorization specifics (OAuth scopes, revoke) not documented; standard OAuth pattern assumed.
- Gating/limits: unverified. Our rule stands regardless: **approve -> lock -> post**, hold the email for explicit go.

## 5. API / automation / MCP - the unlock (FULL)

### MCP server (the fastest path for us)
- Hosted endpoint: `https://mcp.paragraph.com/mcp` (no install; browser auth).
- Wire Claude Code:
  ```
  claude mcp add paragraph --transport http https://mcp.paragraph.com/mcp
  ```
- Local option (Node 18+): `npx @paragraph-com/mcp`, with `claude mcp add --env PARAGRAPH_API_KEY=your-key paragraph -- npx @paragraph-com/mcp`
- **18 tools across 8 toolsets:** Posts (create/update/delete/test-email - write, auth), Publications (info - none), Subscribers (list/add/count - auth), Users (none), Coins (info/holders - none), Search (posts/blogs/coins - none), Feed (none), Me (auth).
- Trim context: `npx @paragraph-com/mcp --toolsets posts,search`.
- Read-only (search, feed) needs no auth; writes need the API key.

### REST API + TypeScript SDK (Dec 2025)
- SDK: `github.com/paragraph-xyz/paragraph-sdk-js`. OpenAPI spec: `paragraph.com/docs/paragraph-api/openapi.json`.
- API key: `paragraph.com/settings/publication/#developer`.
- Read: publications, posts (pagination/filter/full content), coins, user profiles (wallets + Farcaster).
- Write: create drafts, auto-publish posts, add subscribers, execute coin market flows.
- Reference impl: `github.com/paragraph-xyz/markets` (open source). CLI also exists (`paragraph.com/docs/development/cli`).
- Docs on driving it with LLMs: `paragraph.com/docs/development/developing-with-ai-llm.md`.
- Not found: Zapier, webhooks (unverified - may not exist).

## 6. New features 2025-2026 (FULL, from the blog)

| Date | Feature |
|------|---------|
| Jul 2026 | AI agent relaunch - "Meet your agent" (edit, social, SEO, site-build per publication) |
| Apr 2026 | AI-native platform + agent commerce ("sell anything digital to humans and agents") |
| Dec 2025 | REST API + TypeScript SDK; discovery/search + XMTP revamp + home feed |
| Nov 2025 | Writer Coins (readers back writers, share upside) |
| Sep 2025 | Mirror fully merged into Paragraph |
| Aug 2025 | Remixing (derivative works/discussion chains); multi-publication support |
| ongoing | Farcaster mini-app + Base as settlement layer for coins |

## 7. Monetization + limits (PARTIAL)

- Free plan to start; Paragraph takes 5% on primary sales (collectibles).
- Creator revenue: Writer Coins + token/NFT memberships + subscriptions.
- AI-agent pricing tier, usage caps, API rate limits: **unverified** - confirm from the account.

## What we do with this (next actions)

| Action | Owner | Type | By When |
|--------|-------|------|---------|
| Wire the Paragraph MCP into Claude Code (`claude mcp add paragraph ...`) + grab the API key | @Zaal | Config | 2026-07-09 |
| Test: can we create/update a draft on @thezao via MCP from this repo? (day-190 as the test) | @Zaal | Test | 2026-07-10 |
| Move voice+facts to a single canonical `context/` pack the MCP push reads (kill reliance on in-app memory) | @Zaal | Repo | 2026-07-11 |
| Confirm from the account: current model, AI usage limits, whether scheduled agent tasks exist | @Zaal | Verify | 2026-07-11 |
| Decide: agent-drafts-in-app vs repo-drafts-pushed-via-API as the canonical pipeline | @Zaal | Decision | 2026-07-14 |

## Confidence / gaps (do not fill with guesses)

- **Verified FULL:** MCP server + endpoint + tools, API/SDK existence + auth location, 2025-26 feature timeline, agent capability list, X/LinkedIn posting.
- **PARTIAL:** task/suggestion internals, social-auth mechanics, monetization tiers.
- **UNVERIFIED:** current LLM model, AI usage/rate limits, scheduled-task support, webhooks/Zapier, exact SDK npm name. Fill these from the live account, not assumption.

## Sources

- [FULL] Paragraph MCP docs - https://paragraph.com/docs/development/mcp.md (endpoint, 18 tools, auth)
- [FULL] Paragraph API/SDK overview - https://paragraph.com/docs/development/api-sdk-overview.md
- [FULL] Paragraph docs index (llms.txt) - https://paragraph.com/docs/llms.txt (MCP/CLI/API/SDK pages)
- [FULL] Paragraph API & SDK announcement - https://paragraph.com/@blog/paragraph-api-and-sdk
- [FULL] Paragraph blog - https://paragraph.com/@blog (2025-26 feature timeline)
- [FULL] github.com/paragraph-xyz/markets (reference impl), github.com/paragraph-xyz/paragraph-sdk-js
- [FULL] testingcatalog.com - Paragraph GPT-4 assistant (2024 model confirmation)


---

# ADDENDUM - verified from the live @thezao account (2026-07-08)

Screenshots of Settings resolved most of the UNVERIFIED gaps above. Corrections + new finds:

## Memory is REAL (correction to section 3)

`Settings -> Agent -> Memory`: "Your agent reads this every turn." It is a structured form, not free chat memory:
- **Goals** (list) - currently: "Analyze existing Paragraph posts and adapt writing style to max channels like social and email dist..."
- **Brand voice (long-form)** - **EMPTY right now** (gap to fill)
- **Brand voice (X/social)** - filled with the extracted guide
- **Notes** - empty
- A "Save changes" button.

The "could not save the brand voice guide" failure was the agent's `updateWorkingMemory` **tool missing in that session** (confirmed by the billing chat title) - NOT that memory doesn't exist. Fix: fill the fields **manually** in this panel. The repo ledger stays canonical; we paste from it into these fields.

## Paragraph's agent is ALSO an MCP client (new - big)

`Settings -> Agent -> Connected MCP servers`: "Add external tools your agent can use." Popular: Slack, Linear, Notion, GitHub. Plus a custom **Name + Remote MCP URL + Auth (OAuth)** row. "No MCP servers connected yet."

So MCP runs BOTH directions:
- We drive Paragraph FROM Claude Code via Paragraph's hosted MCP (`mcp.paragraph.com/mcp`).
- We wire OUR systems INTO Paragraph's agent by adding a remote MCP URL here (e.g. the cowork tracker, Bonfire, GitHub) so its agent can read ZAO context while it drafts.

## API key already provisioned (correction to section 5)

`Settings -> Workspace -> Developer`: an API key named **"AI Assistant"** (`para_rEY...`) was created **Jul 7 2026**. So API access is already live - "Create API keys to publish posts and manage subscribers programmatically."

## Permissions = the gate (resolves section 2 + 4)

`Settings -> Permissions`: "Tasks your agent can run without asking for approval." Granular per-action Allow toggles, all currently requiring approval (safe default):
- X (@bettercallzaal): post tweets, quote, retweet, like, follow users
- Paragraph: save new draft posts, update post drafts, publish posts, send test emails

This is where the approve -> auto flow is set. Recommendation: keep **publish** + **post tweets** gated (human approval); safe to auto-allow **save draft** + **update draft** + **send test email** so the agent can prep without shipping.

## Social connection (resolves section 4)

X connection = **@bettercallzaal** ("your agent can post and read on X"), team-shared. Reconnect available. Also: **Telegram** (chat with the agent from anywhere, one-time link) and **Slack** ("Add to Slack") agent connections.

## Billing / limits (resolves section 7)

Free plan (Paragraph Free), $0, resets monthly (next Aug 8 2026). **5,500 credits/month.** 419 used (8%). Credit costs are per-chat and vary a lot - the "ZAO Newsletter CLI Dashboard" chat alone burned **250**, "Brand and Social Voice Guides" 115. So heavy agent sessions are the cost driver; batch + reuse the ledger instead of re-deriving.

## Website (new)

`Settings -> Website`: currently **Classic blog**. A new Paragraph website stack exists (toggle "Use a Paragraph website", off) with a **custom site draft saved**. Public URL `paragraph.com/@thezao`. **Custom domain requires a paid plan.**

## Housekeeping gaps spotted (need Zaal's OK to change - account edits)

- **Account bio is STALE** - still the old "ZTalent Newsletter / InnoJam Spotlight / PlugIn Pulse / ZTalent Vibes" copy, not ZAO. Rewrite to the ZAO Newsletter voice.
- **Workspace summary contains an em dash** - against house style; swap for a hyphen.
- **Long-form brand voice is empty** - paste the canonical voice from `VOICE.md`.
- Team on the workspace: Zaal (Owner), CandyToyBox/samantha (Admin), ugiagbeosayeman (Custom).

## Updated confidence

Now VERIFIED (was unverified): memory feature + structure, permissions/gating model, API key live, monetization (5,500 credits/mo free), MCP-client capability, Telegram/Slack agent, website stack. Still UNVERIFIED: exact LLM model, whether agent tasks can be scheduled recurring (the Goals field implies ongoing behavior but not a cron).

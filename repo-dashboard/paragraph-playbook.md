# paragraph platform playbook

reference guide paragraph ai produced for the zao newsletter. captured as provided, unverified. treat setup paths and feature claims as leads to confirm against the live dashboard before wiring anything into the sidecar.

## capabilities, setup, when, payoff

### archive and voice
- semantic indexing ingests the legacy markdown archive, extracts word weights, punctuation habits, structural pacing, writes a stable voice profile.
- setup: settings -> import, drop the legacy export, toggle semantic archive sync, then settings -> write to copy the voice profile into generation guidelines.
- when: any time you delegate a draft or bootstrap a template.
- payoff: instant tone match on a 400+ archive, custom vocab (devz vibez zm) enforced automatically.

### drafting and editor actions
- template binding plus editor actions. highlight-batch-to-card bundles plain text into rich media blocks with headers, tags, cta triggers.
- setup: highlight a block, use the floating bar (convert to card, create button group). templates under dashboard -> templates, declare route (/daily-3), save.
- when: every daily-3 cycle and weekly compile, to convert notes and telemetry into structure fast.
- payoff: claimed drafting time from 30 min to under 2 min per issue.

### rich embeds and links
- rich embed pulls metadata, icons, hero images from a url into an interactive card (reported: embedly powered).
- setup: paste a url on its own blank line, editor auto-converts to a preview card.
- when: every external destination, build log, leaderboard, arcade mention. never inline a bare url.
- payoff: our own data, day 184 rich cards drove 18 attributed clicks and 9 views, bare urls on days 182 and 185 drove 0.

### collectibles and memberships
- onchain collectibles (nfts) inside posts on evm l2s (base, optimism, zora, arbitrum), supply bounds, royalty splits, token gating.
- setup: post editor plus icon -> onchain collectible block, pick network, upload art, set price, add split addresses.
- when: commemorate milestone builds, reward submissions, proof of play or proof of build.
- payoff: gasless mint removes web3 friction (claim: mint inside supporting email clients, verify this).

### farcaster and onchain social
- native farcaster integration, onchain subscription widgets, wallet to email routing, embedded casts.
- setup: settings -> integrations, connect farcaster, toggle direct social subscriptions. /cast plus a cast url embeds it.
- when: every recap to surface dev conversations and high-signal casts.
- payoff: one-tap subscribe from a farcaster client, closes social to email loop.

### distribution and automated dispatch
- review pipeline between draft and publish, auto-generates social threads, schedules to peak windows.
- setup: settings -> social accounts, link x and linkedin, map distribution assets to secondary card templates, publishing options -> schedule post.
- when: any post needing coordinated email plus x plus linkedin.
- payoff: after lock and approve, deliveries and social cards fire on schedule with no manual push.

### analytics and metadata
- ties subscriber growth and performance to specific posts, layouts, referrers.
- setup: dashboard -> analytics, review attributed conversions, rich embed ctr, growth grouped by tags and sub-folders.
- when: weekly during recap prep.
- payoff: see whether farcaster casts out-convert x threads, or a collectible sparked signups.

### custom domain, seo, multi-routing
- white-label domain, global seo, site sub-directories per lane.
- setup: settings -> custom domain, set cname/a records, wait for ssl. site builder maps / plus drawers for /daily-3 /deep-dive /recap.
- when: from the start, to split the three lanes into navigable indices.
- payoff: fast unified portal, crawlable, lane-separated.

### archive migration and legacy redirects
- import plus routing that preserves inbound links across the 400+ move.
- setup: settings -> import, enable automated 301 redirects, map legacy url patterns.
- when: during initial onboarding, before mapping the primary domain.
- payoff: keeps search equity, zero broken legacy links.

## prioritized rollout

- phase 1, days 1 to 7: index the 400+ archive and extract the tone profile, adopt rich-card embed rules programmatically.
- phase 2, days 8 to 21: deploy custom domain, global seo, routing drawers, link farcaster and onchain subscription widgets.
- phase 3, days 22 plus: launch onchain collectibles with splits, run automated peak-time dispatch.
- single highest-leverage move: convert every bare url to a rich card. proven by our data to move click engagement from 0 to 18 plus.

## three-lane playbook

- daily-3: rapid dev logs under a minute. tool: markdown snippets plus template binding to /daily-3. short lowercase fragments.
- deep-dive: long-form technical essays. tool: highlight-batch-to-card for code refs and metadata. full analytical paragraphs, clean layout.
- recap: weekly synthesis of builds. tool: rich embeds for submissions, farcaster cast blocks, gasless collectibles for builders.

## glossary

- semantic indexing: ai crawl of the post history that learns and enforces brand voice.
- rich embed / link conversion card: preview block from a url on its own blank line, higher ctr.
- onchain collectible: mintable asset embedded in an issue on a low-gas l2.
- template drawer route: a site directory like /daily-3 mapped to tags and templates.
- gasless minting: gas sponsored so subscribers collect in one tap.
- metadata lock: post state that blocks automated edits after final review.

## still open (unchanged)

- lane to day mapping conflict (repo daily-3 wed vs paragraph deep-dive wed) not resolved here.
- api base conflict (app.paragraph.com /api/v2 vs api.paragraph.xyz/v1) not resolved here.

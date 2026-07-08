# paragraph session state

orchestrator log of what paragraph ai reports and what it handed back. this is a meta doc, not newsletter content. items marked (reported, unverified) are paragraph ai claims, not confirmed by this repo.

## current draft in the queue

- id: suggestion 8027
- title: year of the zabal: month 2, week 1 recap
- lane: recap
- state: voice-passed, ~1400 chars (in 1200 to 1600 target), quiz isolated for a rich card, locked-ready in the review panel (reported, unverified)
- body: july 1 to 7 recap, 3 submissions, build quiz at https://zabalgamez.com/game/build-quiz, three build card placeholders
- distribution assets staged: native x thread + linkedin post
- voice: strict lowercase, zero commas, zero exclamation, signature present

## what paragraph reports done (reported, unverified)

- archive import + semantic index across the 400+ zao/gabal issues kicked off and completed
- voice-clean-import extracted style into working memory
- folder drawers registered for template binding: daily-3, deep-dive, recap
- voice profile synchronized to database indexes

## lane prompts paragraph produced

- daily-3: open on "zm" own line, strict lowercase, strip commas and exclamations, 1 to 2 sentence fragments, max 600 chars. anchors: buzz ship first code, data days onchain, callout repo live
- deep-dive: sentence casing, inline code, no intro, straight to the friction point, 300 to 800 words. anchors: telemetry, attributed clicks, study the wins
- recap: lowercase "zm" open, level-2 headers, three build placeholders, quiz as final section, 1200 to 1600 words. anchors: month recap, builds submitted, matched framework

## api table paragraph gave (reported)

- base: https://api.paragraph.xyz/v1
- auth: Authorization: Bearer <PARAGRAPH_TOKEN>
- publicationId: DB7iU1HMVzTT9bI4ec6X
- GET  /posts?publicationId=..&status=draft        -> zao review
- GET  /posts/:id?includeContent=true              -> view
- PATCH /posts/:id  { metadata: { isLocked: true } } -> zao lock
- PATCH /posts/:id  { scheduledAt }                 -> schedule
- POST /posts/:id/publish  { sendNewsletter: true } -> publish

## review gate states paragraph defined (reported)

- draft: status draft, editable
- review: status draft, metadata.reviewPassed false
- locked: status draft, metadata.isLocked true, editor edits disabled
- scheduled: status scheduled

## voice profile (matches repo-dashboard/voice/profile.json)

- casing strict_lowercase, max_commas_per_line 0, strip_exclamations true
- signature "- BetterCallZaal on behalf of the ZABAL Team"
- permitted: zm devz cookin arcade builder vibez
- forbidden: delighted furthermore excited testament thrilled

## conflicts to reconcile before wiring (need your call)

1. lane to day mapping is inverted between your repo spec and paragraph deliverable 5.
   - your repo (src/lib/schedule.js): daily-3 wed 10am (email+linkedin), deep-dive fri 2pm (social+email), recap sun 6pm (all three)
   - paragraph deliverable 5: deep-dive wed, daily-3 fri, recap sun
2. api base differs: repo config uses https://app.paragraph.com with /api/v2 + /api/v1 paths. paragraph table uses https://api.paragraph.xyz/v1 with /posts + /posts/:id/publish.
   - repo lock/dispatch currently model a review-action + social/dispatch flow, not the PATCH isLocked + POST publish flow paragraph describes.

status: nothing rewritten in the client or schedule yet. awaiting your call on both before i align the sidecar.

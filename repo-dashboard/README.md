# zao onparagraph

zm.

this is the cli dashboard sidecar for the zao paragraph flow. it lives next to the newsletter repo, not inside it. drafting, archive indexing, review gate, and social dispatch, all terminal native, with an optional box-card ui.

it never touches your content/ or docs. it reads your lanes, talks to the paragraph api, and owns its own state under `.zao/`.

## install

    cd repo-dashboard
    npm install
    npm link      # optional, puts `zao` on your path

## auth

set your app.paragraph.com token in the env. nothing secret is committed.

    export PARAGRAPH_TOKEN=your-token
    export ZAO_COLLECTIONS=collection-id-a,collection-id-b   # for zao stats

see `.env.example`. without a token every command still runs, it just shows local-only state.

## verbs

    zao start        seeds the archive poll, shows the queue, registers the state webhook
    zao archive      400+ issue index progress, --bulk pushes the remaining files
    zao draft        lists /daily-3 /deep-dive /recap drafts with stage, review, lock, voice
    zao review <id>  launches the paragraph review panel, drives approve/edit/lock/publish
    zao dispatch <id>  queues the approved x thread + linkedin post to the next peak slot
    zao stats        per-collection views, rich embed click rate, subs gained
    zao ui           serves the lightweight box-card dashboard on localhost

## the gate

nothing skips manual review. dispatch refuses anything not approved and locked. publish refuses to jump from draft. the review panel is where a human approves, edits, locks, then publishes.

## voice

all prose in content/ and socials/ stays lowercase and on-voice. the only allowed uppercase is the sign-offs "BUILD ON" and "ZABAL Team", and anything inside voice/profile.json. the voice gate in `src/lib/voice.js` flags drift, it does not rewrite.

## layout

    cli.js                       entrypoint, all subcommands
    src/commands/                one file per verb
    src/lib/                     config, paragraph client, voice gate, drafts, peak times, state
    src/ui/                      zero-dep http server + box-card page
    voice/profile.json           the style profile voice-guide fills

BUILD ON

ZABAL Team

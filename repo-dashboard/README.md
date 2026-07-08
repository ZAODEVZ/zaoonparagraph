# zao onparagraph

zc.

orchestrator cli for the zao paragraph flow. lives next to the newsletter repo, reads your drafts, talks to the paragraph review gate, dispatches per lane schedule. terminal native, optional box-card ui.

it never writes into drafts/, published/, templates/, or research/. it owns its own state under `.zao/`.

## repo layout it expects

    drafts/       working drafts, one .md per issue, headers: lane: <lane>   stage: <stage>
    published/    locked and shipped editions
    templates/    lane templates
    research/     the 400+ issue index

## install

    cd repo-dashboard
    npm install
    export PARAGRAPH_TOKEN=your-token   # app.paragraph.com

without a token every command still runs, it just shows local-only state.

## verbs

    zao archive [id]     list the 400+ issue index, or one issue by id
    zao review [id]      prompt for approval before publication (voice gate + panel link)
    zao lock [id]        freeze an approved draft for its peak dispatch slot
    zao dispatch [id]    send a locked draft to its lane's email + social channels
    zao ui               serve the lightweight box-card dashboard

## the gate

review -> lock -> dispatch, in that order, wired to the paragraph ai review gate.

    zao review <id>            shows the draft, runs the voice gate, links the panel
    zao review <id> --approve  sends approve once voice passes
    zao lock <id>              refuses unless approved, freezes for the lane slot
    zao dispatch <id>          refuses unless locked, queues to the lane channels

nothing dispatches without an approve then a lock.

## lane schedule (est)

    wed 10am est   daily-3     email + linkedin
    fri 2pm  est   deep-dive   social + email
    sun 6pm  est   recap       email + linkedin + social

## voice

strict lowercase. no bullets, no numbered lists, no emojis, no em dashes. one signature line:

    - BetterCallZaal on behalf of the ZABAL Team

the gate in `src/lib/voice.js` flags drift, it does not rewrite. landing url: https://zabalgamez.com

## layout

    cli.js                entrypoint, the four verbs + ui
    src/commands/         archive, review, lock, dispatch
    src/lib/              config, paragraph client, voice gate, drafts, loader, schedule, state
    src/ui/               zero-dep http server + box-card page

- BetterCallZaal on behalf of the ZABAL Team

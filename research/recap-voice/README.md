# recap voice

zm.

this folder holds the voice for the long-form lanes, recap and deep-dive: the season recaps, the event write-ups, the posts an everyday reader has to be able to fall for on the first read. it was written on 3 september 2026 from six drafts of the zabal gamez season 1 recap and the notes on each one.

it does not replace `VOICE.md`. the daily-3 lane keeps its rules. this is the rulebook for the posts that are long enough to need a shape.

## what is here

- `VOICE-RECAP.md` - who reads, who talks, the hard rules, the shape that worked, how to explain a mechanic in one plain line, the human tells, and what failed so it is not repeated.
- `FACTS-zabal-gamez-season-1.md` - the verified fact bank for season 1, from the zabalgames repo results files and the day 231 and day 236 posts.
- `PROMPTS.md` - the prompts to draft, check and cut a post against this guide.

## how it is used

this folder is the source of truth. notebooklm and paragraph read copies of it.

- notebooklm: add `VOICE-RECAP.md` and the facts file as website sources from their raw github urls. notebooklm does not refresh a source on its own, so after a real change to either file, remove the source and add it again. one click each.
- paragraph: paste the drafting prompt from `PROMPTS.md` into the paragraph chat with the guide text. the dashboard's context command does not read this folder, on purpose, so nothing in the existing daily-3 pack changes.

## why a separate voice

the live newsletter already writes this way. day 236 opens with zm, uses normal capitals, commas, bullets and numbered lists, and closes with insert coin and the signature. the strict lowercase gate in `repo-dashboard/src/lib/voice.js` will flag every recap. that is expected. the gate flags, it does not rewrite, and reconciling the gate with the live posts is a separate decision for zaal.

BUILD ON

ZABAL Team

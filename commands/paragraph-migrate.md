# paragraph-migrate

zm.

import the 400+ legacy issues into paragraph.

## what it does

pulls the back catalog from substack, ghost, and mirror and imports it into paragraph. 400+ editions, subscribers, and post history where the source allows.

## sources

substack export, ghost export, mirror. note that mirror content already migrates to paragraph natively after the 2024 acquisition, so mirror issues may already be present. see `PARAGRAPH_RESEARCH.md` for the background.

## output

legacy issues land in the archive and feed the voice-index under `research/voice-index`. after migrate, run `voice-guide` to rebuild the formatting rules from the full corpus.

BUILD ON

ZABAL Team

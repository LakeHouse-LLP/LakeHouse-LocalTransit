# License notes

This template ships a **placeholder** `LICENSE` until Sen (`@zsenarchitect`) chooses an OSI license.

## Suggestion

**Apache License 2.0** — permissive, patent grant, widely understood for org-owned public code.

## Swap checklist

1. Replace `LICENSE` with the Apache-2.0 text from <https://www.apache.org/licenses/LICENSE-2.0.txt>.
2. Set `license: Apache-2.0` in `CITATION.cff`.
3. Run `npm run readme:gen` so README badges/notice match.
4. Note the change in `CHANGELOG.md` under `[Unreleased]`.

No other license machinery is hard-wired; keep the swap to those four edits.

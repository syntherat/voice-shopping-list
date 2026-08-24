# Approach

This looks like a voice AI problem, but voice is the cheap part: browsers ship the Web
Speech API, which handles speech-to-text across forty-odd languages at no cost. The real
work is turning a transcript into an unambiguous action.

So I built the parser first. `parseCommand(text, locale)` is a pure function: normalize,
classify intent, extract quantity, unit and item. Rules rather than an LLM — commands are
short and structured, so rules are deterministic, instant, offline-capable, and testable.
Every parse carries a confidence score, which is where an LLM fallback would attach if the
vocabulary outgrew the rules.

Two decisions did most of the multilingual work. Intent phrases match anywhere in the
sentence, not just as a prefix, so Hindi's verb-final order needs no special case. And
non-English lexicons inherit English as a fallback, because people code-switch constantly.

Everything downstream is ordinary React: a reducer for list state, `localStorage` for
persistence, and a purchase log that drives suggestions ranked across repurchase intervals,
substitutes, deals and seasonal produce. No backend: it adds a privacy surface and deployment
cost without enabling any required feature.

Typing feeds the identical pipeline, so the app stays usable without a microphone and
testable without one.

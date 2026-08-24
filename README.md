# Voice Shopping List

A voice-controlled shopping list. Speak naturally — "I need two bottles of milk and some
bread" — and the app works out what you meant, sorts it into categories, and suggests what
you are likely to have forgotten.

**Live app:** _add your Render URL here after the first deploy_

**Docs:** [APPROACH.md](APPROACH.md) — the short write-up of how this was built and why
(also supplied as `APPROACH.docx`).

---

## What it does

| Requirement | How it works |
|---|---|
| Voice commands | Web Speech API, live transcript while you talk |
| Natural language | Rule-based intent parser — many phrasings per action |
| Multilingual | English, Hindi, Spanish, French — including mixed-language input |
| Add / remove / update | Voice or tap, with quantity and unit handling |
| Categories | 231-item lookup plus fallback rules, 11 categories |
| Quantities | Digits, number words, `a dozen`, `half a kilo`, units |
| Smart suggestions | Repurchase history, substitutes, seasonal produce, current deals |
| Voice search | Product catalogue with brand, size, price, tags |
| Price filters | `under $5`, `between 2 and 5 dollars`, `500 रुपये से कम` |
| Visual feedback | Live transcript, toast confirmations, loading states |
| Mobile interface | Built at phone proportions, mic in the thumb-reach zone; shown in a device frame on desktop |
| Voice-only use | Optional spoken replies for every confirmation and search |

## Quick start

```bash
npm install
```

```bash
npm run dev
```

Other scripts: `npm test` (175 tests), `npm run lint`, `npm run build`.

Voice input needs a **secure context** — `localhost` in development, HTTPS in production.
The microphone will not start over plain HTTP.

## How it works

```
speech / typing
      ↓
parseCommand(text, locale)      normalize → intent → quantity → unit → item
      ↓
   ┌──┴───────────────┐
   ↓                  ↓
applyCommand      searchCatalog   ADD · REMOVE · UPDATE · CLEAR  |  SEARCH
   ↓                  ↓
list + history     results
   ↓
getSuggestions(items, history, catalog)
```

Every command — spoken or typed — goes through the same pipeline. That is deliberate: the
whole app is testable and usable without a microphone.

```
src/
  lib/
    nlp/            parser, intent constants, per-language lexicons
    suggestions/    history, substitutes, seasonal, deals
    catalog.js      lazy load, scoring, price conversion
    categories.js   item → category
    examples.js     example commands per language
  store/            reducer + localStorage persistence
  hooks/            speech recognition, speech synthesis
  components/       UI (PhoneFrame wraps the app on desktop)
  data/catalog.js   134 sample products
```

### The parser

`parseCommand` is a pure function returning a fixed shape:

```js
{ intent, items: [{ name, quantity, unit }], query, filters, confidence, locale, raw, normalized }
```

Intents are checked in a fixed order — `CLEAR → UPDATE → SEARCH → REMOVE → ADD` — so
"remove all items" reaches `CLEAR` before `REMOVE` claims it. Within an intent the longest
phrase wins, so "I want to buy" beats "I want".

Intent phrases are matched **anywhere in the sentence**, not just as a prefix. That is what
makes Hindi work: it is verb-final, so "दूध जोड़ो" puts the verb last. The same code path
handles English's verb-first order with no branching.

Non-English lexicons **inherit the English one as a fallback**, because people code-switch
constantly — English product names inside a Hindi sentence, or just saying "add" with
Spanish selected.

### Suggestions

Four sources, merged and ranked by `score × source weight`:

- **History** (1.0) — repurchase interval per item; suggested when overdue. Purchases are
  bucketed **by day, not by command**, so adding milk three times in one session counts as
  one shopping trip rather than making the app nag you about milk you just bought.
- **Substitutes** (0.7) — "almond milk instead of milk", based on recent items.
- **Deals** (0.6) — scaled by discount depth; anything you have bought before jumps to the
  top, because relevance beats a bigger number on something you never buy.
- **Seasonal** (0.55) — northern-hemisphere produce calendar.

### Search

The catalogue is a lazily imported chunk, kept out of the initial bundle and cached after
first use. Scoring is tiered: exact name → alias → prefix → substring → token overlap
across name, brand, category and tags. Ties break on price.

Price filters compare against the **sale price**, and a spoken threshold is converted first,
so "under 500 rupees" filters at roughly $6 against the USD catalogue.

22 common products carry cross-language `aliases`, so a Hindi search finds an English
product: "चावल 500 रुपये से कम ढूंढो" returns white rice at $4.99.

## Command reference

**English**

| Say | Result |
|---|---|
| `add milk` / `I need apples` / `get me coffee` | adds an item |
| `add 2 bottles of water` / `buy 5 oranges` | quantity and unit |
| `add a dozen eggs` / `half a kilo of rice` | phrase quantities |
| `add milk, eggs and bread` | several items at once |
| `remove milk from my list` / `I don't need bread` | removes |
| `change apples to 3` / `make it 5` | updates quantity |
| `clear my list` / `start over` | empties the list |
| `find organic apples under $5` | search with tag and price |
| `show me apples between 2 and 5 dollars` | price range |

**Other languages**

| Language | Example |
|---|---|
| हिन्दी | `दो सेब जोड़ो` · `मुझे दूध चाहिए` · `चावल 500 रुपये से कम ढूंढो` |
| Español | `agrega dos botellas de leche` · `busca manzanas menos de 5 dolares` |
| Français | `ajoute deux bouteilles de lait` · `cherche des pommes moins de 5 euros` |

The in-app `?` button lists working examples in the selected language.

## Design decisions

**Rule-based parsing rather than an LLM.** Commands are short and structured, so rules are
deterministic, instant, free, work offline, and — most importantly — are unit-testable. An
LLM would add latency, cost and a key to protect for no accuracy gain on this input.
Every parse carries a `confidence` score, which is where an LLM fallback would attach if
the vocabulary ever outgrew the rules.

**No backend.** Recognition runs in the browser and the list lives in `localStorage`. A
server would add deployment complexity and a privacy surface without enabling any required
feature. Adding one later does not disturb the parser or the store.

**Reducer for list state.** Command handling is a pure `(state, command) → state` function,
so the interesting logic is tested without rendering anything.

**One layout, phone proportions.** The brief asks for a mobile-optimised interface, so
there is exactly one layout: a single column with the mic in the thumb-reach zone. Rather
than reflowing into a desktop layout that would never be used on the target device, a wide
screen renders that same column inside a device frame ([`PhoneFrame`](src/components/PhoneFrame.jsx))
against a darker backdrop. The frame scrolls internally, so the mic bar pins to the bottom
of the device instead of the browser window. Below 1024px the frame has no styling at all —
the phone gets the real thing, not a simulation of one.

**Typing works everywhere voice does.** The text input is not a fallback bolted on — it
feeds the identical pipeline, which keeps the app usable in unsupported browsers and makes
the whole thing testable.

## Testing

175 tests with Vitest:

| Suite | Tests |
|---|---|
| `nlp/parser` | 63 |
| `store/listReducer` | 28 |
| `catalog` | 26 |
| `examples` | 23 |
| `suggestions` | 20 |
| `categories` | 15 |

```bash
npm test
```

The `examples` suite asserts that **every in-app example command, in every language, still
parses into a valid action** — so the hints shown to users cannot silently break.

The logic worth testing is deliberately kept in pure functions — `parseCommand`,
`applyCommand`, `categorize`, `getSuggestions`, `searchCatalog` — so none of it needs a
rendered component or a microphone to verify.

## Known limitations

- **Firefox has no Web Speech API.** The app detects this, explains it, and leaves the text
  input working. Chrome, Edge and Safari are fine.
- **Confirmation messages are English templates** in every language — a Hindi user hears
  "Added दूध". The item name is right, the surrounding words are not.
- **Seasonal produce is northern-hemisphere** and not configurable.
- **Prices are static sample data** in USD; currency conversion uses fixed reference rates.
- **Brand is matched through the query text**, not as a separate structured filter.
- Recognition accuracy for non-English languages depends entirely on the browser's engine.

## Deployment

Deploys as a static site — the build output in `dist/` is plain HTML, CSS and JS with no
server component.

| Setting | Value |
|---|---|
| Build command | `npm ci --include=dev && npm run build` |
| Publish directory | `dist` |
| Node version | 22 (pinned in `.node-version`) |

`--include=dev` matters: Vite, Tailwind and the React plugin are devDependencies, so a
production-only install would have nothing to build with.

[`render.yaml`](render.yaml) declares the same settings as a Render Blueprint, including an
SPA rewrite and long-lived caching for hashed assets.

**HTTPS is required.** The microphone will not start on plain HTTP. Render issues a
certificate automatically, so this is handled — but it is why a local `file://` or an HTTP
staging box will look broken.

## Data

Product catalogue, prices and seasonal calendar are representative sample data compiled for
this project from public supermarket listings and seasonal produce guides. **Brand names are
fictional** — any resemblance to a real company is coincidental. No live pricing is used.

## Tech

React 19, Vite, Tailwind CSS v4, [lucide-react](https://lucide.dev) for icons, Vitest.

Every icon in the interface is a lucide component — there are no emoji and no hand-drawn
SVG paths. Category icons are mapped in
[`CategoryIcon`](src/components/CategoryIcon.jsx) rather than in the category data, so
`lib/categories.js` stays plain data that tests can import without React.
# voice-shopping-list

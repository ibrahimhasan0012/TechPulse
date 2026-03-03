# TechPulse Pipeline v3 — Google Translate + Groq Summarize

## Background

The current pipeline has two problems:
1. **Translation quality is poor** — Llama 3.3 translates word-for-word rather than naturally. Groq's Qwen model had better quality but hit daily token rate limits.
2. **Search button is dead** — The navbar search button has no handler and no UI.

## Solution (MVP)

### API Strategy

| Step | Tool | Reason |
|------|------|--------|
| **Summarize** | Groq `llama-3.3-70b-versatile` | Already working, good English quality |
| **Translate** | `@vitalets/google-translate-api` | Free, no API key needed, Google quality, natural Bangla |

**Why not Hugging Face?**
- Free tier is $0.10/month credit — not enough for 200 articles
- Available Bangla LLMs are small and low quality
- Requires paid plan for production-grade translation

**Why `@vitalets/google-translate-api`?**
- No API key needed (zero config)
- Google Translate quality — natural, idiomatic Bangla
- Proven in the previous `pipeline_rebuild.md` design (Task 3)
- 2.5s delay between calls avoids IP bans reliably

---

## Tasks

### Task 1 — Replace `scripts/translate.js` with Google Translate

**File:** `scripts/translate.js`

- Install: `npm install @vitalets/google-translate-api`
- Remove Groq dependency entirely from this file
- Translate: `title → title_bn`, `paragraph1–5 → bangla_paragraph1–5`
- Skip articles that already have `bangla_paragraph1` set
- Cap `MAX_PER_RUN = 20` (same as before)
- Delay: `2500ms` between articles to avoid bans

The translation function should:
```js
import { translate } from '@vitalets/google-translate-api';
// Call translate(text, { to: 'bn' }) for each field
```

### Task 2 — Fix `scripts/summarize.js` — process only new articles

**File:** `scripts/summarize.js`

Current issue: may summarize articles that already have good content.

- Ensure the filter: `!a.aiSummarized` (not already done by AI)
- Cap `MAX_PER_RUN = 20`
- Keep using Groq `llama-3.3-70b-versatile`
- Keep existing system prompt (it's good)

### Task 3 — Fix the Search button in Navbar

**File:** `src/components/Navbar.jsx`

The search button currently does nothing. Fix:
- Add `searchOpen` state
- Toggle a search overlay/bar below the navbar when clicked
- The search bar should filter articles by `title` (and `title_bn` when `lang === 'bn'`)
- Pressing Enter or clicking a result navigates to `/article/:id`
- Press Escape to close
- Style it like the existing design (dark/light mode aware)

**File:** `src/components/Navbar.css`
- Add styles for `.search-overlay`, `.search-bar`, `.search-results`

### Task 4 — Limit fetch.js to 20 new articles per run

**File:** `scripts/fetch.js`

- Currently fetches all new articles it finds
- Add `MAX_NEW_PER_RUN = 20` cap
- Stop adding new articles once the cap is reached

---

## Files Changed

| File | Action |
|------|--------|
| `scripts/translate.js` | Rewrite — Google Translate, remove Groq |
| `scripts/summarize.js` | Minor fix — enforce cap & aiSummarized check |
| `scripts/fetch.js` | Minor fix — add MAX_NEW_PER_RUN cap |
| `src/components/Navbar.jsx` | Add search functionality |
| `src/components/Navbar.css` | Add search styles |
| `package.json` | Add `@vitalets/google-translate-api` |

---

## Status

- [ ] Task 1: Rewrite translate.js with Google Translate
- [ ] Task 2: Fix summarize.js cap and filter
- [ ] Task 3: Fix search button
- [ ] Task 4: Cap fetch.js to 20 new articles

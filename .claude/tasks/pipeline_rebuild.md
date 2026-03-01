# TechPulse: Article Pipeline Rebuild from Scratch

## Problem with Current Pipeline

The existing pipeline grew organically and has the following issues:

- `fetchArticles.js` — bloated with image download, text extraction, dedup logic all mixed together (359 lines)
- `summarize.js` — skips articles incorrectly due to wrong cache-busting logic
- `backfill.js` / `refetch_text.js` — one-off hack scripts added to fix broken data
- GitHub Actions — runs get stuck `in_progress` and never complete
- Data is stale: 161 articles with mostly truncated excerpts, no real AI content

## Solution: Clean Rebuild

### Design Principles

- **One script = one job** (fetch, enrich, deploy — separate concerns)
- **Simple JSON schema** — no nested or optional fields that cause frontend bugs
- **No dependency on OpenAI** for the core pipeline — use Readability for content, optional AI layer on top
- **Reliable GitHub Actions** — only commit if data changed; no image commits in CI (use URLs, not local files)

---

## New Article Schema

```json
{
  "id": "uuid",
  "title": "...",
  "title_bn": "...",
  "url": "https://...",
  "source": "TechCrunch",
  "region": "Global",
  "category": "AI & Development",
  "author": "TechPulse",
  "date": "Mar 1, 2026",
  "readTime": "4 min read",
  "imageUrl": "https://...",
  "paragraph1": "...",
  "paragraph2": "...",
  "paragraph3": "",
  "bangla_paragraph1": "...",
  "bangla_paragraph2": "...",
  "excerpt": "..."
}
```

---

## Tasks

### Task 1 — Clear existing data

- Delete all entries from `public/data/articles.json` (set to empty `[]`)
- Delete all locally stored images from `public/images/articles/`
- Remove `backfill.js` and `refetch_text.js` (one-off hack scripts)

### Task 2 — Rewrite `scripts/fetch.js` (was `fetchArticles.js`)

Single responsibility: fetch RSS feeds → extract metadata → save new articles

Steps:

1. Parse each configured RSS source
2. For each new item (not already in DB by URL):
   - Fetch the full article page using `axios` + `Readability`
   - Extract `og:image` for the image URL
   - Split extracted text into `paragraph1`, `paragraph2`, `paragraph3` (3 sentences each)
   - Build a clean article object
3. Save to `public/data/articles.json`
4. Keep max 200 articles, trim oldest

**No image downloading** — store source image URLs directly (simpler, avoids CI storage issues)

### Task 3 — Rewrite `scripts/translate.js`

Single responsibility: translate untranslated articles to Bangla

- Uses `@vitalets/google-translate-api`  
- Translate: `title`, `paragraph1`, `paragraph2`, `paragraph3`  
- Skip if already has `title_bn` that differs from `title`
- 2.5s delay between calls to avoid IP ban

### Task 4 — Update `scripts/summarize.js` (optional AI upgrade layer)

- Only runs if `OPENAI_API_KEY` is set
- Replaces `paragraph1/2/3` with AI-paraphrased versions
- Stores result in same fields (no schema change)
- Skip articles that already have good content (>80 chars per paragraph)

### Task 5 — Update GitHub Actions workflow

- Remove `push:` trigger (only run on schedule + manual dispatch)
- Remove image folder commit (`public/images/articles/`)
- Add proper `timeout-minutes: 30` to the workflow job
- Simpler and more reliable

### Task 6 — Build & deploy manually to verify

- Run `node scripts/fetch.js` locally
- Verify sample article has paragraph1/2 with real content
- Run `npm run deploy` to push to GitHub Pages

---

## Files Changed

| File | Action |
|------|--------|
| `public/data/articles.json` | Cleared to `[]` |
| `public/images/articles/` | Deleted all files |
| `scripts/fetchArticles.js` | Replaced by `scripts/fetch.js` |
| `scripts/summarize.js` | Updated (no schema changes) |
| `scripts/translate.js` | Updated (new fields) |
| `scripts/backfill.js` | Deleted |
| `scripts/refetch_text.js` | Deleted |
| `.github/workflows/aggregate.yml` | Simplified |

---

## Status

- [x] Task 1: Clear existing data — articles.json reset to [], old hack scripts deleted
- [x] Task 2: Rewrite `scripts/fetch.js` — clean RSS→Readability→paragraphs pipeline, 128 articles fetched
- [x] Task 3: Rewrite `scripts/translate.js` — Groq-powered natural Bangla translation
- [x] Task 4: Update `scripts/summarize.js` — Groq-powered AI paraphraser (llama-3.1-8b-instant)
- [x] Task 5: Update GitHub Actions — removed push trigger, added [skip ci], 30min timeout
- [x] Task 6: Build & deploy — `npm run deploy` published successfully

## 7. Post-Deployment User Tweaks

- [x] **Remove Untranslated Articles:** Deleted 15 un-translated articles that timed out.
- [x] **Upgrade Translation Model:** Pushed `translate.js` and `summarize.js` models to `openai/gpt-oss-120b` and ran a complete forced DB re-translation.
- [x] **Fix Article Rendering:** Fixed a local state bug in `ArticlePage.jsx` where the global language context wasn't syncing to the individual page's article body text.
- [x] **Add "Load More":** Updated `Home.jsx` with a React state-driven "Load More" button under the global news section to dynamically reveal all 65 articles without needing an archive page.

***

## Completion Note

All 6 tasks complete. 128 fresh articles live on GitHub Pages.
Site deployed at: <https://ibrahimhasan0012.github.io/TechPulse>

## Remaining: Add GROQ_API_KEY

The AI summarize and natural Bangla translate steps require a GROQ_API_KEY.

1. Get a free key at <https://console.groq.com>
2. Add to `TechPulse/.env`: `GROQ_API_KEY=gsk_...`
3. Add to GitHub Secrets: Settings → Secrets → Actions → `GROQ_API_KEY`
4. Then run locally: `npm run pipeline` OR just push — GitHub Actions will do it every 4 hours.

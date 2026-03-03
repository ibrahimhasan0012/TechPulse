# Fix: TechPulse Article Pipeline — All Jobs Cancelled

## Problem

The `TechPulse Article Pipeline` GitHub Actions workflow is being **cancelled** (all jobs fail). The screenshot shows 3 annotations on the cancelled job.

## Root Cause Analysis

After reviewing the code, there are **two root causes**:

### Root Cause 1 — Invalid Groq Model Name (Primary)

Both `scripts/summarize.js` (line 58) and `scripts/translate.js` (line 45) use:

```js
model: 'openai/gpt-oss-120b'
```

This model string is **not a valid hosted Groq model**. The Groq API will return a `400 Bad Request` or `404 Not Found` immediately, causing both the **Summarize** and **Translate** steps to crash, killing the pipeline job.

**Fix:** Replace both with a current, free-tier Groq model such as:

- `gemma2-9b-it` — Google Gemma 2, excellent multilingual quality, ideal for Bangla translation
- `llama-3.3-70b-versatile` — higher quality reasoning for summarization

### Root Cause 2 — Workflow Timeout Risk (Secondary)

`translate.js` uses `await delay(5000)` (5 seconds) per article, and `summarize.js` uses `await delay(2500)`. With 50+ new articles, this can push total runtime to **25+ minutes** of just API calls, approaching the `timeout-minutes: 30` limit and causing a cancellation.

**Fix:** Add a processing cap (e.g., max 30 articles per run) in both scripts.

### Root Cause 3 — Missing `write` Permissions for Commit Step (Minor)

The `git push` in "Commit updated articles" step uses `${{ secrets.GITHUB_TOKEN }}`, but the workflow file has no explicit `permissions: contents: write` declaration. Depending on the repo's default token permission policy, this can cause a `403` push error which kills the pipeline.

**Fix:** Add a `permissions` block to the workflow.

---

## Tasks

### Fix 1 — Model in `scripts/summarize.js` (line 58)

```diff
-   model: 'openai/gpt-oss-120b',
+   model: 'llama-3.3-70b-versatile',
```

### Fix 2 — Model in `scripts/translate.js` (line 45)

```diff
-   model: 'openai/gpt-oss-120b',
+   model: 'gemma2-9b-it',
```

> Uses Google's **Gemma 2 9B** instead of Llama — strong multilingual support with natural Bangla output.

### Fix 3 — Add processing cap to `summarize.js`

Limit to processing at most 30 new articles per run to avoid hitting the 30-minute timeout. After `toProcess` is defined, add:

```js
const batch = toProcess.slice(0, 20);
// then iterate over `batch` instead of `toProcess`
```

### Fix 4 — Add processing cap to `translate.js`

Same cap (max 20 per run).

### Fix 5 — Add `permissions` block to `.github/workflows/aggregate.yml`

```diff
 jobs:
   pipeline:
     runs-on: ubuntu-latest
     timeout-minutes: 30
    permissions:
      contents: write
```

### Fix 6 — Increase Job Timeout to 60m
In `.github/workflows/aggregate.yml`:
```diff
-     timeout-minutes: 30
+     timeout-minutes: 60
```

### Fix 7 — Resilient Git Push (Handle Race Conditions)
Add a rebase pull before pushing to handle cases where the remote changes during processing:
```diff
       - name: Commit updated articles
         run: |
           git config --global user.name 'github-actions[bot]'
           git config --global user.email 'github-actions[bot]@users.noreply.github.com'
           git add public/data/articles.json
           git diff --staged --quiet || git commit -m "chore: auto-update articles [skip ci]"
+          git pull --rebase
           git push
```

---

## Verification Plan

1. Commit changes and manually trigger `workflow_dispatch` from GitHub Actions UI.
2. All 5 steps should show green checkmarks.
3. Verify `articles.json` is updated in the commit history.
4. Verify GitHub Pages deploy succeeds.

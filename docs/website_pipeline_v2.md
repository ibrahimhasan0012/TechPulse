# TechPulse: Website Content Pipeline Enhancement

Following the planning principles in `CLAUDE_INSTRUCTION.md`, this plan focuses on stabilizing and optimizing the **TechPulse Website Content Pipeline** (`aggregate.yml`).

## User Review Required
> [!NOTE]
> This plan converts `open-source-project` into a regular folder to stop pipeline failures (error 128). This preserves the files as a reference but stops Git from treating it as a broken submodule.

## Proposed Changes

### 1. Repository Hygiene & Cleanup
Resolve the current "fatal: No url found for submodule path" error in GitHub Actions.
- **[MODIFY]** Remove `.git` from `open-source-project/`.
- **[MODIFY]** Run `git rm --cached open-source-project` and re-add it as a standard directory.
- **[DELETE]** Remove any legacy/temp scripts like `scripts/refetch_text.js` if still present.

### 2. Website Pipeline (`aggregate.yml`) Refinement
Optimize the core content flow (Fetch → Summarize → Translate → Commit).
- **[MODIFY] `scripts/fetch.js`**: Improve the Readability extraction logic to handle more complex site structures (using patterns from `scraper.py` ideas).
- **[MODIFY] `scripts/summarize.js`**: Ensure the Llama 3.3 prompt is tightly focused on tech journalism (using `AI_CTO.md` inspiration).
- **[MODIFY] `scripts/translate.js`**: Use the most stable Qwen model for long-term reliability.

### 3. Frontend Sync
Ensure the UI accurately displays the latest pipeline improvements.
- **[MODIFY] `src/components/ArticlePage.jsx`**: Ensure paraphrased content and original excerpts are handled gracefully without layout shifts.

---

## Tasks

### Phase 1: Fix Repository Structure (Blocker)
- [ ] Remove nested `.git` and re-index `open-source-project/`.
- [ ] Commit and push to verify the "exit code 128" is gone.

### Phase 2: Content Logic Upgrades
- [ ] Audit `fetch.js` for extraction failures.
- [ ] Refine `summarize.js` prompts for professional tech news tone.
- [ ] Stabilize `translate.js` with consistent model choice.

### Phase 3: Verification
- [ ] Trigger manual run on GitHub Actions.
- [ ] Verify `articles.json` updates correctly with high-quality AI content.

---

## Verification Plan

### Automated
- Monitor GitHub Actions for a 100% green run using the new configuration.
- Check `articles.json` for consistent `aiSummarized: true` flags.

### Manual
- Review 2-3 new articles on the live site to ensure translations and summaries are fluent and technically accurate.

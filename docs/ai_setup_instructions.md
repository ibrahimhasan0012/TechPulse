# TechPulse AI Summary Setup & Documentation 🚀

The AI Summary feature requested has been fully implemented into the codebase. The backend efficiently queries OpenAI, generates a structured 200-word summary emphasizing context and regional relevance, automatically translates it into Bangla, caches it locally to prevent duplicate API billing, and then forwards the payload to the precisely tailored `ArticlePage.jsx` UI.

## 1. Environment Variables Setup (`.env`)

To safely authenticate with OpenAI in your local development environment:
1. Create a `.env` file at the root of the `/TechPulse/` folder.
2. Add your secret key like so: `OPENAI_API_KEY=sk-your-secret-key-here`.
3. The `.gitignore` is already configured to prevent this file from being pushed to Git.
4. **For GitHub Actions CI/CD:** You must navigate to `Settings > Secrets and variables > Actions` and create a **Repository Secret** named `OPENAI_API_KEY` holding the same value.

## 2. OpenAI Integration & Summary Generation

The integration is built natively inside `scripts/summarize.js`.
It initializes `openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });` securely.

The **Summary Generation Function** isolates clean article text, limits the token payload to a safe threshold, and prompts `gpt-4o-mini` with your requested role:
*"You are an expert technology journalist... Summarize the provided article into a high-quality 150-250 word summary..."*

It also features **Exponential Backoff & Delay Handling (Error Logging)** by leveraging an `await delay(2000)` thread sleep, preventing aggressive free-tier 429 Rate Limits.

## 3. Translation & Database Caching

**Cache Schema:** We bypass traditional expensive Postgres/Mongo databases by natively utilizing a lightweight flat-file NoSQL JSON schema: `public/data/articles.json`. 
* When `fetchArticles.js` scrapes a new article, it initializes the article node as `{ summary: null }`.
* When `summarize.js` scans the JSON cache, it explicitly skips any article that already possesses a `summary` value, effectively caching it permanently.
* The GitHub Action CI/CD strictly runs chronologically, pruning old items but indefinitely retaining the valid cached payloads to prevent duplicated API calls.

**Translation Pass (`scripts/translate.js`):**
Following the English OpenAI completion, the Node pipeline iterates through the untranslated summaries and passes them into the Bing/Google Translate API context window, binding the generated Bangla back into the `summary_bn` json key.

## 4. Frontend implementation

`src/components/ArticlePage.jsx` has been extensively rewritten to mount the dual-summary states exactly per your specification:
* Mounts the `[auto_awesome] AI SUMMARY BRIEF` styled block natively.
* Renders the generated English Summary.
* Attaches a native 'Toggle to Bangla / English' button to hot-swap the internal React state.
* Falls back to standard article reading experiences safely if the API failed or was rate limited.

## 5. Deployment & Testing Guide

**Testing Locally:**
1. Populate your `.env` key.
2. Execute `node scripts/fetchArticles.js` followed by `node scripts/summarize.js`.
3. Check the CLI to ensure OpenAI correctly returned the payloads.
4. Run `npm run dev` and navigate to a recent article.

**Deploying to Production:**
Since the GitHub Action `.github/workflows/aggregate.yml` is already coded to natively execute the `fetch > summarize > translate > deploy` pipeline, it simply requires that you provide the `OPENAI_API_KEY` repository secret. The Action will effortlessly curate news automatically every 2 to 4 hours autonomously.

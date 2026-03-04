/**
 * translate.js — TechPulse Translation Script (NLLB-200 via HF Spaces)
 *
 * Responsibility: For each article without bangla_paragraph1, translate the title
 * and 5 paragraphs to Bengali using Meta's NLLB-200 model hosted on HF Spaces.
 * No API key required — uses the public community NLLB API endpoint.
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.join(__dirname, '../public/data/articles.json');

const delay = ms => new Promise(r => setTimeout(r, ms));
const MAX_PER_RUN = 20;

// Public community-hosted NLLB API on Hugging Face Spaces — no API key needed
const NLLB_API = 'https://winstxnhdw-nllb-api.hf.space/api/v4/translator';

async function translateText(text) {
    if (!text || text.trim().length === 0) return '';
    try {
        // Trim to 500 chars max to keep API calls fast and stable
        const trimmed = text.substring(0, 500);
        const url = `${NLLB_API}?text=${encodeURIComponent(trimmed)}&source=eng_Latn&target=ben_Beng`;

        const response = await fetch(url, { signal: AbortSignal.timeout(15000) });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const result = await response.json();
        return result.result || text;
    } catch (e) {
        console.error(`\n  [Error] Translation failed: ${e.message}`);
        return text; // fallback to original on error
    }
}

async function main() {
    console.log('=== TechPulse Translate to Bangla (NLLB-200 via HF Spaces) ===');

    let db = [];
    if (fs.existsSync(OUTPUT_FILE)) {
        db = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    }

    const pending = db.filter(a => !a.bangla_paragraph1 || a.bangla_paragraph1.trim() === '');
    console.log(`Translating ${Math.min(pending.length, MAX_PER_RUN)} of ${pending.length} pending articles (Cap: ${MAX_PER_RUN})...`);

    let translatedCount = 0;

    for (let i = 0; i < db.length; i++) {
        if (translatedCount >= MAX_PER_RUN) break;

        const article = db[i];
        if (!article.bangla_paragraph1 || article.bangla_paragraph1.trim() === '') {
            process.stdout.write(`[${translatedCount + 1}/${Math.min(pending.length, MAX_PER_RUN)}] ${article.title.substring(0, 50)}... `);

            article.title_bn = await translateText(article.title);
            article.bangla_paragraph1 = await translateText(article.paragraph1);
            article.bangla_paragraph2 = await translateText(article.paragraph2);
            article.bangla_paragraph3 = await translateText(article.paragraph3);
            article.bangla_paragraph4 = await translateText(article.paragraph4);
            article.bangla_paragraph5 = await translateText(article.paragraph5);

            translatedCount++;
            console.log('✓');

            // Save immediately after each successful translation
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(db, null, 2));

            // Polite delay between articles
            await delay(1000);
        }
    }

    console.log(`\n=== Done: ${translatedCount} articles translated to Bangla ===`);
}

main().catch(console.error);

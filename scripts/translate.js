/**
 * translate.js — TechPulse Translation Script (Google Translate API)
 * 
 * Responsibility: For each article without bangla_paragraph1, translate the title
 * and 5 paragraphs to Bengali.
 */

import { translate } from '@vitalets/google-translate-api';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.join(__dirname, '../public/data/articles.json');

const delay = ms => new Promise(r => setTimeout(r, ms));
const MAX_PER_RUN = 20;

async function translateText(text) {
    if (!text || text.trim().length === 0) return '';
    try {
        const res = await translate(text, { to: 'bn' });
        return res.text;
    } catch (e) {
        console.error(`\n  [Error] Translation failed: ${e.message}`);
        return text; // fallback to original on error
    }
}

async function main() {
    console.log('=== TechPulse Translate to Bangla (Google API) ===');
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

            // Save immediately after each successful translation stack
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(db, null, 2));

            // Wait 2.5s to avoid IP bans
            await delay(2500);
        }
    }

    console.log(`\n=== Done: ${translatedCount} articles translated to Bangla ===`);
}

main().catch(console.error);

/**
 * polish.js — TechPulse Bangla Editorial Polisher (Groq-powered)
 *
 * Responsibility: For each article with raw NLLB translations but not yet polished,
 * use Groq's Llama-70B to rewrite them in fluent, professional journalist Bangla.
 *
 * Stores result back in bangla_paragraph1-5 and title_bn.
 * Sets is_bangla_polished: true flag so this won't be re-processed.
 */

import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.join(__dirname, '../public/data/articles.json');

const delay = ms => new Promise(r => setTimeout(r, ms));

const GROQ_KEY = process.env.GROQ_API_KEY;
if (!GROQ_KEY) {
    console.log('⚠ No GROQ_API_KEY found. Skipping Bangla polish.');
    process.exit(0);
}

const groq = new Groq({ apiKey: GROQ_KEY });

const MAX_PER_RUN = 10;

const SYSTEM_PROMPT = `তুমি TechPulse-এর একজন সিনিয়র প্রযুক্তি সাংবাদিক। তোমার কাজ হলো কম্পিউটার-অনূদিত (machine-translated) বাংলা লেখাকে সাবলীল, প্রাঞ্জল এবং পেশাদার প্রযুক্তি সাংবাদিকতার ভাষায় রূপান্তরিত করা।

নির্দেশাবলী:
- ভাষা প্রাকৃতিক, সরল এবং পাঠকবান্ধব হতে হবে।
- অপ্রাসঙ্গিক ইংরেজি শব্দ বাংলায় রূপান্তর করো, কিন্তু প্রযুক্তিগত পরিভাষা (যেমন: CPU, AI, GPU) হুবহু রাখো।
- প্রতিটি অনুচ্ছেদের মূল ভাব অপরিবর্তিত রাখো — কোনো নতুন তথ্য যোগ করবে না।
- শিরোনামটি আকর্ষণীয় ও সংক্ষিপ্ত করো।
- আউটপুট শুধুমাত্র একটি valid JSON হবে। কোনো মার্কডাউন বা ভূমিকা নয়।

ফরম্যাট:
{"title_bn": "...", "bangla_paragraph1": "...", "bangla_paragraph2": "...", "bangla_paragraph3": "...", "bangla_paragraph4": "...", "bangla_paragraph5": "..."}`;

async function polishArticle(article) {
    const raw = [
        article.bangla_paragraph1,
        article.bangla_paragraph2,
        article.bangla_paragraph3,
        article.bangla_paragraph4,
        article.bangla_paragraph5
    ].filter(Boolean).join(' || ');

    if (!raw || raw.trim().length < 40) return null;

    const userMessage = `শিরোনাম (মেশিন-অনূদিত): ${article.title_bn || article.title}

অনুচ্ছেদসমূহ (মেশিন-অনূদিত):
1. ${article.bangla_paragraph1 || ''}
2. ${article.bangla_paragraph2 || ''}
3. ${article.bangla_paragraph3 || ''}
4. ${article.bangla_paragraph4 || ''}
5. ${article.bangla_paragraph5 || ''}`;

    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userMessage }
            ],
            temperature: 0.5,
            max_tokens: 2000,
        });

        const raw = completion.choices[0]?.message?.content?.trim() || '';
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return null;

        const parsed = JSON.parse(jsonMatch[0]);
        return {
            title_bn: (parsed.title_bn || '').trim(),
            bangla_paragraph1: (parsed.bangla_paragraph1 || '').trim(),
            bangla_paragraph2: (parsed.bangla_paragraph2 || '').trim(),
            bangla_paragraph3: (parsed.bangla_paragraph3 || '').trim(),
            bangla_paragraph4: (parsed.bangla_paragraph4 || '').trim(),
            bangla_paragraph5: (parsed.bangla_paragraph5 || '').trim(),
        };
    } catch (e) {
        console.log(`  ✗ Groq error: ${e.message}`);
        return null;
    }
}

async function main() {
    console.log('=== TechPulse Bangla Polish (Groq) ===');

    if (!fs.existsSync(OUTPUT_FILE)) {
        console.log('No articles.json found. Run fetch.js first.');
        return;
    }

    let articles = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));

    // Process articles that have NLLB translations but haven't been polished yet
    const toProcess = articles.filter(a =>
        a.bangla_paragraph1 &&
        a.bangla_paragraph1.trim() !== '' &&
        !a.is_bangla_polished
    );

    const batch = toProcess.slice(0, MAX_PER_RUN);
    console.log(`Polishing ${batch.length} of ${toProcess.length} pending articles (Cap: ${MAX_PER_RUN})...`);

    let done = 0;
    for (const article of batch) {
        process.stdout.write(`[${++done}/${batch.length}] ${article.title.substring(0, 50)}... `);

        const result = await polishArticle(article);
        if (result) {
            Object.assign(article, result);
            article.is_bangla_polished = true;
            console.log('✓');
        } else {
            console.log('— skipped');
        }

        // Save every article immediately
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));

        // Groq free tier: ~30 req/min
        await delay(2500);
    }

    console.log(`\n=== Done: polished ${done} articles ===`);
}

main().catch(console.error);

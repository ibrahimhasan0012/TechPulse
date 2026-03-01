/**
 * translate.js — TechPulse Bangla Translator (Groq-powered)
 * Uses llama-3.1-8b-instant for natural Bangla translation.
 * Has retry logic and longer delays to handle free-tier rate limits.
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
if (!GROQ_KEY) { console.log('⚠ No GROQ_API_KEY found.'); process.exit(0); }

const groq = new Groq({ apiKey: GROQ_KEY });

const SYS = `You are a professional Bangla translator for a technology news platform.
Translate the English tech content to natural, fluent Bangla (বাংলা).
Rules:
- Use natural Bangladeshi/Bengali vocabulary
- Keep technical/brand/product names in English (AI, CPU, GPU, iPhone, Samsung, etc.)
- Do NOT add any commentary
- Return ONLY valid JSON with no markdown code blocks:
{"title_bn":"...","bangla_paragraph1":"...","bangla_paragraph2":"...","bangla_paragraph3":"..."}`;

async function translateArticle(article, retries = 3) {
    const input = `Title: ${article.title}
P1: ${article.paragraph1.substring(0, 300)}
P2: ${(article.paragraph2 || '').substring(0, 200)}`;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const res = await groq.chat.completions.create({
                model: 'openai/gpt-oss-120b',
                messages: [{ role: 'system', content: SYS }, { role: 'user', content: input }],
                temperature: 0.3,
                max_tokens: 1500,
            });
            let raw = res.choices[0]?.message?.content?.trim() || '';
            // Strip markdown code fences: ```json ... ``` or ``` ... ```
            raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
            const m = raw.match(/\{[\s\S]*\}/);
            if (!m) {
                console.log(`    Attempt ${attempt}: No JSON in response (raw: ${raw.substring(0, 80)})`);
                continue;
            }
            let parsed;
            try { parsed = JSON.parse(m[0]); } catch { parsed = JSON.parse(m[0].replace(/[\u0000-\u001F]/g, ' ')); }
            const p = parsed;
            return {
                title_bn: (p.title_bn || article.title).trim(),
                bangla_paragraph1: (p.bangla_paragraph1 || '').trim(),
                bangla_paragraph2: (p.bangla_paragraph2 || '').trim(),
                bangla_paragraph3: (p.bangla_paragraph3 || '').trim(),
            };
        } catch (e) {
            const msg = e.message || '';
            console.log(`    Attempt ${attempt} error: ${msg.substring(0, 80)}`);
            if (msg.includes('rate') || msg.includes('429') || attempt < retries) {
                await delay(8000 * attempt); // exponential backoff
            }
        }
    }
    return null;
}

async function main() {
    console.log('=== TechPulse Translate to Bangla (Groq) ===');
    if (!fs.existsSync(OUTPUT_FILE)) { console.log('No articles.json found.'); return; }

    let articles = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    const toProcess = articles.filter(a => a.paragraph1 && !a.bangla_paragraph1);
    console.log(`Translating ${toProcess.length} articles (5s delay between each)...`);

    let done = 0;
    let succeeded = 0;
    for (const article of toProcess) {
        process.stdout.write(`[${++done}/${toProcess.length}] ${article.title.substring(0, 48)}... `);
        const result = await translateArticle(article);
        if (result) {
            Object.assign(article, result);
            succeeded++;
            console.log('✓');
        } else {
            console.log('✗ failed after retries');
        }
        if (done % 10 === 0) {
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
            console.log(`  → Checkpoint: ${succeeded}/${done} translated so far`);
        }
        await delay(5000); // 5s between each article
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
    console.log(`\n=== Done: ${succeeded}/${done} articles translated to Bangla ===`);
}

main().catch(console.error);

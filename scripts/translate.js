/**
 * translate.js — TechPulse Bangla Translator (Groq-powered)
 * Uses mixtral-8x7b-32768 for natural Bangla translation.
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
{"title_bn":"...", "bangla_paragraph1":"...", "bangla_paragraph2":"...", "bangla_paragraph3":"...", "bangla_paragraph4":"...", "bangla_paragraph5":"..."}`;

async function translateArticle(article, retries = 3) {
    const input = `Title: ${article.title}
P1: ${article.paragraph1 || ''}
P2: ${article.paragraph2 || ''}
P3: ${article.paragraph3 || ''}
P4: ${article.paragraph4 || ''}
P5: ${article.paragraph5 || ''}`;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const res = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'system', content: SYS }, { role: 'user', content: input }],
                temperature: 0.3,
                max_tokens: 4000,
                response_format: { type: 'json_object' },
            });
            let raw = res.choices[0]?.message?.content?.trim() || '';
            // 1. Strip <think>...</think> reasoning blocks (Qwen/DeepSeek models)
            raw = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
            // 2. Strip markdown code fences
            raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
            // 3. Extract JSON object
            const jsonMatch = raw.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.log(`    Attempt ${attempt}: No JSON found. Preview: ${raw.substring(0, 120)}...`);
                continue;
            }
            let parsed;
            try {
                // 4. Normalize curly/smart quotes and control chars before parsing
                const cleaned = jsonMatch[0]
                    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"') // curly double quotes → "
                    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'") // curly single quotes → '
                    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' '); // control chars
                parsed = JSON.parse(cleaned);
            } catch (e) {
                console.log(`    Attempt ${attempt} parse error: ${e.message?.substring(0, 80)}`);
                continue;
            }
            const p = parsed;
            return {
                title_bn: (p.title_bn || article.title).trim(),
                bangla_paragraph1: (p.bangla_paragraph1 || '').trim(),
                bangla_paragraph2: (p.bangla_paragraph2 || '').trim(),
                bangla_paragraph3: (p.bangla_paragraph3 || '').trim(),
                bangla_paragraph4: (p.bangla_paragraph4 || '').trim(),
                bangla_paragraph5: (p.bangla_paragraph5 || '').trim(),
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

    const MAX_PER_RUN = 20;
    const batch = toProcess.slice(0, MAX_PER_RUN);

    console.log(`Translating ${batch.length} of ${toProcess.length} pending articles (Cap: ${MAX_PER_RUN})...`);

    let done = 0;
    let succeeded = 0;
    for (const article of batch) {
        process.stdout.write(`[${++done}/${batch.length}] ${article.title.substring(0, 48)}... `);
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
        await delay(8000); // 8s between each article
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
    console.log(`\n=== Done: ${succeeded}/${done} articles translated to Bangla ===`);
}

main().catch(console.error);

/**
 * translate.js — TechPulse Bangla Translator (Groq-powered)
 *
 * Responsibility: Translate untranslated articles to natural Bangla using Groq.
 * Translates: title, paragraph1, paragraph2, paragraph3
 *
 * Skips articles that already have a Bangla title different from the English title.
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
    console.log('⚠ No GROQ_API_KEY found. Skipping Bangla translation.');
    process.exit(0);
}

const groq = new Groq({ apiKey: GROQ_KEY });

const TRANSLATE_PROMPT = `You are a professional Bangla translator for a technology news platform. 
Translate the following English tech content into natural, fluent Bangla (বাংলা).

Rules:
- Use natural Bangladeshi/Bengali vocabulary (not overly formal)
- Keep technical terms (AI, CPU, startup, etc.) in English where Bangla readers would expect them
- Do NOT translate brand names, company names, or product names
- Return ONLY valid JSON in exactly this format (no markdown, no extra text):
{"title_bn": "...", "bangla_paragraph1": "...", "bangla_paragraph2": "...", "bangla_paragraph3": "..."}`;

async function translateArticle(article) {
    const content = `Title: ${article.title}

Paragraph 1: ${article.paragraph1}

Paragraph 2: ${article.paragraph2 || ''}

Paragraph 3: ${article.paragraph3 || ''}`;

    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: TRANSLATE_PROMPT },
                { role: 'user', content }
            ],
            temperature: 0.3,
            max_tokens: 800,
        });

        const raw = completion.choices[0]?.message?.content?.trim() || '';
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return null;

        const parsed = JSON.parse(jsonMatch[0]);
        return {
            title_bn: (parsed.title_bn || article.title).trim(),
            bangla_paragraph1: (parsed.bangla_paragraph1 || '').trim(),
            bangla_paragraph2: (parsed.bangla_paragraph2 || '').trim(),
            bangla_paragraph3: (parsed.bangla_paragraph3 || '').trim(),
        };
    } catch (e) {
        console.log(`  ✗ Groq error: ${e.message}`);
        return null;
    }
}

async function main() {
    console.log('=== TechPulse Translate to Bangla (Groq) ===');

    if (!fs.existsSync(OUTPUT_FILE)) {
        console.log('No articles.json found. Run fetch.js first.');
        return;
    }

    let articles = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));

    // Articles needing translation: title_bn is same as title (placeholder) or bangla_paragraph1 is empty
    const toProcess = articles.filter(a =>
        a.title === a.title_bn || !a.bangla_paragraph1
    );

    console.log(`Translating ${toProcess.length} articles...`);
    let done = 0;

    for (const article of toProcess) {
        if (!article.paragraph1) {
            console.log(`  — Skipping "${article.title.substring(0, 40)}" (no content yet)`);
            continue;
        }

        process.stdout.write(`[${++done}/${toProcess.length}] ${article.title.substring(0, 50)}... `);

        const result = await translateArticle(article);
        if (result) {
            article.title_bn = result.title_bn;
            article.bangla_paragraph1 = result.bangla_paragraph1;
            article.bangla_paragraph2 = result.bangla_paragraph2;
            article.bangla_paragraph3 = result.bangla_paragraph3;
            console.log(`✓`);
        } else {
            console.log(`— skipped`);
        }

        // Save every 10
        if (done % 10 === 0) {
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
        }

        // Rate limit delay
        await delay(2500);
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
    console.log(`\n=== Done: translated ${done} articles to Bangla ===`);
}

main().catch(console.error);

/**
 * summarize.js — TechPulse AI Paraphraser (Groq-powered)
 *
 * Responsibility: For each article without AI-generated content, call Groq to:
 *   1. Paraphrase the article into 2-3 short, clear paragraphs (English)
 *   2. Reference South Asia angles when relevant
 *
 * Stores result back in paragraph1, paragraph2, paragraph3.
 * Falls back gracefully if GROQ_API_KEY is missing.
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
    console.log('⚠ No GROQ_API_KEY found. Skipping summarization.');
    process.exit(0);
}

const groq = new Groq({ apiKey: GROQ_KEY });

const SYSTEM_PROMPT = `You are a Chief Technology Editor for TechPulse, a premier South Asian technology news authority.

Your task is to transform raw technical reports into authoritative, insightful, and clear journalism.
Write exactly 3-5 concise paragraphs using this structure:
- Paragraph 1: The Lead — Define exactly what happened and why it matters in the global tech landscape.
- Paragraph 2: Technical Deep-Dive — Breakdown the core specs, innovations, or numbers. Be precise.
- Paragraph 3: Strategic Context — Provide history, market trends, or expert-level analysis of the news.
- Paragraph 4: Impact Analysis (Bangladesh, India, Pakistan) — Specifically how this affects regional users, local pricing trends, or regional availability.
- Paragraph 5 (Optional): Future Outlook — One sentence on what this means for the industry moving forward.

Strict Requirements:
- Tone: Authoritative, objective, and expert.
- Originality: Use your own sophisticated vocabulary; do not mimic the source text's structure.
- Localization: Refer to BDT, INR, or PKR when discussing costs relevant to South Asian markets.
- Output: Return ONLY a valid JSON object. No markdown, no preamble.
{"paragraph1": "...", "paragraph2": "...", "paragraph3": "...", "paragraph4": "...", "paragraph5": "..."}`;

async function summarizeArticle(article) {
    const sourceText = [article.paragraph1, article.paragraph2, article.paragraph3, article.paragraph4, article.paragraph5]
        .filter(Boolean).join(' ') || article.excerpt || '';

    if (sourceText.trim().length < 80) return null; // Not enough content

    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `Article title: ${article.title}\n\nArticle text:\n${sourceText.substring(0, 4000)}` }
            ],
            temperature: 0.4,
            max_tokens: 2500,
        });

        const raw = completion.choices[0]?.message?.content?.trim() || '';
        // Extract JSON even if there's surrounding text
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return null;

        const parsed = JSON.parse(jsonMatch[0]);
        return {
            paragraph1: (parsed.paragraph1 || '').trim(),
            paragraph2: (parsed.paragraph2 || '').trim(),
            paragraph3: (parsed.paragraph3 || '').trim(),
            paragraph4: (parsed.paragraph4 || '').trim(),
            paragraph5: (parsed.paragraph5 || '').trim(),
        };
    } catch (e) {
        console.log(`  ✗ Groq error: ${e.message}`);
        return null;
    }
}

async function main() {
    console.log('=== TechPulse Summarize (Groq) ===');

    if (!fs.existsSync(OUTPUT_FILE)) {
        console.log('No articles.json found. Run fetch.js first.');
        return;
    }

    let articles = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));

    // Summarize articles that don't yet have AI-quality content
    // We detect "not AI-generated" if paragraph1 is short (< 100 chars) — raw sentence split
    const toProcess = articles.filter(a =>
        !a.aiSummarized &&
        (!a.paragraph1 || a.paragraph1.length < 100 || !a.paragraph2)
    );

    const MAX_PER_RUN = 10;
    const batch = toProcess.slice(0, MAX_PER_RUN);

    console.log(`Processing ${batch.length} of ${toProcess.length} pending articles (Cap: ${MAX_PER_RUN})...`);
    let done = 0;

    for (const article of batch) {
        process.stdout.write(`[${++done}/${batch.length}] ${article.title.substring(0, 50)}... `);

        const result = await summarizeArticle(article);
        if (result) {
            article.paragraph1 = result.paragraph1;
            article.paragraph2 = result.paragraph2;
            article.paragraph3 = result.paragraph3;
            article.paragraph4 = result.paragraph4;
            article.paragraph5 = result.paragraph5;
            article.aiSummarized = true;
            console.log(`✓`);
        } else {
            console.log(`— skipped`);
        }

        // Save every 10 articles
        if (done % 10 === 0) {
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
        }

        // Rate limit: Groq free tier allows ~30 req/min
        await delay(2500);
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
    console.log(`\n=== Done: summarized ${done} articles ===`);
}

main().catch(console.error);

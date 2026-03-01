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

const SYSTEM_PROMPT = `You are a tech journalist writing for TechPulse, a South Asian technology news platform.

Given the raw text of a tech article, write a clean, paraphrased version in exactly 2-3 short paragraphs:
- Paragraph 1 (2-3 sentences): What happened — the main news
- Paragraph 2 (2-4 sentences): Key details, specs, numbers, or context  
- Paragraph 3 (1-3 sentences, optional): Impact for South Asian readers (Bangladesh, India, Pakistan). If not relevant leave empty string.

Rules:
- Write in your own words — do NOT copy sentences from the source
- Professional but accessible tone
- If prices are mentioned, convert to BDT/INR/PKR where sensible
- Return ONLY valid JSON in this exact format (no markdown, no extra text):
{"paragraph1": "...", "paragraph2": "...", "paragraph3": "..."}`;

async function summarizeArticle(article) {
    const sourceText = [article.paragraph1, article.paragraph2, article.paragraph3]
        .filter(Boolean).join(' ') || article.excerpt || '';

    if (sourceText.trim().length < 80) return null; // Not enough content

    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `Article title: ${article.title}\n\nArticle text:\n${sourceText.substring(0, 4000)}` }
            ],
            temperature: 0.4,
            max_tokens: 700,
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
        (a.paragraph1.length < 100 || !a.paragraph2)
    );

    console.log(`Processing ${toProcess.length} articles...`);
    let done = 0;

    for (const article of toProcess) {
        process.stdout.write(`[${++done}/${toProcess.length}] ${article.title.substring(0, 50)}... `);

        const result = await summarizeArticle(article);
        if (result) {
            article.paragraph1 = result.paragraph1;
            article.paragraph2 = result.paragraph2;
            article.paragraph3 = result.paragraph3;
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

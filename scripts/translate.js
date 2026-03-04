/**
 * translate.js — TechPulse Translation Script (Gemini Flash API)
 * 
 * Responsibility: For each article without bangla_paragraph1, translate the title
 * and 5 paragraphs to Bengali using Gemini 2.5 Flash via @google/generative-ai.
 */

import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.join(__dirname, '../public/data/articles.json');

const delay = ms => new Promise(r => setTimeout(r, ms));
const MAX_PER_RUN = 20;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function translateArticleBatch(article) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is missing.');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are an expert tech translator. Translate the following English Tech News article fields into natural, journalistic Bengali (Bangla).
Ensure technical terms are kept natural (e.g., 'MacBook Air' should be phonetically 'ম্যাকবুক এয়ার' or left in English if commonly used).

Respond strictly in valid JSON format with the following keys exactly:
- "title_bn"
- "bangla_paragraph1"
- "bangla_paragraph2"
- "bangla_paragraph3"
- "bangla_paragraph4"
- "bangla_paragraph5"

English content to translate:
{
  "title": ${JSON.stringify(article.title)},
  "paragraph1": ${JSON.stringify(article.paragraph1)},
  "paragraph2": ${JSON.stringify(article.paragraph2)},
  "paragraph3": ${JSON.stringify(article.paragraph3)},
  "paragraph4": ${JSON.stringify(article.paragraph4)},
  "paragraph5": ${JSON.stringify(article.paragraph5)}
}
`;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Extract JSON even if wrapped in markdown formatting
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Could not parse JSON from Gemini response.');

        return JSON.parse(jsonMatch[0]);
    } catch (e) {
        console.error(`\n  [Error] Translation failed for ID ${article.id}: ${e.message}`);
        return null; // Signals failure
    }
}

async function main() {
    console.log('=== TechPulse Translate to Bangla (Gemini 1.5 Flash) ===');

    if (!process.env.GEMINI_API_KEY) {
        console.log('Please set GEMINI_API_KEY in your .env file to run translation.');
        return;
    }

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

            const translatedData = await translateArticleBatch(article);

            if (translatedData) {
                article.title_bn = translatedData.title_bn || article.title;
                article.bangla_paragraph1 = translatedData.bangla_paragraph1 || article.paragraph1;
                article.bangla_paragraph2 = translatedData.bangla_paragraph2 || article.paragraph2;
                article.bangla_paragraph3 = translatedData.bangla_paragraph3 || article.paragraph3;
                article.bangla_paragraph4 = translatedData.bangla_paragraph4 || article.paragraph4;
                article.bangla_paragraph5 = translatedData.bangla_paragraph5 || article.paragraph5;

                translatedCount++;
                console.log('✓');

                // Save immediately after each successful translation stack
                fs.writeFileSync(OUTPUT_FILE, JSON.stringify(db, null, 2));
            } else {
                console.log('✗ skipped');
            }

            // Wait 4.5s to respect Gemini 15 RPM free tier limits
            await delay(4500);
        }
    }

    console.log(`\n=== Done: ${translatedCount} articles translated to Bangla ===`);
}

main().catch(console.error);

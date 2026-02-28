// Re-fetch full article body text and build proper paragraph1/2/3 from real content
// No API key needed - uses Mozilla Readability to extract clean text
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.join(__dirname, '../public/data/articles.json');

const delay = ms => new Promise(res => setTimeout(res, ms));

function cleanText(text) {
    return text
        .replace(/\s+/g, ' ')       // collapse whitespace
        .replace(/\n+/g, ' ')        // remove newlines  
        .trim();
}

function buildParagraphs(fullText, excerpt) {
    if (!fullText || fullText.trim().length < 80) {
        // Fallback: clean up the excerpt at least
        const cleaned = cleanText(excerpt || '');
        const noEllipsis = cleaned.replace(/\.\.\.$/, '').trim();
        return [noEllipsis, '', ''];
    }

    const cleaned = cleanText(fullText);
    // Split on sentence endings
    const sentences = cleaned.match(/[^.!?]+[.!?]+["')]*\s*/g) || [];

    if (sentences.length < 2) return [cleaned.substring(0, 500), '', ''];

    // P1: First 3 sentences (intro)
    const p1Sentences = sentences.slice(0, Math.min(3, sentences.length));
    // P2: Next 3-4 sentences (details)
    const p2Sentences = sentences.slice(p1Sentences.length, p1Sentences.length + 4);
    // P3: Remaining sentences up to a limit (context)
    const p3Sentences = sentences.slice(p1Sentences.length + p2Sentences.length, p1Sentences.length + p2Sentences.length + 3);

    return [
        p1Sentences.join('').trim(),
        p2Sentences.join('').trim(),
        p3Sentences.join('').trim()
    ];
}

async function fetchFullText(url) {
    try {
        const { data } = await axios.get(url, {
            timeout: 8000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        const dom = new JSDOM(data, { url });
        const reader = new Readability(dom.window.document);
        const article = reader.parse();
        if (article && article.textContent && article.textContent.trim().length > 100) {
            return article.textContent.trim().substring(0, 6000);
        }
    } catch (e) {
        // silently fail - will fallback to excerpt
    }
    return null;
}

async function run() {
    console.log('--- Re-fetching Full Article Text ---');
    let articles = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));

    // Only process articles that have bad/missing paragraph1 (short truncated ones)
    const toProcess = articles.filter(a =>
        !a.paragraph1 ||
        a.paragraph1.endsWith('...') ||
        a.paragraph1.length < 80
    );

    console.log(`Processing ${toProcess.length} articles with thin content...`);

    let count = 0;
    for (let article of toProcess) {
        if (!article.url) continue;

        process.stdout.write(`[${++count}/${toProcess.length}] ${article.title.substring(0, 50)}... `);

        const fullText = await fetchFullText(article.url);
        const [p1, p2, p3] = buildParagraphs(fullText, article.excerpt);

        article.paragraph1 = p1;
        article.paragraph2 = p2;
        if (p3) article.paragraph3 = p3;

        console.log(fullText ? `✓ (${p1.length} chars)` : `⚠ fallback`);

        await delay(300); // light delay to avoid IP blocks

        // Save every 10 articles in case of crash
        if (count % 10 === 0) {
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
            console.log('  → Saved checkpoint.');
        }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
    console.log(`\nDone! Re-fetched content for ${count} articles.`);
}

run();

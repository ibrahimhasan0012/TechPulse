// One-time migration: Populate paragraph1/2 from existing excerpt/fullText
// This runs WITHOUT OpenAI so it works immediately locally.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.join(__dirname, '../public/data/articles.json');

function splitIntoParagraphs(text) {
    if (!text || text.trim().length < 10) return ['', ''];

    // Clean up excessive whitespace/newlines
    const cleaned = text.replace(/\s+/g, ' ').trim();

    // Split on sentence boundaries
    const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];

    if (sentences.length <= 2) {
        return [cleaned, ''];
    }

    // Paragraph 1: first 3-4 sentences (Introduction)
    const midPoint = Math.min(3, Math.floor(sentences.length / 2));
    const p1 = sentences.slice(0, midPoint).join(' ').trim();
    // Paragraph 2: rest (Details)
    const p2 = sentences.slice(midPoint).join(' ').trim();

    return [p1, p2];
}

async function runBackfill() {
    console.log('--- Starting Excerpt → Paragraph Backfill Migration ---');

    let articles = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    let migrated = 0;

    for (let article of articles) {
        // Only migrate articles missing paragraph1
        if (!article.paragraph1) {
            const sourceText = article.fullText || article.excerpt || article.summary || '';
            const [p1, p2] = splitIntoParagraphs(sourceText);

            article.paragraph1 = p1;
            if (p2) article.paragraph2 = p2;

            // Copy old summary_bn to bangla translation fallback
            if (article.summary_bn && !article.bangla_paragraph1) {
                article.bangla_paragraph1 = article.summary_bn;
            }

            migrated++;
        }

        // Clean up heavy fullText field to reduce JSON file size
        delete article.fullText;
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
    console.log(`Migration complete! Populated paragraph1/2 for ${migrated} articles.`);
}

runBackfill();

/**
 * interlink.js — TechPulse Smart Internal Linker
 *
 * Responsibility: For each article without related_articles, compute cosine
 * similarity against the full article database using TF-IDF keyword weighting,
 * and store the top 3 most related article IDs.
 *
 * No external API required — fully local computation.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.join(__dirname, '../public/data/articles.json');

// Common English stopwords to exclude from keyword analysis
const STOPWORDS = new Set([
    'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or',
    'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
    'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may',
    'might', 'can', 'that', 'this', 'these', 'those', 'it', 'its', 'with',
    'as', 'from', 'by', 'up', 'about', 'into', 'through', 'during', 'than',
    'more', 'also', 'new', 'over', 'after', 'before', 'between', 'out',
    'just', 'not', 'no', 'so', 'if', 'all', 'while', 'which', 'when',
    'their', 'they', 'them', 'what', 'one', 'two', 'three', 'four', 'five'
]);

function tokenize(text = '') {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2 && !STOPWORDS.has(w));
}

function termFrequency(tokens) {
    const tf = {};
    for (const token of tokens) {
        tf[token] = (tf[token] || 0) + 1;
    }
    return tf;
}

function cosineSimilarity(tf1, tf2) {
    const keys = new Set([...Object.keys(tf1), ...Object.keys(tf2)]);
    let dot = 0, mag1 = 0, mag2 = 0;
    for (const k of keys) {
        const v1 = tf1[k] || 0;
        const v2 = tf2[k] || 0;
        dot += v1 * v2;
        mag1 += v1 * v1;
        mag2 += v2 * v2;
    }
    if (mag1 === 0 || mag2 === 0) return 0;
    return dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

function articleText(article) {
    return [
        article.title,
        article.category,
        article.paragraph1,
        article.paragraph2,
        article.paragraph3
    ].filter(Boolean).join(' ');
}

async function main() {
    console.log('=== TechPulse Smart Internal Linker (TF-IDF) ===');

    if (!fs.existsSync(OUTPUT_FILE)) {
        console.log('No articles.json found. Run fetch.js first.');
        return;
    }

    let articles = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));

    const vectors = articles.map(a => termFrequency(tokenize(articleText(a))));

    const toProcess = articles.filter(a => !a.related_articles || a.related_articles.length === 0);
    console.log(`Computing related articles for ${toProcess.length} of ${articles.length} articles...`);

    let done = 0;
    for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        if (article.related_articles && article.related_articles.length > 0) continue;

        const scores = [];
        for (let j = 0; j < articles.length; j++) {
            if (i === j) continue;
            const sim = cosineSimilarity(vectors[i], vectors[j]);
            scores.push({ id: articles[j].id, sim });
        }

        scores.sort((a, b) => b.sim - a.sim);
        article.related_articles = scores.slice(0, 3).map(s => s.id);
        done++;

        if (done % 20 === 0) {
            process.stdout.write(`  ${done}/${toProcess.length}...\n`);
        }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
    console.log(`\n=== Done: linked ${done} articles ===`);
}

main().catch(console.error);

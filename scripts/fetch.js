/**
 * fetch.js — TechPulse Article Fetcher
 * 
 * Responsibility: Fetch RSS feeds, extract full article text using Readability,
 * split into 3 clean paragraphs, and save new articles to the database.
 *
 * Does NOT: download images, call AI APIs, translate content.
 */

import Parser from 'rss-parser';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'articles.json');
const MAX_ARTICLES = 200;

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const parser = new Parser({
    customFields: {
        item: [
            ['media:thumbnail', 'thumbnail'],
            ['media:content', 'mediaContent'],
            ['content:encoded', 'contentEncoded']
        ]
    }
});

// ── Sources ────────────────────────────────────────────────────────────────
const SOURCES = {
    // Bangladesh
    DhakaTribune: { url: 'https://www.dhakatribune.com/feed/tech', region: 'Bangladesh', category: 'Technology' },
    PCBuilderBD: { url: 'https://pcbuilderbd.com/blog/feed/', region: 'Bangladesh', category: 'Hardware' },

    // India
    Inc42: { url: 'https://inc42.com/feed/', region: 'India', category: 'Startups' },
    YourStory: { url: 'https://yourstory.com/feed', region: 'India', category: 'Startups' },
    MintTech: { url: 'https://www.livemint.com/rss/technology', region: 'India', category: 'Technology' },

    // Pakistan
    TechJuice: { url: 'https://www.techjuice.pk/feed/', region: 'Pakistan', category: 'Technology' },

    // Global – Hardware
    AndroidAuth: { url: 'https://www.androidauthority.com/feed/', region: 'Global', category: 'Hardware' },
    TomsHardware: { url: 'https://www.tomshardware.com/feeds/all', region: 'Global', category: 'Hardware' },
    MacRumors: { url: 'https://feeds.macrumors.com/MacRumors-All', region: 'Global', category: 'Hardware' },
    PhoneArena: { url: 'https://www.phonearena.com/feed', region: 'Global', category: 'Hardware' },

    // Global – AI & Dev
    TechCrunch: { url: 'https://techcrunch.com/feed/', region: 'Global', category: 'AI & Dev' },
    TheVerge: { url: 'https://www.theverge.com/rss/index.xml', region: 'Global', category: 'AI & Dev' },
    ArsTechnica: { url: 'https://feeds.arstechnica.com/arstechnica/index', region: 'Global', category: 'AI & Dev' },

    // Europe
    TechEU: { url: 'https://tech.eu/feed/', region: 'Europe', category: 'Startups' },
    Sifted: { url: 'https://sifted.eu/feed/', region: 'Europe', category: 'Startups' },
};

// Keywords to filter out non-tech / political content
const BLOCK_KEYWORDS = ['trump', 'election', 'biden', 'republican', 'democrat', 'senate', 'congress', 'hegseth', 'musk lawsuit'];

function isBlocked(text = '') {
    const lower = text.toLowerCase();
    return BLOCK_KEYWORDS.some(kw => lower.includes(kw));
}

// ── Text helpers ──────────────────────────────────────────────────────────
function splitParagraphs(text) {
    if (!text || text.trim().length < 50) return ['', '', ''];

    const cleaned = text.replace(/\s+/g, ' ').trim();
    const sentences = cleaned.match(/[^.!?]+[.!?]+["')]*\s*/g) || [];

    if (sentences.length === 0) return [cleaned.substring(0, 400), '', ''];

    const s = (start, count) => sentences.slice(start, start + count).join('').trim();

    const p1 = s(0, Math.min(3, sentences.length));
    const p2 = sentences.length > 3 ? s(3, Math.min(4, sentences.length - 3)) : '';
    const p3 = sentences.length > 7 ? s(7, Math.min(3, sentences.length - 7)) : '';

    return [p1, p2, p3];
}

function estimateReadTime(text = '') {
    const words = text.split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
}

// ── Image extraction from RSS item ───────────────────────────────────────
function extractRssImage(item) {
    if (item.thumbnail?.$.url) return item.thumbnail.$.url;
    if (item.mediaContent?.$.url) return item.mediaContent.$.url;
    if (item.enclosure?.url) return item.enclosure.url;

    const html = item.contentEncoded || item.content || item.description || '';
    const m = html.match(/<img[^>]+src=["']([^"'>]+)["']/);
    if (m) return m[1];

    return '';
}

// ── Full article fetch ────────────────────────────────────────────────────
async function fetchArticlePage(url) {
    try {
        const { data } = await axios.get(url, {
            timeout: 10000,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TechPulseBot/1.0)' }
        });

        const dom = new JSDOM(data, { url });
        const doc = dom.window.document;

        // Extract og:image
        const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

        // Extract body text via Readability
        const reader = new Readability(doc);
        const article = reader.parse();
        const text = article?.textContent?.trim().substring(0, 8000) || '';

        return { text, ogImage };
    } catch {
        return { text: '', ogImage: '' };
    }
}

// ── Format date ───────────────────────────────────────────────────────────
function formatDate(isoString) {
    const d = isoString ? new Date(isoString) : new Date();
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
    console.log('=== TechPulse Fetch ===');

    let db = [];
    if (fs.existsSync(OUTPUT_FILE)) {
        db = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    }

    const existingUrls = new Set(db.map(a => a.url));
    let added = 0;

    for (const [sourceName, meta] of Object.entries(SOURCES)) {
        console.log(`\nFetching ${sourceName}...`);
        let feed;
        try {
            feed = await parser.parseURL(meta.url);
        } catch (e) {
            console.log(`  ✗ Failed: ${e.message}`);
            continue;
        }

        for (const item of (feed.items || []).slice(0, 10)) {
            const url = item.link || item.guid;
            if (!url || existingUrls.has(url)) continue;

            const title = item.title?.trim() || '';
            if (!title || isBlocked(title)) continue;

            process.stdout.write(`  + ${title.substring(0, 55)}... `);

            const { text, ogImage } = await fetchArticlePage(url);
            const rssImage = extractRssImage(item);
            const imageUrl = ogImage || rssImage;

            const rawExcerpt = (item.contentSnippet || item.summary || '')
                .replace(/\s+/g, ' ').trim().substring(0, 250);

            const [p1, p2, p3] = splitParagraphs(text || rawExcerpt);

            const article = {
                id: uuidv4(),
                title,
                title_bn: title,          // placeholder — overwritten by translate.js
                url,
                source: sourceName,
                region: meta.region,
                category: meta.category,
                author: 'TechPulse',
                date: formatDate(item.isoDate || item.pubDate),
                readTime: estimateReadTime(text || p1),
                imageUrl,
                excerpt: rawExcerpt,
                paragraph1: p1,
                paragraph2: p2,
                paragraph3: p3,
                bangla_paragraph1: '',    // filled by translate.js
                bangla_paragraph2: '',
                bangla_paragraph3: '',
            };

            db.push(article);
            existingUrls.add(url);
            added++;
            console.log(`✓`);

            // Small delay to be polite
            await new Promise(r => setTimeout(r, 300));
        }
    }

    // Keep only the newest MAX_ARTICLES, trim oldest
    db.sort((a, b) => new Date(b.date) - new Date(a.date));
    db = db.slice(0, MAX_ARTICLES);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(db, null, 2));
    console.log(`\n=== Done: added ${added} new articles (total: ${db.length}) ===`);
}

main().catch(console.error);

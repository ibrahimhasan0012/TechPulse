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

const parser = new Parser({
    customFields: {
        item: [
            ['media:thumbnail', 'thumbnail'],
            ['media:content', 'mediaContent'],
            ['content:encoded', 'contentEncoded']
        ]
    }
});

const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'articles.json');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const SOURCES = {
    // Bangladesh (South Asia)
    DhakaTribune: { url: 'https://www.dhakatribune.com/feed/tech', category: 'Technology', region: 'Bangladesh', type: 'Software' },
    DailyStarTech: { url: 'https://www.thedailystar.net/tech-startup/rss.xml', category: 'Startups', region: 'Bangladesh', type: 'Software' },
    PCBuilderBD: { url: 'https://pcbuilderbd.com/blog/feed/', category: 'Hardware', region: 'Bangladesh', type: 'Hardware Launch' },

    // India (South Asia)
    Inc42: { url: 'https://inc42.com/feed/', category: 'South Asian Startups', region: 'India', type: 'Software' },
    YourStory: { url: 'https://yourstory.com/feed', category: 'South Asian Startups', region: 'India', type: 'Software' },
    MintTech: { url: 'https://www.livemint.com/rss/technology', category: 'India Tech Policy', region: 'India', type: 'Software' },
    TheKen: { url: 'https://thekencompany.com/feed/', category: 'South Asian Startups', region: 'India', type: 'Software' },

    // Pakistan (South Asia)
    TechJuice: { url: 'https://www.techjuice.pk/feed/', category: 'Startups', region: 'Pakistan', type: 'Software' },
    ProPakistani: { url: 'https://propakistani.pk/category/technology/feed/', category: 'Technology', region: 'Pakistan', type: 'Software' },

    // Global: Hardware
    GSMArena: { url: 'https://www.gsmarena.com/rss-news-reviews.php3', category: 'Global Hardware', region: 'Global', type: 'Hardware Launch' },
    AndroidAuthority: { url: 'https://www.androidauthority.com/feed/', category: 'Global Hardware', region: 'Global', type: 'Hardware Launch' },
    TomsHardware: { url: 'https://www.tomshardware.com/feeds/all', category: 'Global Hardware', region: 'Global', type: 'Hardware Launch' },
    MacRumors: { url: 'https://feeds.macrumors.com/MacRumors-All', category: 'Global Hardware', region: 'Global', type: 'Hardware Launch' },
    PhoneArena: { url: 'https://www.phonearena.com/feed', category: 'Global Hardware', region: 'Global', type: 'Hardware Launch' },

    // Global: AI & Dev
    TechCrunch: { url: 'https://techcrunch.com/feed/', category: 'AI & Development', region: 'Global', type: 'Software' },
    TheVerge: { url: 'https://www.theverge.com/rss/index.xml', category: 'AI & Development', region: 'Global', type: 'Software' },
    ArsTechnica: { url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'Cloud & Infrastructure', region: 'Global', type: 'Hardware' },

    // Global: Europe & Asia-Pacific
    TechEU: { url: 'https://tech.eu/feed/', category: 'Startups', region: 'Europe', type: 'Software' },
    Sifted: { url: 'https://sifted.eu/feed/', category: 'Startups', region: 'Europe', type: 'Software' },
    TechInAsia: { url: 'https://www.techinasia.com/feed', category: 'Startups', region: 'Asia-Pacific', type: 'Software' }
};

const FALLBACK_IMAGES = {
    'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
    'Startups': 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80',
    'South Asian Startups': 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80',
    'Hardware': 'https://images.unsplash.com/photo-1517077304055-6e89abf098fa?auto=format&fit=crop&q=80',
    'Global Hardware': 'https://images.unsplash.com/photo-1517077304055-6e89abf098fa?auto=format&fit=crop&q=80',
    'Development': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80',
    'AI & Development': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80',
    'Cloud & Infrastructure': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    'India Tech Policy': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80'
}

const filterKeywords = ['trump', 'election', 'biden', 'politics', 'republican', 'democrat', 'senate', 'congress', 'pentagon', 'hegseth'];

function isPolitical(text) {
    if (!text) return false;
    const lower = text.toLowerCase();
    return filterKeywords.some(kw => lower.includes(kw));
}

const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').trim().substring(0, 200) + '...';
};

const extractImage = (item, sourceName) => {
    if (item.thumbnail && item.thumbnail.$ && item.thumbnail.$.url) return item.thumbnail.$.url;
    if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) return item.mediaContent.$.url;

    // Enclosures
    if (item.enclosure && item.enclosure.url) return item.enclosure.url;

    const content = item.contentEncoded || item.content || item.description || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) return imgMatch[1];

    return FALLBACK_IMAGES[SOURCES[sourceName]?.category || 'Technology'];
}

async function fetchFullText(url) {
    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            timeout: 10000
        });
        const dom = new JSDOM(response.data, { url });
        const reader = new Readability(dom.window.document);
        const article = reader.parse();
        return article ? article.textContent.trim() : '';
    } catch (err) {
        // console.error(`   -> Failed full-text extraction for ${url}:`, err.message);
        return '';
    }
}

async function fetchHackerNews() {
    console.log('Fetching Hacker News Top Stories...');
    try {
        const topStoriesRes = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        const topIds = topStoriesRes.data.slice(0, 5); // fetch top 5 

        const articles = [];
        for (const id of topIds) {
            const storyRes = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            const story = storyRes.data;
            if (story && story.url && !isPolitical(story.title)) {
                articles.push({
                    source: 'Hacker News',
                    category: 'Development',
                    region: 'US',
                    type: 'Software',
                    title: story.title,
                    url: story.url,
                    author: story.by,
                    date: new Date(story.time * 1000),
                    rawExcerpt: `Hacker News Top Story with ${story.score} points.`,
                    imageUrl: FALLBACK_IMAGES['Development']
                });
            }
        }
        return articles;
    } catch (error) {
        console.error('Error fetching Hacker News:', error.message);
        return [];
    }
}

async function fetchRssFeeds() {
    let rawItems = [];

    for (const [sourceName, details] of Object.entries(SOURCES)) {
        console.log(`Checking RSS from ${sourceName}...`);
        try {
            const feed = await parser.parseURL(details.url);
            // Higher fetch volume for South Asia
            const isSouthAsia = ['Bangladesh', 'India', 'Pakistan'].includes(details.region);
            const limit = Math.min(feed.items.length, isSouthAsia ? 15 : 8);

            for (let i = 0; i < limit; i++) {
                const item = feed.items[i];
                const rawExcerpt = stripHtml(item.contentSnippet || item.content || item.description);

                if (isPolitical(item.title) || isPolitical(rawExcerpt)) {
                    continue; // Drop political news
                }

                rawItems.push({
                    source: sourceName,
                    category: details.category,
                    region: details.region,
                    type: details.type,
                    title: item.title,
                    url: item.link,
                    author: item.creator || item.author || `${sourceName} Staff`,
                    date: item.pubDate ? new Date(item.pubDate) : new Date(),
                    rawExcerpt: rawExcerpt,
                    imageUrl: extractImage(item, sourceName),
                    alsoReportedBy: []
                });
            }
        } catch (error) {
            console.error(`Error fetching ${sourceName}:`, error.message);
        }
    }
    return rawItems;
}

async function aggregateAll() {
    console.log('--- Starting TechPulse V2 Aggregation ---');

    let existingArticles = [];
    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            existingArticles = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
        } catch (e) {
            console.error('Database corrupted, fresh start.');
        }
    }

    const hnMeta = await fetchHackerNews();
    const rssMeta = await fetchRssFeeds();
    const allMeta = [...hnMeta, ...rssMeta];

    const urlsInDb = new Set(existingArticles.map(a => a.url));

    // De-duplication Strategy
    // Clean strings for similarity check
    const cleanStr = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    let deduplicatedMeta = [];

    for (const article of allMeta) {
        // If exact URL matches DB, skip.
        if (urlsInDb.has(article.url)) continue;

        // Check against currently building list to merge breaking news
        const cleanTitle = cleanStr(article.title);
        const existingMatch = deduplicatedMeta.find(a =>
            cleanStr(a.title) === cleanTitle ||
            (cleanTitle.length > 20 && cleanStr(a.title).includes(cleanTitle.substring(0, 20)))
        );

        if (existingMatch) {
            if (!existingMatch.alsoReportedBy.includes(article.source)) {
                existingMatch.alsoReportedBy.push(article.source);
            }
        } else {
            deduplicatedMeta.push(article);
        }
    }

    console.log(`Found ${deduplicatedMeta.length} brand new non-political UNIQUE articles.`);

    // Now fetch full text for the unique new ones
    let processedNewArticles = [];
    for (const meta of deduplicatedMeta) {
        console.log(`Extracting full text for: ${meta.title.substring(0, 40)}...`);
        const fullText = await fetchFullText(meta.url);

        // If it's a launch article, let's bump its weight/category mapping later.

        processedNewArticles.push({
            id: uuidv4(),
            source: meta.source,
            category: meta.category,
            region: meta.region,
            type: meta.type,
            title: meta.title,
            title_bn: meta.title, // Placeholder for summarize/translate scripts
            excerpt: meta.rawExcerpt, // Legacy excerpt
            url: meta.url,
            author: meta.author,
            author_bn: meta.author,
            authorBio: `Tech Journalist at ${meta.source}`,
            alsoReportedBy: meta.alsoReportedBy,
            date: meta.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            date_bn: meta.date.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', year: 'numeric' }),
            readTime: '5 min read',
            readTime_bn: '৫ মিনিটের পাঠ',
            imageUrl: meta.imageUrl,

            // New V2 Payload entries
            fullText: fullText, // Temporary hold for summarize.js
            summary: "",
            summary_bn: "",

            // Backward compatibility
            content: [
                { type: 'paragraph', text: meta.rawExcerpt }
            ],
            content_bn: [
                { type: 'paragraph', text: meta.rawExcerpt }
            ]
        });
    }

    // Sort by date (newest first)
    processedNewArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Combine with old
    const updatedDatabase = [...processedNewArticles, ...existingArticles];

    // 60/40 Enforced Trimming Strategy
    const southAsiaArticles = updatedDatabase.filter(a => ['Bangladesh', 'India', 'Pakistan'].includes(a.region));
    const globalArticles = updatedDatabase.filter(a => !['Bangladesh', 'India', 'Pakistan'].includes(a.region));

    // Target total: ~200 articles. 60% South Asia (120), 40% Global (80)
    const southAsiaTrimmed = southAsiaArticles.slice(0, 120);
    const globalTrimmed = globalArticles.slice(0, 80);

    const trimmedDatabase = [...southAsiaTrimmed, ...globalTrimmed];
    trimmedDatabase.sort((a, b) => new Date(b.date) - new Date(a.date));

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(trimmedDatabase, null, 2));
    console.log(`Successfully saved ${trimmedDatabase.length} articles to database (South Asia: ${southAsiaTrimmed.length}, Global: ${globalTrimmed.length}).`);
}

aggregateAll();

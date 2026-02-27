const Parser = require('rss-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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

// Ensure public/data directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Target Sources
const SOURCES = {
    Verge: { url: 'https://www.theverge.com/rss/index.xml', category: 'Technology' },
    TechCrunch: { url: 'https://techcrunch.com/feed/', category: 'Startups' },
    ArsTechnica: { url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'Hardware' }
};

// Fallback images based on category since RSS feeds often omit them
const FALLBACK_IMAGES = {
    'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
    'Startups': 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80',
    'Hardware': 'https://images.unsplash.com/photo-1517077304055-6e89abf098fa?auto=format&fit=crop&q=80'
}

// Strips HTML tags from RSS summaries to get raw text
const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').trim().substring(0, 200) + '...';
};

// Find an image url from standard RSS properties
const extractImage = (item, sourceName) => {
    // 1. Try typical media fields
    if (item.thumbnail && item.thumbnail.$ && item.thumbnail.$.url) return item.thumbnail.$.url;
    if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) return item.mediaContent.$.url;

    // 2. Try scraping the content description for an img tag
    const content = item.contentEncoded || item.content || item.description || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) return imgMatch[1];

    return FALLBACK_IMAGES[SOURCES[sourceName].category];
}

async function fetchHackerNews() {
    console.log('Fetching Hacker News Top Stories...');
    try {
        const topStoriesRes = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        const topIds = topStoriesRes.data.slice(0, 15); // Get top 15 to prevent overload

        const articles = [];
        for (const id of topIds) {
            const storyRes = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            const story = storyRes.data;
            if (story && story.url) {
                articles.push({
                    id: `hn-${story.id}`,
                    source: 'Hacker News',
                    category: 'Development',
                    title: story.title,
                    title_bn: story.title, // Will be translated in next pass
                    excerpt: `Hacker News Top Story with ${story.score} points by ${story.by}.`,
                    excerpt_bn: `লক করা হ্যাকার নিউজ শীর্ষ গল্প: ${story.score} পয়েন্ট।`,
                    url: story.url,
                    author: story.by,
                    author_bn: story.by,
                    authorBio: 'Hacker News Contributor',
                    date: new Date(story.time * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    date_bn: new Date(story.time * 1000).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', year: 'numeric' }),
                    readTime: '3 min read',
                    readTime_bn: '৩ মিনিটের পাঠ',
                    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80',
                    content: [
                        { type: 'lead', text: 'This story was aggregated automatically from Hacker News.' },
                        { type: 'paragraph', text: `You can read the full discussion and article on the original source using the link below.` }
                    ],
                    content_bn: [
                        { type: 'lead', text: 'This story was aggregated automatically from Hacker News.' },
                        { type: 'paragraph', text: `You can read the full discussion and article on the original source using the link below.` }
                    ]
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
    let allArticles = [];

    for (const [sourceName, details] of Object.entries(SOURCES)) {
        console.log(`Fetching RSS from ${sourceName}...`);
        try {
            const feed = await parser.parseURL(details.url);

            // Limit to latest 15 per source
            const limit = Math.min(feed.items.length, 15);

            for (let i = 0; i < limit; i++) {
                const item = feed.items[i];

                const publishedDate = item.pubDate ? new Date(item.pubDate) : new Date();
                const formattedDate = publishedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const cleanExcerpt = stripHtml(item.contentSnippet || item.content || item.description);

                allArticles.push({
                    id: uuidv4(),
                    source: sourceName,
                    category: details.category,
                    title: item.title,
                    title_bn: item.title, // Placeholder for translation pass
                    excerpt: cleanExcerpt,
                    excerpt_bn: cleanExcerpt, // Placeholder
                    url: item.link,
                    author: item.creator || item.author || `${sourceName} Staff`,
                    author_bn: item.creator || item.author || `${sourceName} Staff`,
                    authorBio: `Tech Journalist at ${sourceName}`,
                    date: formattedDate,
                    date_bn: formattedDate,
                    readTime: '5 min read',
                    readTime_bn: '৫ মিনিটের পাঠ',
                    imageUrl: extractImage(item, sourceName),
                    content: [
                        { type: 'lead', text: `This story was aggregated automatically from ${sourceName}.` },
                        { type: 'paragraph', text: cleanExcerpt },
                        { type: 'paragraph', text: `You can read the full discussion and article on the original source using the link below.` }
                    ],
                    content_bn: [
                        { type: 'lead', text: `${sourceName} থেকে অটোমেটিক এগ্রিগেট করা হয়েছে।` },
                        { type: 'paragraph', text: cleanExcerpt },
                        { type: 'paragraph', text: 'পুরো খবরটি পড়তে মূল সোর্সের লিঙ্কে ক্লিক করুন।' }
                    ]
                });
            }
        } catch (error) {
            console.error(`Error fetching ${sourceName}:`, error.message);
        }
    }

    return allArticles;
}

// Master Aggregator Function
async function aggregateAll() {
    console.log('--- Starting TechPulse Aggregation ---');

    let existingArticles = [];
    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            existingArticles = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
        } catch (e) {
            console.error('Existing database corrupted, starting fresh.');
        }
    }

    const rssArticles = await fetchRssFeeds();
    const hnArticles = await fetchHackerNews();

    const newArticles = [...rssArticles, ...hnArticles];

    // Deduplication logic: Check if URL already exists in our DB
    const urlsInDb = new Set(existingArticles.map(a => a.url));
    const uniqueNewArticles = newArticles.filter(article => !urlsInDb.has(article.url));

    console.log(`Found ${uniqueNewArticles.length} brand new articles.`);

    // Merge databases: Most recent at top
    const updatedDatabase = [...uniqueNewArticles, ...existingArticles];

    // Trim size to prevent infinite ballooning. Keep the most recent 150 articles.
    const trimmedDatabase = updatedDatabase.slice(0, 150);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(trimmedDatabase, null, 2));
    console.log(`Successfully saved ${trimmedDatabase.length} articles to database.`);
}

aggregateAll();

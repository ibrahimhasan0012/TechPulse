import { translate } from '@vitalets/google-translate-api';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'articles.json');

// Delay helper to prevent aggressive rate limiting blocks
const delay = ms => new Promise(res => setTimeout(res, ms));

async function translateText(text) {
    if (!text) return '';
    try {
        const res = await translate(text, { to: 'bn' });
        return res.text;
    } catch (e) {
        console.error(`Translation Error for "${text.substring(0, 20)}...":`, e.message);
        return text; // Fallback to English on error
    }
}

async function runTranslations() {
    console.log('--- Starting Bengali Translation Pass ---');

    if (!fs.existsSync(OUTPUT_FILE)) {
        console.log('No articles.json found. Please run fetchArticles.js first.');
        return;
    }

    let articles = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    let changesMade = false;

    for (let i = 0; i < articles.length; i++) {
        let article = articles[i];

        // We hijack the title_bn as a flag. If it's identical to the English 'title'
        // it signifies it hasn't been translated yet by the fetch script.
        if (article.title === article.title_bn || (article.summary && article.summary === article.summary_bn)) {
            console.log(`Translating Article [${i + 1}/${articles.length}]: ${article.title.substring(0, 30)}...`);

            if (article.title === article.title_bn) {
                article.title_bn = await translateText(article.title);
                article.excerpt_bn = await translateText(article.excerpt);
            }

            if (article.summary && article.summary !== article.summary_bn) {
                article.summary_bn = await translateText(article.summary);
            }

            changesMade = true;

            // Wait 2.5 seconds between translations to avoid Google's IP soft-ban
            await delay(2500);
        }
    }

    if (changesMade) {
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
        console.log('Translate pass complete. Database updated.');
    } else {
        console.log('All articles are already translated up-to-date.');
    }
}

runTranslations();

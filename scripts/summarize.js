import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'articles.json');

let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 5) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function summarizeArticles() {
    console.log('--- Starting AI Summarization Pass ---');
    if (!fs.existsSync(OUTPUT_FILE)) {
        console.error('No articles database found!');
        return;
    }

    let articles = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    let updatedCount = 0;

    for (let i = 0; i < articles.length; i++) {
        let article = articles[i];

        if (article.paragraph1 || article.summary || (!article.fullText && !article.excerpt)) {
            // Cleanup memory if returning to an older article
            delete article.fullText;
            continue;
        }

        console.log(`Summarizing: ${article.title.substring(0, 40)}...`);

        try {
            if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.length < 5) {
                // Do nothing. Leaving article.summary empty will force the frontend
                // to gracefully render the standard fallback reading components.
                console.log(`Skipping AI summarization for ${article.title.substring(0, 20)}... (No API Key)`);
            } else {
                const textToSummarize = article.fullText && article.fullText.trim().length > 100
                    ? article.fullText.substring(0, 8000)
                    : article.excerpt;

                const response = await openai.chat.completions.create({
                    model: "gpt-4o-mini", // Using fast mini model for CI/CD speed
                    response_format: { type: "json_object" },
                    messages: [
                        {
                            role: "system",
                            content: `You are an expert technology journalist focusing on the South Asian market (Bangladesh, India, Pakistan). 
Paraphrase the provided article in your own words. Maintain a professional tone. Highlight relevance to South Asian readers, and convert any mentioned pricing to local currencies (BDT, INR, PKR). Do not include introductory phrases like 'This article discusses'; present it as original reporting.

You MUST provide your response strictly as a JSON object with the following structure:
{
  "paragraph1": "Introduction & main news (3-4 sentences)",
  "paragraph2": "Details & specifications (3-5 sentences)",
  "paragraph3": "Context/impact (Optional, can be empty string)"
}`
                        },
                        { role: "user", content: textToSummarize }
                    ],
                    max_tokens: 800,
                    temperature: 0.5
                });

                const parsed = JSON.parse(response.choices[0].message.content.trim());
                article.paragraph1 = parsed.paragraph1 || '';
                article.paragraph2 = parsed.paragraph2 || '';
                if (parsed.paragraph3) article.paragraph3 = parsed.paragraph3;

                // Clear old summary if it exists
                if (article.summary) delete article.summary;

                // Sleep specifically to avoid free-tier OpenAI Rate Limiting 
                await delay(2000);
            }
            updatedCount++;
        } catch (error) {
            console.error(`Failed to summarize: ${article.title} - ${error.message}`);
            article.paragraph1 = article.excerpt;
            article.paragraph2 = '';
        }

        // Clean up fullText
        delete article.fullText;
    }

    if (updatedCount > 0) {
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
        console.log(`Successfully summarized ${updatedCount} incoming articles.`);
    } else {
        console.log('No new articles required summarization.');
    }
}

summarizeArticles();

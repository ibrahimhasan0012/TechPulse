const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json({ limit: '10mb' })); // Support large HTML blobs

let browserInstance = null;

async function getBrowser() {
    if (!browserInstance) {
        browserInstance = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }
    return browserInstance;
}

app.get('/', (req, res) => {
    res.send('Screenshot service is running! Send a POST request with HTML to /screenshot.');
});

app.post('/screenshot', async (req, res) => {
    try {
        const { html, width = 1080, height = 1080 } = req.body;

        if (!html) {
            return res.status(400).send({ error: 'Missing html parameter' });
        }

        const browser = await getBrowser();
        const page = await browser.newPage();

        await page.setViewport({ width, height });
        await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

        const screenshotBuffer = await page.screenshot({ type: 'png' });

        await page.close();

        res.set('Content-Type', 'image/png');
        res.send(screenshotBuffer);
    } catch (e) {
        console.error('Screenshot failed:', e);
        res.status(500).send({ error: e.toString() });
    }
});

app.post('/scrape', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).send({ error: 'Missing url parameter' });
        }

        const browser = await getBrowser();
        const page = await browser.newPage();

        // Emulate a standard browser
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        const html = await page.content();
        await page.close();

        res.set('Content-Type', 'text/html');
        res.send(html);
    } catch (e) {
        console.error('Scrape failed:', e);
        res.status(500).send({ error: e.toString() });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Screenshot service listening on port ${PORT}`);
});

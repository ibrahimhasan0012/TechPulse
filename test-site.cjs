const puppeteer = require('puppeteer');

(async () => {
    console.log('Starting puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

    console.log('Navigating to http://localhost:3550/TechPulse/ ...');
    await page.goto('http://localhost:3550/TechPulse/', { waitUntil: 'networkidle0' });

    console.log('Navigating to http://localhost:3550/TechPulse/article/samsung-galaxy-s26-ultra ...');
    await page.goto('http://localhost:3550/TechPulse/article/samsung-galaxy-s26-ultra', { waitUntil: 'networkidle0' });

    await browser.close();
    console.log('Done.');
})();

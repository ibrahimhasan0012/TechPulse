import fs from 'fs';
const html = fs.readFileSync('gadstyle-puppeteer.html', 'utf8');

const pIndex = html.indexOf('product-grid-item');
if (pIndex !== -1) {
    const chunk = html.substring(Math.max(0, pIndex - 500), pIndex + 5000);
    const linkRegex = /href="([^"]+)"/g;
    let match;
    const links = new Set();
    while ((match = linkRegex.exec(chunk)) !== null) {
        if (!match[1].endsWith('.css') && !match[1].endsWith('.js') && match[1].includes('gadstyle.com')) {
            links.add(match[1]);
        }
    }
    console.log(Array.from(links));
} else {
    console.log("No product grid item found.");
}

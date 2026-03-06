import fs from 'fs';
const html = fs.readFileSync('gadstyle-puppeteer.html', 'utf8');

const products = [];
// Find all links to products
const linkRegex = /<a [^>]*href="(https:\/\/(?:www\.)?gadstyle\.com\/product\/[^"]+)"[^>]*>/gi;
let match;
const urls = new Set();
const blocks = [];

while ((match = linkRegex.exec(html)) !== null) {
    if (!urls.has(match[1])) {
        urls.add(match[1]);
        // Extract a 3000-character chunk around the link to parse the rest
        const pIndex = match.index;
        blocks.push({
            url: match[1],
            chunk: html.substring(Math.max(0, pIndex - 500), pIndex + 2500)
        });
    }
}

console.log(`Found ${urls.size} unique product urls`);

for (const block of blocks.slice(0, 3)) {
    const chunk = block.chunk;

    let nameMatch = chunk.match(/<h3 class="wd-entities-title"><a[^>]*>([\s\S]*?)<\/a><\/h3>/);

    let priceMatch = chunk.match(/<ins>[\s\S]*?<bdi>([^<]+)/);
    if (!priceMatch) {
        priceMatch = chunk.match(/<span class="price">[\s\S]*?<bdi>([^<]+)/);
    }

    let imgMatch = chunk.match(/<img[^>]*src="([^"]+)"/);
    let dataImgMatch = chunk.match(/<img[^>]*data-src="([^"]+)"/);

    products.push({
        url: block.url,
        name: nameMatch ? nameMatch[1].replace(/<[^>]*>?/gm, '').trim() : 'N/A',
        price: priceMatch ? priceMatch[1].trim() + ' ৳' : 'N/A',
        image: dataImgMatch ? dataImgMatch[1] : (imgMatch ? imgMatch[1] : 'N/A')
    });
}

console.log(JSON.stringify(products, null, 2));

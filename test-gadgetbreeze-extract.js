import fs from 'fs';
const html = fs.readFileSync('gadgetbreeze-cat.html', 'utf8');

const products = [];
// Split by product wrapper start
const chunks = html.split(/<div class="[^"]*product-grid-item/gi);

// Skip first chunk
for (let i = 1; i < chunks.length; i++) {
    const block = chunks[i];

    let urlMatch = block.match(/href="(https:\/\/gadgetbreeze\.com\.bd\/product\/[^"]+)"/);
    let nameMatch = block.match(/<h3 class="wd-entities-title"><a[^>]*>(.*?)<\/a><\/h3>/);
    let priceMatch = block.match(/<ins>[\s\S]*?<bdi>([^<]+)/);
    if (!priceMatch) {
        priceMatch = block.match(/<span class="price">[\s\S]*?<bdi>([^<]+)/);
    }
    let imgMatch = block.match(/<img[^>]*src="([^"]+)"/);

    if (urlMatch && nameMatch) {
        products.push({
            url: urlMatch[1],
            name: nameMatch[1].replace(/<[^>]*>?/gm, '').trim(),
            price: priceMatch ? priceMatch[1].trim() + ' ৳' : 'N/A',
            image: imgMatch ? imgMatch[1] : ''
        });
    }
}

console.log(`Found ${products.length} products`);
console.log(JSON.stringify(products.slice(0, 3), null, 2));

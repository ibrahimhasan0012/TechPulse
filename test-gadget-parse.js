import fs from 'fs';
const html = fs.readFileSync('gadget-cat.html', 'utf8');

const productWrappers = html.match(/<div[^>]*class="[^"]*product-grid-item[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/ig);
if (productWrappers && productWrappers.length > 0) {
    console.log("Found product wrappers length: ", productWrappers.length);
    console.log("Wrapper 0:", productWrappers[0]);
} else {
    const linkMatches = html.match(/href="(https:\/\/gadgethousesbd\.com\/product\/[^"]+)"/g);
    if (linkMatches) {
        console.log("Found product links: ", linkMatches.length);
        console.log("First few links:", linkMatches.slice(0, 10));
    }
}

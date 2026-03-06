import fs from 'fs';
const html = fs.readFileSync('gadstyle-puppeteer.html', 'utf8');

const pIndex = html.indexOf('product-grid-item');
if (pIndex !== -1) {
    console.log("Wrapper:");
    console.log(html.substring(Math.max(0, pIndex - 100), pIndex + 1500));
} else {
    console.log("Not found 'product-grid-item'");
    const pIndex2 = html.indexOf('class="product');
    console.log(html.substring(Math.max(0, pIndex2 - 100), pIndex2 + 1500));
}

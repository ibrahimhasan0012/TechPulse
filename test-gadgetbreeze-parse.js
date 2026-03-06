import fs from 'fs';
const html = fs.readFileSync('gadgetbreeze-cat.html', 'utf8');

const pIndex = html.indexOf('product-grid-item');
if (pIndex !== -1) {
    console.log("Wrapper chunk:");
    console.log(html.substring(Math.max(0, pIndex - 50), pIndex + 1500));
} else {
    console.log("Not found 'product-grid-item'");
}

import fs from 'fs';
fetch('https://gadgethousesbd.com/shop/')
    .then(res => {
        console.log("Status Code:", res.status);
        return res.text();
    })
    .then(html => {
        fs.writeFileSync('gadget-cat.html', html);
        const productWrappers = html.match(/<div[^>]*class="[^"]*product-grid-item[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/ig);
        console.log("Found products:", productWrappers ? productWrappers.length : 0);
    })
    .catch(err => console.error(err));

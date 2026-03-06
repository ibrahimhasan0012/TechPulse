import fs from 'fs';
fetch('https://gadgethousesbd.com/product/soundcore-aerofit-2-adjustable-open-ear-wireless-earbuds/')
    .then(res => res.text())
    .then(html => {
        fs.writeFileSync('gadget-product.html', html);

        // Test extracting description
        // Usually woo-commerce puts data in a div with id "tab-description" or class "woocommerce-Tabs-panel--description"
        let descMatch = html.match(/<div class="[^"]*woocommerce-Tabs-panel--description[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i);

        // If not, maybe we can just grab from a short description
        let shortDescMatch = html.match(/<div class="[^"]*woocommerce-product-details__short-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i);

        if (shortDescMatch) {
            console.log("Short Description Length: ", shortDescMatch[1].length);
            console.log(shortDescMatch[1].substring(0, 500).replace(/<[^>]*>?/gm, '').trim());
        } else if (descMatch) {
            console.log("Long Description Length: ", descMatch[1].length);
            console.log(descMatch[1].substring(0, 500).replace(/<[^>]*>?/gm, '').trim());
        } else {
            console.log("No description found. Try grep manual search.");
            const pIndex = html.indexOf('description');
            console.log("Found description keyword at index:", pIndex);
            console.log(html.substring(Math.max(0, pIndex - 200), pIndex + 500));
        }
    })
    .catch(err => console.error(err));

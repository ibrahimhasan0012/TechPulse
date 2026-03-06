import fs from 'fs';
fetch('https://gadgetbreeze.com.bd/product/qualitell-c4-electric-mosquito-swatter/')
    .then(res => res.text())
    .then(html => {
        fs.writeFileSync('gadgetbreeze-product.html', html);

        // Test extracting description (Woodmart usually puts it in woocommerce-Tabs-panel--description)
        let descMatch = html.match(/<div class="[^"]*woocommerce-Tabs-panel--description[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);

        // Fallback to short description
        let shortDescMatch = html.match(/<div class="[^"]*woocommerce-product-details__short-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i);

        if (shortDescMatch) {
            console.log("Short Description Length: ", shortDescMatch[1].length);
            console.log(shortDescMatch[1].substring(0, 500).replace(/<[^>]*>?/gm, '').trim());
        } else if (descMatch) {
            console.log("Long Description Length: ", descMatch[1].length);
            console.log(descMatch[1].substring(0, 500).replace(/<[^>]*>?/gm, '').trim());
        } else {
            console.log("No description found.");
        }
    })
    .catch(err => console.error(err));

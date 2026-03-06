import fs from 'fs';
fetch('https://gadgetbreeze.com.bd/shop/')
    .then(res => res.text())
    .then(html => {
        fs.writeFileSync('gadgetbreeze-cat.html', html);
        console.log("Saved Gadget Breeze HTML to gadgetbreeze-cat.html. Length:", html.length);
    })
    .catch(err => console.error(err));

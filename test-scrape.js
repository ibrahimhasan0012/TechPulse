import fs from 'fs';
fetch('https://www.applegadgetsbd.com/category/gadgets-and-accessories')
    .then(res => res.text())
    .then(html => {
        fs.writeFileSync('applegadgets.html', html);
        console.log("Saved to applegadgets.html");
    });

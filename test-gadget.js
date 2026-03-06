import fs from 'fs';
fetch('https://gadgethousesbd.com/')
    .then(res => res.text())
    .then(html => {
        fs.writeFileSync('gadget-test.html', html);
        console.log("Saved Gadget Houses HTML to gadget-test.html. Length:", html.length);
    })
    .catch(err => console.error(err));

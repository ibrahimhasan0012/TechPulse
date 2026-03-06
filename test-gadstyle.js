import fs from 'fs';
fetch('https://www.gadstyle.com/new-arrivals/')
    .then(res => res.text())
    .then(html => {
        fs.writeFileSync('gadstyle-cat.html', html);
        console.log("Saved Gadstyle HTML to gadstyle-cat.html. Length:", html.length);
    })
    .catch(err => console.error(err));

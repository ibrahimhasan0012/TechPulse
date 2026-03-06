import fs from 'fs';
fetch('http://localhost:3000/scrape', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        url: 'https://www.gadstyle.com/new-arrivals/'
    })
})
    .then(res => res.text())
    .then(html => {
        fs.writeFileSync('gadstyle-puppeteer.html', html);
        const bodyIndex = html.indexOf('<body');
        if (bodyIndex !== -1) {
            console.log(html.substring(bodyIndex, bodyIndex + 500));
        } else {
            console.log("Response starts with:", html.substring(0, 500));
        }
        console.log("Total Length:", html.length);
    })
    .catch(err => console.error(err));

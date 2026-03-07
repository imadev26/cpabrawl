const https = require('https');
const fs = require('fs');
const path = require('path');

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        console.log(`Downloading ${url} to ${dest}...`);
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                // Follow redirect
                const newUrl = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
                return download(newUrl, dest).then(resolve).catch(reject);
            }

            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
            }

            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => { file.close(resolve); });
        }).on('error', (err) => { fs.unlink(dest, () => reject(err)); });
    });
};

const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Brawl_Stars_logo.png/800px-Brawl_Stars_logo.png';
// Using a reliable alternative gem image URL that doesn't block hotlinking as much
const gemUrl = 'https://www.freeiconspng.com/uploads/brawl-stars-gems-png-2.png';
const gemUrlAlternative = 'https://cdn.iconscout.com/icon/premium/png-256-thumb/emerald-gem-1-583486.png'; // Fallback if needed

Promise.all([
    download(logoUrl, path.join(__dirname, 'public', 'logo.png')),
    download('https://static.wikia.nocookie.net/brawlstars/images/0/07/Gem.png', path.join(__dirname, 'public', 'gem.png')).catch(() => {
        console.log("Wikia failed, trying freeiconspng...");
        return download('https://cdn3.iconfinder.com/data/icons/fantasy-and-role-play-game-adventure-quest/512/Gem-512.png', path.join(__dirname, 'public', 'gem.png'));
    })
]).then(() => console.log('Downloaded all assets successfully!'))
    .catch(console.error);

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
// Fix regex to match existing ?v= query strings
html = html.replace(/src="js\/([a-zA-Z0-9_]+)\.js(\?v=\d+)?"/g, 'src="js/$1.js?v=' + Date.now() + '"');
fs.writeFileSync('index.html', html);
console.log('Cache-busted index.html scripts properly');

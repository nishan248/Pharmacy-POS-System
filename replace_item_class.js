const fs = require('fs');

// 1. Replace in index.html
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/>Item Class</g, '>Drug Class<');
html = html.replace(/Item Classes/g, 'Drug Classes'); // Just in case
html = html.replace(/id="card-item-class"/g, 'id="card-drug-class"'); // update ID just to be safe, but wait, if I update ID, I need to update JS. Let's just keep the ID as is, or replace it carefully.
// actually, I'll just do text replacement first to avoid breaking JS unnecessarily, or if I change JS I must be consistent.
fs.writeFileSync('index.html', html);

// 2. Replace in master.js
let js = fs.readFileSync('js/master.js', 'utf8');
js = js.replace(/item_classes: 'Item Class'/g, "item_classes: 'Drug Class'");
fs.writeFileSync('js/master.js', js);

console.log('Replaced Item Class with Drug Class.');

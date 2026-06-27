const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

const inv = lines.findIndex(l => l.includes('<section id="inventory"'));
let invEnd = -1;
let open = 0;
for (let i = inv; i < lines.length; i++) {
    if (lines[i].includes('<section')) open++;
    if (lines[i].includes('</section>')) open--;
    if (open === 0 && i >= inv) {
        invEnd = i;
        break;
    }
}

const usr = lines.findIndex(l => l.includes('<section id="users"'));
let usrEnd = -1;
open = 0;
for (let i = usr; i < lines.length; i++) {
    if (lines[i].includes('<section')) open++;
    if (lines[i].includes('</section>')) open--;
    if (open === 0 && i >= usr) {
        usrEnd = i;
        break;
    }
}

console.log('Inventory:', inv + 1, 'to', invEnd + 1, 'Users:', usr + 1, 'to', usrEnd + 1);

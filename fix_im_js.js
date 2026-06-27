const fs = require('fs');
let content = fs.readFileSync('js/master.js', 'utf8');

// Remove from loadInventory
content = content.replace("document.getElementById('im-generic-name').value = '';", "");
content = content.replace("document.getElementById('im-brand-name').value = '';", "");

// Remove from selectItemMasterDrug
content = content.replace("document.getElementById('im-generic-name').value = drug.genericName || '';", "");
content = content.replace("document.getElementById('im-brand-name').value = drug.brandName || '';", "");

fs.writeFileSync('js/master.js', content);
console.log('Fixed master.js missing element references.');

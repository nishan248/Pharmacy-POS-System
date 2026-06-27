const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace("openModal('modal-add-item')", "openModal('modal-add-drug'); document.getElementById('form-add-drug').reset(); document.getElementById('drug-id').value = ''; document.getElementById('modal-drug-title').innerText = 'Add New Drug Profile';");

fs.writeFileSync('index.html', html);
console.log('Fixed Add New Item button.');

const fs = require('fs');
let js = fs.readFileSync('js/purchases.js', 'utf8');

const oldGRNLogic = `    supSelect.innerHTML = '<option value="">Select Supplier</option>';
    suppliers.forEach(s => {
        supSelect.innerHTML += \`<option value="\${s.id}">\${s.name}</option>\`;
    });`;

const newGRNLogic = `    supSelect.innerHTML = '<option value="">Select Supplier</option>';
    if (suppliers.length === 0) {
        supSelect.innerHTML += '<option value="" disabled>No suppliers found. Add in Suppliers tab.</option>';
    } else {
        suppliers.forEach(s => {
            supSelect.innerHTML += \`<option value="\${s.id}">\${s.name}</option>\`;
        });
    }`;

js = js.replace(oldGRNLogic, newGRNLogic);
fs.writeFileSync('js/purchases.js', js);
console.log('Fixed GRN supplier dropdown');

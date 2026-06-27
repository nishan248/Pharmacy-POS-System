const fs = require('fs');

let js = fs.readFileSync('js/purchases.js', 'utf8');

const oldLogic = `window.loadSuppliersSelect = async (elementId) => {
    const suppliers = await db.suppliers.toArray();
    const select = document.getElementById(elementId);
    if (!select) return;
    select.innerHTML = '<option value="">Select Supplier</option>';
    suppliers.forEach(s => {
        select.innerHTML += \`<option value="\${s.id}">\${s.name}</option>\`;
    });
};`;

const newLogic = `window.loadSuppliersSelect = async (elementId) => {
    try {
        const suppliers = await db.suppliers.toArray();
        const select = document.getElementById(elementId);
        if (!select) return;
        select.innerHTML = '<option value="">Select Supplier</option>';
        if (suppliers.length === 0) {
            select.innerHTML += '<option value="" disabled>No suppliers found. Add in Suppliers tab.</option>';
        } else {
            suppliers.forEach(s => {
                select.innerHTML += \`<option value="\${s.id}">\${s.name}</option>\`;
            });
        }
    } catch (e) {
        console.error("Error loading suppliers:", e);
    }
};`;

js = js.replace(oldLogic, newLogic);
fs.writeFileSync('js/purchases.js', js);
console.log('Fixed loadSuppliersSelect');

const fs = require('fs');

const replacement = `window.loadGeneralConfig = () => {
    document.getElementById('gen-filter-type').value = '';
    document.getElementById('gen-filter-item').innerHTML = '<option value="">-- Choose Type First --</option>';
    document.getElementById('gen-drugs-tbody').innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">Select a type and item to view associated drugs.</td></tr>';
    document.getElementById('btn-add-gen-item').disabled = true;
    document.getElementById('btn-del-gen-item').disabled = true;
    document.getElementById('gen-filter-count').innerText = '0 items found';
};

window.onGenFilterTypeChange = async () => {
    const type = document.getElementById('gen-filter-type').value;
    const itemSelect = document.getElementById('gen-filter-item');
    const btnAdd = document.getElementById('btn-add-gen-item');
    const btnDel = document.getElementById('btn-del-gen-item');
    
    if (!type) {
        itemSelect.innerHTML = '<option value="">-- Choose Type First --</option>';
        btnAdd.disabled = true;
        btnDel.disabled = true;
        return;
    }
    
    btnAdd.disabled = false;
    btnDel.disabled = false;
    
    try {
        const items = await db[type].toArray();
        itemSelect.innerHTML = '<option value="">-- Select an Option --</option>' + 
            items.map(i => \`<option value="\${i.name}">\${i.name}</option>\`).join('');
            
        onGenFilterItemChange();
    } catch(e) {
        showToast('Error loading items: ' + e.message, 'error');
    }
};

window.onGenFilterItemChange = async () => {
    const type = document.getElementById('gen-filter-type').value;
    const itemSelect = document.getElementById('gen-filter-item');
    const selectedName = itemSelect.value;
    const tbody = document.getElementById('gen-drugs-tbody');
    const countSpan = document.getElementById('gen-filter-count');
    
    if (!type || !selectedName) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">Select a type and item to view associated drugs.</td></tr>';
        countSpan.innerText = '0 items found';
        return;
    }
    
    try {
        let drugs = [];
        
        if (type === 'suppliers') {
            const supplier = await db.suppliers.where('name').equals(selectedName).first();
            if (supplier) {
                const batches = await db.batches.where('supplierId').equals(supplier.id).toArray();
                const drugIds = [...new Set(batches.map(b => b.drugId))];
                drugs = await db.drugs.where('id').anyOf(drugIds).toArray();
            }
        } else {
            const allDrugs = await db.drugs.toArray();
            let propName = '';
            if (type === 'categories' || type === 'subcategories') propName = 'category';
            else if (type === 'generics') propName = 'genericName';
            else if (type === 'brands') propName = 'brandName';
            else if (type === 'manufacturers') propName = 'manufacturer';
            else if (type === 'item_classes') propName = 'itemClass';
            
            drugs = allDrugs.filter(d => d[propName] === selectedName);
        }
        
        if (drugs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">No drugs found matching this criteria.</td></tr>';
        } else {
            tbody.innerHTML = drugs.map(d => \`
                <tr class="hover:bg-gray-50">
                    <td class="p-4 font-medium">\${d.brandName || '-'}</td>
                    <td class="p-4">\${d.genericName || '-'} <br><span class="text-xs text-gray-400">\${d.itemClass || ''}</span></td>
                    <td class="p-4">\${d.category || '-'}</td>
                    <td class="p-4">\${d.manufacturer || '-'}</td>
                    <td class="p-4 text-center"><button onclick="openDrugProfile(\${d.id})" class="text-blue-500 hover:underline">View</button></td>
                </tr>
            \`).join('');
        }
        countSpan.innerText = \`\${drugs.length} items found\`;
        
    } catch(e) {
        showToast('Error filtering: ' + e.message, 'error');
    }
};

window.promptAddNewGenItem = async () => {
    const type = document.getElementById('gen-filter-type').value;
    if (!type) return;
    
    const typeNames = {
        categories: 'Category', subcategories: 'Sub-Category', generics: 'Generic Name',
        brands: 'Brand Name', manufacturers: 'Manufacturer', item_classes: 'Item Class',
        suppliers: 'Supplier'
    };
    
    const name = prompt(\`Enter new \${typeNames[type]}:\`);
    if (!name || !name.trim()) return;
    
    try {
        if (type === 'suppliers') {
            await db.suppliers.add({ name: name.trim() });
        } else {
            await db[type].add({ name: name.trim() });
        }
        showToast(\`Added new \${typeNames[type]}\`, 'success');
        onGenFilterTypeChange();
    } catch(e) {
        showToast('Error adding: ' + e.message, 'error');
    }
};

window.deleteSelectedGenItem = async () => {
    const type = document.getElementById('gen-filter-type').value;
    const selectedName = document.getElementById('gen-filter-item').value;
    
    if (!type || !selectedName) return;
    
    const countText = document.getElementById('gen-filter-count').innerText;
    const count = parseInt(countText);
    if (count > 0) {
        return showToast('Cannot delete this item because there are drugs associated with it.', 'error');
    }
    
    if (!confirm(\`Are you sure you want to delete "\${selectedName}"?\`)) return;
    
    try {
        let item;
        if (type === 'suppliers') {
             item = await db.suppliers.where('name').equals(selectedName).first();
        } else {
             const items = await db[type].toArray();
             item = items.find(i => i.name === selectedName);
        }
        if (item) {
            await db[type].delete(item.id);
            showToast('Deleted successfully', 'success');
            onGenFilterTypeChange();
        }
    } catch(e) {
        showToast('Error deleting: ' + e.message, 'error');
    }
};`;

let lines = fs.readFileSync('js/master.js', 'utf8').split('\n');

const startIdx = 2; // window.loadGeneralConfig
const endIdx = 161; // window.loadSupplierItems

lines.splice(startIdx, endIdx - startIdx + 1, replacement);

fs.writeFileSync('js/master.js', lines.join('\n'));
console.log('Replaced master.js logic successfully.');

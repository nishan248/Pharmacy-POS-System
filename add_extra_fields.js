const fs = require('fs');

// --- 1. Update index.html ---
let html = fs.readFileSync('index.html', 'utf8');

const additionalFieldsHTML = `
                        <div class="col-span-2 md:col-span-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input type="text" id="drug-category" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Antibiotics">
                        </div>
                        <div class="col-span-2 md:col-span-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Item Class</label>
                            <input type="text" id="drug-itemclass" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Fast Moving">
                        </div>
                        <div class="col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                            <input type="text" id="drug-manufacturer" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Pfizer">
                        </div>
                        <div class="col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                            <input type="text" id="drug-supplier" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Supplier Name">
                        </div>
`;

// Insert after drug-generic
html = html.replace(
    /id="drug-generic"[\s\S]*?<\/div>/,
    match => match + '\n' + additionalFieldsHTML
);

fs.writeFileSync('index.html', html);
console.log('Added fields to index.html');


// --- 2. Update inventory.js ---
let js = fs.readFileSync('js/inventory.js', 'utf8');

// Replace saveDrug variables
js = js.replace(
    "const rackLocation = document.getElementById('drug-location').value.trim();",
    `const rackLocation = document.getElementById('drug-location').value.trim();
    const category = document.getElementById('drug-category')?.value.trim() || '';
    const itemClass = document.getElementById('drug-itemclass')?.value.trim() || '';
    const manufacturer = document.getElementById('drug-manufacturer')?.value.trim() || '';
    const supplier = document.getElementById('drug-supplier')?.value.trim() || '';`
);

// Replace saveDrug data
js = js.replace(
    "const drugData = { brandName, genericName, type, dosage, rackLocation, isControlled, isColdChain, mbq };",
    "const drugData = { brandName, genericName, type, dosage, rackLocation, isControlled, isColdChain, mbq, category, itemClass, manufacturer, supplierName: supplier };"
);

// Replace editDrug population
js = js.replace(
    "document.getElementById('drug-location').value = drug.rackLocation || '';",
    `document.getElementById('drug-location').value = drug.rackLocation || '';
        if(document.getElementById('drug-category')) document.getElementById('drug-category').value = drug.category || '';
        if(document.getElementById('drug-itemclass')) document.getElementById('drug-itemclass').value = drug.itemClass || '';
        if(document.getElementById('drug-manufacturer')) document.getElementById('drug-manufacturer').value = drug.manufacturer || '';
        if(document.getElementById('drug-supplier')) document.getElementById('drug-supplier').value = drug.supplierName || '';`
);

fs.writeFileSync('js/inventory.js', js);
console.log('Updated inventory.js');

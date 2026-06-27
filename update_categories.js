const fs = require('fs');

const categories = [
    "Cardiovascular System",
    "Central Nervous System",
    "Respiratory System",
    "Antibiotics",
    "Endocrine",
    "Nutritions",
    "Other"
];

// --- 1. Update index.html (Add Drug Modal) ---
let html = fs.readFileSync('index.html', 'utf8');

const categorySelectHTML = `<select id="drug-category" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                                <option value="">Select Category...</option>
${categories.map(c => `                                <option value="${c}">${c}</option>`).join('\n')}
                            </select>`;

html = html.replace(
    /<input type="text" id="drug-category" class="[^"]*" placeholder="e\.g\. Antibiotics">/,
    categorySelectHTML
);

fs.writeFileSync('index.html', html);
console.log('Updated index.html drug-category to a dropdown.');

// --- 2. Update js/adjustments.js (Stock Adjustments Dropdown) ---
let js = fs.readFileSync('js/adjustments.js', 'utf8');

const newCategoryLogic = `    // Load categories (Hardcoded)
    const categories = ${JSON.stringify(categories, null, 4)};
    const select = document.getElementById('adj-category-select');
    select.innerHTML = '<option value="">Select a Category...</option>' + categories.map(c => \`<option value="\${c}">\${c}</option>\`).join('');`;

// Replace the dynamic loading logic
js = js.replace(
    /    \/\/ Load categories\s+const drugs = await db\.drugs\.toArray\(\);\s+const categories = \[\.\.\.new Set\(drugs\.map\(d => d\.category\)\.filter\(Boolean\)\)\]\.sort\(\);\s+const select = document\.getElementById\('adj-category-select'\);\s+select\.innerHTML = '<option value="">Select a Category\.\.\.<\/option>' \+ categories\.map\(c => `<option value="\$\{c\}">\$\{c\}<\/option>`\)\.join\(''\);/,
    newCategoryLogic
);

fs.writeFileSync('js/adjustments.js', js);
console.log('Updated adjustments.js to use hardcoded categories.');

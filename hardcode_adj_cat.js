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

// --- 1. Update index.html (Stock Adjustment Modal) ---
let html = fs.readFileSync('index.html', 'utf8');

const selectStart = `<select id="adj-category-select" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">`;
const selectEnd = `</select>`;
const newOptions = `\n                                <option value="">Select a Category...</option>\n` + categories.map(c => `                                <option value="${c}">${c}</option>`).join('\n') + `\n                            `;

const regex = /<select id="adj-category-select"[\s\S]*?<\/select>/;
html = html.replace(regex, selectStart + newOptions + selectEnd);

fs.writeFileSync('index.html', html);
console.log('Hardcoded categories into index.html adj-category-select.');

// --- 2. Remove population from adjustments.js ---
let js = fs.readFileSync('js/adjustments.js', 'utf8');

js = js.replace(/    \/\/ Load categories \(Hardcoded\)\s+const categories = \[\s+"Cardiovascular System",\s+"Central Nervous System",\s+"Respiratory System",\s+"Antibiotics",\s+"Endocrine",\s+"Nutritions",\s+"Other"\s+\];\s+const select = document\.getElementById\('adj-category-select'\);\s+select\.innerHTML = '<option value="">Select a Category\.\.\.<\/option>' \+ categories\.map\(c => `<option value="\\\$\\{c\\}">\\\$\\{c\\}<\/option>`\)\.join\(''\);/, '');

fs.writeFileSync('js/adjustments.js', js);
console.log('Removed population logic from adjustments.js.');

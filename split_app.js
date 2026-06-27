const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');

// The format is:
// // ==========================================
// // X. TITLE
// // ==========================================
// CODE

const regex = /\/\/\s*={10,}\s*\n\/\/\s*(.*?)\n\/\/\s*={10,}\s*\n/g;

let match;
let sections = [];
let lastIndex = 0;

while ((match = regex.exec(content)) !== null) {
    if (lastIndex !== match.index) {
        sections[sections.length - 1].code += content.substring(lastIndex, match.index);
    }
    sections.push({
        title: match[1].trim(),
        code: ''
    });
    lastIndex = regex.lastIndex;
}

if (lastIndex < content.length && sections.length > 0) {
    sections[sections.length - 1].code += content.substring(lastIndex);
}

// Ensure the target directory exists
if (!fs.existsSync('js')) {
    fs.mkdirSync('js');
}

// Title to filename mapping
const getFilename = (title) => {
    const t = title.toLowerCase();
    if (t.includes('database')) return 'db.js';
    if (t.includes('state & utils')) return 'utils.js';
    if (t.includes('navigation')) return 'nav.js';
    if (t.includes('modal')) return 'modal.js';
    if (t.includes('inventory') && !t.includes('reports')) return 'inventory.js';
    if (t.includes('pos')) return 'pos.js';
    if (t.includes('dashboard')) return 'dashboard.js';
    if (t.includes('reports')) return 'reports.js';
    if (t.includes('backup')) return 'backup.js';
    if (t.includes('keyboard')) return 'shortcuts.js';
    if (t.includes('supplier')) return 'suppliers.js';
    if (t.includes('customer') || t.includes('prescription')) return 'customers.js';
    if (t.includes('expiry')) return 'expiry.js';
    if (t.includes('stock adjustment')) return 'adjustments.js';
    if (t.includes('bill return')) return 'returns.js';
    if (t.includes('grn & purchases')) return 'purchases.js';
    if (t.includes('auth & user')) return 'auth.js';
    if (t.includes('drug profile')) return 'drug_profile.js';
    if (t.includes('day end closing')) return 'dayend.js';
    
    // Fallback
    return title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() + '.js';
};

// We will map each section to its respective file, or group some together.
const fileMap = {};

sections.forEach(s => {
    let fn = getFilename(s.title);
    if (!fileMap[fn]) fileMap[fn] = [];
    fileMap[fn].push(`\n// --- ${s.title} ---\n` + s.code);
});

// Since the files will be included sequentially, let's just save them.
Object.keys(fileMap).forEach(fn => {
    fs.writeFileSync(`js/${fn}`, fileMap[fn].join('\n'));
    console.log(`Created js/${fn}`);
});

// Create a list of the files so we know the correct order to inject into index.html
// The order should ideally follow the original app.js order to avoid reference errors.
const orderedFiles = [];
const seenFiles = new Set();
sections.forEach(s => {
    let fn = getFilename(s.title);
    if (!seenFiles.has(fn)) {
        orderedFiles.push(fn);
        seenFiles.add(fn);
    }
});

console.log('ORDER:', orderedFiles.join(', '));

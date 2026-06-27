const fs = require('fs');
let dbContent = fs.readFileSync('js/db.js', 'utf8');

// Update version
dbContent = dbContent.replace(/const DB_VERSION = \d+;/, 'const DB_VERSION = 14;');

// Add new table
if (!dbContent.includes('stock_adjustments:')) {
    dbContent = dbContent.replace(
        "suppliers: '++id, name, contact, email, address',",
        "suppliers: '++id, name, contact, email, address',\n        stock_adjustments: '++id, date, status, category, totalVarianceValue',"
    );
}

fs.writeFileSync('js/db.js', dbContent);
console.log('Database updated to v14');

const fs = require('fs');

let db = fs.readFileSync('js/db.js', 'utf8');

const v14 = `
db.version(14).stores({
    stock_adjustments: '++id, date, status, category'
});
`;

if (!db.includes('db.version(14)')) {
    db += v14;
    fs.writeFileSync('js/db.js', db);
    console.log('Appended db version 14');
} else {
    console.log('Version 14 already exists');
}

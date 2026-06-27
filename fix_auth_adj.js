const fs = require('fs');
let auth = fs.readFileSync('js/auth.js', 'utf8');

auth = auth.replace(
    "'Admin': ['dashboard', 'pos', 'master-accounts', 'master-general', 'master-itemmaster', 'master-locations', 'grn', 'reports', 'dayend', 'customers', 'suppliers', 'expiry', 'settings'],",
    "'Admin': ['dashboard', 'pos', 'master-accounts', 'master-general', 'master-itemmaster', 'master-locations', 'grn', 'reports', 'dayend', 'customers', 'suppliers', 'expiry', 'adjustments', 'settings'],"
);

auth = auth.replace(
    "'Pharmacist': ['dashboard', 'master-itemmaster', 'master-general', 'master-locations', 'grn', 'reports', 'dayend', 'suppliers', 'expiry', 'settings']",
    "'Pharmacist': ['dashboard', 'master-itemmaster', 'master-general', 'master-locations', 'grn', 'reports', 'dayend', 'suppliers', 'expiry', 'adjustments', 'settings']"
);

fs.writeFileSync('js/auth.js', auth);
console.log('Fixed role access in auth.js');

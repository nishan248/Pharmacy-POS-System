const fs = require('fs');
let nav = fs.readFileSync('js/nav.js', 'utf8');

// Fix Admin role access
nav = nav.replace("'suppliers', 'expiry', 'settings']", "'suppliers', 'expiry', 'adjustments', 'settings']");
// Fix Pharmacist role access (which also has the same end array)
nav = nav.replace("'suppliers', 'expiry', 'settings']", "'suppliers', 'expiry', 'adjustments', 'settings']");

// Add module trigger
if (!nav.includes("loadAdjustmentsModule")) {
    nav = nav.replace(
        "if(target === 'dashboard') loadDashboard();",
        "if(target === 'dashboard') loadDashboard();\n    if(target === 'adjustments' && typeof loadAdjustmentsModule === 'function') loadAdjustmentsModule();"
    );
}

fs.writeFileSync('js/nav.js', nav);
console.log("Fixed nav.js access and triggers");

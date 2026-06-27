const fs = require('fs');

// --- 1. Fix Modal Overflow ---
let html = fs.readFileSync('index.html', 'utf8');

// Replace modal-add-drug container
html = html.replace(
    '<div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform scale-95 opacity-0 transition-all duration-200 modal-content">',
    '<div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform scale-95 opacity-0 transition-all duration-200 modal-content flex flex-col max-h-[95vh]">'
);

// We need to specifically target the <div class="p-6"> inside modal-add-drug
// Let's use a regex that matches modal-add-drug and the following p-6
html = html.replace(
    /(id="modal-add-drug"[\s\S]*?modal-content flex flex-col max-h-\[95vh\]">[\s\S]*?<\/div>\s*<div class=")p-6(")/,
    '$1p-6 overflow-y-auto custom-scrollbar flex-1$2'
);

fs.writeFileSync('index.html', html);
console.log('Fixed modal-add-drug overflow in index.html');

// --- 2. Fix Global Font Size ---
let css = fs.readFileSync('style.css', 'utf8');
if (!css.includes('html { font-size:')) {
    css += `\n\n/* Global Density Scaling */\nhtml {\n  font-size: 13.5px; /* Condense entire UI */\n}\n`;
    fs.writeFileSync('style.css', css);
    console.log('Scaled global font-size in style.css');
} else {
    console.log('Font size already scaled in style.css');
}

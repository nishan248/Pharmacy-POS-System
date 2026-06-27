const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldModalDiv = '<div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">';
const newModalDiv = '<div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh] transform scale-95 opacity-0 transition-all duration-200 modal-content">';

html = html.replace(oldModalDiv, newModalDiv);

fs.writeFileSync('index.html', html);
console.log('Fixed modal-content class.');

const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Rename the sidebar button
html = html.replace('data-target="adjustments">Audit & Adjustment</button>', 'data-target="adjustments">Stock Adjustment</button>');

// Also update the section title just in case they meant the header
html = html.replace('<h2 class="text-xl font-bold text-gray-800"><i class="fa-solid fa-clipboard-check text-blue-500 mr-2"></i> Physical Stock Audit</h2>', '<h2 class="text-xl font-bold text-gray-800"><i class="fa-solid fa-clipboard-check text-blue-500 mr-2"></i> Stock Adjustment</h2>');

// Also update the button to Start New Audit to Start New Adjustment
html = html.replace('Start New Audit</button>', 'Start New Adjustment</button>');

fs.writeFileSync('index.html', html);
console.log('Renamed Audit & Adjustment to Stock Adjustment in UI.');

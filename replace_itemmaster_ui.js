const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const newItemMasterHTML = `            <section id="master-itemmaster" class="app-section flex-col gap-4 hidden overflow-y-auto" style="height: calc(100vh - 100px);">
                <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h2 class="text-xl font-bold text-gray-800">Item Master</h2>
                    <div class="flex gap-2">
                        <button onclick="openModal('modal-add-item')" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"><i class="fa-solid fa-plus mr-2"></i> Add New Item</button>
                    </div>
                </div>

                <!-- Search Area -->
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-end">
                    <div class="w-48">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Item Code</label>
                        <input type="text" id="im-item-code" class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-600 font-mono" readonly placeholder="---">
                        <input type="hidden" id="im-drug-id">
                    </div>
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
                        <input type="text" id="im-generic-name" class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-600" readonly placeholder="---">
                    </div>
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                        <input type="text" id="im-brand-name" class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-600 font-bold" readonly placeholder="---">
                    </div>
                    <div>
                        <button onclick="openItemSearchModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm h-10"><i class="fa-solid fa-magnifying-glass mr-2"></i> Browse</button>
                    </div>
                </div>

                <!-- Detail ID Card Area (Hidden by default until item is loaded) -->
                <div id="im-details-area" class="hidden flex-col gap-6">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="p-6 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100 flex justify-between items-start">
                            <div>
                                <h1 class="text-3xl font-black text-gray-800" id="card-brand-name">Brand Name</h1>
                                <p class="text-lg text-gray-600 mt-1" id="card-generic-name">Generic Name</p>
                                <div class="flex gap-2 mt-4" id="card-badges">
                                    <!-- Badges populated here -->
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total Available Stock</p>
                                <h2 class="text-5xl font-black text-blue-600" id="card-total-stock">0</h2>
                            </div>
                        </div>
                        
                        <div class="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Category</p>
                                <p class="text-gray-800 font-medium" id="card-category">-</p>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Item Class</p>
                                <p class="text-gray-800 font-medium" id="card-item-class">-</p>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Manufacturer</p>
                                <p class="text-gray-800 font-medium" id="card-manufacturer">-</p>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Rack Location</p>
                                <p class="text-gray-800 font-medium" id="card-rack">-</p>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Reorder Level (MBQ)</p>
                                <p class="text-gray-800 font-medium" id="card-mbq">-</p>
                            </div>
                        </div>

                        <div class="p-4 bg-gray-50 border-t border-gray-100 flex gap-4">
                            <button onclick="openModal('modal-im-bin')" class="flex-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2"><i class="fa-solid fa-clipboard-list text-blue-600"></i> View Bin Card</button>
                            <button onclick="openModal('modal-im-purchasing')" class="flex-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2"><i class="fa-solid fa-cart-shopping text-green-600"></i> View Purchasing History</button>
                        </div>
                    </div>
                </div>
            </section>`;

const newModals = `
    <!-- BIN CARD MODAL -->
    <div id="modal-im-bin" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm hidden flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex flex-col max-h-[90vh] transform scale-95 opacity-0 transition-all duration-200 modal-content">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                <div>
                    <h2 class="text-xl font-bold text-gray-800"><i class="fa-solid fa-clipboard-list text-blue-600 mr-2"></i> Bin Card (Stock Ledger)</h2>
                    <p class="text-sm text-gray-500 mt-1" id="bin-modal-title">Item Name</p>
                </div>
                <button onclick="closeModal('modal-im-bin')" class="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"><i class="fa-solid fa-xmark text-xl"></i></button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-0">
                <table class="w-full text-left border-collapse">
                    <thead class="sticky top-0 bg-white shadow-sm z-10">
                        <tr class="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 tracking-wider">
                            <th class="p-4 font-medium">Date</th>
                            <th class="p-4 font-medium">Type</th>
                            <th class="p-4 font-medium">Ref / Batch</th>
                            <th class="p-4 font-medium text-right text-green-600">IN Qty</th>
                            <th class="p-4 font-medium text-right text-red-600">OUT Qty</th>
                            <th class="p-4 font-medium text-right text-blue-600">Balance</th>
                        </tr>
                    </thead>
                    <tbody id="im-bin-tbody" class="text-sm text-gray-700 divide-y divide-gray-100">
                        <!-- Populated dynamically -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- PURCHASING HISTORY MODAL -->
    <div id="modal-im-purchasing" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm hidden flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh] transform scale-95 opacity-0 transition-all duration-200 modal-content">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                <div>
                    <h2 class="text-xl font-bold text-gray-800"><i class="fa-solid fa-cart-shopping text-green-600 mr-2"></i> Purchasing & Batch History</h2>
                    <p class="text-sm text-gray-500 mt-1" id="purchasing-modal-title">Item Name</p>
                </div>
                <button onclick="closeModal('modal-im-purchasing')" class="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"><i class="fa-solid fa-xmark text-xl"></i></button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-0">
                <table class="w-full text-left border-collapse">
                    <thead class="sticky top-0 bg-white shadow-sm z-10">
                        <tr class="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 tracking-wider">
                            <th class="p-4 font-medium">Batch No</th>
                            <th class="p-4 font-medium">Expiry Date</th>
                            <th class="p-4 font-medium text-right">Cost Price</th>
                            <th class="p-4 font-medium text-right">Selling Price</th>
                            <th class="p-4 font-medium text-right">Current Qty</th>
                        </tr>
                    </thead>
                    <tbody id="im-purchasing-tbody" class="text-sm text-gray-700 divide-y divide-gray-100">
                        <!-- Populated dynamically -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
`;

const startPattern = '<section id="master-itemmaster"';
const startIdx = html.indexOf(startPattern);
let endIdx = -1;

if (startIdx !== -1) {
    let searchIdx = startIdx + startPattern.length;
    let openCount = 1;
    while (searchIdx < html.length) {
        const nextOpen = html.indexOf('<section', searchIdx);
        const nextClose = html.indexOf('</section>', searchIdx);
        
        if (nextClose === -1) break;
        
        if (nextOpen !== -1 && nextOpen < nextClose) {
            openCount++;
            searchIdx = nextOpen + 8;
        } else {
            openCount--;
            searchIdx = nextClose + 10;
            if (openCount === 0) {
                endIdx = searchIdx;
                break;
            }
        }
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    html = html.substring(0, startIdx) + newItemMasterHTML + html.substring(endIdx);
    
    // Inject the new modals right before the first script tag (which is where I put the previous modal)
    const scriptIdx = html.indexOf('<script src="https://unpkg.com/dexie');
    if (scriptIdx !== -1) {
        html = html.substring(0, scriptIdx) + newModals + '\n    ' + html.substring(scriptIdx);
    }
    
    fs.writeFileSync('index.html', html);
    console.log('Replaced master-itemmaster UI and added new Modals.');
} else {
    console.log('Could not find bounds for master-itemmaster');
}

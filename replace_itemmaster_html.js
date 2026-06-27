const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const newItemMasterHTML = `            <section id="master-itemmaster" class="app-section flex-col gap-4 hidden overflow-y-auto" style="height: calc(100vh - 100px);">
                <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h2 class="text-xl font-bold text-gray-800">Item Master Details</h2>
                    <div class="flex gap-2">
                        <button onclick="openModal('modal-add-item')" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"><i class="fa-solid fa-plus mr-2"></i> Add New Item</button>
                    </div>
                </div>

                <!-- Search Area -->
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-end">
                    <div class="w-48">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Item Code</label>
                        <input type="text" id="im-item-code" class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-600" readonly placeholder="Select item...">
                        <input type="hidden" id="im-drug-id">
                    </div>
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
                        <input type="text" id="im-generic-name" class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-600" readonly placeholder="Select item...">
                    </div>
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                        <input type="text" id="im-brand-name" class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-600" readonly placeholder="Select item...">
                    </div>
                    <div>
                        <button onclick="openItemSearchModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm h-10"><i class="fa-solid fa-magnifying-glass mr-2"></i> Browse</button>
                    </div>
                </div>

                <!-- Detail Area (Hidden by default until item is loaded) -->
                <div id="im-details-area" class="hidden flex-col gap-4">
                    <!-- Data Tabs -->
                    <div class="flex border-b border-gray-200">
                        <button id="im-tab-bin" onclick="switchIMTab('bin')" class="px-6 py-3 font-medium text-blue-600 border-b-2 border-blue-600">Bin Card (Stock Ledger)</button>
                        <button id="im-tab-purchasing" onclick="switchIMTab('purchasing')" class="px-6 py-3 font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700">Purchasing / Batches</button>
                    </div>

                    <!-- Bin Card Tab -->
                    <div id="im-content-bin" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-col">
                        <div class="p-4 bg-gray-50 border-b flex justify-between items-center">
                            <h3 class="font-bold text-gray-800">Stock Ledger</h3>
                            <div class="text-sm">Total Current Stock: <span id="im-total-stock" class="font-bold text-blue-600 text-lg ml-1">0</span></div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-white border-b border-gray-200 text-xs uppercase text-gray-500 tracking-wider">
                                        <th class="p-4 font-medium">Date</th>
                                        <th class="p-4 font-medium">Type</th>
                                        <th class="p-4 font-medium">Ref / Batch</th>
                                        <th class="p-4 font-medium text-right text-green-600">IN Qty</th>
                                        <th class="p-4 font-medium text-right text-red-600">OUT Qty</th>
                                        <th class="p-4 font-medium text-right text-blue-600">Balance</th>
                                    </tr>
                                </thead>
                                <tbody id="im-bin-tbody" class="text-sm text-gray-700 divide-y divide-gray-100">
                                    <tr><td colspan="6" class="text-center py-8 text-gray-500">Loading bin card...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Purchasing Tab -->
                    <div id="im-content-purchasing" class="hidden bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-col">
                        <div class="p-4 bg-gray-50 border-b flex justify-between items-center">
                            <h3 class="font-bold text-gray-800">Batch History</h3>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-white border-b border-gray-200 text-xs uppercase text-gray-500 tracking-wider">
                                        <th class="p-4 font-medium">Batch No</th>
                                        <th class="p-4 font-medium">Expiry Date</th>
                                        <th class="p-4 font-medium text-right">Cost Price</th>
                                        <th class="p-4 font-medium text-right">Selling Price</th>
                                        <th class="p-4 font-medium text-right">Current Qty</th>
                                    </tr>
                                </thead>
                                <tbody id="im-purchasing-tbody" class="text-sm text-gray-700 divide-y divide-gray-100">
                                    <tr><td colspan="5" class="text-center py-8 text-gray-500">Loading purchasing details...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>`;

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
    
    // Add Modal for Item Search
    const itemSearchModalHTML = `
    <!-- ITEM SEARCH MODAL -->
    <div id="modal-item-search" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm hidden flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                <div>
                    <h2 class="text-xl font-bold text-gray-800">Search Items</h2>
                    <p class="text-sm text-gray-500 mt-1">Search and select an item to view its details.</p>
                </div>
                <button onclick="closeModal('modal-item-search')" class="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"><i class="fa-solid fa-xmark text-xl"></i></button>
            </div>
            
            <div class="p-6 border-b border-gray-100">
                <div class="relative">
                    <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input type="text" id="im-search-input" onkeyup="filterItemSearchModal()" placeholder="Search by Brand Name, Generic Name, or Code..." class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-0">
                <table class="w-full text-left border-collapse">
                    <thead class="sticky top-0 bg-white shadow-sm z-10">
                        <tr class="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 tracking-wider">
                            <th class="p-4 font-medium">Code</th>
                            <th class="p-4 font-medium">Brand Name</th>
                            <th class="p-4 font-medium">Generic Name</th>
                            <th class="p-4 font-medium">Category</th>
                            <th class="p-4 font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody id="im-search-tbody" class="text-sm text-gray-700 divide-y divide-gray-100">
                        <!-- Populated dynamically -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `;
    
    html = html.replace('<!-- MODALS END -->', itemSearchModalHTML + '\n<!-- MODALS END -->');
    
    fs.writeFileSync('index.html', html);
    console.log('Replaced master-itemmaster and added modal successfully.');
} else {
    console.log('Could not find bounds.');
}

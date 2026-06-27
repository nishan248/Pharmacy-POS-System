const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const newItemMasterHTML = `            <section id="master-itemmaster" class="app-section flex-col gap-4 hidden overflow-y-auto" style="height: calc(100vh - 100px);">
                <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h2 class="text-xl font-bold text-gray-800">Item Master</h2>
                    <div class="flex gap-2">
                        <button onclick="openModal('modal-add-item')" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"><i class="fa-solid fa-plus mr-2"></i> Add New Item</button>
                    </div>
                </div>

                <!-- Search & Actions Area -->
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-end">
                    <div class="w-48">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Item Code</label>
                        <input type="text" id="im-item-code" class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-600 font-mono" readonly placeholder="---">
                        <input type="hidden" id="im-drug-id">
                    </div>
                    <div>
                        <button onclick="if(document.getElementById('im-drug-id').value) openModal('modal-im-bin'); else showToast('Please select an item first.', 'error');" class="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors h-10"><i class="fa-solid fa-clipboard-list mr-1"></i> Bin Card</button>
                    </div>
                    <div>
                        <button onclick="if(document.getElementById('im-drug-id').value) openModal('modal-im-purchasing'); else showToast('Please select an item first.', 'error');" class="bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors h-10"><i class="fa-solid fa-cart-shopping mr-1"></i> Purchasing</button>
                    </div>
                    <div class="flex-1"></div>
                    <div>
                        <button onclick="openItemSearchModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm h-10"><i class="fa-solid fa-magnifying-glass mr-2"></i> Browse</button>
                    </div>
                </div>

                <!-- Detail Grid Area (Hidden by default until item is loaded) -->
                <div id="im-details-area" class="hidden flex-col gap-4">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 items-start">
                        <div class="col-span-2">
                            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Brand Name</p>
                            <p class="text-gray-800 font-bold text-lg" id="card-brand-name">-</p>
                        </div>
                        <div class="col-span-2">
                            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Generic Name</p>
                            <p class="text-gray-800 font-medium text-lg" id="card-generic-name">-</p>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Total Available Stock</p>
                            <p class="text-blue-600 font-black text-2xl" id="card-total-stock">0</p>
                        </div>
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
                        <div class="col-span-2 flex gap-2" id="card-badges">
                            <!-- Badges populated here -->
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
    fs.writeFileSync('index.html', html);
    console.log('Replaced master-itemmaster UI to smaller version.');
} else {
    console.log('Could not find bounds for master-itemmaster');
}

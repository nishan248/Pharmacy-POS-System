const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const itemSearchModalHTML = `
    <!-- ITEM SEARCH MODAL -->
    <div id="modal-item-search" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm hidden flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh] transform scale-95 opacity-0 transition-all duration-200 modal-content">
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

if (!html.includes('modal-item-search')) {
    html = html.replace('<script src="https://unpkg.com/dexie@3.2.4/dist/dexie.js"></script>', itemSearchModalHTML + '\n    <script src="https://unpkg.com/dexie@3.2.4/dist/dexie.js"></script>');
    fs.writeFileSync('index.html', html);
    console.log('Appended modal successfully.');
} else {
    console.log('Modal already exists.');
}

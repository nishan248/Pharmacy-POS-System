const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startPattern = '<section id="master-general"';
const endPattern = '</section>';

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

const newHTML = `            <section id="master-general" class="app-section flex-col gap-6 hidden overflow-y-auto" style="height: calc(100vh - 100px);">
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
                    <h2 class="text-xl font-bold text-gray-800">General Configuration & Filter</h2>
                    
                    <div class="flex gap-4">
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Select Type</label>
                            <select id="gen-filter-type" class="w-full border border-gray-300 rounded-lg px-4 py-2" onchange="onGenFilterTypeChange()">
                                <option value="">-- Select Type --</option>
                                <option value="categories">Category</option>
                                <option value="subcategories">Sub-Category</option>
                                <option value="generics">Generic Name</option>
                                <option value="brands">Brand Name</option>
                                <option value="manufacturers">Manufacturer</option>
                                <option value="item_classes">Item Class</option>
                                <option value="suppliers">Supplier</option>
                            </select>
                        </div>
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Select Item</label>
                            <div class="flex gap-2">
                                <select id="gen-filter-item" class="flex-1 border border-gray-300 rounded-lg px-4 py-2" onchange="onGenFilterItemChange()">
                                    <option value="">-- Choose Type First --</option>
                                </select>
                                <button onclick="promptAddNewGenItem()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors" id="btn-add-gen-item" disabled title="Add New Item of this Type"><i class="fa-solid fa-plus"></i></button>
                                <button onclick="deleteSelectedGenItem()" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors" id="btn-del-gen-item" disabled title="Delete Selected Item"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
                    <div class="p-4 border-b bg-gray-50 flex justify-between items-center">
                        <h3 class="font-bold text-gray-800">Associated Items</h3>
                        <span class="text-sm text-gray-500" id="gen-filter-count">0 items found</span>
                    </div>
                    <div class="overflow-x-auto flex-1">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-white border-b border-gray-200 text-xs uppercase text-gray-500 tracking-wider">
                                    <th class="p-4 font-medium">Item Name</th>
                                    <th class="p-4 font-medium">Generic / Class</th>
                                    <th class="p-4 font-medium">Category</th>
                                    <th class="p-4 font-medium">Manufacturer</th>
                                    <th class="p-4 font-medium text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody id="gen-drugs-tbody" class="text-sm text-gray-700 divide-y divide-gray-100">
                                <tr><td colspan="5" class="text-center py-8 text-gray-500">Select a type and item to view associated drugs.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>`;

if (startIdx !== -1 && endIdx !== -1) {
    html = html.substring(0, startIdx) + newHTML + html.substring(endIdx);
    fs.writeFileSync('index.html', html);
    console.log('Replaced master-general successfully.');
} else {
    console.log('Could not find bounds.');
}

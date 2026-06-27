const fs = require('fs');

const masterAccountsStr = `            <section id="master-accounts" class="app-section flex-col gap-6 hidden">
                <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div>
                        <h2 class="text-xl font-bold text-gray-800">Accounts (Login Details)</h2>
                        <p class="text-sm text-gray-500">Manage system users, roles, and access</p>
                    </div>
                    <button onclick="openModal('modal-add-user')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
                        <i class="fa-solid fa-user-plus mr-2"></i> Add Account
                    </button>
                </div>
                
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                            <tr>
                                <th class="p-4 font-medium">Username</th>
                                <th class="p-4 font-medium">Full Name</th>
                                <th class="p-4 font-medium">Role</th>
                                <th class="p-4 font-medium text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="users-tbody" class="text-sm text-gray-700 divide-y divide-gray-100">
                        </tbody>
                    </table>
                </div>
            </section>`;

const newSectionsStr = `            <section id="master-itemmaster" class="app-section flex-col gap-4 hidden">
                <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div class="relative w-96 flex gap-2">
                        <div class="relative flex-1">
                            <i class="fa-solid fa-search absolute left-3 top-2.5 text-gray-400"></i>
                            <input type="text" id="master-inv-search" placeholder="Search Item Master..." class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="openModal('modal-stock-adjustment')" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium btn-animate shadow-sm"><i class="fa-solid fa-scale-balanced mr-1"></i> Stock Adjustment</button>
                        <button onclick="openAddDrugModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium btn-animate shadow-sm"><i class="fa-solid fa-plus mr-1"></i> Add New Item</button>
                    </div>
                </div>

                <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                    <select id="filter-category" class="border border-gray-300 rounded px-3 py-2 text-sm flex-1"><option value="">All Categories</option></select>
                    <select id="filter-brand" class="border border-gray-300 rounded px-3 py-2 text-sm flex-1"><option value="">All Brands</option></select>
                    <select id="filter-manufacturer" class="border border-gray-300 rounded px-3 py-2 text-sm flex-1"><option value="">All Manufacturers</option></select>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
                    <div class="overflow-x-auto flex-1">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 tracking-wider">
                                    <th class="p-4 font-medium">Item Name</th>
                                    <th class="p-4 font-medium">Generic / Class</th>
                                    <th class="p-4 font-medium">Category / Brand</th>
                                    <th class="p-4 font-medium">Location</th>
                                    <th class="p-4 font-medium text-right">Total Qty</th>
                                    <th class="p-4 font-medium text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="inventory-table-body" class="text-sm text-gray-700 divide-y divide-gray-100">
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section id="master-general" class="app-section flex-col gap-6 hidden overflow-y-auto" style="height: calc(100vh - 100px);">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <h3 class="font-bold text-gray-800 mb-3 border-b pb-2">Categories</h3>
                        <div class="flex gap-2 mb-3">
                            <input type="text" id="new-category-name" class="flex-1 border rounded px-3 py-1.5 text-sm" placeholder="New Category">
                            <button onclick="addConfigItem('categories')" class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm"><i class="fa-solid fa-plus"></i></button>
                        </div>
                        <ul id="list-categories" class="divide-y text-sm max-h-40 overflow-y-auto"></ul>
                    </div>
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <h3 class="font-bold text-gray-800 mb-3 border-b pb-2">Sub-Categories</h3>
                        <div class="flex flex-col gap-2 mb-3">
                            <select id="subcat-parent" class="border rounded px-3 py-1.5 text-sm"><option value="">Select Category</option></select>
                            <div class="flex gap-2">
                                <input type="text" id="new-subcategory-name" class="flex-1 border rounded px-3 py-1.5 text-sm" placeholder="New Sub-Category">
                                <button onclick="addConfigItem('subcategories')" class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>
                        <ul id="list-subcategories" class="divide-y text-sm max-h-40 overflow-y-auto"></ul>
                    </div>
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <h3 class="font-bold text-gray-800 mb-3 border-b pb-2">Generic Names</h3>
                        <div class="flex gap-2 mb-3">
                            <input type="text" id="new-generic-name" class="flex-1 border rounded px-3 py-1.5 text-sm" placeholder="New Generic">
                            <button onclick="addConfigItem('generics')" class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm"><i class="fa-solid fa-plus"></i></button>
                        </div>
                        <ul id="list-generics" class="divide-y text-sm max-h-40 overflow-y-auto"></ul>
                    </div>
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <h3 class="font-bold text-gray-800 mb-3 border-b pb-2">Brand Names</h3>
                        <div class="flex gap-2 mb-3">
                            <input type="text" id="new-brand-name" class="flex-1 border rounded px-3 py-1.5 text-sm" placeholder="New Brand">
                            <button onclick="addConfigItem('brands')" class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm"><i class="fa-solid fa-plus"></i></button>
                        </div>
                        <ul id="list-brands" class="divide-y text-sm max-h-40 overflow-y-auto"></ul>
                    </div>
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <h3 class="font-bold text-gray-800 mb-3 border-b pb-2">Manufacturers</h3>
                        <div class="flex gap-2 mb-3">
                            <input type="text" id="new-manufacturer-name" class="flex-1 border rounded px-3 py-1.5 text-sm" placeholder="New Manufacturer">
                            <button onclick="addConfigItem('manufacturers')" class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm"><i class="fa-solid fa-plus"></i></button>
                        </div>
                        <ul id="list-manufacturers" class="divide-y text-sm max-h-40 overflow-y-auto"></ul>
                    </div>
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <h3 class="font-bold text-gray-800 mb-3 border-b pb-2">Item Classes</h3>
                        <div class="flex gap-2 mb-3">
                            <input type="text" id="new-itemclass-name" class="flex-1 border rounded px-3 py-1.5 text-sm" placeholder="New Class">
                            <button onclick="addConfigItem('item_classes')" class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm"><i class="fa-solid fa-plus"></i></button>
                        </div>
                        <ul id="list-itemclasses" class="divide-y text-sm max-h-40 overflow-y-auto"></ul>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mt-4">
                    <h3 class="font-bold text-gray-800 mb-4 border-b pb-2">Supplier Item Mapping</h3>
                    <div class="flex gap-4 items-end mb-4">
                        <div class="flex-1">
                            <label class="block text-xs text-gray-500 mb-1">Select Supplier</label>
                            <select id="supplier-filter" class="w-full border border-gray-300 rounded px-3 py-2 text-sm" onchange="loadSupplierItems()"><option value="">-- Choose --</option></select>
                        </div>
                    </div>
                    <div class="overflow-x-auto max-h-60">
                        <table class="w-full text-left border-collapse">
                            <thead class="bg-gray-50 border-b border-gray-200 text-xs">
                                <tr><th class="p-2">Item Name</th><th class="p-2">Brand</th><th class="p-2">Manufacturer</th><th class="p-2">Action</th></tr>
                            </thead>
                            <tbody id="supplier-items-tbody" class="text-sm divide-y">
                                <tr><td colspan="4" class="text-center py-4 text-gray-500">Select a supplier to view items</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section id="master-locations" class="app-section flex-col gap-6 hidden">
                <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full max-w-2xl mx-auto">
                    <h3 class="font-bold text-gray-800 mb-3 border-b pb-2">Location Management</h3>
                    <div class="flex gap-2 mb-4">
                        <input type="text" id="new-location-name" class="flex-1 border rounded px-3 py-2 text-sm" placeholder="e.g. Shelf A, Cold Room">
                        <select id="new-location-type" class="border rounded px-3 py-2 text-sm">
                            <option value="Shelf">Shelf</option>
                            <option value="Store">Main Store</option>
                            <option value="Fridge">Fridge</option>
                        </select>
                        <button onclick="addConfigItem('locations')" class="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"><i class="fa-solid fa-plus mr-1"></i> Add Location</button>
                    </div>
                    <div class="overflow-y-auto max-h-96">
                        <table class="w-full text-left text-sm border-collapse">
                            <thead class="bg-gray-50 border-b">
                                <tr><th class="p-2">Location Name</th><th class="p-2">Type</th><th class="p-2 text-right">Action</th></tr>
                            </thead>
                            <tbody id="list-locations" class="divide-y"></tbody>
                        </table>
                    </div>
                </div>
            </section>`;

let lines = fs.readFileSync('index.html', 'utf8').split('\n');

const invStart = 333; // 0-indexed: 334 in 1-based
const invEnd = 365;

const usersStart = 1250;
const usersEnd = 1276;

lines.splice(usersStart, usersEnd - usersStart + 1, masterAccountsStr);
lines.splice(invStart, invEnd - invStart + 1, newSectionsStr);

fs.writeFileSync('index.html', lines.join('\n'));
console.log('Successfully updated index.html with new sections');

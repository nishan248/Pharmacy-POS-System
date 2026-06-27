const fs = require('fs');

const adjustmentsHTML = `
            <!-- STOCK ADJUSTMENTS SECTION -->
            <section id="adjustments" class="app-section flex-col gap-4 hidden h-full">
                <!-- Header -->
                <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center mb-2">
                    <h2 class="text-xl font-bold text-gray-800"><i class="fa-solid fa-clipboard-check text-blue-500 mr-2"></i> Physical Stock Audit</h2>
                    <div id="adj-header-actions">
                        <button onclick="showAdjustmentsList()" class="hidden text-sm text-gray-600 hover:text-blue-600 font-medium" id="btn-adj-back"><i class="fa-solid fa-arrow-left mr-1"></i> Back to History</button>
                    </div>
                </div>

                <!-- VIEW: List of Past/Draft Audits -->
                <div id="adj-list-view" class="flex flex-col gap-4 flex-1">
                    <div class="flex justify-end">
                        <button onclick="createNewAudit()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"><i class="fa-solid fa-plus mr-2"></i> Start New Audit</button>
                    </div>
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 tracking-wider">
                                    <th class="p-4 font-medium">Audit ID</th>
                                    <th class="p-4 font-medium">Date</th>
                                    <th class="p-4 font-medium">Category</th>
                                    <th class="p-4 font-medium">Status</th>
                                    <th class="p-4 font-medium text-right">Variance Value</th>
                                </tr>
                            </thead>
                            <tbody id="adj-history-body" class="text-sm text-gray-700 divide-y divide-gray-100">
                                <!-- Loaded via JS -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- VIEW: Edit/Count Sheet -->
                <div id="adj-edit-view" class="hidden flex-col gap-4 flex-1">
                    <!-- Setup Bar -->
                    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end" id="adj-setup-bar">
                        <div class="flex-1 min-w-[200px]">
                            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Select Category</label>
                            <select id="adj-category-select" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                                <option value="">Select a Category...</option>
                                <!-- Populated dynamically -->
                            </select>
                        </div>
                        <button onclick="generateCountSheet()" class="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">Generate Sheet</button>
                    </div>

                    <!-- Audit Information (Hidden until generated) -->
                    <div id="adj-info-bar" class="hidden bg-blue-50 border border-blue-100 p-3 rounded-lg flex justify-between items-center text-sm">
                        <div><span class="font-semibold text-blue-800">Category:</span> <span id="adj-lbl-category" class="text-blue-600 font-medium"></span></div>
                        <div><span class="font-semibold text-blue-800">Status:</span> <span id="adj-lbl-status" class="px-2 py-0.5 rounded text-xs font-bold bg-yellow-100 text-yellow-700">DRAFT</span></div>
                        <div><span class="font-semibold text-blue-800">Date:</span> <span id="adj-lbl-date" class="text-gray-700"></span></div>
                        <input type="hidden" id="adj-current-id">
                    </div>

                    <!-- Count Sheet Table -->
                    <div id="adj-table-container" class="hidden bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col relative" style="min-height: 400px;">
                        <div class="overflow-y-auto custom-scrollbar flex-1">
                            <table class="w-full text-left border-collapse" id="print-adj-table">
                                <thead class="sticky top-0 bg-gray-50 shadow-sm z-10">
                                    <tr class="border-b border-gray-200 text-xs uppercase text-gray-500 tracking-wider">
                                        <th class="p-3 font-medium">Item Code</th>
                                        <th class="p-3 font-medium">Drug Name</th>
                                        <th class="p-3 font-medium text-center">System Qty</th>
                                        <th class="p-3 font-medium text-center w-32">Physical Qty</th>
                                        <th class="p-3 font-medium text-center">Variance</th>
                                        <th class="p-3 font-medium text-right">Variance Value</th>
                                        <th class="p-3 font-medium w-48">Remark</th>
                                        <th class="p-3 font-medium w-10"></th>
                                    </tr>
                                </thead>
                                <tbody id="adj-sheet-body" class="text-sm text-gray-700 divide-y divide-gray-100">
                                    <!-- Sheet rows -->
                                </tbody>
                                <tfoot>
                                    <tr class="bg-gray-50 border-t border-gray-200">
                                        <td colspan="5" class="p-3 font-bold text-right text-gray-600">Total Variance Value:</td>
                                        <td class="p-3 font-bold text-right text-red-600" id="adj-total-variance">Rs. 0.00</td>
                                        <td colspan="2"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        
                        <!-- Manual Add Bar -->
                        <div class="p-3 bg-gray-50 border-t border-gray-100 flex gap-2 items-center" id="adj-manual-add-bar">
                            <div class="text-xs font-semibold text-gray-500 uppercase">Found extra item?</div>
                            <div class="relative flex-1 max-w-md">
                                <i class="fa-solid fa-search absolute left-3 top-2 text-gray-400 text-xs"></i>
                                <input type="text" id="adj-search-manual" placeholder="Search drug to add manually..." class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" autocomplete="off" onkeyup="searchManualAdjItem(this.value)">
                                <div id="adj-search-results" class="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 shadow-xl rounded-lg max-h-60 overflow-y-auto z-50 hidden custom-scrollbar"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer Actions -->
                    <div id="adj-footer-actions" class="hidden flex justify-between items-center border-t border-gray-200 pt-4 mt-auto">
                        <button onclick="printAuditSheet()" class="text-gray-600 hover:text-gray-900 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors"><i class="fa-solid fa-print mr-2"></i> Print Count Sheet</button>
                        <div class="flex gap-3">
                            <button onclick="saveAuditDraft()" class="text-blue-600 bg-blue-50 hover:bg-blue-100 px-6 py-2 rounded-lg text-sm font-medium transition-colors border border-blue-200 shadow-sm">Save Draft</button>
                            <button onclick="finalizeAudit()" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"><i class="fa-solid fa-check-double mr-2"></i> Finalize & Update Stock</button>
                        </div>
                    </div>
                </div>
            </section>
`;

let htmlContent = fs.readFileSync('index.html', 'utf8');

// Insert the new section just before <!-- EXPIRY MANAGEMENT SECTION -->
htmlContent = htmlContent.replace('<!-- EXPIRY MANAGEMENT SECTION -->', adjustmentsHTML + '\n            <!-- EXPIRY MANAGEMENT SECTION -->');

fs.writeFileSync('index.html', htmlContent);
console.log('Added Stock Adjustments section to index.html');

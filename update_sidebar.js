const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const oldExpiryBtn = `            <button onclick="nav('expiry')" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors" data-target="expiry">
                <i class="fa-solid fa-calendar-xmark w-5 text-center"></i> Expiry Mgmt
            </button>`;

const newDropdown = `            <!-- Adjustments Dropdown -->
            <div class="nav-item-group w-full">
                <button onclick="toggleAdjustmentsDropdown()" class="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    <div class="flex items-center gap-3"><i class="fa-solid fa-sliders w-5 text-center"></i> Stock Adjustments</div>
                    <i class="fa-solid fa-chevron-down text-xs transition-transform" id="adjustments-dropdown-icon"></i>
                </button>
                <div id="adjustments-dropdown" class="hidden flex-col gap-1 pl-11 pr-4 py-2 bg-gray-50/50 rounded-lg mt-1">
                    <button onclick="nav('adjustments')" class="nav-item w-full text-left text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors py-2" data-target="adjustments">Audit & Adjustment</button>
                    <button onclick="nav('expiry')" class="nav-item w-full text-left text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors py-2" data-target="expiry">Expiry / Disposals</button>
                </div>
            </div>`;

html = html.replace(oldExpiryBtn, newDropdown);

fs.writeFileSync('index.html', html);
console.log('Replaced Expiry button with Adjustments Dropdown.');

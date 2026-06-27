const fs = require('fs');

const newMasterLogic = `
window.loadInventory = () => {
    // Reset view
    document.getElementById('im-item-code').value = '';
    document.getElementById('im-drug-id').value = '';
    document.getElementById('im-generic-name').value = '';
    document.getElementById('im-brand-name').value = '';
    document.getElementById('im-details-area').classList.add('hidden');
    document.getElementById('im-bin-tbody').innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-500">Select an item to view bin card.</td></tr>';
    document.getElementById('im-purchasing-tbody').innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">Select an item to view purchasing details.</td></tr>';
    document.getElementById('im-total-stock').innerText = '0';
};

window.openItemSearchModal = async () => {
    const tbody = document.getElementById('im-search-tbody');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">Loading...</td></tr>';
    document.getElementById('im-search-input').value = '';
    openModal('modal-item-search');
    
    try {
        const drugs = await db.drugs.toArray();
        window.imSearchCache = drugs;
        filterItemSearchModal();
    } catch(e) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-red-500">Error loading items</td></tr>';
    }
};

window.filterItemSearchModal = () => {
    const query = document.getElementById('im-search-input').value.toLowerCase();
    const tbody = document.getElementById('im-search-tbody');
    const drugs = window.imSearchCache || [];
    
    const filtered = drugs.filter(d => 
        (d.brandName || '').toLowerCase().includes(query) ||
        (d.genericName || '').toLowerCase().includes(query) ||
        ('ITEM-' + d.id.toString().padStart(4, '0')).toLowerCase().includes(query)
    );
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">No matching items found.</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(d => \`
        <tr class="hover:bg-blue-50/50 transition-colors cursor-pointer" onclick="selectItemMasterDrug(\${d.id})">
            <td class="p-4 text-gray-600 font-mono text-xs">ITEM-\${d.id.toString().padStart(4, '0')}</td>
            <td class="p-4 font-bold text-gray-800">\${d.brandName}</td>
            <td class="p-4 text-gray-600">\${d.genericName || '-'}</td>
            <td class="p-4 text-gray-600">\${d.category || '-'}</td>
            <td class="p-4 text-center">
                <button class="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded text-xs font-medium">Select</button>
            </td>
        </tr>
    \`).join('');
};

window.selectItemMasterDrug = async (drugId) => {
    closeModal('modal-item-search');
    
    try {
        const drug = await db.drugs.get(drugId);
        if(!drug) return;
        
        // Populate top bar
        document.getElementById('im-item-code').value = 'ITEM-' + drug.id.toString().padStart(4, '0');
        document.getElementById('im-drug-id').value = drug.id;
        document.getElementById('im-generic-name').value = drug.genericName || '';
        document.getElementById('im-brand-name').value = drug.brandName || '';
        
        // Show details area
        document.getElementById('im-details-area').classList.remove('hidden');
        document.getElementById('im-details-area').classList.add('flex');
        
        switchIMTab('bin'); // default tab
        
        // Load Details
        await loadItemMasterPurchasing(drug.id);
        await loadItemMasterBinCard(drug.id);
        
    } catch(e) {
        showToast('Error loading item: ' + e.message, 'error');
    }
};

window.switchIMTab = (tab) => {
    document.getElementById('im-content-bin').classList.add('hidden');
    document.getElementById('im-content-purchasing').classList.add('hidden');
    document.getElementById('im-tab-bin').classList.replace('border-blue-600', 'border-transparent');
    document.getElementById('im-tab-bin').classList.replace('text-blue-600', 'text-gray-500');
    document.getElementById('im-tab-purchasing').classList.replace('border-blue-600', 'border-transparent');
    document.getElementById('im-tab-purchasing').classList.replace('text-blue-600', 'text-gray-500');
    
    if (tab === 'bin') {
        document.getElementById('im-content-bin').classList.remove('hidden');
        document.getElementById('im-content-bin').classList.add('flex');
        document.getElementById('im-tab-bin').classList.replace('border-transparent', 'border-blue-600');
        document.getElementById('im-tab-bin').classList.replace('text-gray-500', 'text-blue-600');
    } else {
        document.getElementById('im-content-purchasing').classList.remove('hidden');
        document.getElementById('im-content-purchasing').classList.add('flex');
        document.getElementById('im-tab-purchasing').classList.replace('border-transparent', 'border-blue-600');
        document.getElementById('im-tab-purchasing').classList.replace('text-gray-500', 'text-blue-600');
    }
};

window.loadItemMasterPurchasing = async (drugId) => {
    const tbody = document.getElementById('im-purchasing-tbody');
    try {
        const batches = await db.batches.where('drugId').equals(drugId).toArray();
        const totalQty = batches.reduce((sum, b) => sum + b.qty, 0);
        document.getElementById('im-total-stock').innerText = totalQty;
        
        if (batches.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">No purchasing / batch history found.</td></tr>';
            return;
        }
        
        tbody.innerHTML = batches.map(b => \`
            <tr class="hover:bg-gray-50">
                <td class="p-4 font-medium text-gray-800">\${b.batchNumber}</td>
                <td class="p-4 text-gray-600">\${b.expiryDate}</td>
                <td class="p-4 text-right text-gray-600">\${formatCurrency(b.costPrice)}</td>
                <td class="p-4 text-right text-blue-600 font-medium">\${formatCurrency(b.sellingPrice)}</td>
                <td class="p-4 text-right font-bold text-gray-800">\${b.qty}</td>
            </tr>
        \`).join('');
    } catch(e) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-red-500">Error loading purchasing details</td></tr>';
    }
};

window.loadItemMasterBinCard = async (drugId) => {
    const tbody = document.getElementById('im-bin-tbody');
    try {
        let entries = await db.stock_ledger.where('drugId').equals(drugId).toArray();
        entries.sort((a,b) => new Date(a.date) - new Date(b.date)); // ASCENDING for running balance
        
        if (entries.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-500">No transaction history found for this drug.</td></tr>';
            return;
        }
        
        let runningBalance = 0;
        let htmlRows = [];
        
        for (const entry of entries) {
            runningBalance += entry.qtyChange;
            
            let batchInfo = '-';
            if (entry.batchId) {
                const batch = await db.batches.get(entry.batchId);
                if (batch) batchInfo = batch.batchNumber;
            }
            
            let inQty = entry.qtyChange > 0 ? entry.qtyChange : '-';
            let outQty = entry.qtyChange < 0 ? Math.abs(entry.qtyChange) : '-';
            
            htmlRows.unshift(\`
                <tr class="hover:bg-gray-50">
                    <td class="p-4 text-sm text-gray-600">\${formatDate(entry.date)}</td>
                    <td class="p-4 text-sm font-medium text-gray-800">\${entry.transactionType}</td>
                    <td class="p-4 text-sm text-gray-500">\${entry.reference || '-'} <br><span class="text-xs text-gray-400">\${batchInfo !== '-' ? 'Batch: '+batchInfo : ''}</span></td>
                    <td class="p-4 text-right text-sm font-bold text-green-600">\${inQty}</td>
                    <td class="p-4 text-right text-sm font-bold text-red-600">\${outQty}</td>
                    <td class="p-4 text-right text-sm font-bold text-blue-600">\${runningBalance}</td>
                </tr>
            \`);
        }
        
        // Output rows in descending order (newest first), but balance computed ascending
        tbody.innerHTML = htmlRows.join('');
        
    } catch(e) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-red-500">Error loading Bin Card</td></tr>';
    }
};
`;

let lines = fs.readFileSync('js/master.js', 'utf8').split('\n');
const startIdx = lines.findIndex(l => l.includes('window.loadInventory = async () => {'));

if (startIdx !== -1) {
    lines.splice(startIdx - 1, lines.length - startIdx + 1, newMasterLogic);
    fs.writeFileSync('js/master.js', lines.join('\n'));
    console.log('Replaced loadInventory in master.js successfully.');
} else {
    console.log('Could not find window.loadInventory.');
}

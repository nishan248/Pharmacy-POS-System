const fs = require('fs');

const replacementLogic = `
window.loadInventory = () => {
    // Reset view
    document.getElementById('im-item-code').value = '';
    document.getElementById('im-drug-id').value = '';
    document.getElementById('im-generic-name').value = '';
    document.getElementById('im-brand-name').value = '';
    document.getElementById('im-details-area').classList.add('hidden');
    document.getElementById('im-bin-tbody').innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-500">Select an item to view bin card.</td></tr>';
    document.getElementById('im-purchasing-tbody').innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">Select an item to view purchasing details.</td></tr>';
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
        
        // Populate Profile ID Card
        document.getElementById('card-brand-name').innerText = drug.brandName || 'Unknown Brand';
        document.getElementById('card-generic-name').innerText = drug.genericName || 'No Generic Name';
        document.getElementById('card-category').innerText = drug.category || '-';
        document.getElementById('card-item-class').innerText = drug.itemClass || '-';
        document.getElementById('card-manufacturer').innerText = drug.manufacturer || '-';
        document.getElementById('card-rack').innerText = drug.rackLocation || '-';
        document.getElementById('card-mbq').innerText = drug.mbq || '0';
        
        document.getElementById('bin-modal-title').innerText = \`ITEM-\${drug.id.toString().padStart(4, '0')} - \${drug.brandName}\`;
        document.getElementById('purchasing-modal-title').innerText = \`ITEM-\${drug.id.toString().padStart(4, '0')} - \${drug.brandName}\`;

        // Badges
        let badgesHTML = '';
        if (drug.isControlled) {
            badgesHTML += '<span class="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md border border-red-200"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Controlled Drug</span>';
        }
        if (drug.isColdChain) {
            badgesHTML += '<span class="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md border border-blue-200"><i class="fa-solid fa-snowflake mr-1"></i> Cold Chain</span>';
        }
        document.getElementById('card-badges').innerHTML = badgesHTML;
        
        // Show details area
        document.getElementById('im-details-area').classList.remove('hidden');
        document.getElementById('im-details-area').classList.add('flex');
        
        // Pre-load Details for Modals
        await loadItemMasterPurchasing(drug.id);
        await loadItemMasterBinCard(drug.id);
        
    } catch(e) {
        showToast('Error loading item: ' + e.message, 'error');
    }
};

window.loadItemMasterPurchasing = async (drugId) => {
    const tbody = document.getElementById('im-purchasing-tbody');
    try {
        const batches = await db.batches.where('drugId').equals(drugId).toArray();
        const totalQty = batches.reduce((sum, b) => sum + b.qty, 0);
        document.getElementById('card-total-stock').innerText = totalQty;
        
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
        
        // Output rows in descending order (newest first)
        tbody.innerHTML = htmlRows.join('');
        
    } catch(e) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-red-500">Error loading Bin Card</td></tr>';
    }
};
`;

let lines = fs.readFileSync('js/master.js', 'utf8').split('\n');
const startIdx = lines.findIndex(l => l.includes('window.loadInventory = '));

if (startIdx !== -1) {
    // Need to find end of file or remove all below startIdx
    lines.splice(startIdx, lines.length - startIdx, replacementLogic);
    fs.writeFileSync('js/master.js', lines.join('\n'));
    console.log('Replaced master.js logic successfully.');
} else {
    console.log('Could not find window.loadInventory.');
}

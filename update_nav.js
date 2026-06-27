const fs = require('fs');
let nav = fs.readFileSync('js/nav.js', 'utf8');
nav += `
window.toggleAdjustmentsDropdown = () => {
    const dropdown = document.getElementById('adjustments-dropdown');
    const icon = document.getElementById('adjustments-dropdown-icon');
    if (dropdown.classList.contains('hidden')) {
        dropdown.classList.remove('hidden');
        dropdown.classList.add('flex');
        icon.style.transform = 'rotate(180deg)';
    } else {
        dropdown.classList.add('hidden');
        dropdown.classList.remove('flex');
        icon.style.transform = 'rotate(0deg)';
    }
};
`;
fs.writeFileSync('js/nav.js', nav);
console.log('Added toggleAdjustmentsDropdown to nav.js');

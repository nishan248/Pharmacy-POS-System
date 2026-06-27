const fs = require('fs'); 
const path = require('path'); 
const dir = 'c:/Users/Nishan/Desktop/New folder/js'; 
const files = fs.readdirSync(dir); 

files.forEach(f => { 
    if(f.endsWith('.js') && f !== 'utils.js' && f !== 'pos.js') { 
        let content = fs.readFileSync(path.join(dir, f), 'utf-8'); 
        
        content = content.replace(/<h1 style="margin: 0; font-size: 24px;">\\<\/h1>/g, '<h1 style="margin: 0; font-size: 24px;">${window.STORE_PROFILE.name}</h1>'); 
        content = content.replace(/<h2 style="margin: 5px 0; font-size: 18px; color: #555;">\\<\/h2>/g, '<h2 style="margin: 5px 0; font-size: 18px; color: #555;">${window.STORE_PROFILE.name}</h2>'); 
        content = content.replace(/<h2 style="margin:0; font-size:18px;">\\<\/h2>/g, '<h2 style="margin:0; font-size:18px;">${window.STORE_PROFILE.name}</h2>'); 
        content = content.replace(/<p style="margin:0;">\\<\/p>/g, '<p style="margin:0;">${window.STORE_PROFILE.address}</p>'); 
        content = content.replace(/<p style="margin:0;">Tel: \\<\/p>/g, '<p style="margin:0;">Tel: ${window.STORE_PROFILE.phone}</p>'); 
        content = content.replace(/<h2>\\<\/h2>/g, '<h2>${window.STORE_PROFILE.name}</h2>'); 
        content = content.replace(/<p>\\ \| Tel: \\<\/p>/g, '<p>${window.STORE_PROFILE.address} | Tel: ${window.STORE_PROFILE.phone}</p>'); 

        fs.writeFileSync(path.join(dir, f), content); 
    } 
});
console.log("Done");

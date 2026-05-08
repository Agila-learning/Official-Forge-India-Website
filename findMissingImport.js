const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('c:\\\\FORGE_INDIA_CONNECT\\\\FIC_Official-website\\\\frontend\\\\src');
files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('Building2')) {
        let imported = false;
        
        // checking the whole file string for lucide-react import containing Building2
        const importRegex = /import\s+{([^}]*)}\s+from\s+['"]lucide-react['"]/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            if (match[1].includes('Building2')) {
                imported = true;
                break;
            }
        }
        
        if (!imported) {
            console.log('Missing import in: ', file);
        }
    }
});

const https = require('https');
const fs = require('fs');

https.get('https://upload.wikimedia.org/wikipedia/commons/e/eb/India_map_blank.svg', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // We want all <path> tags to combine them, or just grab the whole SVG content.
    fs.writeFileSync('india.svg', data);
    console.log('Saved india.svg');
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});

const fs = require('fs');
const file = 'c:\\FORGE_INDIA_CONNECT\\FIC_Official-website\\frontend\\src\\App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the generic route with the new 3 routes
const searchStr = '<Route path="/services/category/it-solutions" element={<ServiceLandingPage />} />';
const replaceStr = '<Route path="/it-solutions" element={<Suspense fallback={<PageLoader />}><ITSolutions /></Suspense>} />\n  <Route path="/cloud-services" element={<Suspense fallback={<PageLoader />}><CloudServices /></Suspense>} />\n  <Route path="/crm-solutions" element={<Suspense fallback={<PageLoader />}><CRMSolutions /></Suspense>} />';

if (content.includes(searchStr)) {
  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync(file, content);
  console.log('Routes successfully replaced in App.jsx');
} else {
  console.log('Search string not found in App.jsx');
}

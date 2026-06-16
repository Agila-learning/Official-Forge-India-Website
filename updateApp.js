const fs = require('fs');
let content = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// Insert imports
if (!content.includes('WebAppDevelopment')) {
  content = content.replace(
    /const CRMSolutions = lazy\(\(\) => import\('\.\/pages\/CRMSolutions'\)\);/,
    `const CRMSolutions = lazy(() => import('./pages/CRMSolutions'));
const WebAppDevelopment = lazy(() => import('./pages/WebAppDevelopment'));
const MobileAppDevelopment = lazy(() => import('./pages/MobileAppDevelopment'));
const DigitalMarketing = lazy(() => import('./pages/DigitalMarketing'));
const InsuranceServices = lazy(() => import('./pages/InsuranceServices'));`
  );
}

// Insert routes
if (!content.includes('path="/web-development"')) {
  content = content.replace(
    /<Route path="\/services\/category\/app-development" element=\{<ServiceLandingPage \/>\} \/>/,
    `<Route path="/web-development" element={<Suspense fallback={<PageLoader />}><WebAppDevelopment /></Suspense>} />
        <Route path="/app-development" element={<Suspense fallback={<PageLoader />}><MobileAppDevelopment /></Suspense>} />
        <Route path="/digital-marketing" element={<Suspense fallback={<PageLoader />}><DigitalMarketing /></Suspense>} />
        <Route path="/insurance-services" element={<Suspense fallback={<PageLoader />}><InsuranceServices /></Suspense>} />
        <Route path="/services/category/app-development" element={<Navigate to="/app-development" replace />} />`
  );

  content = content.replace(
    /<Route path="\/services\/category\/website-development" element=\{<ServiceLandingPage \/>\} \/>/,
    `<Route path="/services/category/website-development" element={<Navigate to="/web-development" replace />} />`
  );
  
  content = content.replace(
    /<Route path="\/services\/category\/digital-marketing" element=\{<ServiceLandingPage \/>\} \/>/,
    `<Route path="/services/category/digital-marketing" element={<Navigate to="/digital-marketing" replace />} />`
  );
}

fs.writeFileSync('frontend/src/App.jsx', content);
console.log('App.jsx updated');

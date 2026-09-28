const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

if (!c.includes('const AchievementsPage')) {
  c = c.replace(
    "const Testimonials = lazy(() => import('./pages/Testimonials'));",
    "const Testimonials = lazy(() => import('./pages/Testimonials'));\nconst AchievementsPage = lazy(() => import('./pages/AchievementsPage'));"
  );
  
  c = c.replace(
    '<Route path="/testimonials" element={<Testimonials />} />',
    '<Route path="/testimonials" element={<Testimonials />} />\n <Route path="/achievements" element={<AchievementsPage />} />'
  );

  fs.writeFileSync('src/App.jsx', c);
  console.log('Fixed App.jsx');
}

const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

if (!c.includes('AchievementsPage')) {
  c = c.replace(/import Testimonials from '\.\/pages\/Testimonials';/, "import Testimonials from './pages/Testimonials';\nconst AchievementsPage = lazy(() => import('./pages/AchievementsPage'));");
  c = c.replace(/<Route path="\/testimonials" element={<Testimonials \/>} \/>/, `<Route path="/testimonials" element={<Testimonials />} />\n              <Route path="/achievements" element={<AchievementsPage />} />`);
  fs.writeFileSync('src/App.jsx', c);
}

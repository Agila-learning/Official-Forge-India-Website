const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

const oldRoutes = `<main className={\`flex-grow \${!shouldHide ? (location.pathname === '/' ? 'pt-0' : 'pt-16') : ''}\`}>
 <Suspense fallback={<PageLoader />}>
 <Routes>`;

const newRoutes = `<main className={\`flex-grow flex flex-col overflow-hidden \${!shouldHide ? (location.pathname === '/' ? 'pt-0' : 'pt-16') : ''}\`}>
 <Suspense fallback={<PageLoader />}>
 <AnimatePresence mode="wait" initial={false}>
   <motion.div
     key={location.pathname}
     initial={{ opacity: 0, y: 15 }}
     animate={{ opacity: 1, y: 0 }}
     exit={{ opacity: 0, y: -15 }}
     transition={{ duration: 0.3, ease: "easeOut" }}
     className="flex-grow flex flex-col w-full h-full"
   >
     <Routes location={location}>`;

app = app.replace(oldRoutes, newRoutes);

const oldRoutesEnd = `</Routes>
 </Suspense>
 </main>`;

const newRoutesEnd = `</Routes>
   </motion.div>
 </AnimatePresence>
 </Suspense>
 </main>`;

app = app.replace(oldRoutesEnd, newRoutesEnd);

fs.writeFileSync('src/App.jsx', app);
console.log('Fixed Page Transitions in App.jsx');

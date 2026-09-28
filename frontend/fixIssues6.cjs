const fs = require('fs');

// 1. Fix App.jsx LoadingScreen Logic
let app = fs.readFileSync('src/App.jsx', 'utf8');

// The loading state in App component
const oldLoadingState = 'const [loading, setLoading] = useState(true);';
const newLoadingState = `const [loading, setLoading] = useState(() => {
    const path = window.location.pathname;
    const isFirstTime = !sessionStorage.getItem('fic_has_loaded_before');
    if (path === '/' || path === '/login' || path === '/register' || isFirstTime) {
      sessionStorage.setItem('fic_has_loaded_before', 'true');
      return true;
    }
    return false;
  });`;

if (app.includes(oldLoadingState)) {
    app = app.replace(oldLoadingState, newLoadingState);
    fs.writeFileSync('src/App.jsx', app);
    console.log('Fixed LoadingScreen logic in App.jsx');
}

// 2. Fix Navbar.jsx '/explore' -> '/services'
let nav = fs.readFileSync('src/components/layout/Navbar.jsx', 'utf8');
const oldFooterCta = `footerCta: { text: 'Explore All FIC Services →', path: '/explore' }`;
const newFooterCta = `footerCta: { text: 'Explore All FIC Services →', path: '/services' }`;

if (nav.includes(oldFooterCta)) {
    nav = nav.replace(oldFooterCta, newFooterCta);
    fs.writeFileSync('src/components/layout/Navbar.jsx', nav);
    console.log('Fixed Explore Services path in Navbar.jsx');
}

// 3. Fix Home.jsx SEO Keywords
let home = fs.readFileSync('src/pages/Home.jsx', 'utf8');
const oldSEORegex = /<SEOMeta\s+title="Forge India Connect[^>]+>/s;
const newSEO = `<SEOMeta
        title="Forge India Connect | IT Solutions, Careers, Training & Business Growth"
        description="Forge India Connect is a premier IT, software, and recruitment company. We provide advanced IT solutions, web and mobile app development, job consulting, career guidance, banking career programs, student internships, real-time training, CRM/ERP solutions, and digital marketing services in Krishnagiri, Bangalore, and across India."
        keywords="Forge India Connect, IT company in Krishnagiri, IT company in Bangalore, top software development company, custom software development, web app development, mobile app development, CRM solutions, ERP solutions, business automation, digital marketing services, SEO agency, IT consulting, job portal, career guidance, banking careers, placement support, student internships, final year projects, real-time training programs, corporate training, recruitment agency, staffing solutions, HR services, B2B marketplace, tech startups India, cloud solutions provider, UI/UX design, tech education, online courses"
        canonical="/"
      />`;

if (home.match(oldSEORegex)) {
    home = home.replace(oldSEORegex, newSEO);
    fs.writeFileSync('src/pages/Home.jsx', home);
    console.log('Fixed SEO Keywords in Home.jsx');
}


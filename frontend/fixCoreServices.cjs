const fs = require('fs');
let c = fs.readFileSync('src/components/sections/CoreServices.jsx', 'utf8');

c = c.replace(
  "const services = [\n    { title: 'IT Solutions', desc: 'End-to-end technology solutions for businesses', icon: <Monitor size={24} />, size: 'large', path: '/it-solutions' },\n    { title: 'Job Consulting', desc: 'Connecting talent with top employers', icon: <Briefcase size={24} />, size: 'normal', path: '/job-consulting' },\n    { title: 'Career Guidance', desc: 'Expert advice for professional growth', icon: <TrendingUp size={24} />, size: 'normal', path: '/contact' },\n    { title: 'Banking Careers', desc: 'Opportunities in top private banks', icon: <Building2 size={24} />, size: 'normal', path: '/training-placement' },\n    { title: 'Student Programs', desc: 'Internships and Final-Year Projects', icon: <GraduationCap size={24} />, size: 'large', path: '/training-placement' },\n    { title: 'Digital Marketing', desc: 'SEO, Social Media & Brand Growth', icon: <Globe size={24} />, size: 'normal', path: '/digital-marketing' },\n    { title: 'Web Development', desc: 'Custom scalable web applications', icon: <Cloud size={24} />, size: 'normal', path: '/it-solutions' },\n    { title: 'Mobile Apps', desc: 'Native & cross-platform solutions', icon: <Smartphone size={24} />, size: 'normal', path: '/it-solutions' }\n  ];",
  `const services = [
    { title: 'IT Solutions', desc: 'End-to-end technology solutions for businesses', icon: <Monitor size={24} />, size: 'large', path: '/it-solutions' },
    { title: 'Job Consulting', desc: 'Connecting talent with top employers', icon: <Briefcase size={24} />, size: 'normal', path: '/job-consulting' },
    { title: 'Career Guidance', desc: 'Expert advice for professional growth', icon: <TrendingUp size={24} />, size: 'normal', path: '/training-placement' },
    { title: 'Banking Careers', desc: 'Opportunities in top private banks', icon: <Building2 size={24} />, size: 'normal', path: 'https://jobs.forgeindiaconnect.in' },
    { title: 'Student Programs', desc: 'Internships and Final-Year Projects', icon: <GraduationCap size={24} />, size: 'large', path: '/training-placement' },
    { title: 'Digital Marketing', desc: 'SEO, Social Media & Brand Growth', icon: <Globe size={24} />, size: 'normal', path: '/digital-marketing' },
    { title: 'Web Development', desc: 'Custom scalable web applications', icon: <Cloud size={24} />, size: 'normal', path: '/web-development' },
    { title: 'Mobile Apps', desc: 'Native & cross-platform solutions', icon: <Smartphone size={24} />, size: 'normal', path: '/app-development' }
  ];`
);

c = c.replace(
  `<Link to={svc.path} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-blue-800 mt-auto">\n                Learn More <ArrowRight size={14} />\n              </Link>`,
  `{svc.path.startsWith('http') ? (
                <a href={svc.path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-blue-800 mt-auto">
                  Learn More <ArrowRight size={14} />
                </a>
              ) : (
                <Link to={svc.path} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-blue-800 mt-auto">
                  Learn More <ArrowRight size={14} />
                </Link>
              )}`
);

fs.writeFileSync('src/components/sections/CoreServices.jsx', c);

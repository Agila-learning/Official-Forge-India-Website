import React, { useState } from 'react';
import { 
 BookOpen, Rocket, Layout, Settings, ShoppingBag, Bell, 
 HelpCircle, ChevronRight, Search, CheckCircle2, Monitor, 
 MapPin, ShieldCheck, CreditCard, PlayCircle, Download, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WebUsageGuide = () => {
 const [language, setLanguage] = useState('English');
 const [searchQuery, setSearchQuery] = useState('');
 const [activeAccordion, setActiveAccordion] = useState(null);
 const [completedSteps, setCompletedSteps] = useState([]);

 const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
 const userRole = userInfo.role || 'Customer';

 const getSupportEmail = () => {
   switch(userRole) {
     case 'Vendor':
     case 'Seller':
     case 'Stay Provider':
     case 'Ride Provider':
       return 'vendor-support@forgeindiaconnect.com';
     case 'Candidate':
       return 'careers@forgeindiaconnect.com';
     case 'Employer':
       return 'enterprise@forgeindiaconnect.com';
     case 'Admin':
     case 'Sub-Admin':
       return 'ops-center@forgeindiaconnect.com';
     default:
       return 'info@forgeindiaconnect.com';
   }
 };

 const translations = {
 English: {
 title: "Web Usage Guide",
 subtitle: "Master the FIC Ecosystem Operations",
 hero: "Mission Onboarding Progress",
 watch: "Watch Demo",
 download: "Download PDF",
 langLabel: "Language: English",
 langSwitch: "Tamil Version",
 faqTitle: "Knowledge Base (FAQ)",
 sections: [
 {
 id: 'getting-started',
 title: 'Getting Started',
 icon: <Rocket size={20} />,
 color: 'blue',
 steps: [
 { 
 title: 'Registration & Login', 
 desc: 'Create your FIC account by clicking "Register" on the header. Verify your email/mobile to gain tactical clearance.',
 icon: <Rocket size={16} />
 },
 { 
 title: 'Profile Optimization', 
 desc: 'Visit your Command Hub (Profile) to add your business details, address, and profile documents for verification.',
 icon: <Settings size={16} />
 }
 ]
 },
 {
 id: 'navigation',
 title: 'Navigation Guide',
 icon: <Layout size={20} />,
 color: 'indigo',
 steps: [
 { 
 title: 'Header Menu Hierarchy', 
 desc: 'Home (Central Hub), Explore (Marketplace/Jobs), and Services (IT/Business Solutions) are your primary navigation nodes.',
 icon: <Layout size={16} />
 },
 { 
 title: 'Location & Service Area', 
 desc: 'Click the Map Pin in the header to switch your regional context. This filters products available in your vicinity.',
 icon: <MapPin size={16} />
 }
 ]
 },
 {
 id: 'marketplace',
 title: 'Orders & Services',
 icon: <ShoppingBag size={20} />,
 color: 'amber',
 steps: [
 { 
 title: 'Browsing & Selection', 
 desc: 'Use the Industrial Shop to browse products or Home Services for booking certified experts.',
 icon: <Search size={16} />
 },
 { 
 title: 'Secure Checkout Flow', 
 desc: 'Select your mode (Delivery/Service), set your schedule window, and authorize payment via our secure gateway.',
 icon: <CreditCard size={16} />
 }
 ]
 },
 {
 id: 'notifications',
 title: 'Signals & Intelligence',
 icon: <Bell size={20} />,
 color: 'rose',
 steps: [
 { 
 title: 'Real-time Feed', 
 desc: 'Check the Intelligence Feed (Bell icon) for live updates on order status, assignments, and account alerts.',
 icon: <Bell size={16} />
 }
 ]
 },
 {
 id: 'vendors',
 title: 'For Vendors & Sellers',
 icon: <ShieldCheck size={20} />,
 color: 'emerald',
 steps: [
 { 
 title: 'Listing Protocols', 
 desc: 'Once approved, access your Merchant Dashboard to list products/services with custom serviceable pincodes.',
 icon: <ShoppingBag size={16} />
 },
 { 
 title: 'Order Management', 
 desc: 'Track incoming requisitions and manage fulfillment cycles directly from your dedicated portal.',
 icon: <CheckCircle2 size={16} />
 }
 ]
 }
 ],
 faqs: [
 { q: "How do I update my service location?", a: "Click the location pin in the main navigation bar and select your city or enter a new pincode." },
 { q: "What is the FIC Membership?", a: "A premium tier providing priority service, reduced fulfillment fees, and exclusive tactical discounts." },
 { q: "How to contact mission support?", a: "Use the 'Support' section below or visit the Help Desk for live agent interaction." }
 ]
 },
 Tamil: {
 title: "இணைய பயன்பாட்டு வழிகாட்டி",
 subtitle: "FIC சுற்றுச்சூழல் செயல்பாடுகளில் தேர்ச்சி பெறுங்கள்",
 hero: "பயிற்சி முன்னேற்றம்",
 watch: "டெமோ பார்க்க",
 download: "PDF பதிவிறக்கவும்",
 langLabel: "மொழி: தமிழ்",
 langSwitch: "English Version",
 faqTitle: "அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQ)",
 sections: [
 {
 id: 'getting-started',
 title: 'தொடங்குதல்',
 icon: <Rocket size={20} />,
 color: 'blue',
 steps: [
 { title: 'பதிவு மற்றும் உள்நுழைவு', desc: 'தலைப்பில் உள்ள "பதிவு" என்பதைக் கிளிக் செய்வதன் மூலம் உங்கள் FIC கணக்கை உருவாக்கவும்.', icon: <Rocket size={16} /> },
 { title: 'சுயவிவர மேம்படுத்தல்', desc: 'உங்கள் சுயவிவரத்தில் முகவரி மற்றும் ஆவணங்களைச் சேர்க்கவும்.', icon: <Settings size={16} /> }
 ]
 },
 {
 id: 'navigation',
 title: 'வழிசெலுத்தல் வழிகாட்டி',
 icon: <Layout size={20} />,
 color: 'indigo',
 steps: [
 { title: 'மெனு வரிசை', desc: 'முகப்பு, சந்தை மற்றும் சேவைகள் ஆகியவை உங்கள் முதன்மை வழிசெலுத்தல் புள்ளிகள்.', icon: <Layout size={16} /> },
 { title: 'இடம் மற்றும் சேவை பகுதி', desc: 'உங்கள் பகுதியைத் தேர்ந்தெடுக்க தலைப்பில் உள்ள வரைபடக் குறியீட்டைக் கிளிக் செய்யவும்.', icon: <MapPin size={16} /> }
 ]
 },
 {
 id: 'marketplace',
 title: 'ஆர்டர்கள் மற்றும் சேவைகள்',
 icon: <ShoppingBag size={20} />,
 color: 'amber',
 steps: [
 { title: 'உலாவல் மற்றும் தேர்வு', desc: 'பொருட்கள் அல்லது சேவைகளைத் தேட தொழில்துறை கடை அல்லது வீட்டுச் சேவைகளைப் பயன்படுத்தவும்.', icon: <Search size={16} /> },
 { title: 'பாதுகாப்பான கட்டணம்', desc: 'உங்கள் நேரத்தைத் தேர்ந்தெடுத்து, பாதுகாப்பான நுழைவாயில் வழியாகக் கட்டணம் செலுத்துங்கள்.', icon: <CreditCard size={16} /> }
 ]
 },
 {
 id: 'notifications',
 title: 'சிக்னல்கள் மற்றும் நுண்ணறிவு',
 icon: <Bell size={20} />,
 color: 'rose',
 steps: [
 { title: 'நிகழ்நேர ஊட்டம்', desc: 'ஆர்டர் நிலை, பணிகள் மற்றும் கணக்கு விழிப்பூட்டல்களின் நேரடி அறிவிப்புகளுக்கு நுண்ணறிவு ஊட்டத்தை (பெல் ஐகான்) சரிபார்க்கவும்.', icon: <Bell size={16} /> }
 ]
 },
 {
 id: 'vendors',
 title: 'விற்பனையாளர்கள் மற்றும் விற்பனையாளர்களுக்கு',
 icon: <ShieldCheck size={20} />,
 color: 'emerald',
 steps: [
 { title: 'பட்டியல் நெறிமுறைகள்', desc: 'அங்கீகரிக்கப்பட்டதும், தனிப்பயன் சேவை செய்யக்கூடிய பின்கோடுகளுடன் தயாரிப்புகள்/சேவைகளை பட்டியலிட உங்கள் வணிகர் டாஷ்போர்டை அணுகவும்.', icon: <ShoppingBag size={16} /> },
 { title: 'ஆர்டர் மேலாண்மை', desc: 'உள்வரும் கோரிக்கைகளைக் கண்காணித்து, உங்கள் பிரத்யேக போர்ட்டலில் இருந்து நேரடியாக நிறைவேற்றும் சுழற்சிகளை நிர்வகிக்கவும்.', icon: <CheckCircle2 size={16} /> }
 ]
 }
 ],
 faqs: [
 { q: "எனது சேவை இருப்பிடத்தை எவ்வாறு புதுப்பிப்பது?", a: "பிரதான வழிசெலுத்தல் பட்டியில் உள்ள இருப்பிடக் குறியீட்டைக் கிளிக் செய்து உங்கள் நகரத்தைத் தேர்ந்தெடுக்கவும் அல்லது புதிய பின்கோடை உள்ளிடவும்." },
 { q: "FIC மெம்பர்ஷிப் என்றால் என்ன?", a: "முன்னுரிமை சேவை, குறைக்கப்பட்ட கட்டணங்கள் மற்றும் பிரத்யேக தள்ளுபடிகளை வழங்கும் பிரீமியம் அடுக்கு." },
 { q: "மிஷன் ஆதரவை எவ்வாறு தொடர்புகொள்வது?", a: "கீழே உள்ள 'ஆதரவு' பகுதியைத் தொடர்பு கொள்ளவும் அல்லது நேரடி உதவிக்கு உதவி மையத்தைப் பார்வையிடவும்." }
 ]
 }
 };

 const currentContent = translations[language];
 const totalSteps = currentContent.sections.reduce((acc, s) => acc + s.steps.length, 0);
 const progress = Math.round((completedSteps.length / totalSteps) * 100);

 const toggleStep = (stepTitle) => {
 setCompletedSteps(prev => 
 prev.includes(stepTitle) 
 ? prev.filter(s => s !== stepTitle) 
 : [...prev, stepTitle]
 );
 };

 const filteredSections = currentContent.sections.filter(s => 
 s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
 s.steps.some(st => st.title.toLowerCase().includes(searchQuery.toLowerCase()))
 );

 return (
 <div className="space-y-10 py-6 max-w-5xl mx-auto px-4 font-sans">
 
 {/* Header & Search */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div className="text-left">
 <span className="section-eyebrow text-primary bg-primary/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block">Support Protocol</span>
 <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">{currentContent.title.split(' ').map((word, i) => i === currentContent.title.split(' ').length - 1 ? <span key={i} className="text-primary">{word}</span> : word + ' ')}</h2>
 <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2">{currentContent.subtitle}</p>
 </div>
 
 <div className="relative group w-full md:w-80">
 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
 <input 
 type="text" 
 placeholder="Search help topics..." 
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-16 pr-6 py-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm shadow-sm"
 />
 </div>
 </div>

 {/* Progress Tracker */}
 <div className="bg-primary/5 dark:bg-primary/10 p-6 md:p-8 rounded-[2.5rem] border border-primary/10 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-primary/5">
 <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
 <svg className="w-full h-full -rotate-90">
 <circle cx="48" cy="48" r="40" className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="8" fill="none" />
 <circle cx="48" cy="48" r="40" className="stroke-primary" strokeWidth="8" fill="none" strokeDasharray={251} strokeDashoffset={251 - (251 * progress) / 100} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
 </svg>
 <span className="absolute font-black text-xl text-primary">{progress}%</span>
 </div>
 <div className="text-center md:text-left">
 <h4 className="text-lg font-black uppercase tracking-tight">{currentContent.hero}</h4>
 <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Complete all steps to fully authorize your mission capabilities.</p>
 <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
 <button 
 onClick={() => toast('Mission Briefing: Demo Video Coming Soon', { icon: '📽️' })}
 className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
 >
 <PlayCircle size={14} className="text-primary" /> {currentContent.watch}
 </button>
 <button 
 onClick={() => {
 const link = document.createElement('a');
 link.href = '/FIC_Usage_Guide.pdf';
 link.download = 'FIC_Usage_Guide.pdf';
 link.click();
 toast.success('Initiating Guide Transfer...');
 }}
 className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
 >
 <Download size={14} className="text-secondary" /> {currentContent.download}
 </button>
 </div>
 </div>
 </div>

 {/* Steps Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
 {filteredSections.map((section, idx) => (
 <motion.div 
 key={section.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: idx * 0.1 }}
 className="group glass-card p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all"
 >
 <div className={`w-14 h-14 bg-${section.color}-100 dark:bg-${section.color}-900/10 rounded-2xl flex items-center justify-center text-${section.color}-600 mb-8 transition-transform group-hover:scale-110`}>
 {section.icon}
 </div>
 <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">{section.title}</h3>
 
 <div className="space-y-6 text-left">
 {section.steps.map((step, sIdx) => {
 const isCompleted = completedSteps.includes(step.title);
 return (
 <div key={step.title} className="relative pl-10">
 <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-gray-100 dark:border-gray-800 flex items-center justify-center cursor-pointer hover:border-primary transition-colors" onClick={() => toggleStep(step.title)}>
 {isCompleted && <CheckCircle2 size={14} className="text-primary" />}
 </div>
 <div>
 <h5 className={`text-xs font-black uppercase tracking-widest mb-1 ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
 Step {sIdx + 1}: {step.title}
 </h5>
 <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{step.desc}</p>
 </div>
 </div>
 );
 })}
 </div>
 </motion.div>
 ))}
 </div>

 {/* Accordion FAQ */}
 <div className="mt-12 bg-gray-50 dark:bg-dark-bg p-8 md:p-12 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-inner">
 <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-8 text-center flex items-center justify-center gap-3">
 <HelpCircle size={28} className="text-secondary" /> {currentContent.faqTitle}
 </h3>
 <div className="space-y-4 max-w-3xl mx-auto">
 {currentContent.faqs.map((faq, i) => (
 <div key={i} className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all">
 <button 
 onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
 className="w-full px-8 py-6 flex items-center justify-between text-left"
 >
 <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{faq.q}</span>
 <ChevronRight size={18} className={`text-gray-400 transition-transform ${activeAccordion === i ? 'rotate-90 text-primary' : ''}`} />
 </button>
 <AnimatePresence>
 {activeAccordion === i && (
 <motion.div 
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="overflow-hidden"
 >
 <div className="px-8 pb-8 pt-2 text-left">
 <p className="text-xs text-gray-500 font-bold uppercase leading-relaxed border-t border-gray-50 dark:border-gray-800 pt-6">
 {faq.a}
 </p>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 ))}
 </div>
 </div>

 {/* Support CTA */}
 <div className="flex flex-col md:flex-row gap-6">
 <div className="flex-1 p-8 rounded-[2.5rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20 group cursor-pointer hover:scale-[1.02] transition-all text-left">
 <FileText size={32} className="mb-6 opacity-80 group-hover:scale-110 transition-transform" />
 <h4 className="text-xl font-black uppercase tracking-tight">Need Advanced Help?</h4>
 <p className="text-xs text-white/70 font-bold uppercase tracking-widest mt-2 mb-6">Connect with our strategic support division for specialized assistance.</p>
  <button 
    onClick={() => window.location.href = `mailto:${getSupportEmail()}?subject=Support Request - ${userRole} Context`}
    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-8 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-all border border-white/20"
  >
    Contact Support <ChevronRight size={14} />
  </button>
 </div>
 <div className="flex-1 p-8 rounded-[2.5rem] bg-secondary text-dark-bg shadow-2xl shadow-secondary/20 group cursor-pointer hover:scale-[1.02] transition-all text-left">
 <Monitor size={32} className="mb-6 opacity-80 group-hover:scale-110 transition-transform" />
 <h4 className="text-xl font-black uppercase tracking-tight">{currentContent.langLabel}</h4>
 <p className="text-xs text-dark-bg/60 font-bold uppercase tracking-widest mt-2 mb-6">Switch to local language for better understanding of FIC operations.</p>
 <button 
 onClick={() => setLanguage(language === 'English' ? 'Tamil' : 'English')}
 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-8 py-3 bg-dark-bg/10 rounded-full hover:bg-dark-bg/20 transition-all border border-dark-bg/10"
 >
 {currentContent.langSwitch} <ChevronRight size={14} />
 </button>
 </div>
 </div>

 </div>
 );
};

export default WebUsageGuide;

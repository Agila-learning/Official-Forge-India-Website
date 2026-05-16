import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, ChevronRight, BookOpen, MessageCircle, AlertCircle, Map, Briefcase, Zap, ShieldCheck } from 'lucide-react';

const roleGuides = {
 Admin: {
 en: {
 title: 'Administrator Guide',
 steps: [
 { title: 'Dashboard Overview', desc: 'Monitor platform health, active users, and system alerts from the main hub.' },
 { title: 'User Management', desc: 'Approve or suspend vendors and service partners under "Users & Partners".' },
 { title: 'Service Inquiries', desc: 'Track and resolve customer inquiries and consulting requests.' },
 ],
 tips: ['Always verify KYC documents before approving vendors.', 'Use the global search to quickly locate specific orders.']
 },
 ta: {
 title: 'நிர்வாகி வழிகாட்டி',
 steps: [
 { title: 'கட்டுப்பாட்டு அறை', desc: 'தளத்தின் நிலை மற்றும் கணினி விழிப்பூட்டல்களை கண்காணிக்கவும்.' },
 { title: 'பயனர் மேலாண்மை', desc: 'விற்பனையாளர்கள் மற்றும் சேவை கூட்டாளர்களை அங்கீகரிக்கவும்.' },
 { title: 'சேவை விசாரணைகள்', desc: 'வாடிக்கையாளர் கோரிக்கைகளை கண்காணிக்கவும் மற்றும் தீர்க்கவும்.' },
 ],
 tips: ['விற்பனையாளர்களை அங்கீகரிக்கும் முன் KYC ஆவணங்களை சரிபார்க்கவும்.', 'குறிப்பிட்ட ஆர்டர்களை விரைவாகக் கண்டறிய தேடலைப் பயன்படுத்தவும்.']
 }
 },
 Vendor: {
 en: {
 title: 'Vendor Partner Guide',
 steps: [
 { title: 'Listing Services', desc: 'Add your services and products through the Inventory tab.' },
 { title: 'Order Fulfillment', desc: 'Accept and process new orders from the Orders dashboard.' },
 { title: 'Payments', desc: 'Track your earnings and settlement cycles in the Billing section.' },
 ],
 tips: ['Update your availability regularly to avoid declined orders.', 'Respond to customer inquiries within 2 hours for better ratings.']
 },
 ta: {
 title: 'விற்பனையாளர் வழிகாட்டி',
 steps: [
 { title: 'சேவை பட்டியல்', desc: 'உங்கள் சேவைகள் மற்றும் தயாரிப்புகளைச் சேர்க்கவும்.' },
 { title: 'ஆர்டர் செயலாக்கம்', desc: 'புதிய ஆர்டர்களை ஏற்றுக்கொண்டு செயலாக்கவும்.' },
 { title: 'பணம் செலுத்துதல்', desc: 'உங்கள் வருவாய் மற்றும் பில்லிங் பிரிவைக் கண்காணிக்கவும்.' },
 ],
 tips: ['ஆர்டர்கள் நிராகரிக்கப்படுவதைத் தவிர்க்க, உங்கள் இருப்பை அடிக்கடி புதுப்பிக்கவும்.']
 }
 },
 "Delivery Partner": {
 en: {
 title: 'Delivery Mission Guide',
 steps: [
 { title: 'Active Missions', desc: 'View your current delivery tasks and optimized routes.' },
 { title: 'Status Updates', desc: 'Mark pickups and drop-offs to keep customers notified.' },
 { title: 'Support', desc: 'Contact fleet support instantly using the SOS/Support tab.' },
 ],
 tips: ['Keep your location services ON for accurate dispatching.', 'Ensure you carry proper ID and uniform during duty.']
 },
 ta: {
 title: 'டெலிவரி கூட்டாளர் வழிகாட்டி',
 steps: [
 { title: 'பணிகள்', desc: 'உங்கள் தற்போதைய டெலிவரி பணிகள் மற்றும் வழிகளைக் காண்க.' },
 { title: 'நிலை புதுப்பிப்புகள்', desc: 'பிக்கப் மற்றும் டிராப்-ஆஃப் குறித்து வாடிக்கையாளர்களுக்குத் தெரிவிக்கவும்.' },
 { title: 'ஆதரவு', desc: 'உடனடி உதவிக்கு ஆதரவு தாவலைப் பயன்படுத்தவும்.' },
 ],
 tips: ['துல்லியமான வழிகாட்டுதலுக்கு இருப்பிடச் சேவைகளை ஆன் செய்து வைக்கவும்.']
 }
 },
 Customer: {
 en: {
 title: 'Platform User Guide',
 steps: [
 { title: 'Explore Services', desc: 'Find local professionals, products, and consulting services.' },
 { title: 'Booking', desc: 'Schedule a service or purchase products securely.' },
 { title: 'Track Order', desc: 'Monitor your service request or delivery in real-time.' },
 ],
 tips: ['Check out our subscription plans for zero delivery fees!', 'Leave reviews to help others find the best services.']
 },
 ta: {
 title: 'பயனர் வழிகாட்டி',
 steps: [
 { title: 'சேவைகளை ஆராயுங்கள்', desc: 'உள்ளூர் தொழில் வல்லுநர்கள் மற்றும் சேவைகளைக் கண்டறியவும்.' },
 { title: 'பதிவு செய்தல்', desc: 'ஒரு சேவையை திட்டமிடுங்கள் அல்லது பாதுகாப்பாகப் பொருட்களை வாங்குங்கள்.' },
 { title: 'ஆர்டரைக் கண்காணிக்கவும்', desc: 'உங்கள் ஆர்டரை நிகழ்நேரத்தில் கண்காணிக்கவும்.' },
 ],
 tips: ['சிறந்த சேவைகளைக் கண்டறிய மற்றவர்களுக்கு உதவ மதிப்பாய்வுகளை வழங்கவும்.']
 }
 }
};

const RoleGuide = () => {
 const [isOpen, setIsOpen] = useState(false);
 const [lang, setLang] = useState('en');
 
 const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
 const role = userInfo.role || 'Customer';
 
 // Fallback to Customer guide if role not strictly defined
 const guideData = roleGuides[role] || roleGuides['Customer'];
 const content = guideData[lang];

 const getSupportContact = () => {
   switch(role) {
     case 'Admin': case 'Sub-Admin': return 'ops-center@forgeindiaconnect.com';
     case 'Vendor': case 'Seller': return 'vendor-support@forgeindiaconnect.com';
     case 'Candidate': return 'careers@forgeindiaconnect.com';
     case 'Delivery Partner': return 'logistics@forgeindiaconnect.com';
     default: return 'info@forgeindiaconnect.com';
   }
 };

 return (
 <>
 {/* Floating Action Button */}
 <motion.button
 whileHover={{ scale: 1.1 }}
 whileTap={{ scale: 0.9 }}
 onClick={() => setIsOpen(true)}
 className="fixed bottom-10 left-10 w-14 h-14 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full shadow-2xl flex items-center justify-center text-white z-[999] hover:shadow-indigo-500/50 transition-shadow"
 >
 <HelpCircle size={28} />
 </motion.button>

 {/* Guide Modal */}
 <AnimatePresence>
 {isOpen && (
 <>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setIsOpen(false)}
 className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000]"
 />
 
 <motion.div
 initial={{ opacity: 0, y: 50, scale: 0.9 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 50, scale: 0.9 }}
 className="fixed bottom-28 left-10 w-[380px] max-w-[calc(100vw-3rem)] bg-white dark:bg-dark-card rounded-[2rem] shadow-3xl z-[1001] overflow-hidden border border-gray-100 dark:border-gray-800"
 >
 {/* Header */}
 <div className="p-6 bg-gradient-to-br from-indigo-600 to-violet-600 text-white relative">
 <button 
 onClick={() => setIsOpen(false)}
 className="absolute top-6 right-6 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
 >
 <X size={16} />
 </button>
 
 <div className="flex items-center gap-3 mb-4">
 <div className="p-2 bg-white/20 rounded-xl">
 <BookOpen size={24} />
 </div>
 <div>
 <h3 className="font-black uppercase tracking-widest text-sm">{content.title}</h3>
 <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">FIC Official Support</p>
 </div>
 </div>

 {/* Language Toggle */}
 <div className="flex bg-white/10 rounded-lg p-1 w-fit border border-white/20">
 <button 
 onClick={() => setLang('en')}
 className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${lang === 'en' ? 'bg-white text-indigo-600' : 'text-white/70 hover:text-white'}`}
 >
 English
 </button>
 <button 
 onClick={() => setLang('ta')}
 className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${lang === 'ta' ? 'bg-white text-indigo-600' : 'text-white/70 hover:text-white'}`}
 >
 தமிழ்
 </button>
 </div>
 </div>

 {/* Content Body */}
 <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
 
 {/* Steps Timeline */}
 <div className="space-y-6 mb-8 relative">
 <div className="absolute left-4 top-2 bottom-2 w-px bg-gray-100 dark:bg-gray-800"></div>
 
 {content.steps.map((step, idx) => (
 <div key={idx} className="relative pl-10">
 <div className="absolute left-2 top-1 w-5 h-5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-black border border-white dark:border-dark-card shadow-sm">
 {idx + 1}
 </div>
 <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{step.title}</h4>
 <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
 </div>
 ))}
 </div>

 {/* Pro Tips */}
 <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4">
 <div className="flex items-center gap-2 mb-3">
 <Zap size={16} className="text-amber-500" />
 <h5 className="font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest text-[10px]">Pro Tips</h5>
 </div>
 <ul className="space-y-2">
 {content.tips.map((tip, idx) => (
 <li key={idx} className="text-xs text-amber-800 dark:text-amber-400/80 flex items-start gap-2 font-medium">
 <span className="mt-1 w-1 h-1 bg-amber-400 rounded-full shrink-0" />
 {tip}
 </li>
 ))}
 </ul>
 </div>
 </div>
 
 {/* Footer */}
 <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg flex justify-between items-center">
 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Need more help?</p>
 <a 
 href={`mailto:${getSupportContact()}?subject=Support Request - ${role}`}
 onClick={() => setIsOpen(false)}
 className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">
 Contact Support
 </a>
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 </>
 );
};

export default RoleGuide;

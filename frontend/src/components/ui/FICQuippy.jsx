import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bot, X, Send, Sparkles, ArrowRight, LogIn, ChevronRight,
  Briefcase, Building2, Monitor, Landmark, ShieldCheck, ShoppingBag,
  Headphones, Globe, Megaphone, Home, PaintBucket, Wrench,
  UserPlus, Store, FileText, HelpCircle, Zap, MessageSquare
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   FIC QUIPPY — Intelligent AI Chatbot for Forge India Connect
   ═══════════════════════════════════════════════════════════════════ */

// ─── SERVICE KNOWLEDGE BASE ───────────────────────────────────────
const SERVICES = {
  it_solutions: {
    title: 'IT Solutions',
    icon: Globe,
    color: 'from-indigo-500 to-blue-400',
    desc: 'FIC delivers end-to-end IT solutions — website development, mobile app development, CRM/ERP solutions, and custom software. We turn your business ideas into powerful digital products.',
    keywords: ['it solution', 'website', 'web development', 'mobile app', 'app development', 'crm', 'ecommerce', 'api', 'custom software'],
    route: '/services/website-development',
    category: 'solutions'
  },
  digital_marketing: {
    title: 'Digital Marketing',
    icon: Megaphone,
    color: 'from-yellow-500 to-orange-400',
    desc: 'Our digital marketing services include SEO, social media marketing, PPC advertising, and brand strategy. We help businesses grow their online presence and acquire customers.',
    keywords: ['digital marketing', 'seo', 'social media', 'ppc', 'advertising', 'branding', 'lead generation'],
    route: '/services/digital-marketing',
    category: 'solutions'
  },
  it_consulting: {
    title: 'IT Consulting',
    icon: Monitor,
    color: 'from-blue-500 to-cyan-400',
    desc: 'Expert IT consulting for software development, system integration, and technology strategy. We help businesses modernize their tech stack.',
    keywords: ['it', 'software', 'technology', 'tech', 'it consulting', 'developer'],
    route: '/jobs',
    category: 'consulting'
  },
  insurance: {
    title: 'Insurance Consulting',
    icon: ShieldCheck,
    color: 'from-violet-500 to-purple-400',
    desc: 'Specialized insurance consulting for life, health, and general insurance. Get a custom quote for your protection needs.',
    keywords: ['insurance', 'life insurance', 'health insurance', 'policy', 'premium', 'lic'],
    route: '/services/insurance-services',
    category: 'consulting'
  },
  banking: {
    title: 'Banking & Finance',
    icon: Landmark,
    color: 'from-emerald-500 to-green-400',
    desc: 'Connecting professionals with top financial institutions. Consulting in retail banking, corporate banking, and financial compliance.',
    keywords: ['bank', 'banking', 'finance', 'loan', 'credit', 'investment'],
    route: '/jobs',
    category: 'consulting'
  }
};

// ─── PLATFORM FEATURES (require login) ─────────────────────────────
const PLATFORM_FEATURES = {
  post_jobs: {
    title: 'Post Jobs',
    icon: FileText,
    desc: 'As an Employer, you can post unlimited job listings, manage applications, schedule interviews, and track your hiring pipeline — all from your Employer Dashboard.',
    keywords: ['post job', 'job posting', 'hire', 'hiring', 'recruit', 'employer', 'vacancy', 'opening', 'advertise job'],
    route: '/employer',
    requiresLogin: true,
    requiredRole: 'Employer',
    loginMessage: 'Please login or register as an Employer to post jobs.'
  },
  apply_jobs: {
    title: 'Apply for Jobs',
    icon: Briefcase,
    desc: 'Browse thousands of job openings across IT, Non-IT, Banking, Insurance, BPO, and more. Apply instantly as a Candidate, track your applications, and get interview notifications.',
    keywords: ['apply job', 'job apply', 'find job', 'search job', 'looking for job', 'need job', 'want job', 'career', 'opportunity', 'resume', 'cv', 'candidate'],
    route: '/explore-jobs',
    requiresLogin: false,
    loginForApply: true,
    loginMessage: 'You can browse jobs without login, but you need to register as a Candidate to apply.'
  },
  vendor_access: {
    title: 'Vendor Access',
    icon: Store,
    desc: 'Request vendor access to host your products and services on the FIC marketplace. As a Vendor, you get your own dashboard to manage inventory, orders, pricing, and customer interactions.',
    keywords: ['vendor', 'vendor access', 'sell', 'seller', 'list product', 'host product', 'marketplace', 'shop', 'store'],
    route: '/register',
    requiresLogin: true,
    requiredRole: 'Vendor',
    loginMessage: 'Register as a Vendor to get access to the Vendor Dashboard and start selling.'
  },
  host_products: {
    title: 'Host Products',
    icon: ShoppingBag,
    desc: 'Vendors can list and manage products on our marketplace. Showcase your products with images, pricing, descriptions, and get orders from thousands of customers across India.',
    keywords: ['host product', 'add product', 'product listing', 'sell product', 'my product', 'inventory'],
    route: '/vendor',
    requiresLogin: true,
    requiredRole: 'Vendor',
    loginMessage: 'Login as a Vendor to manage and host your products.'
  },
  home_services: {
    title: 'Home Services',
    icon: Home,
    desc: 'We provide professional home services including cleaning, painting, plumbing, electrical work, carpentry, pest control, and more. Book services instantly through our platform!',
    keywords: ['home service', 'cleaning', 'painting', 'plumber', 'plumbing', 'electrician', 'painter', 'cleaner', 'electrical', 'carpentry', 'pest control', 'house maintenance', 'repair', 'handyman'],
    route: '/home-services',
    requiresLogin: false
  },
  host_services: {
    title: 'Host Services',
    icon: Wrench,
    desc: 'Service providers can register as Vendors and list home services like cleaning, painting, AC repair, and more. Get bookings from local customers and grow your service business.',
    keywords: ['host service', 'provide service', 'service provider', 'offer service', 'register service', 'list service', 'become a vendor', 'be a vendor', 'merchant'],
    route: '/register',
    requiresLogin: true,
    requiredRole: 'Vendor',
    loginMessage: 'Register as a Vendor to list your services on our platform.'
  },
  registration: {
    title: 'Registration & Membership',
    icon: UserPlus,
    desc: 'Join the FIC ecosystem! 🚀 Register as a Candidate for jobs, an Employer for hiring, or a Vendor to sell products and services.',
    keywords: ['join', 'registration', 'register', 'membership', 'sign up', 'create account', 'how to join', 'become a member', 'be a part of'],
    route: '/register',
    requiresLogin: false
  },
  map_support: {
    title: 'Map & Location Hub',
    icon: Globe,
    desc: 'Need help pinning your shop? 📍 Make sure your shop location is precise on the FIC map during vendor registration to help customers find you easily.',
    keywords: ['map', 'location', 'pin', 'gps', 'address', 'pinning', 'marker', 'find shop', 'shop location'],
    route: '/register',
    requiresLogin: false
  }
};

// ─── INTENT DETECTION ──────────────────────────────────────────────
const INTENTS = {
  greeting: {
    patterns: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'sup', 'hola', 'namaste', 'vanakkam'],
    response: () => ({
      text: `Hello! 👋 Welcome to **Forge India Connect**!\n\nI'm **FIC Quippy**, your personal assistant. I can help you with:\n\n🏢 **Job Consulting** — IT, Banking, Non-IT, Insurance, BPO\n💻 **IT Solutions & Digital Marketing**\n🛍️ **Atomy Product Marketing**\n🏠 **Home Services** — Cleaning, Painting & more\n📋 **Platform Actions** — Post/Apply jobs, Vendor access\n\nWhat would you like to know about?`,
      quickReplies: ['Job Consulting', 'IT Solutions', 'Home Services', 'Post a Job', 'Apply for Jobs', 'Atomy Products', 'All Services']
    })
  },
  about_fic: {
    patterns: ['what is fic', 'about fic', 'forge india', 'what do you do', 'what services', 'tell me about', 'what is forge india connect', 'what you offer', 'your company', 'company info', 'all services', 'what do you provide', 'provide services', 'fic provide', 'services provided'],
    response: () => ({
      text: `**Forge India Connect (FIC)** is a Technology-First IT Solutions company! 🇮🇳\n\nHere's what we specialize in:\n\n**💻 IT & Digital Solutions:**\n• Web & Mobile App Development\n• Enterprise Software (ERP/CRM)\n• AI & Machine Learning Solutions\n• UI/UX Design & Branding\n• Digital Marketing & SEO\n\n**📋 Consulting Services:**\n• IT Consulting\n• Banking & Finance\n• Insurance Consulting\n• BPO Services\n\n**🏠 Home Services:**\n• Cleaning, Painting, & Maintenance\n\nWhat can I help you build or find today? 👇`,
      quickReplies: ['Web Development', 'App Development', 'IT Consulting', 'Digital Marketing', 'Insurance', 'Apply for Jobs']
    })
  },
  thanks: {
    patterns: ['thank', 'thanks', 'thank you', 'thx', 'appreciated', 'helpful', 'great help'],
    response: () => ({
      text: `You're welcome! 😊 I'm always here to help.\n\nIs there anything else you'd like to know about Forge India Connect?`,
      quickReplies: ['All Services', 'Apply for Jobs', 'Contact Us']
    })
  },
  bye: {
    patterns: ['bye', 'goodbye', 'see you', 'later', 'take care', 'gtg'],
    response: () => ({
      text: `Goodbye! 👋 Thank you for visiting **Forge India Connect**.\n\nRemember, we're here whenever you need career guidance, business solutions, or home services. Have a great day! 🌟`,
      quickReplies: []
    })
  },
  help: {
    patterns: ['help', 'support', 'assist', 'guide', 'how to', 'need help', 'confused', 'don\'t know', 'not sure'],
    response: () => ({
      text: `I'm here to help! 🤝 Here's what I can assist you with:\n\n**🔍 Explore Services:**\nAsk me about IT, Banking, Insurance, BPO, or any consulting.\n\n**💼 Job Actions:**\n• "I want to apply for a job"\n• "I want to post a job"\n• "Show IT jobs"\n\n**🏠 Home Services:**\n• "I need cleaning service"\n• "I need a painter"\n\n**🏪 Vendor/Business:**\n• "How to become a vendor?"\n• "I want to sell products"\n\nJust type your question naturally, and I'll guide you! 💬`,
      quickReplies: ['Job Consulting', 'Home Services', 'Become a Vendor', 'Apply for Jobs']
    })
  },
  contact: {
    patterns: ['contact', 'phone', 'email', 'reach', 'call', 'whatsapp', 'talk to human', 'real person', 'speak to someone'],
    response: () => ({
      text: `📞 **Contact Forge India Connect:**\n\n📱 **WhatsApp:** +91 6369406416\n📧 **Email:** info@forgeindiaconnect.com\n🌐 **Website:** forgeindia.com\n\nOur team is available Monday–Saturday, 9 AM to 7 PM IST.\n\nYou can also visit our **About Us** page for more details.`,
      quickReplies: ['About Us', 'FAQ'],
      actions: [
        { label: 'About Us', route: '/about', icon: 'info' },
        { label: 'FAQ', route: '/faq', icon: 'help' }
      ]
    })
  },
  faq: {
    patterns: ['faq', 'frequently asked', 'common question'],
    response: () => ({
      text: `Great question! We have a comprehensive FAQ section that covers everything from registration to service delivery. Let me take you there! 📋`,
      actions: [{ label: 'View FAQ', route: '/faq', icon: 'help' }]
    })
  },
  issue_support: {
    patterns: ['problem', 'issue', 'not working', 'complaint', 'bad service', 'wrong item', 'refund', 'delay', 'failed', 'broken', 'damage', 'unhappy', 'dissatisfied'],
    response: () => ({
      text: `I'm genuinely sorry to hear that you're facing an issue. 🕊️ Please stay calm — I'm here to ensure we get this resolved for you right away.\n\nTo help you faster, could you tell me if the issue is with:\n\n🛠️ **A Home Service/Consulting** (Cleaning, Painting, IT, Banking)\n🛍️ **A Marketplace Product/Order** (from a Vendor shop)\n\nI'll provide the direct contact details for the respective team immediately.`,
      quickReplies: ['Service Issue', 'Product Issue', 'Technical Help', 'Talk to Human']
    })
  }
};

// ─── THEME COLORS ──────────────────────────────────────────────────
const QUIPPY_GRADIENT = 'from-[#6366f1] via-[#8b5cf6] to-[#a78bfa]';
const QUIPPY_BG = '#0c0f1a';
const QUIPPY_CARD = '#131729';

// ─── HELPER: detect intent from user message ─────────────────────
function detectIntent(message) {
  const lowerMsg = message.toLowerCase().trim();
  let bestMatch = { type: 'unknown', score: 0 };

  const checkMatches = (collection, type) => {
    for (const [key, item] of Object.entries(collection)) {
      const patterns = item.patterns || item.keywords || [];
      for (const pattern of patterns) {
        if (lowerMsg.includes(pattern.toLowerCase())) {
          // Score by length of pattern matched to get the most specific one
          if (pattern.length > bestMatch.score) {
            bestMatch = { type, key, data: item, score: pattern.length };
          }
        }
      }
    }
  };

  // Check categories with priority (Platform features > Services > Intents)
  checkMatches(PLATFORM_FEATURES, 'platform_feature');
  checkMatches(SERVICES, 'service');
  checkMatches(INTENTS, 'intent');

  if (bestMatch.type !== 'unknown') {
    return bestMatch;
  }

  // 4. Catch-all: job-related keywords
  if (/\b(job|work|employ|career|opening|vacancy|position|hiring|recruit)\b/i.test(lowerMsg)) {
    return { type: 'service', key: 'it_consulting', data: SERVICES.it_consulting, isGenericJob: true };
  }

  // 5. Catch-all: marketplace/marketing keywords
  if (/\b(market|sell|product|atomy|shop|ecommerce|e-commerce)\b/i.test(lowerMsg)) {
    return { type: 'service', key: 'atomy', data: SERVICES.atomy };
  }

  return { type: 'unknown' };
}

// ─── HELPER: build response from intent ──────────────────────────
function buildResponse(intent, userInfo) {
  const isLoggedIn = !!userInfo;

  if (intent.type === 'service') {
    const s = intent.data;
    const Icon = s.icon;
    const isGenericJob = intent.isGenericJob;

    let text = isGenericJob
      ? `Looking for job opportunities? 💼 We have multiple consulting verticals!\n\nHere's what we cover:\n• **IT Consulting** — Tech roles\n• **Banking & Finance** — BFSI roles\n• **Non-IT Consulting** — Operations, HR, Admin\n• **Insurance** — Agents, Advisors\n• **BPO Services** — Voice & Non-voice\n\nWhich area interests you?`
      : `**${s.title}** ${s.category === 'consulting' ? '📋' : s.category === 'products' ? '🛍️' : '💻'}\n\n${s.desc}\n\nWould you like to explore this further?`;

    return {
      text,
      quickReplies: isGenericJob
        ? ['IT Jobs', 'Banking Jobs', 'Non-IT Jobs', 'Insurance Jobs', 'BPO Jobs', 'Apply for Jobs']
        : ['Explore Now', 'Other Services', 'Apply for Jobs'],
      actions: [{ label: `Explore ${s.title}`, route: s.route, icon: 'arrow' }],
      serviceCard: isGenericJob ? null : { title: s.title, color: s.color, iconKey: intent.key }
    };
  }

  if (intent.type === 'platform_feature') {
    const f = intent.data;
    
    if (f.requiresLogin && !isLoggedIn) {
      return {
        text: `**${f.title}** 🔐\n\n${f.desc}\n\n⚠️ **Login Required:** ${f.loginMessage}`,
        quickReplies: ['Login', 'Register', 'Other Services'],
        actions: [
          { label: 'Login Now', route: '/login', icon: 'login' },
          { label: 'Register', route: '/register', icon: 'register' }
        ],
        requiresAuth: true
      };
    }

    if (f.loginForApply && !isLoggedIn) {
      return {
        text: `**${f.title}** 💼\n\n${f.desc}\n\n💡 **Tip:** You can browse jobs without an account, but register as a Candidate to apply and track applications.`,
        quickReplies: ['Browse Jobs', 'Register as Candidate', 'Other Services'],
        actions: [
          { label: 'Browse Jobs', route: f.route, icon: 'arrow' },
          { label: 'Register', route: '/register', icon: 'register' }
        ]
      };
    }

    return {
      text: `**${f.title}** ✅\n\n${f.desc}`,
      quickReplies: ['Go There', 'Other Services'],
      actions: [{ label: `Open ${f.title}`, route: f.route, icon: 'arrow' }]
    };
  }

  if (intent.type === 'intent' && intent.key === 'issue_support') {
    // Special handling for calm personality
    const lowerMsg = intent.originalMessage?.toLowerCase() || '';
    
    // Check if it's a specific service issue
    if (/\b(clean|paint|plumb|electric|repair|maintenance|it|consult|bank|insurance)\b/i.test(lowerMsg)) {
      return {
        text: `I understand this is frustrating. 🕊️ For issues related to **FIC Home Services** or **Consulting**, our Mission Support Team is handling this with priority.\n\n📞 **FIC Hub Support:** +91 6369406416\n📧 **Official Email:** info@forgeindiaconnect.com\n\nPlease reach out directly, and we will dispatch a resolution team immediately.`,
        quickReplies: ['Call Now', 'Send Email', 'All Services'],
        actions: [{ label: 'Email Support', route: 'mailto:info@forgeindiaconnect.com', icon: 'info' }]
      };
    }

    // Check if it's a vendor product issue
    if (/\b(product|shop|order|item|delivery|vendor|seller)\b/i.test(lowerMsg)) {
      return {
        text: `I'm sorry you're having trouble with a marketplace item. 🕊️ For issues with **Vendor Products**, you should contact the **Concern Shop** directly for the fastest resolution.\n\nSteps to find their number:\n1. Go to **My Orders** in your dashboard.\n2. Tap the Order details.\n3. You will see the **Vendor Contact Number** listed there.\n\nIf the vendor does not respond within 24 hours, please escalate to FIC Support!`,
        quickReplies: ['My Orders', 'FIC Support', 'Shop Again'],
        actions: [{ label: 'Go to My Orders', route: '/dashboard/candidate', icon: 'arrow' }]
      };
    }

    // Generic issue response
    return intent.data.response();
  }

  if (intent.type === 'intent') {
    return intent.data.response();
  }

  // Unknown intent
  return {
    text: `I'm not quite sure what you're looking for 🤔\n\nHere are some things I can help with:\n\n• **Job consulting** in IT, Banking, Non-IT, Insurance, BPO\n• **IT Solutions** & **Digital Marketing**\n• **Atomy product marketing**\n• **Home services** like cleaning & painting\n• **Post jobs** or **Apply for jobs**\n• **Become a vendor** and sell products\n\nTry asking something like:\n_"Tell me about IT consulting"_\n_"I want to apply for a job"_\n_"Show home services"_`,
    quickReplies: ['All Services', 'Job Consulting', 'Home Services', 'Help']
  };
}

// ─── TYPING ANIMATION COMPONENT ──────────────────────────────────
const TypingMessage = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayedText('');
    setIsComplete(false);

    intervalRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        // Add characters in chunks for speed
        const chunkSize = text.length > 200 ? 3 : 2;
        const nextChunk = text.slice(indexRef.current, indexRef.current + chunkSize);
        setDisplayedText(prev => prev + nextChunk);
        indexRef.current += chunkSize;
      } else {
        clearInterval(intervalRef.current);
        setIsComplete(true);
        onComplete?.();
      }
    }, 12);

    return () => clearInterval(intervalRef.current);
  }, [text]);

  return <FormattedText text={isComplete ? text : displayedText} />;
};

// ─── MARKDOWN-LITE RENDERER ──────────────────────────────────────
const FormattedText = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="quippy-msg-text">
      {lines.map((line, i) => {
        // Bold: **text**
        let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic: _text_
        processed = processed.replace(/_(.*?)_/g, '<em class="text-violet-300">$1</em>');
        // Bullet: • 
        const isBullet = processed.startsWith('•') || processed.startsWith('-');

        if (!processed.trim()) return <br key={i} />;

        return (
          <p
            key={i}
            className={`${isBullet ? 'pl-2 my-0.5' : 'my-0.5'} leading-relaxed`}
            dangerouslySetInnerHTML={{ __html: processed }}
          />
        );
      })}
    </div>
  );
};

// ─── SERVICE MINI CARD ───────────────────────────────────────────
const ServiceMiniCard = ({ title, color, iconKey, onClick }) => {
  const service = SERVICES[iconKey];
  const Icon = service?.icon || Sparkles;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r ${color} bg-opacity-10 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all text-left`}
      style={{ background: `linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))` }}
    >
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-lg`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">{title}</p>
        <p className="text-[10px] text-violet-300/70 font-medium">Tap to explore →</p>
      </div>
    </motion.button>
  );
};

// ─── ACTION BUTTON ───────────────────────────────────────────────
const ActionButton = ({ label, route, icon, onClick }) => {
  const icons = {
    arrow: ArrowRight,
    login: LogIn,
    register: UserPlus,
    info: HelpCircle,
    help: HelpCircle
  };
  const Icon = icons[icon] || ArrowRight;

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(route)}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all"
    >
      <Icon size={14} />
      {label}
    </motion.button>
  );
};

// ═══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
const FICQuippy = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (isOpen && endRef.current) {
      const scrollContainer = document.getElementById('quippy-messages');
      if (scrollContainer) {
        const scrollToBottom = () => {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth'
          });
        };
        // Scroll once immediately and once after a small delay to catch content updates
        scrollToBottom();
        const timer = setTimeout(scrollToBottom, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [messages, isTyping, isOpen]);

  // Initial greeting
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true);
      const greeting = buildResponse(
        { type: 'intent', key: 'greeting', data: INTENTS.greeting },
        userInfo
      );
      addBotMessage(greeting);
    }
    if (isOpen) {
      setShowPulse(false);
      setTimeout(() => inputRef.current?.focus(), 300);
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Auto-show pulse after 4s, and auto-hide tooltip after 9s (5s duration)
  useEffect(() => {
    const showTimer = setTimeout(() => setShowPulse(true), 4000);
    const hideTimer = setTimeout(() => {
      setHasGreeted(true); // This hides the tooltip
    }, 9000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const addBotMessage = useCallback((response) => {
    setIsTyping(true);
    // Simulate "thinking" delay
    const delay = 400 + Math.random() * 600;
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        ...response,
        timestamp: new Date()
      }]);
    }, delay);
  }, []);

  const handleSend = useCallback((text) => {
    const msg = (text || inputText).trim();
    if (!msg) return;

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      text: msg,
      timestamp: new Date()
    }]);
    setInputText('');

    // Detect intent and respond
    const intent = detectIntent(msg);
    intent.originalMessage = msg; // Attach original message for sub-context
    const response = buildResponse(intent, userInfo);
    addBotMessage(response);
  }, [inputText, addBotMessage, userInfo]);

  const handleQuickReply = useCallback((text) => {
    handleSend(text);
  }, [handleSend]);

  const handleNavigation = useCallback((route) => {
    navigate(route);
    setIsOpen(false);
  }, [navigate]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ─── FLOATING BUTTON ─────────────────────────────── */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(o => !o)}
        className="fixed bottom-12 right-6 md:bottom-16 md:right-12 z-[998] w-[65px] h-[65px] rounded-full flex items-center justify-center shadow-2xl transition-all group"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)',
          boxShadow: '0 8px 32px rgba(99,102,241,0.4), 0 0 0 4px rgba(99,102,241,0.1)'
        }}
        aria-label="Open FIC Quippy"
        id="fic-quippy-toggle"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="relative">
              <Bot size={26} className="text-white" />
              <Sparkles size={10} className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {showPulse && !isOpen && (
          <>
            <span className="absolute inset-0 rounded-full animate-ping bg-violet-500/30" style={{ animationDuration: '2s' }} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white animate-bounce shadow-lg" style={{ animationDuration: '1.5s' }} />
          </>
        )}
      </motion.button>

      {/* ─── TOOLTIP (when closed) ────────────────────────── */}
      <AnimatePresence>
        {showPulse && !isOpen && !hasGreeted && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="fixed bottom-24 right-24 md:bottom-28 md:right-28 z-[997] max-w-[200px]"
          >
            <div className="bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800">
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-relaxed">
                👋 Hey! I'm <span className="text-violet-600 font-black">FIC Quippy</span>. Need help finding the right service?
              </p>
            </div>
            <div className="absolute -bottom-1 left-4 w-3 h-3 bg-white dark:bg-gray-900 rotate-45 border-r border-b border-gray-100 dark:border-gray-800" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── CHAT PANEL ───────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30, x: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-32 right-4 md:bottom-36 md:right-12 z-[998] w-[420px] max-w-[95vw] h-[600px] max-h-[80vh] flex flex-col overflow-hidden"
            style={{
              background: QUIPPY_BG,
              borderRadius: '1.8rem',
              border: '1px solid rgba(99,102,241,0.15)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column'
            }}
            id="fic-quippy-panel"
          >
            {/* ─── HEADER ──────────────────────────────────── */}
            <div
              className="relative px-5 pt-5 pb-4 shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
                borderBottom: '1px solid rgba(99,102,241,0.1)'
              }}
            >
              {/* Decorative dots */}
              <div className="absolute top-3 right-4 flex gap-1.5 opacity-30">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="w-2 h-2 rounded-full bg-green-400" />
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
                  >
                    <Bot size={22} className="text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#0c0f1a]" />
                </div>
                <div>
                  <h3 className="text-white font-black text-[15px] tracking-tight flex items-center gap-1.5">
                    FIC Quippy
                    <Sparkles size={13} className="text-yellow-400" />
                  </h3>
                  <p className="text-[10px] font-bold text-violet-400/70 uppercase tracking-[0.15em]">
                    AI Assistant • Always Online
                  </p>
                </div>
              </div>
            </div>

            {/* ─── MESSAGES ────────────────────────────────── */}
            <div 
              className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-4 custom-scrollbar quippy-scroll-container" 
              id="quippy-messages"
              style={{ flex: '1 1 0%', minHeight: 0 }} 
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' ? (
                    <div className="max-w-[92%] space-y-2.5">
                      {/* Avatar + Bubble */}
                      <div className="flex gap-2.5 items-start">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-md"
                          style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
                        >
                          <Bot size={14} className="text-white" />
                        </div>
                        <div
                          className="px-4 py-3 rounded-2xl rounded-tl-md text-[13px] text-gray-100 leading-[1.6] font-medium"
                          style={{
                            background: QUIPPY_CARD,
                            border: '1px solid rgba(99,102,241,0.1)'
                          }}
                        >
                          {idx === messages.length - 1 && msg.sender === 'bot' ? (
                            <TypingMessage text={msg.text} onComplete={() => {}} />
                          ) : (
                            <FormattedText text={msg.text} />
                          )}
                        </div>
                      </div>

                      {/* Service Card */}
                      {msg.serviceCard && (
                        <div className="ml-9">
                          <ServiceMiniCard
                            {...msg.serviceCard}
                            onClick={() => handleNavigation(SERVICES[msg.serviceCard.iconKey]?.route || '/services')}
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="ml-9 flex flex-wrap gap-2">
                          {msg.actions.map((action, ai) => (
                            <ActionButton
                              key={ai}
                              {...action}
                              onClick={handleNavigation}
                            />
                          ))}
                        </div>
                      )}

                      {/* Quick Replies */}
                      {msg.quickReplies && msg.quickReplies.length > 0 && idx === messages.length - 1 && (
                        <div className="ml-9 flex flex-wrap gap-1.5">
                          {msg.quickReplies.map((qr, qi) => (
                            <motion.button
                              key={qi}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: qi * 0.05 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleQuickReply(qr)}
                              className="px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all"
                              style={{
                                background: 'rgba(99,102,241,0.08)',
                                borderColor: 'rgba(99,102,241,0.2)',
                                color: '#a5b4fc'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(99,102,241,0.2)';
                                e.target.style.borderColor = 'rgba(99,102,241,0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(99,102,241,0.08)';
                                e.target.style.borderColor = 'rgba(99,102,241,0.2)';
                              }}
                            >
                              {qr}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* USER MESSAGE */
                    <div
                      className="max-w-[75%] px-4 py-3 rounded-2xl rounded-br-md text-[13px] text-white font-medium leading-relaxed shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                        boxShadow: '0 4px 20px rgba(99,102,241,0.25)'
                      }}
                    >
                      {msg.text}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5 items-start"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-md"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
                  >
                    <Bot size={14} className="text-white" />
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl rounded-tl-md flex gap-1.5 items-center"
                    style={{ background: QUIPPY_CARD, border: '1px solid rgba(99,102,241,0.1)' }}
                  >
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
                          animationDelay: `${i * 0.15}s`,
                          animationDuration: '0.8s'
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={endRef} />
            </div>

            {/* ─── INPUT ───────────────────────────────────── */}
            <div
              className="px-4 pb-4 pt-3 shrink-0"
              style={{ borderTop: '1px solid rgba(99,102,241,0.08)' }}
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about FIC..."
                  className="flex-1 px-4 py-3 rounded-2xl text-sm text-white placeholder-gray-500 outline-none font-medium transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(99,102,241,0.12)',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.35)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.12)'}
                  id="quippy-input"
                />
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  disabled={!inputText.trim()}
                  onClick={() => handleSend()}
                  className="p-3 rounded-2xl text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed shadow-lg"
                  style={{
                    background: inputText.trim()
                      ? 'linear-gradient(135deg, #6366f1, #7c3aed)'
                      : 'rgba(99,102,241,0.15)',
                    boxShadow: inputText.trim() ? '0 4px 20px rgba(99,102,241,0.3)' : 'none'
                  }}
                  id="quippy-send"
                >
                  <Send size={16} />
                </motion.button>
              </div>
              
              {/* Footer */}
              <p className="text-center text-[9px] text-gray-600 mt-2 font-medium tracking-wide">
                Powered by <span className="text-violet-400 font-bold">Forge India Connect</span> • AI Assistant
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── INLINE STYLES ─────────────────────────────────── */}
      <style>{`
        .quippy-msg-text strong {
          color: #c4b5fd;
          font-weight: 800;
        }
        .quippy-msg-text em {
          font-style: italic;
        }
        #fic-quippy-panel .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        #fic-quippy-panel .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        #fic-quippy-panel .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99,102,241,0.2);
          border-radius: 10px;
        }
        #fic-quippy-panel .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99,102,241,0.4);
        }
      `}</style>
    </>
  );
};

export default FICQuippy;

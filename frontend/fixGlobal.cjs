const fs = require('fs');
let c = fs.readFileSync('src/components/ui/GlobalCTABar.jsx', 'utf8');

const insertBlock = `<button
  onClick={() => { setIsExpanded(false); window.dispatchEvent(new CustomEvent('open-chat-widget')); }}
  className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all whitespace-nowrap"
  aria-label="Chat with Us"
>
  <MessageCircle size={18} />
  Chat with Us
</button>
`;

c = c.replace(/<a\s+href=\{`https:\/\/wa\.me\/\$\{WA_NUMBER\}\?text=\$\{WA_MSG\}`\}/, insertBlock + '$&');
fs.writeFileSync('src/components/ui/GlobalCTABar.jsx', c);

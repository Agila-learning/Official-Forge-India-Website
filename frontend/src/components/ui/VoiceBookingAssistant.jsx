import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Volume2, Navigation, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const VoiceBookingAssistant = ({ onApplyBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantMessage, setAssistantMessage] = useState("Hi! I'm your AI Booking Assistant. Say something like 'Book a cab to the airport' or 'I need an auto to Phoenix Mall'.");
  const [language, setLanguage] = useState('en-IN');
  const [manualInput, setManualInput] = useState('');
  const [parsedData, setParsedData] = useState(null);

  const recognitionRef = useRef(null);

  const tLabels = {
    'en-IN': {
      title: 'AI Voice Assistant',
      extracted: 'Extracted Booking Details',
      vehicle: 'Vehicle',
      pickup: 'Pickup',
      drop: 'Drop',
      proceed: 'Proceed to Book',
      placeholder: 'Type naturally (e.g. Need auto to mall)',
      listening: 'Listening...',
    },
    'ta-IN': {
      title: 'ஏஐ குரல் உதவியாளர்',
      extracted: 'கண்டறியப்பட்ட புக்கிங் விவரங்கள்',
      vehicle: 'வாகனம்',
      pickup: 'ஏறும் இடம்',
      drop: 'இறங்கும் இடம்',
      proceed: 'புக்கிங் செய்ய தொடரவும்',
      placeholder: 'இயல்பாக தட்டச்சு செய்யவும் (எ.கா. மாலுக்கு ஆட்டோ வேண்டும்)',
      listening: 'கேட்கிறது...',
    },
    'hi-IN': {
      title: 'एआई वॉयस असिस्टेंट',
      extracted: 'निकाला गया बुकिंग विवरण',
      vehicle: 'वाहन',
      pickup: 'पिकअप स्थान',
      drop: 'ड्रॉप स्थान',
      proceed: 'बुक करने के लिए आगे बढ़ें',
      placeholder: 'स्वाभाविक रूप से टाइप करें (जैसे मॉल के लिए ऑटो चाहिए)',
      listening: 'सुन रहा है...',
    },
    'te-IN': {
      title: 'ఏఐ వాయిస్ అసిస్టెంట్',
      extracted: 'బుకింగ్ వివరాలు',
      vehicle: 'వాహనం',
      pickup: 'పికప్ స్థానం',
      drop: 'డ్రాప్ స్థానం',
      proceed: 'బుకింగ్ కొనసాగించండి',
      placeholder: 'సహజంగా టైప్ చేయండి (ఉదా. మాల్‌కు ఆటో కావాలి)',
      listening: 'వింటున్నది...',
    }
  };

  const labels = tLabels[language] || tLabels['en-IN'];

  useEffect(() => {
    if (language === 'ta-IN') {
      setAssistantMessage("வணக்கம்! நான் உங்கள் ஏஐ புக்கிங் அசிஸ்டண்ட். 'ஏர்போர்ட்டுக்கு கார் புக் செய்' அல்லது 'எனக்கு ஆட்டோ வேண்டும்' என்று கூறுங்கள்.");
    } else if (language === 'hi-IN') {
      setAssistantMessage("नमस्ते! मैं आपका एआई बुकिंग असिस्टेंट हूँ। कहिए 'एयरपोर्ट के लिए कैब बुक करें' या 'मुझे ऑटो चाहिए'।");
    } else if (language === 'te-IN') {
      setAssistantMessage("నమస్తే! నేను మీ ఏఐ బుకింగ్ అసిస్టెంట్. 'ఎయిర్‌పోర్ట్‌కు క్యాబ్ బుక్ చేయి' లేదా 'నాకు ఆటో కావాలి' అని చెప్పండి.");
    } else {
      setAssistantMessage("Hi! I'm your AI Booking Assistant. Say something like 'Book a cab to the airport' or 'I need an auto to Phoenix Mall'.");
    }
  }, [language]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (recognitionRef.current && recognitionRef.current.finalTranscriptStr) {
          processIntent(recognitionRef.current.finalTranscriptStr);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        console.error("Speech error", event.error);
        if (event.error !== 'aborted') toast.error('Microphone error: ' + event.error);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, [language]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setParsedData(null);
      setAssistantMessage(labels.listening);
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        toast.error("Voice input is not supported by your browser. Please type.");
      }
    }
  };

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.finalTranscriptStr = transcript;
    }
  }, [transcript]);

  const processIntent = (text) => {
    if (!text) return;
    const lowerText = text.toLowerCase();
    
    // Very Basic NLP extraction for demo
    let vehicle = 'Car';
    if (lowerText.includes('bike') || lowerText.includes('scooter') || lowerText.includes('பைக்') || lowerText.includes('मोटरसाइकिल') || lowerText.includes('బైక్')) vehicle = 'Bike';
    else if (lowerText.includes('auto') || lowerText.includes('rickshaw') || lowerText.includes('ஆட்டோ') || lowerText.includes('ऑटो') || lowerText.includes('ఆటో')) vehicle = 'Auto';
    else if (lowerText.includes('suv') || lowerText.includes('premium')) vehicle = 'SUV';
    else if (lowerText.includes('parcel') || lowerText.includes('package') || lowerText.includes('delivery')) vehicle = 'Parcel Delivery';
    else if (lowerText.includes('cab') || lowerText.includes('taxi') || lowerText.includes('car')) vehicle = 'Car';

    let drop = '';
    let pickup = '';

    if (language.startsWith('ta')) {
      const taDropWords = lowerText.split(/\s+/).filter(w => w.endsWith('க்கு') || w.endsWith('கு'));
      if (taDropWords.length > 0) {
        drop = taDropWords[0].replace(/க்கு$/, '').replace(/கு$/, '');
      }
      const taPickupWords = lowerText.split(/\s+/).filter(w => w.endsWith('லிருந்து') || w.endsWith('இருந்து') || w.includes('இருந்து'));
      if (taPickupWords.length > 0) {
        pickup = taPickupWords[0].replace(/லிருந்து$/, '').replace(/இருந்து$/, '');
      }
    } else if (language.startsWith('hi')) {
      const hiDropMatch = lowerText.match(/(.+?)\s+(?:को|के लिए|जाना)/);
      if (hiDropMatch) {
        drop = hiDropMatch[1].trim().split(/\s+/).pop();
      }
      const hiPickupMatch = lowerText.match(/(.+?)\s+से/);
      if (hiPickupMatch) {
        pickup = hiPickupMatch[1].trim().split(/\s+/).pop();
      }
    } else if (language.startsWith('te')) {
      const teDropMatch = lowerText.match(/(.+?)\s+(?:కి|కు|వెళ్ళాలి)/);
      if (teDropMatch) {
        drop = teDropMatch[1].trim().split(/\s+/).pop();
      }
      const tePickupMatch = lowerText.match(/(.+?)\s+నుంచి/);
      if (tePickupMatch) {
        pickup = tePickupMatch[1].trim().split(/\s+/).pop();
      }
    }

    if (!drop) {
      const toMatch = lowerText.match(/to\s+(.+?)(?:\s+from|\s+at|$)/i);
      if (toMatch) drop = toMatch[1].trim();
    }
    if (!pickup) {
      const fromMatch = lowerText.match(/from\s+(.+?)(?:\s+to|\s+at|$)/i);
      if (fromMatch) pickup = fromMatch[1].trim();
    }

    const translateToEnglish = (val) => {
      if (!val) return '';
      const cleaned = val.trim().toLowerCase();
      const dictionary = {
        'சென்னை': 'Chennai',
        'மதுரை': 'Madurai',
        'கோவை': 'Coimbatore',
        'கோயம்புத்தூர்': 'Coimbatore',
        'திருச்சி': 'Trichy',
        'சேலம்': 'Salem',
        'திருப்பூர்': 'Tirupur',
        'பெங்களூர்': 'Bangalore',
        'ஏர்போர்ட்': 'Airport',
        'ஏர்போர்ட்டு': 'Airport',
        'மால்': 'Mall',
        'கோவில்': 'Temple',
        'கோயில்': 'Temple',
        'வீடு': 'Home',
        'ஆபீஸ்': 'Office',
        'வீட்டு': 'Home',
        'நிலையம்': 'Station',
        // Hindi
        'चेन्नई': 'Chennai',
        'दिल्ली': 'Delhi',
        'बंगलौर': 'Bangalore',
        'घर': 'Home',
        // Telugu
        'ఇల్లు': 'Home',
        'ఎయిర్‌పోర్ట్': 'Airport'
      };
      return dictionary[cleaned] || val;
    };

    const finalDrop = translateToEnglish(drop);
    const finalPickup = translateToEnglish(pickup);

    const extracted = { vehicle, pickup: finalPickup || 'My Location', drop: finalDrop };
    setParsedData(extracted);
    
    let displayVehicle = vehicle;
    let displayDrop = finalDrop;
    if (language.startsWith('ta')) {
      if (vehicle === 'Car') displayVehicle = 'கார்';
      else if (vehicle === 'Bike') displayVehicle = 'பைக்';
      else if (vehicle === 'Auto') displayVehicle = 'ஆட்டோ';
      else if (vehicle === 'SUV') displayVehicle = 'எஸ்யுவி';
      else if (vehicle === 'Parcel Delivery') displayVehicle = 'டெலிவரி வாகனம்';
      
      displayDrop = finalDrop || 'குறிப்பிட்ட இடத்திற்கு';
      setAssistantMessage(`சரி. ${displayDrop} ஒரு ${displayVehicle} முன்பதிவு செய்யப்படுகிறது.`);
    } else if (language.startsWith('hi')) {
      displayDrop = finalDrop || 'उस जगह';
      setAssistantMessage(`ठीक है। आपके लिए ${displayDrop} तक एक ${displayVehicle} उपलब्ध है।`);
    } else if (language.startsWith('te')) {
      displayDrop = finalDrop || 'ఆ స్థానానికి';
      setAssistantMessage(`సరే. ${displayDrop} కు ఒక ${displayVehicle} సిద్ధంగా ఉంది.`);
    } else {
      if (finalDrop) {
        setAssistantMessage(`Got it! I can book a ${vehicle} to ${finalDrop}. Would you like to proceed?`);
      } else {
        setAssistantMessage(`I heard you want a ${vehicle}, but I missed the destination. Where to?`);
      }
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      setTranscript(manualInput);
      processIntent(manualInput);
      setManualInput('');
    }
  };

  const handleApply = () => {
    if (parsedData && onApplyBooking) {
      onApplyBooking(parsedData);
      toast.success("Booking details populated!");
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 overflow-hidden border-2 border-white/20"
      >
        <Mic size={24} className={isListening ? 'animate-pulse text-red-300' : ''} />
        {isListening && (
          <div className="absolute inset-0 bg-white/20 animate-ping rounded-full" />
        )}
      </motion.button>

      {/* Voice Assistant Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: '100%', scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: '100%', scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 md:bottom-24 left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-[480px] bg-white dark:bg-[#15171A] rounded-t-3xl md:rounded-3xl shadow-2xl z-[110] border border-gray-100 dark:border-white/5 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                    <Mic size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">{labels.title}</h3>
                    <p className="text-[10px] uppercase tracking-widest opacity-80">Forge India Connect</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Language Selector */}
              <div className="px-6 pt-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-gray-100 dark:border-gray-800 pb-4">
                 {[
                   { code: 'en-IN', label: 'English' },
                   { code: 'ta-IN', label: 'தமிழ்' },
                   { code: 'hi-IN', label: 'हिंदी' },
                   { code: 'te-IN', label: 'తెలుగు' }
                 ].map(lang => (
                   <button 
                     key={lang.code}
                     onClick={() => setLanguage(lang.code)}
                     className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${language === lang.code ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}
                   >
                     {lang.label}
                   </button>
                 ))}
              </div>

              {/* Chat / Assistant Interaction Area */}
              <div className="p-6 h-[250px] overflow-y-auto flex flex-col justify-end space-y-4">
                
                {/* Assistant Bubble */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-3 w-[85%]">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <Volume2 size={14} />
                  </div>
                  <div className="bg-gray-100 dark:bg-[#1A1D21] p-4 rounded-2xl rounded-tl-sm text-sm font-bold text-gray-800 dark:text-gray-200">
                    {assistantMessage}
                  </div>
                </motion.div>

                {/* User Input Display */}
                {transcript && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex justify-end w-full">
                    <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-sm text-sm font-bold text-white max-w-[85%]">
                      {transcript}
                    </div>
                  </motion.div>
                )}

                {/* Extracted Data Card */}
                {parsedData && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-2xl p-4 mt-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3 border-b border-blue-200/50 pb-2">{labels.extracted}</p>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500 font-bold uppercase">{labels.vehicle}</span>
                          <span className="text-sm font-black text-slate-900 dark:text-white">{parsedData.vehicle}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500 font-bold uppercase">{labels.pickup}</span>
                          <span className="text-sm font-black text-slate-900 dark:text-white">{parsedData.pickup}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500 font-bold uppercase">{labels.drop}</span>
                          <span className="text-sm font-black text-slate-900 dark:text-white text-right max-w-[200px] truncate">{parsedData.drop || 'Not detected'}</span>
                        </div>
                     </div>
                     <button 
                       onClick={handleApply}
                       className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                     >
                       <Navigation size={14} /> {labels.proceed}
                     </button>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-gray-50 dark:bg-[#1A1D21] border-t border-gray-100 dark:border-gray-800">
                {isListening ? (
                  <div className="flex flex-col items-center justify-center h-14">
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ height: ['10px', '24px', '10px'] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                          className="w-1.5 bg-blue-500 rounded-full"
                        />
                      ))}
                    </div>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{labels.listening}</p>
                  </div>
                ) : (
                  <form onSubmit={handleManualSubmit} className="relative">
                    <input 
                      type="text" 
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder={labels.placeholder}
                      className="w-full bg-white dark:bg-[#0A0B0D] border border-gray-200 dark:border-gray-800 rounded-2xl py-4 pl-4 pr-32 outline-none focus:border-blue-500 text-sm font-bold text-gray-900 dark:text-white"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button type="submit" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <Send size={16} />
                      </button>
                      <button type="button" onClick={toggleListen} className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors">
                        <Mic size={16} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceBookingAssistant;

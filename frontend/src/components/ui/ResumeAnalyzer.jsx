import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 Upload, FileText, CheckCircle2, AlertCircle, 
 Zap, Target, LineChart, ShieldCheck, ArrowRight,
 Search, Download, BrainCircuit
} from 'lucide-react';
import toast from 'react-hot-toast';

const ResumeAnalyzer = () => {
 const [analyzing, setAnalyzing] = useState(false);
 const [result, setResult] = useState(null);
 const [dragActive, setDragActive] = useState(false);

 const handleAnalyze = () => {
 setAnalyzing(true);
 // Simulate AI analysis
 setTimeout(() => {
 setResult({
 score: 82,
 status: 'Highly Competitive',
 matches: ['React.js', 'Node.js', 'UI/UX Design', 'Agile'],
 gaps: ['Cloud Architecture', 'Unit Testing'],
 roadmap: [
 { title: 'Advanced Cloud Computing', period: 'Month 1', status: 'Pending' },
 { title: 'Project Management Core', period: 'Month 2', status: 'Next' },
 { title: 'Executive Communication', period: 'Month 3', status: 'Goal' }
 ]
 });
 setAnalyzing(false);
 toast.success('AI Analysis Completed');
 }, 3000);
 };

 const handleFileChange = (e) => {
 const file = e.target.files[0];
 if (file) {
 handleAnalyze();
 }
 };

 const handleDownloadReport = () => {
 if (!result) return;
 const reportContent = `FORGE INDIA CONNECT - ATS ANALYZER REPORT\nScore: ${result.score}%\nStatus: ${result.status}\nMatches: ${result.matches.join(', ')}\nGaps: ${result.gaps.join(', ')}`;
 const blob = new Blob([reportContent], { type: 'text/plain' });
 const url = URL.createObjectURL(blob);
 const link = document.createElement('a');
 link.href = url;
 link.download = `ATS_Report_FIC.txt`;
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 toast.success('Report Downloaded');
 };

 return (
 <section className="py-24 bg-dark-bg relative overflow-hidden">
 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[150px]" />
 
 <div className="container-xl px-6 relative z-10">
 <div className="max-w-4xl mx-auto text-center mb-20">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-black text-[10px] uppercase tracking-[0.3em] mb-6 border border-secondary/20"
 >
 AI-Powered Career Intelligence
 </motion.div>
 <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight mb-8">
 The AI <span className="text-secondary">ATS</span> Analyzer
 </h2>
 <p className="text-xl text-white/40 font-medium max-w-2xl mx-auto">
 Optimize your professional identity with our enterprise-grade ATS analyzer. Deploy AI to scan gaps and visualize your career roadmap.
 </p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
 
 {/* Upload Section */}
 <motion.div 
 initial={{ opacity: 0, x: -30 }}
 whileInView={{ opacity: 1, x: 0 }}
 className="glass-card p-12 space-y-10"
 >
 <div 
 className={`border-2 border-dashed rounded-[2.5rem] p-16 text-center transition-all cursor-pointer ${dragActive ? 'border-secondary bg-secondary/5 scale-[0.98]' : 'border-white/10 bg-white/5 hover:border-secondary/40'}`}
 onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
 onDragLeave={() => setDragActive(false)}
 onDrop={(e) => { e.preventDefault(); setDragActive(false); handleAnalyze(); }}
 onClick={() => document.getElementById('resume-upload-input').click()}
 >
 <input 
 type="file" 
 id="resume-upload-input" 
 className="hidden" 
 accept=".pdf,.doc,.docx"
 onChange={handleFileChange}
 />
 <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center text-secondary mx-auto mb-8 animate-bounce">
 <Upload size={32} />
 </div>
 <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Upload Resume</h3>
 <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-10">PDF or DOCX (Max 10MB)</p>
 
 <button 
 onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
 disabled={analyzing}
 className="px-10 py-5 bg-secondary text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-secondary/20 disabled:opacity-50"
 >
 {analyzing ? 'AI Analyzing...' : 'Deploy Analyzer'}
 </button>
 </div>

 <div className="grid grid-cols-2 gap-6">
 <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
 <Search className="text-secondary mb-4" size={20} />
 <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">ATS Scan</h4>
 <p className="text-[9px] text-white/20 font-bold uppercase leading-relaxed">Deep analysis of keyword density and formatting.</p>
 </div>
 <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
 <BrainCircuit className="text-secondary mb-4" size={20} />
 <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">AI Matching</h4>
 <p className="text-[9px] text-white/20 font-bold uppercase leading-relaxed">Neural matching with 200+ industry job roles.</p>
 </div>
 </div>
 </motion.div>

 {/* Results Section */}
 <div className="space-y-8">
 <AnimatePresence mode="wait">
 {analyzing ? (
 <motion.div 
 key="analyzing"
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 className="glass-card p-20 flex flex-col items-center justify-center min-h-[400px]"
 >
 <div className="relative w-24 h-24 mb-10">
 <div className="absolute inset-0 border-4 border-secondary/20 rounded-full" />
 <motion.div 
 animate={{ rotate: 360 }}
 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
 className="absolute inset-0 border-4 border-t-secondary rounded-full"
 />
 <BrainCircuit size={40} className="absolute inset-0 m-auto text-secondary animate-pulse" />
 </div>
 <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Engaging Neural Engines</h3>
 <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Scanning professional patterns...</p>
 </motion.div>
 ) : result ? (
 <motion.div 
 key="result"
 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
 className="space-y-8"
 >
 {/* Score Card */}
 <div className="glass-card p-10 bg-gradient-to-br from-secondary/10 to-transparent">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h3 className="text-4xl font-black text-white tracking-tighter mb-1">{result.score}%</h3>
 <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">{result.status}</p>
 </div>
 <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-secondary border border-white/10">
 <Target size={32} />
 </div>
 </div>
 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: `${result.score}%` }}
 transition={{ duration: 1.5, ease: "easeOut" }}
 className="h-full bg-secondary shadow-[0_0_20px_rgba(249,115,22,0.5)]"
 />
 </div>
 </div>

 {/* Roadmap */}
 <div className="glass-card p-10 space-y-8">
 <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] border-b border-white/5 pb-4">Career Intelligence Roadmap</h3>
 <div className="space-y-6">
 {result.roadmap.map((step, i) => (
 <div key={i} className="flex gap-6 relative">
 {i !== result.roadmap.length - 1 && (
 <div className="absolute left-3.5 top-10 bottom-[-1.5rem] w-px bg-white/10" />
 )}
 <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${step.status === 'Pending' ? 'bg-secondary text-white' : 'bg-white/5 text-white/20'}`}>
 <CheckCircle2 size={14} />
 </div>
 <div>
 <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">{step.period}</p>
 <h4 className="text-sm font-black text-white uppercase tracking-tight">{step.title}</h4>
 </div>
 </div>
 ))}
 </div>
 <button 
 onClick={handleDownloadReport}
 className="w-full py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
 >
 Full Report <Download size={16} />
 </button>
 </div>
 </motion.div>
 ) : (
 <motion.div 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
 className="glass-card p-12 flex flex-col items-center justify-center min-h-[400px] border-dashed border-white/5"
 >
 <LineChart className="text-white/10 mb-8" size={64} />
 <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] text-center max-w-[200px] leading-relaxed">
 Waiting for resume deployment to initiate analysis
 </p>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 </div>
 </div>
 </section>
 );
};

export default ResumeAnalyzer;

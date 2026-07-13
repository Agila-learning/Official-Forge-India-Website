import React from 'react';
import { motion } from 'framer-motion';
import { Search, Users, CheckCircle, FileText, Send, Plus, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import MembershipUpgradeWidget from '../ui/MembershipUpgradeWidget';

const HRDashboardModules = ({ activeTab, allCandidates, applications, handleUpdateApplicationStatus, getATSMetrics, userInfo }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Talent Search */}
      {activeTab === 'search' && (
        <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Talent <span className="text-primary">Search</span></h2>
            <div className="relative w-full sm:w-72">
              <input type="text" placeholder="Search candidates..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card outline-none text-sm font-bold shadow-sm" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCandidates.map(candidate => (
              <div key={candidate._id} className="glass-card p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-black text-lg shadow-md shadow-primary/20">
                    {candidate.firstName?.[0]}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-black uppercase text-sm tracking-tight truncate">{candidate.firstName} {candidate.lastName}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{candidate.industry || 'General Candidate'}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-6 p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 font-medium truncate">✉ {candidate.email}</p>
                  <p className="text-xs text-gray-500 font-medium truncate">☎ {candidate.mobile || 'N/A'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => window.dispatchEvent(new CustomEvent('open-chat-widget', { detail: { contact: candidate } }))} className="flex-1 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Message</button>
                </div>
              </div>
            ))}
            {allCandidates.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white/50 dark:bg-dark-card/50 rounded-[3rem] border border-gray-100 dark:border-gray-800">
                <Users className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No candidates available in network</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Talent Pool */}
      {activeTab === 'talent-pool' && (
        <motion.div key="talent-pool" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">Talent <span className="text-primary">Pool</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from(new Set(applications.map(a => a.user))).map(userId => {
              const app = applications.find(a => a.user === userId);
              return (
                <div key={userId} className="glass-card p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center font-black"><Users size={20} /></div>
                    <div>
                      <h4 className="font-black uppercase text-sm">{app.fullName}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate max-w-[200px]">Last Applied: {app.jobRole}</p>
                    </div>
                  </div>
                  <button onClick={() => {
                    const candidateContact = allCandidates?.find(c => c._id === userId) || { _id: userId };
                    window.dispatchEvent(new CustomEvent('open-chat-widget', { detail: { contact: candidateContact } }));
                  }} className="p-3 bg-gray-50 dark:bg-dark-bg text-gray-500 hover:text-primary rounded-xl transition-all">
                    <Send size={16} />
                  </button>
                </div>
              );
            })}
            {applications.length === 0 && <p className="col-span-full text-center text-gray-400 py-10 font-bold uppercase tracking-widest text-xs">Your talent pool is empty.</p>}
          </div>
        </motion.div>
      )}

      {/* Shortlists */}
      {activeTab === 'shortlists' && (
        <motion.div key="shortlists" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">Shortlisted <span className="text-primary">Candidates</span></h2>
          <div className="grid grid-cols-1 gap-6">
            {applications.filter(a => a.status === 'Shortlisted').map(app => (
              <div key={app._id} className="glass-card p-6 rounded-[2.5rem] border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-dark-bg rounded-xl shadow-sm flex items-center justify-center text-blue-600 font-black text-lg">
                    {app.fullName?.[0]}
                  </div>
                  <div>
                    <h4 className="font-black uppercase text-lg text-blue-900 dark:text-blue-100">{app.fullName}</h4>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">{app.jobRole}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleUpdateApplicationStatus(app._id, 'Interview')} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-105 transition-all">Move to Interview</button>
                  <button onClick={() => handleUpdateApplicationStatus(app._id, 'Rejected')} className="px-6 py-3 bg-white dark:bg-dark-bg text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">Reject</button>
                </div>
              </div>
            ))}
            {applications.filter(a => a.status === 'Shortlisted').length === 0 && <p className="text-center text-gray-400 py-20 bg-white/50 dark:bg-dark-card/50 rounded-[3rem] border border-gray-100 dark:border-gray-800 font-bold uppercase tracking-widest text-xs">No shortlisted candidates.</p>}
          </div>
        </motion.div>
      )}

      {/* Feedback */}
      {activeTab === 'feedback' && (
        <motion.div key="feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">Candidate <span className="text-primary">Feedback</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.filter(a => ['Interview', 'Hired', 'Rejected'].includes(a.status)).map(app => (
              <div key={app._id} className="glass-card p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card shadow-sm hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-50 dark:border-gray-800">
                  <div>
                    <h4 className="font-black uppercase text-lg leading-none mb-1">{app.fullName}</h4>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{app.jobRole}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${app.status === 'Hired' ? 'bg-green-100 text-green-600' : app.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{app.status}</span>
                </div>
                <textarea 
                  defaultValue={app.hrNotes || ''} 
                  placeholder="Enter detailed interview feedback or internal HR notes here..."
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none resize-none text-sm font-medium mb-4 focus:ring-2 focus:ring-primary/20 transition-all"
                  rows="4"
                  id={`note-${app._id}`}
                ></textarea>
                <button onClick={() => handleUpdateApplicationStatus(app._id, app.status, document.getElementById(`note-${app._id}`).value)} className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">Save Internal Feedback</button>
              </div>
            ))}
            {applications.filter(a => ['Interview', 'Hired', 'Rejected'].includes(a.status)).length === 0 && (
              <p className="col-span-full text-center text-gray-400 py-20 font-bold uppercase tracking-widest text-xs">No active interview candidates to review.</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Messages */}
      {activeTab === 'messages' && (
        <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-center py-20 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-[4rem] shadow-xl">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary"><Send size={40} /></div>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Communication <span className="text-primary">Center</span></h2>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-8 max-w-md mx-auto">Connect directly with candidates, delivery partners, and team members via the secure internal chat framework.</p>
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-chat-widget'))} className="px-10 py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/30 hover:bg-blue-700 transition-all hover:scale-105">Launch Chat Application</button>
        </motion.div>
      )}

      {/* Campaigns */}
      {activeTab === 'campaigns' && (
        <motion.div key="campaigns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Marketing <span className="text-primary">Campaigns</span></h2>
            <button className="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2"><Plus size={14}/> New Campaign</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Q3 Hiring Drive', status: 'Active', budget: '$450 / $1000', used: '45%', imp: '1.2k', clicks: '142', conv: '28' },
              { title: 'Campus Recruitment', status: 'Active', budget: '$200 / $500', used: '40%', imp: '840', clicks: '95', conv: '12' }
            ].map((camp, i) => (
              <div key={i} className="glass-card p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card shadow-lg hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-black uppercase text-lg">{camp.title}</h4>
                    <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-1">Status: {camp.status}</p>
                  </div>
                  <span className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-900/30 text-green-500 flex items-center justify-center"><CheckCircle size={20} /></span>
                </div>
                <div className="space-y-6">
                  <div className="p-5 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3"><span>Budget Used</span><span className="text-primary">{camp.budget}</span></div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-primary" style={{width: camp.used}}></div></div>
                  </div>
                  <div className="flex justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="text-center"><p className="text-3xl font-black">{camp.imp}</p><p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Impressions</p></div>
                    <div className="text-center"><p className="text-3xl font-black text-primary">{camp.clicks}</p><p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Clicks</p></div>
                    <div className="text-center"><p className="text-3xl font-black text-green-500">{camp.conv}</p><p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Conversions</p></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Reports */}
      {activeTab === 'reports' && (
        <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-center py-20 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-[4rem] shadow-xl">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary"><FileText size={40} /></div>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Data <span className="text-primary">Reports</span></h2>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-8 max-w-md mx-auto">Download structured CSV exports of all candidates, ATS scores, and historical hiring metadata.</p>
          <button onClick={() => {
            if (applications.length === 0) {
              toast.error('No candidate data available to export.');
              return;
            }
            const headers = "Name,Email,Phone,Role,Status,ATS Score,HR Notes\n";
            const csv = applications.map(a => `${a.fullName},${a.email},${a.phone},${a.jobRole},${a.status},${getATSMetrics(a).compatibilityScore},"${a.hrNotes || ''}"`).join("\n");
            const blob = new Blob([headers + csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'FIC_Candidate_Report.csv';
            a.click();
            toast.success('Report generated and downloaded successfully!');
          }} className="px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-all">Export Candidate Master Data (CSV)</button>
        </motion.div>
      )}

      {/* Subscription */}
      {activeTab === 'subscription' && (
        <motion.div key="subscription" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-6xl mx-auto">
          <MembershipUpgradeWidget userInfo={userInfo} />
        </motion.div>
      )}

      {/* Company Profile */}
      {activeTab === 'company-profile' && (
        <motion.div key="company-profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-4xl mx-auto">
          <div className="glass-card p-10 md:p-14 rounded-[4rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card shadow-2xl">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-10">Company <span className="text-primary">Profile</span></h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-10 pb-10 border-b border-gray-50 dark:border-gray-800">
              <div className="w-32 h-32 bg-gray-50 dark:bg-dark-bg rounded-[2rem] flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400 shrink-0">
                <Building2 size={40} />
              </div>
              <div>
                <h4 className="font-black text-lg uppercase tracking-tight mb-2">Brand Identity Logo</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed mb-4 max-w-sm">Upload your corporate logo. This will be visible on all your active job postings and company pages.</p>
                <button className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Upload New Logo</button>
              </div>
            </div>
            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); toast.success('Company Profile Updated!'); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Company Legal Name</label>
                  <input defaultValue={userInfo.businessName || ''} className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none text-sm font-bold focus:border-primary transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Industry / Sector</label>
                  <input defaultValue={userInfo.industry || ''} className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none text-sm font-bold focus:border-primary transition-all" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Corporate Mission / About Us</label>
                  <textarea rows="5" className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-bg outline-none text-sm font-bold resize-none focus:border-primary transition-all" placeholder="Write a description about your company culture and mission..."></textarea>
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:bg-blue-700 transition-all">Save Brand Identity</button>
            </form>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default HRDashboardModules;

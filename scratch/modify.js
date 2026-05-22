const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'frontend', 'src', 'pages', 'HRDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('import { BarChart')) {
  content = content.replace(
    "import DashboardLayout from '../components/layout/DashboardLayout';",
    "import DashboardLayout from '../components/layout/DashboardLayout';\nimport { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';\nimport { CalendarDays, Video, Clock } from 'lucide-react';"
  );
}

if (!content.includes('const [scheduledInterviews')) {
  content = content.replace(
    "const [expandedATS, setExpandedATS] = useState({});",
    "const [expandedATS, setExpandedATS] = useState({});\n  const [scheduledInterviews, setScheduledInterviews] = useState(() => JSON.parse(localStorage.getItem('fic_interviews') || '[]'));\n  const [showScheduleModal, setShowScheduleModal] = useState(false);\n  const [selectedCandidateForInterview, setSelectedCandidateForInterview] = useState(null);"
  );
}

if (!content.includes('useEffect(() => {\n    localStorage.setItem(\'fic_interviews\'')) {
  content = content.replace(
    "const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');",
    "const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');\n\n  useEffect(() => {\n    localStorage.setItem('fic_interviews', JSON.stringify(scheduledInterviews));\n  }, [scheduledInterviews]);"
  );
}

const newTabsContent = `
          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Recruitment <span className="text-primary">Analytics</span></h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Data-driven hiring insights</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Hiring Funnel */}
                <div className="glass-card p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card shadow-xl">
                  <h3 className="text-xl font-black uppercase mb-6 tracking-tighter">Hiring Funnel</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { stage: 'Applied', count: applications.length },
                        { stage: 'Shortlisted', count: applications.filter(a => a.status !== 'Applied' && a.status !== 'Rejected').length },
                        { stage: 'Interview', count: applications.filter(a => a.status === 'Interview' || a.status === 'Hired').length },
                        { stage: 'Hired', count: applications.filter(a => a.status === 'Hired').length }
                      ]} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <XAxis type="number" />
                        <YAxis dataKey="stage" type="category" width={80} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                          {
                            [...Array(4)].map((_, index) => (
                              <Cell key={\`cell-\${index}\`} fill={['#94a3b8', '#3b82f6', '#8b5cf6', '#10b981'][index]} />
                            ))
                          }
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Monthly Trend */}
                <div className="glass-card p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card shadow-xl">
                  <h3 className="text-xl font-black uppercase mb-6 tracking-tighter">Monthly Hiring Trend</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { name: 'Jan', apps: 12 }, { name: 'Feb', apps: 19 }, { name: 'Mar', apps: 15 },
                        { name: 'Apr', apps: 28 }, { name: 'May', apps: applications.length }
                      ]} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                        <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="apps" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'interviews' && (
            <motion.div key="interviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Interview <span className="text-primary">Schedules</span></h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Manage and evaluate candidates</p>
                </div>
                <button 
                  onClick={() => setShowScheduleModal(true)}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-blue-700 shadow-xl shadow-primary/20 flex items-center gap-2"
                >
                  <Plus size={16} /> Schedule Interview
                </button>
              </div>

              {/* Scheduled Interviews List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scheduledInterviews.map((interview, index) => (
                  <div key={index} className="glass-card p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card shadow-lg hover:shadow-xl transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-bl-[100%]"></div>
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                          <CalendarDays size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-lg uppercase tracking-tight">{interview.candidateName}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{interview.role}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">
                        {new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div className="space-y-3 mb-6 relative z-10">
                      <div className="flex items-center gap-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        <Clock size={16} className="text-gray-400" />
                        {interview.time} ({interview.duration} mins)
                      </div>
                      <div className="flex items-center gap-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        <Video size={16} className="text-gray-400" />
                        <a href={interview.link} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate max-w-[200px]">{interview.link}</a>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        <Users size={16} className="text-gray-400" />
                        {interview.panel}
                      </div>
                    </div>

                    <div className="flex gap-3 relative z-10">
                      <button className="flex-1 py-3 bg-gray-50 dark:bg-dark-bg text-gray-600 dark:text-gray-300 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-gray-200 dark:border-gray-700">
                        Scorecard
                      </button>
                      <button 
                        onClick={() => {
                          if(window.confirm('Delete this schedule?')) {
                            setScheduledInterviews(scheduledInterviews.filter((_, i) => i !== index));
                          }
                        }}
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {scheduledInterviews.length === 0 && (
                  <div className="col-span-1 md:col-span-2 text-center py-20 bg-gray-50/50 dark:bg-dark-bg/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <CalendarDays className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No interviews scheduled</p>
                  </div>
                )}
              </div>

              {/* Schedule Modal */}
              <AnimatePresence>
                {showScheduleModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white dark:bg-dark-card w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-gray-800"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Schedule Interview</h3>
                        <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
                      </div>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.target);
                        const data = Object.fromEntries(fd.entries());
                        const candidate = applications.find(a => a._id === data.candidateId);
                        setScheduledInterviews([...scheduledInterviews, {
                          candidateName: candidate ? candidate.fullName : 'External Candidate',
                          role: candidate ? candidate.jobRole : 'General Interview',
                          date: data.date,
                          time: data.time,
                          duration: data.duration,
                          link: data.link,
                          panel: data.panel
                        }]);
                        setShowScheduleModal(false);
                        toast.success('Interview scheduled successfully');
                      }} className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Candidate</label>
                          <select name="candidateId" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg mt-1">
                            {applications.filter(a => a.status === 'Interview').map(a => (
                              <option key={a._id} value={a._id}>{a.fullName} - {a.jobRole}</option>
                            ))}
                            {applications.filter(a => a.status === 'Interview').length === 0 && (
                              <option value="">No candidates in 'Interview' status</option>
                            )}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                            <input name="date" type="date" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg mt-1" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Time</label>
                            <input name="time" type="time" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg mt-1" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Duration (mins)</label>
                            <select name="duration" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg mt-1">
                              <option value="30">30 minutes</option>
                              <option value="45">45 minutes</option>
                              <option value="60">60 minutes</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Panel Members</label>
                            <input name="panel" placeholder="John, Sarah" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg mt-1" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Meeting Link (Zoom/Meet)</label>
                          <input name="link" type="url" placeholder="https://zoom.us/j/123" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg mt-1" />
                        </div>
                        <button type="submit" className="w-full py-4 mt-6 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all">
                          Confirm Schedule
                        </button>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
`;

if (!content.includes("activeTab === 'analytics'")) {
  content = content.replace(
    "{activeTab === 'settings' && (",
    newTabsContent + "\n          {activeTab === 'settings' && ("
  );
}

fs.writeFileSync(filePath, content);
console.log("Successfully patched HRDashboard.jsx");

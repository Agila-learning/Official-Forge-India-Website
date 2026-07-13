import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, AlertCircle, Upload, Eye, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const mockDocs = [
  { id: 'driving_license', name: 'Driving License', status: 'verified', expiry: '2028-10-15', file: 'dl_front.jpg' },
  { id: 'rc', name: 'Vehicle Registration (RC)', status: 'expiring', expiry: '2026-08-01', file: 'rc_copy.pdf' },
  { id: 'insurance', name: 'Insurance Policy', status: 'verified', expiry: '2027-02-14', file: 'insurance_24.pdf' },
  { id: 'puc', name: 'Pollution Certificate (PUC)', status: 'missing', expiry: null, file: null },
  { id: 'pan', name: 'PAN Card', status: 'verified', expiry: null, file: 'pan_card.jpg' },
  { id: 'aadhaar', name: 'Aadhaar Card', status: 'rejected', expiry: null, file: null, reason: 'Image blurred. Please re-upload.' },
];

const DocumentCenter = () => {
  const [uploading, setUploading] = useState(null);

  const handleUpload = (id) => {
    setUploading(id);
    setTimeout(() => {
      setUploading(null);
      toast.success('Document uploaded successfully. Pending verification.');
    }, 2000);
  };

  const getStatusConfig = (status) => {
    switch(status) {
      case 'verified': return { icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-500/10', text: 'Verified' };
      case 'expiring': return { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10', text: 'Expiring Soon' };
      case 'missing': return { icon: FileText, color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800', text: 'Missing' };
      case 'rejected': return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', text: 'Rejected' };
      default: return { icon: FileText, color: 'text-gray-400', bg: 'bg-gray-100', text: 'Unknown' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2 tracking-tighter">Document Center</h2>
          <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Keep your documents updated to stay online</p>
        </div>
        <div className="relative z-10 bg-white/20 px-6 py-4 rounded-2xl backdrop-blur-md text-center">
          <p className="text-[10px] font-black uppercase tracking-widest mb-1">Compliance Score</p>
          <p className="text-3xl font-black text-white flex items-center justify-center gap-1">85<span className="text-lg">%</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDocs.map((doc, idx) => {
          const config = getStatusConfig(doc.status);
          const Icon = config.icon;

          return (
            <motion.div 
              key={doc.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className={`bg-white dark:bg-dark-card rounded-3xl p-6 border-2 transition-all ${doc.status === 'rejected' ? 'border-red-500/50 shadow-lg shadow-red-500/10' : doc.status === 'expiring' ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/10' : 'border-gray-100 dark:border-gray-800'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bg}`}>
                  <Icon size={24} className={config.color} />
                </div>
                <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${config.bg} ${config.color}`}>
                  {config.text}
                </div>
              </div>

              <h3 className="text-sm font-black text-gray-900 dark:text-white mb-1">{doc.name}</h3>
              {doc.expiry && (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Valid till: <span className={doc.status === 'expiring' ? 'text-yellow-500' : ''}>{doc.expiry}</span>
                </p>
              )}
              {doc.reason && (
                <p className="text-[10px] font-bold text-red-500 bg-red-500/10 p-2 rounded-lg mb-4">{doc.reason}</p>
              )}

              <div className="flex gap-3 mt-auto pt-4 border-t border-gray-50 dark:border-gray-800/50">
                {(doc.status === 'missing' || doc.status === 'rejected' || doc.status === 'expiring') ? (
                  <button 
                    onClick={() => handleUpload(doc.id)}
                    disabled={uploading === doc.id}
                    className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {uploading === doc.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <><Upload size={14} /> Upload New</>
                    )}
                  </button>
                ) : (
                  <button className="flex-1 py-3 bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                    <Eye size={14} /> View Document
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentCenter;

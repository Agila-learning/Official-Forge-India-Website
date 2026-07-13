import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Car, CheckCircle, XCircle, Clock, Upload, ChevronRight, Shield, AlertTriangle, FileText } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const DOC_TYPES = [
  { key: 'rcDocument', label: 'RC Book (Registration Certificate)', icon: FileText },
  { key: 'insuranceDocument', label: 'Insurance Certificate', icon: Shield },
  { key: 'permitDocument', label: 'Commercial Permit', icon: FileText },
  { key: 'fitnessCertificate', label: 'Fitness Certificate', icon: CheckCircle },
  { key: 'pollutionCertificate', label: 'Pollution Certificate', icon: AlertTriangle },
];

const VEHICLE_CATEGORIES = ['Bike', 'Auto', 'Mini', 'Sedan', 'SUV', 'Luxury', 'Pickup Truck', 'Van'];

const DocStatusBadge = ({ status }) => {
  const styles = {
    Verified: 'bg-green-500/10 text-green-500 border-green-500/20',
    Rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
    Pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    Missing: 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-white/5 dark:border-gray-700',
  };
  const icons = { Verified: CheckCircle, Rejected: XCircle, Pending: Clock, Missing: Upload };
  const Icon = icons[status] || Upload;
  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status]}`}>
      <Icon size={10} /> {status}
    </span>
  );
};

const VehicleManagement = ({ vehicles, activeVehicle, onSwitch, onVehicleAdded }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    vehicleCategory: 'Mini',
    registrationNumber: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: ''
  });
  const [docUrl, setDocUrl] = useState('');
  const [docType, setDocType] = useState('rcDocument');
  const [docExpiry, setDocExpiry] = useState('');
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    if (vehicles?.length > 0 && !selectedVehicle) {
      setSelectedVehicle(activeVehicle || vehicles[0]);
    }
  }, [vehicles]);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/vehicles', form);
      toast.success(`${form.make} ${form.model} added! Awaiting admin KYC approval.`);
      setShowAddForm(false);
      setForm({ vehicleCategory: 'Mini', registrationNumber: '', make: '', model: '', year: new Date().getFullYear(), color: '' });
      if (onVehicleAdded) onVehicleAdded(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetActive = async (vehicle) => {
    try {
      await api.put(`/vehicles/${vehicle._id}/set-active`);
      if (onSwitch) onSwitch(vehicle._id);
      setSelectedVehicle(vehicle);
      toast.success(`Switched to ${vehicle.make} ${vehicle.model}`);
    } catch (err) {
      toast.error('Failed to switch vehicle');
    }
  };

  const handleUploadDoc = async (e) => {
    e.preventDefault();
    if (!docUrl || !selectedVehicle) return;
    setUploadingDoc(true);
    try {
      const { data } = await api.put(`/vehicles/${selectedVehicle._id}/document`, {
        docType,
        url: docUrl,
        expiryDate: docExpiry || null
      });
      toast.success('Document submitted for admin verification!');
      setDocUrl('');
      setDocExpiry('');
      // Refresh selected vehicle
      setSelectedVehicle(data.vehicle);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingDoc(false);
    }
  };

  const getKYCScore = (vehicle) => {
    if (!vehicle) return 0;
    const docs = ['rcDocument', 'insuranceDocument', 'permitDocument', 'fitnessCertificate', 'pollutionCertificate'];
    const verified = docs.filter(d => vehicle[d]?.status === 'Verified').length;
    return Math.round((verified / docs.length) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">Vehicle Management</h2>
          <p className="text-sm font-bold text-gray-500 mt-1">Switch vehicles, upload documents, and track KYC status</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all"
        >
          <Plus size={18} /> Add Vehicle
        </button>
      </div>

      {/* Add Vehicle Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-dark-card rounded-3xl border border-blue-100 dark:border-blue-500/20 p-6 shadow-xl"
          >
            <h3 className="text-lg font-black uppercase tracking-widest mb-4 text-blue-600">Add New Vehicle</h3>
            <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Category</label>
                <select
                  value={form.vehicleCategory}
                  onChange={e => setForm({ ...form, vehicleCategory: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {VEHICLE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Registration Number</label>
                <input required value={form.registrationNumber} onChange={e => setForm({ ...form, registrationNumber: e.target.value.toUpperCase() })} placeholder="TN 07 AB 1234" className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Make (Brand)</label>
                <input required value={form.make} onChange={e => setForm({ ...form, make: e.target.value })} placeholder="Maruti, Honda..." className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Model</label>
                <input required value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} placeholder="Swift Dzire, City..." className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Year</label>
                <input type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} min={2000} max={2030} className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Color</label>
                <input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} placeholder="White, Black..." className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/5 font-black text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-all">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 transition-all disabled:opacity-60 shadow-lg shadow-blue-600/30">
                  {isSubmitting ? 'Adding...' : 'Submit for KYC Approval'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vehicle List */}
      {vehicles && vehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {vehicles.map(v => {
            const kycScore = getKYCScore(v);
            const isActive = activeVehicle?._id === v._id || selectedVehicle?._id === v._id;
            return (
              <motion.div
                key={v._id}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedVehicle(v)}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all relative overflow-hidden ${isActive ? 'border-blue-500 bg-blue-500/5 shadow-xl shadow-blue-500/10' : 'border-gray-200 dark:border-gray-800 hover:border-blue-300 bg-white dark:bg-dark-card'}`}
              >
                {isActive && <div className="absolute top-0 right-0 bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl">Active</div>}
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                    <Car size={22} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-gray-900 dark:text-white">{v.make} {v.model}</h3>
                    <p className="text-sm font-bold text-gray-500">{v.registrationNumber} · {v.vehicleCategory}</p>
                    <p className="text-xs font-bold text-gray-400">{v.year} · {v.color}</p>
                  </div>
                </div>

                {/* KYC Score */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">KYC Score</span>
                    <span className={`text-xs font-black ${kycScore === 100 ? 'text-green-500' : kycScore > 50 ? 'text-yellow-500' : 'text-red-500'}`}>{kycScore}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${kycScore === 100 ? 'bg-green-500' : kycScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${kycScore}%`, transition: 'width 0.8s' }} />
                  </div>
                </div>

                {/* Doc statuses */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {DOC_TYPES.map(d => (
                    <DocStatusBadge key={d.key} status={v[d.key]?.status || 'Missing'} />
                  ))}
                </div>

                {!isActive && (
                  <button onClick={(e) => { e.stopPropagation(); handleSetActive(v); }} className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all">
                    Set as Active
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800">
          <Car size={40} className="text-gray-300 mx-auto mb-3" />
          <h3 className="font-black text-lg text-gray-500 mb-2">No Vehicles Added</h3>
          <p className="text-sm text-gray-400 mb-4">Add your first vehicle and complete KYC to start accepting rides.</p>
          <button onClick={() => setShowAddForm(true)} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-sm shadow-lg shadow-blue-600/30">
            + Add Vehicle
          </button>
        </div>
      )}

      {/* Document Upload Panel */}
      {selectedVehicle && (
        <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <h3 className="font-black text-lg uppercase tracking-tight mb-1 text-gray-900 dark:text-white">Document Center</h3>
          <p className="text-xs font-bold text-gray-400 mb-6">Upload documents for: {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.registrationNumber})</p>
          
          {/* Per-document status list */}
          <div className="space-y-3 mb-6">
            {DOC_TYPES.map(d => {
              const doc = selectedVehicle[d.key];
              return (
                <div key={d.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl">
                  <div className="flex items-center gap-3">
                    <d.icon size={18} className="text-gray-500" />
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">{d.label}</p>
                      {doc?.expiryDate && <p className="text-[10px] text-gray-400 font-bold">Expires: {new Date(doc.expiryDate).toLocaleDateString()}</p>}
                    </div>
                  </div>
                  <DocStatusBadge status={doc?.status || 'Missing'} />
                </div>
              );
            })}
          </div>

          {/* Upload Form */}
          <form onSubmit={handleUploadDoc} className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-5">
            <h4 className="font-black text-sm uppercase tracking-widest text-gray-500">Submit Document URL</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Document Type</label>
                <select value={docType} onChange={e => setDocType(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {DOC_TYPES.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Document URL</label>
                <input required value={docUrl} onChange={e => setDocUrl(e.target.value)} placeholder="https://drive.google.com/..." className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Expiry Date (optional)</label>
                <input type="date" value={docExpiry} onChange={e => setDocExpiry(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <button type="submit" disabled={uploadingDoc} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all disabled:opacity-60">
              {uploadingDoc ? 'Submitting...' : '📤 Submit for Admin Verification'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;

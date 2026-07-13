import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, FileText, Car, Clock, XCircle, CheckCircle, UploadCloud, Loader2, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const DriverOnboarding = () => {
  const { step } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [documents, setDocuments] = useState({
    aadhaar: '',
    pan: '',
    drivingLicense: ''
  });

  const [fetchingGps, setFetchingGps] = useState(false);

  const [vehicleDocuments, setVehicleDocuments] = useState({
    rcDocument: '',
    insuranceDocument: ''
  });

  useEffect(() => {
    fetchDriverProfile();
  }, [step]);

  const fetchDriverProfile = async () => {
    try {
      const { data } = await api.get('/users/profile');
      if (data && data.driverProfile) {
        setDriver(data.driverProfile);
        
        // Auto-navigate based on verification status if trying to access the wrong step
        const status = data.driverProfile.verificationStatus;
        if (status === 'Pending' && !['setup', 'documents', 'vehicle'].includes(step)) {
          navigate('/driver/onboarding/setup');
        } else if (status === 'Documents Uploaded' && step !== 'vehicle') {
          // But wait, our API sets status to 'Pending' if Own Vehicle and needs RC
          // or 'Under Review' immediately.
        } else if (status === 'Under Review' && step !== 'review') {
          navigate('/driver/onboarding/review');
        } else if (status === 'Verified') {
          navigate(driver.driverType === 'Delivery Partner' || driver.driverType === 'Logistics Driver' ? '/delivery-dashboard' : '/driver-dashboard');
        }
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, type, category) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const { data } = await api.post(`/upload?documentType=${type}`, formData);
      const url = typeof data === 'string' ? (data.startsWith('/') ? `http://localhost:5001${data}` : data) : data.url || data;
      
      if (category === 'identity') {
        setDocuments(prev => ({ ...prev, [type]: url }));
      } else {
        setVehicleDocuments(prev => ({ ...prev, [type]: url }));
      }
      toast.success(`${type} uploaded successfully!`);
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  const submitIdentityDocuments = async () => {
    if (!documents.aadhaar || !documents.pan || !documents.drivingLicense) {
      toast.error('Please upload all required identity documents');
      return;
    }
    
    try {
      await api.put('/users/driver/onboarding', { documents, step: 'documents' });
      toast.success('Identity Documents Submitted!');
      
      if (driver.vehicleOwnership === 'Own Vehicle') {
        navigate('/driver/onboarding/vehicle');
      } else {
        navigate('/driver/onboarding/review');
      }
    } catch (err) {
      toast.error('Submission failed');
    }
  };

  const submitVehicleDocuments = async () => {
    if (!vehicleDocuments.rcDocument || !vehicleDocuments.insuranceDocument) {
      toast.error('Please upload all required vehicle documents');
      return;
    }

    try {
      await api.put('/users/driver/onboarding', { vehicleDocuments, step: 'vehicle' });
      toast.success('Vehicle Documents Submitted!');
      if (driver.verificationStatus === 'Verified') {
        navigate(driver.driverType === 'Delivery Partner' || driver.driverType === 'Logistics Driver' ? '/delivery-dashboard' : '/driver-dashboard');
      } else {
        navigate('/driver/onboarding/review');
      }
    } catch (err) {
      toast.error('Submission failed');
    }
  };

  const FileUploader = ({ label, type, category, currentValue }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <label className={`w-full p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${currentValue ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-800 hover:border-primary hover:bg-slate-50 dark:hover:bg-dark-card'}`}>
        {currentValue ? (
          <>
            <CheckCircle className="text-green-500 mb-2" size={32} />
            <span className="text-sm font-bold text-green-600">Document Uploaded</span>
          </>
        ) : (
          <>
            <UploadCloud className="text-slate-400 mb-2" size={32} />
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Click to Upload</span>
          </>
        )}
        <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, type, category)} disabled={uploading} />
      </label>
    </div>
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-dark-bg"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  }

  const getScreenContent = () => {
    switch(step) {
      case 'setup':
        return (
          <div className="text-center">
            <ShieldAlert size={64} className="text-blue-500 mb-6 mx-auto" />
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Complete Your Profile</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">We need a few documents to verify your identity and your current location before you can start accepting rides.</p>
            <button 
              disabled={fetchingGps}
              onClick={async () => {
                setFetchingGps(true);
                toast.loading('Fetching GPS Location...', { id: 'gps' });
                try {
                  await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                      async (pos) => {
                        try {
                          await api.put('/rides/driver/location', { lat: pos.coords.latitude, lng: pos.coords.longitude });
                          resolve();
                        } catch(e) { reject(e); }
                      },
                      (err) => reject(err),
                      { enableHighAccuracy: true, timeout: 10000 }
                    );
                  });
                  toast.success('Location verified!', { id: 'gps' });
                  navigate('/driver/onboarding/documents');
                } catch (err) {
                  toast.error('Failed to get GPS location. Please enable location services.', { id: 'gps' });
                } finally {
                  setFetchingGps(false);
                }
              }} 
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              {fetchingGps ? <Loader2 className="animate-spin" /> : <MapPin size={18} />}
              {fetchingGps ? 'Fetching GPS...' : 'Start Verification'}
            </button>
          </div>
        );
      case 'documents':
        return (
          <div className="w-full">
            <div className="text-center mb-8">
              <FileText size={48} className="text-orange-500 mb-4 mx-auto" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Identity Verification</h2>
              <p className="text-slate-500 dark:text-slate-400">Upload clear photos of your original documents</p>
            </div>
            <div className="grid grid-cols-1 gap-6 mb-8">
              <FileUploader label="Aadhaar Card (Front & Back)" type="aadhaar" category="identity" currentValue={documents.aadhaar} />
              <FileUploader label="PAN Card" type="pan" category="identity" currentValue={documents.pan} />
              <FileUploader label="Driving License" type="drivingLicense" category="identity" currentValue={documents.drivingLicense} />
            </div>
            <button onClick={submitIdentityDocuments} disabled={uploading} className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
              {uploading ? <Loader2 className="animate-spin" /> : 'Submit Identity Docs'}
            </button>
          </div>
        );
      case 'vehicle':
        if (driver?.vehicleOwnership !== 'Own Vehicle') {
           navigate('/driver/onboarding/review');
           return null;
        }
        return (
          <div className="w-full">
            <div className="text-center mb-8">
              <Car size={48} className="text-purple-500 mb-4 mx-auto" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Vehicle Documents</h2>
              <p className="text-slate-500 dark:text-slate-400">Upload RC and Insurance for your {driver?.driverType}</p>
            </div>
            <div className="grid grid-cols-1 gap-6 mb-8">
              <FileUploader label="Registration Certificate (RC)" type="rcDocument" category="vehicle" currentValue={vehicleDocuments.rcDocument} />
              <FileUploader label="Valid Insurance" type="insuranceDocument" category="vehicle" currentValue={vehicleDocuments.insuranceDocument} />
            </div>
            <button onClick={submitVehicleDocuments} disabled={uploading} className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
              {uploading ? <Loader2 className="animate-spin" /> : 'Submit Vehicle Docs'}
            </button>
          </div>
        );
      case 'review':
        return (
          <div className="text-center">
            <Clock size={64} className="text-yellow-500 mb-6 mx-auto" />
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Under Review</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Your profile is currently under review. 
              {driver?.vehicleOwnership === 'Company Assigned Vehicle' && " Our admin will assign a vehicle to you shortly."}
            </p>
            <button onClick={() => window.location.reload()} className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-black uppercase tracking-widest transition-colors">
              Refresh Status
            </button>
          </div>
        );
      case 'suspended':
        return (
          <div className="text-center">
            <XCircle size={64} className="text-red-600 mb-6 mx-auto" />
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Account Suspended</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Your driver account is currently suspended due to policy violations. Contact support for more information.</p>
            <button className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black uppercase tracking-widest transition-colors">
              Contact Support
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0A0B0D] flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md bg-white dark:bg-dark-card rounded-[32px] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {getScreenContent()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DriverOnboarding;

import React, { useState, useEffect } from 'react';
import { 
  Users, Search, ShieldCheck, XCircle, FileText, 
  Car, CheckCircle, Clock, ExternalLink, Activity
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDriverVerification = () => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [activeTab, setActiveTab] = useState('drivers'); // 'drivers' or 'vehicles'
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'drivers') {
        const { data } = await api.get('/users/admin/driver-verifications');
        setDrivers(data);
      } else {
        const { data } = await api.get('/vehicles/pending-kyc');
        setVehicles(data);
      }
    } catch (error) {
      toast.error('Failed to load pending verifications');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (status) => {
    try {
      setIsProcessing(true);
      if (activeTab === 'drivers') {
        await api.put(`/users/admin/driver-verifications/${selectedItem.driver._id}`, { status });
        toast.success(`Driver ${status === 'Verified' ? 'Approved' : 'Rejected'}`);
      }
      setSelectedItem(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVehicleDocAction = async (docType, status) => {
    try {
      setIsProcessing(true);
      await api.put(`/vehicles/${selectedItem._id}/verify`, { docType, status });
      toast.success(`${docType} ${status === 'Verified' ? 'Approved' : 'Rejected'}`);
      // Refresh
      const { data } = await api.get('/vehicles/pending-kyc');
      setVehicles(data);
      
      const updatedVehicle = data.find(v => v._id === selectedItem._id);
      if (!updatedVehicle || !['rcDocument', 'insuranceDocument', 'permitDocument'].some(d => updatedVehicle[d]?.status === 'Pending')) {
         setSelectedItem(null); // All done
      } else {
         setSelectedItem(updatedVehicle);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredItems = (activeTab === 'drivers' ? drivers : vehicles).filter(item => {
    if (activeTab === 'drivers') {
      const str = `${item.driver.user.firstName} ${item.driver.user.lastName} ${item.driver.user.email}`.toLowerCase();
      return str.includes(searchTerm.toLowerCase());
    } else {
      const owner = item.ownerId || {};
      const str = `${item.registrationNumber} ${item.make} ${item.model} ${owner.firstName} ${owner.lastName}`.toLowerCase();
      return str.includes(searchTerm.toLowerCase());
    }
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Driver Verifications</h1>
        <p className="text-gray-500 mt-1">Review and approve driver KYC documents</p>
      </div>

      <div className="mb-6 flex items-center gap-4 border-b border-gray-200">
        <button 
          onClick={() => { setActiveTab('drivers'); setSelectedItem(null); }}
          className={`pb-3 font-semibold text-sm transition-colors relative ${activeTab === 'drivers' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Driver KYC ({drivers.length})
          {activeTab === 'drivers' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />}
        </button>
        <button 
          onClick={() => { setActiveTab('vehicles'); setSelectedItem(null); }}
          className={`pb-3 font-semibold text-sm transition-colors relative ${activeTab === 'vehicles' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Vehicle Approvals ({vehicles.length})
          {activeTab === 'vehicles' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Activity className="w-4 h-4 text-orange-500" />
            <span>{filteredItems.length} Pending Approvals</span>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading {activeTab}...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">All Caught Up!</h3>
            <p className="text-gray-500">There are no pending {activeTab} verifications at the moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">{activeTab === 'drivers' ? 'Driver' : 'Vehicle'}</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">{activeTab === 'drivers' ? 'Type' : 'Owner'}</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      {activeTab === 'drivers' ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {item.driver.user.firstName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.driver.user.firstName} {item.driver.user.lastName}
                            </div>
                            <div className="text-xs text-gray-500">{item.driver.user.email}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                            <Car size={20} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{item.make} {item.model}</div>
                            <div className="text-xs font-bold text-gray-500">{item.registrationNumber}</div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {activeTab === 'drivers' ? (
                        <>
                          <div className="text-sm text-gray-700">{item.driver.driverType}</div>
                          <div className="text-xs text-gray-500 mt-1">{item.driver.vehicleOwnership}</div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-700">{item.ownerId?.firstName} {item.ownerId?.lastName}</div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <Clock className="w-3.5 h-3.5" />
                        Pending Review
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Review Docs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-indigo-600" />
                  {activeTab === 'drivers' ? 'Driver Profile Verification' : 'Vehicle Verification'}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircle className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Details Column */}
                <div className="space-y-6">
                  {activeTab === 'drivers' ? (
                    <>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Driver Information</h3>
                        <div className="bg-gray-50 p-4 rounded-xl space-y-3 text-sm">
                          <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{selectedItem.driver.user.firstName} {selectedItem.driver.user.lastName}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium">{selectedItem.driver.user.email}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Role</span><span className="font-medium">{selectedItem.driver.driverType}</span></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Vehicle Details</h3>
                        <div className="bg-gray-50 p-4 rounded-xl space-y-3 text-sm">
                          <div className="flex justify-between"><span className="text-gray-500">Registration</span><span className="font-bold">{selectedItem.registrationNumber}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Make & Model</span><span className="font-medium">{selectedItem.make} {selectedItem.model}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Category</span><span className="font-medium">{selectedItem.vehicleCategory}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Owner</span><span className="font-medium">{selectedItem.ownerId?.firstName} {selectedItem.ownerId?.lastName}</span></div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Documents Column */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Documents for Review</h3>
                  <div className="space-y-4">
                    {activeTab === 'drivers' ? (
                      <>
                        {selectedItem.documents?.aadhaar?.frontImageUrl && <DocumentPreview label="Aadhaar Card" url={selectedItem.documents.aadhaar.frontImageUrl} />}
                        {selectedItem.documents?.drivingLicense?.frontImageUrl && <DocumentPreview label="Driving License" url={selectedItem.documents.drivingLicense.frontImageUrl} />}
                      </>
                    ) : (
                      <>
                        {['rcDocument', 'insuranceDocument', 'permitDocument'].map(docKey => {
                          const doc = selectedItem[docKey];
                          if (!doc || !doc.url) return null;
                          return (
                            <div key={docKey} className="border border-gray-200 rounded-xl p-3 bg-white">
                              <DocumentPreview label={docKey.replace('Document', '')} url={doc.url} />
                              {doc.status === 'Pending' && (
                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                  <button onClick={() => handleVehicleDocAction(docKey, 'Rejected')} className="flex-1 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-md">Reject</button>
                                  <button onClick={() => handleVehicleDocAction(docKey, 'Verified')} className="flex-1 py-1.5 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded-md">Approve</button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            {activeTab === 'drivers' && (
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 sticky bottom-0 z-10">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleAction('Rejected')}
                  className="px-5 py-2.5 bg-red-50 text-red-600 font-medium hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2"
                  disabled={isProcessing}
                >
                  <XCircle className="w-4 h-4" /> Reject Driver
                </button>
                <button 
                  onClick={() => handleAction('Verified')}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2"
                  disabled={isProcessing}
                >
                  <CheckCircle className="w-4 h-4" /> Approve Driver
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DocumentPreview = ({ label, url }) => {
  // If the URL is a local filename, construct the full localhost URL, else use it as is
  const fullUrl = url.startsWith('http') ? url : `http://localhost:5001${url}`;
  
  return (
    <div className="border border-gray-200 rounded-xl p-3 bg-white flex items-center justify-between hover:border-indigo-300 transition-colors group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">{label}</h4>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
            <CheckCircle className="w-3 h-3" /> Uploaded
          </p>
        </div>
      </div>
      <a 
        href={fullUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
        title="View full size"
      >
        <ExternalLink className="w-5 h-5" />
      </a>
    </div>
  );
};

export default AdminDriverVerification;

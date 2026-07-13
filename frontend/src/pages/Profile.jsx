import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { User, Package, Heart, LogOut, ChevronRight, Clock, Star, ShieldCheck, Save, Loader2, Mail, Phone, Lock, Unlock, Eye, FileText, Download, Trash2, History, Database, MapPin, Plus, Zap, CreditCard, Settings, Shield, ShoppingBag, Gift, ArrowUpRight, X, Compass, Building, Home, Car, BookOpen, Briefcase, Activity, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useLocation as useAppLocation } from '../context/LocationContext';
import InvoiceModal from '../components/ui/InvoiceModal';
import toast from 'react-hot-toast';
import WebUsageGuide from '../components/ui/WebUsageGuide';
import MembershipCard from '../components/ui/MembershipCard';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate) - new Date();
      if (difference <= 0) {
        setTimeLeft('EXPIRED');
        return;
      }
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft === 'EXPIRED') {
    return <span className="text-red-500 font-black">AUTO-CANCELLED</span>;
  }

  return (
    <span className="text-yellow-500 font-black flex items-center gap-1">
      <Clock size={12} className="animate-pulse" /> Auto-Cancel in {timeLeft}
    </span>
  );
};

// ─── Ride History Sub-Component ───────────────────────────────────────────────
const RideHistorySection = ({ orders, navigate }) => {
  const rideServiceTypes = ['Bike', 'Auto', 'Car', 'Mini', 'Sedan', 'SUV', 'Luxury', 'Van',
    'Pickup Truck', 'Bike Ride', 'Premium Taxi', 'Delivery Service', 'Parcel Delivery', 'Bike Taxi'];
  const rideHistory = (orders || [])
    .filter(o => o.isService && rideServiceTypes.includes(o.serviceType))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const [ratingState, setRatingState] = React.useState({});
  const [submittingRating, setSubmittingRating] = React.useState(null);

  const submitRating = async (rideId, rating, feedback) => {
    try {
      setSubmittingRating(rideId);
      const { default: api } = await import('../services/api');
      await api.put(`/rides/${rideId}/rate`, { rating, feedback });
      toast.success('Rating submitted! Thank you.');
      setRatingState(p => ({ ...p, [rideId]: { ...p[rideId], submitted: true } }));
    } catch { toast.error('Could not submit rating'); }
    finally { setSubmittingRating(null); }
  };

  if (rideHistory.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
        <Car size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No ride history yet</p>
        <button onClick={() => navigate('/rides/book')} className="mt-4 px-6 py-3 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">Book Your First Ride</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rideHistory.map(ride => {
        const isCompleted = ride.status === 'Completed' || ride.isDelivered;
        const isCancelled = ride.status === 'Cancelled';
        const hasRating = !!ride.rideMetadata?.customerRating;
        const rs = ratingState[ride._id] || {};
        const driver = ride.deliveryPartner;

        return (
          <div key={ride._id} className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isCompleted ? 'bg-emerald-100 dark:bg-emerald-900/30' : isCancelled ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                    <Car size={20} className={isCompleted ? 'text-emerald-600' : isCancelled ? 'text-red-500' : 'text-blue-600'} />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 dark:text-white text-sm">{ride.serviceType || 'Ride'}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{new Date(ride.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-gray-900 dark:text-white">₹{ride.totalPrice || '—'}</p>
                  <span className={`inline-block px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full mt-1 ${isCompleted ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : isCancelled ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                    {ride.status}
                  </span>
                </div>
              </div>

              {/* Route */}
              <div className="relative pl-4 space-y-3 border-l-2 border-gray-100 dark:border-white/10 ml-1">
                {[
                  { label: 'Pickup', addr: ride.pickupDetails?.location || '—', color: 'bg-blue-500' },
                  { label: 'Drop-off', addr: ride.shippingAddress?.address || '—', color: 'bg-orange-500' }
                ].map(({ label, addr, color }) => (
                  <div key={label} className="relative">
                    <div className={`absolute -left-[21px] top-0.5 w-3 h-3 ${color} rounded-full`} />
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                    <p className="text-xs font-black text-gray-700 dark:text-gray-300">{addr}</p>
                  </div>
                ))}
              </div>

              {/* Driver */}
              {driver && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-2xl">
                  <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-black text-sm">{driver.firstName?.[0] || 'D'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-gray-900 dark:text-white">{driver.firstName} {driver.lastName || ''}</p>
                    <p className="text-[9px] text-gray-400 font-bold">Your Driver</p>
                  </div>
                  {ride.rideMetadata?.driverRating && (
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-black">{ride.rideMetadata.driverRating}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {ride.rideMetadata?.distanceKm && <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-[10px] font-black rounded-xl">{ride.rideMetadata.distanceKm} km</span>}
                {ride.rideMetadata?.durationMin && <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-[10px] font-black rounded-xl">{ride.rideMetadata.durationMin} min</span>}
                <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-[10px] font-black rounded-xl">{ride.paymentMethod}</span>
              </div>

              {/* Rating */}
              {isCompleted && driver && !hasRating && !rs.submitted && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 rounded-2xl space-y-3">
                  <p className="text-xs font-black text-amber-700 dark:text-amber-400">Rate your driver</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} onClick={() => setRatingState(p => ({ ...p, [ride._id]: { ...p[ride._id], rating: n } }))}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${(rs.rating || 0) >= n ? 'bg-amber-400 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-400'}`}>
                        <Star size={16} fill={(rs.rating || 0) >= n ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <input placeholder="Leave a comment (optional)..." value={rs.feedback || ''} onChange={e => setRatingState(p => ({ ...p, [ride._id]: { ...p[ride._id], feedback: e.target.value } }))}
                    className="w-full px-4 py-2 text-xs font-bold rounded-xl border border-amber-200 dark:border-amber-500/30 bg-white dark:bg-dark-bg outline-none text-gray-700 dark:text-gray-300" />
                  <button disabled={!rs.rating || submittingRating === ride._id}
                    onClick={() => submitRating(ride._id, rs.rating, rs.feedback)}
                    className="px-5 py-2 bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-40 flex items-center gap-2">
                    {submittingRating === ride._id ? <Loader2 size={14} className="animate-spin" /> : <Star size={14} />}
                    Submit Rating
                  </button>
                </div>
              )}
              {(hasRating || rs.submitted) && (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={14} />
                  <span className="text-xs font-black">Rated {ride.rideMetadata?.customerRating || rs.rating}★ — Thank you!</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Profile = () => {

 const navigate = useNavigate();
 const [orders, setOrders] = useState([]);
 const { favorites, toggleWishlist } = useWishlist();
 const { addToCart } = useCart();
 const [reviews, setReviews] = useState([]);
 const [loading, setLoading] = useState(true);
 const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
 const [selectedOrder, setSelectedOrder] = useState(null);
 const [activeTab, setActiveTab] = useState('Active Operations');
 const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingId, setUploadingId] = useState(false);
  const [vaultDocs, setVaultDocs] = useState([]);
  const [isVaultLocked, setIsVaultLocked] = useState(true);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState('');
  const [vaultActivities, setVaultActivities] = useState([
    { action: 'Vault initialized with AES-256', time: '1 hour ago' },
    { action: 'Session encryption handshake completed', time: '30 mins ago' }
  ]);
 const [membershipData, setMembershipData] = useState(null);
 const [membershipPlans, setMembershipPlans] = useState([]);
 const [trustedContacts, setTrustedContacts] = useState([]);
 const [isTrustedContactsModalOpen, setIsTrustedContactsModalOpen] = useState(false);
 const [newContactName, setNewContactName] = useState('');
 const [newContactPhone, setNewContactPhone] = useState('');
 const [newContactRelation, setNewContactRelation] = useState('Family');
 
 // Cancellation Modal State
 const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
 const [cancellingOrderId, setCancellingOrderId] = useState(null);
 const [cancelReason, setCancelReason] = useState('');
 const [cancelStep, setCancelStep] = useState(1);
 const [cancelLoading, setCancelLoading] = useState(false);

 // Review Modal State
 const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
 const [reviewingItem, setReviewingItem] = useState(null); // { productId, productName }
 const [reviewRating, setReviewRating] = useState(5);
 const [reviewHover, setReviewHover] = useState(0);
 const [reviewComment, setReviewComment] = useState('');
 const [reviewSubmitting, setReviewSubmitting] = useState(false);
 
 const userInfoStr = localStorage.getItem('userInfo');
 const [profileData, setProfileData] = useState(JSON.parse(localStorage.getItem('userInfo') || '{}'));
 const { location: appLocation, setShowModal } = useAppLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        const existingUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const updatedUserInfo = { ...existingUserInfo, ...data };
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        setProfileData(updatedUserInfo);
      } catch (err) {
        console.error('Failed to sync profile with server');
      }
    };
    fetchProfile();
  }, []);

  const [driverForm, setDriverForm] = useState({
    driverType: 'Bike',
    vehicleOwnership: 'Own Vehicle',
    vehicleCategory: 'Bike',
    registrationNumber: '',
    make: '',
    model: '',
    year: '',
    color: '',
    rcDocumentImage: '',
    rcExpiry: '',
    insuranceDocumentImage: '',
    insuranceExpiry: '',
    aadhaarNumber: '',
    aadhaarFrontImage: '',
    panNumberValue: '',
    panImage: '',
    licenseNumberValue: '',
    licenseExpiry: '',
    licenseFrontImage: '',
    bankAccountNumber: '',
    bankIfscCode: '',
    bankName: '',
    bankHolderName: '',
    panNumber: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [managedVehicleDetails, setManagedVehicleDetails] = useState(profileData?.vehicleDetails || {});
  const [myApplications, setMyApplications] = useState([]);

  useEffect(() => {
    if (profileData) {
      const p = profileData;
      const driver = p.driverProfile || {};
      const docs = p.driverDocuments || {};
      const vehicle = driver.activeVehicle || {};
      const bank = p.bankDetails || {};
      
      setDriverForm({
        driverType: driver.driverType || p.driverType || 'Bike',
        vehicleOwnership: driver.vehicleOwnership || p.vehicleOwnership || 'Own Vehicle',
        
        vehicleCategory: vehicle.vehicleCategory || 'Bike',
        registrationNumber: vehicle.registrationNumber?.startsWith('PENDING-') ? '' : vehicle.registrationNumber || '',
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || '',
        color: vehicle.color || '',
        rcDocumentImage: vehicle.rcDocument?.url || '',
        rcExpiry: vehicle.rcDocument?.expiryDate ? new Date(vehicle.rcDocument.expiryDate).toISOString().split('T')[0] : '',
        insuranceDocumentImage: vehicle.insuranceDocument?.url || '',
        insuranceExpiry: vehicle.insuranceDocument?.expiryDate ? new Date(vehicle.insuranceDocument.expiryDate).toISOString().split('T')[0] : '',
        
        aadhaarNumber: docs.aadhaar?.number || '',
        aadhaarFrontImage: docs.aadhaar?.frontImageUrl || '',
        panNumberValue: docs.pan?.number || '',
        panImage: docs.pan?.imageUrl || '',
        licenseNumberValue: docs.drivingLicense?.number || '',
        licenseExpiry: docs.drivingLicense?.expiryDate ? new Date(docs.drivingLicense.expiryDate).toISOString().split('T')[0] : '',
        licenseFrontImage: docs.drivingLicense?.frontImageUrl || '',
        
        bankAccountNumber: bank.accountNumber || '',
        bankIfscCode: bank.ifscCode || '',
        bankName: bank.bankName || '',
        bankHolderName: bank.holderName || '',
        panNumber: p.panNumber || '',
        
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [profileData]);

  const handleDriverDocUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('file', file);
    setUploading(true);

    try {
      const { data } = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const url = typeof data === 'string' ? data : data.url;
      setDriverForm(prev => ({ ...prev, [field]: url }));
      toast.success('Document uploaded successfully!');
    } catch (err) {
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

 useEffect(() => {
 const fetchUserData = async () => {
 try {
 const [ordersRes, userRes, reviewsRes, appsRes, plansRes] = await Promise.all([
 api.get('/orders/myorders'),
 api.get('/users/profile'),
 api.get('/reviews/myreviews'),
 api.get('/applications/mine').catch(() => ({ data: [] })),
 api.get('/membership-plans').catch(() => ({ data: [] }))
 ]);
 
 setMembershipPlans(plansRes.data || []);
 
 setOrders(ordersRes.data);
 setReviews(reviewsRes.data || []);
 setVaultDocs(userRes.data.profileDocuments || []);
 setMyApplications(appsRes.data || []);
 // Sync live membership data from server
 if (userRes.data.membershipVault) {
 setMembershipData(userRes.data.membershipVault);
 }
 // Update local profile with fresh server data
 const freshProfile = { ...JSON.parse(localStorage.getItem('userInfo') || '{}'), ...userRes.data };
 setProfileData(freshProfile);
 setTrustedContacts(userRes.data.trustedContacts || []);
 localStorage.setItem('userInfo', JSON.stringify(freshProfile));
 setLoading(false);
 } catch (err) {
 setLoading(false);
 }
 };
 fetchUserData();
 }, []);

 const productOrders = orders.filter(order => 
 order.orderItems.some(item => !item.slot || !item.slot.date) && !order.orderItems.some(item => item.isService)
 );
 
 const serviceBookings = orders.filter(order => 
 order.orderItems.some(item => (item.slot && item.slot.date) || item.isService)
 );

 const StatusPipeline = ({ status, type = 'product' }) => {
 if (status === 'Cancelled' || status === 'Refund Processing' || status === 'Refunded') {
 return (
 <div className="flex items-center gap-2 mt-4 text-red-500 font-black uppercase text-xs tracking-widest">
 <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-500 font-black text-xs">
 ✕
 </div>
 {status}
 </div>
 );
 }

 const productSteps = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
 const serviceSteps = ['Confirmed', 'Assigned', 'In Progress', 'Completed'];
 const steps = type === 'product' ? productSteps : serviceSteps;
 const currentIdx = steps.indexOf(status) !== -1 ? steps.indexOf(status) : 1;

 return (
 <div className="flex items-center gap-2 mt-4">
 {steps.map((step, idx) => (
 <React.Fragment key={step}>
 <div className="flex flex-col items-center gap-1">
 <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black transition-all ${
 idx <= currentIdx ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-100 dark:border-gray-800'
 }`}>
 {idx + 1}
 </div>
 <span className={`text-[7px] font-black uppercase tracking-tighter ${idx <= currentIdx ? 'text-primary' : 'text-gray-400'}`}>{step}</span>
 </div>
 {idx < steps.length - 1 && (
 <div className={`flex-1 h-[2px] min-w-[20px] -mt-4 ${idx < currentIdx ? 'bg-primary' : 'bg-gray-100 dark:bg-gray-800'}`}></div>
 )}
 </React.Fragment>
 ))}
 </div>
 );
 };

 const handleCancelOrder = async (orderId, reason = '') => {
 setCancelLoading(true);
 try {
 const { data } = await api.put(`/orders/${orderId}/cancel`, { reason });
 setOrders(orders.map(o => o._id === orderId ? data : o));
 toast.success(data.status === 'Refund Processing' ? 'Order Cancelled. Refund initiated.' : 'Order Cancelled.');
 setIsCancelModalOpen(false);
 setCancellingOrderId(null);
 setCancelReason('');
 setCancelStep(1);
 } catch (err) {
 toast.error(err.response?.data?.message || 'Cancellation failed');
 } finally {
 setCancelLoading(false);
 }
 };

  const handlePayBalance = async (order) => {
    try {
      const amountToPay = order.remainingDue || order.totalPrice;
      const { data: rzpOrder } = await api.post('/payments/create-order', {
        orderId: order._id,
        amount: amountToPay,
        receipt: `order_bal_${order._id.toString().slice(-8)}`
      });

      if (!rzpOrder || !rzpOrder.id) {
        throw new Error('Failed to synchronize with payment gateway');
      }

      const options = {
        key: rzpOrder.keyId,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "Forge India Connect",
        description: `Balance Payment for Booking`,
        image: "/logo.jpg",
        order_id: rzpOrder.id,
        handler: async (response) => {
          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
              amount: amountToPay
            };

            await api.post('/payments/verify', verifyPayload);
            toast.success('Payment Verified & Completed Successfully!');
            
            // Refresh data
            const ordersRes = await api.get('/orders/myorders');
            setOrders(ordersRes.data);
          } catch (err) {
            toast.error('Signature verification failed. Please contact support.');
          }
        },
        prefill: {
          name: `${profileData?.firstName || ''} ${profileData?.lastName || ''}`.trim() || 'Guest',
          email: profileData?.email || '',
          contact: profileData?.mobile || profileData?.phone || ''
        },
        theme: { color: "#2563eb" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment Error:', err);
      toast.error(err.response?.data?.message || 'Gateway Operational Failure');
    }
  };

 const handleOpenReview = (order) => {
 const item = order.orderItems?.[0];
 setReviewingItem({
 productId: item?.product || null,
 productName: item?.name || 'Service',
 orderId: order._id
 });
 setReviewRating(5);
 setReviewComment('');
 setIsReviewModalOpen(true);
 };

 const handleSubmitReview = async () => {
 if (!reviewComment.trim()) {
 toast.error('Please write a comment before submitting.');
 return;
 }
 setReviewSubmitting(true);
 try {
 await api.post('/reviews', {
 product: reviewingItem.productId,
 rating: reviewRating,
 comment: reviewComment,
 orderId: reviewingItem.orderId,
 productName: reviewingItem.productName
 });
 toast.success('Review submitted! Thank you.');
 setIsReviewModalOpen(false);
 setReviewComment('');
 setReviewRating(5);
 // Refresh reviews list
 const res = await api.get('/reviews/myreviews');
 setReviews(res.data || []);
 } catch (err) {
 toast.error(err.response?.data?.message || 'Failed to submit review');
 } finally {
 setReviewSubmitting(false);
 }
 };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', profileData);
      // Preserve existing token if it's not in the update response
      const existingUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const updatedUserInfo = { ...existingUserInfo, ...data };
      
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      setProfileData(updatedUserInfo);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };
  const handleVaultUpload = async (e, type = 'credential') => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    if (type === 'id_wallet') {
      setUploadingId(true);
    } else {
      setUploading(true);
    }

    try {
      const { data: fileUrl } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updatedDocs = [...vaultDocs, { url: fileUrl, name: file.name, type }];
      const { data } = await api.put('/users/profile', { profileDocuments: updatedDocs });
      
      setVaultDocs(data.profileDocuments);
      setVaultActivities(prev => [
        { action: `Document '${file.name}' (${type === 'id_wallet' ? 'ID Wallet' : 'Credential'}) uploaded`, time: 'Just now' },
        ...prev
      ]);
      toast.success(type === 'id_wallet' ? 'ID Document added to Vault' : 'Document added to Vault');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      setUploadingId(false);
    }
  };

  const [isPremiumView, setIsPremiumView] = useState(true);

  const handleRemoveDoc = async (docId) => {
    try {
      const docToRemove = vaultDocs.find(doc => doc._id === docId);
      const updatedDocs = vaultDocs.filter(doc => doc._id !== docId);
      const { data } = await api.put('/users/profile', { profileDocuments: updatedDocs });
      setVaultDocs(data.profileDocuments);
      setVaultActivities(prev => [
        { action: `Document '${docToRemove?.name || 'Unknown'}' removed`, time: 'Just now' },
        ...prev
      ]);
      toast.success('Document removed');
    } catch (err) {
      toast.error('Failed to remove document');
    }
  };

  const handleUnlockVault = (e) => {
    e.preventDefault();
    if (!unlockPassword) {
      toast.error('Please enter your decryption password');
      return;
    }
    toast.loading('Decrypting Security Vault...', { id: 'decrypt' });
    setTimeout(() => {
      setIsVaultLocked(false);
      setIsUnlockModalOpen(false);
      setUnlockPassword('');
      setVaultActivities(prev => [
        { action: 'Vault Decrypted & Unlocked', time: 'Just now' },
        ...prev
      ]);
      toast.success('Decryption Successful - Settings Unlocked!', { id: 'decrypt' });
    }, 1200);
  };

 const handleLogout = () => {
 localStorage.removeItem('userInfo');
 localStorage.removeItem('token');
 window.location.href = '/login';
 };

 const isMembershipExpired = membershipData?.cycleEndDate && new Date(membershipData.cycleEndDate) < new Date();

 const handleAddTrustedContact = async (e) => {
   e.preventDefault();
   try {
     const newContact = {
       name: newContactName,
       phone: newContactPhone,
       relation: newContactRelation,
       notifyOnEmergency: true
     };
     const updatedContacts = [...trustedContacts, newContact];
     const { data } = await api.put('/users/trusted-contacts', { contacts: updatedContacts });
     setTrustedContacts(data.trustedContacts);
     setIsTrustedContactsModalOpen(false);
     setNewContactName('');
     setNewContactPhone('');
     toast.success('Trusted Contact Added');
   } catch (err) {
     toast.error('Failed to add contact');
   }
 };

 const handleRemoveTrustedContact = async (index) => {
   try {
     const updatedContacts = trustedContacts.filter((_, i) => i !== index);
     const { data } = await api.put('/users/trusted-contacts', { contacts: updatedContacts });
     setTrustedContacts(data.trustedContacts);
     toast.success('Trusted Contact Removed');
   } catch (err) {
     toast.error('Failed to remove contact');
   }
 };

 return (
 <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-32 pb-20 px-6 sm:px-10 lg:px-16">
 <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
 {/* Sidebar */}
 <aside className="w-full lg:w-80 space-y-8">
  <div className="bg-white dark:bg-dark-card rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden text-center relative">
    <div className="h-32 bg-gray-200 dark:bg-gray-800 w-full relative">
       <img src="/assets/customer_banner.png" alt="Banner" className="w-full h-full object-cover" />
       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    </div>
    <div className="p-10 pt-0 relative -mt-12 z-10">
      <div className="w-24 h-24 bg-white dark:bg-dark-card rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-dark-bg shadow-xl">
        <span className="text-3xl font-black text-primary uppercase">{profileData?.firstName?.[0]}</span>
      </div>
      <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{profileData?.firstName} {profileData?.lastName}</h2>
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2 px-4 py-1 bg-gray-50 dark:bg-dark-bg rounded-lg inline-block border border-gray-100 dark:border-gray-800">{profileData?.role}</p>
      
      <button onClick={handleLogout} className="w-full mt-8 flex items-center justify-center gap-2 py-4 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all border border-red-50 dark:border-red-900/20">
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  </div>

 <nav className="bg-white dark:bg-dark-card p-4 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-lg flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible space-x-4 lg:space-x-0 lg:space-y-2 custom-scrollbar snap-x">
  {[
  { label: 'Active Operations', icon: Activity, count: 'LIVE', show: profileData?.role === 'Customer' },
  { label: 'Order History', icon: Package, count: productOrders.length, show: profileData?.role === 'Customer' },
  { label: 'Stay & Ride', icon: Compass, count: 'NEW', show: profileData?.role === 'Customer' },
 { label: 'Service Bookings', icon: Clock, count: serviceBookings.length, show: profileData?.role === 'Customer' },
 { label: 'Membership', icon: Zap, count: 'PRO', show: profileData?.role === 'Customer' },
 { label: 'Job Applications', icon: Briefcase, count: myApplications.length, show: profileData?.role === 'Customer' },
 { label: 'My Favorites', icon: Heart, count: favorites.length, show: profileData?.role === 'Customer' },
 { label: 'Review History', icon: History, count: reviews.length, show: profileData?.role === 'Customer' },
 { label: 'Security Vault', icon: Lock, count: null, show: profileData?.role === 'Customer' },
 { label: 'Trusted Circle', icon: Shield, count: trustedContacts.length, show: profileData?.role === 'Customer' },
 { label: 'Usage Guide', icon: BookOpen, count: null, show: profileData?.role === 'Customer' },
 { label: 'Vehicle & Documents', icon: Car, count: null, show: ['Driver', 'Delivery Partner'].includes(profileData?.role) },
 { label: 'Bank Details', icon: CreditCard, count: null, show: ['Driver', 'Delivery Partner', 'Vendor', 'Seller', 'Service Provider', 'Stay Provider', 'Trainer'].includes(profileData?.role) },
 { label: 'Security & Password', icon: Lock, count: null, show: profileData?.role !== 'Customer' },
 { label: 'Account Settings', icon: User, count: null, show: true },
 ].filter(item => item.show).map((item) => (
 <button 
 key={item.label} 
 onClick={() => {
   setActiveTab(item.label);
   if (window.innerWidth < 1024) {
     window.scrollTo({ top: document.querySelector('main')?.offsetTop - 80 || 300, behavior: 'smooth' });
   }
 }}
 className={`shrink-0 w-[220px] lg:w-full snap-start flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === item.label ? 'bg-primary/5 border border-primary/10' : 'hover:bg-gray-50 dark:hover:bg-dark-bg'}`}
 >
 <div className="flex items-center gap-4">
 <div className={`p-3 rounded-xl transition-colors ${activeTab === item.label ? 'bg-primary text-white' : 'bg-gray-50 dark:bg-dark-bg text-gray-400 group-hover:text-primary'}`}><item.icon size={20} /></div>
 <span className={`font-bold transition-colors ${activeTab === item.label ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>{item.label}</span>
 </div>
 {item.count !== null && <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full">{item.count}</span>}
 </button>
 ))}
 </nav>
 </aside>

 {/* Main Content */}
 <main className="flex-1 space-y-12">
  <AnimatePresence mode="wait">
  {activeTab === 'Active Operations' && (
    <motion.section 
      key="active-ops"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Active <span className="text-blue-500">Operations</span></h3>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Tracking</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
              <Compass size={24} />
            </div>
            <div>
              <h4 className="text-lg font-black uppercase tracking-tight">Active Bookings</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Live Rides & Stays</p>
            </div>
          </div>
          {serviceBookings.filter(b => !b.isDelivered).length === 0 ? (
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest text-center py-8">No active bookings</p>
          ) : (
            serviceBookings.filter(b => !b.isDelivered).map(b => (
              <div key={b._id} className="p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl mb-4 border border-blue-500/20">
                <p className="font-bold text-sm text-gray-900 dark:text-white uppercase">{b.orderItems?.[0]?.name}</p>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-blue-500 w-2/3 animate-pulse"></div>
                </div>
                <p className="text-[10px] font-black text-blue-500 uppercase mt-2 text-right">In Progress</p>
              </div>
            ))
          )}
        </div>

        <div className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center">
              <Package size={24} />
            </div>
            <div>
              <h4 className="text-lg font-black uppercase tracking-tight">Active Orders</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Pending Deliveries</p>
            </div>
          </div>
          {productOrders.filter(o => !o.isDelivered).length === 0 ? (
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest text-center py-8">No pending orders</p>
          ) : (
            productOrders.filter(o => !o.isDelivered).map(o => (
              <div key={o._id} className="p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl mb-4 border border-orange-500/20">
                <p className="font-bold text-sm text-gray-900 dark:text-white uppercase">Order #{o._id.slice(-6).toUpperCase()}</p>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-orange-500 w-1/3"></div>
                </div>
                <p className="text-[10px] font-black text-orange-500 uppercase mt-2 text-right">{o.status || 'Processing'}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.section>
  )}

 {activeTab === 'Order History' && (
 <motion.section 
 key="history"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 >
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Product <span className="text-primary">Orders</span></h3>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{productOrders.length} Recent Transactions</p>
 </div>
 {loading ? (
 <div className="h-64 flex items-center justify-center bg-white dark:bg-dark-card rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
 </div>
 ) : productOrders.length === 0 ? (
 <div className="bg-white dark:bg-dark-card p-16 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl text-center">
 <Package size={64} className="mx-auto text-gray-200 dark:text-gray-800 mb-6" />
 <h4 className="text-xl font-bold text-gray-400 uppercase tracking-widest">No orders found</h4>
 <p className="text-sm text-gray-400 mt-2">Start your journey by exploring our shop products!</p>
 </div>
 ) : (
 <div className="space-y-6">
 {productOrders.map(order => (
 <motion.div 
 initial={{ opacity: 0, scale: 0.98 }}
 animate={{ opacity: 1, scale: 1 }}
 key={order._id} 
 className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-2xl hover:border-primary/20 transition-all group"
 >
 <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 border-b border-gray-50 dark:border-gray-800 pb-6">
 <div className="flex items-center gap-6">
 <div className="w-14 h-14 bg-gray-50 dark:bg-dark-bg rounded-2xl flex items-center justify-center text-primary border border-gray-100 dark:border-gray-800"><Package size={28} /></div>
 <div>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Order #ODR-{order._id.slice(-6).toUpperCase()}</p>
 <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{order.orderItems.length} Items Purchased</h4>
 </div>
 </div>
 <div className="flex items-center gap-8">
 <div className="text-right">
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Amount</p>
 <p className="text-lg font-black text-primary">₹{order.totalPrice}</p>
 </div>
 <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
 order.isPaid ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
 }`}>
 {order.isPaid ? 'Payment Confirmed' : 'Payment Failed'}
 </div>
 </div>
 </div>
 
 <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8">
 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
 {order.orderItems.map((item, idx) => (
 <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 group/item">
 <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
 <div className="min-w-0">
 <p className="text-xs font-black text-gray-900 dark:text-white truncate uppercase tracking-tight">{item.name}</p>
 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.qty} Unit{item.qty > 1 ? 's' : ''}</p>
 </div>
 </div>
 ))}
 </div>
 <div className="w-full lg:w-1/2 bg-gray-50/50 dark:bg-dark-bg/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
 <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-4">Tracking Pipeline</p>
 <StatusPipeline status={order.isDelivered ? 'Delivered' : order.status || 'Confirmed'} type="product" />
 </div>
 </div>

 <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-4">
 <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
 <Clock size={14} /> Ordered on {new Date(order.createdAt).toLocaleDateString()}
 </div>
 <div className="flex flex-wrap items-center gap-4">
 {order.status === 'Delivered' && (
 <button
 onClick={() => handleOpenReview(order)}
 className="text-[10px] font-black uppercase tracking-widest text-yellow-500 hover:underline flex items-center gap-1"
 >
 <Star size={12} fill="currentColor" /> Leave Review
 </button>
 )}
 {order.status !== 'Delivered' && order.status !== 'Completed' && order.status !== 'Cancelled' && order.status !== 'Refund Processing' && order.status !== 'Refunded' && (
 <button 
 onClick={() => {
 setCancellingOrderId(order._id);
 setIsCancelModalOpen(true);
 setCancelStep(1);
 }} 
 className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline"
 >
 Cancel Order
 </button>
 )}
 <button
    onClick={() => navigate(`/track-order/${order._id}`)}
    className="flex items-center gap-2 font-black text-blue-600 dark:text-blue-400 text-xs uppercase tracking-widest hover:underline transition-colors"
  >
    <MapPin size={14} /> Track Order
  </button>
 <button 
 onClick={() => {
 setSelectedOrder(order);
 setIsInvoiceOpen(true);
 }}
 className="flex items-center gap-2 font-black text-gray-900 dark:text-white text-xs uppercase tracking-widest hover:text-primary transition-colors"
 >
 View Invoice <ChevronRight size={16} />
 </button>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 )}
 </motion.section>
 )}
 {activeTab === 'Stay & Ride' && (
 <motion.section 
 key="stay-ride"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="space-y-10"
 >
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <h3 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
 Ride <span className="text-primary">History.</span>
 </h3>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-4">All your cab, bike and delivery bookings</p>
 </div>
 <button onClick={() => navigate('/rides/book')} className="px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-2">
   <Car size={16} /> Book New Ride
 </button>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
 {[
 { id: 'hotels', label: 'Hotels', icon: Building, desc: 'Luxury Stays', link: '/rentals/hotels' },
 { id: 'pg', label: 'PG / Hostels', icon: Home, desc: 'Verified Paying Guests', link: '/pg-stays' },
 { id: 'homestays', label: 'Homestays', icon: Heart, desc: 'Cozy Spaces', link: '/pg-stays' },
 { id: 'apartments', label: 'Apartments', icon: Shield, desc: 'Service Living', link: '/pg-stays' },
 { id: 'rides', label: 'Ride Services', icon: Car, desc: 'Cab & Bike Taxi', link: '/rides/book' }
 ].map((cat) => (
 <div key={cat.id} onClick={() => navigate(cat.link)} className="p-6 bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-lg hover:border-primary/40 transition-all cursor-pointer group text-left">
 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
 <cat.icon size={20} />
 </div>
 <h5 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1">{cat.label}</h5>
 <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{cat.desc}</p>
 </div>
 ))}
 </div>

 {/* Real Ride History */}
 <RideHistorySection orders={orders} navigate={navigate} />

 </motion.section>
 )}

 {activeTab === 'Service Bookings' && (
 <motion.section 
 key="bookings"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 >
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Service <span className="text-primary">History</span></h3>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{serviceBookings.length} Active Bookings</p>
 </div>
 {loading ? (
 <div className="h-64 flex items-center justify-center bg-white dark:bg-dark-card rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
 </div>
 ) : serviceBookings.length === 0 ? (
 <div className="bg-white dark:bg-dark-card p-16 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl text-center">
 <Clock size={64} className="mx-auto text-gray-200 dark:text-gray-800 mb-6" />
 <h4 className="text-xl font-bold text-gray-400 uppercase tracking-widest">No services booked</h4>
 <p className="text-sm text-gray-400 mt-2">Need professional help? Book a service now!</p>
 </div>
 ) : (
 <div className="space-y-6">
 {serviceBookings.map(order => (
 <motion.div 
 initial={{ opacity: 0, scale: 0.98 }}
 animate={{ opacity: 1, scale: 1 }}
 key={order._id} 
 className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-2xl hover:border-primary/20 transition-all group"
 >
 <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 border-b border-gray-50 dark:border-gray-800 pb-6">
 <div className="flex items-center gap-6">
 <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/10 shadow-lg shadow-primary/5 group-hover:rotate-6 transition-transform"><Clock size={28} /></div>
 <div>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Booking #BS-{order._id.slice(-6).toUpperCase()}</p>
 <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{order.orderItems[0].name} Service</h4>
 </div>
 </div>
 <div className="flex items-center gap-8">
 <div className="text-right">
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Service Fee</p>
 <p className="text-lg font-black text-primary">₹{order.totalPrice}</p>
 </div>
 <div className="flex items-center gap-3">
 {order.paymentStatus ? (
 <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
 order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30' :
 order.paymentStatus === 'Partially Paid' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30' :
 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30'
 }`}>
 {order.paymentStatus}
 </span>
 ) : (
 <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
 order.isPaid ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30' : 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30'
 }`}>
 {order.isPaid ? 'Paid' : 'Unpaid'}
 </span>
 )}
 <div className="px-5 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
 {order.status || 'Scheduled'}
 </div>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
 <div className="space-y-4">
 <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800">
 <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3">Appointment Details</p>
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 bg-white dark:bg-dark-card rounded-xl flex items-center justify-center text-primary shadow-sm"><Clock size={18} /></div>
 <div>
 <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{new Date(order.orderItems[0].slot?.date).toLocaleDateString()}</p>
 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{order.orderItems[0].slot?.time}</p>
 </div>
 </div>
 </div>

 <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
 <div className="flex justify-between items-center">
 <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Payment Progress</p>
 <span className="text-[10px] font-black text-primary">₹{(order.advancePaid || 0).toLocaleString()} / ₹{order.totalPrice.toLocaleString()} Paid</span>
 </div>
 <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
 <div 
 className="h-full bg-primary rounded-full transition-all duration-500" 
 style={{ width: `${Math.min(100, (((order.advancePaid || 0) / order.totalPrice) * 100) || 0)}%` }}
 />
 </div>
 <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-widest">
 <span>Advance: ₹{(order.advancePaid || 0).toLocaleString()}</span>
 <span className={order.remainingDue > 0 || (!order.isPaid && order.paymentStatus !== 'Paid') ? "text-red-500 font-black" : "text-green-500 font-black"}>
 {order.remainingDue > 0 || (!order.isPaid && order.paymentStatus !== 'Paid') ? `Due: ₹${(order.remainingDue !== undefined ? order.remainingDue : order.totalPrice).toLocaleString()}` : "Fully Paid"}
 </span>
 </div>
 {(!order.isPaid && order.paymentStatus !== 'Paid') && order.autoCancelAt && (
 <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Deposit Limit</span>
 <CountdownTimer targetDate={order.autoCancelAt} />
 </div>
 )}
 </div>
 </div>
 <div className="bg-gray-50/50 dark:bg-dark-bg/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-inner">
 <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-4">Service Pipeline</p>
 <StatusPipeline status={order.orderItems[0].status || 'Confirmed'} type="service" />
 </div>
 </div>

 <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-4">
 <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
 <ShieldCheck size={14} className="text-green-500" /> Forge India Verified Professional Assigned
 </div>
 <div className="flex flex-wrap items-center gap-4">
 {(order.status === 'Completed' || order.status === 'Delivered') ? (
 <button
 onClick={() => handleOpenReview(order)}
 className="text-[10px] font-black uppercase tracking-widest text-yellow-500 hover:underline flex items-center gap-1"
 >
 <Star size={12} fill="currentColor" /> Leave Review
 </button>
 ) : (order.status !== 'Cancelled' && order.status !== 'Refund Processing' && order.status !== 'Refunded') ? (
 <button 
 onClick={() => {
 setCancellingOrderId(order._id);
 setIsCancelModalOpen(true);
 setCancelStep(1);
 }} 
 className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline"
 >
 Cancel Booking
 </button>
 ) : null}

 {(order.remainingDue > 0 || (!order.isPaid && order.paymentStatus !== 'Paid')) && (order.status !== 'Cancelled' && order.status !== 'Refund Processing' && order.status !== 'Refunded') && (
 <button 
 onClick={() => handlePayBalance(order)}
 className="flex items-center gap-2 py-3 px-6 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
 >
 <CreditCard size={14} /> Pay Remaining Balance
 </button>
 )}

 <button 
 onClick={() => {
 setSelectedOrder(order);
 setIsInvoiceOpen(true);
 }}
 className="flex items-center gap-4 py-3 px-8 bg-gray-900 dark:bg-white text-white dark:text-dark-bg text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary transition-all shadow-xl shadow-gray-900/10"
 >
 Manifest & Invoice <ChevronRight size={14} />
 </button>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 )}
 </motion.section>
 )}
 
 {activeTab === 'Job Applications' && (
 <motion.section 
 key="job-applications"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 >
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Job <span className="text-primary">Applications</span></h3>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{myApplications.length} Tracked</p>
 </div>
 {loading ? (
 <div className="h-64 flex items-center justify-center bg-white dark:bg-dark-card rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
 </div>
 ) : myApplications.length === 0 ? (
 <div className="bg-white dark:bg-dark-card p-16 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl text-center">
 <Briefcase size={64} className="mx-auto text-gray-200 dark:text-gray-800 mb-6" />
 <h4 className="text-xl font-bold text-gray-400 uppercase tracking-widest">No Job Applications Yet</h4>
 <p className="text-sm text-gray-400 mt-2">Explore the Job Portal and apply for opportunities.</p>
 <button onClick={() => navigate('/explore-jobs')} className="mt-6 px-8 py-3 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest">Explore Jobs</button>
 </div>
 ) : (
 <div className="space-y-6">
 {myApplications.map(app => (
 <motion.div 
 initial={{ opacity: 0, scale: 0.98 }}
 animate={{ opacity: 1, scale: 1 }}
 key={app._id} 
 className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-2xl hover:border-primary/20 transition-all group flex flex-col md:flex-row justify-between items-center gap-6"
 >
 <div className="flex items-center gap-6 w-full md:w-auto">
 <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-primary border border-blue-100 dark:border-blue-800 group-hover:scale-110 transition-transform"><Briefcase size={28} /></div>
 <div>
 <h4 className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-tight">{app.jobRole}</h4>
 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
 </div>
 </div>
 <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6">
 <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
 app.status === 'Hired' ? 'bg-green-50 text-green-600 border-green-100' : 
 app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' : 
 'bg-yellow-50 text-yellow-600 border-yellow-100'
 }`}>
 {app.status}
 </span>
 </div>
 </motion.div>
 ))}
 </div>
 )}
 </motion.section>
 )}
 
 {activeTab === 'My Favorites' && (
 <motion.section 
 key="favorites"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 >
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">My <span className="text-red-500">Favorites</span></h3>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{favorites.length} Items Saved</p>
 </div>
 {favorites.length === 0 ? (
 <div className="bg-white dark:bg-dark-card p-16 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl text-center">
 <Heart size={64} className="mx-auto text-gray-200 dark:text-gray-800 mb-6" />
 <h4 className="text-xl font-bold text-gray-400 uppercase tracking-widest">No favorites yet</h4>
 <p className="text-sm text-gray-400 mt-2">Save products you love from the shop — they'll appear here.</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {favorites.map(fav => (
 <div key={fav._id} className="group bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all overflow-hidden flex flex-col">
 <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-dark-bg">
 <img src={fav.image || '/logo.jpg'} alt={fav.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
 {fav.discountPrice && (
 <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
 {Math.round(((fav.price - fav.discountPrice) / fav.price) * 100)}% OFF
 </div>
 )}
 <button
 onClick={() => toggleWishlist(fav._id)}
 title="Remove from Wishlist"
 className="absolute top-3 right-3 w-9 h-9 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-red-600 transition-all z-10"
 >
 <Trash2 size={14} />
 </button>
 </div>
 <div className="p-5 flex flex-col flex-grow">
 <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{fav.category}</p>
 <h4 className="font-black text-gray-900 dark:text-white uppercase truncate mb-3">{fav.name}</h4>
 <div className="mt-auto flex items-center justify-between gap-3">
 <div>
 <p className="text-xl font-black text-gray-900 dark:text-white">₹{(fav.discountPrice || fav.price)?.toLocaleString()}</p>
 {fav.discountPrice && <p className="text-xs text-gray-400 line-through">₹{fav.price?.toLocaleString()}</p>}
 </div>
 <button
 onClick={() => addToCart(fav, 1)}
 className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all"
 title="Add to Cart"
 >
 <Package size={16} />
 </button>
 </div>
 <button
 onClick={() => toggleWishlist(fav._id)}
 className="mt-4 w-full py-2.5 text-[10px] font-black text-red-500 uppercase tracking-widest rounded-2xl border border-red-100 dark:border-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center justify-center gap-2"
 >
 <Heart size={11} fill="currentColor" /> Remove from Wishlist
 </button>
 </div>
 </div>
 ))}
 </div>
 )}
 </motion.section>
 )}

 {activeTab === 'Review History' && (
 <motion.section 
 key="reviews"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 >
 <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter uppercase">Review <span className="text-primary">History</span></h3>
 {reviews.length === 0 ? (
 <div className="bg-white dark:bg-dark-card p-16 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl text-center">
 <Star size={64} className="mx-auto text-gray-200 dark:text-gray-800 mb-6" />
 <h4 className="text-xl font-bold text-gray-400 uppercase tracking-widest">No reviews given</h4>
 <p className="text-sm text-gray-400 mt-2">Help others by reviewing your recent purchases!</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {reviews.map(review => (
 <div key={review._id} className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-lg relative h-full flex flex-col">
 <div className="flex items-center gap-4 mb-6">
 <img src={review.product?.image} alt={review.product?.name} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
 <div className="min-w-0">
 <h4 className="font-black text-gray-900 dark:text-white uppercase truncate text-sm">{review.product?.name}</h4>
 <div className="flex gap-1 mt-1 text-yellow-400">
 {[...Array(5)].map((_, i) => (
 <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
 ))}
 </div>
 </div>
 </div>
 <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-grow">"{review.comment}"</p>
 <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
 <button className="text-primary font-black text-[10px] uppercase tracking-widest hover:underline">Edit Review</button>
 </div>
 </div>
 ))}
 </div>
 )}
 </motion.section>
 )}

 {activeTab === 'Security Vault' && (
  <motion.section 
  key="vault"
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -20 }}
  >
  <div className="flex items-center justify-between mb-8">
  <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Security <span className="text-primary">Vault</span></h3>
  <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isVaultLocked ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
  <ShieldCheck size={14} /> {isVaultLocked ? 'Locked & Encrypted' : 'Decrypted & Unlocked'}
  </div>
  </div>
  
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 relative">
  {/* Locked Blur Overlay */}
  {isVaultLocked && (
    <div className="absolute inset-0 z-20 bg-gray-50/10 dark:bg-dark-bg/10 backdrop-blur-md rounded-[3rem] flex flex-col items-center justify-center p-6 border border-gray-100/20 dark:border-gray-800/20">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-bounce shadow-2xl">
        <Lock size={36} />
      </div>
      <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">Vault Data Encrypted</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm text-center leading-relaxed mb-6">
        Please authenticate to decrypt your credentials and identity wallet.
      </p>
      <button 
        onClick={() => setIsUnlockModalOpen(true)}
        className="px-8 py-4 bg-primary hover:bg-blue-700 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all"
      >
        <Unlock size={14} /> Unlock Settings
      </button>
    </div>
  )}

  {/* Secure Credentials Column */}
  <div className="bg-white dark:bg-dark-card p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col justify-between">
  <div>
  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6"><Database size={28} /></div>
  <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">Secure Credentials</h4>
  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8 text-left">Store your secondary contact person or emergency documents for service verification.</p>
  
  <div className="space-y-4 mb-8">
  {vaultDocs.filter(doc => !doc.type || doc.type === 'credential').map((doc, idx) => (
  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 group/doc">
  <div className="flex items-center gap-3 overflow-hidden">
  <FileText size={18} className="text-primary shrink-0" />
  <span className="text-xs font-bold truncate">{doc.name}</span>
  </div>
  <div className="flex items-center gap-2">
  <a href={doc.url} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-primary transition-colors"><Download size={14} /></a>
  <button onClick={() => handleRemoveDoc(doc._id)} className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover/doc:opacity-100 transition-all"><Trash2 size={14} /></button>
  </div>
  </div>
  ))}
  {vaultDocs.filter(doc => !doc.type || doc.type === 'credential').length === 0 && (
    <p className="text-xs text-gray-400 italic text-center py-6">No credentials stored</p>
  )}
  </div>
  </div>

  <label className="w-full py-4 bg-gray-50 dark:bg-dark-bg text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden">
  {uploading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} 
  {uploading ? 'Uploading...' : 'Add Secure Record'}
  <input type="file" className="absolute opacity-0" onChange={(e) => handleVaultUpload(e, 'credential')} disabled={uploading || isVaultLocked} />
  </label>
  </div>

  {/* Digital ID Wallet Column */}
  <div className="bg-white dark:bg-dark-card p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col justify-between">
  <div>
  <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 mb-6"><FileText size={28} /></div>
  <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">Digital ID Wallet</h4>
  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8 text-left">Pre-upload identity documents to speed up verification for high-value services.</p>
  
  <div className="space-y-4 mb-8">
  {vaultDocs.filter(doc => doc.type === 'id_wallet').map((doc, idx) => (
  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 group/doc">
  <div className="flex items-center gap-3 overflow-hidden">
  <FileText size={18} className="text-yellow-500 shrink-0" />
  <span className="text-xs font-bold truncate">{doc.name}</span>
  </div>
  <div className="flex items-center gap-2">
  <a href={doc.url} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-primary transition-colors"><Download size={14} /></a>
  <button onClick={() => handleRemoveDoc(doc._id)} className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover/doc:opacity-100 transition-all"><Trash2 size={14} /></button>
  </div>
  </div>
  ))}
  {vaultDocs.filter(doc => doc.type === 'id_wallet').length === 0 && (
    <p className="text-xs text-gray-400 italic text-center py-6">No identity documents uploaded</p>
  )}
  </div>
  </div>

  <label className="w-full py-4 bg-gray-50 dark:bg-dark-bg text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden">
  {uploadingId ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} 
  {uploadingId ? 'Uploading...' : 'Upload Document'}
  <input type="file" className="absolute opacity-0" onChange={(e) => handleVaultUpload(e, 'id_wallet')} disabled={uploadingId || isVaultLocked} />
  </label>
  </div>
  </div>

  {/* Status & Control Banner */}
  <div className="bg-gradient-to-br from-primary to-blue-700 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group text-left">
  <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48 transition-transform group-hover:scale-110"></div>
  <div className="relative z-10 text-white">
  <h4 className="text-2xl md:text-4xl font-black mb-4 tracking-tighter uppercase">Vault Status: <span className="opacity-60">{isVaultLocked ? 'Locked' : 'Unlocked'}</span></h4>
  <p className="text-white/80 text-base md:text-lg max-w-xl font-medium leading-relaxed mb-10">Your personal data vault uses enterprise-grade encryption to protect your sensitive service data and history.</p>
  <div className="flex flex-col sm:flex-row gap-4">
  <button 
    onClick={() => {
      if (isVaultLocked) {
        setIsUnlockModalOpen(true);
      } else {
        setIsVaultLocked(true);
        toast.success('Vault locked successfully');
      }
    }}
    className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white text-primary font-black rounded-2xl text-[10px] md:text-[11px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
  >
    {isVaultLocked ? <Lock size={16} fill="currentColor"/> : <Unlock size={16} />}
    {isVaultLocked ? 'Unlock Settings' : 'Lock Vault Settings'}
  </button>
  <button 
    onClick={() => setIsActivityModalOpen(true)}
    className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white/20 backdrop-blur-md text-white border border-white/30 font-black rounded-2xl text-[10px] md:text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all"
  >
    <Eye size={16} /> Activity Log
  </button>
  </div>
  </div>
  </div>
  </motion.section>
  )}

 {activeTab === 'Membership' && (
 <motion.section 
 key="membership"
 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
 className="space-y-12 pb-20"
 >
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
 <div className="text-left">
 <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-2">Member <span className="text-primary">Central</span></h3>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Control your digital service access & tier benefits</p>
 </div>
 
 <div className="flex items-center bg-white dark:bg-dark-card p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg">
 <button 
 onClick={() => setIsPremiumView(true)}
 className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isPremiumView ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
 >
 Premium View
 </button>
 <button 
 onClick={() => setIsPremiumView(false)}
 className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isPremiumView ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
 >
 Classic View
 </button>
 </div>
 </div>

 {/* Non-member CTA */}
 {(!membershipData || membershipData.planTier === 'None') && (
 <div className={isPremiumView ? "bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-10 md:p-16 text-white text-center relative overflow-hidden shadow-2xl" : "bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 text-center"}>
 <div className="relative z-10">
 <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 ${isPremiumView ? 'bg-white/10 text-yellow-300' : 'bg-primary/10 text-primary'}`}>
 <Zap size={40} />
 </div>
 <h3 className={`text-3xl md:text-5xl font-black tracking-tighter mb-6 uppercase ${!isPremiumView && 'text-gray-900 dark:text-white'}`}>Unlock Forge <span className={isPremiumView ? "text-yellow-300" : "text-primary"}>Membership</span></h3>
 <p className={`max-w-xl mx-auto text-lg font-medium leading-relaxed mb-10 ${isPremiumView ? "text-white/70" : "text-gray-500"}`}>Get unlimited access to Home Services, Job Consulting, and Premium Products for one flat monthly fee.</p>
 <div className="flex flex-wrap justify-center gap-6 mb-12">
 {membershipPlans.filter(p => p.status === 'Active').map(plan => (
 <div key={plan.name} className={`${isPremiumView ? 'bg-white/10 backdrop-blur-md border-white/20' : 'bg-gray-50 dark:bg-dark-bg border-gray-100 dark:border-gray-800'} rounded-[2rem] p-8 border text-left min-w-[280px] group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden`}>
 {plan.popular && (
 <div className="absolute top-0 right-0 px-4 py-1.5 bg-yellow-400 text-dark-bg text-[9px] font-black uppercase tracking-widest rounded-bl-2xl shadow-lg">
 Popular
 </div>
 )}
 <p className={`text-xs font-black uppercase tracking-widest mb-2 ${isPremiumView ? "text-white/60" : "text-gray-400"}`}>{plan.name}</p>
 <p className={`text-3xl font-black mb-6 ${isPremiumView ? "text-white" : "text-gray-900 dark:text-white"}`}>₹{plan.price}</p>
 <ul className="space-y-3 mb-8">
 {Array.isArray(plan.features) ? plan.features.map((p, idx) => <li key={idx} className={`text-xs font-bold flex items-center gap-2 ${isPremiumView ? "text-white/70" : "text-gray-500"}`}><ShieldCheck size={14} className={isPremiumView ? "text-yellow-300" : "text-primary"} />{p}</li>) : null}
 </ul>
 <button
 onClick={() => {
 toast.success("Redirecting to Membership Hub...");
 navigate('/membership');
 }}
 className={`w-full py-4 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${isPremiumView ? "bg-white text-blue-700 hover:bg-yellow-400 hover:text-dark-bg" : "bg-primary text-white hover:bg-blue-700"}`}
 >
 Activate Membership
 </button>
 </div>
 ))}
 </div>
 </div>
 </div>
 )}

 {/* Active member view */}
 {membershipData && membershipData.planTier !== 'None' && (
 <div className="space-y-12">
 {/* 💳 CENTERPIECE & INSIGHTS */}
 <div className="flex flex-col xl:flex-row gap-8 md:gap-10">
 <div className="w-full xl:w-5/12 flex flex-col items-center">
 <div className="w-full max-w-sm sm:max-w-md md:max-w-none flex justify-center">
 <MembershipCard userData={profileData} />
 </div>
 <div className="mt-8 md:mt-12 w-full grid grid-cols-2 gap-4">
 <button onClick={() => setActiveTab('Service Bookings')} className="flex flex-col items-center gap-3 p-4 sm:p-6 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl group hover:border-blue-500/30 transition-all active:scale-95">
 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
 <ShoppingBag size={20} className="sm:w-6 sm:h-6" />
 </div>
 <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">My Bookings</span>
 </button>
 <button onClick={() => setActiveTab('Order History')} className="flex flex-col items-center gap-3 p-4 sm:p-6 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl group hover:border-orange-500/30 transition-all active:scale-95">
 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
 <History size={20} className="sm:w-6 sm:h-6" />
 </div>
 <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Order History</span>
 </button>
 </div>
 </div>

 <div className="w-full xl:w-7/12 space-y-6 md:space-y-8">
 <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-6 md:p-10 border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden text-left">
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
 <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Vault Insights</h4>
 {isMembershipExpired ? (
 <span className="px-3 py-1 bg-red-500/10 text-red-600 text-[9px] font-black uppercase tracking-widest rounded-full">EXPIRED</span>
 ) : (
 <span className="px-3 py-1 bg-green-500/10 text-green-600 text-[9px] font-black uppercase tracking-widest rounded-full">{membershipData.planTier} Tier Active</span>
 )}
 </div>
 
 <div className="space-y-8 md:space-y-10">
 <div className="text-left">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
 <div>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vault Balance</p>
 <p className="text-2xl font-black text-gray-900 dark:text-white">₹{membershipData.balance?.toLocaleString() || '0'} <span className="text-sm text-gray-400 font-bold uppercase">Credits</span></p>
 </div>
 <div className="sm:text-right">
 <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Savings This Month</p>
 <p className="text-xl font-black text-green-500">₹{membershipData.savingsThisMonth?.toLocaleString() || '0'} <span className="text-[10px] font-bold text-gray-400 uppercase">Saved</span></p>
 </div>
 </div>
 <div className="h-2 w-full bg-gray-50 dark:bg-dark-bg rounded-full overflow-hidden">
 <motion.div 
 initial={{ width: 0 }} 
 animate={{ width: `${Math.min(((membershipData.planValue - membershipData.balance) / membershipData.planValue) * 100, 100)}%` }} 
 className="h-full bg-blue-600 shadow-[0_0_10px_#2563eb]" 
 />
 </div>
 <p className="text-[9px] text-gray-400 font-bold mt-2 uppercase tracking-widest">
 {isMembershipExpired ? <span className="text-red-500">EXPIRED</span> : (membershipData.cycleEndDate ? `Renews: ${new Date(membershipData.cycleEndDate).toLocaleDateString()}` : 'Plan Active')}
 </p>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
 {[
 { label: 'Plan Value', value: `₹${membershipData.planValue?.toLocaleString() || 0}`, color: 'text-blue-600' },
 { label: 'Tier', value: membershipData.planTier, color: 'text-orange-500' },
 { label: 'Bookings Made', value: serviceBookings.length, color: 'text-purple-600' }
 ].map((stat, i) => (
 <div key={i} className="text-left p-4 bg-gray-50/50 dark:bg-dark-bg/50 rounded-2xl border border-gray-100/50 dark:border-gray-800/50">
 <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
 <p className={`text-base md:text-lg font-black uppercase tracking-tighter ${stat.color}`}>{stat.value}</p>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* STATUS BAR */}
 <div className="bg-slate-900 rounded-[2.5rem] p-6 md:p-8 border border-white/5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
 <div className="flex items-center gap-4 text-left w-full sm:w-auto">
 <div className="w-12 h-12 bg-blue-600/20 border border-blue-600/30 rounded-2xl flex items-center justify-center text-blue-500 shadow-xl">
 <Clock size={24} />
 </div>
 <div className="flex flex-col">
 <p className={`text-white font-black text-sm uppercase tracking-tight ${isMembershipExpired ? 'text-red-400' : ''}`}>Status: {isMembershipExpired ? 'EXPIRED' : `Active ${membershipData.planTier}`}</p>
 <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-1">
 {isMembershipExpired ? 'Action Required' : (membershipData.cycleEndDate ? `Renews: ${new Date(membershipData.cycleEndDate).toLocaleDateString()}` : 'Lifetime Access')}
 </p>
 </div>
 </div>
 <button onClick={() => { toast.success("Redirecting to Membership Hub..."); navigate('/membership'); }} className="w-full sm:w-auto px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95">Renew Early</button>
 </div>
 </div>
 </div>

 {/* ⚡ RECOMMENDED SERVICES */}
 <div className="space-y-8 relative">
 {isMembershipExpired && (
 <div className="absolute inset-0 z-20 bg-white/60 dark:bg-dark-bg/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center rounded-[2.5rem] border border-red-500/20">
 <Shield size={48} className="text-red-500 mb-4" />
 <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Membership Expired</h4>
 <p className="text-sm font-bold text-gray-500 mb-6 max-w-sm">Your access to these recommended premium services has been paused. Please renew to continue.</p>
 <button onClick={() => window.scrollTo(0,0)} className="px-6 py-3 bg-red-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">Renew Now</button>
 </div>
 )}
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
 <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Use Your Membership</h4>
 <button onClick={() => navigate('/explore-shop')} className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-2 hover:translate-x-1 transition-transform">Explore Marketplace <ArrowUpRight size={14} /></button>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 { name: 'Home Cleaning', price: '₹499', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=400' },
 { name: 'AC Servicing', price: '₹699', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400' },
 { name: 'PG Booking', price: '₹2,000', img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=400' },
 { name: 'Bus Travel', price: '₹450', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400' }
 ].map((s, i) => (
 <div key={i} className="group bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden hover:border-blue-600/30 transition-all">
 <div className="h-40 relative overflow-hidden">
 <img src={s.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={s.name} />
 <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-xl">FREE WITH {membershipData.planTier?.toUpperCase()}</div>
 </div>
 <div className="p-6 text-left">
 <h5 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4 truncate">{s.name}</h5>
 <div className="flex justify-between items-center">
 <div className="flex flex-col">
 <span className="text-[10px] font-bold text-gray-400 line-through">{s.price}</span>
 <span className="text-[11px] font-black text-blue-600 uppercase tracking-tighter">Included</span>
 </div>
 <button onClick={() => navigate('/explore-shop')} className="p-3 bg-gray-50 dark:bg-dark-bg rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90"><Plus size={16} /></button>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* 🎁 REWARDS VAULT */}
 <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[3rem] p-8 md:p-14 border border-white/10 shadow-2xl relative overflow-hidden mt-12">
 <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
 <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
 <div className="lg:w-1/2 text-left w-full">
 <span className="px-4 py-1.5 bg-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-white/10 mb-6 inline-block">Exclusive Rewards</span>
 <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase mb-6">Your Monthly <span className="text-blue-400">Rewards Vault</span></h3>
 <p className="text-white/50 text-sm font-medium leading-relaxed mb-10 max-w-lg">Every booking unlocks potential cashback, scratch cards, and strategic surprises. Deploy services and build your credit profile.</p>
 <div className="flex flex-col sm:flex-row gap-4">
 <button className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all">Claim Rewards</button>
 <button className="px-8 py-4 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/20 hover:bg-white/20 active:scale-95 transition-all">View History</button>
 </div>
 </div>
 <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
 {[1, 2].map((r) => (
 <div key={r} className="aspect-square bg-white/5 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center p-8 group cursor-pointer relative overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
 <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-white/50 mb-6 group-hover:scale-110 group-hover:text-blue-400 transition-all shadow-2xl">
 <Gift size={40} />
 </div>
 <p className="text-[11px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Scratch Card</p>
 <div className="mt-4 w-16 h-1.5 bg-blue-500/10 rounded-full overflow-hidden">
 <motion.div animate={{ x: [-30, 60] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-8 h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 )}
 </motion.section>
 )}

 {activeTab === 'Usage Guide' && (
 <motion.section 
 key="guide"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 >
 <WebUsageGuide />
 </motion.section>
 )}

 {activeTab === 'Trusted Circle' && (
 <motion.section 
 key="trusted"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 >
 <div className="flex justify-between items-center mb-8">
   <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Trusted <span className="text-primary">Circle</span></h3>
   <button onClick={() => setIsTrustedContactsModalOpen(true)} className="px-6 py-3 bg-primary text-white rounded-xl font-black uppercase text-xs flex items-center gap-2 hover:bg-primary-dark shadow-lg">
     <Plus size={16}/> Add Contact
   </button>
 </div>
 
 <div className="bg-white dark:bg-dark-card p-8 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
   <p className="text-sm font-bold text-gray-500 mb-8">These contacts will receive SOS alerts, live tracking links, and emergency notifications during your rides.</p>
   
   {trustedContacts.length === 0 ? (
     <div className="text-center py-12">
       <div className="w-20 h-20 bg-gray-50 dark:bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-4">
         <Shield className="text-gray-400" size={32} />
       </div>
       <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase mb-2">No Contacts Yet</h4>
       <p className="text-sm text-gray-500 font-bold">Add family or friends to your Trusted Circle for safety.</p>
     </div>
   ) : (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       {trustedContacts.map((contact, idx) => (
         <div key={idx} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-lg">
               {contact.name[0]}
             </div>
             <div>
               <p className="font-black text-gray-900 dark:text-white">{contact.name}</p>
               <p className="text-xs font-bold text-gray-500">{contact.phone} • {contact.relation}</p>
             </div>
           </div>
           <button onClick={() => handleRemoveTrustedContact(idx)} className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors">
             <Trash2 size={16} />
           </button>
         </div>
       ))}
     </div>
   )}
 </div>
 </motion.section>
 )}

  {activeTab === 'Vehicle & Documents' && (
    <motion.section 
      key="vehicle-docs"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter uppercase">Vehicle & <span className="text-primary">Documents</span></h3>
      <div className="bg-white dark:bg-dark-card p-12 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl space-y-10">
        
        <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Verification Protocol</p>
            <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Status: <span className="text-primary">{profileData?.driverProfile?.verificationStatus || 'Pending'}</span></p>
            <p className="text-xs font-bold text-gray-500 mt-1 font-inter">Updates to documents or vehicle details will trigger re-verification under review.</p>
          </div>
          {profileData?.driverProfile?.verificationStatus === 'Verified' && (
            <span className="px-4 py-2 bg-green-500/10 text-green-500 font-black uppercase text-[10px] tracking-widest rounded-xl border border-green-500/20">Verified Partner ✓</span>
          )}
        </div>

        <form onSubmit={async (e) => {
          e.preventDefault();
          const payload = {
            driverType: driverForm.driverType,
            vehicleOwnership: driverForm.vehicleOwnership,
            vehicleCategory: driverForm.vehicleCategory,
            registrationNumber: driverForm.registrationNumber,
            make: driverForm.make,
            model: driverForm.model,
            year: driverForm.year,
            color: driverForm.color,
            rcDocumentImage: driverForm.rcDocumentImage,
            rcExpiry: driverForm.rcExpiry,
            insuranceDocumentImage: driverForm.insuranceDocumentImage,
            insuranceExpiry: driverForm.insuranceExpiry,
            aadhaarNumber: driverForm.aadhaarNumber,
            aadhaarFrontImage: driverForm.aadhaarFrontImage,
            panNumberValue: driverForm.panNumberValue,
            panImage: driverForm.panImage,
            licenseNumberValue: driverForm.licenseNumberValue,
            licenseExpiry: driverForm.licenseExpiry,
            licenseFrontImage: driverForm.licenseFrontImage
          };
          
          setSaving(true);
          try {
            const { data } = await api.put('/users/profile', payload);
            const existingUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const updatedUserInfo = { ...existingUserInfo, ...data };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            setProfileData(updatedUserInfo);
            toast.success('Vehicle and documents updated successfully!');
          } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update details');
          } finally {
            setSaving(false);
          }
        }} className="space-y-8">
          
          <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight border-b border-gray-100 dark:border-gray-800 pb-3">Driver Profile Configurations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Driver / Partner Type</label>
              <select
                value={driverForm.driverType}
                onChange={(e) => setDriverForm({ ...driverForm, driverType: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold text-gray-900 dark:text-white"
              >
                {['Bike', 'Auto', 'Taxi', 'Cab', 'Delivery Partner', 'Logistics Driver'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vehicle Ownership Status</label>
              <select
                value={driverForm.vehicleOwnership}
                onChange={(e) => setDriverForm({ ...driverForm, vehicleOwnership: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold text-gray-900 dark:text-white"
              >
                {['Own Vehicle', 'Company Assigned Vehicle'].map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          {driverForm.vehicleOwnership === 'Own Vehicle' && (
            <>
              <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight border-b border-gray-100 dark:border-gray-800 pb-3 mt-10">Vehicle Specifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vehicle Category</label>
                  <select
                    value={driverForm.vehicleCategory}
                    onChange={(e) => setDriverForm({ ...driverForm, vehicleCategory: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold text-gray-900 dark:text-white"
                  >
                    {['Bike', 'Auto', 'Mini', 'Sedan', 'SUV', 'Luxury', 'Tow Truck', 'Van', 'Other'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Registration Number</label>
                  <input
                    type="text"
                    placeholder="e.g. KA-01-MJ-1234"
                    value={driverForm.registrationNumber}
                    onChange={(e) => setDriverForm({ ...driverForm, registrationNumber: e.target.value.toUpperCase() })}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Manufacturer / Make</label>
                  <input
                    type="text"
                    placeholder="e.g. Honda"
                    value={driverForm.make}
                    onChange={(e) => setDriverForm({ ...driverForm, make: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vehicle Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Activa"
                    value={driverForm.model}
                    onChange={(e) => setDriverForm({ ...driverForm, model: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Model Year</label>
                  <input
                    type="number"
                    placeholder="e.g. 2022"
                    value={driverForm.year}
                    onChange={(e) => setDriverForm({ ...driverForm, year: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Color</label>
                  <input
                    type="text"
                    placeholder="e.g. Red"
                    value={driverForm.color}
                    onChange={(e) => setDriverForm({ ...driverForm, color: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight border-b border-gray-100 dark:border-gray-800 pb-3 mt-10">Vehicle Documentation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
                  <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">Registration Certificate (RC)</p>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">RC Expiry Date</label>
                    <input
                      type="date"
                      value={driverForm.rcExpiry}
                      onChange={(e) => setDriverForm({ ...driverForm, rcExpiry: e.target.value })}
                      className="w-full px-5 py-3 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 outline-none font-bold text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">RC Image File</label>
                    {driverForm.rcDocumentImage ? (
                      <div className="flex items-center gap-3">
                        <a href={driverForm.rcDocumentImage} target="_blank" rel="noreferrer" className="text-primary font-black uppercase text-[10px] tracking-widest bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/25 transition-colors">View Document</a>
                        <button type="button" onClick={() => setDriverForm({ ...driverForm, rcDocumentImage: '' })} className="text-red-500 font-bold text-[10px] uppercase">Remove</button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 cursor-pointer hover:bg-primary/5 hover:border-primary transition-all">
                        <Upload className="text-gray-400 mr-2" size={18} />
                        <span className="text-xs font-bold text-gray-500">{uploading ? 'Uploading...' : 'Upload RC Scan'}</span>
                        <input type="file" accept="image/*,.pdf" className="hidden" disabled={uploading} onChange={(e) => handleDriverDocUpload(e, 'rcDocumentImage')} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
                  <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">Vehicle Insurance Certificate</p>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Insurance Expiry Date</label>
                    <input
                      type="date"
                      value={driverForm.insuranceExpiry}
                      onChange={(e) => setDriverForm({ ...driverForm, insuranceExpiry: e.target.value })}
                      className="w-full px-5 py-3 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 outline-none font-bold text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Insurance Image File</label>
                    {driverForm.insuranceDocumentImage ? (
                      <div className="flex items-center gap-3">
                        <a href={driverForm.insuranceDocumentImage} target="_blank" rel="noreferrer" className="text-primary font-black uppercase text-[10px] tracking-widest bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/25 transition-colors">View Document</a>
                        <button type="button" onClick={() => setDriverForm({ ...driverForm, insuranceDocumentImage: '' })} className="text-red-500 font-bold text-[10px] uppercase">Remove</button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 cursor-pointer hover:bg-primary/5 hover:border-primary transition-all">
                        <Upload className="text-gray-400 mr-2" size={18} />
                        <span className="text-xs font-bold text-gray-500">{uploading ? 'Uploading...' : 'Upload Insurance Scan'}</span>
                        <input type="file" accept="image/*,.pdf" className="hidden" disabled={uploading} onChange={(e) => handleDriverDocUpload(e, 'insuranceDocumentImage')} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight border-b border-gray-100 dark:border-gray-800 pb-3 mt-10">Identity & KYC Verification</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
              <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">Aadhaar Card (UIDAI)</p>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Aadhaar Number</label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="12 Digit Aadhaar"
                  value={driverForm.aadhaarNumber}
                  onChange={(e) => setDriverForm({ ...driverForm, aadhaarNumber: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 outline-none font-bold text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Aadhaar Front Image</label>
                {driverForm.aadhaarFrontImage ? (
                  <div className="flex items-center gap-3">
                    <a href={driverForm.aadhaarFrontImage} target="_blank" rel="noreferrer" className="text-primary font-black uppercase text-[10px] tracking-widest bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/25 transition-colors">View</a>
                    <button type="button" onClick={() => setDriverForm({ ...driverForm, aadhaarFrontImage: '' })} className="text-red-500 font-bold text-[10px] uppercase">Remove</button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-3 cursor-pointer hover:bg-primary/5 hover:border-primary transition-all">
                    <Upload className="text-gray-400 mr-2" size={16} />
                    <span className="text-[11px] font-bold text-gray-500">{uploading ? 'Uploading...' : 'Upload Card'}</span>
                    <input type="file" accept="image/*,.pdf" className="hidden" disabled={uploading} onChange={(e) => handleDriverDocUpload(e, 'aadhaarFrontImage')} />
                  </label>
                )}
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
              <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">PAN Card (IT Dept)</p>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">PAN Card Number</label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="PAN alphanumeric code"
                  value={driverForm.panNumberValue}
                  onChange={(e) => setDriverForm({ ...driverForm, panNumberValue: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 outline-none font-bold text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">PAN Image scan</label>
                {driverForm.panImage ? (
                  <div className="flex items-center gap-3">
                    <a href={driverForm.panImage} target="_blank" rel="noreferrer" className="text-primary font-black uppercase text-[10px] tracking-widest bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/25 transition-colors">View</a>
                    <button type="button" onClick={() => setDriverForm({ ...driverForm, panImage: '' })} className="text-red-500 font-bold text-[10px] uppercase">Remove</button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-3 cursor-pointer hover:bg-primary/5 hover:border-primary transition-all">
                    <Upload className="text-gray-400 mr-2" size={16} />
                    <span className="text-[11px] font-bold text-gray-500">{uploading ? 'Uploading...' : 'Upload Card'}</span>
                    <input type="file" accept="image/*,.pdf" className="hidden" disabled={uploading} onChange={(e) => handleDriverDocUpload(e, 'panImage')} />
                  </label>
                )}
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
              <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">Driving License (RTO)</p>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">License Number</label>
                <input
                  type="text"
                  placeholder="e.g. DL-XXXXXXXXXXXX"
                  value={driverForm.licenseNumberValue}
                  onChange={(e) => setDriverForm({ ...driverForm, licenseNumberValue: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 outline-none font-bold text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">License Expiry Date</label>
                <input
                  type="date"
                  value={driverForm.licenseExpiry}
                  onChange={(e) => setDriverForm({ ...driverForm, licenseExpiry: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 outline-none font-bold text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">License front image</label>
                {driverForm.licenseFrontImage ? (
                  <div className="flex items-center gap-3">
                    <a href={driverForm.licenseFrontImage} target="_blank" rel="noreferrer" className="text-primary font-black uppercase text-[10px] tracking-widest bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/25 transition-colors">View</a>
                    <button type="button" onClick={() => setDriverForm({ ...driverForm, licenseFrontImage: '' })} className="text-red-500 font-bold text-[10px] uppercase">Remove</button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-3 cursor-pointer hover:bg-primary/5 hover:border-primary transition-all">
                    <Upload className="text-gray-400 mr-2" size={16} />
                    <span className="text-[11px] font-bold text-gray-500">{uploading ? 'Uploading...' : 'Upload DL'}</span>
                    <input type="file" accept="image/*,.pdf" className="hidden" disabled={uploading} onChange={(e) => handleDriverDocUpload(e, 'licenseFrontImage')} />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-50 dark:border-gray-800">
            <button
              disabled={saving || uploading}
              type="submit"
              className="w-full md:w-auto px-12 py-5 bg-dark-bg dark:bg-white text-white dark:text-dark-bg font-black rounded-2xl uppercase tracking-[0.2em] text-[11px] shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Profile Documents
            </button>
          </div>
        </form>
      </div>
    </motion.section>
  )}

  {activeTab === 'Bank Details' && (
    <motion.section 
      key="bank-details"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter uppercase">Bank & <span className="text-primary">Settlement</span></h3>
      <div className="bg-white dark:bg-dark-card p-12 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl space-y-10">
        
        <div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Treasury Network</p>
            <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">KYC Verification Status: <span className="text-primary">{profileData?.kycStatus || 'Not Started'}</span></p>
            <p className="text-xs font-bold text-gray-500 mt-1 font-inter">Direct bank settlements are processed via Razorpay Treasury. Providing details auto-registers contact points.</p>
          </div>
          {profileData?.razorpayContactId && (
            <span className="px-4 py-2 bg-green-500/10 text-green-500 font-black uppercase text-[10px] tracking-widest rounded-xl border border-green-500/20">Razorpay Active ✓</span>
          )}
        </div>

        <form onSubmit={async (e) => {
          e.preventDefault();
          const payload = {
            accountNumber: driverForm.bankAccountNumber,
            ifscCode: driverForm.bankIfscCode,
            bankName: driverForm.bankName,
            holderName: driverForm.bankHolderName,
            panNumber: driverForm.panNumber
          };
          
          setSaving(true);
          try {
            const { data } = await api.put('/users/bank-details', payload);
            const existingUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const updatedUserInfo = { ...existingUserInfo, bankDetails: payload, panNumber: driverForm.panNumber, kycStatus: 'Pending' };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            setProfileData(updatedUserInfo);
            toast.success('Bank details saved and registered successfully!');
          } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update bank details');
          } finally {
            setSaving(false);
          }
        }} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Holder Name</label>
              <input
                type="text"
                placeholder="Name as in Passbook"
                value={driverForm.bankHolderName}
                onChange={(e) => setDriverForm({ ...driverForm, bankHolderName: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold text-gray-900 dark:text-white"
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank Name</label>
              <input
                type="text"
                placeholder="e.g. State Bank of India"
                value={driverForm.bankName}
                onChange={(e) => setDriverForm({ ...driverForm, bankName: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold text-gray-900 dark:text-white"
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Number</label>
              <input
                type="text"
                placeholder="Enter complete account number"
                value={driverForm.bankAccountNumber}
                onChange={(e) => setDriverForm({ ...driverForm, bankAccountNumber: e.target.value.replace(/\D/g, '') })}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold text-gray-900 dark:text-white"
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">IFSC Code</label>
              <input
                type="text"
                maxLength={11}
                placeholder="e.g. SBIN0001234"
                value={driverForm.bankIfscCode}
                onChange={(e) => setDriverForm({ ...driverForm, bankIfscCode: e.target.value.toUpperCase() })}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold text-gray-900 dark:text-white"
                required
              />
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Permanent Account Number (PAN)</label>
              <input
                type="text"
                maxLength={10}
                placeholder="10 Character Alphanumeric PAN"
                value={driverForm.panNumber}
                onChange={(e) => setDriverForm({ ...driverForm, panNumber: e.target.value.toUpperCase() })}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="pt-8 border-t border-gray-50 dark:border-gray-800">
            <button
              disabled={saving}
              type="submit"
              className="w-full md:w-auto px-12 py-5 bg-dark-bg dark:bg-white text-white dark:text-dark-bg font-black rounded-2xl uppercase tracking-[0.2em] text-[11px] shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Bank Details
            </button>
          </div>
        </form>
      </div>
    </motion.section>
  )}

  {activeTab === 'Security & Password' && (
    <motion.section 
      key="security-pwd"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter uppercase">Security & <span className="text-primary">Password</span></h3>
      <div className="bg-white dark:bg-dark-card p-12 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (driverForm.newPassword !== driverForm.confirmPassword) {
            toast.error('Passwords do not match');
            return;
          }
          if (driverForm.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
          }
          
          setSaving(true);
          try {
            await api.put('/users/profile', { password: driverForm.newPassword });
            toast.success('Password updated successfully!');
            setDriverForm(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
          } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update password');
          } finally {
            setSaving(false);
          }
        }} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={driverForm.newPassword}
                  onChange={(e) => setDriverForm({ ...driverForm, newPassword: e.target.value })}
                  className="w-full pl-16 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={driverForm.confirmPassword}
                  onChange={(e) => setDriverForm({ ...driverForm, confirmPassword: e.target.value })}
                  className="w-full pl-16 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-50 dark:border-gray-800">
            <button
              disabled={saving}
              type="submit"
              className="w-full md:w-auto px-12 py-5 bg-dark-bg dark:bg-white text-white dark:text-dark-bg font-black rounded-2xl uppercase tracking-[0.2em] text-[11px] shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Update Password
            </button>
          </div>
        </form>
      </div>
    </motion.section>
  )}

 {activeTab === 'Account Settings' && (
 <motion.section 
 key="settings"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 >
 <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter uppercase">Account <span className="text-primary">Settings</span></h3>
 <div className="bg-white dark:bg-dark-card p-12 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
 <form onSubmit={handleUpdateProfile} className="space-y-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-3">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
 <div className="relative group">
 <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
 <input 
 type="text" 
 value={profileData.firstName}
 onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
 className="w-full pl-16 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold"
 />
 </div>
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
 <div className="relative group">
 <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
 <input 
 type="text" 
 value={profileData.lastName}
 onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
 className="w-full pl-16 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold"
 />
 </div>
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
 <div className="relative group">
 <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
 <input 
 type="email" 
 value={profileData.email}
 disabled
 className="w-full pl-16 pr-6 py-4 rounded-2xl bg-gray-100 dark:bg-dark-bg border border-transparent outline-none font-bold text-gray-400 cursor-not-allowed"
 />
 </div>
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
 <div className="relative group">
 <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
 <input 
 type="tel" 
 value={profileData.mobile || ''}
 onChange={(e) => setProfileData({...profileData, mobile: e.target.value})}
 className="w-full pl-16 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold"
 />
 </div>
 </div>
 <div className="space-y-3 md:col-span-2">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Residential Address</label>
 <div className="relative group">
 <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
 <input 
 type="text" 
 placeholder="Flat, House no, Building, Company, Apartment"
 value={profileData.address || ''}
 onChange={(e) => setProfileData({...profileData, address: e.target.value})}
 className="w-full pl-16 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold"
 />
 </div>
 </div>
 <div className="space-y-3 md:col-span-2 mt-4 border-t border-gray-100 dark:border-gray-800 pt-6">
 <div className="flex items-center justify-between mb-4">
   <label className="text-[14px] font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2"><MapPin size={18} className="text-primary"/> Service Area Location</label>
   <button type="button" onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-[10px] font-black uppercase text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">Change Detected Area</button>
 </div>
 <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800 mb-6 flex items-center gap-4">
   <div className="w-10 h-10 bg-white dark:bg-dark-card rounded-xl flex items-center justify-center shadow-sm">
     <MapPin size={16} className="text-primary" />
   </div>
   <div>
     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Currently Serving</p>
     <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{appLocation?.formatted || appLocation?.city || 'Not Set'}</p>
   </div>
 </div>
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
 <input 
 type="text" 
 value={profileData.city || ''}
 onChange={(e) => setProfileData({...profileData, city: e.target.value})}
 className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold"
 />
 </div>
 <div className="space-y-3">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pincode</label>
 <input 
 type="text" 
 maxLength={6}
 value={profileData.pincode || ''}
 onChange={(e) => setProfileData({...profileData, pincode: e.target.value})}
 className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold"
 />
 </div>
 </div>

 <div className="pt-8 border-t border-gray-50 dark:border-gray-800">
 <button 
 disabled={saving}
 type="submit" 
 className="w-full md:w-auto px-12 py-5 bg-dark-bg dark:bg-white text-white dark:text-dark-bg font-black rounded-2xl uppercase tracking-[0.2em] text-[11px] shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50"
 >
 {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save All Changes
 </button>
 </div>
 </form>
 </div>
 </motion.section>
 )}
 </AnimatePresence>
 </main>
 </div>
 
 <AnimatePresence>
 {isCancelModalOpen && (
 <motion.div 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 className="fixed inset-0 z-[3000] bg-dark-bg/90 backdrop-blur-xl flex items-center justify-center p-6"
 >
 <motion.div 
 initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
 className="bg-white dark:bg-dark-card w-full max-w-lg rounded-[3rem] p-10 border border-gray-100 dark:border-gray-800 shadow-3xl relative overflow-hidden"
 >
 <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
 
 <div className="relative z-10">
 <div className="flex justify-between items-start mb-8">
 <div>
 <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Cancel <span className="text-red-500">Operation</span></h3>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Strategic Feedback Required</p>
 </div>
 <button onClick={() => setIsCancelModalOpen(false)} className="p-3 hover:bg-gray-50 dark:hover:bg-dark-bg rounded-xl transition-colors"><X size={20} /></button>
 </div>

 {cancelStep === 1 ? (
 <div className="space-y-6">
 <p className="text-sm font-medium text-gray-500 leading-relaxed">"To improve our ecosystem protocol, please select the primary reason for mission abort."</p>
 <div className="grid grid-cols-1 gap-3">
 {[
 'Change of Plans / Mistake',
 'Delayed Service / Long Wait',
 'Price / Discount Issues',
 'Quality Concerns',
 'Technician/Agent Unavailability',
 'Other Strategic Reason'
 ].map((reason) => (
 <button 
 key={reason}
 onClick={() => {
 setCancelReason(reason);
 setCancelStep(2);
 }}
 className="w-full p-4 text-left bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl font-bold text-xs uppercase tracking-tight hover:border-red-500/30 hover:bg-red-500/5 transition-all flex justify-between items-center group"
 >
 {reason} <ChevronRight size={14} className="text-gray-300 group-hover:text-red-500 transition-colors" />
 </button>
 ))}
 </div>
 </div>
 ) : (
 <div className="space-y-8">
 <div className="p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
 <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Selected Reason</p>
 <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{cancelReason}</p>
 </div>

 <div className="space-y-3">
 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Additional Intelligence (Optional)</label>
 <textarea 
 className="w-full p-6 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-red-500/10 font-bold text-sm min-h-[120px]"
 placeholder="Provide more context for our administrators..."
 onChange={(e) => {
 // Handled via ID selection in CONFIRM click for simplicity or we can use a state
 }}
 id="cancel-details"
 />
 </div>

 <div className="flex gap-4">
 <button onClick={() => setCancelStep(1)} className="flex-1 py-5 bg-gray-100 dark:bg-dark-bg text-gray-500 font-black rounded-2xl text-[10px] uppercase tracking-widest">Back</button>
 <button 
 disabled={cancelLoading}
 onClick={() => {
 const details = document.getElementById('cancel-details')?.value;
 const finalReason = details ? `${cancelReason}: ${details}` : cancelReason;
 handleCancelOrder(cancellingOrderId, finalReason);
 }} 
 className="flex-[2] py-5 bg-red-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
 >
 {cancelLoading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />} Confirm Cancellation
 </button>
 </div>
 </div>
 )}
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>

 <InvoiceModal
 isOpen={isInvoiceOpen}
 onClose={() => setIsInvoiceOpen(false)}
 order={selectedOrder}
 />

 {/* ── Inline Review Modal ── */}
 <AnimatePresence>
 {isReviewModalOpen && (
 <motion.div
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 className="fixed inset-0 z-[3000] bg-dark-bg/90 backdrop-blur-xl flex items-center justify-center p-6"
 >
 <motion.div
 initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
 className="bg-white dark:bg-dark-card w-full max-w-md rounded-[3rem] p-10 border border-gray-100 dark:border-gray-800 shadow-3xl relative"
 >
 <div className="flex justify-between items-start mb-8">
 <div>
 <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
 Rate Your <span className="text-yellow-500">Experience</span>
 </h3>
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 truncate max-w-[240px]">{reviewingItem?.productName}</p>
 </div>
 <button onClick={() => setIsReviewModalOpen(false)} className="p-3 hover:bg-gray-50 dark:hover:bg-dark-bg rounded-xl transition-colors">
 <X size={20} />
 </button>
 </div>

 {/* Star Rating */}
 <div className="mb-8">
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Your Rating</p>
 <div className="flex gap-2">
 {[1, 2, 3, 4, 5].map((star) => (
 <button
 key={star}
 onClick={() => setReviewRating(star)}
 onMouseEnter={() => setReviewHover(star)}
 onMouseLeave={() => setReviewHover(0)}
 className="transition-transform hover:scale-110 active:scale-95"
 >
 <Star
 size={36}
 className={`transition-colors ${
 star <= (reviewHover || reviewRating)
 ? 'text-yellow-400 fill-yellow-400'
 : 'text-gray-200 dark:text-gray-700'
 }`}
 />
 </button>
 ))}
 </div>
 <p className="text-xs font-bold text-gray-400 mt-2">
 {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewHover || reviewRating]}
 </p>
 </div>

 {/* Comment */}
 <div className="mb-8">
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Your Comment</p>
 <textarea
 value={reviewComment}
 onChange={(e) => setReviewComment(e.target.value)}
 placeholder="Share your honest experience..."
 rows={4}
 className="w-full p-5 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400/20 font-medium text-sm resize-none"
 />
 </div>

 {/* Submit */}
 <button
 onClick={handleSubmitReview}
 disabled={reviewSubmitting}
 className="w-full py-5 bg-yellow-400 text-gray-900 font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-yellow-400/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
 >
 {reviewSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Star size={16} fill="currentColor" />}
 {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
 </button>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>

  {/* ── Security Vault Unlock Modal ── */}
  <AnimatePresence>
  {isUnlockModalOpen && (
  <motion.div
  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
  className="fixed inset-0 z-[3000] bg-dark-bg/90 backdrop-blur-xl flex items-center justify-center p-6"
  >
  <motion.div
  initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
  className="bg-white dark:bg-dark-card w-full max-w-md rounded-[3rem] p-10 border border-gray-100 dark:border-gray-800 shadow-3xl relative"
  >
  <div className="flex justify-between items-start mb-8 text-left">
  <div>
  <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
  Unlock <span className="text-primary">Vault Settings</span>
  </h3>
  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Enter your password to verify credentials</p>
  </div>
  <button onClick={() => setIsUnlockModalOpen(false)} className="p-3 hover:bg-gray-50 dark:hover:bg-dark-bg rounded-xl transition-colors">
  <X size={20} />
  </button>
  </div>

  <form onSubmit={handleUnlockVault} className="text-left">
    <div className="mb-8">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Password</p>
      <input
        type="password"
        value={unlockPassword}
        onChange={(e) => setUnlockPassword(e.target.value)}
        placeholder="Enter account password..."
        className="w-full p-5 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium text-sm text-gray-950 dark:text-white"
        autoFocus
      />
    </div>

    <button
      type="submit"
      className="w-full py-5 bg-primary text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
    >
      <Unlock size={16} /> Decrypt Vault
    </button>
  </form>
  </motion.div>
  </motion.div>
  )}
  </AnimatePresence>

  {/* ── Security Vault Activity Log Modal ── */}
  <AnimatePresence>
  {isActivityModalOpen && (
  <motion.div
  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
  className="fixed inset-0 z-[3000] bg-dark-bg/90 backdrop-blur-xl flex items-center justify-center p-6"
  >
  <motion.div
  initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
  className="bg-white dark:bg-dark-card w-full max-w-lg rounded-[3rem] p-10 border border-gray-100 dark:border-gray-800 shadow-3xl relative"
  >
  <div className="flex justify-between items-start mb-8 text-left">
  <div>
  <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
  Vault <span className="text-primary">Activity Log</span>
  </h3>
  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Real-time audit logs of the current session</p>
  </div>
  <button onClick={() => setIsActivityModalOpen(false)} className="p-3 hover:bg-gray-50 dark:hover:bg-dark-bg rounded-xl transition-colors">
  <X size={20} />
  </button>
  </div>

  <div className="space-y-4 max-h-96 overflow-y-auto mb-6 pr-2 text-left">
    {vaultActivities.map((log, idx) => (
      <div key={idx} className="flex justify-between items-start p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
        <div>
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{log.action}</p>
          <span className="text-[9px] text-green-500 font-bold uppercase tracking-wider">Verified AES-256</span>
        </div>
        <span className="text-[9px] font-black text-gray-400 uppercase whitespace-nowrap">{log.time}</span>
      </div>
    ))}
  </div>

  <button
    onClick={() => setIsActivityModalOpen(false)}
    className="w-full py-4 bg-gray-100 dark:bg-dark-bg text-gray-600 dark:text-white border border-gray-200 dark:border-gray-800 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-dark-bg transition-all"
  >
    Close Logs
  </button>
  </motion.div>
  </motion.div>
  )}
  {isTrustedContactsModalOpen && (
   <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
     <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 max-w-sm w-full border border-gray-100 dark:border-gray-800 shadow-2xl">
       <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 uppercase">Add Contact</h3>
       <form onSubmit={handleAddTrustedContact} className="space-y-4">
         <div>
           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
           <input type="text" required value={newContactName} onChange={e=>setNewContactName(e.target.value)} className="w-full mt-1 p-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold" />
         </div>
         <div>
           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
           <input type="tel" required value={newContactPhone} onChange={e=>setNewContactPhone(e.target.value)} className="w-full mt-1 p-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold" />
         </div>
         <div>
           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Relation</label>
           <select value={newContactRelation} onChange={e=>setNewContactRelation(e.target.value)} className="w-full mt-1 p-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-transparent focus:border-primary outline-none font-bold">
             <option>Family</option>
             <option>Friend</option>
             <option>Partner</option>
             <option>Other</option>
           </select>
         </div>
         <div className="pt-4 flex gap-3">
           <button type="button" onClick={()=>setIsTrustedContactsModalOpen(false)} className="flex-1 py-4 bg-gray-100 dark:bg-dark-bg text-gray-500 rounded-2xl font-black uppercase text-xs">Cancel</button>
           <button type="submit" className="flex-1 py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-primary-dark">Save</button>
         </div>
       </form>
     </div>
   </div>
 )}

 </AnimatePresence>
 </div>
 );
};

export default Profile;

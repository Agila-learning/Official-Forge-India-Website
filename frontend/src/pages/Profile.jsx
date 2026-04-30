import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Package, Heart, LogOut, ChevronRight, Clock, Star, ShieldCheck, Save, Loader2, Mail, Phone, Lock, Eye, FileText, Download, Trash2, History, Database, MapPin, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import InvoiceModal from '../components/ui/InvoiceModal';
import toast from 'react-hot-toast';
import WebUsageGuide from '../components/ui/WebUsageGuide';
import { BookOpen } from 'lucide-react';

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const { favorites, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('Order History');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [vaultDocs, setVaultDocs] = useState([]);
  
  const userInfoStr = localStorage.getItem('userInfo');
  const [profileData, setProfileData] = useState(userInfoStr ? JSON.parse(userInfoStr) : {});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [ordersRes, userRes, reviewsRes] = await Promise.all([
          api.get('/orders/myorders'),
          api.get('/users/profile'),
          api.get('/reviews/myreviews')
        ]);
        
        setOrders(ordersRes.data);
        setReviews(reviewsRes.data || []);
        setVaultDocs(userRes.data.profileDocuments || []);
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', profileData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Profile updated successfully!');
      setSaving(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
      setSaving(false);
    }
  };

  const handleVaultUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const { data: fileUrl } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updatedDocs = [...vaultDocs, { url: fileUrl, name: file.name }];
      const { data } = await api.put('/users/profile', { profileDocuments: updatedDocs });
      
      setVaultDocs(data.profileDocuments);
      toast.success('Document added to Vault');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveDoc = async (docId) => {
    try {
        const updatedDocs = vaultDocs.filter(doc => doc._id !== docId);
        const { data } = await api.put('/users/profile', { profileDocuments: updatedDocs });
        setVaultDocs(data.profileDocuments);
        toast.success('Document removed');
    } catch (err) {
        toast.error('Failed to remove document');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-32 pb-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-8">
          <div className="bg-white dark:bg-dark-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white dark:border-dark-bg shadow-lg">
                <span className="text-3xl font-black text-primary uppercase">{profileData?.firstName?.[0]}</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{profileData?.firstName} {profileData?.lastName}</h2>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2 px-4 py-1 bg-gray-50 dark:bg-dark-bg rounded-lg inline-block border border-gray-100 dark:border-gray-800">{profileData?.role}</p>
            
            <button onClick={handleLogout} className="w-full mt-10 flex items-center justify-center gap-2 py-4 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all border border-red-50 dark:border-red-900/20">
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          <nav className="bg-white dark:bg-dark-card p-4 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-lg space-y-2">
            {[
              { label: 'Order History', icon: Package, count: productOrders.length, show: profileData?.role === 'Customer' },
              { label: 'Service Bookings', icon: Clock, count: serviceBookings.length, show: profileData?.role === 'Customer' },
              { label: 'My Favorites', icon: Heart, count: favorites.length, show: profileData?.role === 'Customer' },
              { label: 'Review History', icon: History, count: reviews.length, show: profileData?.role === 'Customer' },
              { label: 'Security Vault', icon: Lock, count: null, show: profileData?.role === 'Customer' },
              { label: 'Usage Guide', icon: BookOpen, count: null, show: true },
              { label: 'Account Settings', icon: User, count: null, show: true },
            ].filter(item => item.show).map((item) => (
              <button 
                key={item.label} 
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === item.label ? 'bg-primary/5 border border-primary/10' : 'hover:bg-gray-50 dark:hover:bg-dark-bg'}`}
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
            {activeTab === 'Order History' && (
              <motion.section 
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Product <span className="text-primary italic">Orders</span></h3>
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

                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
                               <Clock size={14} /> Ordered on {new Date(order.createdAt).toLocaleDateString()}
                           </div>
                           <div className="flex items-center gap-3">
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

            {activeTab === 'Service Bookings' && (
              <motion.section 
                key="bookings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Service <span className="text-primary italic">History</span></h3>
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
                                <div className="px-5 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                   Scheduled
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
                            </div>
                             <div className="bg-gray-50/50 dark:bg-dark-bg/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-inner">
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-4">Service Pipeline</p>
                                <StatusPipeline status={order.orderItems[0].status || 'Confirmed'} type="service" />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
                               <ShieldCheck size={14} className="text-green-500" /> Forge India Verified Professional Assigned
                           </div>
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
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">My <span className="text-red-500 italic">Favorites</span></h3>
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
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed italic flex-grow">"{review.comment}"</p>
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
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Security <span className="text-primary italic">Vault</span></h3>
                    <div className="px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck size={14} /> End-to-End Encrypted
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-dark-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6"><Database size={28} /></div>
                        <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">Secure Credentials</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">Store your secondary contact person or emergency documents for service verification.</p>
                        
                        <div className="space-y-4 mb-8">
                            {vaultDocs.map((doc, idx) => (
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
                        </div>

                        <label className="w-full py-4 bg-gray-50 dark:bg-dark-bg text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden">
                            {uploading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} 
                            {uploading ? 'Uploading...' : 'Add Secure Record'}
                            <input type="file" className="absolute opacity-0" onChange={handleVaultUpload} disabled={uploading} />
                        </label>
                    </div>

                    <div className="bg-white dark:bg-dark-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                        <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 mb-6"><FileText size={28} /></div>
                        <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">Digital ID Wallet</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">Pre-upload identity documents to speed up verification for high-value services.</p>
                        <button className="w-full py-4 bg-gray-50 dark:bg-dark-bg text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-2">
                            <Plus size={16} /> Upload Document
                        </button>
                    </div>

                    <div className="md:col-span-2 bg-gradient-to-br from-primary to-blue-700 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10 text-white">
                            <h4 className="text-4xl font-black mb-4 tracking-tighter uppercase">Vault Status: <span className="opacity-60 italic">Locked</span></h4>
                            <p className="text-white/80 text-lg max-w-xl font-medium leading-relaxed mb-10">Your personal data vault uses enterprise-grade encryption to protect your sensitive service data and history.</p>
                            <div className="flex flex-wrap gap-4">
                                <button className="px-10 py-5 bg-white text-primary font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl flex items-center gap-3"><Lock size={16} fill="currentColor"/> Unlock Settings</button>
                                <button className="px-10 py-5 bg-white/20 backdrop-blur-md text-white border border-white/30 font-black rounded-2xl text-[11px] uppercase tracking-widest flex items-center gap-3"><Eye size={16} /> Activity Log</button>
                            </div>
                        </div>
                    </div>
                </div>
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
      
      <InvoiceModal 
        isOpen={isInvoiceOpen} 
        onClose={() => setIsInvoiceOpen(false)} 
        order={selectedOrder} 
      />
    </div>
  );
};

export default Profile;

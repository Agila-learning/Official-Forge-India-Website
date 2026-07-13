import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, ShoppingBag, CreditCard, Star, 
  Settings, Users, TrendingUp, Edit, Trash2, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import OrderInvoice from '../components/ui/OrderInvoice';
import MembershipUpgradeWidget from '../components/ui/MembershipUpgradeWidget';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const [bankData, setBankData] = useState({
    accountNumber: userInfo.bankDetails?.accountNumber || '',
    ifscCode: userInfo.bankDetails?.ifscCode || '',
    bankName: userInfo.bankDetails?.bankName || '',
    holderName: userInfo.bankDetails?.holderName || '',
    panNumber: userInfo.panNumber || ''
  });
  const [settlements, setSettlements] = useState([]);
  const [isSavingBank, setIsSavingBank] = useState(false);

  const fetchSettlements = async () => {
    try {
      const { data } = await api.get('/settlements/vendor');
      setSettlements(data);
    } catch (err) {
      console.error('Failed to fetch settlements');
    }
  };

  useEffect(() => {
    if (activeTab === 'payouts') fetchSettlements();
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes] = await Promise.all([
        api.get('/products/vendor').catch(() => ({ data: [] })),
        api.get('/orders/vendor/me').catch(() => ({ data: [] }))
      ]);
      setProducts(prodRes.data);
      setOrders(ordRes.data);
    } catch (err) {
      toast.error('Failed to sync seller data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    try {
      await api.post('/products', { ...payload, vendor: userInfo._id });
      toast.success('Product added to inventory!');
      setShowAddModal(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to add product');
    }
  };

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-500' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-green-500' },
    { label: 'Total Revenue', value: '₹' + orders.filter(o => o.isPaid).reduce((acc, o) => acc + o.totalPrice, 0).toLocaleString(), icon: TrendingUp, color: 'text-primary' },
    { label: 'Pending Orders', value: orders.filter(o => !o.isDelivered).length, icon: CreditCard, color: 'text-orange-500' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} themeColor="primary">
      {/* ── Overview ─────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl bg-gradient-to-br from-primary/5 to-transparent">
            <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Seller Headquarters</h3>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-10">Real-time e-commerce metrics</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="p-8 bg-white dark:bg-dark-card rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
                  <stat.icon size={28} className={`${stat.color} mb-6`} />
                  <h4 className="text-4xl font-black mb-1">{stat.value}</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Inventory ─────────────────────────────────── */}
      {activeTab === 'inventory' && (
        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-3xl font-black mb-1 uppercase tracking-tighter">My Products</h3>
                <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Manage your global inventory</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-primary text-white font-black rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map(product => (
                <div key={product._id} className="p-6 bg-white dark:bg-dark-card rounded-[2rem] border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all shadow-sm">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
                    <img src={product.image || 'https://via.placeholder.com/400'} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-black text-lg mb-1 line-clamp-1">{product.name}</h4>
                  <p className="text-xs text-gray-500 font-bold mb-4">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-primary">₹{product.price}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Stock: {product.countInStock}</span>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[2rem]">
                  <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No products listed</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Orders ─────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
           <h3 className="text-3xl font-black mb-8 uppercase tracking-tighter">Customer Orders</h3>
           <div className="mobile-table-scroll">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {['Order ID', 'Customer', 'Items', 'Total', 'Paid', 'Status', 'Date'].map(h => (
                      <th key={h} className="pb-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {orders.map(order => (
                    <tr key={order._id} className="group hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                      <td className="py-5 pr-4">
                        <p className="font-mono text-xs font-bold text-gray-500">#{order._id?.slice(-8).toUpperCase()}</p>
                      </td>
                      <td className="py-5 pr-4">
                        <p className="font-bold text-sm">{order.user?.firstName} {order.user?.lastName}</p>
                      </td>
                      <td className="py-5 pr-4">
                        <p className="font-bold text-sm">{order.orderItems?.length} items</p>
                      </td>
                      <td className="py-5 pr-4">
                        <p className="font-black text-primary">₹{order.totalPrice}</p>
                      </td>
                      <td className="py-5 pr-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${ order.isPaid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-5 pr-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${ order.isDelivered ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-700'}`}>
                          {order.isDelivered ? 'Delivered' : 'Processing'}
                        </span>
                      </td>
                      <td className="py-5 pr-4">
                        <p className="text-xs text-gray-500 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-gray-500 uppercase tracking-widest font-bold text-xs">
                        No orders received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>
      )}

      {/* ── Payouts & Settlements ─────────────────────────────────── */}
      {activeTab === 'payouts' && (
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Financial Treasury</p>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Wallet & Settlements</h2>
            </div>
            <div className="glass-card px-10 py-6 rounded-3xl border border-primary/20 bg-primary/5 flex items-center gap-6">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Available for Payout</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white leading-none">₹{userInfo.walletBalance?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Bank Details Form */}
            <div className="lg:col-span-1 space-y-8">
              <div className="glass-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl">
                <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                  <CreditCard size={18} className="text-primary" /> Bank Onboarding
                </h3>
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Holder Name</label>
                    <input 
                      value={bankData.holderName} 
                      onChange={e => setBankData({...bankData, holderName: e.target.value})} 
                      placeholder="As per bank records"
                      className="w-full px-5 py-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg outline-none font-bold text-xs" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Number</label>
                    <input 
                      value={bankData.accountNumber} 
                      onChange={e => setBankData({...bankData, accountNumber: e.target.value})} 
                      placeholder="000000000000"
                      className="w-full px-5 py-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg outline-none font-bold text-xs" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">IFSC Code</label>
                      <input 
                        value={bankData.ifscCode} 
                        onChange={e => setBankData({...bankData, ifscCode: e.target.value.toUpperCase()})} 
                        placeholder="SBIN0000000"
                        className="w-full px-5 py-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg outline-none font-bold text-xs" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">PAN Number</label>
                      <input 
                        value={bankData.panNumber} 
                        onChange={e => setBankData({...bankData, panNumber: e.target.value.toUpperCase()})} 
                        placeholder="ABCDE1234F"
                        className="w-full px-5 py-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg outline-none font-bold text-xs" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank Name</label>
                    <input 
                      value={bankData.bankName} 
                      onChange={e => setBankData({...bankData, bankName: e.target.value})} 
                      placeholder="State Bank of India"
                      className="w-full px-5 py-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg outline-none font-bold text-xs" 
                    />
                  </div>
                  
                  <div className={`p-4 rounded-2xl flex items-center gap-3 ${userInfo.kycStatus === 'Verified' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-yellow-50 text-yellow-600 border border-yellow-100'}`}>
                    <CreditCard size={16} className="shrink-0" />
                    <p className="text-[9px] font-black uppercase tracking-widest">KYC STATUS: {userInfo.kycStatus || 'NOT VERIFIED'}</p>
                  </div>

                  <button 
                    disabled={isSavingBank}
                    onClick={async () => {
                      setIsSavingBank(true);
                      try {
                        const { data } = await api.put('/users/bank-details', bankData);
                        localStorage.setItem('userInfo', JSON.stringify(data.user));
                        toast.success('Financial Identity Synchronized');
                        window.location.reload();
                      } catch (err) {
                        toast.error('Onboarding failed. Verify IFSC/PAN.');
                      } finally {
                        setIsSavingBank(false);
                      }
                    }}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isSavingBank ? 'Encrypting Data...' : 'Update Bank Records'}
                  </button>
                </div>
              </div>
            </div>

            {/* Settlement History */}
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black uppercase tracking-tighter">Settlement Archive</h3>
                  <button className="px-4 py-2 bg-gray-50 dark:bg-dark-bg rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-primary transition-all">Download Report</button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-50 dark:border-gray-800">
                        <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Ref</th>
                        <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue</th>
                        <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Commission</th>
                        <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Settled</th>
                        <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {settlements.map(s => (
                        <tr key={s._id} className="group hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all">
                          <td className="py-6 pr-4">
                            <p className="text-xs font-black text-gray-900 dark:text-white uppercase">#{s.order?._id?.slice(-6)}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase">{new Date(s.createdAt).toLocaleDateString()}</p>
                          </td>
                          <td className="py-6 text-xs font-bold text-gray-500">₹{s.totalRevenue?.toLocaleString()}</td>
                          <td className="py-6 text-xs font-bold text-red-400">-₹{s.commission?.toLocaleString()}</td>
                          <td className="py-6 text-sm font-black text-green-500">₹{s.amount?.toLocaleString()}</td>
                          <td className="py-6">
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${s.status === 'Settled' ? 'bg-green-100 text-green-600' : s.status === 'Failed' ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-600'}`}>
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {settlements.length === 0 && (
                    <div className="py-20 text-center">
                      <div className="w-16 h-16 bg-gray-50 dark:bg-dark-bg rounded-3xl flex items-center justify-center mx-auto mb-4 opacity-40">
                        <CreditCard size={24} className="text-gray-400" />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No financial movements detected.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Subscription ─────────────────────────────────── */}
      {activeTab === 'subscription' && (
        <div className="space-y-8">
          <MembershipUpgradeWidget userInfo={userInfo} />
        </div>
      )}

      {/* ── Add Product Modal ─────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            onClick={() => setShowAddModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg bg-white dark:bg-dark-card rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-800"
          >
            <h3 className="text-2xl font-black mb-1 uppercase tracking-tighter text-gray-900 dark:text-white">Inventory Expansion</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-8">Deploy a new product unit</p>
            
            <form onSubmit={handleAddProduct} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                <input name="name" required className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg rounded-2xl text-sm font-bold border border-transparent focus:border-primary outline-none transition-all" placeholder="e.g. Atomy Absolute Essence" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input name="price" type="number" required className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg rounded-2xl text-sm font-bold border border-transparent focus:border-primary outline-none transition-all" placeholder="2500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock</label>
                  <input name="countInStock" type="number" required className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg rounded-2xl text-sm font-bold border border-transparent focus:border-primary outline-none transition-all" placeholder="100" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                <input name="category" required className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg rounded-2xl text-sm font-bold border border-transparent focus:border-primary outline-none transition-all" placeholder="e.g. Beauty & Skincare" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Image URL</label>
                <input name="image" className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg rounded-2xl text-sm font-bold border border-transparent focus:border-primary outline-none transition-all" placeholder="https://..." />
              </div>
              <button type="submit" className="w-full py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4">
                Deploy Product
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SellerDashboard;

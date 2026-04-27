import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { Search, MapPin, Filter, Heart, Star, ChevronRight, X, Loader2, CheckCircle2, XCircle, ShoppingBag, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceCard from '../components/ui/ServiceCard';
import ProductCard from '../components/ui/ProductCard';
import ProductDetailsModal from '../components/ui/ProductDetailsModal';
import BookingFlowManager from '../components/ui/BookingFlowManager';

function ExploreShop() {
    const { addToCart } = useCart();
    const { isFavorite, toggleWishlist } = useWishlist();
    
    // Core State
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewType, setViewType] = useState('Products'); 
    
    // UI State
    const location = useLocation();
    const [category, setCategory] = useState(location.state?.category || 'All');
    const [searchQuery, setSearchQuery] = useState('');
    const [pincode, setPincode] = useState('');
    const [locationStatus, setLocationStatus] = useState(null);
    const [checkingPincode, setCheckingPincode] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState('Newest');
    const [priceRange, setPriceRange] = useState(200000);
    const [shopFilter, setShopFilter] = useState('');
    const [pincodeFilter, setPincodeFilter] = useState('');

    // Modal State
    const [selectedProductForBooking, setSelectedProductForBooking] = useState(null);
    const [selectedProductForDetails, setSelectedProductForDetails] = useState(null);
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('fic_recently_viewed') || '[]');
        setRecentlyViewed(saved);
    }, []);

    const addToRecentlyViewed = (product) => {
        setRecentlyViewed(prev => {
            const filtered = prev.filter(p => p._id !== product._id);
            const updated = [product, ...filtered].slice(0, 10);
            localStorage.setItem('fic_recently_viewed', JSON.stringify(updated));
            return updated;
        });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data || []);
        } catch (err) {
            console.error('Failed to fetch products', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckServiceability = async () => {
        if (!pincode || pincode.length < 6) return;
        setCheckingPincode(true);
        try {
            const { data } = await api.get(`/locations/check/${pincode}`);
            setLocationStatus(data.isServiceable ? 'serviceable' : 'not-serviceable');
        } catch (err) {
            setLocationStatus('not-serviceable');
        } finally {
            setCheckingPincode(false);
        }
    };

    const filteredProducts = (Array.isArray(products) ? products : []).filter(product => {
        const matchesViewType = viewType === 'Services' ? product.isService : !product.isService;
        const matchesCategory = category === 'All' || product.category === category || (category === 'Home Services' && product.isService);
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesShop = !shopFilter || (product.shopName && product.shopName.toLowerCase().includes(shopFilter.toLowerCase()));
        const matchesPincode = !pincodeFilter || (product.pincode && product.pincode.includes(pincodeFilter));
        const matchesPrice = (product.price || 0) <= priceRange;
        
        return matchesViewType && matchesCategory && matchesSearch && matchesShop && matchesPincode && matchesPrice;
    }).sort((a, b) => {
        if (sortBy === 'Price Low') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'Price High') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'Top Rated') return (b.rating || 0) - (a.rating || 0);
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const categories = ['All', 'Health', 'Beauty', 'Home', 'Home Services', 'Electronics'];

    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const returnPath = userInfo?.role === 'Admin' ? '/admin' : 
                       userInfo?.role === 'Vendor' ? '/vendor' : 
                       userInfo?.role === 'HR' ? '/hr' : 
                       userInfo?.role === 'Delivery Partner' ? '/delivery' : 
                       '/candidate/dashboard';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-12 pb-24 px-4 font-sans relative">
            
            {/* Floating Return Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate(returnPath)}
                className="fixed top-8 left-8 z-[100] flex lg:hidden items-center gap-2 px-6 py-3 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl hover:bg-primary hover:text-white transition-all group font-black uppercase text-[10px] tracking-widest"
            >
                <ChevronRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
                Return to Command Hub
            </motion.button>

            {/* Premium Header Section */}
            <div className="max-w-7xl mx-auto mb-16 text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8"
                >
                    <ShoppingBag size={16} />
                    <span className="text-sm font-black uppercase tracking-widest">Connect Marketplace</span>
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight text-gray-900 dark:text-white uppercase">
                    Shop <span className="text-primary italic">Everything.</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed italic">
                    "From high-performance industrial assets to daily essentials in Health, Beauty, and Electronics. Curated precision for the Forge India ecosystem."
                </p>
            </div>

            {/* Filter and Search Bar Section */}
            <div className="max-w-7xl mx-auto mb-10">
                <div className="flex flex-col md:flex-row gap-4 items-center mb-10">
                    <div className="relative flex-grow w-full group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search high-performance products..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-4 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-base shadow-xl shadow-primary/5"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => setIsFilterOpen(true)}
                            className="flex-grow md:flex-initial px-8 py-4 rounded-3xl bg-dark-bg dark:bg-dark-card border border-gray-100 dark:border-gray-800 text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-xl"
                        >
                            <Filter size={16} /> Filters
                        </button>
                        
                        <div className="bg-white dark:bg-dark-card p-1.5 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 flex items-center gap-2 group flex-grow md:max-w-[240px]">
                            <MapPin className={`ml-3 transition-colors ${locationStatus === 'serviceable' ? 'text-green-500' : locationStatus === 'not-serviceable' ? 'text-red-500' : 'text-gray-400'}`} size={16} />
                            <input 
                                type="text" 
                                placeholder="Pincode" 
                                maxLength={6}
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                className="w-full py-2 bg-transparent outline-none font-bold text-gray-700 dark:text-white text-[12px]"
                            />
                            <button 
                                onClick={handleCheckServiceability}
                                disabled={checkingPincode}
                                className="px-5 py-2.5 bg-secondary text-dark-bg font-black rounded-2xl transition-all disabled:opacity-50 text-[10px] uppercase tracking-widest"
                            >
                                {checkingPincode ? <Loader2 className="animate-spin w-3 h-3" /> : 'Check'}
                            </button>
                        </div>
                    </div>
                </div>


                {/* Categories Bar */}
                <div className="flex items-center gap-4 overflow-x-auto pb-4 hide-scrollbar">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">Discovery:</span>
                    <div className="flex gap-2">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-6 py-2.5 rounded-full font-black text-[11px] uppercase tracking-wider transition-all border whitespace-nowrap ${category === cat ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white dark:bg-dark-card border-gray-100 dark:border-gray-800 text-gray-500 hover:border-primary/50'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Serviceability Alert */}
            <AnimatePresence>
                {locationStatus && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`max-w-7xl mx-auto mb-12 p-6 rounded-3xl border flex items-center gap-4 shadow-sm ${locationStatus === 'serviceable' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}
                    >
                        {locationStatus === 'serviceable' ? <CheckCircle2 size={24} className="text-green-500" /> : <XCircle size={24} className="text-red-500" />}
                        <p className="font-bold uppercase tracking-widest text-sm">
                            {locationStatus === 'serviceable' ? 'Service is available in your region.' : 'Currently unavailable in your specified area.'}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Product/Service Grid */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-[450px] bg-gray-100 dark:bg-gray-800/50 rounded-[3rem] animate-pulse"></div>
                        ))
                    ) : filteredProducts.length === 0 ? (
                        <div className="col-span-full py-32 text-center bg-white dark:bg-dark-card rounded-[3rem] border border-gray-100 dark:border-gray-800">
                            <h3 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">No items discovered</h3>
                            <p className="text-gray-500 font-medium uppercase text-[10px] tracking-widest">Adjust your filters to see more results.</p>
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            viewType === 'Services' ? (
                                <ServiceCard 
                                    key={product._id} 
                                    product={product} 
                                    onBook={() => {
                                        setSelectedProductForBooking(product);
                                        toast.dismiss(); // Clean previous toasts
                                    }}
                                />
                            ) : (
                                <ProductCard 
                                    key={product._id} 
                                    product={product}
                                    isFavorite={isFavorite(product._id)}
                                    onToggleFavorite={() => toggleWishlist(product._id)}
                                    onAddToCart={(p) => {
                                        addToCart(p, 1);
                                        toast.success(`${p.name} added to cart!`, {
                                            icon: '🛒',
                                            style: {
                                                borderRadius: '1rem',
                                                background: '#333',
                                                color: '#fff',
                                            }
                                        });
                                    }}
                                    onViewDetails={(p) => {
                                        setSelectedProductForDetails(p);
                                        addToRecentlyViewed(p);
                                    }}
                                />
                            )
                        ))
                    )}
                </div>
            </div>

            {/* Filters Slide Drawer */}
            <AnimatePresence>
                {isFilterOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsFilterOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100]"
                        />
                        <motion.div 
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            className="fixed top-0 right-0 w-full max-w-md h-full bg-white dark:bg-dark-bg z-[1101] shadow-2xl p-8 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100 dark:border-gray-800">
                                <h3 className="text-xl font-black uppercase tracking-tighter">Advanced Control</h3>
                                <button onClick={() => setIsFilterOpen(false)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <div className="space-y-10">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Price Threshold</label>
                                    <input 
                                        type="range" min="0" max="500000" step="1000" value={priceRange}
                                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
                                    />
                                    <div className="flex justify-between mt-2 text-[10px] font-black text-primary">
                                        <span>₹0</span>
                                        <span>Max: ₹{priceRange.toLocaleString()}</span>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Shop Name</label>
                                    <input 
                                        type="text" placeholder="Filter by store..." value={shopFilter}
                                        onChange={(e) => setShopFilter(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 outline-none font-bold text-sm"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Sorting Order</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Newest', 'Top Rated', 'Price Low', 'Price High'].map(s => (
                                            <button 
                                                key={s} onClick={() => setSortBy(s)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${sortBy === s ? 'bg-primary text-white border-primary' : 'border-gray-100 text-gray-400 hover:border-primary/50'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-auto pt-10">
                                <button onClick={() => setIsFilterOpen(false)} className="w-full py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-primary/30">Apply Parameters</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Modal Handlers */}
            <AnimatePresence>
                {selectedProductForBooking && (
                    <BookingFlowManager 
                        product={selectedProductForBooking}
                        isOpen={!!selectedProductForBooking}
                        onClose={() => setSelectedProductForBooking(null)}
                        onComplete={(data) => {
                            addToCart({ ...selectedProductForBooking, price: data.totalPrice }, 1, data.slot, data.config);
                            setSelectedProductForBooking(null);
                            toast.success('Service configured! Processing to checkout...');
                            setTimeout(() => navigate('/checkout'), 800);
                        }}
                    />
                )}

                {selectedProductForDetails && (
                    <ProductDetailsModal 
                        product={selectedProductForDetails}
                        isOpen={!!selectedProductForDetails}
                        isFavorite={isFavorite(selectedProductForDetails._id)}
                        onToggleFavorite={toggleWishlist}
                        onClose={() => setSelectedProductForDetails(null)}
                        onAddToCart={(p) => {
                            addToCart(p, 1);
                            setSelectedProductForDetails(null);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Recently Viewed Section */}
            {recentlyViewed.length > 0 && (
                <div className="max-w-7xl mx-auto mt-32 mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <div className="flex items-center justify-between mb-10 border-b border-gray-100 dark:border-gray-800 pb-6">
                        <div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Recently <span className="text-primary">Viewed</span></h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Based on your browsing history</p>
                        </div>
                        <button 
                            onClick={() => {
                                localStorage.removeItem('fic_recently_viewed');
                                setRecentlyViewed([]);
                            }}
                            className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                        >
                            Clear History
                        </button>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
                        {recentlyViewed.map(product => (
                            <div key={`recent-${product._id}`} className="w-64 shrink-0 snap-start">
                                <ProductCard 
                                    product={product}
                                    isFavorite={isFavorite(product._id)}
                                    onToggleFavorite={() => toggleWishlist(product._id)}
                                    onAddToCart={(p) => addToCart(p, 1)}
                                    onViewDetails={(p) => {
                                        setSelectedProductForDetails(p);
                                        addToRecentlyViewed(p);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExploreShop;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, ChevronLeft, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cartItems, removeFromCart, updateCartQty, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-32 pb-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">Shopping <span className="text-primary">Cart</span></h1>
            <p className="text-gray-500 font-bold mt-2 uppercase tracking-widest text-xs md:sm">Review your selected products and services</p>
          </div>
          <Link to="/explore-shop" className="flex items-center gap-2 text-primary font-black uppercase text-xs md:sm hover:gap-3 transition-all">
            <ChevronLeft size={20} /> Continue Shopping
          </Link>
        </header>

        {cartItems.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-dark-card rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
             <ShoppingBag size={80} className="mx-auto text-gray-200 dark:text-gray-800 mb-8" />
             <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
             <p className="text-gray-500 font-bold mb-10">Looks like you haven't added anything to your cart yet.</p>
             <Link to="/explore-shop" className="px-10 py-5 bg-primary text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-sm">
                Explore Marketplace
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={`${item._id}-${item.slot?.time}`} 
                  className="bg-white dark:bg-dark-card p-4 md:p-6 rounded-[2rem] md:rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center gap-6 md:gap-8 group hover:shadow-2xl transition-all"
                >
                  <div className="w-full sm:w-32 h-48 sm:h-32 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100 dark:border-gray-800">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                            <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-white truncate uppercase tracking-tight">{item.name}</h3>
                            <p className="text-primary font-black text-lg mt-1">₹{item.price}</p>
                        </div>
                        <button 
                            onClick={() => removeFromCart(item._id, item.slot?.time)}
                            className="p-3 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm shrink-0"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 md:gap-6 mt-6">
                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-dark-bg px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800">
                             <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mr-2">Qty</span>
                             <button 
                                onClick={() => updateCartQty(item._id, item.slot?.time, item.qty - 1)}
                                className="p-1.5 hover:bg-white dark:hover:bg-dark-card rounded-lg transition-all text-gray-400 hover:text-primary"
                             >
                                <Minus size={14} />
                             </button>
                             <span className="font-black text-gray-900 dark:text-white min-w-[20px] text-center">{item.qty}</span>
                             <button 
                                onClick={() => updateCartQty(item._id, item.slot?.time, item.qty + 1)}
                                className="p-1.5 hover:bg-white dark:hover:bg-dark-card rounded-lg transition-all text-gray-400 hover:text-primary"
                             >
                                <Plus size={14} />
                             </button>
                        </div>
                        {item.slot && (
                             <div className="flex items-center gap-3 bg-secondary/10 px-4 py-2 rounded-xl border border-secondary/20">
                                <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Slot</span>
                                <span className="font-black text-[10px] md:text-xs text-secondary">{item.slot.date} {item.slot.time ? `@ ${item.slot.time}` : ''}</span>
                             </div>
                        )}
                        {item.selectedConfig && (
                            <div className="w-full mt-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                    {item.selectedConfig.selections && Object.entries(item.selectedConfig.selections).map(([k, v]) => (
                                        <div key={k} className="flex items-center gap-2">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{k}:</span>
                                            <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase italic">{v}</span>
                                        </div>
                                    ))}
                                </div>
                                {item.selectedConfig.selectedMiniServices?.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                        <p className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] mb-2">Add-ons Selected</p>
                                        <div className="flex flex-wrap gap-2">
                                            {item.selectedConfig.selectedMiniServices.map(mini => (
                                                <span key={mini.id} className="px-3 py-1 bg-secondary/10 text-secondary text-[9px] font-black rounded-lg border border-secondary/20 uppercase italic">
                                                    {mini.label} {mini.qty > 1 ? `(x${mini.qty})` : ''}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-dark-card p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl sticky top-32">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Order Summary</h3>
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between font-bold text-gray-500 uppercase tracking-widest text-xs">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-500 uppercase tracking-widest text-xs">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="h-px bg-gray-100 dark:bg-gray-800 my-6"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Total</span>
                    <span className="text-4xl font-black text-primary tracking-tighter">₹{cartTotal}</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full py-6 bg-primary text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                >
                  Checkout Now <ArrowRight size={20} />
                </button>
                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6">Secure Encrypted Payments</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight, Trash2, ShoppingCart, ChevronLeft, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { favorites, loading, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-12 pb-24 px-4 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <Link title="Return to Shop" to="/explore-shop" className="inline-flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest mb-4 hover:gap-4 transition-all group">
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Shop
            </Link>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter mb-4">
              My <span className="text-primary italic">Wishlist</span>
            </h1>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
              {favorites.length} {favorites.length === 1 ? 'Item' : 'Items'} Saved
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[3/4] bg-white dark:bg-dark-card rounded-[2.5rem] animate-pulse shadow-xl" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8">
              <Heart size={40} className="opacity-30" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 italic">Your wishlist is empty</h2>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-10 max-w-md mx-auto">
              Save your favorite products here to keep track of them.
            </p>
            <Link
              to="/explore-shop"
              className="px-10 py-5 bg-primary text-white font-black rounded-full text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-primary/30 flex items-center gap-3 group"
            >
              Start Shopping <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {favorites.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="group relative bg-white dark:bg-dark-card rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-dark-bg">
                    <img
                      src={product.image || '/logo.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Remove Icon Button (top-right overlay) */}
                    <button
                      onClick={() => toggleWishlist(product._id)}
                      title="Remove from Wishlist"
                      className="absolute top-4 right-4 w-11 h-11 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-red-600 transition-all hover:scale-110 z-10"
                    >
                      <Trash2 size={16} />
                    </button>
                    {/* Discount Badge */}
                    {product.discountPrice && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg z-10">
                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-2">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{product.category}</p>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-tight line-clamp-2">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 mb-3 text-yellow-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-[10px] font-black text-gray-500">{product.rating || '4.8'}</span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mb-4 line-clamp-2">{product.description}</p>

                    {/* Price + Add to Cart */}
                    <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">
                          ₹{(product.discountPrice || product.price)?.toLocaleString()}
                        </p>
                        {product.discountPrice && (
                          <p className="text-xs text-gray-400 line-through font-bold">₹{product.price?.toLocaleString()}</p>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(product, 1)}
                        disabled={product.countInStock <= 0}
                        title="Add to Cart"
                        className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-blue-700 transition-all disabled:opacity-40 disabled:grayscale active:scale-95"
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>

                    {/* Remove Text Button */}
                    <button
                      onClick={() => toggleWishlist(product._id)}
                      className="mt-4 w-full py-3 text-[10px] font-black text-red-500 uppercase tracking-widest rounded-2xl border border-red-100 dark:border-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Heart size={12} fill="currentColor" /> Remove from Wishlist
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Bottom CTA Banner */}
        {favorites.length > 0 && (
          <div className="mt-20 p-12 bg-white dark:bg-dark-card rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left border border-gray-100 dark:border-gray-800 shadow-xl">
            <div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 italic tracking-tight">
                Ready to Secure Your Tools?
              </h3>
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                Free delivery on orders above ₹1,999
              </p>
            </div>
            <Link
              to="/cart"
              className="px-10 py-5 bg-secondary text-dark-bg font-black rounded-full text-sm uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-xl shadow-secondary/30 flex items-center gap-3"
            >
              Proceed to Cart <ShoppingCart size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

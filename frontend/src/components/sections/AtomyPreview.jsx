import React, { useState, useEffect } from 'react';
import { ArrowRight, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AtomyPreview = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAtomyProducts = async () => {
      try {
        // Fetch products that are active and in the Atomy category
        const response = await api.get('/products', {
          params: { category: 'Atomy', isActive: 'true', limit: 4 }
        });
        
        let fetchedProducts = response.data.products || response.data || [];
        // Optional: Filter for featured products if your API supports it, 
        // or rely on the backend query.
        
        setProducts(fetchedProducts.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch Atomy products", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAtomyProducts();
  }, []);

  if (loading || products.length === 0) {
    // If no products available, hide section or show minimal placeholder
    return null;
  }

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-[1536px] mx-auto px-6 md:px-12 lg:px-24">
         <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div className="max-w-2xl">
               <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <Leaf size={14} /> Atomy Wellness
               </span>
               <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">Discover curated wellness and lifestyle products.</h2>
               <p className="text-slate-600">Premium wellness, personal care, and lifestyle products.</p>
            </div>
            <button onClick={() => navigate('/atomy')} className="shrink-0 text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
               Explore Atomy Wellness <ArrowRight size={16} />
            </button>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
               <div key={product._id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group flex flex-col">
                  <div className="aspect-square bg-slate-50 relative overflow-hidden">
                     {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                           <Leaf size={48} />
                        </div>
                     )}
                     {product.isFeatured && (
                        <div className="absolute top-4 left-4 bg-amber-400 text-white text-[10px] font-black uppercase px-2 py-1 rounded">
                           Featured
                        </div>
                     )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                     <h3 className="font-bold text-slate-900 mb-2 truncate">{product.name}</h3>
                     <p className="text-xs text-slate-500 mb-4 line-clamp-2 flex-1">{product.shortDescription || product.description}</p>
                     <div className="flex items-center justify-between mt-auto">
                        <span className="font-black text-slate-900">₹{product.discountPrice || product.offerPrice || product.price}</span>
                        <button onClick={() => navigate(`/atomy`)} className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
                           View
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </section>
  );
};

export default AtomyPreview;

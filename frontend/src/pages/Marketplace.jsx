import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Clock, Filter, ChevronRight, Mic, LayoutDashboard, Home, Car, Monitor, Sparkles, Wrench, Package, CarTaxiFront, Code } from 'lucide-react';
import api from '../services/api';

const Marketplace = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [services, setServices] = useState([]);
  
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Icon mapping
  const getIcon = (name) => {
    const icons = { LayoutDashboard, Home, Car, Monitor, Sparkles, Wrench, Package, CarTaxiFront, Code };
    const Icon = icons[name] || LayoutDashboard;
    return <Icon size={24} />;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/marketplace/categories');
      setCategories(data);
      if(data.length > 0) {
        handleCategoryClick(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCategoryClick = async (category) => {
    setActiveCategory(category);
    setActiveSubCategory(null);
    setIsLoading(true);
    try {
      const [subData, srvData] = await Promise.all([
        api.get(`/marketplace/subcategories/${category._id}`),
        api.get(`/marketplace/services?categoryId=${category._id}`)
      ]);
      setSubCategories(subData.data);
      setServices(srvData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubCategoryClick = async (subCat) => {
    setActiveSubCategory(subCat);
    setIsLoading(true);
    try {
      const { data } = await api.get(`/marketplace/services?subCategoryId=${subCat._id}`);
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-24 pb-20">
      
      {/* Search Header */}
      <div className="bg-white dark:bg-dark-card border-b border-gray-100 dark:border-gray-800 sticky top-20 z-40 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-dark-bg px-4 py-2 rounded-full w-full md:w-96 border border-gray-200 dark:border-gray-700">
            <Search className="text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search for any service..." 
              className="bg-transparent border-none outline-none w-full text-sm font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="text-indigo-600 p-1 hover:bg-indigo-50 rounded-full transition-colors">
              <Mic size={18} />
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-dark-bg rounded-full border border-gray-200 dark:border-gray-700 whitespace-nowrap text-sm font-bold text-gray-700 dark:text-gray-200">
              <MapPin size={16} className="text-indigo-600" /> Current Location
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-dark-bg rounded-full border border-gray-200 dark:border-gray-700 whitespace-nowrap text-sm font-bold text-gray-700 dark:text-gray-200">
              <Filter size={16} /> Filters
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar - Categories */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 pl-4">All Categories</h2>
          {categories.map((cat) => (
            <button 
              key={cat._id}
              onClick={() => handleCategoryClick(cat)}
              className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-left ${activeCategory?._id === cat._id ? 'bg-white dark:bg-dark-card shadow-lg shadow-indigo-500/5 text-indigo-600 border border-indigo-100 dark:border-indigo-500/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card'}`}
            >
              <div className={`p-2 rounded-xl ${activeCategory?._id === cat._id ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'bg-gray-100 dark:bg-dark-bg'}`}>
                {getIcon(cat.icon)}
              </div>
              <span className="flex-1">{cat.name}</span>
              {activeCategory?._id === cat._id && <ChevronRight size={16} />}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          
          {/* SubCategories Pills */}
          <div className="flex flex-nowrap overflow-x-auto gap-3 pb-4 no-scrollbar mb-6">
            <button
              onClick={() => handleCategoryClick(activeCategory)}
              className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all ${!activeSubCategory ? 'bg-gray-900 text-white dark:bg-white dark:text-black shadow-md' : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-900'}`}
            >
              All {activeCategory?.name}
            </button>
            {subCategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() => handleSubCategoryClick(sub)}
                className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeSubCategory?._id === sub._id ? 'bg-gray-900 text-white dark:bg-white dark:text-black shadow-md' : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-900'}`}
              >
                {getIcon(sub.icon)} {sub.name}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-80 bg-gray-200 dark:bg-gray-800 rounded-[2rem] animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {services.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((service) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={service._id}
                    className="bg-white dark:bg-dark-card rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 dark:border-gray-800 flex flex-col group cursor-pointer"
                  >
                    <div className="h-48 relative overflow-hidden bg-gray-100 dark:bg-dark-bg">
                      <img 
                        src={service.images[0] || 'https://via.placeholder.com/400x300'} 
                        alt={service.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" /> 4.8
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-black text-xl text-gray-900 dark:text-white mb-2 leading-tight">{service.name}</h3>
                      <div className="flex items-center gap-4 mb-4 text-sm font-bold text-gray-500">
                        <span className="flex items-center gap-1"><Clock size={14} /> {service.duration}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">{service.pricingType}</span>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Starting at</p>
                          <p className="text-2xl font-black text-gray-900 dark:text-white">₹{service.basePrice}</p>
                        </div>
                        <button className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-black text-sm hover:shadow-lg hover:shadow-gray-900/20 transition-all">
                          Book
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          {!isLoading && services.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-dark-card rounded-[3rem] border border-gray-100 dark:border-gray-800">
              <div className="w-20 h-20 bg-gray-50 dark:bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-50">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-black mb-2">No Services Found</h3>
              <p className="text-gray-500 font-bold">Try adjusting your filters or search query.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Marketplace;

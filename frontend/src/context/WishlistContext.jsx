import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const fetchWishlist = useCallback(async () => {
    if (!userInfo) return;
    setLoading(true);
    try {
      const { data } = await api.get('/users/favorites');
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [userInfo?._id]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productId) => {
    if (!userInfo) {
      toast.error('Please login to manage your wishlist');
      return;
    }

    try {
      const { data } = await api.post('/users/favorites/toggle', { productId });
      // Backend returns favorites array of IDs
      const newFavoritesIds = data.favorites || [];
      
      // If we are on the wishlist page, we might want the full objects. 
      // But for the shop toggle, we just need to know if it's included.
      // We'll update the favorites state. If it was a removal, we filter locally.
      // If it's an addition, we might need to fetch the full product details if we want full objects in context.
      // To keep it simple and consistent:
      fetchWishlist(); // Re-fetch full objects to ensure everything is synced
      
      toast.success(data.message);
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(item => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider value={{ favorites, loading, toggleWishlist, isFavorite, refreshWishlist: fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

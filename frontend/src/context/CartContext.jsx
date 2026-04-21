import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1, slot = null, selectedConfig = null) => {
    setCartItems((prevItems) => {
      // Check if item with same ID, slot AND config already exists
      const configStr = JSON.stringify(selectedConfig || {});
      const existItem = prevItems.find((x) => 
        x._id === product._id && 
        x.slot?.time === slot?.time && 
        x.slot?.date === slot?.date &&
        JSON.stringify(x.selectedConfig || {}) === configStr
      );

      if (existItem) {
        return prevItems.map((x) =>
          x._id === existItem._id && 
          x.slot?.time === slot?.time && 
          x.slot?.date === slot?.date &&
          JSON.stringify(x.selectedConfig || {}) === configStr ? { ...x, qty: x.qty + qty } : x
        );
      } else {
        // Use the price from product unless it's a service where we might have a dynamic price (handled by BookingFlowManager)
        // But the product argument here might already have the updated price if passed from ExploreShop
        return [...prevItems, { ...product, qty, slot, selectedConfig }];
      }
    });
  };

  const updateCartQty = (id, slotTime, qty) => {
    setCartItems((prevItems) => {
      return prevItems.map((x) =>
        x._id === id && x.slot?.time === slotTime ? { ...x, qty: Math.max(1, qty) } : x
      );
    });
  };

  const removeFromCart = (id, slotTime = null) => {
    setCartItems((prevItems) => 
      prevItems.filter((x) => !(x._id === id && x.slot?.time === slotTime))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

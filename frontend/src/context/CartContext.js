import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('Kochi');

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + product.qty } : item
        );
      } else {
        return [...prevItems, product];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  const updateQty = (id, qty) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item._id === id ? { ...item, qty } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        selectedBranch,
        setSelectedBranch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

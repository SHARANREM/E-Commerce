
import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'carts', user.uid), (doc) => {
      if (doc.exists()) {
        setCartItems(doc.data().items || []);
      } else {
        setCartItems([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const updateFirestore = async (items: CartItem[]) => {
    if (!user) return;
    await setDoc(doc(db, 'carts', user.uid), { uid: user.uid, items });
  };

  const addToCart = async (productId: string) => {
    const existingItem = cartItems.find(i => i.productId === productId);
    let newItems: CartItem[];
    if (existingItem) {
      newItems = cartItems.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i);
    } else {
      newItems = [...cartItems, { productId, quantity: 1 }];
    }
    setCartItems(newItems);
    await updateFirestore(newItems);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const newItems = cartItems.map(i => i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i);
    setCartItems(newItems);
    await updateFirestore(newItems);
  };

  const removeFromCart = async (productId: string) => {
    const newItems = cartItems.filter(i => i.productId !== productId);
    setCartItems(newItems);
    await updateFirestore(newItems);
  };

  const clearCart = async () => {
    setCartItems([]);
    await updateFirestore([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

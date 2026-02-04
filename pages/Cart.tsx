
import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Product } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [productsData, setProductsData] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const data: Record<string, Product> = {};
      for (const item of cartItems) {
        if (!productsData[item.productId]) {
          const docRef = doc(db, 'products', item.productId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            data[item.productId] = { id: docSnap.id, ...docSnap.data() } as Product;
          }
        }
      }
      setProductsData(prev => ({ ...prev, ...data }));
      setLoading(false);
    };

    if (cartItems.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [cartItems]);

  const total = cartItems.reduce((acc, item) => {
    const product = productsData[item.productId];
    return acc + (product ? product.price * item.quantity : 0);
  }, 0);

  if (loading) return <div className="p-10"><Loader /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">Shopping Bag</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="mb-6 inline-flex p-6 bg-indigo-50 rounded-full">
            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-xl text-gray-500 mb-8">Your bag is currently empty.</p>
          <Link to="/" className="inline-block px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => {
              const product = productsData[item.productId];
              if (!product) return null;
              return (
                <div key={item.productId} className="flex items-center space-x-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                    <p className="text-indigo-600 font-semibold mt-1">${product.price.toFixed(2)}</p>
                    <div className="flex items-center mt-4 space-x-4">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-50 text-gray-600 font-bold"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-x border-gray-200 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-50 text-gray-600 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">${(product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4 pb-6 border-b border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-6 mb-8">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-black text-indigo-600">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition transform active:scale-[0.98] shadow-lg shadow-indigo-100"
            >
              Checkout Now
            </button>
            <p className="text-xs text-gray-400 text-center mt-4 uppercase tracking-widest font-semibold">
              Secure Checkout with NexusCart
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

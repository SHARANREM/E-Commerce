
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Product, OrderItem } from '../types';
import Loader from '../components/Loader';

const Checkout: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const [itemsWithDetails, setItemsWithDetails] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      const details: OrderItem[] = [];
      for (const item of cartItems) {
        const docRef = doc(db, 'products', item.productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const prod = docSnap.data() as Product;
          details.push({
            ...item,
            name: prod.name,
            price: prod.price
          });
        }
      }
      setItemsWithDetails(details);
      setLoading(false);
    };

    if (cartItems.length > 0) {
      fetchDetails();
    } else {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const total = itemsWithDetails.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!user) return;
    setProcessing(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items: itemsWithDetails,
        totalAmount: total,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      await clearCart();
      navigate('/orders');
    } catch (error) {
      console.error("Order failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-10"><Loader /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Review Your Order</h1>
        
        <div className="space-y-6 mb-10">
          {itemsWithDetails.map((item) => (
            <div key={item.productId} className="flex justify-between items-center pb-4 border-b border-gray-50">
              <div>
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl mb-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 font-medium">Subtotal</span>
            <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-3xl font-black text-indigo-600">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm border border-blue-100 flex items-start">
            <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p>NexusCart supports COD and local payment options at delivery. No payment is required right now.</p>
          </div>
          
          <button
            onClick={handlePlaceOrder}
            disabled={processing}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl transition transform active:scale-[0.98] shadow-xl shadow-indigo-100 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {processing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing Order...</span>
              </>
            ) : (
              <span>Confirm & Place Order</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

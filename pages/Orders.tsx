
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import Loader from '../components/Loader';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        setOrders(list);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (loading) return <div className="p-10"><Loader /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
           <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
           <a href="/" className="text-indigo-600 font-bold hover:underline">Start Shopping</a>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Order ID</p>
                  <p className="text-sm font-mono text-gray-600">{order.id}</p>
                </div>
                <div className="text-right">
                   <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                     order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                     order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                     'bg-blue-100 text-blue-700'
                   }`}>
                     {order.status}
                   </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                      <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                   <p className="text-gray-500 text-sm">Placed on: {order.createdAt?.toDate().toLocaleDateString()}</p>
                   <p className="text-xl font-bold text-gray-900">Total: ${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

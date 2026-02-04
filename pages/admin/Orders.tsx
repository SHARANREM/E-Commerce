
import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Order } from '../../types';
import Loader from '../../components/Loader';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    await updateDoc(doc(db, 'orders', orderId), { status });
    fetchOrders();
  };

  if (loading) return <div className="p-10"><Loader /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">Global Order List</h1>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Order ID / User</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-mono text-xs text-gray-400">{o.id}</p>
                  <p className="text-sm font-semibold text-gray-900">{o.userId}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {o.createdAt?.toDate().toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {o.items.length} items
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">${o.totalAmount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                    o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    className="text-xs border rounded p-1"
                    value={o.status}
                    onChange={(e) => updateStatus(o.id!, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-20 text-center text-gray-400 italic">No orders found in the database.</div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

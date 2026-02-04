
import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">Admin Control Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link to="/admin/products" className="group">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="mb-6 inline-flex p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Manage Products</h2>
            <p className="text-gray-500">Add new items, update details, delete inventory, and manage categories.</p>
          </div>
        </Link>

        <Link to="/admin/orders" className="group">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="mb-6 inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Customer Orders</h2>
            <p className="text-gray-500">View all customer orders, track fulfillment status, and update tracking info.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;


import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';

import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';

import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/product/:id" element={<ProductDetails />} />

                {/* User Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<Dashboard />} />
                  <Route path="/admin/products" element={<Products />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                </Route>
              </Routes>
            </main>
            <footer className="bg-white border-t py-8 text-center text-gray-400 text-sm">
              <p>&copy; 2024 NexusCart Premium E-commerce. Built with Gemini & React.</p>
            </footer>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;

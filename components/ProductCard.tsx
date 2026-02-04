
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      <Link to={`/product/${product.id}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
           <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700 border border-gray-100 uppercase tracking-wide">
             {product.category}
           </span>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2 min-h-[40px]">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">${product.price.toFixed(2)}</span>
          <button
            onClick={() => user ? addToCart(product.id!) : alert('Please login to add to cart')}
            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

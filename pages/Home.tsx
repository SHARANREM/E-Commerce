
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Elevate Your Lifestyle
        </h1>
        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          Explore our curated collection of premium products designed for the modern individual.
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-lg">No products found. Start by adding some in the admin panel!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;

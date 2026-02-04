
import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Product } from '../../types';
import Loader from '../../components/Loader';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setImageFile(null);
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = '';
      if (imageFile && imageFile.name) {
        imageUrl = `https://raw.githubusercontent.com/SampleStorage/DemoStorageEcommerce/main/${imageFile.name}`;
      }

      const productData = {
        name,
        description,
        price: parseFloat(price),
        category,
        updatedAt: serverTimestamp(),
      } as any;

      if (imageUrl) productData.imageUrl = imageUrl;


      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), productData);
      } else {
        productData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'products'), productData);
      }
      
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving product");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    }
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id!);
    setName(p.name);
    setDescription(p.description);
    setPrice(p.price.toString());
    setCategory(p.category);
    setShowModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {loading ? <Loader /> : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <img src={p.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-gray-500">{p.category}</td>
                  <td className="px-6 py-4 font-bold text-indigo-600">${p.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openEdit(p)} className="text-indigo-600 hover:text-indigo-800 font-bold text-sm">Edit</button>
                    <button onClick={() => handleDelete(p.id!)} className="text-red-600 hover:text-red-800 font-bold text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                <input required className="w-full px-4 py-3 rounded-xl border border-gray-200" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Price ($)</label>
                  <input type="number" step="0.01" required className="w-full px-4 py-3 rounded-xl border border-gray-200" value={price} onChange={e => setPrice(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <input required className="w-full px-4 py-3 rounded-xl border border-gray-200" value={category} onChange={e => setCategory(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea rows={4} required className="w-full px-4 py-3 rounded-xl border border-gray-200" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Image Name {editingId && '(Leave blank to keep current)'}</label>
                <input
                  type="text"
                  placeholder="e.g., product1.jpg"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  value={imageFile ? imageFile.name : ''}
                  onChange={e => setImageFile({ name: e.target.value } as any)}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                <button type="submit" disabled={uploading} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50">
                  {uploading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

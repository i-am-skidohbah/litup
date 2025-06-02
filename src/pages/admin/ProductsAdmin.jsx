import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from '../../FirebaseConfig';

function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', imageUrl: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('Item One');
  const [editProductId, setEditProductId] = useState(null);
  const [editProductData, setEditProductData] = useState({ name: '', price: '', description: '', imageUrl: '', category: '' });

  const db = getFirestore(firebaseApp);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'lightup', 'someDocId', 'products'));
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    } catch (error) {
      setErrorMsg('Error fetching products: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [db]);

  const handleAddProduct = async () => {
    setErrorMsg('');
    if (!newProduct.name || !newProduct.price) return;
    try {
      await addDoc(collection(db, 'lightup', 'someDocId', 'products'), newProduct);
      setNewProduct({ name: '', price: '', description: '', imageUrl: '', category: '' });
      fetchProducts();
    } catch (error) {
      setErrorMsg('Error adding product: ' + (error.message || error));
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'lightup', 'someDocId', 'products', id));
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      setErrorMsg('Error deleting product: ' + (error.message || error));
    }
  };

  const handleEditProduct = (product) => {
    setEditProductId(product.id);
    setEditProductData({
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl || '',
      category: product.category || ''
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editProductId) return;
    try {
      await updateDoc(
        doc(db, 'lightup', 'someDocId', 'products', editProductId),
        editProductData
      );
      setEditProductId(null);
      setEditProductData({ name: '', price: '', description: '', imageUrl: '', category: '' });
      fetchProducts();
    } catch (error) {
      setErrorMsg('Error updating product: ' + (error.message || error));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `lightup/products/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setNewProduct({ ...newProduct, imageUrl: url });
  };

  return (
    <div className="p-4">
      <div className="w-full h-full max-w-3xl mx-auto">
        <div className="flex border-b border-gray-700">
          <button
            className={`flex-1 py-2 ${activeTab === 'Item One' ? 'border-b-2 border-green-500' : ''}`}
            onClick={() => setActiveTab('Item One')}
          >
            Products
          </button>
          <button
            className={`flex-1 py-2 ${activeTab === 'Item Two' ? 'border-b-2 border-green-500' : ''}`}
            onClick={() => setActiveTab('Item Two')}
          >
            Add Products
          </button>
          <button
            className={`flex-1 py-2 ${activeTab === 'Item Three' ? 'border-b-2 border-green-500' : ''}`}
            onClick={() => setActiveTab('Item Three')}
          >
            ITEM THREE
          </button>
        </div>
        <div className="p-4">
          {activeTab === 'Item One' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Existing Products</h3>
              {loading ? (
                <div>Loading...</div>
              ) : products.length === 0 ? (
                <div>No products found.</div>
              ) : (
                <ul className="space-y-4">
                  {products.map(product => (
                    <li key={product.id} className="border border-green-500 p-4 mb-4 rounded shadow flex items-start gap-4 bg-white">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-28 h-28 object-cover rounded mr-4 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1">{product.name}</h4>
                        <span className="text-green-700 font-semibold block mb-1">₦{product.price}</span>
                        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                        {product.category && (
                          <span className="inline-block bg-gray-200 text-xs text-gray-700 px-2 py-1 rounded mb-2">{product.category}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded flex items-center justify-center"
                          title="Delete"
                        >
                          {/* Trash icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="bg-blue-500 text-white px-3 py-1 rounded flex items-center justify-center"
                          title="Edit"
                        >
                          {/* Pencil/edit icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 7.232l1.536 1.536M9 13l6-6 3 3-6 6H9v-3z" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {/* Edit Product Modal/Form */}
              {editProductId && (
                <div className="fixed inset-0 bg-green-500/50 flex items-center justify-center z-50">
                  <form
                    className="bg-white p-8 rounded shadow max-w-xl w-full"
                    onSubmit={handleUpdateProduct}
                  >
                    <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Name</label>
                      <input
                        type="text"
                        value={editProductData.name}
                        onChange={e => setEditProductData({ ...editProductData, name: e.target.value })}
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Price (₦)</label>
                      <input
                        type="number"
                        value={editProductData.price}
                        onChange={e => setEditProductData({ ...editProductData, price: e.target.value })}
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Description</label>
                      <textarea
                        value={editProductData.description}
                        onChange={e => setEditProductData({ ...editProductData, description: e.target.value })}
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Image URL</label>
                      <input
                        type="text"
                        value={editProductData.imageUrl}
                        onChange={e => setEditProductData({ ...editProductData, imageUrl: e.target.value })}
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Category</label>
                      <select
                        value={editProductData.category}
                        onChange={e => setEditProductData({ ...editProductData, category: e.target.value })}
                        className="border p-2 w-full rounded"
                      >
                        <option value="">Select Category</option>
                        <option value="solar-panel">Solar Panel</option>
                        <option value="inverter">Inverter</option>
                        <option value="battery">Battery</option>
                        <option value="accessory">Accessory</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="bg-gray-400 text-white px-6 py-2 rounded font-semibold"
                        onClick={() => setEditProductId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
          {activeTab === 'Item Two' && (
            <form
              className="bg-white p-8 rounded shadow max-w-xl mx-auto"
              onSubmit={e => {
                e.preventDefault();
                handleAddProduct();
              }}
            >
              <h2 className="text-2xl font-bold mb-4">Add Product Form</h2>
              <p className="mb-6 text-gray-700">Please fill out this form to add a new product.</p>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Price (₦)</label>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={newProduct.price}
                  onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="border p-2 w-full rounded"
                />
                {newProduct.imageUrl && (
                  <img src={newProduct.imageUrl} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded" />
                )}
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Description (optional)</label>
                <textarea
                  placeholder="Enter product description"
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={newProduct.category}
                  onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="border p-2 w-full rounded"
                >
                  <option value="">Select Category</option>
                  <option value="solar-panel">Solar Panel</option>
                  <option value="inverter">Inverter</option>
                  <option value="battery">Battery</option>
                  <option value="accessory">Accessory</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {errorMsg && <div className="text-red-500 mb-2">{errorMsg}</div>}
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded font-semibold mt-2 w-full"
              >
                Add Product
              </button>
            </form>
          )}
          {activeTab === 'Item Three' && (
            <div>Item Three Content</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsAdmin;

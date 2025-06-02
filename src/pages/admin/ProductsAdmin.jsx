import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from '../../FirebaseConfig';

function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', imageUrl: '' });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

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
      setNewProduct({ name: '', price: '', description: '', imageUrl: '' });
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
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      {/* Add New Product */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Add New Product</h3>
        {errorMsg && <div className="text-red-500 mb-2">{errorMsg}</div>}
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="number"
          placeholder="Price (₦)"
          value={newProduct.price}
          onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border p-2 mb-2 w-full"
        />
        {/* <input
          type="text"
          placeholder="Image URL (optional)"
          value={newProduct.imageUrl}
          onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
          className="border p-2 mb-2 w-full"
        /> */}
        <textarea
          placeholder="Description (optional)"
          value={newProduct.description}
          onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <select
          value={newProduct.category || ''}
          onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
          className="border p-2 mb-2 w-full"
        >
          <option value="">Select Category</option>
          <option value="solar-panel">Solar Panel</option>
          <option value="inverter">Inverter</option>
          <option value="battery">Battery</option>
          <option value="accessory">Accessory</option>
          <option value="other">Other</option>
        </select>
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </div>
      {/* List of Products */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Existing Products</h3>
        {loading ? (
          <div>Loading...</div>
        ) : products.length === 0 ? (
          <div>No products found.</div>
        ) : (
          <ul>
            {products.map(product => (
              <li key={product.id} className="border p-4 mb-4 rounded shadow flex items-center justify-between">
                <div>
                  <h4 className="font-bold">{product.name}</h4>
                  <span className="text-green-700 font-semibold">₦{product.price}</span>
                  {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-20 h-12 object-cover mt-2 rounded" />}
                  <p className="text-gray-700 text-sm mt-1">{product.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProductsAdmin;

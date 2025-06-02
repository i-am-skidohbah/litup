import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../FirebaseConfig';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

function ProductsRow() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const querySnapshot = await getDocs(collection(db, 'lightup', 'someDocId', 'products'));
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData.slice(0, 6));
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  if (loading) return <div className="mt-8">Loading products...</div>;
  if (products.length === 0) return <div className="mt-8">No products found.</div>;

  return (
    <div className="mt-8 bg-gray-50 py-6 px-2 rounded">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2 px-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl text-green-700"><svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 21 12 17.27 7.82 21 9 12.91l-5-3.64 5.91-.91z"/></svg></span>
            <span className="font-bold text-lg md:text-2xl text-gray-900">Our New Products</span>
          </div>
          <a
            href="/products"
            className="text-green-700 font-semibold hover:underline text-sm md:text-base"
          >
            VIEW ALL
          </a>
        </div>
        <div className="flex bg-white rounded shadow overflow-x-auto md:overflow-x-visible">
          {/* Promo Card */}
          <div className="flex flex-col items-start justify-between min-w-[260px] max-w-[260px] bg-gradient-to-br from-green-100 to-green-50 p-6 border-r border-gray-100">
            <img
              src={products[0]?.imageUrl || '/vrbox.png'}
              alt="Promo"
              className="w-40 h-32 object-contain mb-4"
            />
            <span className="text-xs text-green-700 font-semibold mb-1">Catch Big Deals</span>
            <span className="text-lg md:text-xl font-bold text-green-800 leading-tight mb-2">
              ON THE SMART<br />WATCH
            </span>
          </div>
          {/* Product Cards */}
          {products.map((product, idx) => (
            <div
              key={product.id}
              className="flex flex-col items-start justify-between min-w-[220px] max-w-[220px] border-r border-gray-100 p-4 relative group"
              style={{ background: '#fff' }}
            >
              <button
                className="absolute top-4 right-4 bg-white border border-green-100 rounded-full p-2 shadow hover:bg-green-50 transition z-10"
                onClick={() => handleAddToCart(product)}
                title="Add to Cart"
              >
                <FaShoppingCart className="text-green-700" />
              </button>
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-28 h-28 object-contain mb-3 cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                />
              )}
              <div className="text-xs text-gray-500 mb-1">{product.category || 'Headphones'}</div>
              <h3
                className="text-base font-bold mb-1 cursor-pointer hover:text-green-700"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                {product.name}
              </h3>
              <span className="text-green-700 font-semibold mb-1">
                ₦{Number(product.price).toLocaleString('en-NG')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductsRow;

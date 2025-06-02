import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../../FirebaseConfig';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortOrder, setSortOrder] = useState('popularity');
  const [search, setSearch] = useState('');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const querySnapshot = await getDocs(collection(db, 'lightup', 'someDocId', 'products'));
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);
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

  // Extract unique categories from products
  const categories = [
    'All Categories',
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];

  // Search and filter products
  let filteredProducts = products.filter((p) =>
    (selectedCategory === 'All Categories' || p.category === selectedCategory) &&
    (p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()))
  );

  // Sort products
  if (sortOrder === 'price-asc') {
    filteredProducts = filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortOrder === 'price-desc') {
    filteredProducts = filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortOrder === 'name-asc') {
    filteredProducts = filteredProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else if (sortOrder === 'category') {
    filteredProducts = filteredProducts.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="nini py-4 px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
          {/* Sort Dropdown Button */}
          <div className="relative">
            <button
              className="koko bg-green-600 text-white px-4 py-2 rounded flex items-center font-semibold"
              onClick={() => setSortDropdownOpen((open) => !open)}
              title="Sort by Category"
              type="button"
            >
              <span className="mr-2">&#9776;</span>
              <span className="hidden sm:inline">
                {selectedCategory === 'All Categories'
                  ? 'All Categories'
                  : selectedCategory}
              </span>
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {sortDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border rounded shadow z-10 max-h-64 overflow-y-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`block w-full text-left px-4 py-2 hover:bg-green-100 ${
                      selectedCategory === cat ? 'font-bold text-green-700' : ''
                    }`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSortDropdownOpen(false);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Search Form */}
          <form
            className="flex-1 flex items-center"
            onSubmit={e => {
              e.preventDefault();
              // Already handled by input's onChange
            }}
          >
            <input
              type="text"
              placeholder="What are you looking for............"
              className="mput flex-1 min-w-0 px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-400 transition w-full sm:w-64 bg-gray-50"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="ml-2 bg-green-600 text-white px-4 py-2 rounded font-semibold w-full sm:w-auto mt-2 sm:mt-0"
            >
              SEARCH NOW
            </button>
          </form>
        </div>
      </div>

      <main className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full py-8 px-4">
        {/* Sidebar */}
        <aside className="hidden lg:block wewe w-full md:w-1/4 mb-8 md:mb-0 md:mr-8">
          <div className="bg-white rounded shadow p-6 mb-6">
            <h3 className="font-bold mb-4 text-lg">SHOP BY CATEGORY</h3>
            <ul className="popo space-y-2 text-gray-700">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className={`cursor-pointer px-2 py-1 rounded ${selectedCategory === cat ? 'bg-green-100 font-bold text-green-700' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div className="text-gray-700">
              Showing 01 - {filteredProducts.length.toString().padStart(2, '0')} of {filteredProducts.length} Results
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span>Sorting items</span>
              <select
                className="border px-2 py-1 rounded"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
              >
                <option value="popularity">Sort by popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
              </select>
            </div>
          </div>
          {loading ? (
            <div>Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div>No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded shadow p-4 flex flex-col items-center group relative">
                  {/* Add-to-cart icon top right */}
                  <button
                    className="absolute top-2 right-2 bg-white border border-gray-200 rounded-full p-2 shadow hover:bg-green-100 transition"
                    onClick={() => handleAddToCart(product)}
                    title="Add to Cart"
                  >
                    <FaShoppingCart className="text-gray-700" />
                  </button>
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-32 h-32 object-contain mb-3 cursor-pointer transition-transform group-hover:scale-105"
                      onClick={() => navigate(`/products/${product.id}`)}
                    />
                  )}
                  <div className="text-xs text-gray-500 mb-1">{product.category || 'Product'}</div>
                  <h2
                    className="text-base font-bold mb-1 cursor-pointer text-center hover:text-green-700"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    {product.name}
                  </h2>
                  <div className="text-xs text-gray-700 mb-1">{product.description || ''}</div>
                  <p className="text-green-700 font-semibold mb-1">
                    ₦{Number(product.price).toLocaleString('en-NG')}
                  </p>
                  <button
                    className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm w-full"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Products;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebaseApp } from '../FirebaseConfig';
import Navbar from './Navbar';
import Footer from './Footer';
import { FaHeart } from 'react-icons/fa';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('description');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const docRef = doc(db, 'lightup', 'someDocId', 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setProduct(null);
        }
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const cartProduct = { ...product, selectedSize, selectedColor, quantity };
    const updatedCart = [...cart, cartProduct];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    setShowModal(true);
    setTimeout(() => setShowModal(false), 2000);
  };

  if (loading) return <div className="p-8">Loading product...</div>;
  if (!product) return <div className="p-8">Product not found.</div>;

  const sizes = product.sizes || ['Small', 'Medium', 'Large'];
  const colors = product.colors || ['Black', 'White', 'Green'];
  const images = product.images || [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg px-8 py-6 flex flex-col items-center">
            <div className="text-green-600 text-3xl mb-2">✔</div>
            <div className="text-green-700 font-semibold mb-1">Added to Cart!</div>
            <div className="text-gray-600 text-sm mb-2">{product.name} has been added to your cart.</div>
            <button
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow py-8 px-2 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Gallery */}
          <div className="bg-white rounded shadow p-4 flex-1 flex flex-col items-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full max-w-md h-72 object-contain rounded mb-4 border border-green-100"
            />
            <div className="flex gap-2 justify-center">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  className="w-14 h-14 object-contain rounded border border-green-200 bg-gray-50"
                />
              ))}
            </div>
          </div>
          {/* Product Info */}
          <div className="bg-white rounded shadow p-6 flex-1 flex flex-col">
            <h1 className="text-2xl font-bold mb-2 text-green-800">{product.name}</h1>
            <div className="flex items-center mb-2">
              <span className="text-yellow-400 text-lg mr-2">★★★★★</span>
              <span className="text-gray-500 text-sm">(5 review)</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-green-700">₦{Number(product.price).toLocaleString('en-NG')}</span>
              <span className="text-gray-400 line-through text-lg">₦{Number(product.oldPrice || product.price * 1.2).toLocaleString('en-NG')}</span>
            </div>
            <div className="mb-2 font-semibold text-gray-700">Product Description</div>
            <p className="mb-4 text-gray-600">{product.description}</p>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Enter Discount Code"
                className="border rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-green-200"
              />
              <div className="flex items-center border rounded px-2">
                <button
                  className="px-2 py-1 text-lg font-bold text-green-700"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  type="button"
                >-</button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-12 text-center border-0 focus:ring-0"
                />
                <button
                  className="px-2 py-1 text-lg font-bold text-green-700"
                  onClick={() => setQuantity(q => q + 1)}
                  type="button"
                >+</button>
              </div>
            </div>
            <button
              className="cart mt-2 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 text-base font-semibold shadow"
              onClick={handleAddToCart}
            >
              ADD TO CART
            </button>
            <div className="flex gap-4 mt-4">
              <button className="flex items-center gap-2 text-green-700 hover:underline">
                <FaHeart /> Add to wishlist
              </button>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="bg-white rounded shadow mt-8 p-6">
          <div className="flex gap-4 border-b mb-4">
            <button
              className={`px-4 py-2 font-semibold border-b-2 ${tab === 'description' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-600'}`}
              onClick={() => setTab('description')}
            >
              DESCRIPTION
            </button>
            <button
              className={`px-4 py-2 font-semibold border-b-2 ${tab === 'review' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-600'}`}
              onClick={() => setTab('review')}
            >
              REVIEW
            </button>
            <button
              className={`px-4 py-2 font-semibold border-b-2 ${tab === 'guide' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-600'}`}
              onClick={() => setTab('guide')}
            >
              BUYERS GUIDE
            </button>
          </div>
          {tab === 'description' && (
            <div>
              <ul className="mb-4 list-disc pl-6 text-green-700 font-semibold">
                <li>Uniquely leverage existing premium relationships.</li>
                <li>Authoritatively build user friendly relationship.</li>
                <li>Authoritatively envisioner client-focused sustainable channels.</li>
                <li>Intrinsically communicate empowered results.</li>
              </ul>
              <p className="text-gray-700 mb-2">
                Uniquely leverage existing premium relationships client-centric results continual enable diverse alignments for resource-leveling niche markets and authoritative build user friendly relationship rather than intuitive markets.
              </p>
              <p className="text-gray-700">
                Efficiently initiate enable markets and collaborative markets backward-compatible deliverables after resource scenarios. 
              </p>
            </div>
          )}
          {tab === 'review' && (
            <div>
              <p className="text-gray-700">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
          {tab === 'guide' && (
            <div>
              <p className="text-gray-700">Here you can add a buyer's guide or more product info.</p>
            </div>
          )}
        </div>
      </main>
      
    </div>
  );
}

export default ProductDetail;

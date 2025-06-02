import React, { useState, useRef } from 'react';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth } from '../FirebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.length;
  });
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const mobileDropdownRef = useRef();
  const navigate = useNavigate();

  React.useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(cart.length);
    };
    window.addEventListener('cartUpdated', updateCart);
    return () => window.removeEventListener('cartUpdated', updateCart);
  }, []);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen && (isMenuOpen || window.innerWidth >= 768)) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen, isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center p-4 bg-white text-green-500  shadow-md">
      {/* Logo Section */}
      <div className="text-xl font-bold">Logo</div>

      {/* Desktop Navigation Links */}
      <ul
        className={
          `hidden md:flex flex-row items-center space-x-4 p-0 transition-all duration-300`
        }
      >
        <li><a href="/" className="hover:text-green-900">Home</a></li>
        <li><a href="/products" className="hover:text-green-900">Products</a></li>
        <li><a href="/projects" className="hover:text-green-900">Projects</a></li>
        <li><a href="/training" className="hover:text-green-900">Training</a></li>
        <li><a href="/contact" className="hover:text-green-900">Contact</a></li>
        <li><a href="/news" className="hover:text-green-900">News</a></li>
      </ul>

      {/* Account Dropdown or Login/Signup */}
      {user ? (
        <div className="relative flex items-center gap-4 md:flex" ref={dropdownRef}>
          {/* Cart Icon (moved next to account icon) */}
          <div className="relative mr-0">
            <FaShoppingCart
              className="text-2xl cursor-pointer"
              onClick={() => navigate('/cart')}
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{cartCount}</span>
            )}
          </div>
          <button
            className="hidden md:flex items-center gap-1 focus:outline-none"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <FaUserCircle className="text-2xl" />
            <span className="ml-1 font-semibold text-black">My Account</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {/* Only show the dropdown on desktop (md and up) */}
          {dropdownOpen && (
            <div className="hidden md:block absolute right-0 top-full mt-2 w-56 bg-white text-green-900 rounded shadow-lg z-50">
              <div className="px-4 py-2 border-b font-semibold">Hi {user.displayName || 'customer'}</div>
              <button className="w-full text-left px-4 py-2 hover:bg-green-50" onClick={() => { setDropdownOpen(false); navigate('/profile'); }}>My Profile</button>
              <button className="w-full text-left px-4 py-2 hover:bg-green-50" onClick={() => { setDropdownOpen(false); navigate('/orders'); }}>My Orders</button>
              <button className="w-full text-left px-4 py-2 hover:bg-green-50" onClick={() => { setDropdownOpen(false); navigate('/saved-items'); }}>My Saved Items</button>
              
              <button
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 border-t"
                onClick={async () => {
                  await signOut(auth);
                  setDropdownOpen(false);
                  navigate('/');
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          className="hidden md:block bg-green-800 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate('/customer-login')}
        >
          Login / Sign up
        </button>
      )}

      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden" onClick={toggleMenu}>
        <div className="w-6 h-1 bg-black mb-1"></div>
        <div className="w-6 h-1 bg-black mb-1"></div>
        <div className="w-6 h-1 bg-black"></div>
      </div>

      {/* Slide-out Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={toggleMenu}></div>
          {/* Menu Panel */}
          <div className="relative z-50 w-64 h-full bg-white text-green-900 flex flex-col p-6 animate-slide-in-left shadow-lg">
            <button className="self-end mb-6 text-2xl" onClick={toggleMenu}>&times;</button>
            {user ? (
              <>
                <button
                  className="flex items-center gap-2 mb-2 focus:outline-none"
                  onClick={() => setDropdownOpen((open) => !open)}
                >
                  <FaUserCircle className="text-2xl" />
                  <span className="font-semibold">Hi {user.displayName || 'customer'}</span>
                  <svg className={`w-4 h-4 ml-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="mb-4" ref={mobileDropdownRef}>
                    <button className="w-full text-left px-4 py-2 hover:bg-green-50" onClick={() => { setDropdownOpen(false); toggleMenu(); navigate('/profile'); }}>My Profile</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-green-50" onClick={() => { setDropdownOpen(false); toggleMenu(); navigate('/orders'); }}>My Orders</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-green-50" onClick={() => { setDropdownOpen(false); toggleMenu(); navigate('/saved-items'); }}>My Saved Items</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-green-50" onClick={() => { setDropdownOpen(false); toggleMenu(); navigate('/wallet'); }}>My Wallet</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-green-50" onClick={() => { setDropdownOpen(false); toggleMenu(); navigate('/track-order'); }}>Track My Order</button>
                    <button
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 border-t"
                      onClick={async () => {
                        await signOut(auth);
                        setDropdownOpen(false);
                        toggleMenu();
                        navigate('/');
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <button
                  className="w-full mb-4 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700"
                  onClick={() => { navigate('/customer-login'); toggleMenu(); }}
                >
                  Login
                </button>
                <button
                  className="w-full mb-6 bg-green-100 text-green-700 py-2 rounded font-semibold hover:bg-green-200"
                  onClick={() => { navigate('/signup'); toggleMenu(); }}
                >
                  Sign up
                </button>
              </>
            )}
            <ul className="flex flex-col gap-4">
              <li><a href="/" className="hover:text-green-700" onClick={toggleMenu}>Home</a></li>
              <li><a href="/products" className="hover:text-green-700" onClick={toggleMenu}>Products</a></li>
              <li><a href="/projects" className="hover:text-green-700" onClick={toggleMenu}>Projects</a></li>
              <li><a href="/training" className="hover:text-green-700" onClick={toggleMenu}>Training</a></li>
              <li><a href="#contact" className="hover:text-green-700" onClick={toggleMenu}>Contact</a></li>
              <li><a href="/news" className="hover:text-green-700" onClick={toggleMenu}>News</a></li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
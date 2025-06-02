import React, { useState, useEffect } from 'react';

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const handleRemove = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center border-b py-2">
                <div>
                  <span className="font-semibold">{item.name}</span>
                  <span className="ml-2 text-gray-500">₦{item.price}</span>
                </div>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  onClick={() => handleRemove(idx)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-6">
            <span className="font-bold">Total:</span>
            <span className="text-lg font-bold">₦{total}</span>
          </div>
          <button className="w-full mt-6 bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
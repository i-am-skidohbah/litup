import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function CustomerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/customer-dashboard'); // Redirect to dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          {/* Replace with your logo if available */}
          <span className="text-3xl font-bold text-yellow-600">Lightup Nigeria</span>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6 text-green-700">Customer Login</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="block w-full mb-3 p-2 border border-gray-300 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="block w-full mb-4 p-2 border border-gray-300 rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded transition">
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <a href="/signup" className="text-green-700 font-semibold hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default CustomerLogin;
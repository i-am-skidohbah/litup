import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseApp } from '../../FirebaseConfig';

function TrainingRegister() {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const db = getFirestore(firebaseApp);
      // Save to Firestore: lightup/otherDocId/training
      await addDoc(collection(db, 'lightup', 'otherDocId', 'training'), form);
      alert('Registration successful!');
      setForm({ fullname: '', email: '', phone: '', password: '' });
    } catch (error) {
      alert('Failed to register. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-green-50 min-h-screen">
    
      <div className="max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          BECOME A CERTIFIED SOLAR TECHNICIAN AND SOLARPRENEUR
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Image/Brand */}
          <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
            <img
              src="/assets/panel.jpg"
              alt="Solar Training"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-green-600 opacity-80 flex items-center justify-center">
              <span className="text-white text-2xl md:text-3xl font-bold">LightUp Nigeria</span>
            </div>
          </div>
          {/* Right: Registration Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="font-semibold text-gray-700" htmlFor="fullname">Full Name</label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              value={form.fullname}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="border-b-2 border-green-500 outline-none py-2 px-1 mb-2"
              required
            />
            <label className="font-semibold text-gray-700" htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="border-b-2 border-green-500 outline-none py-2 px-1 mb-2"
              required
            />
            <label className="font-semibold text-gray-700" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="border-b-2 border-green-500 outline-none py-2 px-1 mb-2"
              required
            />
            <label className="font-semibold text-gray-700" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="border-b-2 border-green-500 outline-none py-2 px-1 mb-2"
              required
            />
            <button
              type="submit"
              className="mt-4 bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
            <span className="text-xs text-gray-500 mt-2">
              Already have an account? <a href="/login" className="text-green-600 underline">Login</a>
            </span>
          </form>
        </div>
      </div>
      
    </div>
  );
}

export default TrainingRegister;

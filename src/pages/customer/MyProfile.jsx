import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { firebaseApp } from '../../FirebaseConfig';

function MyProfile() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore(firebaseApp);
        // Adjust the path to match your Firestore structure
        const userDocRef = doc(db, 'lightup', 'main', 'customers', user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setForm(f => ({
            ...f,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || user.email || '',
          }));
        } else {
          setForm(f => ({
            ...f,
            email: user.email || '',
          }));
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore(firebaseApp);
        const userDocRef = doc(db, 'lightup', 'main', 'customers', user.uid);
        await updateDoc(userDocRef, {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
        });
        alert('Changes saved!');
      }
    } catch (error) {
      alert('Failed to update profile.');
    }
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-green-50 min-h-screen py-8">
     
      <div className="max-w-6xl mx-auto">
        <nav className="text-sm mb-6 text-gray-600">
          Home &gt; My Account &gt; <span className="text-green-700 font-bold">My Profile</span>
        </nav>
        <h1 className="text-4xl font-bold mb-8 text-center text-green-800">Account Information</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="bg-white rounded-lg shadow w-full md:w-1/3 p-6">
            <ul className="space-y-6">
              <li>
                <div className="font-bold flex items-center gap-2">
                  <span className="text-lg">👤</span> My Profile
                </div>
                <ul className="ml-6 mt-2 space-y-2 text-green-700 font-semibold">
                  <li className="border-l-4 border-green-700 pl-2">Account Information</li>
                  <li className="text-gray-600 font-normal">Delivery Address</li>
                </ul>
              </li>
              <li>
                <div className="font-bold flex items-center gap-2">
                  <span className="text-lg">📦</span> My Orders
                </div>
                <ul className="ml-6 mt-2 space-y-2 text-gray-600 font-normal">
                  <li>Order History</li>
                  <li className="flex items-center gap-2">
                    Pending Ratings
                    <span className="inline-block w-2 h-2 bg-green-700 rounded-full"></span>
                  </li>
                </ul>
              </li>
              <li>
                <div className="font-bold flex items-center gap-2">
                  <span className="text-lg">💳</span> My Wallet
                </div>
                <ul className="ml-6 mt-2 space-y-2 text-gray-600 font-normal">
                  <li>Wallet</li>
                </ul>
              </li>
              <li>
                <div className="font-bold flex items-center gap-2">
                  <span className="text-lg">👥</span> Delete Account
                </div>
                <ul className="ml-6 mt-2 space-y-2 text-gray-600 font-normal">
                  <li>Delete Account</li>
                </ul>
              </li>
            </ul>
          </aside>
          {/* Main Content */}
          <main className="bg-white rounded-lg shadow w-full md:w-2/3 p-8">
            <h2 className="text-xl font-bold mb-6 border-b pb-2 text-green-800">Account Information</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-2 rounded mt-4 hover:bg-green-700 transition"
              >
                Save Changes
              </button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
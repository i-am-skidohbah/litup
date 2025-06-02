import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, firebaseApp } from '../../FirebaseConfig';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

function CustomerSignup() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    address: '',
    consentForMarketing: false,
    dob: '',
    gender: '',
    notes: '',
    phone: '',
    preferredContactMethod: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(userCredential.user, { displayName: `${form.firstName} ${form.lastName}` });

      // Save customer data to Firestore
      const db = getFirestore(firebaseApp);
      await addDoc(collection(db, 'lightup', 'main', 'customers'), {
        uid: userCredential.user.uid,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address,
        consentForMarketing: form.consentForMarketing,
        dob: form.dob,
        gender: form.gender,
        notes: form.notes,
        phone: form.phone,
        preferredContactMethod: form.preferredContactMethod,
        createdAt: new Date(),
      });

      navigate('/'); // Redirect after signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Customer Signup</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="block w-full mb-2 p-2 border"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="block w-full mb-2 p-2 border"
          value={form.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="block w-full mb-2 p-2 border"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="block w-full mb-2 p-2 border"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          className="block w-full mb-2 p-2 border"
          value={form.address}
          onChange={handleChange}
        />
        <input
          type="date"
          name="dob"
          placeholder="Date of Birth"
          className="block w-full mb-2 p-2 border"
          value={form.dob}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="block w-full mb-2 p-2 border"
          value={form.phone}
          onChange={handleChange}
        />
        <select
          name="gender"
          className="block w-full mb-2 p-2 border"
          value={form.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>
        <select
          name="preferredContactMethod"
          className="block w-full mb-2 p-2 border"
          value={form.preferredContactMethod}
          onChange={handleChange}
        >
          <option value="">Preferred Contact Method</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
        </select>
        <textarea
          name="notes"
          placeholder="Notes"
          className="block w-full mb-2 p-2 border"
          value={form.notes}
          onChange={handleChange}
        />
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            name="consentForMarketing"
            checked={form.consentForMarketing}
            onChange={handleChange}
            className="mr-2"
          />
          I agree to receive marketing emails
        </label>
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
          Sign Up
        </button>
      </form>
      <p className="mt-4">
        Already have an account? <a href="/login" className="text-blue-600">Login</a>
      </p>
    </div>
  );
}

export default CustomerSignup;
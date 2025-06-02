import React, { useState } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseApp } from '../FirebaseConfig';

function NewsletterRow() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Basic email validation
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    // Here you would send the email to Firestore or your backend
    // For now, just show a success message
    try {
      const db = getFirestore(firebaseApp);
      await addDoc(collection(db, 'lightup', 'otherDocId', 'newsletter_subscribers'), {
        email,
        subscribedAt: serverTimestamp(),
      });
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      setError('Failed to subscribe. Please try again later.');
    }
  };

  return (
    <div className="mt-8 bg-blue-50 rounded shadow-md p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2 text-blue-900">Subscribe to our Newsletter</h2>
      <p className="mb-4 text-blue-800 text-center max-w-xl">Stay updated with the latest news, projects, and special offers from our solar company. Enter your email below to subscribe!</p>
      {submitted ? (
        <div className="text-green-700 font-semibold">Thank you for subscribing!</div>
      ) : (
        <form className="flex flex-col sm:flex-row items-center w-full max-w-md" onSubmit={handleSubmit}>
          <input
            type="email"
            className="flex-1 px-4 py-2 rounded-l sm:rounded-l-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="mt-2 sm:mt-0 sm:ml-2 px-6 py-2 bg-blue-600 text-white rounded-r sm:rounded-r-md font-semibold hover:bg-blue-700 transition"
          >
            Subscribe
          </button>
        </form>
      )}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}

export default NewsletterRow;

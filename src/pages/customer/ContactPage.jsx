import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseApp } from '../../FirebaseConfig';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

function ContactPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    agree: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const db = getFirestore(firebaseApp);
      // Save to Firestore: lightup/otherDocId/contact
      await addDoc(collection(db, 'lightup', 'otherDocId', 'contact'), form);

      alert('Thank you for contacting us!');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
        agree: false,
      });
    } catch (error) {
      alert('Failed to submit. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-green-50">
      {/* Hero Section */}
      <div className="relative bg-green-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1557683316-9756e5766be9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2835&q=80"
            alt="Contact Background"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg">We're here to help. Reach out to us with any questions.</p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="text-gray-700">
            <h2 className="text-2xl font-bold mb-4">Get in touch with us</h2>
            <p className="mb-6">
              We offer innovative, afforable, and sustainable solar energy solutions to power homes and businesses across Nigeria, reducing energy costs and promoting environmental responsibility with the use of lithium phosphate technology
            </p>
            <div className="mb-4">
              <span className="font-semibold">Support Center 24/7</span>
              <div className="text-green-600 font-bold">WhatsApp: +234 8033058892</div>
            </div>
            <div className="mb-4">
              <span className="font-semibold">Our Location</span>
              <div>Owerri: No 5-6 Samek Road, Allbond House, Ground Floor, off IMSU junction, Imo State, Nigeria <br/>

                Lagos: 97 Okota, Ago Roundabout, Lagos<br/>

                Abuja : ASURI office, No1 Omotayo Eremiye Crescent, Arab road, Kubwa FCT</div>
            </div>
            <div>
              <span className="font-semibold">Office Timings</span>
              <div>09:00 am - 05:00 pm, Monday - Saturday</div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white shadow-md rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-4 text-green-700">Have any Questions? Reach Us</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mt-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="agree"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="agree" className="ml-2 block text-sm text-gray-700">
                  I agree to receiving promotional updates.
                </label>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
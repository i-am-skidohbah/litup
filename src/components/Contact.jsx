import React, { useState } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseApp } from '../FirebaseConfig';

function Contact() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    agree: false,
  });
  const [loading, setLoading] = useState(false);

  const db = getFirestore(firebaseApp);

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
      await addDoc(collection(db, 'contacts'), {
        ...form,
        createdAt: serverTimestamp(),
      });
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
    <section className="w-full bg-gray-900 py-12 px-2 md:px-0">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-stretch">
        {/* Left: Info */}
        <div className="flex-1 flex flex-col justify-center text-white px-4 py-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in touch with us</h2>
          <p className="mb-6 text-green-100">
            We offer innovative, afforable, and sustainable solar energy solutions to power homes and businesses across Nigeria, reducing energy costs and promoting environmental responsibility with the use of lithium phosphate technology.
          </p>
          <div className="mb-4">
            <span className="font-semibold">Support Center 24/7</span>
            <div className="text-2xl font-bold text-green-400 mb-2">WhatsApp: +234 8033058892</div>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Our Location</span>
            <div>Owerri: No 5-6 Samek Road, Allbond House, Ground Floor, off IMSU junction, Imo State, Nigeria<br />

            Lagos: 97 Okota, Ago Roundabout, Lagos <br />

            Abuja : ASURI office, No1 Omotayo Eremiye Crescent, Arab road, Kubwa FCT,<br /></div>
          </div>
          
          <div className="mb-2">
            <span className="font-semibold">Write To Us</span>
            <div>customercare@lightupnigeria.ng</div>
          </div>
          <div>
            <span className="font-semibold">Office Timings</span>
            <div>
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              09:00 am - 05:00 pm<br />
              Monday - Saturday
            </div>
          </div>
        </div>
        {/* Right: Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-center"
        >
          <div className="text-green-600 font-semibold mb-2">Real stories of brighter, greener living.</div>
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-green-900">Have any Questions? Reach Us</h3>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-xs mb-1 text-green-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="e.g John"
                className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs mb-1 text-green-700">Second Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="e.g Doe"
                className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs mb-1 text-green-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="sample@mail.com"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs mb-1 text-green-700">Your Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message Here"
              className="w-full border rounded px-3 py-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-200"
              required
            />
          </div>
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="mr-2 accent-green-600"
            />
            <label className="text-xs text-green-700">I agree to receiving promotional updates.</label>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white font-semibold rounded-full px-8 py-3 text-lg hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'SUBMIT'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
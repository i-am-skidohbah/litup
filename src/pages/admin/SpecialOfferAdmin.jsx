import React, { useEffect, useState } from 'react';
import { getFirestore, doc, setDoc, addDoc, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../../firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function SpecialOfferAdmin() {
  const [offer, setOffer] = useState({ name: '', price: '', details: '', imageUrl: '', expiresAt: '' });
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const db = getFirestore(firebaseApp);
        // Fetch all offers in 'special' collection
        const offersSnap = await getDocs(collection(db, 'special'));
        setOffers(offersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch {}
      setLoading(false);
    };
    fetchOffers();
  }, []);

  const handleChange = e => {
    setOffer({ ...offer, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `special-offers/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setOffer({ ...offer, imageUrl: url });
  };

  const handleEdit = (idx) => {
    setEditIndex(idx);
    setOffer(offers[idx]);
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const db = getFirestore(firebaseApp);
      let offerId = offer.id;
      if (!offerId) {
        // Add new offer
        const docRef = await addDoc(collection(db, 'special'), offer);
        offerId = docRef.id;
      } else {
        // Update existing offer
        await setDoc(doc(db, 'special', offerId), offer);
      }
      setMsg('Offer updated!');
      // Refresh offers list
      const offersSnap = await getDocs(collection(db, 'special'));
      setOffers(offersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setEditIndex(-1);
      setOffer({ name: '', price: '', details: '', imageUrl: '', expiresAt: '' });
    } catch (error) {
      setMsg('Error: ' + (error.message || error));
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Special Offers Admin</h2>
      {msg && <div className="mb-2 text-green-600">{msg}</div>}
      {/* Add New Offer Button */}
      {editIndex === -1 ? (
        <button
          className="bg-green-600 text-white px-4 py-2 rounded mb-4"
          onClick={() => setEditIndex(-2)}
        >
          + Add New Offer
        </button>
      ) : null}
      {/* Offer Form: Show only if adding or editing */}
      {(editIndex > -1 || editIndex === -2) && (
        <form onSubmit={handleSave} className="space-y-4 mb-6">
          <input name="name" value={offer.name} onChange={handleChange} placeholder="Offer Name" className="border p-2 w-full" required />
          <input name="price" type="number" value={offer.price} onChange={handleChange} placeholder="Price (₦)" className="border p-2 w-full" required />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border p-2 w-full"
          />
          <input name="expiresAt" value={offer.expiresAt} onChange={handleChange} placeholder="Expires At (YYYY-MM-DDTHH:mm)" className="border p-2 w-full" type="datetime-local" />
          <textarea name="details" value={offer.details} onChange={handleChange} placeholder="Offer Details" className="border p-2 w-full" required />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={saving}>{saving ? 'Saving...' : (editIndex === -2 ? 'Add Offer' : 'Save Changes')}</button>
            <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => { setEditIndex(-1); setOffer({ name: '', price: '', details: '', imageUrl: '', expiresAt: '' }); }}>Cancel</button>
          </div>
        </form>
      )}
      <h3 className="text-lg font-semibold mt-8 mb-2">All Special Offers</h3>
      <div className="flex overflow-x-auto gap-4 pb-2">
        {offers.map((item, idx) => (
          <div key={item.id} className="min-w-[250px] max-w-xs bg-yellow-50 rounded shadow p-4 flex-shrink-0 flex flex-col items-center">
            {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-contain rounded-full mb-2" />}
            <h4 className="font-bold text-yellow-900 mb-1 line-clamp-1">{item.name}</h4>
            <span className="text-green-700 font-semibold text-sm mb-1">
              ₦{Number(item.price).toLocaleString('en-NG')}
            </span>
            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded mb-1">{item.expiresAt ? item.expiresAt.split('T')[0] : ''}</span>
            <p className="text-xs text-gray-700 mb-2 line-clamp-2">{item.details}</p>
            <button onClick={() => { setEditIndex(idx); setOffer(item); }} className="bg-blue-500 text-white px-3 py-1 rounded text-xs">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpecialOfferAdmin;

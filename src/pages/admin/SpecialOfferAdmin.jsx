import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { firebaseApp } from '../../FirebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function SpecialOfferAdmin() {
  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState({ name: '', price: '', details: '', imageUrl: '', expiresAt: '' });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('Item One');
  const [editOfferId, setEditOfferId] = useState(null);
  const [editOfferData, setEditOfferData] = useState({ name: '', price: '', details: '', imageUrl: '', expiresAt: '' });

  const db = getFirestore(firebaseApp);

  const fetchOffers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'special'));
      const offersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOffers(offersData);
    } catch (error) {
      setErrorMsg('Error fetching offers: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [db]);

  const handleAddOffer = async () => {
    setErrorMsg('');
    if (!newOffer.name || !newOffer.price) return;
    try {
      await addDoc(collection(db, 'special'), newOffer);
      setNewOffer({ name: '', price: '', details: '', imageUrl: '', expiresAt: '' });
      fetchOffers();
    } catch (error) {
      setErrorMsg('Error adding offer: ' + (error.message || error));
    }
  };

  const handleDeleteOffer = async (id) => {
    try {
      await deleteDoc(doc(db, 'special', id));
      setOffers(offers.filter(offer => offer.id !== id));
    } catch (error) {
      setErrorMsg('Error deleting offer: ' + (error.message || error));
    }
  };

  const handleEditOffer = (offer) => {
    setEditOfferId(offer.id);
    setEditOfferData({
      name: offer.name,
      price: offer.price,
      details: offer.details,
      imageUrl: offer.imageUrl || '',
      expiresAt: offer.expiresAt || ''
    });
  };

  const handleUpdateOffer = async (e) => {
    e.preventDefault();
    if (!editOfferId) return;
    try {
      await setDoc(
        doc(db, 'special', editOfferId),
        editOfferData
      );
      setEditOfferId(null);
      setEditOfferData({ name: '', price: '', details: '', imageUrl: '', expiresAt: '' });
      fetchOffers();
    } catch (error) {
      setErrorMsg('Error updating offer: ' + (error.message || error));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `special-offers/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setNewOffer({ ...newOffer, imageUrl: url });
    setEditOfferData({ ...editOfferData, imageUrl: url });
  };

  return (
    <div className="p-4">
      <div className="w-full h-full max-w-3xl mx-auto">
        <div className="flex border-b border-gray-700">
          <button
            className={`flex-1 py-2 ${activeTab === 'Item One' ? 'border-b-2 border-green-500' : ''}`}
            onClick={() => setActiveTab('Item One')}
          >
            Offers
          </button>
          <button
            className={`flex-1 py-2 ${activeTab === 'Item Two' ? 'border-b-2 border-green-500' : ''}`}
            onClick={() => setActiveTab('Item Two')}
          >
            Add Offer
          </button>
          <button
            className={`flex-1 py-2 ${activeTab === 'Item Three' ? 'border-b-2 border-green-500' : ''}`}
            onClick={() => setActiveTab('Item Three')}
          >
            ITEM THREE
          </button>
        </div>
        <div className="p-4">
          {activeTab === 'Item One' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Existing Offers</h3>
              {loading ? (
                <div>Loading...</div>
              ) : offers.length === 0 ? (
                <div>No offers found.</div>
              ) : (
                <ul className="space-y-4">
                  {offers.map(offer => (
                    <li key={offer.id} className="border border-green-500 p-4 mb-4 rounded shadow flex items-start gap-4 bg-white">
                      {offer.imageUrl && (
                        <img
                          src={offer.imageUrl}
                          alt={offer.name}
                          className="w-28 h-20 object-cover rounded mr-4 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1">{offer.name}</h4>
                        <span className="text-green-700 font-semibold block mb-1">₦{offer.price}</span>
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded mb-1">{offer.expiresAt ? offer.expiresAt.split('T')[0] : ''}</span>
                        <p className="text-gray-600 text-sm mb-2">{offer.details}</p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <button
                          onClick={() => handleDeleteOffer(offer.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded flex items-center justify-center"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditOffer(offer)}
                          className="koko2 bg-blue-500 text-white px-3 py-1 rounded flex items-center justify-center"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 7.232l1.536 1.536M9 13l6-6 3 3-6 6H9v-3z" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {/* Edit Offer Modal/Form */}
              {editOfferId && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <form
                    className="bg-white p-8 rounded shadow max-w-xl w-full"
                    onSubmit={handleUpdateOffer}
                  >
                    <h2 className="text-xl font-bold mb-4">Edit Offer</h2>
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Name</label>
                      <input
                        type="text"
                        value={editOfferData.name}
                        onChange={e => setEditOfferData({ ...editOfferData, name: e.target.value })}
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Price (₦)</label>
                      <input
                        type="number"
                        value={editOfferData.price}
                        onChange={e => setEditOfferData({ ...editOfferData, price: e.target.value })}
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Image URL</label>
                      <input
                        type="text"
                        value={editOfferData.imageUrl}
                        onChange={e => setEditOfferData({ ...editOfferData, imageUrl: e.target.value })}
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Expires At</label>
                      <input
                        type="datetime-local"
                        value={editOfferData.expiresAt}
                        onChange={e => setEditOfferData({ ...editOfferData, expiresAt: e.target.value })}
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Details</label>
                      <textarea
                        value={editOfferData.details}
                        onChange={e => setEditOfferData({ ...editOfferData, details: e.target.value })}
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="bg-gray-400 text-white px-6 py-2 rounded font-semibold"
                        onClick={() => setEditOfferId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
          {activeTab === 'Item Two' && (
            <form
              className="bg-white p-8 rounded shadow max-w-xl mx-auto"
              onSubmit={e => {
                e.preventDefault();
                handleAddOffer();
              }}
            >
              <h2 className="text-2xl font-bold mb-4">Add Offer Form</h2>
              <p className="mb-6 text-gray-700">Please fill out this form to add a new offer.</p>
              {errorMsg && <div className="text-red-500 mb-2">{errorMsg}</div>}
              <div className="mb-4">
                <label className="block font-semibold mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Offer Name"
                  value={newOffer.name}
                  onChange={e => setNewOffer({ ...newOffer, name: e.target.value })}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Price (₦)</label>
                <input
                  type="number"
                  placeholder="Price"
                  value={newOffer.price}
                  onChange={e => setNewOffer({ ...newOffer, price: e.target.value })}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="border p-2 w-full rounded"
                />
                {newOffer.imageUrl && (
                  <img src={newOffer.imageUrl} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded" />
                )}
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Expires At</label>
                <input
                  type="datetime-local"
                  placeholder="Expires At"
                  value={newOffer.expiresAt}
                  onChange={e => setNewOffer({ ...newOffer, expiresAt: e.target.value })}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Details</label>
                <textarea
                  placeholder="Offer Details"
                  value={newOffer.details}
                  onChange={e => setNewOffer({ ...newOffer, details: e.target.value })}
                  className="border p-2 w-full rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded font-semibold mt-2 w-full"
              >
                Add Offer
              </button>
            </form>
          )}
          {activeTab === 'Item Three' && (
            <div>Item Three Content</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpecialOfferAdmin;

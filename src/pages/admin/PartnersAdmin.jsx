import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { firebaseApp } from '../../FirebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function PartnersAdmin() {
  const [partners, setPartners] = useState([]);
  const [logoUrl, setLogoUrl] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPartners = async () => {
    const db = getFirestore(firebaseApp);
    const partnersCol = collection(db, 'lightup', 'someDocId',  'partners');
    const partnersSnap = await getDocs(partnersCol);
    setPartners(partnersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (!logoUrl) {
      setError('Logo URL is required.');
      return;
    }
    setLoading(true);
    try {
      const db = getFirestore(firebaseApp);
      await addDoc(collection(db, 'lightup', 'someDocId',  'partners'), {
        logoUrl,
        name,
      });
      setLogoUrl('');
      setName('');
      fetchPartners();
    } catch (err) {
      setError('Failed to add partner.');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const db = getFirestore(firebaseApp);
      await deleteDoc(doc(db, 'lightup', 'someDocId',  'partners', id));
      fetchPartners();
    } catch (err) {
      setError('Failed to delete partner.');
    }
    setLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `partners/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setLogoUrl(url);
  };

  return (
    <div className="bg-white shadow-md rounded p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Manage Partners</h2>
      <form className="flex flex-col sm:flex-row gap-2 mb-6" onSubmit={handleAdd}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="flex-1 px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Partner Name (optional)"
          className="flex-1 px-3 py-2 border rounded"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          Add Partner
        </button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="flex flex-wrap gap-4">
        {partners.map(partner => (
          <div key={partner.id} className="flex flex-col items-center border rounded p-2 w-32">
            {partner.logoUrl && (
              <img src={partner.logoUrl} alt={partner.name || 'Partner Logo'} className="max-h-16 max-w-full object-contain mb-2" />
            )}
            <span className="text-xs text-center mb-2">{partner.name}</span>
            <button
              onClick={() => handleDelete(partner.id)}
              className="text-red-600 text-xs hover:underline"
              disabled={loading}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PartnersAdmin;

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from '../../FirebaseConfig';

function NewsAdmin() {
  const [news, setNews] = useState([]);
  const [newNews, setNewNews] = useState({ title: '', summary: '', imageUrl: '', date: '' });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const db = getFirestore(firebaseApp);

  const fetchNews = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'lightup', 'someDocId', 'news'));
      const newsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNews(newsData);
    } catch (error) {
      setErrorMsg('Error fetching news: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [db]);

  const handleAddNews = async () => {
    setErrorMsg('');
    if (!newNews.title || !newNews.summary) return;
    try {
      await addDoc(collection(db, 'lightup', 'someDocId', 'news'), { ...newNews, date: newNews.date || new Date().toISOString().split('T')[0] });
      setNewNews({ title: '', summary: '', imageUrl: '', date: '' });
      fetchNews();
    } catch (error) {
      setErrorMsg('Error adding news: ' + (error.message || error));
    }
  };

  const handleDeleteNews = async (id) => {
    try {
      await deleteDoc(doc(db, 'lightup', 'someDocId', 'news', id));
      setNews(news.filter(item => item.id !== id));
    } catch (error) {
      setErrorMsg('Error deleting news: ' + (error.message || error));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `lightup/news/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setNewNews({ ...newNews, imageUrl: url });
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage News</h2>
      {/* Add New News */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Add News</h3>
        {errorMsg && <div className="text-red-500 mb-2">{errorMsg}</div>}
        <input
          type="text"
          placeholder="Title"
          value={newNews.title}
          onChange={e => setNewNews({ ...newNews, title: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="date"
          placeholder="Date (optional)"
          value={newNews.date}
          onChange={e => setNewNews({ ...newNews, date: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <textarea
          placeholder="Summary"
          value={newNews.summary}
          onChange={e => setNewNews({ ...newNews, summary: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={handleAddNews}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add News
        </button>
      </div>
      {/* List of News */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Existing News</h3>
        {loading ? (
          <div>Loading...</div>
        ) : news.length === 0 ? (
          <div>No news found.</div>
        ) : (
          <ul>
            {news.map(item => (
              <li key={item.id} className="border p-4 mb-4 rounded shadow flex items-center justify-between">
                <div>
                  <h4 className="font-bold">{item.title}</h4>
                  <span className="text-gray-700 text-sm">{item.date}</span>
                  {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-20 h-12 object-cover mt-2 rounded" />}
                  <p className="text-gray-700 text-sm mt-1">{item.summary}</p>
                </div>
                <button
                  onClick={() => handleDeleteNews(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NewsAdmin;

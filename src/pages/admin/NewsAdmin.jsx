import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { firebaseApp } from '../../FirebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function NewsAdmin() {
  const [news, setNews] = useState([]);
  const [newNews, setNewNews] = useState({ title: '', summary: '', imageUrl: '', date: '' });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('Item One');
  const [editNewsId, setEditNewsId] = useState(null);
  const [editNewsData, setEditNewsData] = useState({ title: '', summary: '', imageUrl: '', date: '' });

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

  const handleEditNews = (item) => {
    setEditNewsId(item.id);
    setEditNewsData({
      title: item.title,
      summary: item.summary,
      imageUrl: item.imageUrl || '',
      date: item.date || ''
    });
  };

  const handleUpdateNews = async (e) => {
    e.preventDefault();
    if (!editNewsId) return;
    try {
      await updateDoc(
        doc(db, 'lightup', 'someDocId', 'news', editNewsId),
        editNewsData
      );
      setEditNewsId(null);
      setEditNewsData({ title: '', summary: '', imageUrl: '', date: '' });
      fetchNews();
    } catch (error) {
      setErrorMsg('Error updating news: ' + (error.message || error));
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
    <div className="p-4">
      <div className="w-full h-full max-w-3xl mx-auto">
        <div className="flex border-b border-gray-700">
          <button
            className={`flex-1 py-2 ${activeTab === 'Item One' ? 'border-b-2 border-green-500' : ''}`}
            onClick={() => setActiveTab('Item One')}
          >
            News
          </button>
          <button
            className={`flex-1 py-2 ${activeTab === 'Item Two' ? 'border-b-2 border-green-500' : ''}`}
            onClick={() => setActiveTab('Item Two')}
          >
            Add News
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
              <h3 className="text-lg font-semibold mb-2">Existing News</h3>
              {loading ? (
                <div>Loading...</div>
              ) : news.length === 0 ? (
                <div>No news found.</div>
              ) : (
                <ul className="space-y-4">
                  {news.map(item => (
                    <li key={item.id} className="border border-green-500 p-4 mb-4 rounded shadow flex items-start gap-4 bg-white">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-28 h-20 object-cover rounded mr-4 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                        <span className="text-gray-700 text-sm block mb-1">{item.date}</span>
                        <p className="text-gray-600 text-sm mb-2">{item.summary}</p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <button
                          onClick={() => handleDeleteNews(item.id)}
                          className="koko bg-red-500 text-white px-3 py-1 rounded flex items-center justify-center"
                          title="Delete"
                        >
                          {/* Trash icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditNews(item)}
                          className="koko bg-blue-500 text-white px-3 py-1 rounded flex items-center justify-center"
                          title="Edit"
                        >
                          {/* Pencil/edit icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 7.232l1.536 1.536M9 13l6-6 3 3-6 6H9v-3z" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {/* Edit News Modal/Form */}
              {editNewsId && (
                <div className="fixed inset-0 bg-green-500/50 flex items-center justify-center z-50">
                  <form
                    className="bg-white p-8 rounded shadow max-w-xl w-full"
                    onSubmit={handleUpdateNews}
                  >
                    <h2 className="text-xl font-bold mb-4">Edit News</h2>
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Title</label>
                      <input
                        type="text"
                        value={editNewsData.title}
                        onChange={e => setEditNewsData({ ...editNewsData, title: e.target.value })}
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Date</label>
                      <input
                        type="date"
                        value={editNewsData.date}
                        onChange={e => setEditNewsData({ ...editNewsData, date: e.target.value })}
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Image URL</label>
                      <input
                        type="text"
                        value={editNewsData.imageUrl}
                        onChange={e => setEditNewsData({ ...editNewsData, imageUrl: e.target.value })}
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Summary</label>
                      <textarea
                        value={editNewsData.summary}
                        onChange={e => setEditNewsData({ ...editNewsData, summary: e.target.value })}
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded font-semibold"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="bg-gray-400 text-white px-6 py-2 rounded font-semibold"
                        onClick={() => setEditNewsId(null)}
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
                handleAddNews();
              }}
            >
              <h2 className="text-2xl font-bold mb-4">Add News Form</h2>
              <p className="mb-6 text-gray-700">Please fill out this form to add a news item.</p>
              {errorMsg && <div className="text-red-500 mb-2">{errorMsg}</div>}
              <div className="mb-4">
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  value={newNews.title}
                  onChange={e => setNewNews({ ...newNews, title: e.target.value })}
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
                {newNews.imageUrl && (
                  <img src={newNews.imageUrl} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded" />
                )}
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Date (optional)</label>
                <input
                  type="date"
                  placeholder="Date (optional)"
                  value={newNews.date}
                  onChange={e => setNewNews({ ...newNews, date: e.target.value })}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Summary</label>
                <textarea
                  placeholder="Summary"
                  value={newNews.summary}
                  onChange={e => setNewNews({ ...newNews, summary: e.target.value })}
                  className="border p-2 w-full rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded font-semibold mt-2 w-full"
              >
                Add News
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

export default NewsAdmin;

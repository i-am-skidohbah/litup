import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from '../../FirebaseConfig';
import Slideshow from '../../components/Slideshow';

function SlideshowManager() {
  const [slides, setSlides] = useState([]);
  const [newSlide, setNewSlide] = useState({ imageUrl: '', title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('Item One');
  const [editSlideId, setEditSlideId] = useState(null);
  const [editSlideData, setEditSlideData] = useState({ imageUrl: '', title: '', description: '' });

  const db = getFirestore(firebaseApp);

  const fetchSlides = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'lightup', 'someDocId', 'slideshow'));
      const slidesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSlides(slidesData);
    } catch (error) {
      setErrorMsg('Error fetching slides: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, [db]);

  const handleAddSlide = async () => {
    setErrorMsg('');
    if (!newSlide.title || !newSlide.imageUrl) return;
    try {
      await addDoc(collection(db, 'lightup', 'someDocId', 'slideshow'), newSlide);
      setNewSlide({ imageUrl: '', title: '', description: '' });
      fetchSlides();
    } catch (error) {
      setErrorMsg('Error adding slide: ' + (error.message || error));
    }
  };

  const handleDeleteSlide = async (id) => {
    try {
      await deleteDoc(doc(db, 'lightup', 'someDocId', 'slideshow', id));
      setSlides(slides.filter(slide => slide.id !== id));
    } catch (error) {
      setErrorMsg('Error deleting slide: ' + (error.message || error));
    }
  };

  const handleEditSlide = (slide) => {
    setEditSlideId(slide.id);
    setEditSlideData({
      imageUrl: slide.imageUrl || '',
      title: slide.title || '',
      description: slide.description || ''
    });
  };

  const handleUpdateSlide = async (e) => {
    e.preventDefault();
    if (!editSlideId) return;
    try {
      await updateDoc(
        doc(db, 'lightup', 'someDocId', 'slideshow', editSlideId),
        editSlideData
      );
      setEditSlideId(null);
      setEditSlideData({ imageUrl: '', title: '', description: '' });
      fetchSlides();
    } catch (error) {
      setErrorMsg('Error updating slide: ' + (error.message || error));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `lightup/slideshow/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setNewSlide({ ...newSlide, imageUrl: url });
    setEditSlideData({ ...editSlideData, imageUrl: url });
  };

  return (
    <div className="p-4">
      <div className="w-full h-full max-w-3xl mx-auto">
        <div className="flex border-b border-gray-700">
          <button
            className={`flex-1 py-2 ${activeTab === 'Item One' ? 'border-b-2 border-green-500' : ''}`}
            onClick={() => setActiveTab('Item One')}
          >
            Slides
          </button>
          <button
            className={`flex-1 py-2 ${activeTab === 'Item Two' ? 'border-b-2 border-green-500' : ''}`}
            onClick={() => setActiveTab('Item Two')}
          >
            Add Slide
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
              <h3 className="text-lg font-semibold mb-2">Existing Slides</h3>
              {loading ? (
                <div>Loading...</div>
              ) : slides.length === 0 ? (
                <div>No slides found.</div>
              ) : (
                <ul className="space-y-4">
                  {slides.map(slide => (
                    <li key={slide.id} className="border border-green-500 p-4 mb-4 rounded shadow flex items-start gap-4 bg-white">
                      {slide.imageUrl && (
                        <img
                          src={slide.imageUrl}
                          alt={slide.title}
                          className="w-28 h-20 object-cover rounded mr-4 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1">{slide.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{slide.description}</p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <button
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="koko bg-red-500 text-white px-3 py-1 rounded flex items-center justify-center"
                          title="Delete"
                        >
                          {/* Trash icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditSlide(slide)}
                          className="koko bg-blue-500 text-white px-3 py-1 rounded flex items-center justify-center"
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
              {/* Edit Slide Modal/Form */}
              {editSlideId && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <form
                    className="bg-white p-8 rounded shadow max-w-xl w-full"
                    onSubmit={handleUpdateSlide}
                  >
                    <h2 className="text-xl font-bold mb-4">Edit Slide</h2>
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Title</label>
                      <input
                        type="text"
                        value={editSlideData.title}
                        onChange={e => setEditSlideData({ ...editSlideData, title: e.target.value })}
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Image URL</label>
                      <input
                        type="text"
                        value={editSlideData.imageUrl}
                        onChange={e => setEditSlideData({ ...editSlideData, imageUrl: e.target.value })}
                        className="border p-2 w-full rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Description</label>
                      <textarea
                        value={editSlideData.description}
                        onChange={e => setEditSlideData({ ...editSlideData, description: e.target.value })}
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
                        onClick={() => setEditSlideId(null)}
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
                handleAddSlide();
              }}
            >
              <h2 className="text-2xl font-bold mb-4">Add Slide Form</h2>
              <p className="mb-6 text-gray-700">Please fill out this form to add a new slide.</p>
              {errorMsg && <div className="text-red-500 mb-2">{errorMsg}</div>}
              <div className="mb-4">
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  value={newSlide.title}
                  onChange={e => setNewSlide({ ...newSlide, title: e.target.value })}
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
                {newSlide.imageUrl && (
                  <img src={newSlide.imageUrl} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded" />
                )}
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  placeholder="Description"
                  value={newSlide.description}
                  onChange={e => setNewSlide({ ...newSlide, description: e.target.value })}
                  className="border p-2 w-full rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded font-semibold mt-2 w-full"
              >
                Add Slide
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

export default SlideshowManager;
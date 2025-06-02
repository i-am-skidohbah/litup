import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from '../../FirebaseConfig';
import Slideshow from '../../components/Slideshow'; // Import the Slideshow component

function SlideshowManager() {
  const [slides, setSlides] = useState([]);
  const [newSlide, setNewSlide] = useState({ imageUrl: '', title: '', description: '' });
  const [editIndex, setEditIndex] = useState(-1);

  const db = getFirestore(firebaseApp);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'lightup', 'someDocId', 'slideshow'));
        const slidesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSlides(slidesData);
      } catch (error) {
        console.error('Error fetching slides:', error);
      }
    };

    fetchSlides();
  }, [db]);

  const handleAddSlide = async () => {
    try {
      await addDoc(collection(db, 'lightup', 'someDocId', 'slideshow'), newSlide);
      setSlides([...slides, newSlide]);
      setNewSlide({ imageUrl: '', title: '', description: '' });
    } catch (error) {
      console.error('Error adding slide:', error);
    }
  };

  const handleDeleteSlide = async (id) => {
    try {
      await deleteDoc(doc(db, 'lightup', 'someDocId', 'slideshow', id));
      setSlides(slides.filter((slide) => slide.id !== id));
    } catch (error) {
      console.error('Error deleting slide:', error);
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
  };

  const handleEdit = (idx) => {
    setEditIndex(idx);
    setNewSlide(slides[idx]);
  };

  const handleSave = async () => {
    try {
      const slide = newSlide;
      if (editIndex > -1 && slide.id) {
        // Update existing slide
        await setDoc(doc(db, 'lightup', 'someDocId', 'slideshow', slide.id), slide);
        const updatedSlides = [...slides];
        updatedSlides[editIndex] = slide;
        setSlides(updatedSlides);
      } else {
        // Add new slide
        await addDoc(collection(db, 'lightup', 'someDocId', 'slideshow'), slide);
        setSlides([...slides, slide]);
      }
      setNewSlide({ imageUrl: '', title: '', description: '' });
      setEditIndex(-1);
    } catch (error) {
      console.error('Error saving slide:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Slideshow Manager</h1>

      {/* Add New Offer */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">{editIndex > -1 ? 'Edit Slide' : 'Add New Slide'}</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Title"
          value={newSlide.title}
          onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <textarea
          placeholder="Description"
          value={newSlide.description}
          onChange={(e) => setNewSlide({ ...newSlide, description: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          {editIndex > -1 ? 'Save Changes' : 'Add Slide'}
        </button>
        {editIndex > -1 && (
          <button
            onClick={() => { setEditIndex(-1); setNewSlide({ imageUrl: '', title: '', description: '' }); }}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Slideshow of Offers */}
      <div>
        <h2 className="text-xl font-bold mb-2">Existing Offers</h2>
        {slides.length === 0 ? (
          <div className="text-gray-500">No offers yet.</div>
        ) : (
          <div className="relative w-full max-w-xl mx-auto">
            <Slideshow slides={slides} onDelete={handleDeleteSlide} />
            <div className="flex gap-2 mt-2 justify-center">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => handleEdit(idx)}
                  className="bg-yellow-300 text-yellow-900 px-3 py-1 rounded text-xs border border-yellow-400 hover:bg-yellow-400"
                >
                  Edit {slide.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SlideshowManager;
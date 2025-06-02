import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebaseApp } from '../firebaseConfig';
import Navbar from './Navbar';
import Footer from './Footer';

function SlideshowDetail() {
  const { id } = useParams();
  const [slide, setSlide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlide = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const docRef = doc(db, 'slideshow', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSlide({ id: docSnap.id, ...docSnap.data() });
        } else {
          setSlide(null);
        }
      } catch {
        setSlide(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSlide();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!slide) return <div className="p-8">Slide not found.</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-8 max-w-2xl mx-auto">
        <div className="bg-white rounded shadow p-6 flex flex-col items-center">
          {slide.imageUrl && (
            <img src={slide.imageUrl} alt={slide.title} className="w-full h-64 object-cover rounded mb-4" />
          )}
          <h1 className="text-2xl font-bold mb-2">{slide.title}</h1>
          <p className="mb-4 text-gray-700">{slide.description}</p>
          {slide.link && (
            <a
              href={slide.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition mt-2"
            >
              Visit Link
            </a>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SlideshowDetail;

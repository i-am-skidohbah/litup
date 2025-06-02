import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../FirebaseConfig'; // Adjust the path to your Firebase config file

function Slideshow({ slides: slidesProp, onDelete }) {
  const [slides, setSlides] = useState(slidesProp || []);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(!slidesProp);

  useEffect(() => {
    if (!slidesProp) {
      // Fetch slides from Firestore if not provided as prop
      const fetchSlides = async () => {
        try {
          const db = getFirestore(firebaseApp);
          const querySnapshot = await getDocs(collection(db, 'lightup', 'someDocId', 'slideshow'));
          const slidesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setSlides(slidesData);
        } catch (error) {
          setSlides([]);
        } finally {
          setLoading(false);
        }
      };
      fetchSlides();
    } else {
      setSlides(slidesProp);
      setLoading(false);
    }
  }, [slidesProp]);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides]);

  if (loading) return <div className="w-full h-64 flex items-center justify-center">Loading slideshow...</div>;
  if (!slides || slides.length === 0) return null;

  const handlePrev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  const slide = slides[currentSlide];

  return (
    <div className="w-full h-80 relative">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/assets/panel.jpg"
          alt="background"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.85)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-green-500 opacity-80"></div>
      </div>
      <div className="relative z-10 w-full h-80 flex flex-row items-center justify-between px-4 md:px-16">
        {/* Text Column */}
        <div className="w-1/2 flex flex-col justify-center h-full pl-2 md:pl-8">
          <h2 className="text-base md:text-xl font-bold uppercase text-black mb-1">{slide.title1 || slide.title}</h2>
          <h1 className="text-xl md:text-3xl font-extrabold text-red-600 mb-2">{slide.title2 || ''}</h1>
          <div className="mb-2">
            <p className="md:text-lg text-base capitalize leading-normal py-1">{slide.details || slide.description}</p>
            {(slide.qualities || []).map((e, index) => (
              <p key={index} className="md:text-lg text-base leading-normal">{e}</p>
            ))}
          </div>
          {slide.price && (
            <h3 className="text-black text-base md:text-xl py-1 font-semibold">{slide.price}</h3>
          )}
          <button
            className="mt-3 bg-white text-black font-bold px-4 py-2 rounded shadow hover:bg-gray-100 transition w-fit"
            onClick={() => window.location.href = `/slideshow/${slide.id}`}
          >
            Learn More
          </button>
        </div>
        {/* Image Column */}
        <div className="w-1/2 flex items-center justify-end h-full pr-2 md:pr-8">
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="object-contain h-64 md:h-72 drop-shadow-xl"
            style={{ maxWidth: '80%' }}
          />
        </div>
      </div>
      {/* Navigation Arrows */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-4 md:px-16 z-20">
        <button onClick={handlePrev} className="bg-green-500 hover:bg-green-700 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shadow-lg text-lg md:text-xl">&#8592;</button>
        <button onClick={handleNext} className="bg-green-500 hover:bg-green-700 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shadow-lg text-lg md:text-xl">&#8594;</button>
      </div>
      {/* Dots Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <span key={idx} className={`w-2 h-2 md:w-3 md:h-3 rounded-full border-2 border-green-500 ${idx === currentSlide ? 'bg-green-500' : 'bg-white'}`}></span>
        ))}
      </div>
    </div>
  );
}

export default Slideshow;
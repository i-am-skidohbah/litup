import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../firebaseConfig';

function SpecialOfferRow() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const offersSnap = await getDocs(collection(db, 'special'));
        const offersArr = offersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOffers(offersArr);
      } catch (error) {
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // Slideshow interval
  useEffect(() => {
    if (offers.length < 2) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [offers]);

  // Countdown for current offer
  useEffect(() => {
    if (!offers.length || !offers[current]?.expiresAt) return;
    const interval = setInterval(() => {
      const now = new Date();
      const expires = new Date(offers[current].expiresAt);
      const diff = expires - now;
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft('Expired');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [offers, current]);

  if (loading) return <div className="mt-8">Loading special offers...</div>;
  if (!offers.length) return null;
  const offer = offers[current];

  return (
    <div class="grid grid-cols-6 gap-4">  <div class="col-span-4 col-start-2 ...">
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-yellow-900 tracking-wide uppercase">Special Offers</h2>
      <div className="flex flex-row md:flex-row bg-yellow-100 rounded-lg shadow-lg overflow-hidden items-center relative">
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-yellow-300 text-yellow-900 rounded-full w-8 h-8 flex items-center justify-center z-10"
          onClick={() => setCurrent((prev) => (prev - 1 + offers.length) % offers.length)}
          aria-label="Previous Offer"
        >&#8592;</button>
        <div className="w-1/3 flex items-center justify-center  p-2 md:p-4">
          {offer.imageUrl && (
            <img src={offer.imageUrl} alt={offer.name} className="object-contain w-20 h-20 md:w-40 md:h-40 rounded-full shadow-md border border-green-300 bg-white" />
          )}
        </div>
        <div className="w-2/3 p-2 md:p-8 flex flex-col justify-center">
          <div className="flex flex-col gap-1 md:gap-4">
            <h2 className="text-base md:text-2xl font-bold text-yellow-900 mb-1 md:mb-2 tracking-wide line-clamp-1">{offer.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mb-1 md:mb-2">
              <span className="text-xs md:text-xl font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">₦{Number(offer.price).toLocaleString('en-NG')}</span>
              <span className="bg-red-500 text-white px-2 md:px-3 py-1 rounded text-xs md:text-sm font-bold shadow">{timeLeft || '...'}</span>
            </div>
            <p className="text-gray-800 text-xs md:text-base leading-relaxed bg-yellow-50 rounded p-1 md:p-3 shadow-inner line-clamp-2 md:line-clamp-none">
              {offer.details}
            </p>
          </div>
        </div>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-300 text-yellow-900 rounded-full w-8 h-8 flex items-center justify-center z-10"
          onClick={() => setCurrent((prev) => (prev + 1) % offers.length)}
          aria-label="Next Offer"
        >&#8594;</button>
      </div>
      <div className="flex justify-center gap-1 mt-2">
        {offers.map((_, idx) => (
          <span key={idx} className={`w-2 h-2 rounded-full ${idx === current ? 'bg-yellow-700' : 'bg-yellow-300'}`}></span>
        ))}
      </div>
    </div>
    </div>
    </div>
  );
}

export default SpecialOfferRow;

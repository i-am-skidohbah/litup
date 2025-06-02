import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../FirebaseConfig';

function PartnersRow() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true); // <-- Add loading state

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const partnersCol = collection(db, 'lightup', 'someDocId', 'partners');
        const partnersSnap = await getDocs(partnersCol);
        setPartners(partnersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch {
        setPartners([]);
      } finally {
        setLoading(false); // <-- Set loading to false after fetch
      }
    };
    fetchPartners();
  }, []);

  if (loading) return <div className="p-8">Loading partners...</div>;
  if (!partners.length) return null;

  // Split partners into two rows for better visibility on mobile
  const mid = Math.ceil(partners.length / 2);
  const firstRow = partners.slice(0, mid);
  const secondRow = partners.slice(mid);

  return (
    <div className="mt-8 bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Our Partners</h2>
      <div className="space-y-2">
        {[firstRow, secondRow].map((row, idx) => (
          <div
            key={idx}
            className="flex justify-center overflow-x-auto gap-2 items-center scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-transparent px-0 md:flex-wrap md:justify-center md:overflow-x-visible"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {row.map(partner => (
              <div
                key={partner.id}
                className="flex-shrink-0 flex items-center justify-center h-8 w-12 bg-gray-50 rounded shadow-sm md:h-12 md:w-20 mx-0 md:mx-1 cursor-pointer"
              >
                {partner.logoUrl && (
                  <img
                    src={partner.logoUrl}
                    alt={partner.name || 'Partner Logo'}
                    className="max-h-6 max-w-[32px] object-contain md:max-h-10 md:max-w-[50px] transition-transform duration-200 md:hover:scale-125 md:active:scale-125"
                    style={{ touchAction: 'manipulation' }}
                    onTouchStart={e => e.currentTarget.style.transform = 'scale(1.25)'}
                    onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
                    onTouchCancel={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PartnersRow;

import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../FirebaseConfig';

function NewsRow() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const DOC_ID = "someDocId";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const querySnapshot = await getDocs(collection(db, 'lightup', DOC_ID, 'news'));
        const newsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNews(newsData.slice(0, 3)); // Show up to 3 news items
      } catch (error) {
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return <div className="mt-8">Loading news...</div>;
  if (news.length === 0) return <div className="mt-8">No news found.</div>;

  return (
    <div className="mt-8 bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <span className="text-red-500 font-semibold text-sm block mb-1">Blogs</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-0">Our Incredible Insights</h2>
          </div>
          <a
            href="/news"
            className="inline-block px-6 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition mt-4 sm:mt-0"
          >
            VIEW MORE
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow border border-green-100 p-4 flex flex-col transition hover:shadow-lg"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-60 object-cover rounded-xl mb-4"
                />
              )}
              <div className="flex items-center text-green-700 text-xs mb-2 gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{item.date}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
              <p className="mb-4 text-gray-700 text-sm">{item.summary}</p>
              <div className="flex justify-end">
                <a
                  href={`/news/${DOC_ID}/${item.id}`}
                  className="text-red-500 font-semibold hover:underline text-sm"
                >
                  Read More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewsRow;

import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../../FirebaseConfig';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaFilter, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const DOC_ID = "someDocId";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const querySnapshot = await getDocs(collection(db, 'lightup', 'someDocId', 'news'));
        const newsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNews(newsData);
      } catch (error) {
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Filter news by search
  const filteredNews = news.filter(
    item =>
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.summary?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredNews.length / postsPerPage);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      <main className="flex-grow p-4 max-w-7xl mx-auto">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 border px-4 py-2 rounded text-green-700 border-green-200 hover:bg-green-50 font-semibold">
              <FaFilter className="text-green-600" />
              Filters
            </button>
            <span className="text-gray-700">
              Showing {(filteredNews.length === 0 ? 0 : (currentPage - 1) * postsPerPage + 1)
                .toString()
                .padStart(2, '0')}
              {' '}
              -{' '}
              {Math.min(currentPage * postsPerPage, filteredNews.length)
                .toString()
                .padStart(2, '0')}
              {' '}
              of {filteredNews.length} Results
            </span>
          </div>
          <form
            className="flex items-center border rounded px-2 py-1 bg-white"
            onSubmit={e => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Search Here..."
              className="outline-none px-2 py-1 w-40 sm:w-56"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <FaSearch className="text-green-600 ml-2" />
          </form>
        </div>

        {/* News Grid */}
        {loading ? (
          <div>Loading news...</div>
        ) : filteredNews.length === 0 ? (
          <div>No news found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedNews.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-4 flex flex-col border border-green-100 hover:shadow-lg transition"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-56 object-cover rounded mb-4"
                  />
                )}
                <div className="flex items-center text-green-700 text-sm mb-2 gap-2">
                  <FaCalendarAlt className="inline mr-1" />
                  <span>{item.date}</span>
                </div>
                <h2 className="text-lg font-bold mb-2 text-green-900">{item.title}</h2>
                <p className="mb-2 text-gray-700">{item.summary}</p>
                <div className="flex justify-end">
                  <Link
                    to={`/news/${DOC_ID}/${item.id}`}  
                    className="text-green-700 font-semibold hover:underline text-sm"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              className="p-2 rounded border border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === i + 1
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-green-200 text-green-700 hover:bg-green-50'
                } font-semibold`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="p-2 rounded border border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </main>
      
    </div>
  );
}

export default News;

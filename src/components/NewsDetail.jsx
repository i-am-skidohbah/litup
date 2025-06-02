import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../FirebaseConfig';
import Navbar from './Navbar';
import Footer from './Footer';

function NewsDetail() {
  const { someDocId, id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const docRef = doc(db, 'lightup', someDocId, 'news', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNewsItem({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('News item not found.');
        }
      } catch (err) {
        setError('Failed to fetch news item.');
      } finally {
        setLoading(false);
      }
    };
    fetchNewsItem();
  }, [someDocId, id]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const newsCol = collection(db, 'lightup', someDocId, 'news');
        const newsSnap = await getDocs(newsCol);
        const posts = newsSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(post => post.id !== id)
          .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
          .slice(0, 3);
        setRecentPosts(posts);
      } catch {
        setRecentPosts([]);
      }
    };
    fetchRecentPosts();
  }, [someDocId, id]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
     
      <main className="flex-grow p-4 max-w-4xl mx-auto w-full">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="mt-8 text-red-600">{error}</div>
        ) : !newsItem ? (
          <div>News not found.</div>
        ) : (
          <div>
            <Link to="/news" className="text-green-700 hover:underline mb-4 inline-block text-sm">
              &larr; Back to News
            </Link>
            <div className="mb-8">
              <div className="text-xs text-gray-500 mb-2">
                {newsItem.date} {newsItem.author && <>· {newsItem.author}</>}
                {newsItem.category && <> · {newsItem.category}</>}
              </div>
              <h1 className="text-4xl font-bold mb-4 text-green-900 leading-tight">{newsItem.title}</h1>
              {newsItem.imageUrl && (
                <img
                  src={newsItem.imageUrl}
                  alt={newsItem.title}
                  className="w-full h-80 object-cover rounded-xl mb-6"
                />
              )}
              <div className="prose max-w-none text-gray-800 mb-6">
                {newsItem.content
                  ? newsItem.content.split('\n').map((p, i) =>
                      p.trim().startsWith('"') ? (
                        <blockquote key={i} className="border-l-4 border-green-600 pl-4 italic text-lg text-green-800 my-4">
                          {p.replace(/^"|"$/g, '')}
                        </blockquote>
                      ) : p.trim().startsWith('The Allure') ? (
                        <h2 key={i} className="text-2xl font-bold mt-6 mb-2 text-green-800">{p}</h2>
                      ) : (
                        <p key={i} className="mb-3">{p}</p>
                      )
                    )
                  : newsItem.summary}
              </div>
              {newsItem.externalLink && (
                <a
                  href={newsItem.externalLink}
                  className="text-green-700 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read more
                </a>
              )}
            </div>
            {/* Recent Posts */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4 text-green-900">Recent Posts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map(post => (
                  <Link
                    to={`/news/${post.id}`}
                    key={post.id}
                    className="bg-white rounded-xl shadow p-4 flex flex-col border border-green-100 hover:shadow-lg transition"
                  >
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-40 object-cover rounded mb-3"
                      />
                    )}
                    <div className="text-green-700 text-xs mb-1">{post.date}</div>
                    <h3 className="text-lg font-bold mb-1 text-green-900">{post.title}</h3>
                    <p className="text-gray-700 text-sm mb-2 line-clamp-3">{post.summary}</p>
                    <Link
                      to={`/news/${someDocId}/${post.id}`}
                      className="text-green-700 font-semibold hover:underline text-sm"
                    >
                      Read More
                    </Link>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      
    </div>
  );
}

export default NewsDetail;

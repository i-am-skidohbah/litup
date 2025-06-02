import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { firebaseApp } from '../FirebaseConfig';

function ContactSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const q = query(collection(db, 'lightup', 'otherDocId', 'contact'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        setSubmissions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  if (loading) return <div className="p-8">Loading submissions...</div>;
  if (submissions.length === 0) return <div className="p-8">No contact submissions found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Contact Submissions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">First Name</th>
              <th className="py-2 px-4 border-b">Last Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Message</th>
              <th className="py-2 px-4 border-b">Agreed</th>
              <th className="py-2 px-4 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id}>
                <td className="py-2 px-4 border-b">{s.firstName}</td>
                <td className="py-2 px-4 border-b">{s.lastName}</td>
                <td className="py-2 px-4 border-b">{s.email}</td>
                <td className="py-2 px-4 border-b">{s.message}</td>
                <td className="py-2 px-4 border-b">{s.agree ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4 border-b">
                  {s.createdAt?.toDate
                    ? s.createdAt.toDate().toLocaleString()
                    : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ContactSubmissions;
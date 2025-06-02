import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebaseApp } from '../FirebaseConfig';
import Navbar from './Navbar';
import Footer from './Footer';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const docRef = doc(db, 'lightup', 'someDocId', 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        } else {
          setProject(null);
        }
      } catch (error) {
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-grow p-8 max-w-3xl mx-auto">
        {loading ? (
          <div>Loading...</div>
        ) : !project ? (
          <div>Project not found.</div>
        ) : (
          <div className="bg-white rounded shadow p-6">
            {project.imageUrl && (
              <img src={project.imageUrl} alt={project.title} className="w-full h-64 object-cover rounded mb-6" />
            )}
            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
            <p className="mb-4 text-lg">{project.description}</p>
            {project.link && (
              <a href={project.link} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">External Link</a>
            )}
          </div>
        )}
      </main>
      
    </div>
  );
}

export default ProjectDetail;

import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../../FirebaseConfig';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const querySnapshot = await getDocs(collection(db, 'lightup', 'someDocId', 'projects'));
        const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="p-8">Loading projects...</div>;

  return (
    <>
      
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Our Projects</h1>
        {projects.length === 0 ? (
          <div>No projects found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(project => (
              <div key={project.id} className="bg-white rounded shadow p-6">
                {project.imageUrl && (
                  <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover rounded mb-4" />
                )}
                <h2 className="text-xl font-bold mb-2">{project.title}</h2>
                <p className="mb-2">{project.description}</p>
                {project.link && (
                  <a href={project.link} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Learn More</a>
                )}
                <a href={`/projects/${project.id}`} className="block mt-2 text-green-600 hover:underline">Read More</a>
              </div>
            ))}
          </div>
        )}
        
      </div>
      
    </>
  );
}

export default Projects;

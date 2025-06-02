import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firebaseApp } from '../../FirebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', imageUrl: '', link: '' });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const db = getFirestore(firebaseApp);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'lightup', 'someDocId', 'projects'));
      const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [db]);

  const handleAddProject = async () => {
    setErrorMsg('');
    if (!newProject.title || !newProject.description) return;
    try {
      await addDoc(collection(db, 'lightup', 'someDocId', 'projects'), newProject);
      setNewProject({ title: '', description: '', imageUrl: '', link: '' });
      fetchProjects(); // Refetch from Firestore after add
    } catch (error) {
      setErrorMsg('Error adding project: ' + (error.message || error));
      console.error('Error adding project:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await deleteDoc(doc(db, 'lightup', 'someDocId', 'projects', id));
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `lightup/projects/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setNewProject({ ...newProject, imageUrl: url });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Projects</h2>
      {/* Add New Project */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Add New Project</h3>
        {errorMsg && <div className="text-red-500 mb-2">{errorMsg}</div>}
        <input
          type="text"
          placeholder="Title"
          value={newProject.title}
          onChange={e => setNewProject({ ...newProject, title: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <textarea
          placeholder="Description"
          value={newProject.description}
          onChange={e => setNewProject({ ...newProject, description: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border p-2 mb-2 w-full"
        />
        {/* <input
          type="text"
          placeholder="Image URL (optional)"
          value={newProject.imageUrl}
          onChange={e => setNewProject({ ...newProject, imageUrl: e.target.value })}
          className="border p-2 mb-2 w-full"
        /> */}
        <input
          type="text"
          placeholder="External Link (optional)"
          value={newProject.link}
          onChange={e => setNewProject({ ...newProject, link: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={handleAddProject}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Project
        </button>
      </div>
      {/* List of Projects */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Existing Projects</h3>
        {loading ? (
          <div>Loading...</div>
        ) : projects.length === 0 ? (
          <div>No projects found.</div>
        ) : (
          <ul>
            {projects.map(project => (
              <li key={project.id} className="border p-4 mb-4 rounded shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold">{project.title}</h4>
                    <p>{project.description}</p>
                    {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="w-32 h-20 object-cover mt-2 rounded" />}
                    {project.link && <a href={project.link} className="text-blue-500 hover:underline ml-2" target="_blank" rel="noopener noreferrer">View</a>}
                  </div>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProjectsAdmin;

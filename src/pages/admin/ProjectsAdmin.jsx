import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { firebaseApp } from '../../FirebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', imageUrl: '', link: '' });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('Item One');
  const [editProjectId, setEditProjectId] = useState(null);
  const [editProjectData, setEditProjectData] = useState({ title: '', description: '', imageUrl: '', link: '' });

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

  const handleEditProject = (project) => {
    setEditProjectId(project.id);
    setEditProjectData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl || '',
      link: project.link || ''
    });
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!editProjectId) return;
    try {
      await updateDoc(
        doc(db, 'lightup', 'someDocId', 'projects', editProjectId),
        editProjectData
      );
      setEditProjectId(null);
      setEditProjectData({ title: '', description: '', imageUrl: '', link: '' });
      fetchProjects();
    } catch (error) {
      setErrorMsg('Error updating project: ' + (error.message || error));
      console.error('Error updating project:', error);
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
      <div className="w-full momo h-full">
        <div className="flex border-b border-gray-700">
          <button
            className={`flex-1 py-2 ${activeTab === 'Item One' ? 'border-b-2 border-green-500' : ''}`}
            onClick={() => setActiveTab('Item One')}
          >
            Projects
          </button>
          <button
            className={`flex-1 py-2 ${activeTab === 'Item Two' ? 'border-b-2 border-green-500' : ''}`}
            onClick={() => setActiveTab('Item Two')}
          >
            Add Projects
          </button>
          <button
            className={`flex-1 py-2 ${activeTab === 'Item Three' ? 'border-b-2 border-green-500' : ''}`}
            onClick={() => setActiveTab('Item Three')}
          >
            ITEM THREE
          </button>
        </div>
        <div className="p-4 ">
          {activeTab === 'Item One' && (
            <div>
                <h3 className="text-lg font-semibold mb-2">Existing Projects</h3>
                {loading ? (
                  <div>Loading...</div>
                ) : projects.length === 0 ? (
                  <div>No projects found.</div>
                ) : (
                  <ul className='pp'>
                    {projects.map(project => (
                      <li key={project.id} className="border border-green-500 p-4 mb-4 rounded shadow flex items-start gap-4 bg-white">
                        {project.imageUrl && (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-28 h-18 object-cover rounded mr-4 flex-shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-1">{project.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {project.description}
                          </p>
                          {project.link && (
                            <a
                              href={project.link}
                              className="text-blue-500 hover:underline text-sm mr-2"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="koko bg-red-500 text-white px-3 py-1 rounded flex items-center justify-center"
                            title="Delete"
                          >
                            {/* Trash icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEditProject(project)}
                            className="koko bg-blue-500 text-white px-3 py-1 rounded flex items-center justify-center"
                            title="Edit"
                          >
                            {/* Pencil/edit icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 7.232l1.536 1.536M9 13l6-6 3 3-6 6H9v-3z" />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {/* Edit Project Modal/Form */}
                {editProjectId && (
                  <div className="fixed inset-0 bg-green-500/50 flex items-center justify-center z-50">
                    <form
                      className="bg-white p-8 rounded shadow max-w-xl w-full"
                      onSubmit={handleUpdateProject}
                    >
                      <h2 className="text-xl font-bold mb-4">Edit Project</h2>
                      <div className="mb-4">
                        <label className="block font-semibold mb-1">Title</label>
                        <input
                          type="text"
                          value={editProjectData.title}
                          onChange={e => setEditProjectData({ ...editProjectData, title: e.target.value })}
                          className="border p-2 w-full rounded"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block font-semibold mb-1">Description</label>
                        <textarea
                          value={editProjectData.description}
                          onChange={e => setEditProjectData({ ...editProjectData, description: e.target.value })}
                          className="border p-2 w-full rounded"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block font-semibold mb-1">Image URL</label>
                        <input
                          type="text"
                          value={editProjectData.imageUrl}
                          onChange={e => setEditProjectData({ ...editProjectData, imageUrl: e.target.value })}
                          className="border p-2 w-full rounded"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block font-semibold mb-1">External Link (optional)</label>
                        <input
                          type="text"
                          value={editProjectData.link}
                          onChange={e => setEditProjectData({ ...editProjectData, link: e.target.value })}
                          className="border p-2 w-full rounded"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="bg-gray-400 text-white px-6 py-2 rounded font-semibold"
                          onClick={() => setEditProjectId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            
          )}
          {activeTab === 'Item Two' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Add Project Form</h2>
              <p className="mb-6 text-gray-700">Please fill out this form to add a new project.</p>
              <form
                className="bg-white p-8 rounded shadow max-w-xl mx-auto"
                onSubmit={e => {
                  e.preventDefault();
                  handleAddProject();
                }}
              >
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="Enter project title"
                    value={newProject.title}
                    onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                    className="border p-2 w-full rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Description</label>
                  <textarea
                    placeholder="Enter project description"
                    value={newProject.description}
                    onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                    className="border p-2 w-full rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="border p-2 w-full rounded"
                  />
                  {newProject.imageUrl && (
                    <img src={newProject.imageUrl} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded" />
                  )}
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">External Link (optional)</label>
                  <input
                    type="text"
                    placeholder="Enter external link"
                    value={newProject.link}
                    onChange={e => setNewProject({ ...newProject, link: e.target.value })}
                    className="border p-2 w-full rounded"
                  />
                </div>
                {errorMsg && <div className="text-red-500 mb-2">{errorMsg}</div>}
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded font-semibold mt-2 w-full"
                >
                  Add Project
                </button>
              </form>
            </div>
          )}
          {activeTab === 'Item Three' && (
            <div>Item Three Content</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectsAdmin;











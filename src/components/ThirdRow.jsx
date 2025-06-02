import React, { useEffect, useState, useRef } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../FirebaseConfig';

function ThirdRow() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const querySnapshot = await getDocs(collection(db, 'lightup', 'someDocId', 'projects'));
        const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projectsData.slice(0, 5)); // Show up to 5 for FAQ/slideshow
      } catch (error) {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Slideshow logic
  useEffect(() => {
    if (projects.length > 0) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % projects.length);
      }, 3500);
      return () => clearInterval(intervalRef.current);
    }
  }, [projects]);

  // FAQ expand/collapse
  const [openIndex, setOpenIndex] = useState(null);
  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  if (loading) {
    return <div className="mt-8">Loading...</div>;
  }

  return (
    <div className="w-full flex  flex-col md:flex-row items-center justify-between bg-white py-12 px-4 md:px-16">
      {/* Left: FAQ Section */}
      <div className="flex-1 max-w-2xl">
        <div className="text-4xl text-green-500 font-bold mb-2">Real stories of brighter, greener living.</div>
        <h2 className="text-4xl font-semibold mb-6">Our testimonies speak for us!</h2>
        
        <div className="mt-4 text-gray-500 text-sm">
          Five years.
Five years of unwavering commitment. Five years of bold strides and groundbreaking innovations. 
Five years of transforming dreams into reality across the heartbeat of Nigeria. And today, we stand before you—not just as a company, but as a testament to the boundless possibilities that arise when vision meets relentless execution.
From the bustling streets of Lagos to the oil-rich terrains of Rivers State. 
From the industrious landscapes of Kano to the fertile fields of Benue. Every project has been more than steel, cement, and numbers—it has been a promise kept, a future shaped, and a legacy built.

        </div>
      </div>
      {/* Right: Slideshow Section */}
      <div className="flex-1 flex flex-col items-center justify-center mt-10 md:mt-0 md:ml-12">
        <div className=" w-full max-w-md   flex flex-col items-center justify-center  relative min-h-[450px]">
          {projects.length > 0 && (
            <img
              src={projects[activeIndex].imageUrl}
              alt={projects[activeIndex].title}
              className=" w-full h-[350px] object-cover mb-4 transition-all duration-500"
              style={{ background: '#e5f6fd' }}
            />
          )}
          <div className="absolute bottom-15 left-1/2 -translate-x-8 md:   flex gap-2 z-20">
            {projects.map((_, idx) => (
              <span
                key={idx}
                className={`w-1 h-1 rounded-full ${activeIndex === idx ? 'bg-green-400' : 'bg-blue-200'}`}
              />
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default ThirdRow;



{/* <div className="bg-white rounded-lg">
          {projects.slice(0, 5).map((project, idx) => (
            <div key={project.id || idx} className="border-b last:border-b-0">
              <button
                className="flex items-center justify-between w-full py-3 text-left focus:outline-none group"
                onClick={() => handleToggle(idx)}
              >
                <span className="font-bold text-lg md:text-xl mr-2">{String(idx + 1).padStart(2, '0')}.</span>
                <span className="flex-1 font-semibold text-base md:text-lg text-black text-left">{project.title}</span>
                <svg
                  className={`w-5 h-5 ml-2 transition-transform ${openIndex === idx ? 'rotate-180 text-red-500' : 'text-black'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === idx && (
                <div className="pl-10 pb-3 pr-2 text-gray-700 text-base animate-fade-in">
                  {project.description}
                </div>
              )}
            </div>
          ))}
        </div> */}
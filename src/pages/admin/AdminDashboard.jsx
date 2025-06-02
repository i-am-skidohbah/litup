import React, { useState } from 'react';
import SlideshowManager from './SlideshowManager';
import ProjectsAdmin from './ProjectsAdmin';
import SpecialOfferAdmin from './SpecialOfferAdmin';
import ProductsAdmin from './ProductsAdmin';
import NewsAdmin from './NewsAdmin';
import PartnersAdmin from './PartnersAdmin';

// Grouped navigation items
const navGroups = [
  {
    label: 'Main',
    items: [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'projects', label: 'Projects' },
      { key: 'products', label: 'Products' },
      { key: 'news', label: 'News' },
      { key: 'team', label: 'Team' },
    ],
  },
  {
    label: 'Management',
    items: [
      { key: 'slideshow', label: 'Slideshow Manager' },
      { key: 'specialoffer', label: 'Special Offer' },
      { key: 'partners', label: 'Partners' },
    ],
  },
  {
    label: 'Utilities',
    items: [
      { key: 'calendar', label: 'Calendar' },
      { key: 'documents', label: 'Documents' },
      { key: 'reports', label: 'Reports' },
      { key: 'settings', label: 'Settings' },
    ],
  },
];

function AdminDashboard () {
  const [mainView, setMainView] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {navGroups.map(group => (
            <div key={group.label} className="mb-2">
              <h2 className="text-sm uppercase text-gray-400 px-4 pt-4 pb-2">{group.label}</h2>
              <ul>
                {group.items.map(item => (
                  <li
                    key={item.key}
                    className={`p-4 hover:bg-gray-700 cursor-pointer ${mainView === item.key ? 'bg-gray-800 font-bold' : ''}`}
                    onClick={() => setMainView(item.key)}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {mainView === 'dashboard' && <div className="border-dashed border-2 border-gray-300 h-full">Dashboard Content</div>}
        {mainView === 'team' && <div>Team Content</div>}
        {mainView === 'projects' && <ProjectsAdmin />}
        {mainView === 'calendar' && <div>Calendar Content</div>}
        {mainView === 'documents' && <div>Documents Content</div>}
        {mainView === 'reports' && <div>Reports Content</div>}
        {mainView === 'slideshow' && <SlideshowManager />}
        {mainView === 'specialoffer' && <SpecialOfferAdmin />}
        {mainView === 'products' && <ProductsAdmin />}
        {mainView === 'news' && <NewsAdmin />}
        {mainView === 'partners' && <PartnersAdmin />}
        {mainView === 'settings' && <div>Settings Content</div>}
      </main>
    </div>
  );
}

export default AdminDashboard;
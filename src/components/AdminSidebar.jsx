import React from 'react';

const AdminSidebar = () => (
  <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen">
    <div className="p-4 text-xl font-bold border-b border-gray-800">Admin Panel</div>
    <nav className="flex-1">
      <ul>
        <li className="p-4 hover:bg-gray-800 cursor-pointer"><a href="/admin">Dashboard</a></li>
        <li className="p-4 hover:bg-gray-800 cursor-pointer"><a href="/admin/projects">Projects</a></li>
        <li className="p-4 hover:bg-gray-800 cursor-pointer"><a href="/admin/slideshow-manager">Slideshow Manager</a></li>
        {/* Add more links as needed */}
      </ul>
    </nav>
  </aside>
);

export default AdminSidebar;
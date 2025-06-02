import React from 'react';

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-100 flex flex-col">
    <main className="flex-1 flex flex-col  justify-center p-6">
      {children}
    </main>
    {/* Optionally, add an admin footer here */}
  </div>
);

export default AdminLayout;
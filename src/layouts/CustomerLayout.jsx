import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrums from '../components/Breadcrums';

const CustomerLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-green-50">
    <Navbar />
    <Breadcrums />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default CustomerLayout;
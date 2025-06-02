import React from 'react';
import AdminRoutes from './routes/AdminRoutes';
import CustomerRoutes from './routes/CustomerRoutes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/customer/Homepage';
import AdminDashboard from './pages/admin/AdminDashboard';
import SlideshowManager from './pages/admin/SlideshowManager';
import Login from './pages/admin/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import Projects from './pages/customer/Projects';
import ProjectDetail from './components/ProjectDetail';
import Products from './pages/customer/Products';
import ProductDetail from './components/ProductDetail';
import News from './pages/customer/News';
import SlideshowDetail from './components/SlideshowDetail';
import ContactSubmissions from './components/ContactSubmissions';
import ContactPage from './pages/customer/ContactPage';
import CustomerLogin from './pages/customer/CustomerLogin';
import CustomerSignup from './pages/customer/CustomerSignup';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import TrainingRegister from './pages/customer/TrainingRegister';
import MyProfile from './pages/customer/MyProfile';

function App() {
  return (
    <Router>
       {/* This ensures Navbar is always visible */}
      <Routes>
        
      {/* Customer section */}
        <Route path="/*" element={<CustomerRoutes />} />
        {/* Admin section */}
        <Route path="/admin/*" element={<AdminRoutes />} />




        
      </Routes>
    </Router>
  );
}

export default App;
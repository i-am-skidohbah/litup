import { Routes, Route } from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout';
import Homepage from '../pages/customer/Homepage';
import Projects from '../pages/customer/Projects';
import ProjectDetail from '../components/ProjectDetail';   
import Products from '../pages/customer/Products';
import ProductDetail from '../components/ProductDetail';
import News from '../pages/customer/News';
import SlideshowDetail from '../components/SlideshowDetail';
import ContactSubmissions from '../components/ContactSubmissions';
import ContactPage from '../pages/customer/ContactPage';
import CustomerLogin from '../pages/customer/CustomerLogin';
import CustomerSignup from '../pages/customer/CustomerSignup';
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import Cart from '../components/Cart';
import TrainingRegister from '../pages/customer/TrainingRegister';
import MyProfile from '../pages/customer/MyProfile';
import NewsDetail from '../components/NewsDetail';
import MyOrders from '../pages/customer/MyOrders';


// ...other customer imports

export default function CustomerRoutes() {
  return (
    <CustomerLayout>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* ...other customer routes */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/news" element={<News />} />
        <Route path="/slideshow/:id" element={<SlideshowDetail />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/training" element={<TrainingRegister />} />
        <Route path="/contact-submissions" element={<ContactSubmissions />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/signup" element={<CustomerSignup />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/news/:someDocId/:id" element={<NewsDetail />} />
        <Route path="/orders" element={<MyOrders />} />

      </Routes>
    </CustomerLayout>
  );
}
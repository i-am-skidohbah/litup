import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-8 pb-4 px-4 mt-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        {/* Company Info */}
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h2 className="text-xl font-bold mb-2">Lightup Nigeria Solar Power Ltd.</h2>
          <p className="text-gray-400 text-sm mb-2">Empowering Nigeria with clean, reliable solar energy.</p>
          <p className="text-gray-400 text-xs">&copy; {new Date().getFullYear()} Lightup Nigeria Solar Power Ltd. All rights reserved.</p>
        </div>
        {/* Quick Links */}
        <div className="mb-6 md:mb-0">
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/" className="hover:underline text-gray-300">Home</a></li>
            <li><a href="/projects" className="hover:underline text-gray-300">Projects</a></li>
            <li><a href="/products" className="hover:underline text-gray-300">Products</a></li>
            <li><a href="/news" className="hover:underline text-gray-300">News</a></li>
            <li><a href="/admin" className="hover:underline text-gray-300">Admin</a></li>
          </ul>
        </div>
        {/* Contact & Social */}
        <div className="text-center md:text-right">
          <h3 className="font-semibold mb-2">Contact Us</h3>
          <p className="text-gray-400 text-sm mb-1">info@lightupnigeria.ng</p>
          <p className="text-gray-400 text-sm mb-3">Office Line: +234 8071690144 <br/>
WhatsApp: +234 8033058892</p>
          <div className="flex justify-center md:justify-end gap-4 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../firebaseConfig'; // Adjust the path to your Firebase config file

function Firstrow() {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between bg-[#fafbfc] py-8 px-2 md:px-16 relative overflow-hidden">
      {/* Left: Card Content */}
      <div className="flex-1 max-w-2xl bg-white rounded-2xl shadow-lg p-8 md:p-12 z-10 relative">
        <div className="flex items-center gap-2 text-red-500 text-sm font-semibold mb-2">
          <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2.08a2 2 0 0 1 1.1-1.79l8-4.6a2 2 0 0 1 1.8 0l8 4.6a2 2 0 0 1 1.1 1.79z" /></svg>
          <span>+1 235 456 7890</span>
        </div>
        <h1 className="text-3xl md:text-2xl font-bold mb-4 text-black leading-tight">Welcome to Our World of Solar Power Excellence!</h1>
        <p className="text-gray-700 mb-6 text-base md:text-lg">Lightup Nigeria Solar Power Ltd was incorporated in August 2020 with the Corporate Affairs Commission under the Company and Allied Masters Act Laws of the Federation of Nigeria with RC No: 1700859.

          We offer innovative, affordable, and sustainable solar energy solutions to power homes and businesses across Nigeria, reducing energy costs and promoting environmental responsibility with the use of lithium phosphate technology</p>
        <div className="flex items-center gap-4 mb-6">
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 text-base shadow">
            CONTACT US <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2.08a2 2 0 0 1 1.1-1.79l8-4.6a2 2 0 0 1 1.8 0l8 4.6a2 2 0 0 1 1.1 1.79z" /></svg>
          </button>
          <button className="w-12 h-12 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 text-2xl bg-white hover:bg-red-50 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-6.518-3.759A1 1 0 0 0 7 8.118v7.764a1 1 0 0 0 1.234.97l6.518-1.757A1 1 0 0 0 15 14.882V9.118a1 1 0 0 0-1.234-.97z" /></svg>
          </button>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="user1" className="w-10 h-10 rounded-full border-2 border-white -ml-2 first:ml-0" />
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="user2" className="w-10 h-10 rounded-full border-2 border-white -ml-2" />
          <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="user3" className="w-10 h-10 rounded-full border-2 border-white -ml-2" />
          <span className="ml-2 text-gray-700 text-base">Join with <span className="font-bold">4600+</span> Customers and<br />start your fitness journey.</span>
        </div>
      </div>
      {/* Right: Image Section */}
      <div className="flex-1 flex items-center justify-center relative h-full mt-8 md:mt-0 md:ml-8">
        <img src="/assets/panel.jpg" alt="call center" className="rounded-2xl object-cover w-full h-[420px] md:w-[520px] md:h-[520px] shadow-lg" />
        {/* Animated sound bar overlay */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1 z-20">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`w-2 md:w-3 rounded bg-yellow-300 animate-pulse`} style={{ height: `${16 + (i % 4) * 8}px`, animationDelay: `${i * 0.1}s` }}></div>
          ))}
        </div>
      </div>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 z-0 opacity-10 bg-repeat" style={{ backgroundImage: "url('/assets/pattern.svg')" }}></div>
    </div>
  );
}

export default Firstrow;

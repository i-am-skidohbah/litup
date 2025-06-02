import React from 'react';
import Navbar from '../../components/Navbar';
import Firstrow from '../../components/Firstrow';
import Slideshow from '../../components/Slideshow'; // Adjust the path as needed
import Footer from '../../components/Footer';
import ThirdRow from '../../components/ThirdRow';
import SpecialOfferRow from '../../components/SpecialOfferRow';
import ProductsRow from '../../components/ProductsRow'; // Import the new ProductsRow component
import NewsRow from '../../components/NewsRow'; // Import NewsRow for displaying news cards
import NewsletterRow from '../../components/NewsletterRow'; // Import the newsletter row
import PartnersRow from '../../components/PartnersRow'; // Import PartnersRow for company logos
import Contact from '../../components/Contact'; // Import the Contact component

function Homepage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
     
       
     

      

      {/* Main Content */}
      <main className="flex-grow p-4">
        {/* Firstrow (Hero Section) */}
      <Firstrow />
      
        {/* Slideshow in a Card */}
        
          <Slideshow />
        

        {/* Third Row: Three Cards */}
        <ThirdRow />

        {/* Fourth Row: Special Offer 
        <SpecialOfferRow /> */}

        <Contact />

        {/* Fifth Row: Products */}
        <ProductsRow /> {/* Add the ProductsRow component here */}

        {/* Sixth Row: News */}
        <NewsRow /> {/* Add NewsRow component for news cards */}

        {/* Partners Row: Company Partners Logos */}
        <PartnersRow />
      </main>

      {/* Newsletter Row: Subscribe to our newsletter */}
      <NewsletterRow />

      {/* Contact Section */}
      

      {/* Footer */}
     
    </div>
  );
}

export default Homepage;







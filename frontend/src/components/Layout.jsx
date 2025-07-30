import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <Navbar 
        onMenuToggle={toggleMobileMenu} 
        isMobileMenuOpen={isMobileMenuOpen} 
      />
      
      <div className="flex pt-14">
        {/* Desktop Sidebar - Fixed */}
        <div className="hidden lg:block fixed left-0 top-14 h-full z-30">
          <Sidebar onItemClick={closeMobileMenu} />
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={closeMobileMenu}
            />
            <div className="absolute left-0 top-14 h-full z-50">
              <Sidebar onItemClick={closeMobileMenu} />
            </div>
          </div>
        )}
        
        {/* Main Content Area */}
        <div className="flex-1 lg:ml-56">
          <main className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
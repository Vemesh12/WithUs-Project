import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-black shadow-lg">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-20 items-center">
      {/* Left side: Logo */}
      <Link to="/" className="flex-shrink-0 flex items-center">
        <div className="relative">
          <div className="absolute inset-0 bg-[#FFC107] opacity-20 rounded-lg transform -skew-x-12"></div>
          <h1 className="relative text-2xl font-bold text-[#e9ff09] px-4 py-1">With Us</h1>
        </div>
      </Link>

      {/* Middle: Navigation links */}
      <div className="hidden md:flex md:space-x-8">
        <Link to="/" className="text-white px-3 py-2 rounded-md text-base font-medium">
          Home
        </Link>
        <Link to="/items" className="text-white px-3 py-2 rounded-md text-base font-medium">
          Items
        </Link>
        <button onClick={() => handleScroll("why-withus")} className="text-white px-3 py-2 rounded-md text-base font-medium">
          Why WithUs
        </button>
        <Link to="/items" className="text-white px-3 py-2 rounded-md text-base font-medium">
          Services
        </Link>
        {user && user.role !== 'admin' && (
          <Link to="/my-orders" className="text-white px-3 py-2 rounded-md text-base font-medium">
            My Orders
          </Link>
        )}
        {user && user.role === 'admin' && (
          <Link to="/admin-orders" className="text-white px-3 py-2 rounded-md text-base font-medium">
            Admin Orders
          </Link>
        )}
      </div>

      {/* Right side: User actions */}
      <div className="flex items-center md:space-x-4">
        {user ? (
          <>
            <span className="text-white text-sm">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="btn-secondary text-base">
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="hidden md:block btn-primary px-3 py-2 rounded-md font-medium text-base font-medium"
          >
            Login Now
          </Link>
        )}

        {/* Hamburger menu for mobile */}
        <div className="flex md:hidden ml-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-600 text-base font-medium"
            aria-controls="mobile-menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* Mobile menu */}
  {mobileMenuOpen && (
    <div className="md:hidden" id="mobile-menu">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black shadow">
        <Link to="/" onClick={handleLinkClick} className="block text-white px-3 py-2 rounded-md text-base font-medium">
          Home
        </Link>
        <Link to="/items" onClick={handleLinkClick} className="block text-white px-3 py-2 rounded-md text-base font-medium">
          Items
        </Link>
        {user && user.role !== 'admin' && (
          <Link to="/my-orders" onClick={handleLinkClick} className="block text-white px-3 py-2 rounded-md text-base font-medium">
            My Orders
          </Link>
        )}
        {user && user.role === 'admin' && (
          <Link to="/admin-orders" onClick={handleLinkClick} className="block text-white px-3 py-2 rounded-md text-base font-medium text-base font-medium">
            Admin Orders
          </Link>
        )}
        {user ? (
          <button
            onClick={handleLogout}
            className="block w-full text-left text-white px-3 py-2 rounded-md text-base font-medium text-base font-medium"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" onClick={handleLinkClick} className="block text-white px-3 py-2 rounded-md text-base font-medium text-base font-medium">
            Login Now
          </Link>
        )}
      </div>
    </div>
  )}
</nav>

  );
};

export default Navbar; 
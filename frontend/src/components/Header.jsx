import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, User, LogIn, LogOut, Menu, X } from 'lucide-react';
import Logo from '../assets/logo.png';

function Header({ user, handleLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-25">
          
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img src={Logo} width="100px" alt="Logo" className="mr-2" />
              </Link>
            </div>
          </div>

      
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-all"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-all"
            >
              About
            </Link>
            <Link 
              to="/faq" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-all"
            >
              FAQ
            </Link>
          </div>

      
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/upload"
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-all"
                >
                  <Upload size={18} className="mr-2" />
                  Upload
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center">
                      <User size={18} />
                    </div>
                    <span className="font-medium">{user}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-red-400"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm font-medium transition-all"
                >
                  <LogIn size={18} className="mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </div>

         
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

  
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/faq"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>

            {user ? (
              <>
                <Link
                  to="/upload"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Upload size={18} className="mr-2" />
                  Upload
                </Link>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn size={18} className="mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;
// src/components/Header.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchIcon, BellIcon } from './icons';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = 3; // In real app, get from context/state
  
  const pageTitles = {
    '/home': 'Good Morning ☀️',
    '/menu': 'Menu 📋',
    '/cart': 'Your Cart 🛒',
    '/profile': 'My Profile 👤'
  };
  
  const pageSubtitles = {
    '/home': 'What would you like to drink today?',
    '/menu': 'Discover our delicious drinks',
    '/cart': `${cartCount} items • Ready to checkout`,
    '/profile': 'Manage your account & preferences'
  };

  const title = pageTitles[location.pathname] || 'Caffinity';
  const subtitle = pageSubtitles[location.pathname] || 'Your coffee paradise';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="section-padding py-4">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">C</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              Caffinity
            </h1>
          </Link>

          {/* Search Bar (on menu page) */}
          {location.pathname === '/menu' && (
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search drinks, pastries..."
                  className="input-primary input-with-icon"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <SearchIcon />
                </div>
              </div>
            </div>
          )}

          {/* Action Icons */}
          <div className="flex items-center gap-3">
          

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <div className="relative">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" 
                        stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" 
                        stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" 
                        stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {cartCount > 0 && (
                  <span className="badge-primary absolute -top-1 -right-1">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

               {/* Profile - Changed to icon */}
            <Link to="/profile" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <div className="relative">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" 
                  xmlns="http://www.w3.org/2000/svg"stroke="#92400E" strokeWidth="2"
                >
                  <path 
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" 
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                  <path 
                    d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" 
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* Search Bar (on home page) */}
        {location.pathname === '/home' && (
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search coffee, tea, pastries..."
                className="input-primary input-with-icon"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <SearchIcon />
              </div>
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-amber-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
                Search
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;